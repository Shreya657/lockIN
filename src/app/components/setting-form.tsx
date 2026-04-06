"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, User, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { deleteAccount, updateProfile } from "../actions/user";

export function SettingsForm({ user }: { user: any }) {
  const [name, setName] = useState(user.name || "");
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const isSaveDisabled = name.trim() === "" || name === user.name || isPending;

  const handleUpdate = () => {
    startTransition(async () => {
      await updateProfile(name);
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteAccount();
      await authClient.signOut();
      router.push("/");
    });
  };

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full space-y-4 border-none">
        
        <AccordionItem value="profile" className="border border-zinc-800 bg-zinc-950 rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3 text-white">
              <User className="w-5 h-5 text-zinc-400" />
              <div className="text-left">
                <p className="text-sm font-medium">Public Profile</p>
                <p className="text-xs text-zinc-500 font-normal">Update your display name and identity.</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-4 border-t border-zinc-900 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Display Name</label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white focus:ring-red-500"
                placeholder="Enter your name"
              />
            </div>
            <Button 
              onClick={handleUpdate} 
              disabled={isSaveDisabled}
              className="bg-white text-black hover:bg-zinc-200 transition-all font-semibold"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="danger" className="border border-red-900/20 bg-zinc-950 rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-medium">Danger Zone</p>
                <p className="text-xs text-zinc-500 font-normal">Irreversible account actions.</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 border-t border-red-900/10 pt-4">
            <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-lg mb-4">
              <p className="text-sm text-red-200/70">
                Deleting your account will remove all your streaks, proofs, and profile data permanently.
              </p>
            </div>
            
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-500">
                    <ShieldCheck className="w-5 h-5" /> Are you absolutely sure?
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400 pt-2">
                    This action cannot be undone. This will permanently delete your
                    account and remove all proof of work data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-black hover:text-zinc-200 bg-white hover:bg-zinc-700">
                    Cancel
                  </Button>
                  <Button onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Yes, Delete Everything
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}