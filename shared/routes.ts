import { z } from "zod";
import { insertJobSchema, jobs, steps } from "./schema";

export const api = {
  jobs: {
    create: {
      method: "POST" as const,
      path: "/api/jobs",
      input: insertJobSchema,
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/jobs/:id",
      responses: {
        200: z.custom<typeof jobs.$inferSelect & { steps: (typeof steps.$inferSelect)[] }>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
