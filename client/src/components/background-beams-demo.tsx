"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";

import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function BackgroundBeamsDemo() {
  return (
    <div className="h-screen w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 text-center font-sans font-bold">
          Join the waitlist
        </h1>
        <p></p>
        <p className="text-muted-foreground max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Welcome to MailJet, the best transactional email service on the web.
          We provide reliable, scalable, and customizable email solutions for
          your business. Whether you&apos;re sending order confirmations,
          password reset emails, or promotional campaigns, MailJet has got you
          covered.
        </p>
        <div className="mt-4 relative z-10 flex flex-col gap-4">
          <Input
            type="email"
            placeholder="hi@manuarora.in"
            className="w-full"
          />
          <Link href="/~">
            <Button className="w-full" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
