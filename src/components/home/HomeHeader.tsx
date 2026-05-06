import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings, Search, Bell } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  PURPLE_PRIMARY, GOLD_PRIMARY, TEXT_PRIMARY,
} from '../../../constants/tokens';

interface HomeHeaderProps {
  notificationCount?: number;
  coins?: number;
}

export function HomeHeader({ notificationCount = 0, coins = 0 }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Glass blur — allowed in header per steering rules */}
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      {/* Mandatory fallback overlay */}
      <View style={styles.fallback} />

      <View style={styles.row}>
        {/* Left side — Settings + Coins */}
        <View style={styles.leftButtons}>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            <Settings size={18} color={TEXT_PRIMARY} />
          </TouchableOpacity>

          {/* Coins Badge — جنب ترس الإعدادات */}
          <View style={styles.coinsBadge}>
            <Text style={styles.coinsIcon}>⚡</Text>
            <Text style={styles.coinsText}>{coins.toLocaleString()}</Text>
          </View>
        </View>

        {/* Right buttons — Search + Bell */}
        <View style={styles.rightButtons}>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            <Search size={17} color={TEXT_PRIMARY} />
          </TouchableOpacity>

          <View>
            <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
              <Bell size={17} color={TEXT_PRIMARY} />
            </TouchableOpacity>

            {/* Notification badge */}
            {notificationCount > 0 && (
              <MotiView
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ type: 'timing', duration: 2000, loop: true }}
                style={styles.notifBadge}
              >
                <Text style={styles.notifText}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </MotiView>
            )}
          </View>
        </View>
      </View>

      {/* Bottom border — blue→purple gradient line */}
      <LinearGradient
        colors={['transparent', 'rgba(59,130,246,0.3)', 'rgba(124,58,237,0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.borderGradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'hidden',
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,10,20,0.65)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },

  // ── Left side — Settings + Coins ────────────────────────────────────────────
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // ── Icon buttons ────────────────────────────────────────────────────────────
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 0,
  },

  // ── Coins badge — compact pill ───────────────────────────────────────────────
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    maxWidth: 110,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: 'rgba(212,160,23,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.5)',
  },
  coinsIcon: {
    fontSize: 14,
    lineHeight: 16,
  },
  coinsText: {
    color: GOLD_PRIMARY,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // ── Right buttons ────────────────────────────────────────────────────────────
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // ── Notification badge ───────────────────────────────────────────────────────
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: PURPLE_PRIMARY,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    // Purple + blue layered glow
    shadowColor: PURPLE_PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
  },
  notifText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },

  // ── Bottom gradient border ───────────────────────────────────────────────────
  borderGradient: {
    height: 1,
  },
});
