import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.jobs.create.path, async (req, res) => {
    const job = await storage.createJob(req.body);
    
    // Start background simulation
    simulateAgent(job.id);
    
    res.status(201).json(job);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  return httpServer;
}

async function simulateAgent(jobId: number) {
  await storage.updateJobStatus(jobId, "planning");
  await new Promise(r => setTimeout(r, 1000));

  const stepsList = [
    { title: "Analyzing Research Goal", tool: "outline_generator", order: 1 },
    { title: "Searching for Meta Corporate Data", tool: "web_search", order: 2 },
    { title: "Evaluating Financial Performance", tool: "analyze_csv", order: 3 },
    { title: "Structuring Final Document", tool: "finalize_project", order: 4 }
  ];

  for (const s of stepsList) {
    const step = await storage.createStep({ ...s, jobId, status: "pending" });
    await storage.updateStepStatus(step.id, "in_progress");
    await new Promise(r => setTimeout(r, 2000));
    await storage.updateStepStatus(step.id, "completed", `Completed ${s.title} successfully.`);
  }

  await storage.updateJobStatus(jobId, "completed");
}
