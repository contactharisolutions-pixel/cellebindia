import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchArticleById, createArticle, updateArticle, fetchCategories } from "@/lib/api-client";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Article, CategoryItem } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Globe, FileText, Settings as SettingsIcon, Search, CheckCircle2, AlertTriangle, XCircle, Sparkles, Wand2 } from "lucide-react";
import { calculateSEOScore } from "@/lib/seo-utils";
import { generateAIContent } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { MediaSelectDialog } from "@/components/MediaSelectDialog";

const STATUSES = ["Draft", "In Review", "Approved", "Scheduled", "Published", "Archived"];

export default function AdminEdit() {
  const [tagInput, setTagInput] = useState("");
  const { data: dbCategories } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categories = dbCategories?.map(c => c.name).filter(name => name.toLowerCase() !== "latest") || [
    "Bollywood",
    "PAN India",
    "Movie Review",
    "Streaming",
    "TV Serial",
    "Hollywood",
    "Box Office",
    "Trailer Review",
  ];

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Article>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "Bollywood",
    author: "Team CELLEB",
    featured: false,
    status: "Draft",
    mediaBlocks: [],
    relatedArticles: [],
    tags: [],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    }
  });

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticleById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        ...article,
        seo: article.seo || { metaTitle: "", metaDescription: "", keywords: [] }
      });
    }
  }, [article]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Article>) => {
      if (isEditing) {
        return updateArticle(id!, data);
      } else {
        return createArticle(data as any);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(isEditing ? "Article updated successfully" : "Article created successfully");
      navigate("/admin/posts");
    },
    onError: () => {
      toast.error("An error occurred while saving the article");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (field: keyof Article, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Auto-generate slug from title if not editing
      if (field === "title" && !isEditing) {
        const oldExpectedSlug = (prev.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (!prev.slug || prev.slug === oldExpectedSlug) {
          newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
      }
      return newData;
    });
  };

  const handleSEOChange = (field: keyof NonNullable<Article["seo"]>, value: any) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async (type: "complete" | "excerpt" | "tags" | "seo", prompt?: string) => {
    setIsGenerating(true);
    try {
      const result = await generateAIContent({ 
        prompt: prompt || formData.title, 
        type 
      });

      if (type === "complete") {
        setFormData(prev => ({
          ...prev,
          title: result.title,
          excerpt: result.excerpt,
          content: result.content,
          tags: result.tags
        }));
        toast.success("Article content generated!");
      } else if (type === "excerpt") {
        handleChange("excerpt", result.excerpt);
        toast.success("Excerpt summarized!");
      } else if (type === "tags") {
        const mergedTags = Array.from(new Set([...(formData.tags || []), ...result.tags]));
        handleChange("tags", mergedTags);
        toast.success("Tags suggested and added!");
      } else if (type === "seo") {
        handleSEOChange("metaTitle", result.metaTitle);
        handleSEOChange("metaDescription", result.metaDescription);
        handleSEOChange("keywords", result.keywords);
        toast.success("SEO Health Score improved to 80-100%!");
      }
    } catch (err) {
      toast.error("AI generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-primary" />
        <span className="text-sm font-semibold">Loading article data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/admin/posts")} 
            className="hover:bg-slate-100 text-slate-500 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEditing ? "Edit Article" : "Create New Article"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Author and configure your article content.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/posts")}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg shadow-sm font-semibold"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm font-semibold gap-2"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? "Update Article" : "Publish Article"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="bg-slate-100/50 p-1.5 mb-8 rounded-xl flex max-w-xl border border-slate-200">
          <TabsTrigger value="content" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg font-semibold h-10 gap-2">
            <FileText className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg font-semibold h-10 gap-2">
            <Globe className="w-4 h-4" />
            SEO & Social
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg font-semibold h-10 gap-2">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="content" className="mt-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Article Title</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        const p = prompt("Enter a topic for the AI to write about:");
                        if (p) handleAIGenerate("complete", p);
                      }}
                      disabled={isGenerating}
                      className="h-7 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary gap-1.5 rounded-md px-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Write with AI
                    </Button>
                  </div>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => handleChange("title", e.target.value)} 
                    required 
                    placeholder="Enter an engaging title..."
                    className="border-slate-200 shadow-sm rounded-lg h-11 focus-visible:ring-primary/20 text-base font-medium"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="slug" className="text-sm font-semibold text-slate-700">URL Slug</Label>
                  <div className="flex shadow-sm rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <span className="inline-flex items-center px-4 bg-slate-50 text-slate-500 text-sm border-r border-slate-200">
                      cellebindia.com/article/
                    </span>
                    <Input 
                      id="slug" 
                      value={formData.slug} 
                      onChange={(e) => handleChange("slug", e.target.value)} 
                      required 
                      className="border-0 shadow-none focus-visible:ring-0 rounded-none h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <Label htmlFor="image" className="text-sm font-semibold text-slate-700">Featured Image URL</Label>
                    <span className="text-[11px] font-medium text-amber-600 mt-1">
                      * Recommended media size: 1200 x 675 pixels (16:9 aspect ratio) for best responsive display.
                    </span>
                  </div>
                  <MediaSelectDialog 
                    onSelect={(url) => handleChange("image", url)} 
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <Input 
                    id="image" 
                    value={formData.image} 
                    onChange={(e) => handleChange("image", e.target.value)} 
                    required 
                    placeholder="https://example.com/image.jpg"
                    className="border-slate-200 shadow-sm rounded-lg h-11 focus-visible:ring-primary/20 flex-1"
                  />
                  {formData.image && (
                    <div className="w-16 h-11 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0 shadow-sm">
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="excerpt" className="text-sm font-semibold text-slate-700">Excerpt / Summary</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleAIGenerate("excerpt")}
                    disabled={isGenerating || !formData.content}
                    className="h-7 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary gap-1.5 rounded-md px-2"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Auto-Summarize
                  </Button>
                </div>
                <Textarea 
                  id="excerpt" 
                  value={formData.excerpt} 
                  onChange={(e) => handleChange("excerpt", e.target.value)} 
                  required 
                  placeholder="A brief summary of the article..."
                  className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20 h-24 resize-y"
                />
              </div>

              <div className="space-y-2.5 flex flex-col h-full min-h-[400px]">
                <Label htmlFor="content" className="text-sm font-semibold text-slate-700">Article Body (HTML/Markdown)</Label>
                <Textarea 
                  id="content" 
                  value={formData.content} 
                  onChange={(e) => handleChange("content", e.target.value)} 
                  required 
                  placeholder="Start writing your article here..."
                  className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20 flex-1 min-h-[300px] font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: SEO Controls */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-6">
                    <Search className="w-5 h-5 text-blue-500" />
                    Google Search Preview
                  </h3>
                  <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
                    <div className="text-[20px] leading-tight text-[#1a0dab] hover:underline cursor-pointer truncate mb-1">
                      {formData.seo?.metaTitle || formData.title || "Meta Title Preview"}
                    </div>
                    <div className="text-[14px] text-[#006621] truncate mb-1">
                      https://celleb.com/article/{formData.slug || "slug-preview"}
                    </div>
                    <div className="text-[14px] text-[#4d5156] line-clamp-2 leading-snug">
                      {formData.seo?.metaDescription || formData.excerpt || "Meta description preview will appear here..."}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-700">Meta Information</h3>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAIGenerate("seo")}
                      disabled={isGenerating || !formData.title}
                      className="h-8 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary gap-1.5 rounded-md px-3 border border-primary/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Optimize Meta with AI
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="metaTitle" className="text-sm font-semibold text-slate-700">SEO Title Tag</Label>
                    <Input 
                      id="metaTitle" 
                      value={formData.seo?.metaTitle || ""} 
                      onChange={(e) => handleSEOChange("metaTitle", e.target.value)} 
                      placeholder={formData.title}
                      className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20"
                    />
                    <div className="flex justify-end pt-1">
                      <span className={cn("text-xs font-medium", formData.seo?.metaTitle?.length ? (formData.seo.metaTitle.length > 60 ? "text-red-500" : "text-emerald-500") : "text-slate-400")}>
                        {formData.seo?.metaTitle?.length || 0} / 60 Characters
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="metaDescription" className="text-sm font-semibold text-slate-700">Meta Description</Label>
                    <Textarea 
                      id="metaDescription" 
                      value={formData.seo?.metaDescription || ""} 
                      onChange={(e) => handleSEOChange("metaDescription", e.target.value)} 
                      placeholder={formData.excerpt}
                      className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20 h-24"
                    />
                    <div className="flex justify-end pt-1">
                      <span className={cn("text-xs font-medium", formData.seo?.metaDescription?.length ? (formData.seo.metaDescription.length > 160 ? "text-red-500" : "text-emerald-500") : "text-slate-400")}>
                        {formData.seo?.metaDescription?.length || 0} / 160 Characters
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="keywords" className="text-sm font-semibold text-slate-700">Focus Keywords (comma separated)</Label>
                    <Input 
                      id="keywords" 
                      value={formData.seo?.keywords?.join(", ") || ""} 
                      onChange={(e) => handleSEOChange("keywords", e.target.value.split(",").map(k => k.trim()))} 
                      placeholder="star, entertainment, bollywood"
                      className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="ogImage" className="text-sm font-semibold text-slate-700">Social (OG) Image URL</Label>
                      <MediaSelectDialog 
                        onSelect={(url) => handleSEOChange("ogImage", url)} 
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Input 
                          id="ogImage" 
                          value={formData.seo?.ogImage || ""} 
                          onChange={(e) => handleSEOChange("ogImage", e.target.value)} 
                          placeholder={formData.image}
                          className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20"
                        />
                      </div>
                      <div className="w-full sm:w-32 h-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {formData.seo?.ogImage || formData.image ? (
                          <img src={formData.seo?.ogImage || formData.image} className="w-full h-full object-cover" />
                        ) : (
                          <Globe className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: SEO Score */}
              <div className="col-span-1 lg:col-span-1 space-y-6">
                {(() => {
                  const seo = calculateSEOScore(formData as any);
                  return (
                    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm lg:sticky lg:top-24">
                      <div className="text-center mb-8">
                        <h4 className="text-sm font-semibold text-slate-700 mb-6">SEO Health Score</h4>
                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-32 h-32 transform -rotate-90 text-slate-100">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray={351.8}
                              strokeDashoffset={351.8 - (351.8 * seo.score) / 100}
                              className={
                                seo.score >= 80 ? "text-emerald-500" :
                                seo.score >= 50 ? "text-amber-500" :
                                "text-red-500"
                              }
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-slate-900 leading-none">{seo.score}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">/ 100</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-semibold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">Optimization Checklist</h5>
                        <div className="space-y-3">
                          {seo.suggestions.map((suggestion, i) => (
                            <div key={i} className="flex gap-2.5 items-start">
                              {suggestion.type === "good" && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
                              {suggestion.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
                              {suggestion.type === "error" && <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                              <span className="text-sm text-slate-700 leading-tight">{suggestion.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      <Label htmlFor="status" className="text-sm font-semibold text-slate-700">Publishing Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(val) => handleChange("status", val)}
                      >
                        <SelectTrigger className="border-slate-200 shadow-sm rounded-lg font-medium">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          {STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.status === "Scheduled" && (
                      <div className="space-y-2.5 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-in slide-in-from-top-2">
                        <Label htmlFor="scheduledDate" className="text-sm font-semibold text-slate-700">Scheduled Date & Time (IST)</Label>
                        <Input 
                          id="scheduledDate" 
                          type="datetime-local" 
                          value={formData.scheduledDate || ""} 
                          onChange={(e) => handleChange("scheduledDate", e.target.value)} 
                          className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20 bg-white"
                          required={formData.status === "Scheduled"}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Primary Categories</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal border-slate-200 shadow-sm rounded-lg h-10 px-3">
                          <span className="truncate">
                            {formData.category || "Select Categories..."}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[240px] rounded-lg">
                        {categories.map(cat => {
                          const currentCats = formData.category ? formData.category.split(',').map(c => c.trim()).filter(Boolean) : [];
                          const isChecked = currentCats.includes(cat);
                          return (
                            <DropdownMenuCheckboxItem
                              key={cat}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                let newCats = [...currentCats];
                                if (checked) {
                                  newCats.push(cat);
                                } else {
                                  newCats = newCats.filter(c => c !== cat);
                                }
                                handleChange("category", newCats.join(', '));
                              }}
                            >
                              {cat}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2.5">
                    <Label htmlFor="author" className="text-sm font-semibold text-slate-700">Article Author</Label>
                    <Input 
                      id="author" 
                      value={formData.author} 
                      onChange={(e) => handleChange("author", e.target.value)} 
                      className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="tags" className="text-sm font-semibold text-slate-700">Tags</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAIGenerate("tags")}
                        disabled={isGenerating || !formData.title}
                        className="h-7 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary gap-1.5 rounded-md px-2"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        Suggest Tags
                      </Button>
                    </div>
                    <Input 
                      id="tags" 
                      placeholder="Add tag and press Enter" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          const val = tagInput.trim().replace(/,$/, "");
                          if (val) {
                            const currentTags = formData.tags || [];
                            if (!currentTags.includes(val)) {
                              handleChange("tags", [...currentTags, val]);
                            }
                            setTagInput("");
                          }
                        }
                      }}
                      className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20"
                    />
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {formData.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-md border border-primary/10 flex items-center gap-1.5 shadow-sm">
                            {tag}
                            <button 
                              type="button"
                              onClick={() => handleChange("tags", formData.tags?.filter(t => t !== tag))}
                              className="text-primary/40 hover:text-red-500 focus:outline-none transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Add Suggestions */}
                    <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Quick Add</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Bollywood", "Trending", "Box Office", "Exclusive", "Review", "Hollywood", "Streaming", "Viral"].map(suggestion => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              const currentTags = formData.tags || [];
                              if (!currentTags.includes(suggestion)) {
                                handleChange("tags", [...currentTags, suggestion]);
                              }
                            }}
                            className={cn(
                              "px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all",
                              formData.tags?.includes(suggestion)
                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5"
                            )}
                            disabled={formData.tags?.includes(suggestion)}
                          >
                            + {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured" className="font-semibold text-slate-800 cursor-pointer">Featured on Homepage (Top Stories)</Label>
                        <Switch 
                          id="featured" 
                          checked={formData.featured} 
                          onCheckedChange={(val) => handleChange("featured", val)}
                        />
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">Enable this option to pin the article to the top stories section on the main feed.</p>
                    </div>

                    <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-xl space-y-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="whatsHotOrder" className="font-semibold text-slate-800">What's Hot Order (1-5)</Label>
                        <Input 
                          id="whatsHotOrder" 
                          type="number"
                          min="0"
                          max="5"
                          placeholder="0 to disable"
                          value={formData.seo?.whatsHotOrder || ""} 
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value) : undefined;
                            handleChange("seo", { ...formData.seo, whatsHotOrder: val });
                          }}
                          className="border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20 bg-white"
                        />
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">Assign an order (1-5) to feature this article in the What's Hot sidebar. Leave blank or 0 to exclude.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
