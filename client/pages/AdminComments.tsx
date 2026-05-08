import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchComments, updateCommentStatus, deleteComment } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  MessageSquare, CheckCircle2, AlertOctagon, Trash2,
  User, Calendar, ExternalLink, ShieldCheck, ShieldAlert, Clock, Loader2,
  ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "pending", "approved", "spam"] as const;
type FilterType = typeof FILTERS[number];

const filterConfig: Record<FilterType, { label: string; color: string }> = {
  all: { label: "All", color: "" },
  pending: { label: "Pending", color: "text-amber-700 bg-amber-50" },
  approved: { label: "Approved", color: "text-emerald-700 bg-emerald-50" },
  spam: { label: "Blocked", color: "text-red-700 bg-red-50" },
};

export default function AdminComments() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: comments, isLoading } = useQuery({ queryKey: ["comments"], queryFn: fetchComments });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateCommentStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["comments"] }); toast.success("Status updated."); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["comments"] }); toast.success("Comment deleted."); },
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredComments = useMemo(() => {
    let items = comments?.filter((c: any) =>
      filter === "all" ? true : c.status === filter
    ) || [];

    if (sortConfig !== null) {
      items = [...items].sort((a, b) => {
        let aValue = a[sortConfig.key as keyof typeof a];
        let bValue = b[sortConfig.key as keyof typeof b];

        // Author name sorting
        if (sortConfig.key === "author") aValue = a.author_name;
        if (sortConfig.key === "author") bValue = b.author_name;
        
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [comments, filter, sortConfig]);

  const pending = comments?.filter((c: any) => c.status === "pending").length || 0;
  const approved = comments?.filter((c: any) => c.status === "approved").length || 0;
  const spam = comments?.filter((c: any) => c.status === "spam").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Comments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and review user comments on your articles.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                filter === f
                  ? "bg-white text-slate-800 shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {filterConfig[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Awaiting Approval", val: pending, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Approved", val: approved, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Blocked / Spam", val: spam, icon: ShieldAlert, color: "text-red-600 bg-red-50 border-red-100" },
        ].map((s, i) => (
          <div key={i} className={cn("flex items-center gap-4 p-4 rounded-xl border", s.color)}>
            <s.icon className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-2xl font-bold leading-none">{s.val}</p>
              <p className="text-xs font-medium mt-0.5 opacity-70">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comments list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Loading comments…</span>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">No comments in this filter</p>
            <p className="text-xs text-slate-400 mt-1">Try switching to a different tab.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th 
                  className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3.5 px-5 w-1/5 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("author")}
                >
                  <div className="flex items-center gap-2">
                    Author
                    {sortConfig?.key === "author" ? (
                      sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3.5 px-4">Comment Text</th>
                <th 
                  className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3.5 px-4 w-32 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("created_at")}
                >
                  <div className="flex items-center gap-2">
                    Date
                    {sortConfig?.key === "created_at" ? (
                      sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3.5 px-4 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComments.map((comment: any) => (
                <tr key={comment.id} className="hover:bg-slate-50/60 transition-colors group">
                  {/* Author */}
                  <td className="px-5 py-5 align-top">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {comment.author_name || "Anonymous"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 truncate">{comment.author_email || "—"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Content */}
                  <td className="px-4 py-5 align-top">
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 italic">
                      "{comment.content}"
                    </p>
                    {comment.article_title && (
                      <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-xs font-medium text-slate-600 truncate">{comment.article_title}</span>
                      </div>
                    )}
                  </td>

                  {/* Date & Status */}
                  <td className="px-4 py-5 align-top">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 ">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={cn(
                        "inline-flex w-fit text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        comment.status === "approved" ? "text-emerald-700 bg-emerald-50 border border-emerald-100" :
                        comment.status === "spam" ? "text-red-600 bg-red-50 border border-red-100" :
                        "text-amber-700 bg-amber-50 border border-amber-100"
                      )}>
                        {comment.status}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-5 align-top">
                    <div className="flex flex-col gap-2">
                      {comment.status !== "approved" && (
                        <Button
                          size="sm"
                          onClick={() => statusMutation.mutate({ id: comment.id, status: "approved" })}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-lg"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Approve
                        </Button>
                      )}
                      {comment.status !== "spam" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => statusMutation.mutate({ id: comment.id, status: "spam" })}
                          className="border-amber-200 text-amber-700 hover:bg-amber-50 text-xs gap-1.5 rounded-lg"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" /> Mark Spam
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { if (confirm("Delete this comment?")) deleteMutation.mutate(comment.id); }}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs gap-1.5 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
