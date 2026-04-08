import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Rocket,
  Brain,
  Target,
  History,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/*Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-linear-to-b from-background to-muted">
        <Badge className="mb-4" variant="secondary">
          Powered by Groq AI
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 max-w-4xl text-balance">
          Stop applying blindly.
          <br />
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Let AI guide your journey.
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Paste or upload your resume and any job description. Get an instant AI
          match score, strengths, weaknesses and actionable suggestions.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </section>

      <Separator />

      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-muted-foreground text-lg">
              Powered by the latest AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Get instant AI powered feedback on your resume tailored to
                  each job description.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Match Score</h3>
                <p className="text-muted-foreground">
                  Know exactly how well your resume matches the job before you
                  even apply.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Save History</h3>
                <p className="text-muted-foreground">
                  Track all your past analyses and see how you improve over
                  time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to improve your resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold">Paste Your Resume</h3>
              <p className="text-muted-foreground">
                Upload or paste your resume into the text box on the dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold">Add Job Description</h3>
              <p className="text-muted-foreground">
                Paste the job description you want to apply for.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold">Get AI Feedback</h3>
              <p className="text-muted-foreground">
                Receive your match score, strengths, weaknesses and suggestions
                instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to land your dream job?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join thousands of job seekers improving their resumes with AI.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Start for Free Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-background border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Career Launchpad</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Built with Next.js, Express and Groq AI
          </p>
          <p className="text-muted-foreground text-sm">2026 — Open Source</p>
        </div>
      </footer>
    </div>
  );
}
