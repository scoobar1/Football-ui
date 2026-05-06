import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { MainShell } from '../../components/shell/MainShell';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  SCREEN_PADDING_H,
  GRADIENT_HERO_REELS,
  GRADIENT_CTA_PURPLE,
  BORDER_ARENA,
  BORDER_ARENA_STRONG,
  RADIUS_LG,
  TAB_COLORS,
} from '../../../constants/tokens';

const { width } = Dimensions.get('window');
const CELL = (width - SCREEN_PADDING_H * 2 - 10) / 2;

const ITEMS = [
  { title: 'Skills of the week', views: '1.8M', img: 'https://images.unsplash.com/photo-1657957746418-6a38df9e1ea7?w=400' },
  { title: 'Strikes from distance', views: '920K', img: 'https://images.unsplash.com/photo-1705593973313-75de7bf95b56?w=400' },
  { title: 'Post-match vibes', views: '2.4M', img: 'https://images.unsplash.com/photo-1710788617743-8b9ed4143325?w=400' },
  { title: 'Tactical snapshots', views: '640K', img: 'https://images.unsplash.com/photo-1763656812756-3539efd3e301?w=400' },
];

const TAGS = ['All', 'Highlights', 'Skills', 'Fun', 'Analysis'];

export default function ReelsHubScreen() {
  const [tag, setTag] = React.useState(TAGS[0]);

  return (
    <MainShell
      title="Reels arena"
      subtitle="Short clips in a tight grid — highlights lane matches your tab accent."
    >
      <View style={styles.hero}>
        <LinearGradient
          colors={[...GRADIENT_HERO_REELS]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroEyebrow}>Feed desk</Text>
            <Text style={styles.heroTitle}>Curated reels · demo grid</Text>
          </View>
          <View style={styles.heroOrb}>
            <Play size={18} color={TAB_COLORS.Highlights} strokeWidth={2.4} fill={`${TAB_COLORS.Highlights}33`} />
          </View>
        </View>
      </View>

      <View style={styles.tagRow}>
        {TAGS.map((t) => {
          const on = t === tag;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTag(t)}
              style={[styles.tag, on && styles.tagOn]}
              activeOpacity={0.85}
            >
              {on ? (
                <LinearGradient
                  colors={[...GRADIENT_CTA_PURPLE]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Text style={[styles.tagTxt, on && styles.tagTxtOn]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.grid}>
        {ITEMS.map((it, i) => (
          <TouchableOpacity key={i} activeOpacity={0.9} style={[styles.tile, { width: CELL }]}>
            <Image source={{ uri: it.img }} style={styles.img} resizeMode="cover" />
            <Overlay />
            <View style={styles.playCircle}>
              <Play color="#fff" size={22} strokeWidth={2.2} fill="rgba(255,255,255,0.2)" />
            </View>
            <View style={styles.tileCap}>
              <Text numberOfLines={2} style={styles.tileTitle}>
                {it.title}
              </Text>
              <Text style={styles.tileViews}>{it.views}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </MainShell>
  );
}

function Overlay() {
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.28)' }]} />;
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: -SCREEN_PADDING_H,
    marginBottom: 16,
    paddingHorizontal: SCREEN_PADDING_H,
    paddingVertical: 14,
    borderRadius: RADIUS_LG,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroEyebrow: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.35,
  },
  heroOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA,
    backgroundColor: 'rgba(8,6,14,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tag: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA,
  },
  tagOn: {
    borderColor: 'transparent',
  },
  tagTxt: { fontSize: 12, fontWeight: '700', color: TEXT_MUTED },
  tagTxtOn: { color: TEXT_PRIMARY },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  tile: {
    aspectRatio: 0.72,
    borderRadius: RADIUS_LG,
    overflow: 'hidden',
    marginBottom: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA,
  },
  img: { ...StyleSheet.absoluteFillObject },
  playCircle: {
    position: 'absolute',
    top: '42%',
    left: '40%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA_STRONG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileCap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: 'rgba(6,5,12,0.78)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER_ARENA,
  },
  tileTitle: { color: TEXT_PRIMARY, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  tileViews: { color: TEXT_MUTED, fontSize: 11, fontWeight: '600' },
});
