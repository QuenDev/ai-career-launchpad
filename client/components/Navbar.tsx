"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { removeToken, isLoggedIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Rocket, Menu, LayoutDashboard, History, LogIn, UserPlus, LogOut } from "lucide-react";
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
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-primary/10 bg-background/80 backdrop-blur-xl">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              
              {/* Drawer Header */}
              <div className="flex flex-col gap-6 mt-4 h-full">
                <div
                  className="flex items-center gap-3 cursor-pointer pb-6 border-b border-border/50"
                  onClick={() => navigate("/")}
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-none">AI Career</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-black">Launchpad</span>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2 flex-grow">
                  {loggedIn ? (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start h-12 gap-3 text-base font-medium px-4 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                        onClick={() => navigate("/dashboard")}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start h-12 gap-3 text-base font-medium px-4 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                        onClick={() => navigate("/history")}
                      >
                        <History className="h-5 w-5" />
                        History
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start h-12 gap-3 text-base font-medium px-4 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                        onClick={() => navigate("/login")}
                      >
                        <LogIn className="h-5 w-5" />
                        Login
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start h-12 gap-3 text-base font-medium px-4 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                        onClick={() => navigate("/signup")}
                      >
                        <UserPlus className="h-5 w-5" />
                        Get Started
                      </Button>
                    </>
                  )}
                </div>

                {/* Drawer Footer */}
                {loggedIn && (
                  <div className="pt-6 border-t border-border/50 mt-auto pb-8">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 gap-3 text-base font-medium px-4 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all rounded-xl border border-red-100/50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}
