"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

interface Analysis {
    id:  number;
    resume: string;
    job_description: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    created_at: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(true);

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

    if(loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>Loading History...</p>
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
            {history.length ===0 ? (
                <p className="text-center text-slate-500">
                    No analysis yet. Go analyze a resume!
                </p>
            ) : (
                history.map((analysis) => (
                    <Card key={analysis.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>Match Score: {analysis.score}/100</span>
                                <span className="text-sm font-normal text-slate-500">
                                {new Date(analysis.created_at).toLocaleDateString()}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div>
                                <h3 className="font-semibold text-green-600 mb-2">Strengths</h3>
                                <ul className="list-disc pl-5">
                                    {analysis.strengths.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-600 mb-2">Weaknesses</h3>
                                <ul className="list-disc pl-5">
                                    {analysis.weaknesses.map((w, i) => (
                                        <li key={i}>{w}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-600 mb-2">Suggestions</h3>
                                <ul className="list-disc pl-5">
                                    {analysis.suggestions.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
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
