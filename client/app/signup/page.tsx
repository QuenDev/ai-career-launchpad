"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Rocket, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    toast.dismiss();

    try {
      const res = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-between p-12 relative overflow-hidden">

        {/* Blob decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-2">
          <Rocket className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">AI Career Launchpad</span>
        </div>

        {/* Main content */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Start your journey
              <span className="text-primary block">to your dream job</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Join thousands of job seekers who use AI
              to improve their resumes and land more interviews.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-3">
            {[
              "Free to use — no credit card needed",
              "AI match score in seconds",
              "Keyword gap analysis",
              "Track your improvement over time",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Floating badges */}
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "Node.js", "Python", "AWS", "SQL"].map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 border border-border"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4 bg-background/50 rounded-xl p-4 border border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">500+</p>
            <p className="text-xs text-muted-foreground">Resumes analyzed</p>
          </div>
          <div className="text-center border-x border-border/50">
            <p className="text-2xl font-bold text-primary">98%</p>
            <p className="text-xs text-muted-foreground">Satisfaction rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">Free</p>
            <p className="text-xs text-muted-foreground">No credit card</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col">

        {/* Top nav */}
        <div className="flex justify-between items-center p-6">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="font-bold">AI Career Launchpad</span>
          </Link>
          <div className="ml-auto">
            <span className="text-sm text-muted-foreground mr-2">
              Have an account?
            </span>
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Create account</h2>
              <p className="text-muted-foreground">
                Start analyzing your resume today
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="min 8 characters"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" disabled>
                Continue with Google
                <span className="text-xs text-muted-foreground ml-1">
                  (coming soon)
                </span>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login here →
              </Link>
            </p>

            <p className="text-center">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:underline"
              >
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}