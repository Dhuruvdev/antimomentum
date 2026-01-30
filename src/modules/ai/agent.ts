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

  private async getPlan(prompt: string) {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are an AI planner. Breakdown the user request into 2-4 discrete steps. Available tools: "web_search", "code_exec", "summarize". Return JSON array of {title, tool, order, input}.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    }, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });

    const content = JSON.parse(response.data.choices[0].message.content);
    return content.steps || [];
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
