import { FastifyInstance } from 'fastify';
import axios from 'axios';

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/api/agent/prompt', async (request) => {
    const { prompt, context } = request.body as any;
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'You are an AI assistant in the Antimomentum IDE.' },
        { role: 'user', content: `Context: ${context}\n\nPrompt: ${prompt}` }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://antimomentum.beta',
        'X-Title': 'Antimomentum Beta'
      }
    });
    return response.data.choices[0].message;
  });

  fastify.post('/api/calc', async (request) => {
    const { expr } = request.body as any;
    // Simple AI-based calculator for complex expr, or safe eval
    return { result: eval(expr) }; // Note: eval is unsafe, used here as stub
  });
}
