import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

interface RankProfileCardProps {
  username?: string;
  tier?: string;
  level?: number;
  currentXP?: number;
  maxXP?: number;
  avatarUri?: string;
  verified?: boolean;
}

export const RankProfileCard: React.FC<RankProfileCardProps> = ({
  username = 'Ali:90+',
  tier = 'Elite Player',
  level = 18,
  currentXP = 2400,
  maxXP = 3000,
  avatarUri,
  verified = true,
}) => {
  const progress = (currentXP / maxXP) * 100;

  return (
    <View style={styles.card}>
      {/* Avatar + Info */}
      <View style={styles.leftSection}>
        <View style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {/* Purple ring */}
          <View style={styles.avatarRing} />
        </View>

        <View style={styles.infoSection}>
          {/* Name + Verified */}
          <View style={styles.nameRow}>
            <Text style={styles.username}>{username}</Text>
            {verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
          </View>

          {/* Tier */}
          <View style={styles.tierRow}>
            <Text style={styles.tierIcon}>🏅</Text>
            <Text style={styles.tierText}>{tier}</Text>
          </View>

          {/* Level + Progress */}
          <View style={styles.levelRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv. {level}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
          </View>

          {/* XP Text */}
          <Text style={styles.xpText}>
            <Text style={styles.xpCurrent}>{currentXP.toLocaleString()}</Text>
            <Text style={styles.xpDivider}> / </Text>
            <Text style={styles.xpMax}>{maxXP.toLocaleString()} XP</Text>
          </Text>
        </View>
      </View>

      {/* Shield Badge */}
      <View style={styles.shieldContainer}>
        <View style={styles.shield}>
          <Text style={styles.shieldStar}>★</Text>
        </View>
        <View style={styles.shieldLeaves}>
          <Text style={styles.leavesEmoji}>🏆</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#12001f',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2a0050',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a0050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#bf7fff',
    fontSize: 22,
    fontWeight: '700',
  },
  avatarRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#7c00ff',
  },
  infoSection: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#7c00ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tierIcon: {
    fontSize: 12,
  },
  tierText: {
    color: '#bf7fff',
    fontSize: 12,
    fontWeight: '600',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  levelBadge: {
    backgroundColor: '#7c00ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#2a0050',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7c00ff',
    borderRadius: 3,
  },
  xpText: {
    fontSize: 12,
  },
  xpCurrent: {
    color: '#7c00ff',
    fontWeight: '700',
  },
  xpDivider: {
    color: '#4a2070',
  },
  xpMax: {
    color: '#4a2070',
    fontWeight: '600',
  },
  shieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  shield: {
    width: 48,
    height: 54,
    backgroundColor: '#1a003a',
    borderWidth: 2,
    borderColor: '#7c00ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  shieldStar: {
    color: '#7c00ff',
    fontSize: 22,
  },
  shieldLeaves: {
    position: 'absolute',
    bottom: -8,
  },
  leavesEmoji: {
    fontSize: 16,
  },
});

export default RankProfileCard;