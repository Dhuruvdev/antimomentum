import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  CheckCircle2, 
  Circle, 
  ArrowLeft,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import type { JobResponse } from "@shared/schema";

export default function JobProgress() {
  const { id } = useParams<{ id: string }>();
  
  const { data: job, isLoading } = useQuery<JobResponse>({
    queryKey: [buildUrl(api.jobs.get.path, { id: id! })],
    refetchInterval: (query) => {
      const job = query.state.data as JobResponse | undefined;
      return job?.status === "completed" || job?.status === "failed" ? false : 1000;
    },
  });

  if (isLoading || !job) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white relative flex flex-col items-center p-4 md:p-8 selection:bg-neutral-800">
      <BackgroundBeams className="opacity-40" />
      
      <div className="max-w-4xl w-full z-10 space-y-12 mt-12 md:mt-24">
        {/* Header Section - Matching Landing Theme */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <div className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
              Process ID: #{job.id}
            </div>
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Antimomentum <span className="text-neutral-500">Processing</span>
          </h1>
          
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto italic font-light">
            "{job.prompt}"
          </p>

          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="border-neutral-800 bg-neutral-900/50 text-neutral-400 capitalize px-4 py-1">
              Status: {job.status}
            </Badge>
          </div>
        </div>

        {/* Execution Steps - Matching Chat Redesign Style */}
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {job.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="group bg-neutral-900/30 border border-neutral-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-neutral-900/50 hover:border-neutral-800 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : step.status === "in_progress" ? (
                        <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-800" />
                      )}
                    </div>
                    <div className="flex-grow space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className={cn(
                          "text-sm font-medium tracking-wide",
                          step.status === "completed" ? "text-neutral-400" : "text-white"
                        )}>
                          {step.title}
                        </h3>
                        {step.tool && (
                          <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-mono">
                            {step.tool}
                          </span>
                        )}
                      </div>
                      
                      {step.output && (
                        <div className="bg-black/50 border border-neutral-800/50 rounded-xl p-4 font-mono text-xs text-neutral-500 leading-relaxed overflow-hidden">
                          <span className="text-neutral-700 mr-2">$</span>
                          {step.output}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {(job.status === "planning" || job.status === "pending") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 p-12 text-neutral-600 font-mono text-[10px] uppercase tracking-[0.3em]"
            >
              <div className="w-1 h-1 bg-neutral-600 rounded-full animate-ping" />
              Synthesizing Strategy
            </motion.div>
          )}
        </div>

        {/* Back Button - Matching Design */}
        <div className="flex justify-center pt-12 pb-24">
          <Link href="/~">
            <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-neutral-800 bg-neutral-900/50 text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-all">
              <ArrowLeft className="w-4 h-4" />
              New Instruction
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
