"use client";

import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function Navbar () {
    const router = useRouter();

    const handleLogout = () => {
        removeToken();
        router.push("/login");
    };
    
    return(
        <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
            <h1 className="font-bold text-xl cursor-pointer"
                onClick={() => router.push("/dashboard")} >
                AI Career Launchpad 
            </h1>

            <div className="flex gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/dashboard")} 
                >
                    Analyzer   
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => router.push("/history")}
                >
                    History
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </nav>
    );

}