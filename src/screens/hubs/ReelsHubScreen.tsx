import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
  { title: 'Skills of the week', views: '1.8M', img: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=900&q=80' },
  { title: 'Strikes from distance', views: '920K', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=80' },
  { title: 'Post-match vibes', views: '2.4M', img: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=900&q=80' },
  { title: 'Tactical snapshots', views: '640K', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80' },
];

const TAGS = ['All', 'Highlights', 'Skills', 'Fun', 'Analysis'];

export default function ReelsHubScreen() {
  const [tag, setTag] = React.useState(TAGS[0]);

  return (
    <MainShell
      title="Reels arena"
      subtitle="Short clips in a tight grid — highlights lane matches your tab accent."
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&w=1400&q=80' }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(7,5,13,0.45)', 'rgba(8,6,15,0.82)', 'rgba(8,6,15,0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroEyebrow}>Feed desk</Text>
            <Text style={styles.heroTitle}>Curated reels for your style</Text>
            <Text style={styles.heroSub}>Fresh football clips, clean grid, instant watch.</Text>
          </View>
          <View style={styles.heroOrb}>
            <Play size={18} color={TAB_COLORS.Highlights} strokeWidth={2.4} fill={`${TAB_COLORS.Highlights}33`} />
          </View>
        </View>
      </ImageBackground>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagRow}
      >
        {TAGS.map((t) => {
          const on = t === tag;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTag(t)}
              style={[styles.tag, on && styles.tagOn]}
              activeOpacity={0.85}
            >
              <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
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
      </ScrollView>

      <View style={styles.grid}>
        {ITEMS.map((it, i) => (
          <TouchableOpacity key={i} activeOpacity={0.9} style={[styles.tile, { width: CELL }]}>
            <Image source={{ uri: it.img }} style={styles.img} resizeMode="cover" />
            <BlurView intensity={10} tint="dark" style={styles.tileGlass} />
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
  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.24)', 'rgba(0,0,0,0.44)']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: RADIUS_LG,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER_ARENA,
    minHeight: 118,
    backgroundColor: 'rgba(16,12,24,0.45)',
  },
  heroImage: {
    opacity: 0.95,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
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
    fontSize: 19,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.35,
  },
  heroSub: {
    marginTop: 6,
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '600',
  },
  heroOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(9,7,16,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    paddingRight: 6,
  },
  tag: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
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
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: BORDER_ARENA,
  },
  tileGlass: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  img: { ...StyleSheet.absoluteFillObject },
  playCircle: {
    position: 'absolute',
    top: '41%',
    left: '39%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(5,5,12,0.62)',
    borderWidth: 1,
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
    backgroundColor: 'rgba(6,5,12,0.62)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.09)',
  },
  tileTitle: { color: TEXT_PRIMARY, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  tileViews: { color: TEXT_MUTED, fontSize: 11, fontWeight: '600' },
});
