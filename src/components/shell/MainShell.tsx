import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import BottomNav from '../BottomNav';
import { Colors, Gradients, Spacing, FontSize, FontWeight, Layout } from '../../../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  /** When set, shows a back control above the title (stack sub-screens). */
  onBackPress?: () => void;
};

export function MainShell({ title, subtitle, children, onBackPress }: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 16) + 56 + 32;
  const topPad = insets.top + 12;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[...Gradients.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[...Gradients.backgroundLocations]}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: topPad,
          paddingHorizontal: Layout.screenPaddingH,
          paddingBottom: bottomPad + Layout.sectionGap,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          {onBackPress ? (
            <TouchableOpacity
              onPress={onBackPress}
              hitSlop={12}
              activeOpacity={0.75}
              style={styles.backRow}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ChevronLeft color={Colors.textMuted} size={22} strokeWidth={2.2} />
              <Text style={styles.backTxt}>Back</Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgBase },
  scroll: { flex: 1 },
  head: {
    marginBottom: Layout.sectionGap - 4,
    alignItems: 'flex-start',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: Spacing.md,
    marginLeft: -4,
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  backTxt: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: -0.45,
    textAlign: 'left',
    lineHeight: 28,
    maxWidth: '100%',
  },
  subtitle: {
    marginTop: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textMuted,
    lineHeight: 18,
    textAlign: 'left',
    maxWidth: '100%',
    opacity: 0.9,
  },
});
