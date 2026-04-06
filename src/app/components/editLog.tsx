"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateProof } from "../actions/log";

export function EditProofDialog({ proof }: { proof: any }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(proof.title);
  const [category, setCategory] = useState(proof.category);
  const [proofUrl, setProofUrl] = useState(proof.proofUrl);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      await updateProof(proof.id, { title, category, proofUrl });
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-500">
          <Pencil className="h-4 w-4 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Proof</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Title" 
            className="bg-zinc-900 border-zinc-800"
          />
          <Input 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="Category" 
            className="bg-zinc-900 border-zinc-800"
          />
          <Input 
            value={proofUrl} 
            onChange={(e) => setProofUrl(e.target.value)} 
            placeholder="Proof Link" 
            className="bg-zinc-900 border-zinc-800"
          />
          <Button 
            onClick={handleUpdate} 
            disabled={isPending}
            className="w-full bg-white text-black hover:bg-zinc-200"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}