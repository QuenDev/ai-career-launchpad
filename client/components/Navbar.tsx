"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { removeToken, isLoggedIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Rocket } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AI Career Launchpad</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Logged in buttons */}
          {loggedIn ? (
            <>
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push("/history")}>
                History
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/signup")}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
