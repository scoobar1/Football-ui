/**
 * 90Plus — Unified Design System
 * Single source of truth for ALL visual values across the app.
 * All components must import from here — no hardcoded values allowed.
 *
 * Identity: Purple + Electric Blue + Gold on deep dark
 */

import { Platform } from 'react-native';

// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Backgrounds ─────────────────────────────────────────────────────────────
  bgBase: '#040306',
  bgMid: '#07050f',
  bgSurface: '#0a0814',
  surfaceDark: 'rgba(13,10,20,0.92)',
  surfaceCard: 'rgba(22,16,36,0.98)',
  surfaceGlass: 'rgba(255,255,255,0.07)',
  surfacePanel: 'rgba(13,10,20,0.95)',
  surfaceModal: 'rgba(14,11,22,0.98)',

  // ── Purple system (primary) ─────────────────────────────────────────────────
  purplePrimary: '#7C3AED',
  purpleDark: '#5B21B6',
  purpleDeep: 'rgba(76,29,149,0.35)',
  purpleGlow: 'rgba(124,58,237,0.35)',
  purpleGlowSm: 'rgba(124,58,237,0.15)',
  purpleGlowXs: 'rgba(124,58,237,0.08)',
  purpleSoft: '#A78BFA',
  purpleMuted: 'rgba(167,139,250,0.2)',
  purpleAccent: '#A855F7',

  // ── Electric Blue system (logo accent) ──────────────────────────────────────
  bluePrimary: '#3B82F6',
  blueElectric: '#60A5FA',
  blueGlow: 'rgba(59,130,246,0.3)',
  blueSoft: 'rgba(96,165,250,0.15)',
  blueGlowSm: 'rgba(59,130,246,0.12)',
  blueGlowXs: 'rgba(59,130,246,0.08)',

  // ── Gold system ─────────────────────────────────────────────────────────────
  gold: '#F5C518',
  goldDark: '#D4A017',
  goldGlow: 'rgba(245,197,24,0.4)',
  goldSoft: 'rgba(212,160,23,0.22)',

  // ── Chat bubble backgrounds ─────────────────────────────────────────────────
  aiBubbleBg: 'rgba(124,58,237,0.18)',
  aiBubbleBgEnd: 'rgba(76,29,149,0.12)',
  aiBubbleBorder: 'rgba(167,139,250,0.2)',
  userBubbleStart: '#7C3AED',
  userBubbleEnd: '#5B21B6',

  // ── Semantic ────────────────────────────────────────────────────────────────
  live: '#ef4444',
  ratingGold: '#FFD700',
  ratingGreen: '#32CD32',
  ratingTeal: '#11998E',
  silver: '#C0C0C0',
  bronze: '#CD7F32',

  // ── Text ────────────────────────────────────────────────────────────────────
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.75)',
  textMuted: 'rgba(255,255,255,0.4)',
  textDisabled: 'rgba(255,255,255,0.2)',

  // ── Glass surfaces ──────────────────────────────────────────────────────────
  glassCard: 'rgba(255,255,255,0.06)',
  glassBorderTop: 'rgba(255,255,255,0.12)',
  glassBorderSide: 'rgba(255,255,255,0.05)',
  glassBorderBottom: 'rgba(255,255,255,0.02)',

  // ── Borders ─────────────────────────────────────────────────────────────────
  borderSubtle: 'rgba(255,255,255,0.08)',
  borderArena: 'rgba(255,255,255,0.1)',
  borderArenaStrong: 'rgba(255,255,255,0.12)',
  borderLight: 'rgba(255,255,255,0.15)',
  borderMedium: 'rgba(255,255,255,0.20)',

  // ── Status colors ───────────────────────────────────────────────────────────
  success: '#10B981',
  successBg: 'rgba(16,185,129,0.25)',
  successBorder: 'rgba(16,185,129,0.5)',
  successGlow: 'rgba(16,185,129,0.6)',

  warning: '#EAB308',
  warningBg: 'rgba(234,179,8,0.25)',
  warningBorder: 'rgba(234,179,8,0.5)',
  warningGlow: 'rgba(234,179,8,0.6)',

  error: '#EF4444',
  errorBg: 'rgba(239,68,68,0.25)',
  errorBorder: 'rgba(239,68,68,0.5)',
  errorGlow: 'rgba(239,68,68,0.6)',
  errorDark: '#DC2626',

  info: '#3B82F6',
  infoBg: 'rgba(59,130,246,0.95)',

  // ── Tab colors ──────────────────────────────────────────────────────────────
  tabHome: '#f59e0b',
  tabLeagues: '#3B82F6',
  tabQuiz: '#3B82F6',
  tabAI: '#a855f7',
  tabProfile: '#a855f7',
  tabHighlights: '#ef4444',
  tabRank: '#ec4899',

  // ── Overlay ─────────────────────────────────────────────────────────────────
  overlayDark: 'rgba(0,0,0,0.6)',
  overlayScrim: 'rgba(0,0,0,0.72)',
  overlayBlur: 'rgba(0,0,0,0.8)',

  // ── Context menu ────────────────────────────────────────────────────────────
  contextMenuBg: 'rgba(15,10,25,0.98)',
  contextMenuBorder: 'rgba(255,255,255,0.2)',

  // ── Inset highlight (glass surfaces) ────────────────────────────────────────
  insetHighlight: 'rgba(255,255,255,0.1)',
  insetHighlightSubtle: 'rgba(255,255,255,0.06)',

  // ── Auth surfaces ───────────────────────────────────────────────────────────
  authPanelBg: '#0b0b15',
  authSurfaceInput: 'rgba(255,255,255,0.06)',
  authBorder: 'rgba(255,255,255,0.12)',

  // ── White opacity scale ─────────────────────────────────────────────────────
  white: '#FFFFFF',
  white90: 'rgba(255,255,255,0.90)',
  white80: 'rgba(255,255,255,0.80)',
  white70: 'rgba(255,255,255,0.70)',
  white60: 'rgba(255,255,255,0.60)',
  white55: 'rgba(255,255,255,0.55)',
  white50: 'rgba(255,255,255,0.50)',
  white45: 'rgba(255,255,255,0.45)',
  white40: 'rgba(255,255,255,0.40)',
  white30: 'rgba(255,255,255,0.30)',
  white20: 'rgba(255,255,255,0.20)',
  white10: 'rgba(255,255,255,0.10)',
  white08: 'rgba(255,255,255,0.08)',
  white06: 'rgba(255,255,255,0.06)',
  white04: 'rgba(255,255,255,0.04)',
  white03: 'rgba(255,255,255,0.03)',
} as const;

