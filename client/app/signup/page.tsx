"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Rocket,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async () => {
    toast.dismiss();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Signup failed");
        return;
      }

      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Shared Background */}
      <div className="fixed inset-0 -z-50 mesh-gradient opacity-90" />
      <div className="fixed inset-0 -z-40 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-20" />

      <div className="flex-1 flex flex-col lg:flex-row h-full">
        {/* Left Side: Showcase */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-center p-12 relative border-r border-border/10 bg-background/5">
          <div className="absolute top-12 left-12 z-10">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic text-foreground whitespace-nowrap">
                AI CAREER LAUNCHPAD
              </span>
            </Link>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 relative z-10 max-w-md"
          >
            <motion.div variants={item} className="space-y-4">
              <Badge
                variant="outline"
                className="px-3 py-1 border-primary/20 bg-primary/10 text-primary backdrop-blur-sm"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Begin Your Journey
              </Badge>
              <h1 className="text-5xl xl:text-6xl font-black tracking-tighter leading-[0.9] text-foreground">
                UNLEASH YOUR <br />
                <span className="text-gradient uppercase">POTENTIAL.</span>
              </h1>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                Join the professional community using AI to dominate the modern
                job market.
              </p>
            </motion.div>

            <motion.div variants={item} className="space-y-3">
              {[
                "AI-Powered Profile Ranking",
                "Deep Keyword Gap Analysis",
                "Actionable Improvement Steps",
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-foreground/80"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
          {/* Mobile Header */}
          <div className="lg:hidden w-full max-w-lg mb-8 text-center sm:text-left">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="font-black text-xl tracking-tighter uppercase italic">
                AI CAREER LAUNCHPAD
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <div className="glass rounded-[2rem] p-8 md:p-12 border-border/40 shadow-2xl relative overflow-hidden group">
              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                    Create Account
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Start your professional advancement today
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-background/40 border-border/50 rounded-xl focus:ring-primary/20 backdrop-blur-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-background/40 border-border/50 rounded-xl focus:ring-primary/20 backdrop-blur-md pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
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
                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all mt-2"
                  >
                    {loading ? "Initializing..." : "Get Started"}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="bg-border/20" />
                    </div>
                    <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.2em]">
                      <span className="bg-background/0 px-4 text-muted-foreground/60 backdrop-blur-md italic">
                        Enterprise Grade Security
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-xl border-border/60 bg-background/20 backdrop-blur-md hover:bg-background/40 font-bold"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      "Connecting..."
                    ) : (
                      <>
                        <svg className="h-4 w-4 mr-3" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign up with Google
                      </>
                    )}
                  </Button>
                </div>

                <div className="pt-4 text-center space-y-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Already part of the network?{" "}
                    <Link
                      href="/login"
                      className="text-primary font-black hover:opacity-70 transition-opacity text-sm"
                    >
                      LOGIN HERE
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
