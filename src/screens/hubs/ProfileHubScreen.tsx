import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MainShell } from '../../components/shell/MainShell';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  GOLD_PRIMARY,
  PURPLE_SOFT,
  GLASS_BORDER_TOP,
  GLASS_BORDER_BOTTOM,
  SCREEN_PADDING_H,
  GRADIENT_HERO_PURPLE_BLUE,
  BORDER_ARENA,
  RADIUS_LG,
} from '../../../constants/tokens';
import { ProfileMomentsSection } from '../../components/profile';

const STATS = [
  { k: 'XP', v: '12.4k' },
  { k: 'Level', v: 'LV 12' },
  { k: 'Streak', v: '7 days' },
];

type HubRoute = '/register' | '/login' | '/settings' | '/notifications';

const MENU: { t: string; s: string; route?: HubRoute }[] = [
  { t: 'Sign up', s: 'Create a 90Plus account', route: '/register' },
  { t: 'Login', s: 'Continue with your account', route: '/login' },
  { t: 'Settings', s: 'Notifications, privacy, preferences', route: '/settings' },
  { t: 'Notifications', s: 'Alerts & reminders inbox', route: '/notifications' },
  { t: 'Favorites & following', s: 'Clubs & players' },
  { t: 'Help', s: 'Self‑service support' },
  { t: 'Privacy', s: 'Manage your data' },
];

export default function ProfileHubScreen() {
  const router = useRouter();

  return (
    <MainShell
      title="Profile"
      subtitle="Quick hub before wiring a real account and cloud sync."
    >
      <View style={styles.heroShell}>
        <LinearGradient
          colors={[...GRADIENT_HERO_PURPLE_BLUE]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.hero}>
          <LinearGradient
            colors={[GRADIENT_HERO_PURPLE_BLUE[0], GRADIENT_HERO_PURPLE_BLUE[1]]}
            style={styles.avatarRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarTxt}>A</Text>
            </View>
          </LinearGradient>
          <Text style={styles.name}>Alex • Active player</Text>
          <Text style={styles.handle}>@alex_90plus · Member since Oct 2025</Text>
        </View>
      </View>

      <View style={styles.statRow}>
        {STATS.map((s) => (
          <View key={s.k} style={styles.statPill}>
            <Text style={styles.statVal}>{s.v}</Text>
            <Text style={styles.statKey}>{s.k}</Text>
          </View>
        ))}
      </View>

      <ProfileMomentsSection />

      <Text style={styles.sectionLabel}>Settings & account</Text>
      {MENU.map((m, i) => (
        <TouchableOpacity
          key={m.t + String(i)}
          activeOpacity={0.85}
          style={styles.menuRow}
          onPress={() => {
            if (m.route) router.push(m.route);
          }}
        >
          <View style={styles.menuTxt}>
            <Text style={styles.menuTitle}>{m.t}</Text>
            <Text style={styles.menuSub}>{m.s}</Text>
          </View>
          <ChevronRight color={TEXT_MUTED} size={20} strokeWidth={2} />
        </TouchableOpacity>
      ))}
    </MainShell>
  );
}

const styles = StyleSheet.create({
  heroShell: {
    marginHorizontal: -SCREEN_PADDING_H,
    marginBottom: 20,
    borderRadius: RADIUS_LG,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA,
  },
  hero: { alignItems: 'center', paddingVertical: 22, paddingHorizontal: SCREEN_PADDING_H },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    backgroundColor: 'rgba(6,5,12,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTxt: { fontSize: 36, fontWeight: '900', color: GOLD_PRIMARY },

  name: { marginTop: 12, fontSize: 20, fontWeight: '800', color: TEXT_PRIMARY },
  handle: { marginTop: 4, fontSize: 13, color: TEXT_MUTED, textAlign: 'center', paddingHorizontal: 16 },

  statRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statPill: {
    minWidth: '30%',
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  statVal: { color: PURPLE_SOFT, fontSize: 16, fontWeight: '800' },
  statKey: { marginTop: 4, color: TEXT_MUTED, fontSize: 11, fontWeight: '600' },

  sectionLabel: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: GLASS_BORDER_TOP,
    borderLeftColor: 'rgba(255,255,255,0.05)',
    borderRightColor: 'rgba(255,255,255,0.02)',
    borderBottomColor: GLASS_BORDER_BOTTOM,
  },
  menuTxt: { flex: 1, paddingRight: 8 },
  menuTitle: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '700' },
  menuSub: { marginTop: 2, color: TEXT_MUTED, fontSize: 12 },
});
