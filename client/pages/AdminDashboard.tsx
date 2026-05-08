import { useQuery } from "@tanstack/react-query";
import { fetchArticles, fetchAuditLogs, fetchAnalytics } from "@/lib/api-client";
import { cn, formatTime } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  History,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];

const StatCard = ({
  label,
  value,
  icon: Icon,
  change,
  up,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  icon: any;
  change: string;
  up: boolean;
  color: string;
  bg: string;
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
    <div className="flex items-start justify-between mb-4">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", bg)}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
          up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
        )}
      >
        {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3">
        <p className="text-xs font-semibold text-slate-500 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color || p.payload.fill || COLORS[i % COLORS.length] }}
            />
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { data: articlesData } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticles(),
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["audit_logs"],
    queryFn: fetchAuditLogs,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
    refetchInterval: 10000,
  });

  const articles = articlesData?.articles || [];

  const stats = [
    { label: "Total Articles", value: articles.length || 0, icon: FileText, change: "+12.4%", up: true, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Views", value: analytics?.kpis?.totalViews?.toLocaleString() || "0", icon: Eye, change: "+24.1%", up: true, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Active Now", value: analytics?.kpis?.activeNow || "0", icon: Users, change: "Live", up: true, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Avg. Time on Site", value: analytics?.kpis?.avgSession || "0m 0s", icon: Clock, change: "+1.8%", up: true, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const systemStatus = [
    { label: "Database", status: "ok", val: "Online" },
    { label: "Media Storage", status: "ok", val: "Healthy" },
    { label: "Security Layer", status: "ok", val: "Protected" },
    { label: "CDN Server", status: "warning", val: "Syncing" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back. Here's what's happening right now.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-sm font-semibold text-emerald-700 tracking-wide">Website is Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart — Traffic Analytics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-900">Traffic Analytics</h4>
              <p className="text-sm text-slate-500 mt-0.5">Page views & engagement</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <span className="w-3 h-0.5 bg-primary inline-block rounded-full" /> Views
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <span className="w-3 h-0.5 bg-slate-300 inline-block rounded-full" /> Engagement
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full flex-1">
            {analyticsLoading ? (
               <div className="w-full h-full flex items-center justify-center">
                 <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
               </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.charts?.monthlyViews || []}>
                  <defs>
                    <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" name="Views" dataKey="views" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#gViews)" />
                  <Area type="monotone" name="Engagement" dataKey="engagement" stroke="#cbd5e1" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category-wise Analytics Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="mb-2">
            <h4 className="text-base font-bold text-slate-900">Category Analytics</h4>
            <p className="text-sm text-slate-500 mt-0.5">Content distribution share</p>
          </div>
          <div className="h-[220px] w-full flex-1">
            {analyticsLoading ? (
               <div className="w-full h-full flex items-center justify-center">
                 <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
               </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.charts?.categoryStats || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics?.charts?.categoryStats?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {analytics?.charts?.categoryStats?.slice(0, 4).map((cat: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                <History className="w-4 h-4 text-slate-600" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Activity Log</h4>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              Live Feed
            </span>
          </div>

          <div className="space-y-2">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.slice(0, 5).map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary animate-pulse rounded-full shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{log.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {log.category} • {log.target_id || "System"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold shrink-0">
                    {formatTime(log.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400">
                <History className="w-6 h-6 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-slate-600" />
            </div>
            <h4 className="text-base font-bold text-slate-900">System Status</h4>
          </div>

          <div className="space-y-3">
            {systemStatus.map((sys, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {sys.status === "ok" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="text-sm font-semibold text-slate-700">{sys.label}</span>
                </div>
                <span
                  className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-full",
                    sys.status === "ok"
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                      : "text-amber-700 bg-amber-50 border border-amber-100"
                  )}
                >
                  {sys.val}
                </span>
              </div>
            ))}
          </div>

          {/* Quick stat */}
          <div className="mt-6 p-5 bg-slate-900 rounded-xl relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute -right-4 -top-8 w-24 h-24 bg-primary rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Server Uptime</p>
            <p className="text-3xl font-bold text-white tracking-tight">99.9%</p>
            <p className="text-xs text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
               <CheckCircle2 className="w-3 h-3" />
               Operational System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
