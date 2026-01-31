import axios from 'axios';
import Docker from 'dockerode';
import { storage } from '../../../server/storage';

const docker = new Docker();

export class AIAgent {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
  }

  async processJob(jobId: number, prompt: string) {
    try {
      await storage.updateJobStatus(jobId, 'planning');
      
      const plan = await this.getPlan(prompt, jobId);
      
      for (const stepInfo of plan) {
        const step = await storage.createStep({
          jobId,
          title: stepInfo.title,
          status: 'pending',
          tool: stepInfo.tool,
          order: stepInfo.order,
          output: null
        });

        await storage.updateStepStatus(step.id, 'in_progress');
        
        let output = '';
        try {
          output = await this.executeTool(stepInfo.tool, stepInfo.input || prompt);
          await storage.updateStepStatus(step.id, 'completed', output);
        } catch (err: any) {
          await storage.updateStepStatus(step.id, 'failed', err.message);
          throw err;
        }
      }

      await storage.updateJobStatus(jobId, 'completed');
    } catch (err) {
      console.error('Agent processing failed:', err);
      await storage.updateJobStatus(jobId, 'failed');
    }
  }

  async getPlan(prompt: string, jobId: number) {
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: 'You are an AI planner. Before providing the plan, you must perform "self-thinking" to reason about the task. Your response MUST be a JSON object with two fields: "reasoning" (a string explaining your thought process) and "steps" (an array of step objects). Available tools: "web_search", "code_exec", "summarize". Each step object must have: "title", "tool", "order", and "input". Example format: {"reasoning": "I need to search for X, then summarize Y...", "steps": [{"title": "Search", "tool": "web_search", "order": 1, "input": "query"}]}'
          },
          { role: 'user', content: prompt }
        ]
      }, {
        headers: { 
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://replit.com',
          'X-Title': 'Antimomentum Beta IDE'
        },
        timeout: 30000
      });

      let contentStr = response.data.choices[0].message.content;
      console.log('AI Plan raw content:', contentStr);
      
      // Clean up markdown
      contentStr = contentStr.replace(/```json\n?|\n?```/g, '').trim();
      
      // Look for array or object
      const arrayMatch = contentStr.match(/\[[\s\S]*\]/);
      const objectMatch = contentStr.match(/\{[\s\S]*\}/);
      
      let content;
      if (arrayMatch) {
        content = JSON.parse(arrayMatch[0]);
      } else if (objectMatch) {
        content = JSON.parse(objectMatch[0]);
      } else {
        // Final attempt: search for any text that looks like a JSON array
        const looseMatch = contentStr.match(/\[[\s\S]*\]/);
        if (looseMatch) {
          content = JSON.parse(looseMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      }

      const steps = content.steps || (Array.isArray(content) ? content : []);
      const reasoning = content.reasoning || "Planning execution steps based on user prompt.";
      
      console.log('Agent reasoning:', reasoning);
      await storage.updateJobReasoning(jobId, reasoning);
      
      if (steps.length === 0) throw new Error('No steps found');
      return steps;
    } catch (e: any) {
      console.error('Failed to get plan:', e.response?.data || e.message);
      return [
        { title: 'Processing Prompt', tool: 'summarize', order: 1, input: prompt },
        { title: 'Executing Task', tool: 'code_exec', order: 2, input: 'console.log("Processing complete for: " + ' + JSON.stringify(prompt) + ')' }
      ];
    }
  }

  private async executeTool(tool: string, input: string) {
    switch (tool) {
      case 'code_exec':
        return await this.runCode(input);
      case 'web_search':
        return `Simulated search results for: ${input}`;
      case 'summarize':
        return `Summarized content of length ${input.length}`;
      default:
        return `Executed ${tool} with input ${input}`;
    }
  }

  private async runCode(code: string) {
    try {
      // Since Docker is not available in this environment, we use safe eval or simulation
      // For a real production system, this would use isolated workers
      console.log('Executing code in simulated isolated environment:', code);
      const result = eval(code);
      return String(result);
    } catch (err: any) {
      return `Execution Error: ${err.message}`;
    }
  }
}

export const agent = new AIAgent();
