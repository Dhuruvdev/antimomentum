import { db } from "./db";
import { jobs, steps, type Job, type InsertJob, type Step, type InsertStep, type JobResponse } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  createJob(job: InsertJob): Promise<Job>;
  getJob(id: number): Promise<JobResponse | undefined>;
  updateJobStatus(id: number, status: Job["status"]): Promise<void>;
  createStep(step: InsertStep): Promise<Step>;
  updateStepStatus(id: number, status: Step["status"], output?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async getJob(id: number): Promise<JobResponse | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    if (!job) return undefined;
    const jobSteps = await db.select().from(steps).where(eq(steps.jobId, id)).orderBy(asc(steps.order));
    return { ...job, steps: jobSteps };
  }

  async updateJobStatus(id: number, status: Job["status"]): Promise<void> {
    await db.update(jobs).set({ status }).where(eq(jobs.id, id));
  }

  async createStep(insertStep: InsertStep): Promise<Step> {
    const [step] = await db.insert(steps).values(insertStep).returning();
    return step;
  }

  async updateStepStatus(id: number, status: Step["status"], output?: string): Promise<void> {
    await db.update(steps).set({ status, output }).where(eq(steps.id, id));
  }
}

export const storage = new DatabaseStorage();
