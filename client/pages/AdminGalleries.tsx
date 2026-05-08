import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGalleries, deleteGallery } from "@/lib/api-client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminGalleries() {
  const queryClient = useQueryClient();
  const { data: galleries, isLoading } = useQuery({
    queryKey: ["galleries"],
    queryFn: fetchGalleries,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      toast.success("Gallery deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete gallery");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this gallery?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CELLEB CLICKS</h1>
          <p className="text-slate-500 mt-1">Manage and control the CELLEB CLICKS galleries shown across the site.</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/galleries/new">
            <Plus className="w-4 h-4" />
            Create Gallery
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[100px]">Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleries?.map((gallery) => (
              <TableRow key={gallery.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {gallery.images[0] ? (
                      <img 
                        src={gallery.images[0].url} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{gallery.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1.5 font-medium">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {gallery.images.length} images
                  </Badge>
                </TableCell>
                <TableCell>
                  {gallery.active ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {formatDate(gallery.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/galleries/edit/${gallery.id}`}>
                        <Edit className="w-4 h-4 text-slate-500" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(gallery.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {galleries?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No galleries found. Create your first one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
