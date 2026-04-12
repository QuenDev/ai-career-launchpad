"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

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

const getScoreColor = (score: number) => {
  if (score >= 75) return "text-green-600 stroke-green-600";
  if (score >= 50) return "text-yellow-500 stroke-yellow-500";
  return "text-red-600 stroke-red-600";
};

export default function DashboardPage() {
  const router = useRouter();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, []);

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleAnalyze = async () => {
    toast.dismiss();
    //validate inputs
    if (resume.trim().length < 50) {
      toast.error("Resume is too short. Please paste your full resume.");
      return;
    }

    if (jobDescription.trim().length < 30) {
      toast.error(
        "Job descriptions is too short. Please paste the full job description"
      );
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const res = await apiFetch("/analyze", {
        method: "POST",
        body: JSON.stringify({ resume, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setResult(data);

      //auto save analysis
      await apiFetch("/history/save", {
        method: "POST",
        body: JSON.stringify({
          resume,
          jobDescription,
          score: data.score,
          skills_score: data.skills_score,
          experience_score: data.experience_score,
          education_score: data.education_score,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          suggestions: data.suggestions,
          keywords_match: data.keywords_match,
          keywords_missing: data.keywords_missing,
          summary: data.summary,
        }),
      });

      toast.success("Analysis saved to history!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 p-4 md:p-8 relative overflow-hidden">
        
        {/* Consistent Background Blobs */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 -z-10"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" as const }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50 -z-10"
        />

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-10 text-center tracking-tight"
        >
          <span className="bg-linear-to-r from-primary via-indigo-500 to-blue-600 bg-clip-text text-transparent">
            AI Career Launchpad
          </span>
        </motion.h1>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
        >
          <motion.div variants={item} className="lg:col-span-5 flex flex-col gap-6">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Paste your Resume</CardTitle>
              </CardHeader>

              <CardContent>
                <Textarea
                  placeholder="Paste your resume here..."
                  className="min-h-40 bg-background/50 backdrop-blur-sm focus-visible:ring-primary/20"
                  value={resume}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setResume(e.target.value)
                  }
                />
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Paste Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-40 bg-background/50 backdrop-blur-sm focus-visible:ring-primary/20"
                  value={jobDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setJobDescription(e.target.value)
                  }
                />
              </CardContent>
            </Card>

            <Button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : "Analyze Resume"}
            </Button>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                >
                  <Card className="sticky top-8 shadow-xl border-primary/10 backdrop-blur-xl bg-background/80">
                    <CardHeader className="flex flex-col items-center pb-2 bg-muted/30">
                      <div className="relative h-32 w-32 mb-2">
                        {/* Background Circle */}
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle
                            className="stroke-muted/50"
                            strokeWidth="8"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          {/* Progress Circle */}
                          <motion.circle
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * result.score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`transition-all ${getScoreColor(result.score)}`}
                            strokeWidth="8"
                            strokeDasharray={251.2}
                            strokeLinecap="round"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`text-4xl font-black ${getScoreColor(result.score)}`}
                          >
                            {result.score}%
                          </motion.span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                            Match Score
                          </span>
                        </div>
                      </div>

                      {/* Category Scores */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border/50 w-full mt-6 py-6 px-4">
                        {/* Skills Score */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Skills</span>
                            <span className="text-purple-600">{result.skills_score}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.skills_score}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full bg-linear-to-r from-purple-500 to-indigo-500"
                            />
                          </div>
                        </div>
                        {/* Experience Score */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Experience</span>
                            <span className="text-blue-600">{result.experience_score}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.experience_score}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full bg-linear-to-r from-blue-500 to-indigo-500"
                            />
                          </div>
                        </div>
                        {/* Education Score */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Education</span>
                            <span className="text-emerald-600">{result.education_score}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.education_score}%` }}
                              transition={{ duration: 1, delay: 0.4 }}
                              className="h-full bg-linear-to-r from-emerald-500 to-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-8 pt-6">
                      {/* Summary */}
                      <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 relative">
                        <span className="absolute -top-3 left-4 px-2 bg-background text-[10px] font-bold uppercase tracking-widest text-primary">AI Executive Summary</span>
                        <p className="text-sm leading-relaxed text-foreground italic font-medium">
                          "{result.summary}"
                        </p>
                      </div>

                      {/* Keywords */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-green-600 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Keywords Found
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {result.keywords_match?.map((keyword, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-green-500/10 text-green-700 border-green-200/50 hover:bg-green-500/20 transition-colors text-[10px] py-1 px-3 rounded-md"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-600 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            Keywords Missing
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {result.keywords_missing?.map((keyword, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-red-500/10 text-red-700 border-red-200/50 hover:bg-red-500/20 transition-colors text-[10px] py-1 px-3 rounded-md"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Strengths / Weaknesses Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <span className="h-1 w-4 bg-primary/30 rounded-full" />
                            Top Strengths
                          </h3>
                          <ul className="space-y-3">
                            {result.strengths?.map((s, i) => (
                              <li key={i} className="text-sm flex gap-3 items-start group">
                                <span className="text-primary font-bold mt-0.5 group-hover:scale-125 transition-transform">✦</span>
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                             <span className="h-1 w-4 bg-primary/30 rounded-full" />
                            Focus Areas
                          </h3>
                          <ul className="space-y-3">
                            {result.weaknesses?.map((w, i) => (
                              <li
                                key={i}
                                className="text-sm flex gap-3 items-start group"
                              >
                                <span className="text-amber-500 font-bold mt-0.5 group-hover:scale-125 transition-transform">○</span>
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Suggestions */}
                      <div className="pt-8 border-t border-border/50">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-3">
                          <span className="h-6 w-1 bg-blue-600 rounded-full" />
                          Actionable Suggestions
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {result.suggestions?.map((s, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ x: 5 }}
                              className="text-sm p-4 rounded-xl bg-blue-500/5 border border-blue-200/20 text-foreground flex gap-4 transition-colors hover:bg-blue-500/10"
                            >
                              <span className="flex-none h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-blue-600/10">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{s}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-3xl bg-background/50 text-muted-foreground transition-all duration-500 hover:bg-background/80 hover:border-primary/30 backdrop-blur-sm"
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 rotate-12"
                  >
                    <span className="text-4xl">✨</span>
                  </motion.div>
                  <h3 className="text-2xl font-black text-foreground mb-4 italic tracking-tight">
                    Ready to accelerate your career?
                  </h3>
                  <p className="max-w-xs mx-auto text-muted-foreground leading-relaxed">
                    Paste your resume and job requirements on the left to unlock
                    your instant <span className="text-primary font-bold">AI analysis</span> and match scores.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
