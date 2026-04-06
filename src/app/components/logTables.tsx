"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Rocket, Calendar, Tag } from "lucide-react";
import { EditProofDialog } from "./editLog";
import { DeleteButton } from "./deleteLogBtn";

export function ProofsTable({ initialProofs }: { initialProofs: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const hasNoTasksAtAll = initialProofs.length === 0;

  const filteredProofs = initialProofs.filter((proof) =>
    proof.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proof.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-950 border-zinc-800 focus:ring-red-500 w-full md:w-1/3 text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredProofs.map((proof) => (
          <div key={proof.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-lg">{proof.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <Tag className="w-3 h-3 text-zinc-500" />
                   <span className="text-xs text-zinc-400 uppercase tracking-wider">{proof.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {proof.proofUrl && (
                  <a href={proof.proofUrl} target="_blank" className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <EditProofDialog proof={proof} />
                <DeleteButton id={proof.id} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 pt-2 border-t border-zinc-900">
              <Calendar className="w-3 h-3" />
              {new Date(proof.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/50">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900/50 text-zinc-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Work Title</th>
              <th className="px-6 py-4 font-medium text-center">Category</th>
              <th className="px-6 py-4 font-medium text-center">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredProofs.length > 0 ? (
              filteredProofs.map((proof) => (
                <tr key={proof.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">{proof.title}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 uppercase">
                      {proof.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-zinc-500">
                    {new Date(proof.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {proof.proofUrl && (
                        <a href={proof.proofUrl} target="_blank" className="text-zinc-500 hover:text-blue-500 p-1">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <EditProofDialog proof={proof} />
                      <DeleteButton id={proof.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-600 italic">
                  No results found for "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}