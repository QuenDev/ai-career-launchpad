"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import {
  FileText,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Hash,
  ArrowLeft,
} from "lucide-react";

interface AnalysisResult {
  score: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  strengths: string[];
  summary: string;
  weaknesses: string[];
  suggestions: string[];
  keywords_match: string[];
  keywords_missing: string[];
}

type Phase = "input" | "analyzing" | "result";

export default function DashboardPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("input");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  const handleAnalyze = async () => {
    if (resume.trim().length < 50) {
      toast.error("Resume is too short. Please paste your full resume.");
      return;
    }

    if (jobDescription.trim().length < 30) {
      toast.error(
        "Job description is too short. Please paste the full job description."
      );
      return;
    }

    setLoading(true);
    setPhase("analyzing");

    try {
      const res = await apiFetch("/analyze", {
        method: "POST",
        body: JSON.stringify({ resume, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Analysis failed");
        setPhase("input");
        return;
      }

      setResult(data);
      setPhase("result");

      apiFetch("/history/save", {
        method: "POST",
        body: JSON.stringify({
          resume,
          jobDescription,
          ...data,
        }),
      }).catch(console.error);

      toast.success("Analysis complete!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setPhase("input");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 50) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-primary/30">
      <Navbar />

      <div className="fixed inset-0 -z-50 mesh-gradient opacity-90" />
      <div className="fixed inset-0 -z-40 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-20" />

      <main className="flex-1 transition-all duration-500 pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {phase === "input" && (
              <motion.div
                key="input-phase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                <div className="lg:col-span-4 space-y-6">
                  <div className="space-y-3">
                    <Badge
                      variant="outline"
                      className="px-3 py-1 border-primary/20 bg-primary/5 text-foreground/80 backdrop-blur-sm"
                    >
                      <Sparkles className="w-3 h-3 mr-2" />
                      AI-Powered Resume Review
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                      Analyze Your{" "}
                      <span className="text-gradient">Resume Match.</span>
                    </h1>

                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                      Compare your resume against a target role and get
                      AI-powered match insights in seconds.
                    </p>
                  </div>

                  <div className="p-1 rounded-2xl bg-background/50 border border-border/50 backdrop-blur-xl">
                    <div className="flex flex-col gap-1 p-4 bg-background/40 rounded-xl">
                      <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                          1
                        </div>
                        Paste your resume
                      </div>

                      <div className="h-6 w-px bg-border/70 ml-4 my-1" />

                      <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <div className="w-8 h-8 rounded-full bg-muted/70 flex items-center justify-center">
                          2
                        </div>
                        Add the job description
                      </div>

                      <div className="h-6 w-px bg-border/70 ml-4 my-1" />

                      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-muted/70 flex items-center justify-center">
                          3
                        </div>
                        Generate your AI analysis
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bento-card group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg">Your Resume</h3>
                    </div>

                    <Textarea
                      placeholder="Paste your resume text here..."
                      className="min-h-[400px] bg-background/60 border-border/50 focus-visible:ring-primary/20 resize-none rounded-2xl p-4 text-sm leading-relaxed"
                      value={resume}
                      onChange={(e) => setResume(e.target.value)}
                    />

                    <p className="mt-3 text-xs text-muted-foreground">
                      Include your experience, skills, education, and measurable
                      achievements.
                    </p>
                  </Card>

                  <div className="space-y-6 flex flex-col">
                    <Card className="bento-card group flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                          <Target className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h3 className="font-bold text-lg">Job Description</h3>
                      </div>

                      <Textarea
                        placeholder="Paste the target job description here..."
                        className="min-h-[280px] h-full bg-background/60 border-border/50 focus-visible:ring-primary/20 resize-none rounded-2xl p-4 text-sm leading-relaxed"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />

                      <p className="mt-3 text-xs text-muted-foreground">
                        Use the full role requirements for the most accurate
                        keyword and score analysis.
                      </p>
                    </Card>

                    <Button
                      onClick={handleAnalyze}
                      disabled={loading}
                      size="lg"
                      className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all group"
                    >
                      Analyze Resume
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "analyzing" && (
              <motion.div
                key="loading-phase"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                  <div className="absolute inset-0 w-32 h-32 rounded-full border-t-4 border-primary animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight">
                    Analyzing your resume and job fit...
                  </h2>
                  <p className="text-muted-foreground animate-pulse">
                    Scoring alignment across skills, experience, education, and
                    keywords.
                  </p>
                </div>
              </motion.div>
            )}

            {phase === "result" && result && (
              <motion.div
                key="result-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      onClick={() => setPhase("input")}
                      className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground group"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Back to Editor
                    </Button>

                    <h2 className="text-3xl font-black tracking-tight">
                      Analysis Complete
                    </h2>
                    <p className="text-muted-foreground">
                      Review your score, keyword match, and next-step
                      recommendations below.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      disabled
                      className="rounded-xl border-border/60 opacity-60"
                    >
                      Save Report
                    </Button>
                    <Button disabled className="rounded-xl opacity-60">
                      Optimize Resume
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <Card className="lg:col-span-4 bento-card flex flex-col items-center justify-center min-h-[400px] bg-background/75 border-primary/15">
                    <div className="relative w-52 h-52 md:w-64 md:h-64">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-border"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray="276.46"
                          initial={{ strokeDashoffset: 276.46 }}
                          animate={{
                            strokeDashoffset:
                              276.46 - (276.46 * result.score) / 100,
                          }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className={getScoreColor(result.score)}
                          strokeLinecap="round"
                        />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className={`text-6xl md:text-7xl font-black mb-1 ${getScoreColor(result.score)}`}
                        >
                          {result.score}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                          Match Score
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 w-full mt-10 border-t border-border/50 pt-8 gap-4 px-4 text-center">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-muted-foreground uppercase">
                          Skills
                        </div>
                        <div className="text-lg font-bold text-purple-500 dark:text-purple-400">
                          {result.skills_score}%
                        </div>
                      </div>

                      <div className="space-y-1 border-x border-border/50">
                        <div className="text-xs font-bold text-muted-foreground uppercase">
                          Experience
                        </div>
                        <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
                          {result.experience_score}%
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-muted-foreground uppercase">
                          Education
                        </div>
                        <div className="text-lg font-bold text-emerald-500 dark:text-emerald-400">
                          {result.education_score}%
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="lg:col-span-8 bento-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 opacity-5 scale-150 rotate-12">
                      <Sparkles className="w-64 h-64 text-primary" />
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Lightbulb className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                          AI Summary
                        </p>
                        <h3 className="font-bold text-xl">Summary</h3>
                      </div>
                    </div>

                    <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground/90 mb-8 relative z-10">
                      "{result.summary}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Core Strengths
                        </h4>
                        <ul className="space-y-3">
                          {result.strengths?.map((s, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-3"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 dark:text-rose-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Focus Areas
                        </h4>
                        <ul className="space-y-3">
                          {result.weaknesses?.map((w, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-3"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className="lg:col-span-5 bento-card">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-blue-500/10">
                        <Hash className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <h3 className="font-bold text-lg">Keyword Insights</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                          Matched Keywords
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.keywords_match?.map((kw, i) => (
                            <Badge
                              key={i}
                              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-lg"
                            >
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                          Missing Keywords
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.keywords_missing?.map((kw, i) => (
                            <Badge
                              key={i}
                              className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 px-3 py-1 rounded-lg"
                            >
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="lg:col-span-7 bento-card bg-primary/5 border-primary/15">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg">
                          Actionable Suggestions
                        </h3>
                      </div>
                      <Badge className="bg-primary/20 text-foreground text-[10px] font-bold">
                        Actionable
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {result.suggestions?.map((s, i) => (
                        <div
                          key={i}
                          className="group p-4 rounded-2xl bg-background/55 border border-border/50 hover:border-primary/30 transition-all flex gap-4"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex-none flex items-center justify-center font-bold text-sm">
                            {i + 1}
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                            {s}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
