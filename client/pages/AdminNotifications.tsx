import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markNotificationAsRead, deleteNotification, createNotification } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Bell, Megaphone, Trash2, CheckCheck, AlertTriangle,
  Info, ShieldAlert, Clock, ExternalLink, SendHorizontal, Loader2, Plus
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { cn, formatDateTime } from "@/lib/utils";
const typeConfig: Record<string, { color: string; bg: string; icon: any; badge: string }> = {
  Info: { color: "text-blue-600", bg: "bg-blue-50 border-blue-100", icon: Info, badge: "text-blue-700 bg-blue-50 border-blue-200" },
  Alert: { color: "text-amber-600", bg: "bg-amber-50 border-amber-100", icon: AlertTriangle, badge: "text-amber-700 bg-amber-50 border-amber-200" },
  Critical: { color: "text-red-600", bg: "bg-red-50 border-red-100", icon: ShieldAlert, badge: "text-red-700 bg-red-50 border-red-200" },
};

export default function AdminNotifications() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("Info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"], queryFn: fetchNotifications,
  });

  const broadcastMutation = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification sent.");
      setIsOpen(false); resetForm();
    },
  });

  const readMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["notifications"] }); toast.success("Deleted."); },
  });

  const resetForm = () => { setType("Info"); setTitle(""); setMessage(""); setLink(""); };

  const unreadCount = notifications?.filter((n: any) => !n.is_read).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-white rounded-full px-2.5 py-0.5 text-xs font-semibold">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Send alerts and system-wide messages to all users.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(val) => { setIsOpen(val); if (!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl border-slate-200 shadow-xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">Send Notification</DialogTitle>
              <p className="text-sm text-slate-500">Send a message to all admin users.</p>
            </DialogHeader>

            <form onSubmit={(e) => { e.preventDefault(); broadcastMutation.mutate({ type, title, message, link }); }} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Alert Priority</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="rounded-lg border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Info">Info</SelectItem>
                      <SelectItem value="Alert">Warning</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Article Link (Optional)</Label>
                  <Input
                    placeholder="/articles/my-post"
                    value={link} onChange={(e) => setLink(e.target.value)}
                    className="rounded-lg border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Notification Title</Label>
                <Input
                  placeholder="Enter title…"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  className="rounded-lg border-slate-200" required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Message Content</Label>
                <Textarea
                  placeholder="Enter message text…"
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  className="rounded-lg border-slate-200 min-h-[100px]" required
                />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={broadcastMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-10 gap-2"
                >
                  {broadcastMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    <><SendHorizontal className="w-4 h-4" /> Send Notification</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notifications list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-slate-200 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Loading notifications…</span>
        </div>
      ) : notifications?.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">No notifications yet</p>
          <p className="text-xs text-slate-400 mt-1">Send a message using the button above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications?.map((n: any) => {
            const tc = typeConfig[n.type] || typeConfig["Info"];
            const Icon = tc.icon;
            return (
              <div
                key={n.id}
                className={cn(
                  "bg-white rounded-xl border p-5 flex gap-5 transition-all",
                  n.is_read ? "opacity-60 border-slate-100" : "border-slate-200 shadow-sm"
                )}
              >
                {/* Icon */}
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", tc.bg)}>
                  <Icon className={cn("w-5 h-5", tc.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <Badge className={cn("text-xs font-semibold rounded-full px-2.5 py-0.5 border", tc.badge)}>
                      {n.type}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(n.created_at)}
                    </span>
                    {n.is_read && (
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Read</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 leading-snug">{n.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                  {n.link && (
                    <button className="mt-2 text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                      View Article <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {!n.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => readMutation.mutate(n.id)}
                      className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { if (confirm("Delete this notification?")) deleteMutation.mutate(n.id); }}
                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
