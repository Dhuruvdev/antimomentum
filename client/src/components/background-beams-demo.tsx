"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function BackgroundBeamsDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background relative flex flex-col items-center justify-center antialiased px-4 py-12">
      <div className="max-w-2xl w-full mx-auto relative z-10">
        <h1 className="text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 text-center font-sans font-bold leading-tight">
          Join the waitlist
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto my-4 text-sm md:text-base text-center">
          Welcome to MailJet, the best transactional email service on the web.
          We provide reliable, scalable, and customizable email solutions for
          your business.
        </p>
        <div className="mt-8 flex flex-col gap-4 w-full max-w-md mx-auto">
          <Input
            type="email"
            placeholder="hi@manuarora.in"
            className="w-full h-12 text-base"
          />
          <Link href="/~" onClick={() => setLoading(true)}>
            <Button className="w-full h-12 text-base font-semibold" size="lg" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Get Started"
              )}
            </Button>
          </Link>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
