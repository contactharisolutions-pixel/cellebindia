import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGalleries, createGallery, updateGallery } from "@/lib/api-client";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Gallery, GalleryImage } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { MediaSelectDialog } from "@/components/MediaSelectDialog";

export default function AdminGalleryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Gallery>>({
    title: "",
    description: "",
    images: [],
    active: true,
  });

  const { data: galleries } = useQuery({
    queryKey: ["galleries"],
    queryFn: fetchGalleries,
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && galleries) {
      const gallery = galleries.find((g) => g.id === id);
      if (gallery) {
        setFormData(gallery);
      }
    }
  }, [isEditing, id, galleries]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Gallery>) => {
      if (isEditing) {
        return updateGallery(id!, data);
      } else {
        return createGallery(data as Omit<Gallery, "id" | "createdAt">);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      toast.success(isEditing ? "Gallery updated" : "Gallery created");
      navigate("/admin/galleries");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save gallery");
    },
  });

  const handleChange = (field: keyof Gallery, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addImage = (url: string) => {
    const newImage: GalleryImage = { url, caption: "" };
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImage],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleImageCaptionChange = (index: number, caption: string) => {
    setFormData((prev) => {
      const newImages = [...(prev.images || [])];
      newImages[index] = { ...newImages[index], caption };
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/admin/galleries")}
            className="rounded-full h-10 w-10 border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEditing ? "Edit CELLEB CLICKS" : "Create New CELLEB CLICKS"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your CELLEB CLICKS gallery and visual content.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/galleries")}
            className="rounded-lg shadow-sm font-semibold"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="rounded-lg shadow-sm font-semibold gap-2"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? "Update Gallery" : "Save Gallery"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2.5">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Gallery Title</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => handleChange("title", e.target.value)} 
              placeholder="e.g., Red Carpet Moments 2024"
              className="border-slate-200 shadow-sm rounded-lg h-11 focus-visible:ring-primary/20 text-base"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange("description", e.target.value)} 
              placeholder="Describe the collection of images..."
              className="border-slate-200 shadow-sm rounded-lg min-h-[100px] focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-slate-900">Active Status</Label>
              <p className="text-xs text-slate-500">Enable or disable this gallery on the homepage.</p>
            </div>
            <Switch 
              checked={formData.active} 
              onCheckedChange={(checked) => handleChange("active", checked)} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-slate-900">Gallery Images</h2>
            </div>
            <MediaSelectDialog onSelect={addImage} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.images?.map((image, index) => (
              <div key={index} className="group relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={`Image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <Input 
                    value={image.caption} 
                    onChange={(e) => handleImageCaptionChange(index, e.target.value)} 
                    placeholder="Enter caption..."
                    className="h-9 text-sm border-slate-200 bg-white"
                  />
                </div>
              </div>
            ))}
            
            <button 
              type="button"
              onClick={() => {
                const url = prompt("Enter image URL:");
                if (url) addImage(url);
              }}
              className="aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add via URL</span>
            </button>
          </div>
          
          {formData.images?.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No images added yet.</p>
              <p className="text-sm text-slate-400 mt-1">Use the "Add via URL" or the media selector above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
