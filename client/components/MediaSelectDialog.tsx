import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMedia, uploadMedia } from "@/lib/api-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Upload, CheckCircle2, Loader2, Link as LinkIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaSelectDialogProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

export function MediaSelectDialog({ onSelect, trigger }: MediaSelectDialogProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("library");
  const [search, setSearch] = useState("");
  
  // Upload State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // URL State
  const [manualUrl, setManualUrl] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: fetchMedia,
    enabled: isOpen
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadMedia(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("File uploaded successfully.");
      setIsUploading(false);
      setUploadProgress(0);
      if (data && data.media && data.media.url) {
        onSelect(data.media.url);
        setIsOpen(false);
      } else {
        // Fallback if no URL in response
        setActiveTab("library");
      }
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
    }, 1500);
  };

  const handleManualUrl = () => {
    if (manualUrl.trim()) {
      onSelect(manualUrl.trim());
      setIsOpen(false);
      setManualUrl("");
    }
  };

  const mediaList = data?.media || [];
  const filteredMedia = mediaList.filter((m: any) => 
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button type="button" variant="outline" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Select Image
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-xl border-slate-200">
        <div className="bg-white border-b border-slate-100 p-4 md:p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Select Media</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="bg-slate-100 p-1 w-full justify-start h-auto rounded-lg">
              <TabsTrigger value="library" className="flex-1 max-w-[150px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-1.5 text-sm gap-2">
                <ImageIcon className="w-4 h-4" /> Library
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex-1 max-w-[150px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-1.5 text-sm gap-2">
                <Upload className="w-4 h-4" /> Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="flex-1 max-w-[150px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-1.5 text-sm gap-2">
                <LinkIcon className="w-4 h-4" /> URL
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 flex-1 overflow-y-auto max-h-[50vh] min-h-[50vh] bg-slate-50/50 rounded-xl border border-slate-200">
              
              <TabsContent value="library" className="h-full m-0 p-4 pb-12 flex flex-col">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search media..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white shadow-sm border-slate-200"
                  />
                </div>

                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" />
                    <span className="text-sm font-medium">Loading media...</span>
                  </div>
                ) : filteredMedia.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-900">No media found</p>
                    <p className="text-sm text-slate-500 mt-1 mb-4">Upload some files to see them here.</p>
                    <Button onClick={() => setActiveTab("upload")} variant="outline" size="sm">
                      Upload File
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto">
                    {filteredMedia.map((asset: any) => (
                      <div 
                        key={asset.id} 
                        onClick={() => {
                          onSelect(asset.url);
                          setIsOpen(false);
                        }}
                        className="group bg-white border border-slate-200 rounded-xl relative aspect-square overflow-hidden cursor-pointer hover:border-primary hover:shadow-md transition-all hover:-translate-y-0.5"
                      >
                        <img 
                          src={asset.url} 
                          alt={asset.filename} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent pt-6 pb-2 px-3">
                           <div className="text-[11px] font-semibold text-white truncate shadow-sm">
                             {asset.filename}
                           </div>
                        </div>
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload" className="h-full m-0 p-6 flex flex-col justify-center items-center">
                {isUploading ? (
                  <div className="w-full max-w-sm space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 animate-bounce" />
                      </div>
                      <h3 className="font-bold text-slate-900">Uploading File...</h3>
                      <p className="text-sm text-slate-500 mt-1">Please wait while we process your media.</p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-semibold">
                         <span className="text-slate-600">Progress</span>
                         <span className="text-primary">{uploadProgress}%</span>
                       </div>
                       <Progress value={uploadProgress} className="h-2 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <div className="relative group w-full max-w-md">
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*,video/*"
                    />
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl group-hover:border-primary/50 group-hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center p-12 bg-white shadow-sm">
                       <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-400 mb-4 shadow-sm border border-slate-100 group-hover:border-primary">
                          <Upload className="w-8 h-8" />
                       </div>
                       <p className="font-bold text-slate-900 text-lg">Click or drag file to upload</p>
                       <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                         Supports Images and Videos up to 10MB
                       </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="url" className="h-full m-0 p-6 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto space-y-4">
                   <div className="text-center mb-6">
                     <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <LinkIcon className="w-8 h-8" />
                     </div>
                     <h3 className="font-bold text-slate-900 text-lg">External Media URL</h3>
                     <p className="text-sm text-slate-500 mt-1">Insert an image directly from another website.</p>
                   </div>
                   <Input
                     placeholder="https://example.com/image.jpg"
                     value={manualUrl}
                     onChange={(e) => setManualUrl(e.target.value)}
                     className="h-12 shadow-sm border-slate-300"
                   />
                   <Button 
                     className="w-full h-12 font-bold shadow-sm"
                     onClick={handleManualUrl}
                     disabled={!manualUrl.trim()}
                   >
                     Apply URL
                   </Button>
                </div>
              </TabsContent>
              
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
