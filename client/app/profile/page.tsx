"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  Mail,
  ShieldCheck,
  BarChart3,
  Target,
  Sparkles,
  Save,
  UserCircle2,
  Calendar,
  Fingerprint,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Profile = {
  id: number;
  email: string;
  full_name: string | null;
  totalAnalyses: number;
  averageScore: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/profile");
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to load profile");
          return;
        }

        setProfile(data);
        setFullName(data.full_name || "");
      } catch (err) {
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    setSaving(true);
    toast.dismiss();

    try {
      const res = await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify({ full_name: fullName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        return;
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: data.user.full_name,
            }
          : prev
      );

      toast.success("Identity updated successfully");
    } catch (err) {
      toast.error("Error communicating with safe-server");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = useCallback(() => {
    if (fullName.trim()) {
      return fullName
        .trim()
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return profile?.email?.slice(0, 2).toUpperCase() || "U";
  }, [fullName, profile?.email]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 p-8 pt-28">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32 bg-muted/60" />
              <Skeleton className="h-12 w-64 bg-muted/60" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <Skeleton className="md:col-span-8 h-80 rounded-3xl bg-muted/40" />
              <div className="md:col-span-4 flex flex-col gap-6">
                <Skeleton className="flex-1 rounded-3xl bg-muted/40" />
                <Skeleton className="flex-1 rounded-3xl bg-muted/40" />
              </div>
              <Skeleton className="md:col-span-12 h-96 rounded-3xl bg-muted/40" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-primary/30">
      <Navbar />

      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-50 mesh-gradient opacity-90 transition-opacity duration-1000" />
      <div className="fixed inset-0 -z-40 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-20" />

      <main className="flex-1 pt-28 pb-16 px-4 md:px-8 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Header Section */}
          <motion.div variants={item} className="mb-12">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 border-primary/20 bg-primary/5 text-foreground/80 backdrop-blur-sm"
            >
              <UserCircle2 className="w-3 h-3 mr-2 text-primary" />
              Identity Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
              Profile <span className="text-gradient">Intelligence.</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-lg leading-relaxed font-medium">
              Your professional fingerprint across the AI Career ecosystem.
            </p>
          </motion.div>

          {/* Bento Hub */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Identity Node */}
            <motion.div variants={item} className="md:col-span-8">
              <Card className="bento-card h-full min-h-[380px] flex flex-col bg-background/75 border-primary/10 transition-all duration-500 hover:border-primary/30 group">
                <div className="absolute top-0 right-0 p-10 opacity-5 transform group-hover:scale-105 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
                  <Cpu className="w-64 h-64 text-primary" />
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start md:items-center p-2 relative z-10">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-linear-to-br from-primary via-indigo-500 to-blue-600 p-px shadow-2xl shadow-primary/20 transition-transform duration-500 group-hover:rotate-2">
                      <div className="h-full w-full bg-background rounded-[2.4rem] flex items-center justify-center text-4xl font-black text-primary">
                        {getInitials()}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-background animate-in fade-in zoom-in duration-500">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black tracking-tight">
                          {profile?.full_name || "Profile Incomplete"}
                        </h2>
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-2 group-hover:bg-primary/20 transition-colors">
                          Elite Access
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground font-semibold">
                        <Mail className="w-4 h-4 text-primary/60" />
                        <span className="opacity-80">{profile?.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/40 border border-border/50 text-[11px] font-black uppercase tracking-wider text-muted-foreground group-hover:bg-muted/60 transition-colors">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        Joined 2026
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/40 border border-border/50 text-[11px] font-black uppercase tracking-wider text-muted-foreground group-hover:bg-muted/60 transition-colors">
                        <Fingerprint className="w-3.5 h-3.5 text-primary" />
                        PID: {profile?.id.toString().padStart(4, "0")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/20 border-t border-border/20 rounded-b-3xl overflow-hidden">
                  <div className="p-8 bg-background/40 transition-all hover:bg-background/20 group/stat">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                      Security Protocol
                    </span>
                    <div className="text-sm font-bold mt-2 flex items-center gap-2.5 text-foreground/90">
                      <div className="h-5 w-5 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      </div>
                      Standard Auth Active
                    </div>
                  </div>
                  <div className="p-8 bg-background/40 transition-all hover:bg-background/20 group/stat">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                      Sync Integrity
                    </span>
                    <div className="text-sm font-bold mt-2 flex items-center gap-2.5 text-foreground/90">
                      <div className="h-5 w-5 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-indigo-500" />
                      </div>
                      Cloud Persistence On
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Analytics Nodes */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <motion.div variants={item} className="flex-1">
                <Card className="bento-card h-full bg-linear-to-br from-indigo-500/5 to-transparent border-indigo-500/10 transition-all hover:shadow-indigo-500/5 hover:border-indigo-500/20 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-all">
                      <BarChart3 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none font-black text-[10px] animate-pulse"
                    >
                      Scanning
                    </Badge>
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 mb-2">
                    Total Analyses
                  </h3>
                  <div className="text-6xl font-black tracking-tighter text-foreground tabular-nums leading-none">
                    {profile?.totalAnalyses || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-6 font-semibold opacity-60">
                    Career data density optimized.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={item} className="flex-1">
                <Card className="bento-card h-full bg-linear-to-br from-emerald-500/5 to-transparent border-emerald-500/10 transition-all hover:shadow-emerald-500/5 hover:border-emerald-500/20 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all">
                      <Target className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-black text-[10px]"
                    >
                      Tier 1
                    </Badge>
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 mb-2">
                    Average Match
                  </h3>
                  <div className="text-6xl font-black tracking-tighter text-foreground tabular-nums flex items-baseline gap-1 leading-none">
                    {profile?.averageScore || 0}
                    <span className="text-2xl text-emerald-500/50">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-6 font-semibold opacity-60">
                    High-precision alignment detected.
                  </p>
                </Card>
              </motion.div>
            </div>

            {/* Control Node */}
            <motion.div variants={item} className="md:col-span-12">
              <Card className="bento-card bg-background/50 border-border/40 relative overflow-hidden p-0 group">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="px-8 py-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                      <div className="p-4 rounded-2xl bg-primary/10 transition-transform group-hover:rotate-6">
                        <User className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight">
                          Personalization Hub
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          Refine how you interact with the AI intelligence.
                        </p>
                      </div>
                    </div>

                    <Badge className="bg-muted text-muted-foreground border-border/50 px-4 py-1.5 rounded-full font-bold text-[11px] h-fit">
                      Standard Account Status
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="full_name"
                          className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80 ml-1"
                        >
                          Professional Alias
                        </Label>
                        <div className="relative group/input">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                          <Input
                            id="full_name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your professional name"
                            className="h-14 pl-12 bg-background/60 border-border/50 rounded-2xl focus:border-primary/50 focus-visible:ring-primary/10 transition-all font-semibold text-base"
                          />
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground/70 ml-1 leading-relaxed">
                          This identifier will be synthesized across all career
                          analysis reports.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80 ml-1">
                          Communication Channel
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={profile?.email || ""}
                            disabled
                            className="h-14 pl-12 bg-muted/40 border-dashed border-border/70 rounded-2xl font-bold cursor-not-allowed opacity-80"
                          />
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground/70 ml-1 leading-relaxed">
                          Protected email vector (Contact support to modify).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-[2rem] bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-5 mb-6 md:mb-0">
                      <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground/90">
                          Instant Platform Synchronization
                        </p>
                        <p className="text-xs text-muted-foreground font-semibold">
                          Updates deploy to all active nodes and dashboards.
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      size="lg"
                      className="w-full md:w-auto rounded-2xl h-14 px-10 font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] glow-primary"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Synthesizing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
