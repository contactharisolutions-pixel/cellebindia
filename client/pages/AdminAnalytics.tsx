import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/lib/api-client";
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Activity,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useState, useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function AdminAnalytics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
    refetchInterval: 5000, 
    retry: 3
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 animate-pulse">Initializing Platform Insights...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
          <Activity className="w-8 h-8" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">Analytics Offline</h3>
          <p className="text-sm text-slate-500 max-w-xs mt-1">We're having trouble connecting to the analytics engine. Check your connection or try again.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all"
        >
          Re-establish Connection
        </button>
      </div>
    );
  }

  const { kpis = {}, charts = {}, topArticles = [] } = data;
  const { monthlyViews = [], dailyViews = [], categoryStats = [] } = charts;

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTopArticles = useMemo(() => {
    let items = [...(topArticles || [])];
    if (sortConfig !== null) {
      items.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [topArticles, sortConfig]);

  const COLORS = ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time performance monitoring and engagement tracking.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Eye className="w-5 h-5" />} 
          label="Total Views" 
          value={formatNumber(kpis?.totalViews || 0)} 
          trend="+12.5%" 
          trendDir="up" 
        />
        <StatCard 
          icon={<Users className="w-5 h-5" />} 
          label="Active Now" 
          value={kpis?.activeNow || 0} 
          trend="Real-time" 
          trendDir="neutral" 
          highlight
        />
        <StatCard 
          icon={<Clock className="w-5 h-5" />} 
          label="Avg. Session" 
          value={kpis?.avgSession || "0m"} 
          trend="-2.1%" 
          trendDir="down" 
        />
        <StatCard 
          icon={<Activity className="w-5 h-5" />} 
          label="Bounce Rate" 
          value={kpis?.bounceRate || "0%"} 
          trend="+0.3%" 
          trendDir="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Traffic Distribution</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                <span className="text-xs font-semibold text-slate-500">Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span>
                <span className="text-xs font-semibold text-slate-500">Engagement</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyViews}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
                />
                <Tooltip 
                  contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#1e293b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Content Split</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryStats.map((cat: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="text-xs font-semibold text-slate-600">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Articles Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Performing Articles</h3>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th 
                  className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("title")}
                >
                  <div className="flex items-center gap-1.5">
                    Article Title
                    {sortConfig?.key === "title" ? (
                      sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("views")}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Engagement
                    {sortConfig?.key === "views" ? (
                      sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTopArticles.map((article: any) => (
                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors cursor-pointer">{article.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">ID: {article.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-slate-900">{formatNumber(article.views)}</span>
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {article.engagement}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Real-time Velocity */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Engagement Velocity</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="views" fill="#1e293b" radius={[4, 4, 0, 0]}>
                  {dailyViews.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#1e293b' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            Daily throughput comparison (Last 7 Days)
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, trendDir, highlight = false }: any) {
  return (
    <div className={`p-6 border border-slate-200 rounded-xl shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${highlight ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600'}`}>
      <div className={`mb-4 flex items-center justify-center w-10 h-10 rounded-lg ${highlight ? 'bg-white/20 text-white' : 'bg-slate-50 text-primary border border-slate-100'}`}>
        {icon}
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-white/70' : 'text-slate-400'}`}>{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      </div>
      <div className={`mt-4 flex items-center gap-1.5 text-xs font-bold ${
        trendDir === 'up' ? 'text-emerald-500' : 
        trendDir === 'down' ? 'text-rose-500' : 
        highlight ? 'text-white' : 'text-slate-400'
      }`}>
        {trendDir === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
        {trendDir === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
        {trend}
      </div>
    </div>
  );
}
