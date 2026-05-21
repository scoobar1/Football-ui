import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadows } from '../../../constants/theme';

export type CompetitionType = 'predictions' | 'share' | 'quiz' | 'custom';

interface CompetitionCardProps {
  title: string;
  description: string;
  type?: CompetitionType;
  isLive?: boolean;
  iconUri?: string;
  iconEmoji?: string;
  onPress?: () => void;
}

const LiveDot = () => (
  <View style={styles.liveRow}>
    <View style={styles.liveDot} />
    <Text style={styles.liveText}>Live Now</Text>
  </View>
);

export const CompetitionCard: React.FC<CompetitionCardProps> = ({
  title,
  description,
  isLive = true,
  iconEmoji = '⚽',
  iconUri,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        {iconUri ? (
          <Image source={{ uri: iconUri }} style={styles.iconImage} />
        ) : (
          <Text style={styles.iconEmoji}>{iconEmoji}</Text>
        )}
      </View>

      {/* Content */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Live badge */}
      {isLive && <LiveDot />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.card,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderArena,
    alignItems: 'flex-start',
    gap: 6,
    minWidth: 110,
    ...Shadows.card,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceGlass,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  iconImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconEmoji: {
    fontSize: FontSize['6xl'],
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    lineHeight: 18,
  },
  description: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: 15,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.purplePrimary,
  },
  liveText: {
    color: Colors.purpleSoft,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});

export default CompetitionCard;