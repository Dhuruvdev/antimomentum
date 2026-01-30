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
  Terminal, 
  Layout, 
  FileText, 
  Search, 
  Cpu,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500">
        <Cpu className="w-8 h-8 animate-pulse mb-4" />
        <span className="text-xs uppercase tracking-widest font-mono">Initializing Environment...</span>
      </div>
    );
  }

  if (!job) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 p-4">
      <p className="font-mono text-sm uppercase tracking-tighter">System Error: Null Context</p>
      <Link href="/chat" className="mt-4 text-xs underline uppercase tracking-widest">Return to Terminal</Link>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-black text-zinc-300 font-sans selection:bg-zinc-800 overflow-hidden">
      <BackgroundBeams className="opacity-10 pointer-events-none" />
      
      {/* Sidebar: System State */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-xl flex flex-col z-20">
        <div className="p-6 border-b border-zinc-900">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Antimomentum v1.0</span>
          </div>
          <h2 className="text-xs font-mono text-zinc-400 truncate">JOB_ID: {job.id}</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold block mb-3 px-2">Primary Tools</span>
            <div className="space-y-1">
              <ToolItem icon={<Search className="w-3.5 h-3.5" />} label="Web Intelligence" active />
              <ToolItem icon={<FileText className="w-3.5 h-3.5" />} label="Document Synthesis" />
              <ToolItem icon={<Terminal className="w-3.5 h-3.5" />} label="Code Execution" />
            </div>
          </div>
          
          <div>
            <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold block mb-3 px-2">Active Resources</span>
            <div className="space-y-2 px-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">Memory</span>
                <span className="text-zinc-400">4.2GB</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">Threads</span>
                <span className="text-zinc-400">12</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-900">
          <Link href="/chat">
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] uppercase tracking-widest font-bold transition-colors">
              <ArrowLeft className="w-3 h-3" /> New Task
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Execution Environment */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="h-16 border-b border-zinc-900 bg-zinc-950/20 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="font-mono text-[10px] border-zinc-800 bg-zinc-900/50 text-zinc-400 uppercase">
              Environment: Production
            </Badge>
            <div className="h-4 w-px bg-zinc-800" />
            <p className="text-xs text-zinc-500 font-mono italic truncate max-w-md">
              "{job.prompt}"
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-600 uppercase">Status</span>
            <Badge className={cn(
              "text-[10px] uppercase tracking-tighter px-2 py-0.5",
              job.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
            )}>
              {job.status}
            </Badge>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-white tracking-tight">Execution Protocol</h1>
              <p className="text-sm text-zinc-500">Systematically executing research and synthesis cycles.</p>
            </div>

            <div className="relative space-y-4">
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-zinc-900 pointer-events-none" />
              
              <AnimatePresence mode="popLayout">
                {job.steps.map((step: any, index: number) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="relative pl-12"
                  >
                    <div className={cn(
                      "absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500",
                      step.status === "completed" ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : 
                      step.status === "in_progress" ? "bg-blue-500/10 border-blue-500/30 animate-pulse" : 
                      "bg-zinc-950 border-zinc-900"
                    )}>
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : step.status === "in_progress" ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                      )}
                    </div>

                    <div className="group bg-zinc-950/40 border border-zinc-900 rounded-lg p-5 hover:border-zinc-800 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={cn(
                          "text-sm font-medium transition-colors",
                          step.status === "completed" ? "text-zinc-400" : "text-zinc-100"
                        )}>
                          {step.title}
                        </h3>
                        {step.tool && (
                          <span className="text-[9px] font-mono uppercase text-zinc-600 tracking-[0.2em]">{step.tool}</span>
                        )}
                      </div>
                      {step.output && (
                        <div className="mt-3 font-mono text-[11px] leading-relaxed text-zinc-500 bg-black/30 rounded border border-zinc-900/50 p-3">
                          <span className="text-zinc-700 mr-2">$</span>
                          {step.output}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {job.status === "planning" && (
                <div className="pl-12 py-4">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-[10px] uppercase tracking-widest font-mono">Formulating execution strategy...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="p-4 bg-zinc-950/50 border-t border-zinc-900 flex items-center justify-center gap-8">
          <StatItem label="Tokens Used" value="1,204" />
          <div className="w-px h-4 bg-zinc-900" />
          <StatItem label="Latency" value="142ms" />
          <div className="w-px h-4 bg-zinc-900" />
          <StatItem label="Confidence" value="98.4%" />
        </footer>
      </main>
    </div>
  );
}

function ToolItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-[11px] transition-all cursor-pointer group",
      active ? "bg-zinc-900 text-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
    )}>
      <span className={cn("transition-colors", active ? "text-blue-400" : "group-hover:text-zinc-300")}>{icon}</span>
      <span className="font-medium tracking-tight">{label}</span>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">{label}</span>
      <span className="text-[10px] font-mono text-zinc-400">{value}</span>
    </div>
  );
}
