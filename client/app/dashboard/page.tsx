"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
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
      <main className="min-h-screen bg-slate-50 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-10 text-center">
          {" "}
          AI Career Launchpad{" "}
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paste your Resume</CardTitle>
              </CardHeader>

              <CardContent>
                <Textarea
                  placeholder="Paste your resume here..."
                  className="min-h-40"
                  value={resume}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setResume(e.target.value)
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paste Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-40"
                  value={jobDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setJobDescription(e.target.value)
                  }
                />
              </CardContent>
            </Card>

            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </div>

          <div className="lg:col-span-7">
            {result ? (
              <Card className="sticky top-8 shadow-lg border-primary/10">
                <CardHeader className="flex flex-col items-center pb-2">
                  <div className="relative h-32 w-32">
                    {/* Background Circle */}
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="stroke-muted"
                        strokeWidth="8"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      {/* Progress Circle */}
                      <circle
                        className={`transition-all duration-1000 ease-out ${getScoreColor(result.score)}`}
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className={`text-3xl font-bold ${getScoreColor(result.score)}`}
                      >
                        {result.score}%
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Match Score
                      </span>
                    </div>
                  </div>

                  {/* Category Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b w-full mt-6 pb-6">
                    {/* Skills Score */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Skills</span>
                        <span>{result.skills_score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-1000 bg-purple-500"
                          style={{ width: `${result.skills_score}%` }}
                        />
                      </div>
                    </div>
                    {/* Experience Score */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Experience</span>
                        <span>{result.experience_score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-1000 bg-blue-500"
                          style={{ width: `${result.experience_score}%` }}
                        />
                      </div>
                    </div>
                    {/* Education Score */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Education</span>
                        <span>{result.education_score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-1000 bg-emerald-500"
                          style={{ width: `${result.education_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 pt-2">
                  {/* Summary */}
                  <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                    <p className="text-sm leading-relaxed text-muted-foreground italic font-medium">
                      "{result.summary}"
                    </p>
                  </div>

                  {/* Keywords */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Keywords Found
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywords_match.map((keyword, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-green-50 text-green-700 border-green-100 hover:bg-green-100 text-[10px] py-0 px-2"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                        Keywords Missing
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywords_missing.map((keyword, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-red-50 text-red-700 border-red-100 hover:bg-red-100 text-[10px] py-0 px-2"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Strengths / Weaknesses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Strengths
                      </h3>
                      <ul className="space-y-1.5">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="text-xs flex gap-2">
                            <span className="text-green-500">✦</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Focus Areas
                      </h3>
                      <ul className="space-y-1.5">
                        {result.weaknesses.map((w, i) => (
                          <li
                            key={i}
                            className="text-xs flex gap-2 text-muted-foreground"
                          >
                            <span className="text-red-400">○</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="pt-4 border-t">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
                      Actionable Suggestions
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {result.suggestions.map((s, i) => (
                        <div
                          key={i}
                          className="text-xs p-3 rounded-lg bg-blue-50/50 border border-blue-100/50 text-blue-800 flex gap-3"
                        >
                          <span className="font-bold text-blue-400">
                            {i + 1}
                          </span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-2xl bg-white/50 text-muted-foreground transition-all duration-500 hover:bg-white/80 hover:border-primary/30">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 italic">
                  Ready to accelerate your career?
                </h3>
                <p className="max-w-xs mx-auto text-sm">
                  Paste your resume and job requirements on the left to unlock
                  your instant AI analysis and match scores.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
