import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  rightElement?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionLabel = 'View All',
  onActionPress,
  rightElement,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rightElement ? (
        rightElement
      ) : onActionPress ? (
        <TouchableOpacity style={styles.actionBtn} onPress={onActionPress}>
          <Text style={styles.actionLabel}>{actionLabel} &gt;</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  actionLabel: {
    color: '#A855F7',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default SectionHeader;