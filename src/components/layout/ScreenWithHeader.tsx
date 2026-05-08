import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, APP_HEADER_HEIGHT } from '../common/AppHeader';
import BottomNav from '../BottomNav';

interface ScreenWithHeaderProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showGreeting?: boolean;
  userName?: string;
  coins?: number;
  notificationCount?: number;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
}

export function ScreenWithHeader({
  children,
  showBottomNav = true,
  showGreeting = true,
  userName = 'Alex',
  coins = 80,
  notificationCount = 0,
  scrollable = true,
  contentContainerStyle,
}: ScreenWithHeaderProps) {
  const insets = useSafeAreaInsets();
  const headerOffset = insets.top + APP_HEADER_HEIGHT + 2;
  const NAV_BOTTOM_PADDING = showBottomNav ? Math.max(insets.bottom, 16) + 56 + 24 : 20;

  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: headerOffset + 14,
          paddingBottom: NAV_BOTTOM_PADDING,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, { paddingTop: headerOffset + 14 }]}>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      {content}
      
      <AppHeader
        notificationCount={notificationCount}
        coins={coins}
        userName={userName}
        showGreeting={showGreeting}
      />
      
      {showBottomNav && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0812',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
});
