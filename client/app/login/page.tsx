"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Rocket, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link  from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Stagger container for the left side
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    // Item animation
    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    // Skill badge floating effect
    const floating = {
        animate: {
            y: [0, -8, 0],
            transition: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" as const 
            }
        }
    };

    //Handle Login
    const handleLogin = async () => {
        setLoading(true);
        toast.dismiss();

        try {
            const res = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error);
                return;
            }

            toast.success("Welcome back!");

            setToken(data.token);
            router.push("/dashboard");
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
      
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Blob decorations - Matching Landing page */}
        <motion.div 
            animate={{ 
                x: [0, 40, 0], 
                y: [0, 20, 0],
                scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" as const }}
            className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-60" 
        />
        <motion.div 
            animate={{ 
                x: [0, -30, 0], 
                y: [0, 40, 0],
                scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
            className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-60" 
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2">
          <Rocket className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">AI Career Launchpad</span>
        </div>

        {/* Main content */}
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="relative space-y-8"
        >
          <motion.div variants={item} className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight">
              Accelerate your
              <span className="bg-linear-to-r from-primary via-indigo-500 to-blue-600 bg-clip-text text-transparent block">
                career with AI
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Analyze your resume against any job description
              and get instant AI powered feedback.
            </p>
          </motion.div>

          {/* Feature bullets */}
          <motion.div variants={item} className="space-y-3">
            {[
              "AI-powered match score",
              "Keyword gap analysis",
              "Actionable suggestions",
              "Save & track history",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>
          
           {/* Floating badges */}
          <motion.div variants={item} className="flex flex-wrap gap-2">
            {["React", "TypeScript", "Node.js", "Python", "AWS", "SQL"].map((skill, i) => (
              <motion.span
                key={i}
                variants={floating}
                animate="animate"
                transition={{ delay: i * 0.1 }}
                className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 border border-border shadow-sm backdrop-blur-sm"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

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
              No account?
            </span>
            <Link href="/signup">
              <Button variant="outline" size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
{/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-sm space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Welcome back</h2>
              <p className="text-muted-foreground">
                Sign in to your account
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
                    placeholder="••••••••"
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
                onClick={handleLogin}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Logging in..." : "Login"}
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
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up for free →
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
            
    
          </motion.div>
          
        </div>
      </div>
      
    </div>
    
    
  );
}

      