import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Share,
  Pressable,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { X, Share2 } from 'lucide-react-native';
import { MomentTradingCard, type MomentTradingCardData } from './MomentTradingCard';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  GOLD_PRIMARY,
  BG_BASE,
} from '../../../constants/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
  card: MomentTradingCardData | null;
};

export function MomentsShareModal({ visible, onClose, card }: Props) {
  const { width: windowW } = useWindowDimensions();
  const posterMaxWidth = Math.min(280, windowW - 56);

  const shareCard = async () => {
    if (!card) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const line = `Watch my moment on 90Plus: ${card.title} · ${card.momentScore} hype · ${card.duration ?? 'clip'}`;
      await Share.share({
        title: `${card.title} · 90Plus`,
        message: line,
      });
    } catch {
      /* user dismissed share sheet */
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <LinearGradient colors={[BG_BASE, '#120e1c']} style={StyleSheet.absoluteFill} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollPad}
          >
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Share as card</Text>
              <Text style={styles.sheetSub}>Your clip exports inside a highlight-card frame.</Text>
              <TouchableOpacity hitSlop={12} onPress={onClose} style={styles.closeBtn}>
                <X size={22} color={TEXT_MUTED} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {card ? (
              <View style={styles.preview}>
                <MomentTradingCard data={card} variant="poster" posterMaxWidth={posterMaxWidth} />
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.shareBtn, !card && styles.shareBtnDisabled]}
              onPress={shareCard}
              disabled={!card}
            >
              <LinearGradient
                colors={[GOLD_PRIMARY, '#d4a017']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shareGrad}
              >
                <Share2 size={20} color="#0c0a12" strokeWidth={2.4} />
                <Text style={styles.shareBtnTxt}>Share moment</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.hint}>
              Next: render the card as an image for Instagram Stories. Right now the sheet shares text.
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    maxHeight: '92%',
  },
  scrollPad: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 22,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  sheetHead: {
    marginBottom: 14,
    paddingRight: 36,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.4,
  },
  sheetSub: {
    marginTop: 6,
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 18,
    fontWeight: '500',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: -2,
    padding: 4,
  },
  preview: {
    alignItems: 'center',
    marginBottom: 18,
  },
  shareBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  shareBtnDisabled: {
    opacity: 0.45,
  },
  shareGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
  },
  shareBtnTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0c0a12',
    letterSpacing: -0.2,
  },
  hint: {
    fontSize: 11,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});
