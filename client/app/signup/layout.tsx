import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your AI Career Launchpad account to analyze resumes, compare them to job descriptions, and improve your applications.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
