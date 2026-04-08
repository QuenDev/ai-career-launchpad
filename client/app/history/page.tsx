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
import Navbar from "@/components/Navbar";

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
    <main className="min-h-screen bg-slate-100 p-8">
      <Navbar />
      <div className="max-w-3xl mx-auto flex flex-col gap-6 mt-8">
        <Skeleton className="h-8 w-48 mx-auto" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 flex flex-col gap-4">
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
        <main className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Analysis History
            </h1>
        
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {history?.length === 0 ? (
                <p className="text-center text-slate-500">
                    No analysis yet. Go analyze a resume!
                </p>
            ) : (
               history?.map((analysis) => (
  <Card key={analysis.id} className="shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        
        {/* Score Circle */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                className="stroke-muted"
                strokeWidth="10"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className={getScoreColor(analysis.score)}
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * analysis.score) / 100}
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}%
              </span>
            </div>
          </div>

          {/* Category Bars */}
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Skills</span>
                <span>{analysis.skills_score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${analysis.skills_score}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Experience</span>
                <span>{analysis.experience_score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${analysis.experience_score}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Education</span>
                <span>{analysis.education_score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${analysis.education_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date + Delete */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(analysis.created_at).toLocaleDateString()}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(analysis.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
        <p className="text-xs leading-relaxed text-muted-foreground italic">
          "{analysis.summary || "Complete analysis of resume vs. job description match session."}"
        </p>
      </div>

      {/* Keywords */}
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1.5">
            ✅ Keywords Found
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords_match?.map((keyword, i) => (
              <Badge key={i} variant="secondary" className="bg-green-50 text-green-700 border-green-100 text-[10px]">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 mb-1.5">
            ❌ Keywords Missing
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords_missing?.map((keyword, i) => (
              <Badge key={i} variant="secondary" className="bg-red-50 text-red-700 border-red-100 text-[10px]">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Strengths
          </h3>
          <ul className="space-y-1">
            {analysis.strengths?.map((s, i) => (
              <li key={i} className="text-xs flex gap-2">
                <span className="text-green-500">✦</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Focus Areas
          </h3>
          <ul className="space-y-1">
            {analysis.weaknesses?.map((w, i) => (
              <li key={i} className="text-xs flex gap-2 text-muted-foreground">
                <span className="text-red-400">○</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="pt-2 border-t">
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
          Suggestions
        </h3>
        <div className="flex flex-col gap-1.5">
          {analysis.suggestions?.map((s, i) => (
            <div key={i} className="text-xs p-2.5 rounded-lg bg-blue-50/50 border border-blue-100/50 text-blue-800 flex gap-2">
              <span className="font-bold text-blue-400">{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
))
            )}
        </div>

        </main>
        </>
    );

}
