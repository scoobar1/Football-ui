import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

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
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0a0010',
  },
  menuBtn: {
    gap: 5,
    padding: 4,
  },
  menuLine: {
    width: 24,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0030',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#3d0080',
  },
  logo90: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -1,
  },
  plusBadge: {
    backgroundColor: '#7c00ff',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  plusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0030',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3d0080',
    gap: 4,
  },
  lightning: {
    fontSize: 12,
  },
  pointsText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  bellBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a0030',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3d0080',
  },
  bellIcon: {
    fontSize: 16,
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7c00ff',
    borderWidth: 1.5,
    borderColor: '#0a0010',
  },
});

export default RankHeader;