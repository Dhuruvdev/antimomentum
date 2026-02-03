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
  Cpu,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll(".gsap-reveal"), {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
        }
      });
    }

    // Floating animation for logo
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Google-style Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div ref={logoRef} className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary">
                <path d="M12 2L2 19h20L12 2zm0 3.8l7.5 12.7H4.5L12 5.8z" />
              </svg>
            </div>
            <span className="text-xl font-medium tracking-tight text-neutral-900">Google <span className="font-normal text-neutral-500">Antigravity</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <button className="text-sm font-medium text-neutral-600 hover:text-black transition-colors flex items-center gap-1">Product <ChevronDown className="w-3 h-3" /></button>
            <button className="text-sm font-medium text-neutral-600 hover:text-black transition-colors flex items-center gap-1">Use Cases <ChevronDown className="w-3 h-3" /></button>
            <Link href="#" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">Pricing</Link>
            <Link href="#" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">Blog</Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Button className="hidden md:flex bg-neutral-100 hover:bg-neutral-200 text-black border-none px-6 rounded-full font-medium h-10 transition-all shadow-none">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white pt-20 px-6 lg:hidden"
          >
            <div className="space-y-6">
              {['Product', 'Use Cases', 'Pricing', 'Blog', 'Resources'].map((item) => (
                <div key={item} className="text-2xl font-medium text-neutral-900 border-b border-neutral-100 pb-4 flex justify-between items-center">
                  {item}
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header ref={heroRef} className="relative pt-48 pb-32 px-6 overflow-hidden text-center bg-[#fafafa]">
        {/* Subtle Dots Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <div className="gsap-reveal flex items-center gap-2 mb-12">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-primary">
              <path d="M12 2L2 19h20L12 2zm0 3.8l7.5 12.7H4.5L12 5.8z" />
            </svg>
            <span className="text-3xl font-medium tracking-tight">Google Antigravity</span>
          </div>

          <h1 className="gsap-reveal text-5xl md:text-7xl font-medium tracking-tight mb-16 leading-[1.1] text-neutral-900">
            Experience liftoff with the <br />
            next-generation IDE
          </h1>
          
          <div className="gsap-reveal flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <Link href="/~">
              <Button className="h-14 px-10 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-lg flex items-center gap-3 transition-all">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                Download for Linux
              </Button>
            </Link>
            <Button variant="ghost" className="h-14 px-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black font-medium text-lg">
              Explore use cases
            </Button>
          </div>
        </div>
      </header>

      {/* Video/Preview Section */}
      <section className="py-24 px-6 bg-white flex flex-col items-center">
        <div className="max-w-5xl w-full aspect-video rounded-[2.5rem] bg-black overflow-hidden shadow-2xl relative group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
            <div className="grid grid-cols-2 gap-4 w-full h-full opacity-60">
              <div className="bg-neutral-800 rounded-xl" />
              <div className="bg-neutral-900 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="flex justify-center gap-8 mt-16 flex-wrap">
          {[Brain, Layout, Cpu, Globe, Zap].map((Icon, i) => (
            <div key={i} className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100 hover:scale-110 transition-transform cursor-pointer">
              <Icon className="w-6 h-6 text-neutral-400" />
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-24">
          <div className="space-y-6">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-neutral-500 border-neutral-200 font-normal">Available at no charge</Badge>
            <h2 className="text-4xl md:text-5xl font-medium text-neutral-900 leading-tight">
              For developers <br />
              Achieve new heights
            </h2>
            <div className="pt-4">
              <Button className="h-12 px-10 rounded-full bg-black text-white hover:bg-neutral-800">Download</Button>
            </div>
          </div>

          <div className="space-y-6 pt-16">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-neutral-500 border-neutral-200 font-normal">Coming soon</Badge>
            <h2 className="text-4xl md:text-5xl font-medium text-neutral-900 leading-tight">
              For organizations <br />
              Level up your entire team
            </h2>
            <div className="pt-4">
              <Button variant="secondary" className="h-12 px-10 rounded-full bg-neutral-100 text-black hover:bg-neutral-200">Notify me</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#fafafa] border-t border-neutral-100 py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary">
                <path d="M12 2L2 19h20L12 2zm0 3.8l7.5 12.7H4.5L12 5.8z" />
              </svg>
              <span className="text-xl font-medium tracking-tight text-neutral-900">Google <span className="font-normal text-neutral-500">Antigravity</span></span>
            </div>
            <p className="text-neutral-500 text-sm">Empowering the next generation of researchers.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-sm">
            <div className="space-y-4">
              <h4 className="font-medium text-black">Product</h4>
              <ul className="space-y-3 text-neutral-500">
                <li>Overview</li>
                <li>Pricing</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-black">Solutions</h4>
              <ul className="space-y-3 text-neutral-500">
                <li>Enterprise</li>
                <li>Startups</li>
                <li>Education</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-black">Company</h4>
              <ul className="space-y-3 text-neutral-500">
                <li>About</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-black">Social</h4>
              <ul className="space-y-3 text-neutral-500">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© 2026 Google Antigravity. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
