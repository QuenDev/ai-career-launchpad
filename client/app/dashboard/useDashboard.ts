"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export interface AnalysisResult {
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

export type Phase = "input" | "analyzing" | "result";

export function useDashboard() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("input");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const token = getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/upload/pdf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setResume(data.text);
      toast.success("PDF extracted successfully!");
    } catch (err) {
      toast.error("Failed to process PDF. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearPdf = () => {
    setFileName("");
    setResume("");
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `Resume Match Score: ${result.score}/100
Skills: ${result.skills_score}% | Experience: ${result.experience_score}% | Education: ${result.education_score}%

Summary: ${result.summary}

Strengths:\n${result.strengths?.map((s) => `• ${s}`).join("\n")}

Areas to Improve:\n${result.weaknesses?.map((w) => `• ${w}`).join("\n")}

Matched Keywords: ${result.keywords_match?.join(", ")}
Missing Keywords: ${result.keywords_missing?.join(", ")}

Suggestions:\n${result.suggestions?.map((s, i) => `${i + 1}. ${s}`).join("\n")}

— Powered by AI Career Launchpad`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Analysis copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy. Please try again.");
      });
  };

  const shareResults = async () => {
    if (!result) return;
    const shareData = {
      title: "My Resume Analysis — AI Career Launchpad",
      text: `I scored ${result.score}/100 on my resume match analysis! Check out AI Career Launchpad to analyze yours.`,
      url: window.location.origin,
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // user cancelled — do nothing
      }
    } else {
      navigator.clipboard
        .writeText(`${shareData.text}\n${shareData.url}`)
        .then(() => {
          toast.success("Share link copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to share. Please try again.");
        });
    }
  };

  return {
    phase,
    setPhase,
    resume,
    setResume,
    jobDescription,
    setJobDescription,
    result,
    loading,
    uploading,
    fileName,
    handleAnalyze,
    getScoreColor,
    handlePdfUpload,
    clearPdf,
    copyToClipboard,
    shareResults,
  };
}
