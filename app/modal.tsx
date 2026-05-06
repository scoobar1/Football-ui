import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import {
  OVERLAY_SCRIM,
  SURFACE_MODAL,
  TEXT_PRIMARY,
  TEXT_MUTED,
  GRADIENT_CTA_PURPLE,
  BORDER_ARENA,
  RADIUS_LG,
} from '../constants/tokens';

export default function ModalScreen() {
  return (
    <Modal
      animationType="fade"
      transparent
      visible
      onRequestClose={() => router.back()}
    >
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>Modal</Text>
          <Text style={styles.description}>
            Example overlay aligned with the app shell — swap copy or actions when you wire flows.
          </Text>

          <Pressable onPress={() => router.back()} style={styles.ctaOuter}>
            <LinearGradient
              colors={[...GRADIENT_CTA_PURPLE]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaInner}
            >
              <Text style={styles.ctaTxt}>Close</Text>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Pressable>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: OVERLAY_SCRIM,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: SURFACE_MODAL,
    borderRadius: RADIUS_LG,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.35,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: TEXT_MUTED,
    marginBottom: 22,
  },
  ctaOuter: {
    alignSelf: 'stretch',
    borderRadius: RADIUS_LG - 4,
    overflow: 'hidden',
  },
  ctaInner: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTxt: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },
});
