"use client";

import { useState, useTransition } from "react"; // 1. Added useTransition
import { toast } from "sonner"; // Optional: if you have a toast library
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Link as LinkIcon, Loader2 } from "lucide-react";
import { logProof } from "../actions/log";
import { fireConfetti } from "../../../utils/confetti";

export function LogWorkForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (!title || !category) {
      alert("Title and Category are required!");
      return;
    }

    // the Server Action
    startTransition(async () => {
      try {
        await logProof({
          title,
          category,
          proofUrl,
        });
         
        //  Success--- clear the form
        fireConfetti()
        setTitle("");
        setCategory("");
        setProofUrl("");
        // console.log("Proof logged successfully!");
      } catch (error) {
        console.error("Failed to log proof:", error);
        alert("Something went wrong. Check your connection.");
      }
    });
  };

  return (
    <Card className="border-zinc-800 bg-zinc-950 shadow-2xl">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="What did you ship? (e.g. Solved 3 LeetCode Mediums)" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            className="bg-zinc-900 border-zinc-800 focus:ring-red-500 text-white "
          />
          <Input 
            placeholder="Category (e.g. DSA, DBMS, Web3)" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            disabled={isPending}
            className="bg-zinc-900 border-zinc-800 text-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Proof Link (Optional)" 
              value={proofUrl} 
              onChange={(e) => setProofUrl(e.target.value)}
              disabled={isPending}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white focus:ring-red-500"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-white font-bold px-6 min-w-[140px]"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isPending ? "Logging..." : "Log Work"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}