// ─── Tab Colors (keyed by route name) ─────────────────────────────────────────

export const TAB_COLORS = {
  Home: Colors.tabHome,
  Leagues: Colors.tabLeagues,
  Quiz: Colors.tabQuiz,
  AI: Colors.tabAI,
  Profile: Colors.tabProfile,
  Highlights: Colors.tabHighlights,
  Rank: Colors.tabRank,
} as const;

export const ACCENT_ROUTE = {
  home: Colors.tabHome,
  leagues: Colors.tabLeagues,
  quiz: Colors.tabQuiz,
  ai: Colors.tabAI,
  profile: Colors.tabProfile,
  highlights: Colors.tabHighlights,
  rank: Colors.tabRank,
} as const;

// ─── Gradients ────────────────────────────────────────────────────────────────

export const Gradients = {
  // App background
  background: [Colors.bgBase, Colors.bgMid, Colors.bgSurface, Colors.bgBase] as const,
  backgroundLocations: [0, 0.3, 0.7, 1] as const,

  // CTA button
  purpleCTA: [Colors.purplePrimary, Colors.purpleDark] as const,

  // AI bubble
  aiBubble: [Colors.aiBubbleBg, Colors.aiBubbleBgEnd] as const,

  // User bubble
  userBubble: [Colors.purplePrimary, Colors.purpleDark] as const,

  // Ambient glow layers
  ambientTop: ['rgba(76,29,149,0.35)', 'transparent'] as const,
  ambientRight: ['rgba(124,58,237,0.25)', 'transparent'] as const,
  ambientBottomLeft: ['rgba(91,33,182,0.2)', 'transparent'] as const,

  // Hub hero strips
  heroPurpleBlue: ['rgba(124,58,237,0.22)', 'rgba(59,130,246,0.1)', 'transparent'] as const,
  heroRank: ['rgba(236,72,153,0.18)', 'rgba(124,58,237,0.08)', 'transparent'] as const,
  heroReels: ['rgba(239,68,68,0.18)', 'rgba(124,58,237,0.08)', 'transparent'] as const,

  // Quiz streak card
  quizStreak: ['rgba(245,197,24,0.12)', 'rgba(124,58,237,0.08)', 'rgba(8,6,14,0.95)'] as const,

  // Vignette
  vignette: ['transparent', 'rgba(0,0,0,0.7)'] as const,

  // Shimmer
  shimmer: ['transparent', 'rgba(255,255,255,0.015)', 'transparent'] as const,

  // Video overlay
  videoOverlay: ['transparent', 'rgba(0,0,0,0.82)'] as const,

  // Pitch
  pitch: ['#165a2f', '#1e7239', '#1e7239', '#165a2f'] as const,

  // Status
  success: ['rgba(16,185,129,0.25)', 'rgba(5,150,105,0.2)'] as const,
  warning: ['rgba(234,179,8,0.25)', 'rgba(202,138,4,0.2)'] as const,
  error: ['rgba(239,68,68,0.25)', 'rgba(220,38,38,0.2)'] as const,

  // Stop button
  stopButton: [Colors.error, Colors.errorDark] as const,

  // Error banner
  errorBanner: ['rgba(239,68,68,0.15)', 'rgba(220,38,38,0.1)'] as const,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
  '8xl': 80,
  '9xl': 88,
  '10xl': 96,

  // Named layout spacing
  screenPaddingH: 16,
  sectionGap: 24,
  sectionHeaderToContent: 10,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,

  // Component-specific
  button: 14,
  buttonRound: 22,
  card: 16,
  chip: 20,
  bubble: 24,
  bubbleTailUser: 8,
  bubbleTailAI: 8,
  input: 9999,
  contextMenu: 24,
  toast: 16,
  badge: 9999,
  bottomNav: 28,
  panel: 0,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FontSize = {
  '2xs': 9,
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  'md+': 13.5,
  lg: 14,
  xl: 15,
  '2xl': 16,
  '3xl': 18,
  '4xl': 20,
  '5xl': 24,
  '6xl': 28,
  '7xl': 32,
  '8xl': 36,
  '9xl': 40,
} as const;

export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
} as const;

