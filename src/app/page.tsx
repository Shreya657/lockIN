"use client";

import { Button } from "@/components/ui/button";
import {  signOut, authClient } from "@/lib/auth-client";
import { Session } from "@/lib/auth-types";
import Link from "next/link";

export default function Home() {
  const { data, isPending } = authClient.useSession();
  const session = data as Session | null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex fixed top-0 p-8">
         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-zinc-800/30 p-4">
           v1.0.0
        </p>
      </div>

      <div className="text-center space-y-8 mt-20">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          LOG YOUR WINS.
        </h1>
        
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
          Verify everyday's tasks progress. Build a public streak that proves you're actually doing the work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isPending ? (
             <Button disabled className="bg-zinc-800 animate-pulse w-32" />
          ) : session ? (
            <div className="flex flex-col gap-4">
               <p className="text-zinc-400">Welcome back, <span className="text-white font-bold">{session?.user?.name}</span>! 🔥 Streak: {session?.user?.currentStreak ?? 0}</p>
              
               <div className="flex gap-2">
                 <Button asChild className="bg-white text-black hover:bg-zinc-200 px-8 hover:text-white">
                   <Link href="/dashboard">Go to Dashboard</Link>
                 </Button>
                 <Button variant="outline" onClick={() => signOut()} className="border-zinc-800 bg-red-600 hover:bg-red-700 text-white px-8">
                   Sign Out
                 </Button>
               </div>
            </div>
          ) : (
            <>
              <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200 px-10 hover:text-white">
                <Link href="/sign-up">Start Building</Link>
              </Button>
              <Button variant="link" asChild className="text-zinc-400 hover:text-white">
                <Link href="/sign-in">Already have an account? Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}