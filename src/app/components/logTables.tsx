"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Rocket, Calendar, Tag, ChevronRight, Loader2 } from "lucide-react";
import { EditProofDialog } from "./editLog";
import { DeleteButton } from "./deleteLogBtn";
import { format, isToday, isYesterday } from "date-fns";
import { getMoreProofs } from "../actions/log";
import { Button } from "@/components/ui/button";

export function ProofsTable({ initialProofs, totalCount }: { initialProofs: any[]; totalCount: number }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [proofs, setProofs] = useState(initialProofs);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(proofs.length < totalCount);

  const loadMore = async () => {
    setLoading(true);
    const nextProofs = await getMoreProofs(proofs.length);
    
    if (nextProofs.length === 0) {
      setHasMore(false);
    } else {
      const updatedProofs = [...proofs, ...nextProofs];
      setProofs(updatedProofs);
      if (updatedProofs.length >= totalCount) 
        setHasMore(false);
    }
    setLoading(false);
  };

  const hasNoTasksAtAll = initialProofs.length === 0;

  // ilter the proofs first
  const filteredProofs = proofs.filter((proof) =>{
        const dateString = format(new Date(proof.createdAt), "MMMM do yyyy").toLowerCase();
   return proof.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proof.category.toLowerCase().includes(searchQuery.toLowerCase())||
    dateString.includes(searchQuery.toLowerCase())
  }
  );

  //  groupify by date
  const groupedProofs = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    
    filteredProofs.forEach((proof) => {
      const dateKey = format(new Date(proof.createdAt), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(proof);
    });

    // sort dates descending(newest first)
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({
        date,
        proofs: groups[date],
      }));
  }, [filteredProofs]);

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM do, yyyy");
  };

  if (hasNoTasksAtAll) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl p-8 md:p-12 bg-zinc-950/30 text-center">
        <div className="bg-zinc-900 p-4 rounded-full mb-4">
          <Rocket className="h-8 w-8 text-zinc-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No tasks created yet</h3>
        <p className="text-zinc-400 mb-6 max-w-xs mx-auto">
          It looks like you haven't shipped anything yet. Go create your first task for today!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search by title or category or dates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-950 border-zinc-800 focus:ring-red-500 w-full md:w-1/3 text-white"
        />
      </div>

      {/* grouped Logs  */}
      <div className="space-y-10">
        {groupedProofs.length > 0 ? (
          groupedProofs.map((group) => (
            <div key={group.date} className="relative">
              <div className="sticky top-0 z-10 flex items-center gap-4 mb-4 bg-black/50 backdrop-blur-sm py-2">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {getDateLabel(group.date)}
                </span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {group.proofs.map((proof) => (
                  <div 
                    key={proof.id} 
                    className="group relative flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <h4 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                          {proof.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                            {proof.category}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {format(new Date(proof.createdAt), "hh:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity">
                      {proof.proofUrl && (
                        <a 
                          href={proof.proofUrl} 
                          target="_blank" 
                          className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <EditProofDialog proof={proof} />
                      <DeleteButton id={proof.id} />
                    </div>
                    
                    <div className="flex md:hidden items-center gap-2">
                         <EditProofDialog proof={proof} />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-20 text-zinc-600 italic">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
      
              {hasMore && (
        <div className="flex justify-center pt-8">
          <Button 
            onClick={loadMore} 
            disabled={loading}
            variant="outline"

            className="border-zinc-800 text-black hover:text-zinc-100 hover:bg-zinc-800"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Activities"
              
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

