/**
 * adsense.ts — Centralized AdSense configuration store
 *
 * Settings are persisted in localStorage so they survive reloads.
 * The Admin Monetization page writes via saveAdSenseConfig().
 * The AdUnit component reads via getAdSenseConfig().
 */

export interface AdSlotConfig {
  id: string;           // The AdSense ad-unit slot ID (e.g. "1234567890")
  name: string;         // Human-readable label shown in admin
  placement: string;    // Description of where on the site it appears
  format: string;       // "Rectangle" | "Horizontal" | "Auto" | "Vertical"
  active: boolean;      // Whether this slot is currently enabled
}

export interface AdSenseConfig {
  publisherId: string;  // ca-pub-XXXXXXXXXXXXXXXXXX
  enabled: boolean;     // Global kill-switch
  slots: AdSlotConfig[];
}

const STORAGE_KEY = "celleb_adsense_config";

/** Default slot definitions — IDs here must match your AdSense console */
export const DEFAULT_SLOTS: AdSlotConfig[] = [
  // ── Article page ──────────────────────────────────────────────────────────
  {
    id: "1234567890",
    name: "Article — In-Article Unit",
    placement: "Article page · after article body",
    format: "Rectangle",
    active: true,
  },
  {
    id: "0987654321",
    name: "Article — Sidebar Top",
    placement: "Article page · sidebar top",
    format: "Rectangle",
    active: true,
  },
  {
    id: "1122334455",
    name: "Article — Sidebar Mid",
    placement: "Article page · sidebar between sections",
    format: "Auto",
    active: true,
  },
  // ── Home page ─────────────────────────────────────────────────────────────
  {
    id: "5566778899",
    name: "Home — Hero Leaderboard",
    placement: "Home page · full-width below hero",
    format: "Horizontal",
    active: true,
  },
  {
    id: "9988776655",
    name: "Home — Pre-Video Banner",
    placement: "Home page · before video gallery",
    format: "Horizontal",
    active: true,
  },
  {
    id: "3344556677",
    name: "Home — Right Sidebar Top",
    placement: "Home page · right column above What's Hot",
    format: "Rectangle",
    active: true,
  },
  {
    id: "7766554433",
    name: "Home — Right Sidebar Bottom",
    placement: "Home page · right column below What's Hot",
    format: "Rectangle",
    active: true,
  },
  // ── Category pages ────────────────────────────────────────────────────────
  {
    id: "2233445566",
    name: "Category — Sidebar Rectangle",
    placement: "All category pages · right sidebar top",
    format: "Rectangle",
    active: true,
  },
  {
    id: "6655443322",
    name: "Category — Sidebar Mid",
    placement: "All category pages · right sidebar middle",
    format: "Auto",
    active: true,
  },
  {
    id: "4455667788",
    name: "Category — In-Feed Banner",
    placement: "All category pages · between article rows",
    format: "Horizontal",
    active: true,
  },
  {
    id: "8877665544",
    name: "Category — Bottom Leaderboard",
    placement: "All category pages · below article grid",
    format: "Horizontal",
    active: true,
  },
];

/** Return the placeholder ID from index.html (fallback if nothing saved yet) */
function getHtmlPublisherId(): string {
  if (typeof document === "undefined") return "";
  const scripts = Array.from(
    document.querySelectorAll<HTMLScriptElement>("script[src*='adsbygoogle']")
  );
  for (const s of scripts) {
    const m = s.src.match(/client=(ca-pub-[0-9X]+)/);
    if (m) return m[1];
  }
  return "";
}

/** Load config from localStorage, falling back to sensible defaults */
export function getAdSenseConfig(): AdSenseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: AdSenseConfig = JSON.parse(raw);
      // Merge in any new default slots that aren't yet in saved config
      const savedIds = new Set(parsed.slots.map((s) => s.id));
      const merged = [
        ...parsed.slots,
        ...DEFAULT_SLOTS.filter((s) => !savedIds.has(s.id)),
      ];
      return { ...parsed, slots: merged };
    }
  } catch {
    /* ignore parse errors */
  }

  return {
    publisherId: getHtmlPublisherId() || "ca-pub-XXXXXXXXXX",
    enabled: true,
    slots: DEFAULT_SLOTS,
  };
}

/** Persist config to localStorage and sync window globals */
export function saveAdSenseConfig(config: AdSenseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Keep window vars in sync so AdUnit components that already
    // mounted pick up the new values without a full reload
    (window as any).ADSENSE_CLIENT = config.publisherId;
    (window as any).ADSENSE_ENABLED = config.enabled;
  } catch {
    console.warn("[AdSense] Failed to persist config to localStorage");
  }
}

/** Check whether a given slot is currently active */
export function isSlotActive(slotId: string): boolean {
  const cfg = getAdSenseConfig();
  if (!cfg.enabled) return false;
  const slot = cfg.slots.find((s) => s.id === slotId);
  return slot?.active ?? true;
}

/** Is the publisher ID real (not the placeholder)? */
export function isPublisherConfigured(pid: string): boolean {
  return !!pid && pid !== "ca-pub-XXXXXXXXXX" && pid.trim() !== "" && /^ca-pub-\d+$/.test(pid);
}
