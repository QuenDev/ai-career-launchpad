"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { removeToken, isLoggedIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Rocket, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
    setOpen(false);
  };
  
  const navigate =(path: string) => {
    router.push(path);
    setOpen(false);
  }

 return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AI Career Launchpad</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {loggedIn ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate("/history")}>
                History
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                <div
                  className="flex items-center gap-2 cursor-pointer mb-4"
                  onClick={() => navigate("/")}
                >
                  <Rocket className="h-5 w-5 text-primary" />
                  <span className="font-bold">AI Career Launchpad</span>
                </div>

                {loggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/history")}
                    >
                      History
                    </Button>
                    <Button
                      variant="destructive"
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      className="justify-start"
                      onClick={() => navigate("/signup")}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}
