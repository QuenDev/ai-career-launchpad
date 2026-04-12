"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Rocket,
  Brain,
  Target,
  History,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Key,
} from "lucide-react";
import Link from "next/link";

// Reusable fade in animation
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Stagger container
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const howRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const howInView = useInView(howRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-linear-to-b from-background to-muted relative overflow-hidden">

        {/* Background blobs - Dynamic & Living */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear" as const,
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear" as const,
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-60"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative space-y-6 max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-2">
              <Zap className="h-3 w-3 text-primary" />
              Powered by Groq AI — fastest inference engine
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1 
          className="text-6xl md:text-7xl font-black text-center mb-6 tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-linear-to-r from-primary via-indigo-500 to-blue-600 bg-clip-text text-transparent">
            AI-Powered
          </span>
          <br />
          Career Success
        </motion.h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Paste your resume and any job description. Get an instant AI match
            score, keyword analysis, strengths, weaknesses and actionable
            suggestions.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap justify-center pt-2">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                Login
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-sm text-muted-foreground">
            Free to use · No credit card required · Built with Groq AI
          </p>
        </motion.div>
      </section>

      <Separator />

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? "show" : "hidden"}
        variants={stagger}
        className="py-12 px-6 bg-background"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "AI", label: "Powered Analysis" },
            { value: "100%", label: "Free to use" },
            { value: "Fast", label: "Groq inference" },
            { value: "∞", label: "Analyses available" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="text-center space-y-1"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <Separator />

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "show" : "hidden"}
        variants={stagger}
        className="py-20 px-6 bg-muted"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-muted-foreground text-lg">
              Powered by the latest AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Analysis",
                description:
                  "Get instant AI powered feedback on your resume tailored to each job description.",
                color: "bg-blue-100 dark:bg-blue-900/30",
                iconColor: "text-blue-600",
                highlight: true,
              },
              {
                icon: Target,
                title: "Match Score",
                description:
                  "Know exactly how well your resume matches the job before you even apply.",
                color: "bg-green-100 dark:bg-green-900/30",
                iconColor: "text-green-600",
              },
              {
                icon: Key,
                title: "Keyword Analysis",
                description:
                  "See exactly which keywords you have and what's missing from your resume.",
                color: "bg-yellow-100 dark:bg-yellow-900/30",
                iconColor: "text-yellow-600",
              },
              {
                icon: History,
                title: "Save History",
                description:
                  "Track all your past analyses and see how you improve over time.",
                color: "bg-purple-100 dark:bg-purple-900/30",
                iconColor: "text-purple-600",
              },
              {
                icon: Zap,
                title: "Instant Results",
                description:
                  "Powered by Groq AI — the fastest inference engine available today.",
                color: "bg-orange-100 dark:bg-orange-900/30",
                iconColor: "text-orange-600",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your data is protected with JWT authentication and secure storage.",
                color: "bg-red-100 dark:bg-red-900/30",
                iconColor: "text-red-600",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
              <motion.div 
                key={i} 
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className={`h-full transition-shadow duration-300 hover:shadow-xl ${feature.highlight ? "border-primary/50 shadow-md ring-1 ring-primary/20" : "border-border/50"}`}>
                  {feature.highlight && (
                    <div className="px-6 pt-4">
                      <Badge variant="secondary" className="text-xs">
                        ✦ Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="pt-6 flex flex-col gap-4">
                    <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
          </div>
        </div>
      </motion.section>

      <Separator />

      {/* How It Works Section */}
      <motion.section
        ref={howRef}
        initial="hidden"
        animate={howInView ? "show" : "hidden"}
        variants={stagger}
        className="py-20 px-6 bg-background"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to improve your resume
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Paste Your Resume",
                description:
                  "Copy and paste your resume into the dashboard text box.",
                color: "bg-primary",
              },
              {
                step: "2",
                title: "Add Job Description",
                description:
                  "Paste the job description you want to apply for.",
                color: "bg-primary",
              },
              {
                step: "3",
                title: "Get AI Feedback",
                description:
                  "Receive your match score, keywords and suggestions instantly.",
                color: "bg-primary",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className={`h-14 w-14 rounded-full ${item.color} flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg`}>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Separator />

      {/* CTA Section */}
      <motion.section
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "show" : "hidden"}
        variants={stagger}
        className="py-20 px-6 bg-primary text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative space-y-6">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold">
            Ready to land your dream job?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-primary-foreground/80 text-lg"
          >
            Start analyzing your resume with AI today. Free forever.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2 px-8">
                <CheckCircle className="h-4 w-4" />
                Start for Free Today
              </Button>
            </Link>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-6 text-sm text-primary-foreground/70"
          >
            <span>✓ Free forever</span>
            <span>✓ No credit card</span>
            <span>✓ Instant results</span>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}