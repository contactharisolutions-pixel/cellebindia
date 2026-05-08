import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call an API
    if (email === "vinay@celleb.com" && password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      toast.success("Welcome back, Vinay!");
      navigate("/admin");
    } else {
      toast.error("Invalid corporate credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">CELLEB Admin</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-widest">Internal Governance Portal</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-10 border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User className="w-3 h-3" />
                Corporate Email
              </Label>
              <Input 
                type="email" 
                placeholder="vinay@celleb.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-200 rounded-xl h-12 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Access Key
              </Label>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-200 rounded-xl h-12 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-primary/20">
            Authorize Entry
          </Button>
          
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[10px] text-center text-gray-400 font-medium italic">
              This is a restricted access system. All activities are monitored and logged.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
