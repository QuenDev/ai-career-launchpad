"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { removeToken, isLoggedIn } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Rocket,
  Menu,
  LayoutDashboard,
  History,
  LogOut,
  User,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProfileUser = {
  email: string;
  full_name: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
    const loggedInStatus = isLoggedIn();
    setLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      const fetchProfile = async () => {
        try {
          const res = await apiFetch("/profile");
          const data = await res.json();
          if (res.ok) {
            setProfile({ email: data.email, full_name: data.full_name });
          }
        } catch (err) {
          console.error("Failed to load profile", err);
        }
      };
      fetchProfile();
    }
  }, []);

  const handleLogout = useCallback(() => {
    removeToken();
    setLoggedIn(false);
    router.push("/login");
    setOpen(false);
  }, [router]);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      setOpen(false);
    },
    [router]
  );

  const getInitials = useCallback(() => {
    if (profile?.full_name?.trim()) {
      return profile.full_name
        .trim()
        .split(" ")
        .map((name) => name[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return profile?.email?.slice(0, 2).toUpperCase() || "U";
  }, [profile]);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "History", path: "/history", icon: History },
  ];

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-16">
        {/* Logo Section */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate(loggedIn ? "/dashboard" : "/")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative h-10 w-10 md:h-11 md:w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5 group-hover:bg-primary/15 transition-all">
            <Rocket className="h-5 w-5 text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-base md:text-lg tracking-tight text-foreground uppercase">
              AI Career
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-primary font-black mt-0.5">
              Launchpad
            </span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-2xl border border-border/50">
            {loggedIn &&
              navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all rounded-xl ${
                    pathname === link.path
                      ? "text-primary bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            {!loggedIn && (
              <span className="px-4 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                Future-Proof Your Career
              </span>
            )}
          </div>

          <div className="h-6 w-px bg-border/60 mx-1" />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-10 w-10 hover:bg-primary/5"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="dark"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                >
                  <Moon className="h-5 w-5 text-indigo-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="light"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <Sun className="h-5 w-5 text-amber-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {loggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative h-10 w-10 rounded-xl bg-linear-to-br from-primary to-blue-600 p-px shadow-lg shadow-primary/20"
                >
                  <div className="h-full w-full bg-background rounded-[11px] flex items-center justify-center font-black text-xs text-primary">
                    {getInitials()}
                  </div>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 glass border-border/40 rounded-2xl p-2 mt-2"
              >
                <DropdownMenuLabel className="p-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-black leading-none">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {profile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="rounded-xl p-3 focus:bg-primary/5 cursor-pointer"
                >
                  <User className="mr-3 h-4 w-4 text-primary" />
                  <span className="font-semibold">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl p-3 focus:bg-primary/5 cursor-pointer md:hidden"
                >
                  <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                  <span className="font-semibold">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl p-3 focus:bg-rose-500/10 text-rose-500 cursor-pointer"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-semibold">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="rounded-xl font-bold"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="rounded-xl px-5 font-bold shadow-lg shadow-primary/20"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Header Access */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-primary/5 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[320px] border-l border-primary/10 glass-dark flex flex-col p-4 pt-12"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>

              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-10 px-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-black text-xl tracking-tighter">
                    AI CAREER
                  </span>
                </div>

                {loggedIn && (
                  <div className="flex items-center gap-4 p-4 mb-8 rounded-3xl bg-primary/5 border border-primary/10">
                    <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-primary to-blue-600 p-px shadow-lg shadow-primary/20">
                      <div className="h-full w-full bg-background rounded-[15px] flex items-center justify-center text-xl font-black text-primary uppercase">
                        {getInitials()}
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-lg truncate tracking-tight">
                        {profile?.full_name || "New Explorer"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate font-bold opacity-60">
                        {profile?.email}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 px-2 grow">
                  {loggedIn ? (
                    navLinks
                      .concat({
                        name: "Profile",
                        path: "/profile",
                        icon: UserCircle,
                      })
                      .map((link) => (
                        <button
                          key={link.path}
                          onClick={() => navigate(link.path)}
                          className={`flex items-center justify-between p-5 rounded-3xl border transition-all text-left group ${
                            pathname === link.path
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-background/40 border-border/40 text-muted-foreground hover:bg-background/60 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <link.icon
                              className={`h-6 w-6 ${pathname === link.path ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <span className="font-black text-lg tracking-tight">
                              {link.name}
                            </span>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 group-hover:translate-x-1 transition-transform ${pathname === link.path ? "text-primary" : "text-border/40"}`}
                          />
                        </button>
                      ))
                  ) : (
                    <div className="space-y-4">
                      <Button
                        size="lg"
                        className="w-full h-16 rounded-3xl text-lg font-black shadow-lg shadow-primary/20"
                        onClick={() => navigate("/signup")}
                      >
                        Get Started
                      </Button>
                      <Button
                        size="lg"
                        variant="ghost"
                        className="w-full h-16 rounded-3xl text-lg font-black border border-border/40"
                        onClick={() => navigate("/login")}
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>

                {loggedIn && (
                  <div className="px-2 pb-8 mt-auto">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-lg hover:bg-rose-500/20 transition-all group"
                    >
                      <LogOut className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                      Sign Out
                    </button>
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
