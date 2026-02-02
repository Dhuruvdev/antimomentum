import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { 
  Loader2, CheckCircle2, Globe, Brain, ArrowUpIcon, 
  Download, MoreVertical, Plus, FileCode, FileText,
  Search, LayoutDashboard, FileStack, BookOpen, 
  History, Settings, Upload, Zap, Sparkles,
  ChevronRight, PanelRightClose, FileJson, Image as ImageIcon
} from "lucide-react";
import { exportToPdf, exportToDocx } from "@/lib/export-utils";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Textarea } from "@/components/ui/textarea";
import type { JobResponse, Step } from "@shared/schema";

const TypingAnimation = memo(({ text }: { text: string }) => {
  return (
    <div className="prose prose-invert max-w-none">
      {text}
    </div>
  );
});

export default function JobProgress() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: job, isLoading } = useQuery<JobResponse>({
    queryKey: [buildUrl(api.jobs.get.path, { id: id! })],
    enabled: !!id,
    refetchInterval: (query) => {
      const job = query.state.data as JobResponse | undefined;
      return job?.status === "completed" || job?.status === "failed" ? false : 1000;
    },
  });

  const mutation = useMutation({
    mutationFn: async (instruction: string) => {
      // Simulation or instruction logic
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

  if (isLoading || !job) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-primary/30">
      {/* Lucid Sidebar - Desktop/Mobile Responsive */}
      <aside className={cn(
        "fixed md:relative flex flex-col border-r border-white/[0.03] bg-black/40 backdrop-blur-xl transition-all duration-300 z-[100] h-full",
        isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-0 overflow-hidden"
      )}>
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            </div>
            <span className="font-bold tracking-tight text-lg text-neutral-100">Antimomentum</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg text-neutral-400"
          >
            <PanelRightClose className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto py-4">
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Workspaces</p>
            {[
              { icon: LayoutDashboard, label: "Dashboard", active: true },
              { icon: Search, label: "Research Projects" },
              { icon: FileStack, label: "Reports" },
              { icon: BookOpen, label: "Publications" },
            ].map((item) => (
              <button key={item.label} className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                item.active ? "bg-primary/10 text-primary border border-primary/20" : "text-neutral-400 hover:bg-white/5"
              )}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Projects</p>
            {["Market Strategy", "Quarterly Analysis", "Meeting Docs"].map((label) => (
              <button key={label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-white/5 transition-all">
                <ChevronRight className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/[0.03] space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-white/5 transition-all">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-white/5 transition-all">
            <History className="w-4 h-4" />
            History
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative">
        {/* Main Content Header */}
        <header className="flex items-center justify-between px-4 md:px-6 h-16 border-b border-white/[0.03] bg-black/20 backdrop-blur-xl shrink-0 z-50">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-all text-neutral-400"
            >
              <PanelRightClose className={cn("w-5 h-5", !isSidebarOpen && "rotate-180")} />
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <Search className="w-4 h-4 text-neutral-500" />
              <div className="h-4 w-px bg-white/[0.05]" />
              <span className="text-sm font-medium text-neutral-300 truncate max-w-[100px] md:max-w-[200px]">
                {job.prompt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs font-medium text-neutral-400">Agent Status: Active</span>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-all text-neutral-400">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-all text-neutral-400">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Central Workspace Area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Middle Workspace: Objective & Documents */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-10 space-y-8 md:space-y-12 custom-scrollbar pb-40 w-full relative">
            <BackgroundBeams className="opacity-[0.02] pointer-events-none" />
            
            <div className="space-y-6 relative z-10 max-w-4xl mx-auto">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Objective Analysis
                </h2>
                <p className="text-neutral-400 leading-relaxed text-base md:text-lg">
                  {job.prompt}
                </p>
              </div>

              {/* Live PDF View - Single Generation Mode */}
              <div className="pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live PDF Generation</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-10">
                  {job.steps.map((step: Step, idx: number) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative"
                    >
                      <div className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.01] border border-white/[0.05] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden group-hover:border-primary/20 transition-all duration-500 group-hover:shadow-primary/5 hover:scale-[1.01]">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                        
                        <div className="absolute inset-0 p-5 md:p-8 flex flex-col">
                          {step.output ? (
                            <>
                              <div className="prose prose-neutral prose-invert prose-xs md:prose-sm max-w-none overflow-hidden line-clamp-[14] md:line-clamp-[16] text-neutral-300 font-serif leading-relaxed">
                                {step.output}
                              </div>
                              <div className="mt-auto pt-4 md:pt-6 flex items-center justify-between border-t border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[8px] md:text-[9px] uppercase border-white/[0.1] bg-white/[0.03]">Page {idx + 1}</Badge>
                                </div>
                                <span className="text-[9px] md:text-[10px] font-mono text-neutral-600 uppercase tracking-tighter">Draft Alpha</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 md:gap-4 opacity-20">
                              <Loader2 className="w-6 h-6 md:w-8 h-8 animate-spin" />
                              <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em]">Synthesizing...</span>
                            </div>
                          )}
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent md:inset-0 md:bg-black/60 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                          <button 
                            onClick={() => exportToPdf(step.title, step.output!)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-full text-[10px] font-bold uppercase tracking-wider"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Completion Explanation - Shows only when finished */}
                {job.status === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold text-neutral-200">Synthesis Complete</h3>
                    </div>
                    <p className="text-neutral-400 leading-relaxed">
                      I have completed the multi-page intelligence synthesis. The report has been structured across multiple document pages to maintain professional hierarchy and visual clarity. You can now download individual pages or export the entire draft.
                    </p>
                    <div className="flex gap-4 pt-2">
                      <button 
                        onClick={() => exportToPdf(job.prompt, job.steps.map(s => s.output).join('\n\n'))}
                        className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                      >
                        Export Full Report
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Plan Before Execution - Collapsible on Mobile */}
          <aside className="hidden xl:flex flex-col w-80 border-l border-white/[0.03] bg-black/20 backdrop-blur-xl p-6 space-y-8 overflow-y-auto z-50">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Working Workflow</h3>
                </div>
                <button className="p-1 hover:bg-white/5 rounded-md">
                  <PanelRightClose className="w-4 h-4 text-neutral-500" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                <p className="text-sm font-medium text-neutral-300 leading-relaxed">
                  I am analyzing the objective and synthesizing a professional intelligence report across multiple pages.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[FileCode, FileText, FileJson, ImageIcon].map((Icon, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center">
                        <Icon className="w-3 h-3 text-neutral-400" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-neutral-500">+ All Artifacts</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Execution Plan</p>
                <div className="space-y-4">
                  {job.steps.map((step: Step, i: number) => (
                    <div key={step.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center gap-1">
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all",
                          step.status === 'completed' ? "bg-primary border-primary text-black" : "border-white/10 text-neutral-500"
                        )}>
                          {step.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                        </div>
                        {i < job.steps.length - 1 && <div className="w-px h-full bg-white/[0.05]" />}
                      </div>
                      <div className="pb-4">
                        <p className={cn(
                          "text-sm font-medium transition-colors",
                          step.status === 'completed' ? "text-neutral-300" : "text-neutral-500"
                        )}>{step.title}</p>
                        <p className="text-[10px] text-neutral-600 mt-1 uppercase tracking-tight">{step.tool}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4 pt-8">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Suggested Tools</p>
                <div className="flex flex-wrap gap-2">
                  {["Mindmap Gen", "Visual Synthesis", "Data Weaver", "Report Master"].map(tool => (
                    <Badge key={tool} variant="outline" className="text-[9px] bg-white/[0.03] border-white/[0.05] text-neutral-400">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
              <button className="w-full py-3 bg-primary text-black rounded-xl text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                Execute & Start
              </button>
            </div>
          </aside>
        </main>

        {/* Floating Input Bar - Mobile Optimized */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-2xl z-50">
          <div className="bg-[#111111]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-3 flex items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center bg-white/[0.03] hover:bg-white/10 rounded-full transition-all text-neutral-400 shrink-0">
              <Upload className="w-5 h-5" />
            </button>
            
            <div className="flex-1 px-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your objective..."
                className="w-full bg-transparent border-none text-sm focus-visible:ring-0 placeholder:text-neutral-600 resize-none py-3 h-12 scrollbar-none"
                style={{ overflow: "hidden" }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || mutation.isPending}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shrink-0",
                inputValue.trim() 
                  ? "bg-primary text-black shadow-[0_0_30px_rgba(var(--primary),0.4)] rotate-0" 
                  : "bg-white/[0.03] text-neutral-600 rotate-90"
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
    </div>
  );
}
