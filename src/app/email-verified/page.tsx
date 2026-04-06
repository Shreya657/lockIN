"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner"; 

export default function EmailVerified() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Email verified successfully! Welcome aboard.");
    
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-center text-white">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400">
            Your account is now active. Redirecting you to your dashboard in a few seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}