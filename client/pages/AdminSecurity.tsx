import { useQuery } from "@tanstack/react-query";
import { Shield, ShieldAlert, History, UserCheck, Lock, Fingerprint, Calendar, Loader2 } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

async function fetchAuditLogs() {
  const response = await fetch("/api/security/audit");
  if (!response.ok) throw new Error("Failed to fetch audit logs");
  return response.json();
}

export default function AdminSecurity() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: fetchAuditLogs,
    refetchInterval: 10000 // Refresh for real-time tracking
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security & Governance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Audit trails, access controls, and platform integrity.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            Encryption Active
          </div>
          <div className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-primary" />
            Protocol v6.0
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SecurityCard 
          icon={<UserCheck className="w-5 h-5 text-blue-600" />} 
          bgClass="bg-blue-50"
          label="Active Sessions" 
          value="4" 
          description="Total administrators logged in."
        />
        <SecurityCard 
          icon={<ShieldAlert className="w-5 h-5 text-emerald-600" />} 
          bgClass="bg-emerald-50"
          label="Recent Alerts" 
          value="0" 
          description="High-priority security events."
          isSafe
        />
        <SecurityCard 
          icon={<Fingerprint className="w-5 h-5 text-purple-600" />} 
          bgClass="bg-purple-50"
          label="Audit Depth" 
          value="30 Days" 
          description="Retention period for system logs."
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Global Audit Trail</h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-20 text-slate-400">
             <Loader2 className="w-5 h-5 animate-spin mr-2" />
             <span className="text-sm">Scanning system logs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administrator</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Target ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs?.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateTime(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-sm text-slate-900">{log.user_name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "text-sm font-medium",
                        log.action.includes('Deleted') ? 'text-red-600' : 
                        log.action.includes('Created') ? 'text-emerald-600' : 'text-slate-700'
                      )}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-400">
                      {log.target_id || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between mt-8">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Automated Threat Detection</h4>
            <p className="text-sm text-slate-500 mt-0.5">System guardian is actively monitoring the control panel for unauthorized requests.</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-bold uppercase tracking-wider text-primary">
          Active
        </div>
      </div>
    </div>
  );
}

function SecurityCard({ icon, bgClass, label, value, description, isSafe = false }: any) {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", bgClass, bgClass.replace('bg-', 'border-').replace('50', '100'))}>
          {icon}
        </div>
        {isSafe && <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest px-2 py-1 bg-emerald-50 rounded-full">Secure</span>}
      </div>
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{label}</p>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed mt-4">{description}</p>
    </div>
  );
}
