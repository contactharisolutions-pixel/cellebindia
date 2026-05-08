import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Settings2, Globe, Bell, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully.");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage global configuration for the platform.</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">General Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700">Platform Name</Label>
              <Input defaultValue="CELLEB - The Sparkling World of Stars" className="max-w-md rounded-lg shadow-sm focus-visible:ring-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700">Contact Email</Label>
              <Input defaultValue="admin@celleb.com" type="email" className="max-w-md rounded-lg shadow-sm focus-visible:ring-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700">Maintenance Mode</Label>
              <p className="text-xs text-slate-500">Enable this to show a maintenance page to visitors.</p>
              <div className="mt-2 text-sm bg-slate-100 inline-block px-3 py-1.5 rounded-lg text-slate-600 font-medium border border-slate-200">
                Disabled
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm gap-2 h-10 px-6">
          {loading ? <Settings2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
