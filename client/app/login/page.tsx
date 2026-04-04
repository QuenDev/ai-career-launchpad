"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    //Handle Login
    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await apiFetch("/auth/login" , {
                method: "POST",
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();

            if(!res.ok) {
                setError(data.error);
                return;
            }

            setToken(data.token);
            router.push("/dashboard");
        }   catch (err) {
            setError("Something went wrong. Please try again.");
        }   finally {
            setLoading(false);
        }
        };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-100">
            <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        placeholder="you@gmail.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Password</Label>
                    <Input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </div>
                <Button onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
                <p className="text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </p>
            </CardContent>
            </Card>
        </main>
    );
}
        

