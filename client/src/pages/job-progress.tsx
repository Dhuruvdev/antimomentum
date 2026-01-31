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
import { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";

const TypingAnimation = memo(({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className="prose prose-invert max-w-none">
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-4 bg-primary ml-1 align-middle"
        />
      )}
    </div>
  );
});

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
    mutationFn: async (instruction: string) => {
      // For a real app, this would be a PATCH to update the job with new context
      // For now, we simulate by sending the instruction to the same job session
      console.log(`Sending instruction to job ${id}:`, instruction);
      // In a real implementation, we'd add this to a messages/chat history table
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.jobs.get.path, { id: id! })] });
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
      <main className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-40 max-w-4xl mx-auto w-full">
        <BackgroundBeams className="opacity-10 pointer-events-none" />
        
        {/* User Instruction Bubble - Refactored for Documenting Feel */}
        <div className="flex flex-col gap-2 relative z-10">
           <div className="flex items-center gap-2 text-neutral-500 mb-2">
             <div className="p-1.5 bg-neutral-900 rounded-lg">
               <Zap className="w-4 h-4" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest">Active Research Session</span>
           </div>
           
           <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
             {job.prompt}
           </h1>
        </div>

        {/* Action Pill & Reasoning */}
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 rounded-full border border-neutral-800">
              <Brain className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-neutral-400 font-medium tracking-wide">
                Agent Thinking...
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-neutral-500">{job.steps.length} Actions</Badge>
              <Badge variant="outline" className="text-[10px] text-green-500/80">Alive Document</Badge>
            </div>
          </div>

          {job.reasoning && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l-2 border-primary/30 pl-6 py-2"
            >
              <p className="text-lg text-neutral-300 font-serif italic leading-relaxed">
                {job.reasoning}
              </p>
            </motion.div>
          )}
        </div>

        {/* Document Body / Execution Log */}
        <div className="space-y-12 relative z-10 pt-4">
           <AnimatePresence>
             {job.steps.map((step, idx) => (
               <motion.div 
                 key={step.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="group"
               >
                 <div className="flex items-start gap-4 mb-4">
                   <div className="mt-1 shrink-0">
                     {step.status === 'completed' ? (
                       <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                         <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                       </div>
                     ) : step.status === 'in_progress' ? (
                       <Loader2 className="w-5 h-5 animate-spin text-primary" />
                     ) : (
                       <div className="w-5 h-5 border-2 border-neutral-800 rounded-full" />
                     )}
                   </div>
                   <div className="flex-1">
                      <h3 className={cn(
                        "text-lg font-semibold transition-colors",
                        step.status === 'completed' ? "text-neutral-500" : "text-white"
                      )}>{step.title}</h3>
                      
                      {step.output && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 p-5 bg-neutral-900/50 border border-neutral-800 rounded-2xl text-neutral-300 text-[15px] leading-relaxed font-sans shadow-inner"
                        >
                          <TypingAnimation text={step.output} />
                        </motion.div>
                      )}
                   </div>
                 </div>
                 {idx < job.steps.length - 1 && (
                   <div className="ml-[10px] w-px h-12 bg-neutral-900 my-2" />
                 )}
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
