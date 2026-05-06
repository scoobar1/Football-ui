// ─── 90Plus Design Tokens — Single Source of Truth ───────────────────────────
// Logo identity: Purple + Electric Blue + Gold on deep dark

// ── Background ────────────────────────────────────────────────────────────────
export const BG_BASE    = '#040306';
export const BG_MID     = '#07050f';
export const BG_SURFACE = '#0a0814';

// ── Purple system (primary) ───────────────────────────────────────────────────
export const PURPLE_PRIMARY = '#7C3AED';
export const PURPLE_DARK    = '#5B21B6';
export const PURPLE_SOFT    = '#A78BFA';
export const PURPLE_GLOW    = 'rgba(124,58,237,0.35)';
export const PURPLE_GLOW_SM = 'rgba(124,58,237,0.15)';
export const PURPLE_GLOW_XS = 'rgba(124,58,237,0.08)';

// ── Electric Blue system (logo accent) ───────────────────────────────────────
export const BLUE_PRIMARY  = '#3B82F6';
export const BLUE_ELECTRIC = '#60A5FA';
export const BLUE_GLOW     = 'rgba(59,130,246,0.3)';
export const BLUE_SOFT     = 'rgba(96,165,250,0.15)';
export const BLUE_GLOW_SM  = 'rgba(59,130,246,0.12)';
export const BLUE_GLOW_XS  = 'rgba(59,130,246,0.08)';

// ── Gold system ───────────────────────────────────────────────────────────────
export const GOLD_PRIMARY = '#F5C518';
export const GOLD_DARK    = '#D4A017';
export const GOLD_GLOW    = 'rgba(245,197,24,0.4)';
export const GOLD_SOFT    = 'rgba(212,160,23,0.22)';

// ── Glass surfaces ────────────────────────────────────────────────────────────
export const GLASS_CARD         = 'rgba(255,255,255,0.06)';
export const GLASS_BORDER_TOP   = 'rgba(255,255,255,0.12)';
export const GLASS_BORDER_SIDE  = 'rgba(255,255,255,0.05)';
export const GLASS_BORDER_BOTTOM = 'rgba(255,255,255,0.02)';

// ── Text ──────────────────────────────────────────────────────────────────────
export const TEXT_PRIMARY   = '#FFFFFF';
export const TEXT_SECONDARY = 'rgba(255,255,255,0.75)';
export const TEXT_MUTED     = 'rgba(255,255,255,0.4)';
export const TEXT_DISABLED  = 'rgba(255,255,255,0.2)';

// ── Semantic ──────────────────────────────────────────────────────────────────
export const LIVE_RED    = '#ef4444';
export const RATING_GOLD  = '#FFD700';
export const RATING_GREEN = '#32CD32';
export const RATING_TEAL  = '#11998E';

// ── Tab colors ────────────────────────────────────────────────────────────────
export const TAB_COLORS = {
  Home:       '#f59e0b',
  Leagues:    '#3B82F6',   // Electric Blue (updated from green)
  Quiz:       '#3b82f6',
  AI:         '#a855f7',   // Purple — AI chat tab
  Profile:    '#a855f7',
  Highlights: '#ef4444',
  Rank:       '#ec4899',
} as const;
