"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProof } from "../actions/log";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this proof?")) {
          startTransition(() => deleteProof(id));
        }
      }}
      className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}