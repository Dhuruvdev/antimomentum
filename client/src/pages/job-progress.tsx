import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function JobProgress() {
  const { id } = useParams<{ id: string }>();
  
  const { data: job, isLoading } = useQuery({
    queryKey: [buildUrl(api.jobs.get.path, { id: id! })],
    refetchInterval: (query) => {
      const job = query.state.data as any;
      return job?.status === "completed" || job?.status === "failed" ? false : 1000;
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen w-full bg-background relative flex flex-col items-center justify-center p-4 antialiased">
      <BackgroundBeams className="opacity-20" />
      
      <div className="max-w-3xl w-full z-10 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Antimomentum is thinking...
          </h1>
          <p className="text-zinc-400 text-lg italic">
            "{job.prompt}"
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-neutral-900 border-neutral-800 text-zinc-400">
              ID: #{job.id}
            </Badge>
            <Badge 
              variant={job.status === "completed" ? "default" : "secondary"}
              className={cn(
                "capitalize",
                job.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""
              )}
            >
              {job.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {job.steps.map((step: any, index: number) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm overflow-visible">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : step.status === "in_progress" ? (
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-zinc-700" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className={cn(
                          "font-medium",
                          step.status === "completed" ? "text-zinc-300" : "text-white"
                        )}>
                          {step.title}
                        </h3>
                        {step.tool && (
                          <Badge variant="outline" className="text-[10px] uppercase tracking-widest bg-zinc-950 border-zinc-800 text-zinc-500">
                            {step.tool}
                          </Badge>
                        )}
                      </div>
                      {step.output && (
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-1 italic">
                          {step.output}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {(job.status === "planning" || job.status === "pending") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 p-8 text-zinc-500 italic"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating research plan...
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
