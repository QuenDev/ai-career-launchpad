"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

interface AnalysisResult {
    score: number;
    strengths: string [];
    weaknesses: string [];
    suggestions: string [];
}

export default function DashboardPage () {
    const router = useRouter();
    const [resume, setResume] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if(!isLoggedIn()) {
            router.push("/login");
        }
    }, []);
    
    const handleAnalyze = async () => {

        //validate inputs
        if(resume.trim().length < 50) {
            setError("Resume is too short. Please paste your full resume.");
            return;
        }
        
        if(jobDescription.trim().length < 30) {
            setError("Job descriptions is too short. Please paste the full job description");
            return;
        }
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await apiFetch("/analyze", {
                method: "POST",
                body: JSON.stringify({resume, jobDescription}), 
            });

    const data = await res.json();

        if(!res.ok) {
            setError(data.error);
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
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            suggestions: data.suggestions,
           }),
        });
    }   catch(err) {
        setError("Something went wrong. Please try again.");       
    }   finally {
        setLoading(false);
        }
};

return (
    <>
    <Navbar />
    <main className="min-h-screen bg-slate-100 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center"> AI Career Launchpad </h1>

        <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <Card>
                <CardHeader>
                   <CardTitle>Paste your Resume</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Paste your resume here..."
                        className="min-h-40"
                        value={resume}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResume(e.target.value) }
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
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                        />
                </CardContent>
            </Card>

            {error && (
                <p className="text-red-500 text-center">{error}</p>
            )}

            <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Resume"}
            </Button>

            {result && (
                <Card>
                    <CardHeader>
                     <CardTitle>Analysis Result</CardTitle>   
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <p className="text-2xl font-bold text-center">
                            Match Score: {result.score}/100
                        </p>
                        <div>
                            <h3 className="font-semibold text-green-600 mb-2">Strengths</h3>
                            <ul className="list-disc pl-5">
                                {result.strengths.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-red-600 mb-2">Weaknesses</h3>
                            <ul className="list-disc pl-5">
                                {result.weaknesses.map((w, i) => (
                                    <li key={i}>{w}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-600 mb-2">Suggestion</h3>
                            <ul className="list-disc pl-5">
                                {result.suggestions.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>

                    </CardContent>
                </Card>
            )}
    </div>               
    </main>
    </>

);

}

