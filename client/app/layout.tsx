import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-career-launchpad.vercel.app"),
  title: {
    default: "AI Career Launchpad",
    template: "%s | AI Career Launchpad",
  },
  description:
    "Analyze your resume against job descriptions with AI. Get match scores, skill gaps, keyword insights, and actionable suggestions to improve your applications.",
  keywords: [
    "AI resume analyzer",
    "resume checker",
    "job match score",
    "ATS resume optimization",
    "career tools",
    "resume analysis",
    "job application tool",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Career Launchpad",
    description:
      "Analyze your resume against job descriptions with AI and get match scores, keyword insights, and actionable suggestions.",
    url: "https://ai-career-launchpad.vercel.app",
    siteName: "AI Career Launchpad",
    images: [
      {
        url: "/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "AI Career Launchpad",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Career Launchpad",
    description:
      "Analyze your resume against job descriptions with AI and improve your applications.",
    images: ["/og-image-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
