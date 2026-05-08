import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTags, createTag, updateTag, deleteTag, fetchArticles } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Tag as TagIcon, 
  Edit2, 
  Trash2,
  MoreVertical,
  Hash,
  Activity,
  AlertCircle,
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminTags() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [deleteConfirmTag, setDeleteConfirmTag] = useState<any>(null);
  
  const [name, setName] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: "name" | "count"; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });

  const requestSort = (key: "name" | "count") => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const { data: articlesData } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticles(),
  });

  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created successfully!");
      setIsOpen(false);
      setName("");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag updated!");
      setEditingTag(null);
      setName("");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag deleted.");
    }
  });

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setName(tag.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data: { name } });
    } else {
      createMutation.mutate({ name });
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmTag) {
      deleteMutation.mutate(deleteConfirmTag.id);
      setDeleteConfirmTag(null);
    }
  };

  const sortedTags = useMemo(() => {
    if (!tags) return [];
    let items = [...tags];
    items.sort((a, b) => {
      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else {
        const aCount = articlesData?.articles?.filter((art: any) => art.tags?.includes(a.name)).length || 0;
        const bCount = articlesData?.articles?.filter((art: any) => art.tags?.includes(b.name)).length || 0;
        return sortConfig.direction === "asc" ? aCount - bCount : bCount - aCount;
      }
    });
    return items;
  }, [tags, sortConfig, articlesData]);

  if (tagsLoading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
      <span className="text-sm">Loading tags...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tags</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage labels used to classify your articles.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => requestSort("name")}
              className={cn(
                "h-7 px-3 text-[10px] font-bold uppercase tracking-wider rounded-md",
                sortConfig.key === "name" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <div className="flex items-center gap-1.5">
                Name
                {sortConfig.key === "name" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => requestSort("count")}
              className={cn(
                "h-7 px-3 text-[10px] font-bold uppercase tracking-wider rounded-md",
                sortConfig.key === "count" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <div className="flex items-center gap-1.5">
                Usage
                {sortConfig.key === "count" && (sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
              </div>
            </Button>
          </div>

          <Dialog open={isOpen || !!editingTag} onOpenChange={(val) => {
            if (!val) {
              setIsOpen(false);
              setEditingTag(null);
              setName("");
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary/90 text-white font-semibold h-10 px-6 gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                New Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl border-slate-200 shadow-xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  {editingTag ? "Edit Tag" : "Create Tag"}
                </DialogTitle>
                <p className="text-sm text-slate-500">Add or modify label classification tags.</p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Tag Name</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="e.g. Breaking News" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-lg border-slate-200 h-10 pl-10 focus-visible:ring-primary/20"
                      required 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={updateMutation.isPending || createMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-10 rounded-lg">
                    {(updateMutation.isPending || createMutation.isPending) ? "Saving..." : editingTag ? "Save Changes" : "Create Tag"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {sortedTags?.map((tag: any) => {
          const articleCount = articlesData?.articles?.filter((a: any) => a.tags?.includes(tag.name)).length || 0;
          
          return (
            <div key={tag.id} className="bg-white border border-slate-200 rounded-xl group hover:border-primary/30 transition-all flex flex-col shadow-sm hover:shadow-md">
              <div className="p-5 flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <TagIcon className="w-5 h-5" />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 transition-all rounded-lg text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-lg min-w-[160px]">
                      <DropdownMenuLabel className="text-xs font-semibold text-slate-400 px-3 py-2">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem onClick={() => handleEdit(tag)} className="cursor-pointer gap-2 text-sm">
                        <Edit2 className="w-3.5 h-3.5" /> Edit Tag
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteConfirmTag(tag)}
                        className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Tag
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-slate-800 truncate">{tag.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Hash className="w-3 h-3 text-slate-300" />
                    <span className="text-[11px] font-mono text-slate-400">/{tag.slug}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between rounded-b-xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400">
                    AI
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                    {articleCount} Occurrences
                  </span>
                </div>
                <div className="flex items-center gap-1 transition-all">
                  <Button onClick={() => handleEdit(tag)} variant="ghost" size="icon" className="h-7 w-7 rounded-md text-slate-400 hover:text-primary hover:bg-primary/10">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 border border-emerald-100 bg-emerald-50/50 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Tags Optimized</h4>
            <p className="text-xs text-slate-500 mt-0.5">Classification engine is running at peak performance.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold text-emerald-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Operational
        </div>
      </div>

      <AlertDialog open={!!deleteConfirmTag} onOpenChange={(val) => !val && setDeleteConfirmTag(null)}>
        <AlertDialogContent className="rounded-xl border-slate-200 shadow-xl max-w-md">
          <AlertDialogHeader>
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">Delete Tag</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 leading-relaxed pt-1">
              Are you sure you want to delete the <span className="font-semibold text-slate-800">#{deleteConfirmTag?.name}</span> tag? 
              <br /><br />
              This will remove the tag from all articles. This process is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 gap-2">
            <AlertDialogCancel className="rounded-lg border-slate-200 font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-6"
            >
              Delete Tag
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
