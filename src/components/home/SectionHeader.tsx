import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PURPLE_SOFT, TEXT_PRIMARY, TEXT_MUTED } from '../../../constants/tokens';

interface SectionHeaderProps {
  icon?: string;
  title: string;
  action?: string;
  badge?: string;
  onAction?: () => void;
}

export function SectionHeader({ icon, title, action, badge, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {icon && (
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {action && (
        <TouchableOpacity activeOpacity={0.7} onPress={onAction}>
          <Text style={styles.action}>{action}</Text>
        </TouchableOpacity>
      )}

      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  // ── Icon container ───────────────────────────────────────────────────────────
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(167,139,250,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 15,
    lineHeight: 18,
  },

  // ── Title with purple text shadow ────────────────────────────────────────────
  title: {
    color: TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(124,58,237,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  action: {
    color: PURPLE_SOFT,
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(167,139,250,0.3)',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: 'rgba(167,139,250,0.9)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
