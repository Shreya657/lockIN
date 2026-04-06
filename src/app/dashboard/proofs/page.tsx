import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Zap, Target, Search, History } from "lucide-react";
import { prisma } from "../../../../utils/prisma";
import { ProofsTable } from "@/app/components/logTables";
import { Heatmap } from "@/app/components/heatmap";
import { getStreakStats } from "@/app/components/streaks";
import { ShareStreak } from "@/app/components/shareStreak";

export default async function ProofsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  const allProofs = await prisma.proof.findMany({
    where: { userId: session?.user.id },
    orderBy: { createdAt: "desc" },
  });
const { currentStreak, longestStreak, lastShipped } = getStreakStats(allProofs);
  // for stats
  const totalProofs = allProofs.length;
  const categories = allProofs.map(p => p.category);
  const mostCommonCategory = categories.sort((a,b) =>
      categories.filter(v => v===a).length - categories.filter(v => v===b).length
  ).pop() || "N/A";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">My Proofs</h1>
        <p className="text-zinc-500">Your journey, documented in code and sweat.</p>
      </header>
      {totalProofs > -1 && (
        <ShareStreak streak={currentStreak} />
      )}
      <Heatmap proofs={allProofs} />
{totalProofs !== 0 && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="bg-zinc-950 border-zinc-800">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-zinc-400">Total Shipped</CardTitle>
      <Trophy className="w-4 h-4 text-yellow-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{allProofs.length}</div>
    </CardContent>
  </Card>

  <Card className="bg-zinc-950 border-zinc-800">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-zinc-400">Top Skill</CardTitle>
      <Target className="w-4 h-4 text-red-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold uppercase text-white">{mostCommonCategory}</div>
    </CardContent>
  </Card>

  <Card className="bg-zinc-950 border-zinc-800">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-zinc-400">Best Streak</CardTitle>
      <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{longestStreak==1 ? " 1 Day" : `${longestStreak} Days`}</div>
    </CardContent>
  </Card>

  <Card className="bg-zinc-950 border-zinc-800">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-zinc-400">Last Logged</CardTitle>
      <History className="w-4 h-4 text-blue-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{lastShipped}</div>
    </CardContent>
  </Card>
</div>
</>
) }
        
 
        <ProofsTable initialProofs={allProofs} />
    </div>
  );
}