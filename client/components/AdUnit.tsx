import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getAdSenseConfig, isPublisherConfigured } from "@/lib/adsense";

export type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical";
export type AdLayout = "in-article" | "in-feed" | "";

interface AdUnitProps {
  /** The AdSense ad-unit slot ID – must match a slot in your AdSense console */
  slot: string;
  format?: AdFormat;
  layout?: AdLayout;
  className?: string;
  /** Show "Advertisement" label above the unit (default false for horizontal, true for rectangle) */
  label?: boolean;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
    ADSENSE_CLIENT?: string;
    ADSENSE_ENABLED?: boolean;
  }
}

export default function AdUnit({
  slot,
  format = "auto",
  layout = "",
  className,
  label = format === "rectangle",
  responsive = true,
}: AdUnitProps) {
  const insRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // ── Never render ads in admin panel ──────────────────────────────────────
  const isAdmin = location.pathname.startsWith("/admin");

  // ── Read live config — publisher ID is always hardcoded as fallback ──────
  const cfg = getAdSenseConfig();
  const publisherId = cfg.publisherId;
  const globalEnabled = cfg.enabled;

  const isConfigured = isPublisherConfigured(publisherId);
  const shouldRender = !isAdmin && isConfigured && globalEnabled;

  useEffect(() => {
    if (!shouldRender) return;

    // Wait one tick so the <ins> is fully painted and sized in the DOM
    const timer = setTimeout(() => {
      const el = insRef.current;
      if (!el) return;

      // Authoritative guard: Google sets this attribute after processing
      if (el.getAttribute("data-adsbygoogle-status")) return;

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("[AdUnit] adsbygoogle push failed:", e);
      }
    }, 100);

    return () => clearTimeout(timer);
    // Re-run only if the slot/format changes or route changes (new page = new <ins>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender, slot, format, location.pathname]);

  // ── Render nothing in admin ───────────────────────────────────────────────
  if (isAdmin) return null;

  // ── Placeholder when publisher not configured or ads disabled ────────────
  if (!shouldRender) {
    return (
      <div className={cn("w-full overflow-hidden", className)}>
        {label && (
          <p className="text-center text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 select-none">
            Advertisement
          </p>
        )}
        <div
          className={cn(
            "w-full flex flex-col items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded text-gray-400 select-none",
            format === "horizontal"
              ? "h-[90px]"
              : format === "vertical"
              ? "h-[250px]"
              : "h-[200px]"
          )}
        >
          <svg
            className="w-7 h-7 mb-2 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
          <span className="text-xs font-semibold">Ad Slot: {slot}</span>
          <span className="text-[10px] mt-0.5 opacity-60">
            {!isConfigured
              ? "Publisher ID not configured"
              : "AdSense globally disabled"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {label && (
        <p className="text-center text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 select-none">
          Advertisement
        </p>
      )}

      {/* Live AdSense unit */}
      <ins
        ref={insRef as any}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format === "rectangle" ? "auto" : format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
