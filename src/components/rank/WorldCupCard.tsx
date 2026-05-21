import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';

interface WorldCupCardProps {
  targetDate?: Date;
  onViewMissions?: () => void;
  backgroundUri?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

const getTimeLeft = (target: Date): TimeLeft => {
  const now = new Date().getTime();
  const diff = target.getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / 1000 / 60) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.countUnit}>
    <Text style={styles.countValue}>{String(value).padStart(2, '0')}</Text>
    <Text style={styles.countLabel}>{label}</Text>
  </View>
);

export const WorldCupCard: React.FC<WorldCupCardProps> = ({
  targetDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
  onViewMissions,
  backgroundUri,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const CardContent = () => (
    <View style={styles.cardInner}>
      {/* Left: Text + Button */}
      <View style={styles.leftContent}>
        <Text style={styles.cardTitle}>Road To World Cup</Text>
        <Text style={styles.cardDesc}>
          Complete daily missions and earn points to reach the top!
        </Text>
        <TouchableOpacity style={styles.missionsBtn} onPress={onViewMissions}>
          <Text style={styles.missionsBtnText}>View Missions  ›</Text>
        </TouchableOpacity>
      </View>

      {/* Right: Countdown */}
      <View style={styles.rightContent}>
        <Text style={styles.startsIn}>World Cup starts in</Text>
        <View style={styles.countdown}>
          <CountdownUnit value={timeLeft.days} label="Days" />
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <CountdownUnit value={timeLeft.mins} label="Mins" />
          <CountdownUnit value={timeLeft.secs} label="Secs" />
        </View>
      </View>
    </View>
  );

  if (backgroundUri) {
    return (
      <ImageBackground
        source={{ uri: backgroundUri }}
        style={styles.card}
        imageStyle={{ borderRadius: 16, opacity: 0.4 }}
      >
        <CardContent />
      </ImageBackground>
    );
  }

  return (
    <View style={styles.card}>
      {/* Background player silhouette gradient overlay */}
      <View style={styles.bgOverlay} />
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0f0020',
    borderWidth: 1,
    borderColor: '#2a0050',
    minHeight: 140,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f0020',
  },
  cardInner: {
    flexDirection: 'row',
    padding: 18,
    gap: 12,
  },
  leftContent: {
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cardDesc: {
    color: '#7a5a9a',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  missionsBtn: {
    backgroundColor: '#7c00ff',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
    shadowColor: '#7c00ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  missionsBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startsIn: {
    color: '#7a5a9a',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  countdown: {
    flexDirection: 'row',
    gap: 6,
  },
  countUnit: {
    alignItems: 'center',
    minWidth: 36,
  },
  countValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  countLabel: {
    color: '#7a5a9a',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default WorldCupCard;