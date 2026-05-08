import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

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
    backgroundColor: '#0f0020',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a0050',
    alignItems: 'flex-start',
    gap: 6,
    minWidth: 110,
    shadowColor: '#7c00ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a0035',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconEmoji: {
    fontSize: 28,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  description: {
    color: '#7a5a9a',
    fontSize: 11,
    fontWeight: '500',
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
    backgroundColor: '#7c00ff',
  },
  liveText: {
    color: '#bf7fff',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default CompetitionCard;