import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 shadow-[0_-10px_50px_rgba(0,0,0,0.1)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Background Glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative z-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
              <Cookie className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                We value your privacy
              </h3>
              <p className="text-slate-600 text-sm md:text-base max-w-2xl leading-relaxed">
                CELLEB uses cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our{" "}
                <Link to="/cookies-policy" className="text-primary hover:underline font-semibold transition-all">
                  Cookies Policy
                </Link>{" "}
                for more details.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl h-12 px-8 font-bold transition-all bg-white"
            >
              Reject Non-Essential
            </Button>
            <Button
              onClick={handleAccept}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-none"
            >
              Accept All
            </Button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="absolute -top-4 -right-4 md:static p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
