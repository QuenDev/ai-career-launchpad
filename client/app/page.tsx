"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Key,
  Sparkles,
  Rocket,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const featuresRef = useRef(null);
  const howRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const howInView = useInView(howRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      {/* Global Atmosphere */}
      <div className="fixed inset-0 -z-50 mesh-gradient opacity-90" />
      <div className="fixed inset-0 -z-40 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-20" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Badge
              variant="outline"
              className="px-4 py-1.5 border-primary/20 bg-primary/10 text-primary backdrop-blur-md animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Powered by Groq AI — Ultra Fast Inference
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 uppercase italic"
          >
            Elevate Your <br />
            <span className="text-gradient">Professional</span> <br />
            Trajectory.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium mb-12 leading-relaxed"
          >
            The ultimate AI-powered career optimization suite. Analyze resumes,
            detect keyword gaps, and receive institutional-grade feedback in
            seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest bg-background/20 backdrop-blur-md hover:bg-background/40 transition-all"
              >
                Login
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <div className="flex items-center gap-2 group cursor-default">
              <Shield className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Secure Access
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Free Forever
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <Zap className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Instant Results
              </span>
            </div>
          </motion.div>
        </div>

        {/* Visual Glimmer and Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-full max-w-5xl bg-primary/5 rounded-[3rem] blur-[120px] -z-10" />
      </section>

      {/* Bento Features Section */}
      <section ref={featuresRef} className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
            variants={stagger}
            className="text-center mb-12 space-y-4"
          >
            <motion.div variants={fadeIn}>
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/5 text-primary"
              >
                Capabilities
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic"
            >
              Unrivaled <span className="text-gradient">Intelligence.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium"
            >
              We've engineered a suite of tools designed to give you a
              definitive edge in the search for your next primary role.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[220px]">
            {/* Main Bento Item */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="md:col-span-8 md:row-span-2 glass rounded-[2.5rem] p-8 md:p-12 border-border/40 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-12 transform translate-x-12 -translate-y-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Brain className="w-64 h-64 text-primary" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Brain className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                    Advanced Resume <br /> Alignment Engine
                  </h3>
                  <p className="max-w-md text-muted-foreground font-medium leading-relaxed">
                    Our proprietary AI analyzes the semantic relationship
                    between your professional history and employer requirements,
                    identifying exactly where you shine and where you need
                    adjustment.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/5 border-primary/20 text-foreground transition-colors hover:bg-primary/10"
                  >
                    Semantic Search
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-primary/5 border-primary/20 text-foreground transition-colors hover:bg-primary/10"
                  >
                    NLP Matching
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-primary/5 border-primary/20 text-foreground transition-colors hover:bg-primary/10"
                  >
                    Contextual Scoring
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Side Bento Item 1 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={featuresInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-4 md:row-span-1 glass rounded-[2.5rem] p-8 border-border/40 hover:border-primary/20 transition-all group overflow-hidden"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">
                    Match Scoring
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Institutional-grade match scoring to gauge your
                    competitiveness.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Side Bento Item 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={featuresInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:col-span-4 md:row-span-1 glass rounded-[2.5rem] p-8 border-border/40 hover:border-emerald-500/20 transition-all group overflow-hidden"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">
                    Keyword Extraction
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Uncover critical skills missing from your professional
                    profile.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howRef} className="py-16 px-6 relative bg-background/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate={howInView ? "show" : "hidden"}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic"
            >
              The <span className="text-gradient">Workflow.</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-linear-to-r from-transparent via-primary/20 to-transparent -z-10" />

            {[
              {
                icon: Rocket,
                step: "01",
                title: "Initialize Profile",
                description:
                  "Paste your raw resume data into our secure optimization engine.",
                delay: 0.1,
              },
              {
                icon: Target,
                step: "02",
                title: "Target Specs",
                description:
                  "Input the specific requirements for your target professional role.",
                delay: 0.2,
              },
              {
                icon: Sparkles,
                step: "03",
                title: "Generate Insights",
                description:
                  "Receive a comprehensive diagnostic matching your profile to the role.",
                delay: 0.3,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: step.delay }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-28 w-28 rounded-[2rem] glass border-border/40 flex items-center justify-center relative mb-8 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground font-black text-[10px] flex items-center justify-center shadow-lg shadow-primary/30">
                    {step.step}
                  </div>
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-black tracking-tighter uppercase italic mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="glass rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden group shadow-[0_0_50px_rgba(var(--primary),0.05)]"
          >
            {/* Animated internal glimmer */}
            <div className="absolute top-0 -left-1/2 w-full h-full bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000" />

            <div className="relative z-10 space-y-8">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-primary animate-bounce" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                Ready to Land Your <br />
                <span className="text-gradient">Dream Project?</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-medium">
                Join the platform designed for professionals who prioritize
                clarity and speed in their career growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="h-14 px-12 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                  >
                    Start Analyzing Your Resume
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" /> Secure Access
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" /> No Credit Card
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" /> API DRIVEN
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
