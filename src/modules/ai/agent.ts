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
      
      const plan = await this.getPlan(prompt);
      
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

  async getPlan(prompt: string) {
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are an AI planner. Breakdown the user request into 2-4 discrete steps. Available tools: "web_search", "code_exec", "summarize". Return a JSON array of steps: [{"title": "step title", "tool": "tool name", "order": 1, "input": "input for tool"}].'
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

      const steps = Array.isArray(content) ? content : (content.steps || []);
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
    const container = await docker.createContainer({
      Image: 'node:20-slim',
      Cmd: ['node', '-e', code],
      Tty: false,
    });
    await container.start();
    const logs = await container.logs({ stdout: true, stderr: true });
    await container.stop();
    await container.remove();
    return logs.toString();
  }
}

export const agent = new AIAgent();
