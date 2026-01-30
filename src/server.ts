import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

import { authRoutes } from './modules/auth/auth.routes';
import { workspaceRoutes } from './modules/workspaces/workspace.routes';
import { aiRoutes } from './modules/ai/ai.routes';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// Plugins
fastify.register(cors);
fastify.register(jwt, { secret: process.env.JWT_SECRET || 'supersecret' });
fastify.register(multipart);
fastify.register(swagger, {
  openapi: {
    info: { title: 'Antimomentum Beta API', version: '0.1.0' },
  }
});
fastify.register(swaggerUi, { routePrefix: '/docs' });

// Routes
fastify.register(authRoutes);
fastify.register(workspaceRoutes);
fastify.register(aiRoutes);

// Redirects
fastify.get('/~', async (request, reply) => {
  return reply.redirect('/job/10');
});

// Health Check
fastify.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await fastify.listen({ port: 5000, host: '0.0.0.0' });
    const io = new Server(fastify.server, {
      cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      socket.on('join-workspace', (workspaceId) => {
        socket.join(workspaceId);
      });
    });

    console.log('Server running on http://0.0.0.0:5000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
