import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { 
  Loader2, 
  CheckCircle2, 
  Circle, 
  MoreVertical,
  History,
  LogOut,
  Plus,
  Paperclip,
  Zap,
  Globe,
  Monitor,
  MessageSquarePlus,
  ChevronDown,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SiReplit } from "react-icons/si";
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
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-neutral-900 bg-black shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-neutral-900 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 text-neutral-500" />
          </button>
          <button className="p-2 hover:bg-neutral-900 rounded-lg transition-colors">
            <History className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <SiReplit className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">Agent</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-neutral-900 rounded-lg transition-colors">
            <MessageSquarePlus className="w-5 h-5 text-neutral-500" />
          </button>
          <button className="p-2 hover:bg-neutral-900 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-40">
        {/* User Instruction Bubble (Matching Screenshot) */}
        <div className="flex justify-end mb-8">
           <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 max-w-[85%] relative shadow-lg">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-neutral-800">
                 <div className="w-5 h-px bg-neutral-500 relative after:content-[''] after:absolute after:top-[-4px] after:left-0 after:w-5 after:h-px after:bg-neutral-500 before:content-[''] before:absolute before:top-[4px] before:left-0 before:w-5 before:h-px before:bg-neutral-500"></div>
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm text-white truncate font-medium">Pasted-You-are-...</p>
                 <div className="flex items-center gap-2 mt-1">
                    <Zap className="w-3 h-3 text-neutral-500" />
                    <Globe className="w-3 h-3 text-neutral-500" />
                    <span className="text-[10px] text-neutral-600">29 minutes ago</span>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Action Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 rounded-full border border-neutral-800 cursor-pointer hover:bg-neutral-800 transition-colors">
            <div className="flex gap-1 items-center">
              <ChevronDown className="w-3 h-3 text-neutral-500" />
              <Brain className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <span className="text-xs text-neutral-500 font-medium">{job.steps.length} actions</span>
          </div>
        </div>

        {/* Execution Log */}
        <div className="space-y-6">
           <div className="text-white leading-relaxed text-[15px] space-y-4">
              <p>
                I will integrate the <span className="text-neutral-400">BackgroundBeams</span> component into your project. 
                Since the project is already set up with shadcn/ui and Tailwind CSS, I will add the component and a demo page.
              </p>
              <p>
                I'll start by checking the existing configuration and dependencies.
              </p>
           </div>

           <AnimatePresence>
             {job.steps.map((step, idx) => (
               <motion.div 
                 key={step.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex items-start gap-3"
               >
                 <div className="mt-1 shrink-0">
                   {step.status === 'completed' ? (
                     <CheckCircle2 className="w-4 h-4 text-white" />
                   ) : step.status === 'in_progress' ? (
                     <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                   ) : (
                     <Circle className="w-4 h-4 text-neutral-800" />
                   )}
                 </div>
                 <div className="flex-1">
                    <p className={cn(
                      "text-sm",
                      step.status === 'completed' ? "text-neutral-500" : "text-white"
                    )}>{step.title}</p>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-50">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 text-sm text-neutral-500 italic">
              Make lightweight changes, quickly...
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-800">
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 rounded-lg text-xs font-medium text-white border border-neutral-700">
                  <SiReplit className="w-3.5 h-3.5 text-white" />
                  Build
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </button>
                <button className="p-2 text-neutral-500">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-1">
                  <button className="p-1.5 bg-neutral-700 text-white rounded-md">
                    <Zap className="w-4 h-4 fill-current" />
                  </button>
                  <button className="p-1.5 text-neutral-500">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-3 h-[1.5px] bg-current"></div>
                      <div className="w-2 h-[1.5px] bg-current"></div>
                    </div>
                  </button>
                </div>
                <button className="p-2 bg-neutral-800 rounded-lg text-neutral-500">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
