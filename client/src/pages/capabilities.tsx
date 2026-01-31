import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Search, 
  Code, 
  Terminal, 
  Cpu, 
  Globe, 
  Zap, 
  ShieldCheck,
  Layers,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const capabilities = [
  {
    title: "Self-Thinking & Reasoning",
    description: "The agent performs an internal 'Chain of Thought' analysis before executing any task. It breaks down complex prompts into logical steps, anticipating challenges and potential solutions.",
    icon: Brain,
    tags: ["Autonomous", "Reasoning", "Chain-of-Thought"],
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Deep Internet Research",
    description: "Equipped with real-time web search capabilities, the agent can scour the internet for the latest information on any topic, providing cited and summarized findings.",
    icon: Search,
    tags: ["Real-time", "Fact-checking", "Web-Search"],
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    title: "Isolated Code Execution",
    description: "The agent can write and run code in a secure, isolated environment. It tests logic, performs calculations, and generates data visualizations in real-time.",
    icon: Code,
    tags: ["Sandbox", "Security", "Polyglot"],
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Task Orchestration",
    description: "Automatically coordinates multiple tools (Search, Code, Summarization) to complete high-level objectives without manual intervention.",
    icon: Layers,
    tags: ["Multi-step", "Orchestration", "Automated"],
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "Intelligent Summarization",
    description: "Compresses vast amounts of information into concise, actionable summaries while preserving key technical details and nuances.",
    icon: Cpu,
    tags: ["NLP", "Concise", "Extraction"],
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
    title: "State Persistence",
    description: "Every thought, plan, and execution step is stored persistently, allowing you to review the agent's history and logic at any time.",
    icon: ShieldCheck,
    tags: ["Reliable", "History", "Database"],
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  }
];

export default function CapabilitiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 py-1 px-3" variant="secondary">
              <Sparkles className="w-3 h-3 mr-2" />
              Advanced AI Agent
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Core <span className="text-primary">Capabilities</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our autonomous agent is designed for high-level reasoning and execution. 
              Witness the power of transparent AI that thinks before it acts.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate border-primary/10 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className={`p-3 w-fit rounded-lg ${cap.bg} mb-4`}>
                    <cap.icon className={`w-8 h-8 ${cap.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{cap.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {cap.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cap.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="mt-24 p-8 md:p-12 bg-primary/5 rounded-3xl border border-primary/10 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            Ready to deploy your first agent?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            Experience the future of autonomous research and development. 
            Antimomentum provides the infrastructure, the agent provides the intelligence.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/" className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity">
              Get Started
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
