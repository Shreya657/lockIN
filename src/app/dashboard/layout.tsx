import { Sidebar } from "../components/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "../../../utils/prisma";
import { getStreakStats } from "../components/streaks";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  
  const allProofs = await prisma.proof.findMany({
    where: { userId: session?.user.id },
    orderBy: { createdAt: "desc" },
  });

 
  const { currentStreak } = getStreakStats(allProofs);

  return (
    <div className="flex h-screen bg-black text-white">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:block">
        <Sidebar currentStreak={currentStreak} />
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}