import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchIntegrations, createIntegration, updateIntegration, deleteIntegration } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Plus, Settings2, Cloud, Activity, Trash2, RefreshCcw,
  ShieldCheck, Zap, Globe, Database, Mail, Box, Link2, AlertCircle, Loader2, DollarSign, ExternalLink
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PROVIDERS = [
  { id: "Google AdSense", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "Google", icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "Slack", icon: Zap, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "AWS", icon: Database, color: "text-orange-500", bg: "bg-orange-50" },
  { id: "OpenAI", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "Mailchimp", icon: Mail, color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "Custom", icon: Box, color: "text-slate-500", bg: "bg-slate-100" },
];

export default function AdminIntegrations() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("API");
  const [provider, setProvider] = useState("Google");

  const { data: integrations, isLoading } = useQuery({
    queryKey: ["integrations"], queryFn: fetchIntegrations,
  });

  const createMutation = useMutation({
    mutationFn: createIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Integration added.");
      setIsOpen(false); resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateIntegration(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["integrations"] }); toast.success("Updated."); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIntegration,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["integrations"] }); toast.success("Removed."); },
  });

  const resetForm = () => { setName(""); setType("API"); setProvider("Google"); };

  const getProvider = (pId: string) => PROVIDERS.find((x) => x.id === pId) || PROVIDERS[PROVIDERS.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Integrations</h1>
          <p className="text-sm text-slate-500 mt-0.5">Connect your website with external services and tools.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl border-slate-200 shadow-xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">Add Integration</DialogTitle>
              <p className="text-sm text-slate-500">Connect a new service to your website.</p>
            </DialogHeader>

            <form
              onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ name, type, provider }); }}
              className="space-y-4 pt-2"
            >
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Integration Name</Label>
                <Input
                  placeholder="e.g. Primary Search Console"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border-slate-200" required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Service Provider</Label>
                  <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger className="rounded-lg border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {PROVIDERS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Connection Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="rounded-lg border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="API">REST API</SelectItem>
                      <SelectItem value="Webhook">Webhook</SelectItem>
                      <SelectItem value="Plugin">Plugin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-10 gap-2"
                >
                  {createMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</>
                  ) : (
                    <><Settings2 className="w-4 h-4" /> Save Integration</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Pinned: Google AdSense ────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-4 -right-12 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Google AdSense</h2>
                <Badge className="bg-white/20 text-white border-white/20 text-[10px] font-bold">
                  Monetization
                </Badge>
              </div>
              <p className="text-blue-100 text-sm mt-0.5">
                Display targeted ads and earn revenue across CELLEB pages.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href="/admin/monetization">
              <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold gap-2 shadow-sm h-10 rounded-lg">
                <Settings2 className="w-4 h-4" />
                Configure AdSense
              </Button>
            </a>
            <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="text-white hover:bg-white/10 gap-1.5 h-10 rounded-lg text-sm">
                Console
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-slate-200 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Loading integrations…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {integrations?.map((integration: any) => {
            const p = getProvider(integration.provider);
            const Icon = p.icon;
            const isConnected = integration.status === "Connected" || integration.status === "Active";
            return (
              <div
                key={integration.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-5">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border", p.bg, "border-" + p.bg.replace("bg-", ""))}>
                    <Icon className={cn("w-5 h-5", p.color)} />
                  </div>
                  <Badge
                    className={cn(
                      "text-xs font-semibold rounded-full px-2.5 py-0.5",
                      isConnected
                        ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                        : "text-slate-500 bg-slate-100 border border-slate-200"
                    )}
                  >
                    {isConnected ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Info */}
                <h3 className="text-base font-bold text-slate-900 truncate">{integration.name}</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {integration.provider} · {integration.type}
                </p>

                {/* Stats */}
                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Activity className="w-3.5 h-3.5" /> Status
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">Functional</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <RefreshCcw className="w-3.5 h-3.5" /> Last Sync
                    </span>
                    <span className="text-xs font-mono text-slate-600">
                      {integration.last_sync
                        ? new Date(integration.last_sync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "Never"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateMutation.mutate({
                        id: integration.id,
                        data: { ...integration, status: isConnected ? "Inactive" : "Connected" },
                      })
                    }
                    className={cn(
                      "flex-1 rounded-lg text-xs font-semibold border",
                      isConnected
                        ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                        : "border-primary/20 text-primary hover:bg-primary/5"
                    )}
                  >
                    {isConnected ? "Disconnect" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { if (confirm("Delete this integration?")) deleteMutation.mutate(integration.id); }}
                    className="h-8 w-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security footer */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">Secure Connections</p>
          <p className="text-xs text-slate-500 mt-0.5">All data sent to external services is encrypted for your security.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">SSL Active</span>
          <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">TLS 1.3</span>
        </div>
      </div>
    </div>
  );
}
