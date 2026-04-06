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


export function Sidebar({ currentStreak }: { currentStreak: number }) {
  const pathname = usePathname();
  const router = useRouter();



  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Proofs", href: "/dashboard/proofs", icon: History },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full p-4">
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
          <p className="text-xs text-zinc-500 uppercase font-semibold">Current Streak</p>
          <p className="text-2xl font-bold text-white">{currentStreak} Days</p> 

        </div>
      </div>
      )}

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
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
  );
}