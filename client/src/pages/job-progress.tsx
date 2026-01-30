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
  Layout,
  MessageSquarePlus,
  ChevronDown,
  Brain,
  Terminal,
  Cpu,
  ShieldCheck,
  Activity
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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#09090B]">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-[#7C3AED] opacity-20" />
          <Cpu className="w-6 h-6 text-[#7C3AED] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <span className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#52525B] font-mono">Initializing Neural Link</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#09090B] text-[#FAFAFA] font-sans overflow-hidden selection:bg-[#7C3AED]/30">
      {/* Top Navigation Bar - Polished */}
      <header className="flex items-center justify-between px-6 h-16 border-b border-[#27272A]/40 bg-[#09090B]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center border border-[#7C3AED]/20">
               <SiReplit className="w-4 h-4 text-[#7C3AED]" />
             </div>
             <div>
               <h1 className="text-sm font-bold tracking-tight">Antimomentum</h1>
               <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                 <span className="text-[10px] text-[#52525B] uppercase tracking-wider font-bold">Node-05 Active</span>
               </div>
             </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.15em] font-bold text-[#52525B]">
           <div className="flex items-center gap-2 hover:text-[#A1A1AA] transition-colors cursor-pointer">
             <Activity className="w-3 h-3" /> Telemetry
           </div>
           <div className="flex items-center gap-2 hover:text-[#A1A1AA] transition-colors cursor-pointer">
             <ShieldCheck className="w-3 h-3" /> Security
           </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-4">
            {[1,2,3].map(i => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-[#09090B] bg-[#27272A] flex items-center justify-center text-[10px] font-bold text-[#A1A1AA]">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <button className="p-2.5 hover:bg-[#1C1C21] rounded-xl transition-all border border-transparent hover:border-[#27272A]">
            <MoreVertical className="w-5 h-5 text-[#71717A]" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-5xl mx-auto p-6 lg:p-12 space-y-12 pb-48">
          
          {/* User Instruction Section */}
          <section className="flex justify-end">
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 max-w-xl shadow-2xl relative group">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 border-4 border-[#09090B]">
                <Zap className="w-4 h-4 text-white fill-current" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#27272A] rounded-xl flex items-center justify-center border border-[#3F3F46]">
                      <Terminal className="w-5 h-5 text-[#A1A1AA]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Instruction Context</h4>
                      <p className="text-sm font-medium text-[#FAFAFA] truncate max-w-[200px]">System Optimization v4.2</p>
                    </div>
                  </div>
                  <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20 text-[10px] uppercase font-bold px-2.5 py-0.5">Priority High</Badge>
                </div>
                <p className="text-[#A1A1AA] text-sm leading-relaxed italic italic">
                  "{job.prompt}"
                </p>
              </div>
            </div>
          </section>

          {/* Execution Strategy Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight">Execution Strategy</h2>
                <p className="text-xs text-[#52525B] font-mono uppercase tracking-widest">Cycle: 0{job.steps.length} // Quantum Synthesis</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#18181B] rounded-full border border-[#27272A] text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">
                <Brain className="w-3.5 h-3.5 text-[#7C3AED]" />
                {job.steps.filter(s => s.status === 'completed').length} / {job.steps.length} Steps Validated
              </div>
            </div>

            <div className="grid gap-4 relative">
              <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-[#7C3AED]/50 via-[#27272A] to-transparent" />
              
              <AnimatePresence mode="popLayout">
                {job.steps.map((step, idx) => (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative pl-14 group"
                  >
                    <div className={cn(
                      "absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 z-10",
                      step.status === 'completed' ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]" : 
                      step.status === 'in_progress' ? "bg-[#7C3AED]/10 border-[#7C3AED]/40 text-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.1)]" : 
                      "bg-[#18181B] border-[#27272A] text-[#3F3F46]"
                    )}>
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : step.status === 'in_progress' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Circle className="w-5 h-5 fill-current opacity-20" />
                      )}
                    </div>

                    <div className={cn(
                      "p-6 rounded-3xl border transition-all duration-300",
                      step.status === 'in_progress' ? "bg-[#18181B] border-[#3F3F46] shadow-xl" : "bg-transparent border-transparent hover:bg-[#18181B]/50 hover:border-[#27272A]"
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="space-y-1">
                          <h3 className={cn(
                            "text-base font-bold transition-colors",
                            step.status === 'completed' ? "text-[#71717A]" : "text-[#FAFAFA]"
                          )}>
                            {step.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest">{step.tool || 'core_logic'}</span>
                            {step.status === 'in_progress' && (
                              <span className="flex items-center gap-1 text-[9px] text-[#7C3AED] font-bold uppercase animate-pulse">
                                <div className="w-1 h-1 rounded-full bg-current" /> Computing
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {step.output && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="p-4 rounded-2xl bg-black/40 border border-[#27272A] font-mono text-[11px] leading-relaxed text-[#A1A1AA]">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#27272A]/50">
                              <div className="w-2 h-2 rounded-full bg-[#EF4444]/50" />
                              <div className="w-2 h-2 rounded-full bg-[#F59E0B]/50" />
                              <div className="w-2 h-2 rounded-full bg-[#10B981]/50" />
                              <span className="ml-2 text-[#52525B] text-[9px] font-bold uppercase tracking-widest">Process Log</span>
                            </div>
                            {step.output}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Bottom Navigation - Cloned & Polished */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="max-w-4xl mx-auto space-y-6 pointer-events-auto">
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
            <div className="relative bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden focus-within:border-[#3F3F46] transition-all">
              <textarea 
                placeholder="Direct system instruction..."
                className="w-full bg-transparent px-6 py-5 text-[15px] text-[#FAFAFA] placeholder-[#52525B] outline-none resize-none min-h-[64px] max-h-[200px]"
                rows={1}
              />
              <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-t border-[#27272A]/50">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-[#27272A] rounded-xl text-[10px] font-bold text-[#FAFAFA] uppercase tracking-widest hover:bg-[#3F3F46] transition-all active:scale-95">
                    <Layout className="w-3.5 h-3.5 text-[#7C3AED]" />
                    Build System
                    <ChevronDown className="w-3 h-3 text-[#52525B]" />
                  </button>
                  <button className="p-2 text-[#52525B] hover:text-[#FAFAFA] transition-colors rounded-lg hover:bg-[#27272A]">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 bg-[#7C3AED] text-white rounded-xl hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/20 transition-all active:scale-95">
                    <Zap className="w-4 h-4 fill-current" />
                  </button>
                  <button className="p-2.5 bg-[#27272A] rounded-xl text-[#FAFAFA] hover:bg-[#3F3F46] transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-2">
            <div className="flex items-center gap-1.5 p-1.5 bg-[#18181B]/90 backdrop-blur-xl border border-[#27272A] rounded-[24px] shadow-2xl">
              <nav className="flex items-center gap-1">
                <AppButton active icon={<div className="w-5 h-5 rounded-[4px] border-2 border-white/30 bg-white/20" />} color="bg-[#4F46E5]" />
                <AppButton icon={<Monitor className="w-5 h-5" />} />
                <AppButton icon={<SiReplit className="w-5 h-5" />} color="text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/20" />
                <AppButton icon={<Globe className="w-5 h-5" />} />
              </nav>
              <div className="w-px h-8 bg-[#27272A] mx-2" />
              <button className="p-3 text-[#52525B] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-[18px] transition-all">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-3 text-[#52525B] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-[18px] transition-all">
                <div className="w-5 h-5 border-2 border-current rounded-md flex flex-col gap-[2px] p-[2px]">
                   <div className="w-full h-px bg-current"></div>
                   <div className="w-full h-px bg-current"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppButton({ icon, color = "text-[#52525B]", active = false }: { icon: React.ReactNode, color?: string, active?: boolean }) {
  return (
    <button className={cn(
      "p-3 rounded-[18px] transition-all active:scale-90",
      active ? color + " shadow-lg" : "hover:bg-[#27272A] " + color
    )}>
      {icon}
    </button>
  );
}
