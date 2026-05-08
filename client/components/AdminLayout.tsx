import {
  BarChart3,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Tags,
  Users,
  LayoutDashboard,
  Bell,
  Coins,
  Globe,
  Lock,
  ChevronRight,
  LogOut,
  Layout,
  Menu,
  Search,
  Shield,
  Video,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Articles",
        icon: FileText,
        href: "/admin/posts",
        subItems: [
          { title: "All Articles", href: "/admin/posts" },
          { title: "Drafts", href: "/admin/posts/drafts" },
          { title: "Scheduled", href: "/admin/posts/scheduled" },
        ],
      },
      { title: "Categories", icon: Layout, href: "/admin/categories" },
      { title: "Tags", icon: Tags, href: "/admin/tags" },
      { title: "CELLEB CLICKS", icon: ImageIcon, href: "/admin/galleries" },
      { title: "Video Gallery", icon: Video, href: "/admin/video-gallery" },
      { title: "Media Library", icon: ImageIcon, href: "/admin/media" },
      { title: "Comments", icon: MessageSquare, href: "/admin/comments" },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Users", icon: Users, href: "/admin/users" },
      { title: "Analytics", icon: BarChart3, href: "/admin/analytics" },
      { title: "AdSense", icon: Coins, href: "/admin/monetization" },
      { title: "Notifications", icon: Bell, href: "/admin/notifications" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Integrations", icon: Globe, href: "/admin/integrations" },
      { title: "Security", icon: Shield, href: "/admin/security" },
      { title: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
];

// Flat list for breadcrumb lookup
const flatNav = navGroups.flatMap((g) => g.items);

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/admin/login");
  };

  const currentPage =
    flatNav.find((n) => {
      if (n.href === "/admin") return location.pathname === "/admin";
      return location.pathname.startsWith(n.href);
    })?.title ?? "Overview";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "flex flex-col bg-white border-r border-slate-200 transition-all duration-300 shrink-0",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm tracking-tight">C</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm leading-none tracking-tight">CELLEB</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Admin Portal</p>
          </div>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-2">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isRootDashboard = item.href === "/admin";
                  const isActive = isRootDashboard
                    ? location.pathname === "/admin"
                    : location.pathname.startsWith(item.href);
                  const hasSubItems = "subItems" in item && (item as any).subItems;
                  const isExpanded = expandedItem === item.href || isActive;

                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() =>
                          hasSubItems
                            ? setExpandedItem(isExpanded ? null : item.href)
                            : undefined
                        }
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                          isActive
                            ? "bg-primary text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                          )}
                        />
                        <span className="flex-1 truncate">{item.title}</span>
                        {hasSubItems && (
                          <ChevronRight
                            className={cn(
                              "w-3.5 h-3.5 transition-transform",
                              isExpanded ? "rotate-90" : "",
                              isActive ? "text-white/70" : "text-slate-400"
                            )}
                          />
                        )}
                      </Link>
                      {/* Sub items */}
                      {hasSubItems && isExpanded && (
                        <ul className="mt-1 ml-7 space-y-0.5 border-l border-slate-200 pl-3">
                          {(item as any).subItems.map((sub: any) => {
                            const subActive = location.pathname === sub.href;
                            return (
                              <li key={sub.href}>
                                <Link
                                  to={sub.href}
                                  className={cn(
                                    "flex items-center py-2 px-2 rounded text-xs font-medium transition-colors",
                                    subActive
                                      ? "text-primary font-semibold"
                                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                  )}
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">VA</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate leading-none">Vinay Admin</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Column ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 font-medium">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-800 font-semibold">{currentPage}</span>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Live</span>
            </div>

            {/* Notifications bell */}
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full border-2 border-white" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">VA</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
