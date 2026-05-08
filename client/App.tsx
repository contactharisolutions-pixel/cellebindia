import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "./lib/api-client";
import { lazy, Suspense } from "react";
import Header from "./components/Header";
import Index from "./pages/Index";

// Lazy load pages for better performance and smaller initial bundle
const Article = lazy(() => import("./pages/Article"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Advertise = lazy(() => import("./pages/Advertise"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));
const WhatsHot = lazy(() => import("./pages/WhatsHot"));
const Latest = lazy(() => import("./pages/Latest"));

// Dynamic Categories
const BoxOffice = lazy(() => import("./pages/BoxOffice"));
const BollywoodCategory = lazy(() => import("./pages/BollywoodCategory"));
const PanIndia = lazy(() => import("./pages/PanIndia"));
const TrailerReview = lazy(() => import("./pages/TrailerReview"));
const MovieReview = lazy(() => import("./pages/MovieReview"));
const Hollywood = lazy(() => import("./pages/Hollywood"));
const Streaming = lazy(() => import("./pages/Streaming"));
const TVSerial = lazy(() => import("./pages/TVSerial"));

// Admin Pages
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminEdit = lazy(() => import("./pages/AdminEdit"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminTags = lazy(() => import("./pages/AdminTags"));
const AdminComments = lazy(() => import("./pages/AdminComments"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminMonetization = lazy(() => import("./pages/AdminMonetization"));
const AdminSecurity = lazy(() => import("./pages/AdminSecurity"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminNotifications = lazy(() => import("./pages/AdminNotifications"));
const AdminIntegrations = lazy(() => import("./pages/AdminIntegrations"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminGalleries = lazy(() => import("./pages/AdminGalleries"));
const AdminGalleryEdit = lazy(() => import("./pages/AdminGalleryEdit"));
const AdminVideoGallery = lazy(() => import("./pages/AdminVideoGallery"));

const NotFound = lazy(() => import("./pages/NotFound"));
import { AdminLayout } from "./components/AdminLayout";
import { CookieConsent } from "./components/CookieConsent";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("admin_auth") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

function CategoryPageWrapper() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const category = categories?.find(c => c.slug === slug);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-light-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-gray-500">Category not found</p>
        </div>
      </div>
    );
  }

  return <CategoryPage category={category.name} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen bg-light-50 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-black border-t-primary rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/advertise" element={<Advertise />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookies-policy" element={<CookiesPolicy />} />
              <Route path="/category/:slug" element={<CategoryPageWrapper />} />
              <Route path="/whats-hot" element={<WhatsHot />} />
              <Route path="/latest" element={<Latest />} />
              
              {/* Legacy static routes - keeping for compatibility */}
              <Route path="/box-office" element={<BoxOffice />} />
              <Route path="/bollywood" element={<BollywoodCategory />} />
              <Route path="/pan-india" element={<PanIndia />} />
              <Route path="/trailer" element={<TrailerReview />} />
              <Route path="/movie-review" element={<MovieReview />} />
              <Route path="/hollywood" element={<Hollywood />} />
              <Route path="/streaming" element={<Streaming />} />
              <Route path="/tv-serial" element={<TVSerial />} />
              
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/posts" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/posts/drafts" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/posts/scheduled" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/new" element={<AdminRoute><AdminEdit /></AdminRoute>} />
              <Route path="/admin/edit/:id" element={<AdminRoute><AdminEdit /></AdminRoute>} />
              
              {/* Placeholder Admin Routes */}
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/tags" element={<AdminRoute><AdminTags /></AdminRoute>} />
              <Route path="/admin/media" element={<AdminRoute><AdminMedia /></AdminRoute>} />
              <Route path="/admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
              <Route path="/admin/monetization" element={<AdminRoute><AdminMonetization /></AdminRoute>} />
              <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
              <Route path="/admin/integrations" element={<AdminRoute><AdminIntegrations /></AdminRoute>} />
              <Route path="/admin/security" element={<AdminRoute><AdminSecurity /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              <Route path="/admin/galleries" element={<AdminRoute><AdminGalleries /></AdminRoute>} />
              <Route path="/admin/galleries/new" element={<AdminRoute><AdminGalleryEdit /></AdminRoute>} />
              <Route path="/admin/galleries/edit/:id" element={<AdminRoute><AdminGalleryEdit /></AdminRoute>} />
              <Route path="/admin/video-gallery" element={<AdminRoute><AdminVideoGallery /></AdminRoute>} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
