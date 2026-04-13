"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { setToken } from "@/lib/auth";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      let session = null;

      if (code) {
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.session) {
          toast.error(error?.message || "Failed to create session");
          router.push("/login");
          return;
        }

        session = data.session;
      } else {
        // Fallback for flows where Supabase already processed the URL/hash
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          toast.error("No Supabase session found");
          router.push("/login");
          return;
        }

        session = data.session;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken: session.access_token }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Google authentication failed");
        router.push("/login");
        return;
      }

      setToken(result.token);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    };

    handleAuthCallback();
  }, [router]);

  return <div className="p-6 text-center">Signing you in...</div>;
}
