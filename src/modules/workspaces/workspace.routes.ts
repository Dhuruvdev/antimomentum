import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import Docker from 'dockerode';

const prisma = new PrismaClient();
const docker = new Docker();

export async function workspaceRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.get('/api/workspaces', async (request) => {
    const user = (request.user as any);
    return prisma.workspace.findMany({ where: { userId: user.id } });
  });

  fastify.post('/api/workspaces', async (request) => {
    const { name } = request.body as any;
    const user = (request.user as any);
    return prisma.workspace.create({
      data: { name, userId: user.id }
    });
  });

  fastify.post('/api/execute', async (request) => {
    const { lang, code } = request.body as any;
    // Basic Dockerode execution stub - in real setup, use a pool of containers
    // This is a simplified version for the Beta IDE
    const container = await docker.createContainer({
      Image: lang === 'python' ? 'python:3.11-slim' : 'node:20-slim',
      Cmd: lang === 'python' ? ['python', '-c', code] : ['node', '-e', code],
      Tty: false,
    });
    await container.start();
    const logs = await container.logs({ stdout: true, stderr: true });
    await container.stop();
    await container.remove();
    return { output: logs.toString() };
  });
}
