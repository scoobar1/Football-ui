import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { QuizPopup } from '../src/components/common/QuizPopup';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="login" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="forgot-password" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="home" />
        <Stack.Screen name="matches" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reels" />
        <Stack.Screen name="rank" />
        <Stack.Screen name="chat" options={{ animation: 'fade' }} />
      </Stack>
      <StatusBar style="auto" />
      
      {/* Global Quiz Popup - Shows once per session */}
      <QuizPopup initialDelay={10000} />
    </ThemeProvider>
  );
}
