import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioTower, Brain, Bot } from 'lucide-react-native';
import { AUTH_ACCENT } from './AuthTokens';
import { TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY } from '../../../constants/tokens';

const FEATS = [
  { Icon: RadioTower, label: 'Live scores' },
  { Icon: Brain, label: 'Quizzes' },
  { Icon: Bot, label: 'Chat bot' },
];

export function AuthHeroBlock({ compact }: { compact?: boolean }) {
  return (
    <View style={[styles.hero, compact && styles.heroCompact]}>
      {!compact ? (
        <>
          <Text style={styles.hl1}>All Football.</Text>
          <Text style={styles.hlPurple}>One App.</Text>
          <Text style={styles.sub}>
            Live scores, breaking news, and match updates from leagues worldwide.
          </Text>
        </>
      ) : (
        <Text style={styles.loginTitle}>Login</Text>
      )}

      {!compact && (
        <View style={styles.rowFeats}>
          {FEATS.map(({ Icon, label }, i) => (
            <View style={styles.featWrap} key={label}>
              {i > 0 ? <View style={styles.sep} /> : null}
              <View style={styles.feat}>
                <View style={styles.featIcon}>
                  <Icon color={AUTH_ACCENT} size={17} strokeWidth={2} />
                </View>
                <Text style={styles.featLbl}>{label}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  heroCompact: { paddingBottom: 12 },
  hl1: {
    fontSize: 32,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -1,
    lineHeight: 38,
    textAlign: 'left',
  },
  hlPurple: {
    fontSize: 32,
    fontWeight: '800',
    color: AUTH_ACCENT,
    letterSpacing: -1,
    marginBottom: 10,
    lineHeight: 38,
    textAlign: 'left',
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_SECONDARY,
    opacity: 0.95,
    textAlign: 'left',
    maxWidth: 340,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
    textAlign: 'left',
    marginBottom: 4,
  },
  rowFeats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  featWrap: { flexDirection: 'row', alignItems: 'center' },
  sep: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  feat: {
    alignItems: 'center',
    maxWidth: 100,
    gap: 6,
  },
  featIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 13,
  },
});
