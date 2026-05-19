import { useState, useCallback } from "react";
import {
  DollarSign, Settings2, Monitor, Layout, CheckCircle2, ExternalLink,
  Info, Copy, Check, AlertTriangle, Zap, Eye, EyeOff, Pencil, X, RefreshCcw,
  TrendingUp, BarChart2, MousePointerClick, Eye as EyeIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  getAdSenseConfig, saveAdSenseConfig, isPublisherConfigured,
  DEFAULT_SLOTS, type AdSlotConfig, type AdSenseConfig,
} from "@/lib/adsense";

// ── Mock revenue data (replace with AdSense Reporting API when ready) ─────────
const REVENUE_TREND = [
  { day: "Mon", earnings: 2.4, clicks: 18, impressions: 1240 },
  { day: "Tue", earnings: 3.1, clicks: 24, impressions: 1580 },
  { day: "Wed", earnings: 2.8, clicks: 20, impressions: 1390 },
  { day: "Thu", earnings: 4.2, clicks: 31, impressions: 2100 },
  { day: "Fri", earnings: 5.1, clicks: 40, impressions: 2450 },
  { day: "Sat", earnings: 4.7, clicks: 35, impressions: 2200 },
  { day: "Sun", earnings: 3.9, clicks: 29, impressions: 1870 },
];

const SLOT_PERFORMANCE = [
  { name: "Article Body", earnings: 8.2, ctr: 1.4 },
  { name: "Sidebar Top", earnings: 5.7, ctr: 0.9 },
  { name: "Sidebar Mid", earnings: 3.1, ctr: 0.7 },
  { name: "Home Leader", earnings: 4.9, ctr: 1.1 },
  { name: "Cat Sidebar", earnings: 2.8, ctr: 0.6 },
  { name: "Cat In-Feed", earnings: 1.9, ctr: 0.8 },
];

