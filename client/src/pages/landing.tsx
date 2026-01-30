import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Figma, 
  Upload, 
  Layout, 
  UserPlus, 
  Search, 
  TrendingUp,
  Zap,
  Globe,
  Cpu
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative py-20 px-6 border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 -z-10" />
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <Badge className="mb-4 py-1 px-3" variant="secondary">
            <TrendingUp className="w-3 h-3 mr-2" />
            AI Workspace Beta 2026
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Antimomentum <span className="text-primary">IDE</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            A universal workspace for researchers, developers, and designers. 
            Build the future with autonomous AI agents and isolated code execution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="hover-elevate active-elevate-2">
              Start Building
            </Button>
            <Button size="lg" variant="outline" className="hover-elevate">
              View Research
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        {/* News/Trends Section */}
        <section>
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              AI Intelligence Pulse
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live Research Stream
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-elevate border-primary/20 bg-primary/5">
              <CardHeader className="gap-1">
                <Badge className="w-fit" variant="outline">Trend: Agentic Workflows</Badge>
                <CardTitle className="text-lg">Mistral 7B Agent Gains</CardTitle>
                <CardDescription>Autonomous planning efficiency increased by 40% in recent benchmarks.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover-elevate border-accent/20 bg-accent/5">
              <CardHeader className="gap-1">
                <Badge className="w-fit" variant="outline">Update: Multi-Modal</Badge>
                <CardTitle className="text-lg">Screenshot Cloning</CardTitle>
                <CardDescription>VLM models now achieve 95% fidelity in UI reconstruction from images.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover-elevate border-muted/20 bg-muted/5">
              <CardHeader className="gap-1">
                <Badge className="w-fit" variant="outline">Breaking: Docker</Badge>
                <CardTitle className="text-lg">Isolated Execution</CardTitle>
                <CardDescription>New security layer for Node/Python containers in collaborative environments.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-elevate h-full flex flex-col justify-between p-2">
            <CardHeader>
              <Camera className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Clone a Screenshot</CardTitle>
              <CardDescription>Upload a UI screenshot and our AI will rebuild the code for you instantly.</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full" variant="ghost">Launch Tool</Button>
            </div>
          </Card>

          <Card className="hover-elevate h-full flex flex-col justify-between p-2">
            <CardHeader>
              <Figma className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Import from Figma</CardTitle>
              <CardDescription>Connect your Figma files and export interactive components directly to your workspace.</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full" variant="ghost">Connect Account</Button>
            </div>
          </Card>

          <Card className="hover-elevate h-full flex flex-col justify-between p-2">
            <CardHeader>
              <Upload className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Upload a Project</CardTitle>
              <CardDescription>Drag and drop your existing projects into an isolated Docker environment.</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full" variant="ghost">Browse Files</Button>
            </div>
          </Card>

          <Card className="hover-elevate h-full flex flex-col justify-between p-2">
            <CardHeader>
              <Layout className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Landing Page Builder</CardTitle>
              <CardDescription>Describe your brand and let AI generate high-converting landing pages.</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full" variant="ghost">Open Builder</Button>
            </div>
          </Card>
        </section>

        {/* Sign Up Form Section */}
        <section className="bg-card rounded-lg border p-8 md:p-12 shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Join the Future of Work</h2>
              <p className="text-muted-foreground mb-6">
                Get early access to our universal IDE and start building with AI today.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <span>Instant Docker Workspaces</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Cpu className="w-4 h-4 text-primary" />
                  </div>
                  <span>Mistral-Powered Agents</span>
                </div>
              </div>
            </div>

            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Create Account</CardTitle>
                <CardDescription>Start your 14-day free trial</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full" type="button">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6 bg-muted/30 mt-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Layout className="w-6 h-6 text-primary" />
            Antimomentum
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Antimomentum Beta. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