export const LineHeight = {
  tight: 16,
  snug: 18,
  normal: 20,
  relaxed: 22,
  loose: 26,
  heading: 28,
  display: 34,
} as const;

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.3,
  normal: 0,
  wide: 1.5,
  wider: 2,
  widest: 2.5,
} as const;

// ─── Fonts ────────────────────────────────────────────────────────────────────

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const Shadows = {
  card: {
    shadowColor: Colors.purplePrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: Colors.purplePrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  contextMenu: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 30,
  },
  toast: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  scrollButton: {
    shadowColor: Colors.purplePrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  errorBanner: {
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  nav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
} as const;

// ─── Animation Durations ──────────────────────────────────────────────────────

export const Duration = {
  instant: 0,
  fast: 150,
  normal: 200,
  medium: 300,
  slow: 400,
  slower: 500,
  shimmer: 2000,
  toast: 2000,
  thinking: 1400,
  thinkingStep: 2000,
  carousel: 350,
  carouselAuto: 5000,
  heartbeat: 2000,
} as const;

// ─── Blur Intensities ─────────────────────────────────────────────────────────

export const BlurIntensity = {
  glass: Platform.OS === 'ios' ? 20 : 50,
  header: Platform.OS === 'ios' ? 40 : 80,
  panel: Platform.OS === 'ios' ? 40 : 80,
  contextMenu: Platform.OS === 'ios' ? 60 : 100,
  overlay: Platform.OS === 'ios' ? 8 : 20,
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Layout = {
  headerHeight: 88,
  bottomNavHeight: 56,
  inputBarHeight: 52,
  inputBarPaddingBottom: 32,
  homeIndicatorHeight: 5,
  homeIndicatorWidth: 130,
  maxBubbleWidthAI: '85%' as const,
  maxBubbleWidthUser: '65%' as const,
  sidePanel: 320,
  scrollButtonBottom: 190,
  screenPaddingH: 16,
  sectionGap: 24,
  sectionHeaderToContent: 10,
} as const;

// ─── Quick Chips ──────────────────────────────────────────────────────────────

export const QUICK_CHIPS = [
  { text: 'Football facts' },
  { text: 'League stats' },
  { text: 'Training plan' },
  { text: 'Nutrition tips' },
  { text: 'Recovery tips' },
  { text: 'Strength work' },
] as const;

// ─── API Config ───────────────────────────────────────────────────────────────

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_BACKEND_URL
    ?? (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001'),
  userIdKey: 'ai-chat-user-id',
} as const;

// ─── WebSocket Config (deprecated — using SSE now) ────────────────────────────

export const WS_CONFIG = {
  url: 'ws://localhost:3001',
  heartbeatInterval: 30_000,
  reconnectDelay: 3_000,
  maxReconnectAttempts: 5,
} as const;
