import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', async (request, reply) => {
    const { email, password } = request.body as any;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: { email, password: hashedPassword }
      });
      const token = fastify.jwt.sign({ id: user.id, email: user.email });
      return { token };
    } catch (e) {
      return reply.status(400).send({ error: 'User already exists' });
    }
  });

  fastify.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as any;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return { token };
  });
}
