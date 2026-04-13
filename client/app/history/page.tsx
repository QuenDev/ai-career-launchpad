"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
  Clock,
  TrendingUp,
  Sparkles,
  Lightbulb,
  Hash,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Analysis {
  id: number;
  resume: string;
  job_description: string;
  score: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords_match: string[];
  keywords_missing: string[];
  summary: string;
  created_at: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    //fetch history
    const fetchHistory = async () => {
      try {
        const res = await apiFetch("/history");
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      const res = await apiFetch(`/history/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setHistory(history.filter((item) => item.id !== id));
        toast.success("Analysis deleted");
      } else {
        toast.error(data.error || "Failed to delete analysis");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75)
      return "text-emerald-500 dark:text-emerald-400 stroke-emerald-500 dark:stroke-emerald-400";
    if (score >= 50)
      return "text-amber-500 dark:text-amber-400 stroke-amber-500 dark:stroke-amber-400";
    return "text-rose-500 dark:text-rose-400 stroke-rose-500 dark:stroke-rose-400";
  };

  const filteredHistory = (history || [])
    .filter(
      (item) =>
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.job_description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      return b.score - a.score;
    });

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
        <Navbar />
        <div className="fixed inset-0 -z-50 mesh-gradient opacity-90" />
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <Skeleton className="h-10 w-full max-w-[250px]" />
            <div className="flex gap-3 w-full md:w-auto">
              <Skeleton className="h-10 flex-1 md:w-48" />
              <Skeleton className="h-10 w-24 md:w-32" />
            </div>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-background/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-border/50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
              <div className="flex-1 w-full space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-24 rounded-xl shrink-0" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 relative overflow-hidden font-sans selection:bg-primary/30">
        {/* Premium Background */}
        <div className="fixed inset-0 -z-50 mesh-gradient opacity-90" />
        <div className="fixed inset-0 -z-40 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-20" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="px-2.5 py-0.5 border-primary/20 bg-primary/5 text-[10px] uppercase font-bold text-foreground/70 backdrop-blur-sm"
              >
                <Clock className="w-3 h-3 mr-1.5 text-primary" />
                History
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Analysis <span className="text-gradient">Records.</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-sm leading-relaxed">
                A focused log of your AI-powered career alignment reviews.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group flex-1 md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search analyses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/60 border-border/50 backdrop-blur-xl rounded-xl focus-visible:ring-primary/20"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-5 bg-background/60 border-border/50 backdrop-blur-xl rounded-xl group w-full sm:w-auto"
                  >
                    <Filter className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-sm">
                      {sortBy === "date" ? "Newest First" : "Top Scores"}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 glass rounded-xl border-border/40 p-1"
                >
                  <DropdownMenuItem
                    onClick={() => setSortBy("date")}
                    className="rounded-lg p-2.5 font-medium cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("score")}
                    className="rounded-lg p-2.5 font-medium cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                    Top Scores
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-6 rounded-3xl bg-background/40 border border-dashed border-border/60"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-primary opacity-40" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No analyses found</h3>
                <p className="text-muted-foreground mb-8">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Start by analyzing your first resume!"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="rounded-xl h-12 px-8 font-bold"
                  >
                    Analyze Now
                  </Button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout" initial={false}>
                {paginatedHistory.map((analysis, index) => {
                  const isExpanded = expandedId === analysis.id;

                  return (
                    <motion.div
                      key={analysis.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="group"
                    >
                      <Card
                        className={`overflow-hidden border-border/40 transition-all duration-500 rounded-2xl md:rounded-[2rem] ${isExpanded ? "bg-background/80 shadow-2xl ring-1 ring-primary/20" : "bg-background/50 hover:bg-background/70 backdrop-blur-xl shadow-lg border-border/50 hover:border-primary/20 shadow-primary/5"}`}
                      >
                        {/* Compact Header (The visible row) */}
                        <div
                          className={`p-4 md:p-5 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 md:gap-6 cursor-pointer active:scale-[0.99] transition-transform`}
                          onClick={() =>
                            setExpandedId(isExpanded ? null : analysis.id)
                          }
                        >
                          {/* Score Circle */}
                          <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0 mt-1 md:mt-0">
                            <svg
                              className="h-full w-full -rotate-90"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                className="text-border/30"
                                strokeWidth="10"
                                fill="transparent"
                                r="42"
                                cx="50"
                                cy="50"
                                stroke="currentColor"
                              />
                              <motion.circle
                                initial={{ strokeDashoffset: 263.89 }}
                                animate={{
                                  strokeDashoffset:
                                    263.89 - (263.89 * analysis.score) / 100,
                                }}
                                className={getScoreColor(analysis.score)}
                                strokeWidth="10"
                                strokeDasharray={263.89}
                                strokeLinecap="round"
                                fill="transparent"
                                r="42"
                                cx="50"
                                cy="50"
                                stroke="currentColor"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className={`text-base md:text-lg font-black ${getScoreColor(analysis.score).split(" ")[0]}`}
                              >
                                {analysis.score}
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 w-full text-center sm:text-left overflow-hidden">
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-y-1 gap-x-2 mb-2">
                              <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground/80 bg-muted/40 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                                <Calendar className="w-2.5 h-2.5" />
                                {new Date(
                                  analysis.created_at
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <div className="hidden xs:block h-0.5 w-0.5 rounded-full bg-border" />
                              <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1.5 shrink-0">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(
                                  analysis.created_at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <h3 className="text-sm md:text-lg font-bold text-foreground/90 capitalize px-1 line-clamp-2 sm:line-clamp-1 w-full">
                              {analysis.summary || "Career Alignment Analysis"}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate opacity-60 italic px-2 w-full">
                              {analysis.job_description ||
                                "Detailed match review."}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/30 w-full sm:w-auto justify-center sm:justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 md:h-10 md:w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(analysis.id);
                              }}
                              className="h-9 w-9 md:h-10 md:w-10 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Bento View */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: "circOut" }}
                              className="border-t border-border/40"
                            >
                              <div className="p-4 md:p-8 bg-background/30 grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Summary Bento */}
                                <div className="lg:col-span-12 p-5 md:p-6 rounded-2xl md:rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">
                                    <Sparkles className="w-48 h-48 text-primary" />
                                  </div>
                                  <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                      <Lightbulb className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 leading-none">
                                        AI Insight
                                      </p>
                                      <h3 className="font-bold text-base">
                                        Summary
                                      </h3>
                                    </div>
                                  </div>
                                  <p className="text-sm md:text-base font-medium leading-relaxed italic text-foreground/90 relative z-10">
                                    "
                                    {analysis.summary ||
                                      "Comprehensive evaluation of technical overlap and professional trajectory alignment."}
                                    "
                                  </p>
                                </div>

                                {/* Keywords Bento */}
                                <div className="lg:col-span-5 p-6 rounded-2xl md:rounded-3xl bg-background border border-border/50 shadow-sm flex flex-col gap-6">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10">
                                      <Hash className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg">
                                      Keyword Insights
                                    </h3>
                                  </div>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">
                                        Matched Keywords
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {analysis.keywords_match?.map(
                                          (kw, i) => (
                                            <Badge
                                              key={i}
                                              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0.5 rounded-lg text-[10px] lowercase"
                                            >
                                              {kw}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500/80">
                                        Missing Keywords
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {analysis.keywords_missing?.map(
                                          (kw, i) => (
                                            <Badge
                                              key={i}
                                              className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 px-2 py-0.5 rounded-lg text-[10px] lowercase"
                                            >
                                              {kw}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Strengths Bento */}
                                <div className="lg:col-span-7 p-6 rounded-2xl md:rounded-3xl bg-background border border-border/50 shadow-sm">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />{" "}
                                        Core Strengths
                                      </h4>
                                      <ul className="space-y-2.5">
                                        {analysis.strengths?.map((s, i) => (
                                          <li
                                            key={i}
                                            className="text-xs text-muted-foreground flex items-start gap-2.5 leading-relaxed"
                                          >
                                            <span className="mt-1 w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                                            {s}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="space-y-4">
                                      <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />{" "}
                                        Focus Areas
                                      </h4>
                                      <ul className="space-y-2.5">
                                        {analysis.weaknesses?.map((w, i) => (
                                          <li
                                            key={i}
                                            className="text-xs text-muted-foreground flex items-start gap-2.5 leading-relaxed"
                                          >
                                            <span className="mt-1 w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                                            {w}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                {/* Suggestions Bento */}
                                <div className="lg:col-span-12 p-6 rounded-2xl md:rounded-3xl bg-blue-500/5 border border-blue-500/15 shadow-sm">
                                  <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-blue-500/10">
                                      <Sparkles className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg">
                                      Next Steps & Optimization
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {analysis.suggestions?.map((s, i) => (
                                      <div
                                        key={i}
                                        className="group p-4 rounded-2xl bg-background/55 border border-border/40 hover:border-blue-500/30 transition-all flex gap-3"
                                      >
                                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-500 shrink-0 flex items-center justify-center font-black text-[10px]">
                                          {i + 1}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                                          {s}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 mt-12 bg-background/40 backdrop-blur-xl p-2 rounded-2xl border border-border/50 w-fit mx-auto shadow-lg"
            >
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-1 px-4 text-sm font-bold">
                <span className="text-primary">{currentPage}</span>
                <span className="opacity-30">/</span>
                <span>{totalPages}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
