import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../constants/theme';

interface RankHeaderProps {
  points?: number;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
}

export const RankHeader: React.FC<RankHeaderProps> = ({
  points = 1200,
  onMenuPress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0010" />

      {/* Menu Icon */}
      <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress}>
        <View style={styles.menuLine} />
        <View style={[styles.menuLine, { width: 18 }]} />
        <View style={styles.menuLine} />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo90}>90</Text>
        <View style={styles.plusBadge}>
          <Text style={styles.plusText}>PLUS</Text>
        </View>
      </View>

      {/* Right Actions */}
      <View style={styles.rightActions}>
        {/* Points */}
        <View style={styles.pointsContainer}>
          <Text style={styles.lightning}>⚡</Text>
          <Text style={styles.pointsText}>{points.toLocaleString()}</Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity style={styles.bellBtn} onPress={onNotificationPress}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.bgBase,
  },
  menuBtn: {
    gap: 5,
    padding: Spacing.xs,
  },
  menuLine: {
    width: 24,
    height: 2,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceGlass,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderArena,
  },
  logo90: {
    color: Colors.white,
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.black,
    letterSpacing: -1,
  },
  plusBadge: {
    backgroundColor: Colors.purplePrimary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: Spacing.xs,
  },
  plusText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceGlass,
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.borderArena,
    gap: Spacing.xs,
  },
  lightning: {
    fontSize: FontSize.base,
  },
  pointsText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  bellBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceGlass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderArena,
  },
  bellIcon: {
    fontSize: FontSize['2xl'],
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.purplePrimary,
    borderWidth: 1.5,
    borderColor: Colors.bgBase,
  },
});

export default RankHeader;