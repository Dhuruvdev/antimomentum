import { pgTable, text, serial, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  status: text("status", { enum: ["pending", "planning", "executing", "completed", "failed"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const steps = pgTable("steps", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  title: text("title").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "completed", "failed"] }).notNull().default("pending"),
  tool: text("tool"),
  output: text("output"),
  order: integer("order").notNull(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true });
export const insertStepSchema = createInsertSchema(steps).omit({ id: true });

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Step = typeof steps.$inferSelect;
export type InsertStep = z.infer<typeof insertStepSchema>;

export type JobResponse = Job & { steps: Step[] };
