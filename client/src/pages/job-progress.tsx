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
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SiReplit } from "react-icons/si";

export default function JobProgress() {
  const { id } = useParams<{ id: string }>();
  
  const { data: job, isLoading } = useQuery({
    queryKey: [buildUrl(api.jobs.get.path, { id: id! })],
    refetchInterval: (query) => {
      const job = query.state.data as any;
      return job?.status === "completed" || job?.status === "failed" ? false : 1000;
    },
  });

  if (isLoading || !job) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#111116]">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#111116] text-[#E4E4E7] font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-[#27272A]/50 bg-[#111116]">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#27272A] rounded-lg transition-colors">
            <LogOut className="w-5 h-5 text-[#A1A1AA]" />
          </button>
          <button className="p-2 hover:bg-[#27272A] rounded-lg transition-colors">
            <History className="w-5 h-5 text-[#A1A1AA]" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <SiReplit className="w-5 h-5 text-[#7C3AED]" />
          <span className="text-sm font-medium">Agent</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#27272A] rounded-lg transition-colors">
            <MessageSquarePlus className="w-5 h-5 text-[#A1A1AA]" />
          </button>
          <button className="p-2 hover:bg-[#27272A] rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-[#A1A1AA]" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-32">
        {/* Active Task Card */}
        <div className="flex justify-end mb-8">
           <div className="bg-[#1C1C21] border border-[#27272A] rounded-2xl p-3 max-w-[85%] relative group shadow-lg">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#27272A] rounded-lg flex items-center justify-center">
                 <div className="w-5 h-px bg-[#A1A1AA] relative after:content-[''] after:absolute after:top-[-4px] after:left-0 after:w-5 after:h-px after:bg-[#A1A1AA] before:content-[''] before:absolute before:top-[4px] before:left-0 before:w-5 before:h-px before:bg-[#A1A1AA]"></div>
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm text-[#E4E4E7] truncate font-medium">Pasted-You-are-...</p>
                 <div className="flex items-center gap-2 mt-1">
                    <Zap className="w-3 h-3 text-[#A1A1AA]" />
                    <Globe className="w-3 h-3 text-[#A1A1AA]" />
                    <span className="text-[10px] text-[#71717A]">29 minutes ago</span>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1C1C21] rounded-full border border-[#27272A]">
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 border border-[#A1A1AA] rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-[#A1A1AA] rounded-[1px]"></div>
              </div>
              <Brain className="w-3.5 h-3.5 text-[#A1A1AA]" />
            </div>
            <span className="text-xs text-[#A1A1AA] font-medium">{job.steps.length} actions</span>
            <ChevronDown className="w-3 h-3 text-[#71717A]" />
          </div>
        </div>

        {/* Execution Log */}
        <div className="space-y-6 px-2">
           <div className="text-[#E4E4E7] leading-relaxed text-[15px]">
              <p className="mb-4">
                I will integrate the <span className="text-[#F59E0B]">BackgroundBeams</span> component into your project. 
                Since the project is already set up with shadcn/ui and Tailwind CSS, I will add the component and a demo page.
              </p>
              <p>
                I'll start by checking the existing configuration and dependencies.
              </p>
           </div>

           <AnimatePresence>
             {job.steps.map((step: any, idx: number) => (
               <motion.div 
                 key={step.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex items-start gap-3"
               >
                 <div className="mt-1">
                   {step.status === 'completed' ? (
                     <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                   ) : step.status === 'in_progress' ? (
                     <Loader2 className="w-4 h-4 animate-spin text-[#7C3AED]" />
                   ) : (
                     <Circle className="w-4 h-4 text-[#3F3F46]" />
                   )}
                 </div>
                 <div className="flex-1">
                    <p className={cn(
                      "text-sm",
                      step.status === 'completed' ? "text-[#A1A1AA]" : "text-[#E4E4E7]"
                    )}>{step.title}</p>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </main>

      {/* Floating Interaction Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#111116] via-[#111116] to-transparent">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative bg-[#1C1C21] border border-[#27272A] rounded-xl overflow-hidden focus-within:border-[#3F3F46] transition-colors">
            <textarea 
              placeholder="Make lightweight changes, quickly..."
              className="w-full bg-transparent px-4 py-3 text-sm text-[#E4E4E7] placeholder-[#71717A] outline-none resize-none min-h-[50px] max-h-[200px]"
              rows={1}
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-[#27272A]/50">
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#27272A] rounded-lg text-xs font-medium text-[#E4E4E7] hover:bg-[#3F3F46] transition-colors">
                  <Layout className="w-3.5 h-3.5" />
                  Build
                  <ChevronDown className="w-3 h-3 text-[#71717A]" />
                </button>
                <button className="p-2 text-[#A1A1AA] hover:text-[#E4E4E7] transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#7C3AED] bg-[#7C3AED]/10 rounded-lg hover:bg-[#7C3AED]/20 transition-colors">
                  <Zap className="w-4 h-4 fill-current" />
                </button>
                <button className="p-2 text-[#A1A1AA] hover:text-[#E4E4E7] transition-colors border border-[#27272A] rounded-lg">
                  <div className="flex flex-col gap-0.5">
                    <div className="w-3 h-[1.5px] bg-current"></div>
                    <div className="w-2 h-[1.5px] bg-current"></div>
                  </div>
                </button>
                <button className="p-2 bg-[#27272A] rounded-lg text-[#A1A1AA]">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom App Switcher */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1 p-1 bg-[#1C1C21] border border-[#27272A] rounded-2xl shadow-xl">
              <button className="p-2.5 bg-[#4F46E5] rounded-xl text-white">
                <div className="w-5 h-5 rounded-[4px] border-2 border-white/30 bg-white/20"></div>
              </button>
              <button className="p-2.5 text-[#A1A1AA] hover:bg-[#27272A] rounded-xl transition-all">
                <Monitor className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-[#7C3AED] bg-[#7C3AED]/10 rounded-xl">
                <SiReplit className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-[#A1A1AA] hover:bg-[#27272A] rounded-xl transition-all">
                <Globe className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-[#27272A] mx-1"></div>
              <button className="p-2.5 text-[#A1A1AA] hover:bg-[#27272A] rounded-xl transition-all">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-[#A1A1AA] hover:bg-[#27272A] rounded-xl transition-all">
                <div className="w-5 h-5 border-2 border-current rounded-md relative flex flex-col gap-[2px] p-[2px]">
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
