"use client";

import { Rocket, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const techStack = [
    { name: "Next.js", color: "text-foreground" },
    { name: "Groq AI", color: "text-orange-500" },
    { name: "Supabase", color: "text-emerald-500" },
    { name: "Express", color: "text-slate-400" },
  ];

  return (
    <footer className="relative border-t bg-background/50 backdrop-blur-xl py-3 px-6 overflow-hidden">
      {/* Subtle top light effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 text-center md:text-left">
        {/* Brand Section */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              AI Career Launchpad
            </span>
          </Link>
          <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
            © {currentYear} • Open Source
          </div>
        </div>

        {/* Author Section */}
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
            Crafted with{" "}
            <Heart className="h-2.5 w-2.5 text-red-500 fill-red-500" /> by
          </p>
          <span className="text-xs font-black tracking-tight text-foreground/80">
            Quenedy Pabular
          </span>
        </div>

        {/* Tech Stack */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:block text-[8px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
            stack:
          </span>
          <div className="flex items-center gap-1">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="px-1.5 py-0.5 rounded border border-border/40 text-[8px] font-bold uppercase tracking-tight bg-background/40"
              >
                <span className={tech.color}>{tech.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Animated bottom beam */}
      <motion.div
        animate={{ opacity: [0.1, 0.4, 0.1], scaleX: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"
      />
    </footer>
  );
}
