import { Article, ArticlesResponse, Gallery, VideoGallery } from "@shared/api";

const API_BASE = "/api";

export async function fetchArticles(params: { 
  category?: string; 
  featured?: boolean; 
  whatsHot?: boolean;
  limit?: number; 
  status?: string;
  admin?: boolean;
} = {}): Promise<ArticlesResponse> {
  const query = new URLSearchParams();
  if (params.category) query.append("category", params.category);
  if (params.featured) query.append("featured", "true");
  if (params.whatsHot) query.append("whatsHot", "true");
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.status) query.append("status", params.status);
  if (params.admin) query.append("admin", "true");

  const response = await fetch(`${API_BASE}/articles?${query.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch articles");
  return response.json();
}

export async function fetchArticleById(id: string): Promise<Article> {
  const response = await fetch(`${API_BASE}/articles/${id}`);
  if (!response.ok) throw new Error("Failed to fetch article");
  return response.json();
}

export async function createArticle(article: Omit<Article, "id" | "date">): Promise<Article> {
  const response = await fetch(`${API_BASE}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  });
  if (!response.ok) throw new Error("Failed to create article");
  return response.json();
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<Article> {
  const response = await fetch(`${API_BASE}/articles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  });
  if (!response.ok) throw new Error("Failed to update article");
  return response.json();
}

export async function deleteArticle(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/articles/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete article");
}

// Media API
export async function fetchMedia(): Promise<{ media: any[] }> {
  const response = await fetch(`${API_BASE}/media`);
  if (!response.ok) throw new Error("Failed to fetch media");
  return response.json();
}

export async function uploadMedia(formData: FormData): Promise<any> {
  const response = await fetch(`${API_BASE}/media`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload media");
  return response.json();
}

export async function deleteMedia(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/media/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete media");
}

// Analytics API
export async function fetchAnalytics(): Promise<any> {
  const response = await fetch(`${API_BASE}/analytics`);
  if (!response.ok) throw new Error("Failed to fetch analytics");
  return response.json();
}

// AI API
export async function generateAIContent(data: { prompt: string; type: string }): Promise<any> {
  const response = await fetch(`${API_BASE}/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to generate AI content");
  return response.json();
}

// Monetization API
export async function fetchAds(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/ads`);
  if (!response.ok) throw new Error("Failed to fetch ads");
  return response.json();
}

export async function updateAdStatus(id: number, status: string): Promise<void> {
  const response = await fetch(`${API_BASE}/ads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update ad status");
}

export async function fetchMonetizationStats(): Promise<any> {
  const response = await fetch(`${API_BASE}/monetization/stats`);
  if (!response.ok) throw new Error("Failed to fetch monetization stats");
  return response.json();
}

// Categories API
export async function fetchCategories(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function createCategory(data: { name: string; description?: string }): Promise<any> {
  const response = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
}

export async function updateCategory(id: string | number, data: { name: string; description?: string }): Promise<any> {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
}

export async function deleteCategory(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete category");
}

// Tags API
export async function fetchTags(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/tags`);
  if (!response.ok) throw new Error("Failed to fetch tags");
  return response.json();
}

export async function createTag(data: { name: string }): Promise<any> {
  const response = await fetch(`${API_BASE}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create tag");
  return response.json();
}

export async function updateTag(id: string | number, data: { name: string }): Promise<any> {
  const response = await fetch(`${API_BASE}/tags/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update tag");
  return response.json();
}

export async function deleteTag(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE}/tags/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete tag");
}

// Comments API
export async function fetchComments(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/comments`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
}

export async function updateCommentStatus(id: string | number, status: string): Promise<any> {
  const response = await fetch(`${API_BASE}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update comment status");
  return response.json();
}

export async function deleteComment(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE}/comments/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete comment");
}

// Users API
export async function fetchUsers(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

export async function createUser(data: { name: string; email: string; role: string }): Promise<any> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
}

export async function updateUser(id: string | number, data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update user");
  return response.json();
}

export async function deleteUser(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete user");
}

// Notifications API
export async function fetchNotifications(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/notifications`);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

export async function markNotificationAsRead(id: string | number): Promise<any> {
  const response = await fetch(`${API_BASE}/notifications/${id}`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to mark notification as read");
  return response.json();
}

export async function deleteNotification(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE}/notifications/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete notification");
}

export async function createNotification(data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create notification");
  return response.json();
}

// Integrations API
export async function fetchIntegrations(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/integrations`);
  if (!response.ok) throw new Error("Failed to fetch integrations");
  return response.json();
}

export async function createIntegration(data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/integrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create integration");
  return response.json();
}

export async function updateIntegration(id: string | number, data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/integrations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update integration");
  return response.json();
}

export async function deleteIntegration(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE}/integrations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete integration");
}

// Security API
export async function fetchAuditLogs(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/security/audit-logs`);
  if (!response.ok) throw new Error("Failed to fetch audit logs");
  return response.json();
}
// Gallery API
export async function fetchGalleries(): Promise<Gallery[]> {
  const response = await fetch(`${API_BASE}/galleries`);
  if (!response.ok) throw new Error("Failed to fetch galleries");
  return response.json();
}

export async function createGallery(gallery: Omit<Gallery, "id" | "createdAt">): Promise<{ success: boolean; gallery: Gallery }> {
  const response = await fetch(`${API_BASE}/galleries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gallery),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create gallery");
  }
  return response.json();
}

export async function updateGallery(id: string, gallery: Partial<Gallery>): Promise<{ success: boolean; gallery: Gallery }> {
  const response = await fetch(`${API_BASE}/galleries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gallery),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update gallery");
  }
  return response.json();
}

export async function deleteGallery(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/galleries/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete gallery");
  return response.json();
}

// Video Gallery API
export async function fetchVideoGallery(): Promise<VideoGallery> {
  const response = await fetch(`${API_BASE}/video-gallery`);
  if (!response.ok) throw new Error("Failed to fetch video gallery");
  return response.json();
}

export async function updateVideoGallery(gallery: VideoGallery): Promise<{ success: boolean; gallery: VideoGallery }> {
  const response = await fetch(`${API_BASE}/video-gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gallery),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to save video gallery");
  }
  return response.json();
}
