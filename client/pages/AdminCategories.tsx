import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, createCategory, updateCategory, deleteCategory, fetchArticles } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Folder, 
  Edit2, 
  Trash2,
  MoreVertical,
  CheckCircle2,
  Layers,
  Archive,
  ExternalLink
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: articlesData } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticles(),
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create category.")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated!");
      setEditingCat(null);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted.");
    }
  });

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleEdit = (cat: any) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCat) {
      updateMutation.mutate({ id: editingCat.id, data: { name, description } });
    } else {
      createMutation.mutate({ name, description });
    }
  };

  const handleDelete = (cat: any) => {
    setDeleteConfirmCat(cat);
  };

  const confirmDelete = () => {
    if (deleteConfirmCat) {
      deleteMutation.mutate(deleteConfirmCat.id);
      setDeleteConfirmCat(null);
    }
  };

  if (catsLoading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
      <span className="text-sm">Loading categories...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">Organize your articles into different groups.</p>
        </div>
        
        <Dialog open={isOpen || !!editingCat} onOpenChange={(val) => {
          if (!val) {
            setIsOpen(false);
            setEditingCat(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl border-slate-200 shadow-xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {editingCat ? "Edit Category" : "Create Category"}
              </DialogTitle>
              <p className="text-sm text-slate-500">{editingCat ? "Update category details." : "Add a new article category."}</p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Category Name</Label>
                <Input
                  placeholder="e.g. Cinema News"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border-slate-200 focus-visible:ring-primary/30"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Description (Optional)</Label>
                <Textarea
                  placeholder="Brief description for internal reference..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-lg border-slate-200 min-h-[90px] resize-none"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={updateMutation.isPending || createMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-10">
                  {(updateMutation.isPending || createMutation.isPending) ? "Saving..." : "Save Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories?.map((cat: any) => {
          const articleCount = articlesData?.articles?.filter((a: any) => a.category === cat.name).length || 0;
          return (
            <div key={cat.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Folder className="w-5 h-5 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-200 w-44 shadow-lg">
                      <DropdownMenuLabel className="text-xs font-semibold text-slate-400 px-3 py-2">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem onClick={() => handleEdit(cat)} className="cursor-pointer gap-2 text-sm">
                        <Edit2 className="w-3.5 h-3.5" /> Edit Category
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm">
                        <ExternalLink className="w-3.5 h-3.5" /> View Public Page
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem
                        onClick={() => handleDelete(cat)}
                        className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">/{cat.slug}</p>
                {cat.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{cat.description}</p>
                )}
              </div>
              <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-b-xl">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Layers className="w-3 h-3" />
                  {articleCount} Articles
                </span>
                <div className="flex items-center gap-1">
                  <Button onClick={() => handleEdit(cat)} variant="ghost" size="icon" className="h-7 w-7 rounded-md text-slate-400 hover:text-primary hover:bg-primary/10">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button onClick={() => handleDelete(cat)} variant="ghost" size="icon" className="h-7 w-7 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">All Categories are Active</h4>
            <p className="text-xs text-slate-500 mt-0.5">All categories are properly mapped to your articles.</p>
          </div>
        </div>
        <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 text-sm font-semibold rounded-lg">
          Review Categories
        </Button>
      </div>

      <AlertDialog open={!!deleteConfirmCat} onOpenChange={(val) => !val && setDeleteConfirmCat(null)}>
        <AlertDialogContent className="rounded-xl border-slate-200 shadow-xl max-w-md">
          <AlertDialogHeader>
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 leading-relaxed pt-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">"{deleteConfirmCat?.name}"</span>?
              This will affect{" "}
              <span className="font-bold text-red-600">
                {articlesData?.articles?.filter((a: any) => a.category === deleteConfirmCat?.name).length || 0} articles
              </span>{" "}
              currently in this category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 gap-2">
            <AlertDialogCancel className="rounded-lg border-slate-200 font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-6"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
