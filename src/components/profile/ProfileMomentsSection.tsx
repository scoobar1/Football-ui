import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Upload,
  Sparkles,
  Image as ImageIcon,
  ChevronRight,
  Share2,
} from 'lucide-react-native';
import { MomentTradingCard, type MomentTradingCardData } from './MomentTradingCard';
import { MomentsShareModal } from './MomentsShareModal';
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  GOLD_PRIMARY,
  PURPLE_SOFT,
  BLUE_PRIMARY,
  GLASS_BORDER_TOP,
  GLASS_BORDER_BOTTOM,
} from '../../../constants/tokens';

/** Demo clips — swap with uploads later */
const DEMO_MOMENTS: MomentTradingCardData[] = [
  {
    title: 'Match day',
    subtitle: 'Derby buildup',
    imageUri:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    duration: '0:24',
    momentScore: 92,
    role: 'WIN',
    statLine: [
      ['ENG', '94'],
      ['FLW', '88'],
      ['POP', '91'],
    ],
  },
  {
    title: 'Warm‑up',
    subtitle: 'Pre-match vibe',
    imageUri:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    duration: '0:12',
    momentScore: 87,
    role: 'CLP',
    statLine: [
      ['ENG', '89'],
      ['FLW', '85'],
      ['POP', '86'],
    ],
  },
];

const CARD_W = 124;
const CARD_H = 186;

function showSoon(title: string) {
  Alert.alert(
    title,
    'This will connect to your account and backend soon — the layout is ready to wire up.',
  );
}

export function ProfileMomentsSection() {
  const router = useRouter();
  const [shareVisible, setShareVisible] = useState(false);
  const [shareCard, setShareCard] = useState<MomentTradingCardData | null>(null);

  const openShare = useCallback((card: MomentTradingCardData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShareCard(card);
    setShareVisible(true);
  }, []);

  const onUpload = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Upload video or photo', 'Pick a source once media library permissions are wired.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Photo library',
        onPress: () => showSoon('Photo library'),
      },
      {
        text: 'Record video',
        onPress: () => showSoon('Camera'),
      },
    ]);
  };

  const previewShare = () => {
    Haptics.selectionAsync();
    const first = DEMO_MOMENTS[0];
    if (first) openShare(first);
  };

  return (
    <View style={styles.wrap}>
      <MomentsShareModal
        visible={shareVisible}
        card={shareCard}
        onClose={() => setShareVisible(false)}
      />

      <View style={styles.headRow}>
        <View style={styles.headTxt}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Moments</Text>
            <View style={styles.glassBadge}>
              <Text style={styles.glassBadgeTxt}>Card share</Text>
            </View>
          </View>
          <Text style={styles.sectionSub}>
            Turn clips into a trading-card frame — tap a card to preview and share.
          </Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.88} style={styles.uploadHero} onPress={onUpload}>
        <LinearGradient
          colors={['rgba(124,58,237,0.35)', 'rgba(59,130,246,0.18)', 'rgba(6,5,14,0.92)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.uploadIconWrap}>
          <Upload size={22} color={GOLD_PRIMARY} strokeWidth={2.4} />
        </View>
        <Text style={styles.uploadTitle}>Drop a highlight</Text>
        <Text style={styles.uploadHint}>
          Your thumbnail sits inside the card frame — ready for sharing.
        </Text>
        <View style={styles.uploadCtaRow}>
          <Text style={styles.uploadCta}>Upload</Text>
          <ChevronRight size={18} color={GOLD_PRIMARY} strokeWidth={2.2} />
        </View>
      </TouchableOpacity>

      <View style={styles.quickRow}>
        <TouchableOpacity
          style={styles.quickChip}
          activeOpacity={0.85}
          onPress={previewShare}
        >
          <Share2 size={16} color={PURPLE_SOFT} strokeWidth={2.2} />
          <Text style={styles.quickChipTxt}>Share as card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickChip}
          activeOpacity={0.85}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/reels');
          }}
        >
          <Sparkles size={16} color={BLUE_PRIMARY} strokeWidth={2.2} />
          <Text style={styles.quickChipTxt}>Highlights</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickChip}
          activeOpacity={0.85}
          onPress={() => {
            Haptics.selectionAsync();
            showSoon('Screenshots');
          }}
        >
          <ImageIcon size={16} color={TEXT_MUTED} strokeWidth={2.2} />
          <Text style={styles.quickChipTxt}>Screenshots</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.stripLabel}>Your cards · demo</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stripContent}
      >
        <TouchableOpacity
          style={styles.addCardSlot}
          activeOpacity={0.85}
          onPress={onUpload}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.04)', 'rgba(124,58,237,0.06)']}
            style={StyleSheet.absoluteFill}
          />
          <Upload size={22} color={TEXT_MUTED} strokeWidth={2} />
          <Text style={styles.addCardTxt}>New card</Text>
        </TouchableOpacity>
        {DEMO_MOMENTS.map((m, idx) => (
          <MomentTradingCard
            key={`${m.title}-${idx}`}
            data={m}
            variant="carousel"
            style={styles.cardSpacing}
            onPress={() => openShare(m)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 28,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headTxt: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  glassBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(245,197,24,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,197,24,0.35)',
  },
  glassBadgeTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: GOLD_PRIMARY,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionSub: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  uploadHero: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderTopColor: GLASS_BORDER_TOP,
    borderLeftColor: 'rgba(255,255,255,0.06)',
    borderRightColor: 'rgba(255,255,255,0.03)',
    borderBottomColor: GLASS_BORDER_BOTTOM,
    marginBottom: 12,
  },
  uploadIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,197,24,0.25)',
  },
  uploadTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  uploadHint: {
    marginTop: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.48)',
    lineHeight: 17,
    maxWidth: '95%',
  },
  uploadCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 14,
  },
  uploadCta: {
    fontSize: 14,
    fontWeight: '800',
    color: GOLD_PRIMARY,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickChipTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_SECONDARY,
  },
  stripLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_MUTED,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  stripContent: {
    gap: 12,
    paddingBottom: 6,
    alignItems: 'flex-end',
  },
  addCardSlot: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(167,139,250,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  addCardTxt: {
    fontSize: 11,
    fontWeight: '900',
    color: TEXT_MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cardSpacing: {
    marginBottom: 2,
  },
});
