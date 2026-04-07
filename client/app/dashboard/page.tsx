"use client"

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
    strengths: string [];
    summary: string;
    weaknesses: string [];
    suggestions: string [];
    keywords_match: string[];
    keywords_missing: string[];
}

export default function DashboardPage(){
    const router = useRouter();
    const [resume, setResume] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!isLoggedIn()) {
            router.push("/login");
        }
    }, []);
    
    const handleAnalyze = async () => {
        toast.dismiss();
        //validate inputs
        if(resume.trim().length < 50) {
            toast.error("Resume is too short. Please paste your full resume.");
            return;
        }
        
        if(jobDescription.trim().length < 30) {
            toast.error("Job descriptions is too short. Please paste the full job description");
            return;
        }
        setLoading(true);
        setResult(null);

        try {
            const res = await apiFetch("/analyze", {
                method: "POST",
                body: JSON.stringify({resume, jobDescription}), 
            });

    const data = await res.json();

        if(!res.ok) {
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
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            suggestions: data.suggestions,
            keywords_match: data.keywords_match,
            keywords_missing: data.keywords_missing,
            summary: data.summary
           }),
        });

        toast.success("Analysis saved to history!");

    }   catch(err) {
        toast.error("Something went wrong. Please try again.");       
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

            <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Resume"}
            </Button>

            {result && (
                <Card>
                 <CardHeader>
                 <CardTitle className="text-center text-2xl">
                        Match Score: {result.score}/100
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="flex flex-col gap-6">

                        {/* Summary */}
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-muted-foreground">{result.summary}</p>
                        </div>

                        {/* Keywords */}
                        <div className="flex flex-col gap-3">
                            <div>
                                <h3 className="font-semibold mb-2"> ✅ Keywords Found </h3>
                                <div className="flex flex-wrap gap-2">
                                {result.keywords_match.map((keyword, i) => (
                                <Badge key={i} className="bg-green-100 text-green-800 hover:bg-green-100">
                                {keyword}
                                </Badge>
                                ))}
                            </div> 
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">❌ Keywords Missing</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.keywords_missing.map((keyword, i) => (
                                <Badge key={i} className="bg-red-100 text-red-800 hover:bg-red-100">
                                {keyword}
                                </Badge>
                                ))}
                            </div>
                        </div>
                        </div>
                    

                       {/* Strengths */}          
                        <div>
                            <h3 className="font-semibold text-green-600 mb-2">Strengths</h3>
                            <ul className="list-disc pl-5">
                                {result.strengths.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Weaknesses */}
                        <div>
                            <h3 className="font-semibold text-red-600 mb-2">Weaknesses</h3>
                            <ul className="list-disc pl-5">
                                {result.weaknesses.map((w, i) => (
                                    <li key={i}>{w}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Suggestions */}
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
)};


