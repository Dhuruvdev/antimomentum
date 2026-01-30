# Antimomentum Beta IDE

## Overview

Antimomentum is a universal workspace backend and frontend for reading, writing, research, compiling, and AI assistance. The application provides an IDE-like experience with autonomous AI agents that can plan and execute multi-step tasks, isolated workspace execution via Docker containers, and real-time collaboration features.

The system is designed around a job/step execution model where users submit prompts, and an AI agent breaks them into discrete steps with specific tools, executes each step, and produces deliverables.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project uses a unified monorepo with three main directories:
- `client/` - React frontend with Vite
- `server/` - Express backend with TypeScript
- `shared/` - Shared types, schemas, and route definitions

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (dark mode default)
- **Animations**: Framer Motion for UI transitions

### Backend Architecture
- **Primary Server**: Express.js handling API routes
- **Alternative Server**: Fastify setup exists in `src/server.ts` with modular route structure
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Real-time**: Socket.io for workspace collaboration
- **Authentication**: JWT-based auth with bcrypt password hashing

### Data Layer
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle.config.ts`)
- **Core Tables**:
  - `jobs` - Tracks prompt execution with status (pending, planning, executing, completed, failed)
  - `steps` - Individual execution steps within jobs with tool assignments

### API Design
- **Route Definitions**: Centralized in `shared/routes.ts` with Zod validation
- **Pattern**: REST endpoints with typed request/response schemas
- **Documentation**: Swagger/OpenAPI available at `/docs` endpoint

### Job Execution Model
The agent system follows a tool-first architecture:
1. User submits a prompt which creates a job
2. Agent plans steps with assigned tools (web_search, analyze_csv, finalize_project, etc.)
3. Each step executes sequentially with status updates
4. Results are stored and the job completes

### Build System
- **Development**: `tsx` for TypeScript execution with hot reload
- **Production**: Custom build script using esbuild for server bundling and Vite for client

## External Dependencies

### AI Services
- **OpenRouter API**: Primary LLM provider for AI agent capabilities
- **Model**: Mistral 7B Instruct (configurable)

### Infrastructure
- **PostgreSQL**: Primary database (required via DATABASE_URL)
- **Docker**: Workspace isolation for code execution (Dockerode client)
- **Redis/BullMQ**: Background job queue processing

### Authentication
- **JWT**: Token-based authentication via @fastify/jwt
- **Prisma Client**: User management (separate from Drizzle, used in auth module)

### Third-Party Libraries
- **Socket.io**: Real-time bidirectional communication
- **Axios**: HTTP client for external API calls
- **Multer/@fastify/multipart**: File upload handling

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `OPENROUTER_API_KEY` - API key for AI model access