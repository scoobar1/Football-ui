import { Link, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import {
  GRADIENT_BG_COLORS,
  GRADIENT_BG_LOCATIONS,
  TEXT_PRIMARY,
  TEXT_MUTED,
  GRADIENT_CTA_PURPLE,
  BG_BASE,
  BORDER_ARENA,
  RADIUS_LG,
} from '../constants/tokens';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: false }} />
      <View style={styles.root}>
        <LinearGradient
          colors={[...GRADIENT_BG_COLORS]}
          locations={[...GRADIENT_BG_LOCATIONS]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.inner}>
          <Text style={styles.title}>This screen does not exist.</Text>
          <Text style={styles.sub}>The route may have moved — head back to the hub.</Text>

          <Link href="/home" asChild>
            <Pressable style={styles.ctaWrap}>
              <LinearGradient
                colors={[...GRADIENT_CTA_PURPLE]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cta}
              >
                <Text style={styles.ctaTxt}>Go to home</Text>
              </LinearGradient>
            </Pressable>
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_BASE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  inner: {
    maxWidth: 340,
    width: '100%',
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderRadius: RADIUS_LG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA,
    backgroundColor: 'rgba(14,11,22,0.55)',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.4,
    marginBottom: 8,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 22,
  },
  ctaWrap: {
    borderRadius: RADIUS_LG - 2,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  cta: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaTxt: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },
});
