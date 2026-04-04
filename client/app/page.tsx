"use client";

import{useEffect, useState} from "react";
import { apiFetch } from "@/lib/api";

export default function Home() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        apiFetch("/")
        .then((res) => res.text())
        .then((data) => setMessage(data))
        .catch(() => setMessage("Failed to connect to backend"));
    }, []);

    return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">AI Career Launchpad</h1>
        <p className="text-slate-600 mb-4">Frontend is running.</p>
        <p className="font-medium text-blue-600">{message}</p>
      </div>
    </main>
  );
}