import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to AI Career Launchpad to access your resume analyses, match scores, and application insights.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
