"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; 

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!token) return alert("Please paste the code from your email.");
    
    setLoading(true);
    const { data, error } = await authClient.verifyEmail({
      query: {
        token: token.trim(), 
      },
    }, {
      onSuccess: () => {
        alert("Email verified successfully!");
        router.push("/dashboard");
      },
      onError: (ctx) => {
        alert(ctx.error.message);
        setLoading(false);
      }
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Verify your Email</CardTitle>
          <CardDescription className="text-zinc-400">
            Paste the long verification code we sent to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            placeholder="Paste code here..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
          />
          <Button 
            onClick={handleVerify} 
            disabled={loading} 
            className="w-full bg-white text-black hover:bg-zinc-200"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}