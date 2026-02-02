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
  ArrowUpIcon,
  Download,
  FileText,
  FileCode
} from "lucide-react";
import { exportToPdf, exportToDocx } from "@/lib/export-utils";
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
    <div className="flex flex-col h-screen w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-primary/30">
      {/* Top Navigation Bar - Mobile Optimized */}
      <header className="flex items-center justify-between px-4 h-16 border-b border-white/[0.03] bg-black/40 backdrop-blur-xl shrink-0 z-[100]">
        <div className="flex items-center gap-1.5">
          <button className="p-2 hover:bg-white/5 active:scale-95 rounded-full transition-all">
            <ArrowUpIcon className="w-5 h-5 text-neutral-400 rotate-[270deg]" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 leading-none mb-1">Draft</span>
            <span className="text-sm font-semibold text-neutral-200 truncate max-w-[120px]">
              {job.prompt.substring(0, 20)}...
            </span>
          </div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          <Brain className="w-4 h-4 text-white opacity-80" />
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/5 active:scale-95 rounded-full transition-all text-neutral-400">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/5 active:scale-95 rounded-full transition-all text-neutral-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area - Delv AI Style */}
      <main className="flex-1 overflow-y-auto px-4 py-8 space-y-10 custom-scrollbar pb-40 max-w-2xl mx-auto w-full scroll-smooth">
        <BackgroundBeams className="opacity-[0.03] pointer-events-none" />
        
        {/* Title Section */}
        <header className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Research Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100 leading-[1.15]">
            {job.prompt}
          </h1>
          
          {job.reasoning && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 border-t border-white/[0.03]"
            >
              <p className="text-base md:text-lg text-neutral-400 font-medium leading-relaxed italic opacity-80">
                "{job.reasoning}"
              </p>
            </motion.div>
          )}
        </header>

        {/* Content Cards - The "Alive Document" Feed */}
        <div className="space-y-12 relative z-10">
           <AnimatePresence mode="popLayout">
             {job.steps.map((step, idx) => (
               <motion.section 
                 key={step.id}
                 initial={{ opacity: 0, scale: 0.98, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                 className="group relative"
               >
                 {/* Step Header */}
                 <div className="flex items-center gap-3 mb-5">
                   <div className={cn(
                     "w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-500",
                     step.status === 'completed' 
                       ? "bg-primary/10 border-primary/20 text-primary" 
                       : "bg-white/[0.03] border-white/[0.05] text-neutral-500"
                   )}>
                     {step.status === 'completed' ? (
                       <CheckCircle2 className="w-4 h-4" />
                     ) : step.status === 'in_progress' ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                     ) : (
                       <span className="text-xs font-bold">{idx + 1}</span>
                     )}
                   </div>
                   <h3 className={cn(
                     "text-sm font-bold tracking-wide uppercase opacity-90",
                     step.status === 'completed' ? "text-primary" : "text-neutral-400"
                   )}>
                     {step.title}
                   </h3>
                 </div>

                 {/* Step Content Card */}
                 <div className="relative">
                   <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   {step.output ? (
                     <div className="relative group/content overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-6 md:p-8 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.1]">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 opacity-0 group-hover/content:opacity-100 transition-opacity" />
                       
                       <div className="prose prose-neutral prose-invert max-w-none">
                         <TypingAnimation text={step.output} />
                       </div>

                       {/* Action Overlay */}
                       <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/[0.03]">
                         <button 
                           onClick={() => exportToPdf(step.title, step.output!)}
                           className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
                         >
                           <FileCode className="w-3 h-3" />
                           Export PDF
                         </button>
                         <button 
                           onClick={() => exportToDocx(step.title, step.output!)}
                           className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
                         >
                           <FileText className="w-3 h-3" />
                           Word Draft
                         </button>
                       </div>
                     </div>
                   ) : (
                     <div className="h-24 flex items-center justify-center rounded-[2rem] border border-dashed border-white/[0.05] opacity-20">
                       <Loader2 className="w-6 h-6 animate-spin" />
                     </div>
                   )}
                 </div>
               </motion.section>
             ))}
           </AnimatePresence>
        </div>
      </main>

      {/* Mobile Input Bar - Delv AI Style */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50">
        <div className="bg-neutral-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 flex items-center gap-2">
          <button className="p-3 bg-white/[0.03] hover:bg-white/10 rounded-full transition-all text-neutral-400">
            <Plus className="w-5 h-5" />
          </button>
          
          <div className="flex-1 px-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Evolve the research..."
              className="w-full bg-transparent border-none text-sm focus-visible:ring-0 placeholder:text-neutral-600 resize-none py-3 h-11"
              style={{ overflow: "hidden" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || mutation.isPending}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
              inputValue.trim() 
                ? "bg-primary text-black shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                : "bg-white/[0.03] text-neutral-600"
            )}
          >
            {mutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
