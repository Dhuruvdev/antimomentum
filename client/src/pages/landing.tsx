import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Search, 
  FileText, 
  Sparkles, 
  Globe, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Download,
  BookOpen,
  Layout,
  UserPlus,
  Cpu
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default function LandingPage() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" }
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary p-1 rounded-md">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            Antimomentum
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/capabilities" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Capabilities</Link>
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
            <Button className="hover-elevate active-elevate-2 px-6 rounded-full font-bold">Join Waitlist</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <Badge className="mb-6 py-1.5 px-4 text-xs font-bold uppercase tracking-wider" variant="secondary">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
            Waitlist Now Open for Beta v1
          </Badge>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            The Future of <br />
            <span className="text-primary italic">Deep Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 font-medium">
            Join the waitlist for Antimomentum. Deep research, structured documentation, and conceptual design—powered by autonomous reasoning.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold hover-elevate active-elevate-2">
              Secure Early Access
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/capabilities">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg font-bold hover-elevate">
                Explore Capabilities
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24 space-y-32">
        {/* Research Pulse Section */}
        <section id="features">
          <div className="flex items-center justify-between mb-12 gap-4 flex-wrap">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
                <Globe className="w-10 h-10 text-primary" />
                Intelligence Pulse
              </h2>
              <p className="text-muted-foreground text-lg">Real-time updates from our global research network.</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
              <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Research Stream</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-elevate border-primary/10 bg-card/50 backdrop-blur-sm p-2 group">
              <CardHeader className="gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg w-fit group-hover:bg-blue-500/20 transition-colors">
                  <Brain className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle className="text-xl">Chain-of-Thought</CardTitle>
                <CardDescription className="text-base">Transparent reasoning before every research task. See how the agent thinks.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover-elevate border-accent/10 bg-card/50 backdrop-blur-sm p-2 group">
              <CardHeader className="gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg w-fit group-hover:bg-green-500/20 transition-colors">
                  <Search className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle className="text-xl">Deep Information Extraction</CardTitle>
                <CardDescription className="text-base">Scours the internet to find the most relevant and up-to-date data for your topics.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover-elevate border-muted/10 bg-card/50 backdrop-blur-sm p-2 group">
              <CardHeader className="gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg w-fit group-hover:bg-purple-500/20 transition-colors">
                  <Download className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle className="text-xl">Instant Documentation</CardTitle>
                <CardDescription className="text-base">Generate high-quality PDF and Word documents from your research findings automatically.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="hover-elevate border-primary/10 bg-gradient-to-b from-card to-background flex flex-col justify-between p-4 rounded-3xl">
            <CardHeader className="gap-4">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Alive Documents</CardTitle>
              <CardDescription className="text-lg leading-relaxed">Dynamic research that evolves as you interact. Real-time updates and formatting.</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full h-12 rounded-2xl font-bold" variant="secondary">Launch Editor</Button>
            </div>
          </Card>

          <Card className="hover-elevate border-primary/10 bg-gradient-to-b from-card to-background flex flex-col justify-between p-4 rounded-3xl">
            <CardHeader className="gap-4">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit">
                <Layout className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Design Conceptualizing</CardTitle>
              <CardDescription className="text-lg leading-relaxed">Turn abstract research into professional UI/UX frameworks and design drafts.</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full h-12 rounded-2xl font-bold" variant="secondary">View Canvas</Button>
            </div>
          </Card>

          <Card className="hover-elevate border-primary/10 bg-gradient-to-b from-card to-background flex flex-col justify-between p-4 rounded-3xl">
            <CardHeader className="gap-4">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Knowledge Synthesis</CardTitle>
              <CardDescription className="text-lg leading-relaxed">Synthesize vast amounts of information into concise, structured knowledge bases.</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full h-12 rounded-2xl font-bold" variant="secondary">Browse Wiki</Button>
            </div>
          </Card>

          <Card className="hover-elevate border-primary/10 bg-gradient-to-b from-card to-background flex flex-col justify-between p-4 rounded-3xl">
            <CardHeader className="gap-4">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Architectural Logic</CardTitle>
              <CardDescription className="text-lg leading-relaxed">Deep analysis of complex systems and architectures, powered by advanced reasoning.</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full h-12 rounded-2xl font-bold" variant="secondary">Explore Engine</Button>
            </div>
          </Card>
        </section>

        {/* Sign Up Form Section */}
        <section id="pricing" className="bg-card rounded-[3rem] border p-8 md:p-20 shadow-2xl max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Elevate Your <br /><span className="text-primary">Intelligence</span></h2>
              <p className="text-xl text-muted-foreground mb-10">
                Join our private beta and experience the next generation of autonomous research and documentation.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-lg font-medium">Instant Alive Documents</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-lg font-medium">Chain-of-Thought Reasoning</span>
                </div>
              </div>
            </div>

            <Card className="border shadow-2xl rounded-3xl p-4 bg-background">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Get Early Access</CardTitle>
                <CardDescription className="text-base">Limited spots available for the beta launch.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Work Email</FormLabel>
                          <FormControl>
                            <Input className="h-12 rounded-xl bg-muted/50 border-none focus:bg-background transition-colors" placeholder="name@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Create Password</FormLabel>
                          <FormControl>
                            <Input className="h-12 rounded-xl bg-muted/50 border-none focus:bg-background transition-colors" type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover-elevate active-elevate-2" type="button">
                      <UserPlus className="w-5 h-5 mr-2" />
                      Join the Beta
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-20 px-6 bg-muted/20 mt-32">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
              <div className="bg-primary p-1.5 rounded-lg">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              Antimomentum
            </div>
            <p className="text-muted-foreground max-w-xs">
              The universal workspace for high-level research, deep analysis, and professional documentation.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/capabilities">Capabilities</Link></li>
                <li><Link href="#">Features</Link></li>
                <li><Link href="#">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#">Privacy</Link></li>
                <li><Link href="#">Terms</Link></li>
                <li><Link href="#">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-muted text-center text-sm text-muted-foreground">
          © 2026 Antimomentum AI. Empowering the future of research.
        </div>
      </footer>
    </div>
  );
}