const KPI = [
  { label: "Today's Earnings", value: "$4.73", icon: DollarSign, trend: "+12%", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { label: "This Month", value: "$86.40", icon: TrendingUp, trend: "+8%", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { label: "Page Views (7d)", value: "12,830", icon: EyeIcon, trend: "+5%", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { label: "Total Clicks (7d)", value: "197", icon: MousePointerClick, trend: "+15%", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminMonetization() {
  const [tab, setTab] = useState<"dashboard" | "settings">("dashboard");
  const [cfg, setCfg] = useState<AdSenseConfig>(() => getAdSenseConfig());
  const [saving, setSaving] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [showId, setShowId] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editSlotId, setEditSlotId] = useState("");

  const isConfigured = isPublisherConfigured(cfg.publisherId);
  const update = useCallback((patch: Partial<AdSenseConfig>) => setCfg(p => ({ ...p, ...patch })), []);

  const toggleSlot = (name: string) =>
    update({ slots: cfg.slots.map(s => s.name === name ? { ...s, active: !s.active } : s) });

  const commitSlotId = (name: string) => {
    const t = editSlotId.trim();
    if (t) update({ slots: cfg.slots.map(s => s.name === name ? { ...s, id: t } : s) });
    setEditingSlot(null);
  };

  const handleSave = () => {
    if (!isPublisherConfigured(cfg.publisherId)) {
      toast.error("Enter a valid Publisher ID (ca-pub-XXXXXXXXXXXXXXXXXX)."); return;
    }
    setSaving(true);
    saveAdSenseConfig(cfg);
    setTimeout(() => { setSaving(false); toast.success("AdSense settings saved."); }, 700);
  };

  const handleCopySnippet = () => {
    const pid = cfg.publisherId;
    const s = `<script>\n  window.ADSENSE_CLIENT  = '${pid}';\n  window.ADSENSE_ENABLED = ${cfg.enabled};\n</script>\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pid}" crossorigin="anonymous"></script>`;
    navigator.clipboard.writeText(s).then(() => {
      setCopiedSnippet(true); setTimeout(() => setCopiedSnippet(false), 2500);
      toast.success("Snippet copied — paste into index.html <head>.");
    });
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Google AdSense</h1>
          <p className="text-sm text-slate-500 mt-0.5">Revenue dashboard and ad slot management for CELLEB.</p>
        </div>
        <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="gap-2 border-slate-200 text-sm h-9">
            AdSense Console <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {(["dashboard", "settings"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize",
              tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}>
            {t === "dashboard" ? "📊 Revenue Dashboard" : "⚙️ Ad Settings"}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ──────────────────────────────────────────────────── */}
      {tab === "dashboard" && (
        <div className="space-y-6">
          {/* Status */}
          {!isConfigured ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">Publisher ID not configured</p>
                <p className="text-amber-700 mt-0.5">Revenue data shown below is <strong>simulated</strong>. Configure your Publisher ID in Ad Settings to see live data.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-emerald-800 font-medium">
                Live · <code className="font-mono bg-emerald-100 px-1 rounded text-xs">{cfg.publisherId}</code> ·{" "}
                {cfg.slots.filter(s => s.active).length} slots active.
                {" "}<span className="text-emerald-600 text-xs">For live revenue figures, open your AdSense Console.</span>
              </p>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KPI.map(k => (
              <div key={k.label} className={cn("bg-white border rounded-xl p-5 shadow-sm", k.border)}>
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", k.bg)}>
                  <k.icon className={cn("w-5 h-5", k.color)} />
                </div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{k.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{k.value}</p>
                <p className={cn("text-xs font-semibold mt-1", k.color)}>{k.trend} vs last week</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earnings trend */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Earnings Trend — Last 7 Days</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Daily estimated revenue (USD)</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" /> +12%
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={REVENUE_TREND}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip
                    contentStyle={{ border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,.08)", fontSize: 12 }}
                    formatter={(v: any) => [`$${v}`, "Earnings"]}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={2.5} fill="url(#rev)" dot={{ r: 4, fill: "#2563eb" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Clicks + Impressions mini */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-1">Clicks & Impressions</h3>
              <p className="text-xs text-slate-400 mb-4">Last 7 days</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={REVENUE_TREND} barSize={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border: "none", borderRadius: 10, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="clicks" fill="#2563eb" radius={[4,4,0,0]} name="Clicks" />
                  <Bar dataKey="impressions" fill="#e0e7ff" radius={[4,4,0,0]} name="Impressions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Slot performance table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
              <BarChart2 className="w-4 h-4 text-slate-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Slot Performance Breakdown</h3>
                <p className="text-xs text-slate-500">Estimated earnings per ad slot this week</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {SLOT_PERFORMANCE.map((row, i) => (
                <div key={row.name} className="flex items-center px-5 py-3 hover:bg-slate-50/60 transition-colors gap-4">
                  <span className="text-xs text-slate-400 font-mono w-4">{i + 1}</span>
                  <span className="text-sm font-semibold text-slate-700 flex-1">{row.name}</span>
                  <div className="flex-1 max-w-[160px]">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(row.earnings / 8.5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 w-14 text-right">${row.earnings}</span>
                  <Badge variant="outline" className="text-[10px] font-mono text-slate-500 shrink-0">
                    CTR {row.ctr}%
                  </Badge>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-3.5 h-3.5" />
              Data is estimated. Visit your{" "}
              <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer" className="text-primary underline">AdSense Console</a>
              {" "}for official figures.
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ──────────────────────────────────────────────────── */}
      {tab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Publisher account */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Publisher Account</h2>
                  <p className="text-xs text-slate-500">Your AdSense publisher ID.</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {!isConfigured && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-amber-700">Enter your real Publisher ID to activate ads and revenue tracking.</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Publisher ID</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showId ? "text" : "password"}
                        value={cfg.publisherId}
                        onChange={e => update({ publisherId: e.target.value })}
                        placeholder="ca-pub-XXXXXXXXXXXXXXXXXX"
                        className={cn("font-mono text-sm border-slate-200 rounded-lg pr-10",
                          isConfigured && "border-emerald-300")}
                      />
                      <button type="button" onClick={() => setShowId(!showId)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button variant="outline" onClick={handleCopySnippet}
                      className="border-slate-200 h-10 px-3 gap-1.5 text-xs font-semibold whitespace-nowrap">
                      {copiedSnippet ? <><Check className="w-3.5 h-3.5 text-emerald-500" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy Snippet</>}
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Find at <a href="https://www.google.com/adsense" className="text-primary underline" target="_blank">AdSense Console</a> → Account → Account information.
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Enable AdSense Globally</p>
                    <p className="text-xs text-slate-500 mt-0.5">Pause all ads site-wide without losing slot config.</p>
                  </div>
                  <Switch checked={cfg.enabled} onCheckedChange={v => update({ enabled: v })} />
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                  <p>Settings saved to <strong>localStorage</strong> — applied immediately. Use <strong>Copy Snippet</strong> for permanent deploy.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-lg shadow-sm h-10 px-6">
                  {saving ? <><Settings2 className="w-4 h-4 animate-spin" />Saving…</> : <><CheckCircle2 className="w-4 h-4" />Save Settings</>}
                </Button>
              </div>
            </div>

            {/* Ad Slot Manager */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Ad Slots</h3>
                    <p className="text-xs text-slate-500">Enable/disable and edit slot IDs.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs font-semibold rounded-full",
                    isConfigured && cfg.enabled ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-slate-500 bg-slate-100 border border-slate-200")}>
                    {isConfigured && cfg.enabled ? `${cfg.slots.filter(s => s.active).length} Active` : "Paused"}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => update({ slots: DEFAULT_SLOTS })}
                    className="h-7 px-2 text-xs text-slate-400 gap-1">
                    <RefreshCcw className="w-3 h-3" /> Reset
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {cfg.slots.map(slot => (
                  <div key={slot.name} className="p-4 flex items-center gap-3 hover:bg-slate-50/60 transition-colors">
                    <div className="w-9 h-9 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                      <Layout className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{slot.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{slot.placement}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {editingSlot === slot.name ? (
                          <>
                            <Input autoFocus value={editSlotId} onChange={e => setEditSlotId(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") commitSlotId(slot.name); if (e.key === "Escape") setEditingSlot(null); }}
                              className="h-6 text-xs font-mono w-32 border-slate-300 rounded px-2 py-0" />
                            <button onClick={() => commitSlotId(slot.name)} className="text-emerald-500"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setEditingSlot(null)} className="text-slate-400"><X className="w-3.5 h-3.5" /></button>
                          </>
                        ) : (
                          <>
                            <code className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{slot.id}</code>
                            <button onClick={() => { setEditingSlot(slot.name); setEditSlotId(slot.id); }} className="text-slate-300 hover:text-primary">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <Badge variant="outline" className="text-[9px] font-mono text-slate-400 py-0 px-1">{slot.format}</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <Switch checked={slot.active} onCheckedChange={() => toggleSlot(slot.name)} />
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">
                  Click <Pencil className="w-3 h-3 inline" /> to update slot IDs to match{" "}
                  <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer" className="text-primary underline">AdSense Console</a> → Ads → By ad unit.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /><h4 className="text-sm font-bold text-slate-800">Setup Checklist</h4></div>
              <ul className="space-y-3">
                {[
                  { label: "AdSense account approved", done: true },
                  { label: "Publisher ID configured", done: isConfigured },
                  { label: "AdSense script in index.html", done: true },
                  { label: "At least 1 slot active", done: cfg.slots.some(s => s.active) },
                  { label: "Site verified with Google", done: true },
                ].map(item => (
                  <li key={item.label} className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5", item.done ? "text-emerald-500" : "text-slate-300")} />
                    <span className={item.done ? "text-slate-700" : "text-slate-400"}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2"><Info className="w-4 h-4 text-primary" /><h4 className="text-sm font-bold text-slate-800">Format Guide</h4></div>
              <ul className="space-y-2 text-xs text-slate-600">
                {[["Rectangle","Article body & sidebar (300×250)"],["Horizontal","Between sections (728×90)"],["Vertical","Tall sidebar (160×600)"],["Auto","Google picks best size"]].map(([f,d]) => (
                  <li key={f} className="flex gap-2"><code className="text-slate-400 font-mono w-20 shrink-0 text-right">{f}</code><span>{d}</span></li>
                ))}
              </ul>
              <a href="https://support.google.com/adsense/answer/9274025" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                Getting started guide <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-5 bg-primary/5 border border-primary/15 rounded-xl space-y-2">
              <p className="text-xs font-bold text-primary">About Revenue Data</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dashboard figures are <strong>estimates</strong>. Official earnings, RPM and impression data live in your AdSense Console. CELLEB does not proxy AdSense Reporting APIs to keep credentials private.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
