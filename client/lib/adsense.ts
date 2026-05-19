/**
 * adsense.ts — Centralized AdSense configuration store
 *
 * Settings are persisted in localStorage so they survive reloads.
 * The Admin Monetization page writes via saveAdSenseConfig().
 * The AdUnit component reads via getAdSenseConfig().
 */

export interface AdSlotConfig {
  id: string;           // The AdSense ad-unit slot ID (e.g. "8278177353")
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

/** ── Hardcoded production defaults ─────────────────────────────────────────
 * These are used when localStorage has no saved config (e.g., first visit).
 * Never change PUBLISHER_ID — it's your real AdSense publisher ID.
 */
const PUBLISHER_ID = "ca-pub-3892340345930235";
const AD_SLOT_ID   = "8278177353";

/** Default slot definitions — IDs here must match your AdSense console */
export const DEFAULT_SLOTS: AdSlotConfig[] = [
  // ── Article page ──────────────────────────────────────────────────────────
  {
    id: "8278177353",
    name: "Article — In-Article Unit",
    placement: "Article page · after article body",
    format: "Rectangle",
    active: true,
  },
  {
    id: "8278177353",
    name: "Article — Sidebar Top",
    placement: "Article page · sidebar top",
    format: "Rectangle",
    active: true,
  },
  {
    id: "8278177353",
    name: "Article — Sidebar Mid",
    placement: "Article page · sidebar between sections",
    format: "Auto",
    active: true,
  },
  // ── Home page ─────────────────────────────────────────────────────────────
  {
    id: "8278177353",
    name: "Home — Hero Leaderboard",
    placement: "Home page · full-width below hero",
    format: "Horizontal",
    active: true,
  },
  {
    id: "8278177353",
    name: "Home — Pre-Video Banner",
    placement: "Home page · before video gallery",
    format: "Horizontal",
    active: true,
  },
  {
    id: "8278177353",
    name: "Home — Right Sidebar Top",
    placement: "Home page · right column above What's Hot",
    format: "Rectangle",
    active: true,
  },
  {
    id: "8278177353",
    name: "Home — Right Sidebar Bottom",
    placement: "Home page · right column below What's Hot",
    format: "Rectangle",
    active: true,
  },
  // ── Category pages ────────────────────────────────────────────────────────
  {
    id: "8278177353",
    name: "Category — Sidebar Rectangle",
    placement: "All category pages · right sidebar top",
    format: "Rectangle",
    active: true,
  },
  {
    id: "8278177353",
    name: "Category — Sidebar Mid",
    placement: "All category pages · right sidebar middle",
    format: "Auto",
    active: true,
  },
  {
    id: "8278177353",
    name: "Category — In-Feed Banner",
    placement: "All category pages · between article rows",
    format: "Horizontal",
    active: true,
  },
  {
    id: "8278177353",
    name: "Category — Bottom Leaderboard",
    placement: "All category pages · below article grid",
    format: "Horizontal",
    active: true,
  },
];

/** Load config from localStorage, falling back to hardcoded production defaults */
export function getAdSenseConfig(): AdSenseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: AdSenseConfig = JSON.parse(raw);
      // Merge in any new default slots that aren't yet in saved config
      // Use slot NAME as unique key (all slots share the same ID now)
      const savedNames = new Set(parsed.slots.map((s) => s.name));
      const merged = [
        ...parsed.slots,
        ...DEFAULT_SLOTS.filter((s) => !savedNames.has(s.name)),
      ];
      // ── Always ensure real publisher ID is used (overrides stale placeholder) ──
      const publisherId = isPublisherConfigured(parsed.publisherId)
        ? parsed.publisherId
        : PUBLISHER_ID;
      return { ...parsed, publisherId, slots: merged };
    }
  } catch {
    /* ignore parse errors */
  }

  // ── No localStorage yet (first visit) — use hardcoded production defaults ──
  return {
    publisherId: PUBLISHER_ID,
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
