import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVideoGallery, updateVideoGallery } from "@/lib/api-client";
import { useState, useEffect } from "react";
import { VideoGallery, VideoItem } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2, Video, GripVertical, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaSelectDialog } from "@/components/MediaSelectDialog";

export default function AdminVideoGallery() {
  const queryClient = useQueryClient();
  const { data: gallery, isLoading } = useQuery({
    queryKey: ["video-gallery"],
    queryFn: fetchVideoGallery,
  });

  const [formData, setFormData] = useState<VideoGallery>({
    id: "default",
    title: "Video Gallery",
    videos: [],
  });

  useEffect(() => {
    if (gallery) {
      setFormData(gallery);
    }
  }, [gallery]);

  const mutation = useMutation({
    mutationFn: updateVideoGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-gallery"] });
      toast.success("Video gallery updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update video gallery");
    },
  });

  const addVideo = () => {
    const newVideo: VideoItem = {
      id: `video-${Date.now()}`,
      title: "",
      videoUrl: "",
      thumbnailUrl: "",
      updatedAt: new Date().toISOString(),
    };
    setFormData((prev) => ({
      ...prev,
      videos: [newVideo, ...prev.videos], // New videos at the top
    }));
  };

  const removeVideo = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v.id !== id),
    }));
  };

  const updateVideo = (id: string, field: keyof VideoItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.map((v) => 
        v.id === id ? { ...v, [field]: value, updatedAt: new Date().toISOString() } : v
      ),
    }));
  };

  const handleSave = () => {
    if (!formData.title) {
      toast.error("Gallery title is required");
      return;
    }
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Gallery</h1>
          <p className="text-slate-500 mt-1">Manage videos displayed on the homepage.</p>
        </div>
        <Button onClick={handleSave} disabled={mutation.isPending} className="gap-2">
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="galleryTitle">Gallery Heading</Label>
            <Input 
              id="galleryTitle"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Latest Videos"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Videos ({formData.videos.length})
          </h2>
          <Button onClick={addVideo} variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Video
          </Button>
        </div>

        <div className="space-y-4">
          {formData.videos.map((video, index) => (
            <Card key={video.id} className="relative group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4 sm:gap-6">
                  <div className="hidden sm:flex items-center text-slate-300">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Video Title</Label>
                        <Input 
                          value={video.title}
                          onChange={(e) => updateVideo(video.id, "title", e.target.value)}
                          placeholder="Video title"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Video URL (YouTube/Direct)</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={video.videoUrl}
                            onChange={(e) => updateVideo(video.id, "videoUrl", e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                          <MediaSelectDialog 
                            onSelect={(url) => updateVideo(video.id, "videoUrl", url)}
                            trigger={
                              <Button variant="outline" size="icon" title="Select from Media Library">
                                <LinkIcon className="w-4 h-4" />
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Custom Thumbnail URL (Optional)</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={video.thumbnailUrl}
                            onChange={(e) => updateVideo(video.id, "thumbnailUrl", e.target.value)}
                            placeholder="https://..."
                          />
                          <MediaSelectDialog 
                            onSelect={(url) => updateVideo(video.id, "thumbnailUrl", url)}
                            trigger={
                              <Button variant="outline" size="icon" title="Select from Media Library">
                                <ImageIcon className="w-4 h-4" />
                              </Button>
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 md:pt-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeVideo(video.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Video
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {formData.videos.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No videos in the gallery.</p>
              <Button onClick={addVideo} variant="link" className="mt-2">
                Add your first video
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
