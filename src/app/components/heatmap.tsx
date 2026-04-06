"use client";

import { useMemo } from "react";
import { subDays, format, eachDayOfInterval, startOfMonth, isSameDay } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Heatmap({ proofs }: { proofs: any[] }) {
  const days = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 364); 
    return eachDayOfInterval({ start, end });
  }, []);

  const proofCounts = useMemo(() => {
    const counts: { [date: string]: number } = {};
    proofs.forEach((proof) => {
      const dateStr = format(new Date(proof.createdAt), "yyyy-MM-dd");
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    return counts;
  }, [proofs]);

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];
    days.forEach((day, i) => {
      if (i % 7 === 0 && day.getDate() <= 7) {
        labels.push({ index: Math.floor(i / 7), label: format(day, "MMM") });
      }
    });
    return labels;
  }, [days]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-zinc-900 border border-zinc-800/50"; 
    if (count === 1) return "bg-red-900/40 border border-red-800/50"; 
    if (count === 2) return "bg-red-600 border border-red-500";
    return "bg-gradient-to-br from-red-500 to-yellow-500 border border-yellow-400"; 
  };

  return (
    <TooltipProvider>
      <div className="w-full bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div className="flex flex-col gap-2">
          
          <div className="flex text-[10px] text-zinc-500 h-4 relative ml-8">
            {monthLabels.map((m, i) => (
              <span key={i} className="absolute" style={{ left: `${(m.index / 53) * 100}%` }}>
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-[10px] text-zinc-600 pb-2 pt-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div className="flex justify-between gap-[3px] flex-1"> 
              {Array.from({ length: 53 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px] flex-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = days[weekIndex * 7 + dayIndex];
                    if (!day) return null;
                    const dateStr = format(day, "yyyy-MM-dd");
                    const count = proofCounts[dateStr] || 0;

                    return (
                      <Tooltip key={dateStr} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div className={`w-full aspect-square rounded-[1px]  ${getColor(count)} transition-all cursor-pointer`} />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-zinc-900 text-white border-zinc-800 text-[10px]">
                          <p className="font-bold">{count} Proofs</p>
                          <p className="text-zinc-500">{format(day, "MMM do, yyyy")}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-zinc-500">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-zinc-900 border border-zinc-800" />
            <div className="w-3 h-3 rounded-sm bg-red-900/40 border border-red-800/50" />
            <div className="w-3 h-3 rounded-sm bg-red-600 border border-red-500" />
            <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-red-500 to-yellow-500 border border-yellow-400" />
            <span>More</span>
          </div>

        </div>
      </div>
    </TooltipProvider>
  );
}