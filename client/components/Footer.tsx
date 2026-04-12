"use client";

import { Rocket, Globe, Terminal, Cpu, Heart } from "lucide-react";
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
    <footer className="relative border-t bg-background/80 backdrop-blur-xl py-12 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10 text-center md:text-left">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-2 items-center md:items-start">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">AI Career Launchpad</span>
          </Link>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
            © {currentYear} • Open Source Project
          </div>
        </div>

        {/* Author Section */}
        <div className="flex flex-col items-center gap-1">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            Crafted with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> by
          </p>
          <h3 className="text-sm font-black tracking-tight text-foreground/80">
            Quenedy Pabular
          </h3>
        </div>

        {/* Tech Stack Section */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Powered By</span>
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            {techStack.map((tech) => (
              <span 
                key={tech.name}
                className="px-2 py-0.5 rounded bg-muted/50 border border-border/50 text-[9px] font-bold uppercase tracking-wider"
              >
                <span className={tech.color}>{tech.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animation line at bottom */}
      <motion.div 
        animate={{ scaleX: [0.8, 1, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" 
      />
    </footer>
  );
}
