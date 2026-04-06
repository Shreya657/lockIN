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
  <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
   
    <aside className="w-full md:w-64 md:border-r md:border-zinc-800 md:bg-zinc-950/50">
      <Sidebar currentStreak={currentStreak} />
    </aside>
    
  
    <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto p-6 lg:p-10">
        {children}
      </div>
    </main>
  </div>
);
}