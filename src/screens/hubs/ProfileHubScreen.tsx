import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MainShell } from '../../components/shell/MainShell';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
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
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195195?auto=format&fit=crop&w=1400&q=80' }}
        style={styles.heroShell}
        imageStyle={styles.heroShellImage}
      >
        <LinearGradient
          colors={['rgba(10,8,18,0.18)', 'rgba(10,8,18,0.7)', 'rgba(10,8,18,0.95)']}
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
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=300&q=80' }}
              style={styles.avatarInner}
            />
          </LinearGradient>
          <Text style={styles.name}>Alex • Active player</Text>
          <Text style={styles.handle}>@alex_90plus · Member since Oct 2025</Text>
        </View>
      </ImageBackground>

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
    marginBottom: 20,
    borderRadius: RADIUS_LG,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER_ARENA,
  },
  heroShellImage: { opacity: 0.95 },
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
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
  },

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
    backgroundColor: 'rgba(17,13,28,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    backgroundColor: 'rgba(17,13,28,0.88)',
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
