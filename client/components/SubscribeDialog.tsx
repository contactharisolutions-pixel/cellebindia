import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function SubscribeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      setEmail("");
      toast.success("Successfully subscribed to CELLEB newsletter!");
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="text-xs font-bold text-white hover:text-primary transition-colors tracking-widest uppercase cursor-pointer"
          style={{ fontFamily: '"Roboto", sans-serif' }}
        >
          SUBSCRIBE
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border-black border-2 rounded-none p-6 md:p-8">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-3xl font-serif font-bold text-black flex items-center justify-center gap-3">
            <Mail className="w-8 h-8 text-primary" />
            Stay in the Loop
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2 text-base">
            Get the latest Bollywood, Hollywood, and Box Office news delivered straight to your inbox.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-300 rounded-none focus-visible:ring-primary focus-visible:border-primary h-12 text-base"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-primary hover:text-black transition-colors rounded-none font-bold h-12 text-base tracking-wider uppercase"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe Now"}
          </Button>
          <p className="text-xs text-gray-500 text-center pt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
