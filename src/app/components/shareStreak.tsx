"use client";

import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {FaXTwitter, FaLinkedin,} from "react-icons/fa6";
import { toast } from "sonner";
export function ShareStreak({ streak }: { streak: number }) {
  const message = `I just hit a ${streak}-day streak on Lock In! 🚀 Shipping code every single day. #BuildInPublic #LockIn`;
  const shareUrl = "https://your-app-link.vercel.app"; // Replace with your live URL later

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(message + " " + shareUrl)}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${message} ${shareUrl}`);
    toast.success("Streak message copied to clipboard!");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-black gap-2">
          <Share2 className="w-4 h-4" />
          Share Streak
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-zinc-950 border-zinc-800 p-2 space-y-1">
        <a href={shareLinks.x} target="_blank" className="flex items-center gap-2 p-2 hover:bg-zinc-900 rounded-md text-xs text-zinc-300">
          <FaXTwitter className="w-4 h-4 text-[#1DA1F2]" /> Share on X
        </a>
        <a href={shareLinks.linkedin} target="_blank" className="flex items-center gap-2 p-2 hover:bg-zinc-900 rounded-md text-xs text-zinc-300">
          <FaLinkedin className="w-4 h-4 text-[#0A66C2]" /> Share on LinkedIn
        </a>
        <button onClick={copyToClipboard} className="w-full flex items-center gap-2 p-2 hover:bg-zinc-900 rounded-md text-xs text-zinc-300">
          <LinkIcon className="w-4 h-4 text-zinc-500" /> Copy Text
        </button>
      </PopoverContent>
    </Popover>
  );
}