import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { BackgroundBeams } from "@/components/ui/background-beams";
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
  MessageSquarePlus,
  ChevronDown,
  Brain,
  ArrowUpIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SiReplit } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import type { JobResponse } from "@shared/schema";
import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function JobProgress() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: job, isLoading } = useQuery<JobResponse>({
    queryKey: [buildUrl(api.jobs.get.path, { id: id! })],
    refetchInterval: (query) => {
      const job = query.state.data as JobResponse | undefined;
      return job?.status === "completed" || job?.status === "failed" ? false : 1000;
    },
  });

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch(api.jobs.create.path, {
        method: api.jobs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to create job");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.create.path] });
      setLocation(`/job/${data.id}`);
      setInputValue("");
    },
  });

  const handleSubmit = () => {
    if (!inputValue.trim() || mutation.isPending) return;
    mutation.mutate(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [inputValue, adjustHeight]);

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
        <BackgroundBeams className="opacity-20 pointer-events-none" />
        
        {/* User Instruction Bubble */}
        <div className="flex justify-end mb-8 relative z-10">
           <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 max-w-[85%] relative shadow-lg">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-neutral-800">
                 <div className="w-5 h-px bg-neutral-500 relative after:content-[''] after:absolute after:top-[-4px] after:left-0 after:w-5 after:h-px after:bg-neutral-500 before:content-[''] before:absolute before:top-[4px] before:left-0 before:w-5 before:h-px before:bg-neutral-500"></div>
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm text-white truncate font-medium">{job.prompt}</p>
                 <div className="flex items-center gap-2 mt-1">
                    <Zap className="w-3 h-3 text-neutral-500" />
                    <Globe className="w-3 h-3 text-neutral-500" />
                    <span className="text-[10px] text-neutral-600">Active Session</span>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Action Pill */}
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 rounded-full border border-neutral-800 cursor-pointer hover:bg-neutral-800 transition-colors">
              <div className="flex gap-1 items-center">
                <ChevronDown className="w-3 h-3 text-neutral-500" />
                <Brain className="w-3.5 h-3.5 text-neutral-500" />
              </div>
              <span className="text-xs text-neutral-500 font-medium">{job.steps.length} actions</span>
            </div>
          </div>

          {job.reasoning && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-950 border border-neutral-900 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Agent Reasoning</span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {job.reasoning}
              </p>
            </motion.div>
          )}
        </div>

        {/* Execution Log */}
        <div className="space-y-6 relative z-10">
           <div className="text-white leading-relaxed text-[15px] space-y-4">
              <p className="italic text-neutral-400">
                "{job.prompt}"
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
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-neutral-900 rounded-xl border border-neutral-800 focus-within:border-neutral-700 transition-colors">
            <div className="overflow-y-auto">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Antimomentum to Write Something..."
                className={cn(
                  "w-full px-4 py-3",
                  "resize-none",
                  "bg-transparent",
                  "border-none",
                  "text-white text-sm md:text-base",
                  "focus:outline-none",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-neutral-500 placeholder:text-sm",
                  "min-h-[60px]"
                )}
                style={{
                  overflow: "hidden",
                }}
              />
            </div>

            <div className="flex items-center justify-between p-2 md:p-3">
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  type="button"
                  className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Paperclip className="w-4 h-4 text-white" />
                  <span className="text-xs text-zinc-400 hidden sm:group-hover:inline transition-opacity">
                    Attach
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  type="button"
                  className="px-2 py-1 rounded-lg text-xs md:text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">Project</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || mutation.isPending}
                  className={cn(
                    "p-1.5 md:px-2 md:py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
                    inputValue.trim()
                      ? "bg-white text-black"
                      : "text-zinc-400"
                  )}
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  ) : (
                    <ArrowUpIcon
                      className={cn(
                        "w-4 h-4",
                        inputValue.trim()
                          ? "text-black"
                          : "text-zinc-400"
                      )}
                    />
                  )}
                  <span className="sr-only">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
