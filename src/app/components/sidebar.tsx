"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Flame, 
  History, 
  Settings, 
  LogOut, 
  PlusSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Sidebar({ currentStreak }: { currentStreak: number }) {
  const pathname = usePathname();
  const router = useRouter();

 const handleSignOut = () => {
  toast("Are you sure you want to sign out?", {
    description: "You will need to log in again to track your streaks.",
    action: {
      label: "Sign Out",
      onClick: async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/sign-in");
            },
          },
        });
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => console.log("Cancelled logout"),
    },
  });
};


  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Proofs", href: "/dashboard/proofs", icon: History },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <div className="hidden md:flex flex-col h-full p-4 border-r border-zinc-800">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-yellow-500 p-1.5 rounded-lg">
            <PlusSquare className="w-6 h-6 text-white" />
          </div>
          <Link href="/">
            <span className="font-bold text-xl tracking-tight">Lock In</span>
          </Link>
        </div>

        {currentStreak > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-4">
            <div className="relative">
              <Flame className="w-8 h-8 text-orange-500 fill-orange-500/20 animate-pulse" />
              <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-semibold">Streak</p>
              <p className="text-2xl font-bold text-white">{currentStreak}d</p> 
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group cursor-pointer",
                pathname === item.href 
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
              )}>
                <item.icon className={cn(
                  "w-5 h-5",
                  pathname === item.href ? "text-red-500" : "group-hover:text-red-400"
                )} />
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-zinc-800">
         <Button 
  variant="ghost" 
  onClick={handleSignOut}
  className="w-full justify-start gap-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
>
  <LogOut className="w-5 h-5" />
  Sign Out
</Button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-zinc-800 px-6 py-3">
        <nav className="flex items-center justify-between">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
              <item.icon className={cn(
                "w-6 h-6",
                pathname === item.href ? "text-red-500" : "text-zinc-500"
              )} />
              <span className={cn(
                "text-[10px] font-medium",
                pathname === item.href ? "text-white" : "text-zinc-500"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
          
          {currentStreak > 0 && (
            <div className="flex flex-col items-center gap-1">
               <Flame className="w-6 h-6 text-orange-500" />
               <span className="text-[10px] text-white font-bold">{currentStreak}d</span>
            </div>
          )}

          <button onClick={handleSignOut} className="flex flex-col items-center gap-1">
            <LogOut className="w-6 h-6 text-zinc-500" />
            <span className="text-[10px] text-zinc-500">Sign out</span>
          </button>
        </nav>
      </div>
    </>
  );
}