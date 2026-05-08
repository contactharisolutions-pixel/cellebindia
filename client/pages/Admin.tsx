import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchArticles, deleteArticle, fetchCategories } from "@/lib/api-client";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  FileText,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  PenLine,
  CalendarClock,
  Globe,
  RotateCcw,
  Star,
  Flame,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useState, useMemo } from "react";

const statusConfig: Record<string, { label: string; className: string }> = {
  Published: { label: "Published", className: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50" },
  Draft: { label: "Draft", className: "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50" },
  "In Review": { label: "In Review", className: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50" },
  Scheduled: { label: "Scheduled", className: "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50" },
  Approved: { label: "Approved", className: "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-50" },
  Archived: { label: "Archived", className: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-50" },
};

type ViewMode = "all" | "drafts" | "scheduled";

function getViewMode(pathname: string): ViewMode {
  if (pathname === "/admin/posts/drafts") return "drafts";
  if (pathname === "/admin/posts/scheduled") return "scheduled";
  return "all";
}

function SortableHead({
  label,
  sortKey,
  sortConfig,
  onSort,
  className,
}: {
  label: string;
  sortKey: string;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSort: (key: string) => void;
  className?: string;
}) {
  return (
    <TableHead
      className={cn(
        "text-slate-500 font-semibold text-xs uppercase tracking-wider py-4 cursor-pointer hover:text-primary transition-colors select-none",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {sortConfig?.key === sortKey ? (
          sortConfig.direction === "asc" ? (
            <ArrowUp className="w-3 h-3 text-primary" />
          ) : (
            <ArrowDown className="w-3 h-3 text-primary" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-25" />
        )}
      </div>
    </TableHead>
  );
}

export default function AdminArticles() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const viewMode = getViewMode(location.pathname);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticles({ admin: true }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete article");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const requestSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const allArticles = data?.articles || [];

  const filteredArticles = useMemo(() => {
    let articles = [...allArticles];

    // Filter by view mode (tab)
    if (viewMode === "drafts") {
      articles = articles.filter((a) => a.status === "Draft" || a.status === "In Review");
    } else if (viewMode === "scheduled") {
      articles = articles.filter((a) => a.status === "Scheduled" || a.status === "Approved");
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "all") {
      articles = articles.filter((a) => a.category?.includes(selectedCategory));
    }

    // Date range
    if (dateFrom) articles = articles.filter((a) => a.date >= dateFrom);
    if (dateTo) articles = articles.filter((a) => a.date <= dateTo);

    // Sort
    if (sortConfig) {
      articles.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a] ?? "";
        const bVal = b[sortConfig.key as keyof typeof b] ?? "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return articles;
  }, [allArticles, viewMode, searchQuery, selectedCategory, dateFrom, dateTo, sortConfig]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredArticles.map((a: any) => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newIds = new Set(selectedIds);
    if (checked) newIds.add(id);
    else newIds.delete(id);
    setSelectedIds(newIds);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} article(s)?`)) return;
    
    setIsDeletingBulk(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteArticle(id)));
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      setSelectedIds(new Set());
      toast.success(`${selectedIds.size} article(s) deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete some articles");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  /* ── Per-view metadata ── */
  const viewMeta = {
    all: {
      title: "All Articles",
      description: "Browse, filter and manage every article on your platform.",
      icon: FileText,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      chips: [
        { label: "Total", val: filteredArticles.length, color: "bg-slate-100 text-slate-700" },
        { label: "Published", val: filteredArticles.filter((a) => a.status === "Published").length, color: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
        { label: "Draft", val: filteredArticles.filter((a) => a.status === "Draft").length, color: "bg-slate-50 text-slate-500 border border-slate-200" },
        { label: "Scheduled", val: filteredArticles.filter((a) => a.status === "Scheduled").length, color: "bg-blue-50 text-blue-700 border border-blue-100" },
      ],
      emptyTitle: "No articles found",
      emptyDesc: "Try adjusting your filters or create a new article.",
      emptyIcon: FileText,
    },
    drafts: {
      title: "Drafts",
      description: "Articles saved as drafts or currently in review — not yet visible to the public.",
      icon: PenLine,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      chips: [
        { label: "Total Drafts", val: filteredArticles.length, color: "bg-slate-100 text-slate-700" },
        { label: "Draft", val: filteredArticles.filter((a) => a.status === "Draft").length, color: "bg-slate-50 text-slate-500 border border-slate-200" },
        { label: "In Review", val: filteredArticles.filter((a) => a.status === "In Review").length, color: "bg-amber-50 text-amber-700 border border-amber-100" },
      ],
      emptyTitle: "No drafts found",
      emptyDesc: "All articles have been published or there are no drafts matching your filters.",
      emptyIcon: PenLine,
    },
    scheduled: {
      title: "Scheduled",
      description: "Articles approved for publication or queued to publish at a future date.",
      icon: CalendarClock,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      chips: [
        { label: "Total Queued", val: filteredArticles.length, color: "bg-blue-50 text-blue-700 border border-blue-100" },
        { label: "Approved", val: filteredArticles.filter((a) => a.status === "Approved").length, color: "bg-violet-50 text-violet-700 border border-violet-100" },
        { label: "Scheduled", val: filteredArticles.filter((a) => a.status === "Scheduled").length, color: "bg-blue-50 text-blue-700 border border-blue-100" },
      ],
      emptyTitle: "No scheduled articles",
      emptyDesc: "No articles are queued for publication. Approve or schedule articles from the article editor.",
      emptyIcon: CalendarClock,
    },
  }[viewMode];

  const hasFilters = searchQuery || selectedCategory !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", viewMeta.iconBg)}>
            <viewMeta.icon className={cn("w-5 h-5", viewMeta.iconColor)} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{viewMeta.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{viewMeta.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            className="gap-2 text-slate-600 border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm hidden sm:flex"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              className="gap-2 shadow-sm rounded-lg"
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
            >
              {isDeletingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete Selected ({selectedIds.size})
            </Button>
          )}
          <Button asChild className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm rounded-lg">
            <Link to="/admin/new">
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Context chips ── */}
      <div className="flex flex-wrap gap-2.5">
        {viewMeta.chips.map((c) => (
          <div key={c.label} className={cn("flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold", c.color)}>
            <viewMeta.icon className="w-3.5 h-3.5" />
            {c.label}: <span className="font-bold">{c.val}</span>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by title, slug or author…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-slate-200 rounded-lg h-10 text-sm focus-visible:ring-primary/30"
            />
          </div>

          {/* Category */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48 border-slate-200 rounded-lg h-10 text-sm">
              <Filter className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200">
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pl-9 border-slate-200 rounded-lg h-10 w-36 text-xs"
              />
            </div>
            <span className="text-slate-400 text-sm font-medium">–</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="pl-9 border-slate-200 rounded-lg h-10 w-36 text-xs"
              />
            </div>
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setDateFrom("");
                setDateTo("");
              }}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-sm gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary/40" />
            <p className="text-sm font-medium">Loading articles…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200 hover:bg-slate-50">
                  <TableHead className="w-12 text-center pl-6 py-4">
                    <Checkbox 
                      checked={filteredArticles.length > 0 && selectedIds.size === filteredArticles.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider w-12 text-center">#</TableHead>
                  <SortableHead label="Article Title" sortKey="title" sortConfig={sortConfig} onSort={requestSort} className="min-w-[320px] w-[40%]" />
                  <SortableHead label="Category" sortKey="category" sortConfig={sortConfig} onSort={requestSort} className="whitespace-nowrap" />
                  <SortableHead label="Author" sortKey="author" sortConfig={sortConfig} onSort={requestSort} className="whitespace-nowrap" />
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Placement</TableHead>

                  {/* Status column: visible on All Articles and Drafts */}
                  {viewMode !== "scheduled" && (
                    <SortableHead label="Status" sortKey="status" sortConfig={sortConfig} onSort={requestSort} className="whitespace-nowrap" />
                  )}

                  {/* Scheduled-specific column */}
                  {viewMode === "scheduled" && (
                    <SortableHead label="Publish Status" sortKey="status" sortConfig={sortConfig} onSort={requestSort} className="whitespace-nowrap" />
                  )}

                  <SortableHead
                    label={viewMode === "scheduled" ? "Scheduled Date" : "Date"}
                    sortKey="date"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="whitespace-nowrap"
                  />
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-right pr-6 whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", viewMeta.iconBg)}>
                          <viewMeta.emptyIcon className={cn("w-7 h-7 opacity-50", viewMeta.iconColor)} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">{viewMeta.emptyTitle}</p>
                          <p className="text-sm text-slate-400 mt-0.5 max-w-xs mx-auto">{viewMeta.emptyDesc}</p>
                        </div>
                        {!hasFilters && (
                          <Button asChild size="sm" className="mt-2 bg-primary hover:bg-primary/90 text-white gap-2 rounded-lg">
                            <Link to="/admin/new">
                              <Plus className="w-3.5 h-3.5" />
                              Create Article
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article: any, index: number) => (
                    <TableRow
                      key={article.id}
                      className={cn("hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-b-0 group", selectedIds.has(article.id) && "bg-slate-50")}
                    >
                      <TableCell className="w-12 text-center pl-6">
                        <Checkbox 
                          checked={selectedIds.has(article.id)}
                          onCheckedChange={(checked) => handleSelect(article.id, !!checked)}
                          aria-label={`Select ${article.title}`}
                        />
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono text-slate-400">
                        {(index + 1).toString().padStart(2, "0")}
                      </TableCell>
                      <TableCell className="max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] xl:max-w-[500px]">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                            <img
                              src={article.image}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/44x44/f1f5f9/94a3b8?text=N/A";
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800 group-hover:text-primary transition-colors truncate leading-tight text-sm" title={article.title}>
                              {article.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-slate-400 font-mono truncate" title={`/${article.slug}`}>/{article.slug}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                          {article.category}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="text-sm text-slate-600 font-medium">{article.author}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          {article.featured ? (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#E30000] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                              <Star className="w-3 h-3 fill-current" /> Top Story
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                              -
                            </span>
                          )}
                          {(article.seo?.whatsHotOrder ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                              <Flame className="w-3 h-3 fill-current" /> What's Hot (#{article.seo.whatsHotOrder})
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status / Publish status badge */}
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          className={cn(
                            "text-xs font-semibold rounded-full px-2.5 py-0.5",
                            (statusConfig[article.status] || statusConfig["Draft"]).className
                          )}
                        >
                          {viewMode === "scheduled" ? (
                            <span className="flex items-center gap-1">
                              {article.status === "Approved"
                                ? <><CheckCircle2 className="w-3 h-3" /> Approved</>
                                : <><CalendarClock className="w-3 h-3" /> Scheduled</>}
                            </span>
                          ) : (
                            (statusConfig[article.status] || statusConfig["Draft"]).label
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-300" />
                            <span className="text-xs text-slate-600 font-medium">Created: {formatDate(article.date)}</span>
                          </div>
                          {article.status === "Scheduled" && article.scheduledDate && (
                            <div className="flex items-center gap-1.5">
                              <CalendarClock className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-xs text-blue-600 font-bold">Rel: {new Date(article.scheduledDate).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right pr-6 whitespace-nowrap">
                        <div className="flex justify-end items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          >
                            <a href={`/article/${article.id}`} target="_blank" rel="noreferrer">
                              <Globe className="w-4 h-4" />
                            </a>
                          </Button>
                          <Link to={`/admin/edit/${article.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(article.id)}
                            disabled={deleteMutation.isPending}
                            className="h-8 w-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Footer */}
        {!isLoading && filteredArticles.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <p className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-700">{filteredArticles.length}</span>{" "}
              {viewMode === "drafts" ? "draft" : viewMode === "scheduled" ? "scheduled" : "article"}
              {filteredArticles.length !== 1 ? "s" : ""}
              {hasFilters ? " (filtered)" : ""}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {viewMode === "all" && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    {filteredArticles.filter((a) => a.status === "Published").length} Published
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-slate-300 rounded-full" />
                    {filteredArticles.filter((a) => a.status === "Draft").length} Drafts
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    {filteredArticles.filter((a) => a.status === "Scheduled").length} Scheduled
                  </span>
                </>
              )}
              {viewMode === "drafts" && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-slate-300 rounded-full" />
                    {filteredArticles.filter((a) => a.status === "Draft").length} Drafts
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    {filteredArticles.filter((a) => a.status === "In Review").length} In Review
                  </span>
                </>
              )}
              {viewMode === "scheduled" && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-violet-400 rounded-full" />
                    {filteredArticles.filter((a) => a.status === "Approved").length} Approved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    {filteredArticles.filter((a) => a.status === "Scheduled").length} Scheduled
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
