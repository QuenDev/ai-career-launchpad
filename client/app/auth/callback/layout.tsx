import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signing In",
  description: "Completing your sign-in to AI Career Launchpad.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
