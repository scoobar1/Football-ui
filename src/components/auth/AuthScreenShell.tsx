import React from 'react';
import {
  View,
  ImageBackground,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthHeroBlock } from './AuthHeroBlock';
import { AUTH_PANEL_BG } from './AuthTokens';
import { BG_BASE, TEXT_PRIMARY } from '../../../constants/tokens';

const HERO_IMG = require('../../../assets/images/auth-hero.png');

type Props = {
  heroMode?: 'full' | 'compact' | 'none';
  children: React.ReactNode;
};

export function AuthScreenShell({ heroMode = 'full', children }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const imgH = Math.min(height * 0.42, 320);
  const shadowBandTop = Math.max(0, imgH - 72);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.photoSlot, { height: imgH }]}>
        <ImageBackground source={HERO_IMG} style={styles.bgimg} resizeMode="cover">
          <LinearGradient
            colors={['rgba(11,11,21,0.15)', 'rgba(11,11,21,0.55)', 'rgba(6,5,14,1)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>
      </View>

      <LinearGradient
        colors={[`${BG_BASE}00`, BG_BASE]}
        locations={[0, 0.12]}
        style={[styles.shadowBand, { top: shadowBandTop }]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
            hitSlop={16}
            style={[styles.close, { top: Math.max(insets.top, 8) }]}
          >
            <View style={styles.closeInner}>
              <X color={TEXT_PRIMARY} size={20} strokeWidth={2} />
            </View>
          </Pressable>

          {heroMode !== 'none' ? (
            <AuthHeroBlock compact={heroMode === 'compact'} />
          ) : (
            <View style={{ height: 8 }} />
          )}

          <View style={[styles.panel, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_BASE },
  photoSlot: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 },
  bgimg: { flex: 1, width: '100%', height: '100%' },
  shadowBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 120,
    zIndex: 0,
  },
  keyboard: { flex: 1, zIndex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 52 },
  close: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  closeInner: { justifyContent: 'center', alignItems: 'center' },
  panel: {
    flex: 1,
    marginTop: 12,
    backgroundColor: AUTH_PANEL_BG,
    borderRadius: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
