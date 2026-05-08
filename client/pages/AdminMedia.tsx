import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMedia, deleteMedia, uploadMedia } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Search, 
  Image as ImageIcon,
  Grid,
  List as ListIcon,
  Info,
  Upload,
  FileIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive
} from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function AdminMedia() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: fetchMedia,
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadMedia(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("File uploaded successfully.");
      setIsUploadOpen(false);
      setUploadProgress(0);
      setIsUploading(false);
    },
    onError: () => {
      toast.error("Upload failed.");
      setIsUploading(false);
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 95) clearInterval(interval);
    }, 100);

    const formData = new FormData();
    formData.append("file", file);
    
    setTimeout(() => {
      uploadMutation.mutate(formData);
      clearInterval(interval);
      setUploadProgress(100);
    }, 2000);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("File deleted successfully.");
    }
  });

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("URL copied to clipboard.");
  };

  const mediaList = data?.media || [];
  const filteredMedia = mediaList.filter((m: any) => 
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and organize all uploaded images.</p>
        </div>

        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold h-10 px-6 shadow-sm gap-2 rounded-lg"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-1.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search files..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-transparent shadow-none h-9 text-sm focus-visible:border-slate-200 focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView("grid")}
            className={cn(
              "h-8 px-3 rounded-md transition-all",
              view === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView("list")}
            className={cn(
              "h-8 px-3 rounded-md transition-all",
              view === "list" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ListIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-sm">Loading media...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No media found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">You haven't uploaded any files yet or no files match your search.</p>
          <Button onClick={() => setIsUploadOpen(true)} variant="outline" className="mt-6 border-slate-200 text-slate-700">
            Click to upload your first file
          </Button>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((asset: any) => (
            <div 
              key={asset.id} 
              className="group bg-white border border-slate-200 rounded-xl relative aspect-square overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
            >
              <img 
                src={asset.url} 
                alt={asset.filename} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-slate-900/80 to-transparent transition-opacity flex flex-col justify-end p-3 pointer-events-none">
                 <div className="text-xs font-semibold text-white truncate max-w-full pointer-events-auto">
                   {asset.filename}
                 </div>
                 <div className="text-[10px] text-white/70 font-medium tracking-tight pointer-events-auto">
                   {formatSize(asset.size)}
                 </div>
              </div>
              
              <div className="absolute top-2 right-2 flex gap-1.5 transition-opacity">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  onClick={() => copyToClipboard(asset.url)}
                  className="h-7 w-7 bg-white/90 backdrop-blur hover:bg-white text-slate-700 rounded-md shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  onClick={() => {
                    if(confirm("Are you sure you want to delete this file?")) deleteMutation.mutate(asset.id)
                  }}
                  className="h-7 w-7 bg-red-500/90 backdrop-blur hover:bg-red-600 rounded-md shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">File Details</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedia.map((asset: any) => (
                <tr key={asset.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden shrink-0">
                        <img src={asset.url} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-slate-800 truncate">{asset.filename}</span>
                        <span className="text-xs text-slate-400">{asset.mimetype}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-sm text-slate-600 font-medium">{formatSize(asset.size)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-sm text-slate-600 font-medium">{new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md font-medium text-xs gap-1.5"
                        onClick={() => copyToClipboard(asset.url)}
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md font-medium text-xs gap-1.5"
                        onClick={() => {
                          if(confirm("Are you sure you want to delete this file?")) deleteMutation.mutate(asset.id)
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="rounded-xl border-slate-200 shadow-xl max-w-md p-0 overflow-hidden">
          <div className="bg-white border-b border-slate-100 p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">Upload Media</DialogTitle>
              <p className="text-slate-500 text-sm mt-1">Upload images to your media library.</p>
            </DialogHeader>
          </div>
          
          <div className="p-6 bg-slate-50/50">
            {isUploading ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    <span className="text-sm font-semibold text-slate-700">Uploading and optimizing...</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 rounded-full bg-slate-200" />
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className={cn("w-4 h-4", uploadProgress > 40 ? "text-emerald-500" : "text-slate-200")} />
                  <span className="text-xs font-semibold text-slate-500">Processing file</span>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <input 
                  type="file" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*"
                />
                <div className="border-2 border-dashed border-slate-200 rounded-xl group-hover:border-primary/50 group-hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center p-10 space-y-4 bg-white">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-400">
                      <Upload className="w-8 h-8" />
                   </div>
                   <div>
                     <p className="font-semibold text-slate-900 text-base">Select a file to upload</p>
                     <p className="text-slate-500 text-sm mt-1">Supports common image formats up to 10MB</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
