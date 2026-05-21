/**
 * Backward-compatible re-exports from the unified design system.
 * New code should import directly from '@/constants/theme'.
 *
 * @deprecated Import from '@/constants/theme' instead.
 */

import { Colors, Gradients, Spacing, Radius, Layout, TAB_COLORS, ACCENT_ROUTE } from './theme';

// ── Background ────────────────────────────────────────────────────────────────
export const BG_BASE = Colors.bgBase;
export const BG_MID = Colors.bgMid;
export const BG_SURFACE = Colors.bgSurface;

// ── Purple system ─────────────────────────────────────────────────────────────
export const PURPLE_PRIMARY = Colors.purplePrimary;
export const PURPLE_DARK = Colors.purpleDark;
export const PURPLE_SOFT = Colors.purpleSoft;
export const PURPLE_GLOW = Colors.purpleGlow;
export const PURPLE_GLOW_SM = Colors.purpleGlowSm;
export const PURPLE_GLOW_XS = Colors.purpleGlowXs;

// ── Electric Blue system ──────────────────────────────────────────────────────
export const BLUE_PRIMARY = Colors.bluePrimary;
export const BLUE_ELECTRIC = Colors.blueElectric;
export const BLUE_GLOW = Colors.blueGlow;
export const BLUE_SOFT = Colors.blueSoft;
export const BLUE_GLOW_SM = Colors.blueGlowSm;
export const BLUE_GLOW_XS = Colors.blueGlowXs;

// ── Gold system ───────────────────────────────────────────────────────────────
export const GOLD_PRIMARY = Colors.gold;
export const GOLD_DARK = Colors.goldDark;
export const GOLD_GLOW = Colors.goldGlow;
export const GOLD_SOFT = Colors.goldSoft;

// ── Glass surfaces ────────────────────────────────────────────────────────────
export const GLASS_CARD = Colors.glassCard;
export const GLASS_BORDER_TOP = Colors.glassBorderTop;
export const GLASS_BORDER_SIDE = Colors.glassBorderSide;
export const GLASS_BORDER_BOTTOM = Colors.glassBorderBottom;

// ── Text ──────────────────────────────────────────────────────────────────────
export const TEXT_PRIMARY = Colors.textPrimary;
export const TEXT_SECONDARY = Colors.textSecondary;
export const TEXT_MUTED = Colors.textMuted;
export const TEXT_DISABLED = Colors.textDisabled;

// ── Semantic ──────────────────────────────────────────────────────────────────
export const LIVE_RED = Colors.live;
export const RATING_GOLD = Colors.ratingGold;
export const RATING_GREEN = Colors.ratingGreen;
export const RATING_TEAL = Colors.ratingTeal;

// ── Tab colors ────────────────────────────────────────────────────────────────
export { TAB_COLORS, ACCENT_ROUTE };

// ── Radii ─────────────────────────────────────────────────────────────────────
export const RADIUS_SM = Radius.sm;
export const RADIUS_MD = Radius.md;
export const RADIUS_LG = Radius.lg;
export const RADIUS_XL = Radius.xl;

// ── Borders ───────────────────────────────────────────────────────────────────
export const BORDER_ARENA = Colors.borderArena;
export const BORDER_ARENA_STRONG = Colors.borderArenaStrong;

// ── Gradients ─────────────────────────────────────────────────────────────────
export const GRADIENT_BG_COLORS = Gradients.background;
export const GRADIENT_BG_LOCATIONS = Gradients.backgroundLocations;
export const GRADIENT_HERO_PURPLE_BLUE = Gradients.heroPurpleBlue;
export const GRADIENT_HERO_RANK = Gradients.heroRank;
export const GRADIENT_HERO_REELS = Gradients.heroReels;
export const GRADIENT_QUIZ_STREAK = Gradients.quizStreak;
export const GRADIENT_CTA_PURPLE = Gradients.purpleCTA;

// ── Overlays ──────────────────────────────────────────────────────────────────
export const OVERLAY_SCRIM = Colors.overlayScrim;
export const SURFACE_MODAL = Colors.surfaceModal;

// ── Layout ────────────────────────────────────────────────────────────────────
export const SCREEN_PADDING_H = Layout.screenPaddingH;
export const SECTION_GAP = Layout.sectionGap;
export const SECTION_HEADER_TO_CONTENT = Layout.sectionHeaderToContent;
