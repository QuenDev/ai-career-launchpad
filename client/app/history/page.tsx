"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Analysis {
    id:  number;
    resume: string;
    job_description: string;
    score: number;
    skills_score: number;
    experience_score: number;
    education_score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    keywords_match: string[];
    keywords_missing: string[];
    summary: string;
    created_at: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"date" | "score">("date");

    useEffect(() => {
        if(!isLoggedIn()) {
            router.push("/login");
            return;
        }

    //fetch history
    const fetchHistory = async () => {
        try {
            const res = await apiFetch("/history");
            const data = await res.json();
            setHistory(data.history);
       } catch(err) {
        console.error("Failed to fetch history");
       } finally {
        setLoading(false);
       }
    };
    
     fetchHistory();
 },[]);
 
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      const res = await apiFetch(`/history/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setHistory(history.filter((item) => item.id !== id));
        toast.success("Analysis deleted");
      } else {
        toast.error(data.error || "Failed to delete analysis");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  }; 

const getScoreColor = (score: number) => {
  if (score >= 75) return "text-green-600 stroke-green-600";
  if (score >= 50) return "text-yellow-500 stroke-yellow-500";
  return "text-red-600 stroke-red-600";
};

   if (loading) {
  return (
    <main className="min-h-screen bg-muted p-8">
      <Navbar />
      <div className="max-w-3xl mx-auto flex flex-col gap-6 mt-8">
        <Skeleton className="h-8 w-48 mx-auto" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-background rounded-lg p-6 flex flex-col gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </main>
  );
}

    return (
        <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 p-8 relative overflow-hidden">
            
            {/* Consistent Background Blobs */}
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" as const }}
              className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10"
            />
            <motion.div
              animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
              className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50 -z-10"
            />

            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold mb-8 text-center tracking-tight"
            >
                <span className="bg-linear-to-r from-primary via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                    Analysis History
                </span>
            </motion.h1>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto flex flex-col gap-6 relative z-10"
        >
            {history?.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    No analysis yet. Go analyze a resume!
                </p>
            ) : (
                <AnimatePresence mode="popLayout">
                  {history?.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -20 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        type: "spring",
                        damping: 20,
                        stiffness: 100
                      }}
                    >
                      <Card className="shadow-lg border-border/50 bg-background/80 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-2 bg-muted/20">
                          <div className="flex items-center justify-between">
                            
                            {/* Score Circle */}
                            <div className="flex items-center gap-6">
                              <div className="relative h-20 w-20">
                                <svg className="h-full w-full" viewBox="0 0 100 100">
                                  <circle
                                    className="stroke-muted/40"
                                    strokeWidth="10"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                  />
                                  <motion.circle
                                    initial={{ strokeDashoffset: 251.2 }}
                                    animate={{ strokeDashoffset: 251.2 - (251.2 * analysis.score) / 100 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={getScoreColor(analysis.score)}
                                    strokeWidth="10"
                                    strokeDasharray={251.2}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className={`text-xl font-black ${getScoreColor(analysis.score)}`}>
                                    {analysis.score}%
                                  </span>
                                </div>
                              </div>

                              {/* Category Bars */}
                              <div className="flex flex-col gap-2 min-w-[180px]">
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                    <span>Skills</span>
                                    <span className="text-purple-600">{analysis.skills_score}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${analysis.skills_score}%` }}
                                      className="h-full bg-purple-500"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                    <span>Experience</span>
                                    <span className="text-blue-600">{analysis.experience_score}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${analysis.experience_score}%` }}
                                      className="h-full bg-blue-500"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                    <span>Education</span>
                                    <span className="text-emerald-600">{analysis.education_score}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${analysis.education_score}%` }}
                                      className="h-full bg-emerald-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Date + Delete */}
                            <div className="flex flex-col items-end gap-3">
                              <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                {new Date(analysis.created_at).toLocaleDateString()}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(analysis.id)}
                                className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-100 h-8"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-6 p-6">
                          {/* Summary */}
                          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <p className="text-xs leading-relaxed text-muted-foreground italic font-medium">
                              "{analysis.summary || "Complete analysis of resume vs. job description match session."}"
                            </p>
                          </div>

                          {/* Keywords */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Keywords Found
                              </h3>
                              <div className="flex flex-wrap gap-1.5">
                                {analysis.keywords_match?.map((keyword, i) => (
                                  <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-700 border-green-200/50 text-[10px]">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                Keywords Missing
                              </h3>
                              <div className="flex flex-wrap gap-1.5">
                                {analysis.keywords_missing?.map((keyword, i) => (
                                  <Badge key={i} variant="secondary" className="bg-red-500/10 text-red-700 border-red-200/50 text-[10px]">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Strengths / Weaknesses */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div>
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <span className="h-0.5 w-3 bg-primary/30 rounded-full" />
                                Strengths
                              </h3>
                              <ul className="space-y-1.5">
                                {analysis.strengths?.map((s, i) => (
                                  <li key={i} className="text-[11px] flex gap-2">
                                    <span className="text-primary font-bold tracking-tighter">✦</span>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <span className="h-0.5 w-3 bg-primary/30 rounded-full" />
                                Focus Areas
                              </h3>
                              <ul className="space-y-1.5">
                                {analysis.weaknesses?.map((w, i) => (
                                  <li key={i} className="text-[11px] flex gap-2 text-muted-foreground">
                                    <span className="text-amber-500 font-bold tracking-tighter">○</span>
                                    {w}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Suggestions */}
                          <div className="pt-4 border-t border-border/50">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                              <span className="h-4 w-1 bg-blue-500 rounded-full" />
                              Suggestions
                            </h3>
                            <div className="flex flex-col gap-2">
                              {analysis.suggestions?.map((s, i) => (
                                <div key={i} className="text-[11px] p-3 rounded-lg bg-blue-500/5 border border-blue-200/20 text-muted-foreground flex gap-3 hover:bg-blue-500/10 transition-colors">
                                  <span className="font-bold text-blue-500 shrink-0">{i + 1}</span>
                                  {s}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
            )}
        </motion.div>

        </main>
        <Footer />
        </>
    );

}
