# Antimomentum Beta IDE Backend

Universal workspace backend for reading, writing, research, compiling, and AI assistance.

## Features
- **Auth**: JWT-based authentication.
- **Workspaces**: Isolated execution via Docker.
- **AI Agents**: Powered by OpenRouter.
- **Real-time**: Socket.io for collaboration.

## Setup
1. `npm install`
2. Configure `.env` based on `.env.example`.
3. `npx prisma db push`
4. `npm run dev`

## API Docs
Accessible at `/docs` when the server is running.
