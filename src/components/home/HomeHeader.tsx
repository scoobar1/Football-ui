import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';
import { useRouter } from 'expo-router';
import { Settings, Search, Bell, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GOLD_PRIMARY,
  LIVE_RED,
  PURPLE_SOFT,
  TEXT_PRIMARY,
  SCREEN_PADDING_H,
} from '../../../constants/tokens';

const ICON_SIZE = 18;
const CLUSTER_PAD = 4;

interface HomeHeaderProps {
  notificationCount?: number;
  coins?: number;
  userName?: string;
}

export function HomeHeader({
  notificationCount = 0,
  coins = 0,
  userName = 'Alex',
}: HomeHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.titleBlock}>
          <Text style={styles.brand}>90PLUS</Text>
          <Text style={styles.greeting} numberOfLines={1}>
            Hi, {userName}
          </Text>
        </View>

        <View style={styles.trailing}>
          <TouchableOpacity
            activeOpacity={0.72}
            onPress={() => router.push('/profile')}
            style={styles.coins}
            accessibilityRole="button"
            accessibilityLabel="Open profile and wallet"
          >
            <Zap size={13} color={GOLD_PRIMARY} strokeWidth={2.25} />
            <Text style={styles.coinsVal}>{coins.toLocaleString()}</Text>
          </TouchableOpacity>

          <View style={styles.toolbar}>
            <TouchableOpacity
              activeOpacity={0.72}
              hitSlop={8}
              style={styles.toolBtn}
              onPress={() => router.push('/settings')}
              accessibilityLabel="Settings"
            >
              <Settings color={TEXT_PRIMARY} size={ICON_SIZE} strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.sep} />
            <TouchableOpacity
              activeOpacity={0.72}
              hitSlop={8}
              style={styles.toolBtn}
              onPress={() => router.push('/matches')}
              accessibilityLabel="Search matches"
            >
              <Search color={TEXT_PRIMARY} size={ICON_SIZE} strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.sep} />
            <View>
              <TouchableOpacity
                activeOpacity={0.72}
                hitSlop={8}
                style={styles.toolBtn}
                onPress={() => router.push('/notifications')}
                accessibilityLabel="Notifications"
              >
                <Bell color={TEXT_PRIMARY} size={ICON_SIZE} strokeWidth={2} />
              </TouchableOpacity>
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeTxt}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.hairline} />
    </View>
  );
}

export const HOME_HEADER_BODY_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(6,4,10,0.92)',
  },
  inner: {
    minHeight: HOME_HEADER_BODY_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_PADDING_H,
    gap: 10,
    paddingVertical: 6,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  brand: {
    fontSize: 10,
    fontWeight: '800',
    color: PURPLE_SOFT,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
    textAlign: 'left',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(245,197,24,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.22)',
    maxWidth: 72,
  },
  coinsVal: {
    fontSize: 12,
    fontWeight: '800',
    color: GOLD_PRIMARY,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: CLUSTER_PAD,
    paddingVertical: CLUSTER_PAD / 2,
  },
  toolBtn: {
    width: 36,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sep: {
    width: StyleSheet.hairlineWidth,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 1,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 6,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: LIVE_RED,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.45)',
  },
  badgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: SCREEN_PADDING_H,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
