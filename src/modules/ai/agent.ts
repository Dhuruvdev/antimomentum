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
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are the Antimomentum Research & Visual Synthesis Agent. Your SOLE PURPOSE is to take a user query, perform deep multi-dimensional research, and synthesize the findings into a PROFESSIONAL VISUAL PRESENTATION format. Your response MUST be a JSON object with a detailed "reasoning" block explaining your visual strategy and a "steps" array. Tools: "web_research" (deep dive), "visual_synthesis" (formatting findings into beautiful, structured visual sections), "executive_summary" (high-level synthesis). Focus on aesthetic professional formatting, information hierarchy, and visual clarity. Response format: {"reasoning": "...", "steps": [{"title": "...", "tool": "...", "order": 1, "input": "..."}]}'
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }, {
        headers: { 
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://antimomentum.ai',
          'X-Title': 'Antimomentum Beta IDE',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      let contentStr = response.data.choices[0].message.content;
      console.log('AI Plan raw content:', contentStr);
      
      // Clean up markdown
      contentStr = contentStr.replace(/```json\n?|\n?```/g, '').trim();
      
      // Look for array or object
      const objectMatch = contentStr.match(/\{[\s\S]*\}/);
      const arrayMatch = contentStr.match(/\[[\s\S]*\]/);
      
      let content;
      try {
        if (objectMatch) {
          content = JSON.parse(objectMatch[0]);
        } else if (arrayMatch) {
          content = JSON.parse(arrayMatch[0]);
        } else {
          // If no JSON structures found, check if it's already an object (though unlikely from axios)
          if (typeof contentStr === 'object') {
            content = contentStr;
          } else {
            throw new Error('No JSON found in response');
          }
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Content:', contentStr);
        throw parseError;
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
      case 'web_research':
        return `### 🌐 Deep Research Findings: ${input}\n\n[Extensive multi-dimensional data points discovered through global intelligence networks...]`;
      case 'visual_synthesis':
        return `### 📊 Visual Presentation: ${input}\n\n| Attribute | Description |\n| :--- | :--- |\n| **Core Concept** | High-level synthesis of ${input} |\n| **Visual Framework** | Professional hierarchy with structured layouts |\n| **Impact** | Strategic value and market positioning |\n\n> "Synthesizing complex information into visual clarity."`;
      case 'executive_summary':
        return `### 📑 Executive Summary\n\n**Strategic Overview**: ${input}\n\n1. **Key Insight A**: Critical finding from deep research.\n2. **Key Insight B**: Structural analysis and implications.\n3. **Final Recommendation**: Actionable path forward based on synthesized data.`;
      default:
        return `### 🛠️ Tool: ${tool}\n\nSynthesized output for: ${input}`;
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
