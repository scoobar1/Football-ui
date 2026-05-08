import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Share,
  Dimensions,
  StatusBar,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenWithHeader } from '../../components/layout/ScreenWithHeader';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  SCREEN_PADDING_H,
} from '../../../constants/tokens';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

// ─── Card Themes ──────────────────────────────────────────────────────────────
type CardTheme = {
  id: string;
  label: string;
  borderColor: string;
  glowColor: string;
  gradientColors: readonly [string, string, string];
  accentColor: string;
  textColor: string;
  dividerColor: string;
  statLabelColor: string;
  nameColor: string;
  borderRadius: number;
  borderBottomRadius: number;
};

const CARD_THEMES: CardTheme[] = [
  {
    id: 'purple',
    label: 'Galaxy',
    borderColor: '#8B5CF6',
    glowColor: '#8B5CF6',
    gradientColors: ['#0a0a1a', '#1a1a3e', '#0a0a1a'],
    accentColor: '#FFD700',
    textColor: '#FFD700',
    dividerColor: 'rgba(139,92,246,0.4)',
    statLabelColor: '#FFD700',
    nameColor: '#FFFFFF',
    borderRadius: 24,
    borderBottomRadius: 40,
  },
  {
    id: 'gold',
    label: 'Gold',
    borderColor: '#F59E0B',
    glowColor: '#F59E0B',
    gradientColors: ['#1a1200', '#2d1f00', '#1a1200'],
    accentColor: '#F59E0B',
    textColor: '#F59E0B',
    dividerColor: 'rgba(245,158,11,0.4)',
    statLabelColor: '#F59E0B',
    nameColor: '#FFF8E1',
    borderRadius: 16,
    borderBottomRadius: 16,
  },
  {
    id: 'ice',
    label: 'Ice',
    borderColor: '#00D4FF',
    glowColor: '#00D4FF',
    gradientColors: ['#001a2e', '#002a45', '#001a2e'],
    accentColor: '#00D4FF',
    textColor: '#00D4FF',
    dividerColor: 'rgba(0,212,255,0.35)',
    statLabelColor: '#00D4FF',
    nameColor: '#E0F7FF',
    borderRadius: 12,
    borderBottomRadius: 12,
  },
  {
    id: 'fire',
    label: 'Fire',
    borderColor: '#EF4444',
    glowColor: '#EF4444',
    gradientColors: ['#1a0000', '#2d0a00', '#1a0000'],
    accentColor: '#FF6B35',
    textColor: '#FF6B35',
    dividerColor: 'rgba(239,68,68,0.4)',
    statLabelColor: '#FF6B35',
    nameColor: '#FFE4E1',
    borderRadius: 20,
    borderBottomRadius: 50,
  },
  {
    id: 'emerald',
    label: 'Emerald',
    borderColor: '#10B981',
    glowColor: '#10B981',
    gradientColors: ['#001a0f', '#002d1a', '#001a0f'],
    accentColor: '#10B981',
    textColor: '#10B981',
    dividerColor: 'rgba(16,185,129,0.35)',
    statLabelColor: '#10B981',
    nameColor: '#D1FAE5',
    borderRadius: 8,
    borderBottomRadius: 8,
  },
];

const { width } = Dimensions.get('window');
const VIDEO_SIZE = (width - 48) / 3;

const MOCK_VIDEOS = [
  { id: '1', thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195195?w=400', views: '12.5K', duration: '0:15' },
  { id: '2', thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400', views: '8.2K', duration: '0:30' },
  { id: '3', thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400', views: '15.1K', duration: '0:45' },
];

// ─── FIFA Card Component ───────────────────────────────────────────────────────
function FifaCard({ theme, cardRef }: { theme: CardTheme; cardRef?: React.RefObject<View> }) {
  return (
    <View
      ref={cardRef}
      style={[
        cardStyles.container,
        {
          borderColor: theme.borderColor,
          shadowColor: theme.glowColor,
          borderRadius: theme.borderRadius,
          borderBottomLeftRadius: theme.borderBottomRadius,
          borderBottomRightRadius: theme.borderBottomRadius,
        },
      ]}
    >
      <LinearGradient
        colors={theme.gradientColors}
        style={[
          cardStyles.content,
          {
            borderRadius: theme.borderRadius - 4,
            borderBottomLeftRadius: theme.borderBottomRadius - 4,
            borderBottomRightRadius: theme.borderBottomRadius - 4,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Text style={[cardStyles.position, { color: theme.accentColor }]}>ST</Text>
        <Text style={cardStyles.flag}>🇪🇸</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400' }}
          style={cardStyles.playerImg}
          resizeMode="cover"
        />
        <View style={[cardStyles.statsRow1, { borderBottomColor: theme.dividerColor }]}>
          <View style={cardStyles.stat}>
            <Text style={[cardStyles.statLabel, { color: theme.statLabelColor }]}>AGE</Text>
            <Text style={[cardStyles.statVal, { color: theme.textColor }]}>31</Text>
          </View>
          <View style={[cardStyles.divider, { backgroundColor: theme.dividerColor }]} />
          <View style={cardStyles.stat}>
            <Text style={[cardStyles.statLabel, { color: theme.statLabelColor }]}>HGT</Text>
            <Text style={[cardStyles.statVal, { color: theme.textColor }]}>175</Text>
          </View>
        </View>
        <View style={cardStyles.statsRow2}>
          <View style={cardStyles.stat}>
            <Text style={[cardStyles.statLabel, { color: theme.statLabelColor }]}>WGT</Text>
            <Text style={[cardStyles.statVal, { color: theme.textColor }]}>71</Text>
          </View>
          <View style={[cardStyles.divider, { backgroundColor: theme.dividerColor }]} />
          <View style={cardStyles.stat}>
            <Text style={[cardStyles.statLabel, { color: theme.statLabelColor }]}>FOOT</Text>
            <Text style={[cardStyles.statValSmall, { color: theme.textColor }]}>LEFT</Text>
          </View>
        </View>
        <Text style={[cardStyles.playerName, { color: theme.nameColor }]}>MOHAMED</Text>
      </LinearGradient>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    width: 260,
    overflow: 'hidden',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 20,
  },
  content: {
    paddingTop: 22,
    paddingHorizontal: 22,
    paddingBottom: 22,
    alignItems: 'center',
  },
  position: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 8,
  },
  flag: {
    fontSize: 22,
    marginBottom: 14,
  },
  playerImg: {
    width: 170,
    height: 170,
    borderRadius: 14,
    marginBottom: 14,
  },
  statsRow1: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  statsRow2: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 12,
  },
  stat: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 38 },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: 1,
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
  },
  statValSmall: {
    fontSize: 15,
    fontWeight: '900',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
});

export default function ProfileHubScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'videos' | 'saved' | 'analytics'>('videos');
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(CARD_THEMES[0].id);
  const cardRef = useRef<View>(null);

  const selectedTheme = CARD_THEMES.find(t => t.id === selectedThemeId) ?? CARD_THEMES[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out my profile on 90Plus! 🔥\n@user_duy0dct5',
        title: 'Share Profile',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleShareCard = async () => {
    setShowCardModal(true);
  };

  const captureAndShareCard = async () => {
    try {
      if (cardRef.current) {
        const uri = await captureRef(cardRef, {
          format: 'png',
          quality: 1,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Success', 'Card saved!');
        }
      }
    } catch (error) {
      console.log('Capture error:', error);
      Alert.alert('Error', 'Failed to capture card');
    } finally {
      setShowCardModal(false);
    }
  };

  const handleUploadVideo = () => {
    console.log('Upload video');
  };

  return (
    <ScreenWithHeader
      showBottomNav={true}
      showGreeting={false}
      userName="محمد"
      coins={280}
      notificationCount={1}
    >
      <StatusBar barStyle="light-content" />
        {/* Coins Badge */}
        <View style={styles.coinsBadge}>
          <Ionicons name="flash" size={16} color="#FFD700" />
          <Text style={styles.coinsText}>280</Text>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <TouchableOpacity style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=300' }}
              style={styles.avatar}
            />
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* User Info */}
          <Text style={styles.username}>محمد sh</Text>
          <Text style={styles.userHandle}>@user_duy0dct5</Text>

          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#00D4FF" />
            <Text style={styles.locationText}>Spain</Text>
          </View>

          {/* Add Accounts Button */}
          <TouchableOpacity style={styles.addAccountButton}>
            <Ionicons name="add-circle-outline" size={18} color="#888" />
            <Text style={styles.addAccountText}>Add your accounts</Text>
          </TouchableOpacity>

          {/* Bio */}
          <Text style={styles.bioText}>Add a bio about you...</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadVideo}>
            <Ionicons name="add-circle-outline" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Upload Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cardButton} onPress={handleShareCard}>
            <Ionicons name="card" size={18} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            onPress={() => setActiveTab('videos')}
          >
            <Ionicons 
              name="grid-outline" 
              size={20} 
              color={activeTab === 'videos' ? '#00D4FF' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
              Videos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Ionicons 
              name="bookmark-outline" 
              size={20} 
              color={activeTab === 'saved' ? '#00D4FF' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
              Saved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
            onPress={() => setActiveTab('analytics')}
          >
            <Ionicons 
              name="stats-chart-outline" 
              size={20} 
              color={activeTab === 'analytics' ? '#00D4FF' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
              Analytics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Video Grid */}
        {activeTab === 'videos' && (
          <View style={styles.videoGrid}>
            {MOCK_VIDEOS.map((video) => (
              <TouchableOpacity 
                key={video.id} 
                style={styles.videoItem}
                activeOpacity={0.9}
              >
                <Image 
                  source={{ uri: video.thumbnail }} 
                  style={styles.videoThumbnail}
                />
                <View style={styles.videoOverlay}>
                  <Ionicons name="play" size={12} color="#FFF" />
                  <Text style={styles.videoViews}>{video.views}</Text>
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'saved' && (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={48} color="#444" />
            <Text style={styles.emptyStateText}>No saved videos yet</Text>
          </View>
        )}

        {activeTab === 'analytics' && (
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={48} color="#444" />
            <Text style={styles.emptyStateText}>Analytics coming soon</Text>
          </View>
        )}

        <View style={{ height: 20 }} />

      {/* FIFA Card Modal */}
      <Modal
        visible={showCardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            <Text style={styles.modalTitle}>Share Your FIFA Card</Text>
            <Text style={styles.modalSubtitle}>Choose a card style</Text>

            {/* Card Preview */}
            <View style={styles.cardPreviewArea}>
              <FifaCard theme={selectedTheme} cardRef={cardRef} />
            </View>

            {/* Theme Picker */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.themePickerContent}
              style={styles.themePicker}
            >
              {CARD_THEMES.map((theme) => {
                const isActive = theme.id === selectedThemeId;
                return (
                  <TouchableOpacity
                    key={theme.id}
                    onPress={() => setSelectedThemeId(theme.id)}
                    style={[
                      styles.themeChip,
                      { borderColor: theme.borderColor },
                      isActive && { backgroundColor: theme.borderColor },
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.themeColorDot, { backgroundColor: theme.borderColor }]} />
                    <Text style={[styles.themeChipLabel, isActive && styles.themeChipLabelActive]}>
                      {theme.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCardModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalShareButton, { backgroundColor: selectedTheme.borderColor }]}
                onPress={captureAndShareCard}
              >
                <Ionicons name="share-outline" size={18} color="#FFF" />
                <Text style={styles.modalShareText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWithHeader>
  );
}

const styles = StyleSheet.create({
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    marginBottom: 16,
    marginLeft: SCREEN_PADDING_H,
  },
  coinsText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 4,
  },
  
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: SCREEN_PADDING_H,
  },
  
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00D4FF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00D4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0A0812',
  },
  
  username: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#00D4FF',
    fontWeight: '600',
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  addAccountText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: SCREEN_PADDING_H,
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00D4FF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cardButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: SCREEN_PADDING_H,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    marginHorizontal: SCREEN_PADDING_H,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 2,
    paddingHorizontal: SCREEN_PADDING_H,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00D4FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#00D4FF',
    fontWeight: '700',
  },
  
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    paddingHorizontal: SCREEN_PADDING_H,
    marginTop: 2,
  },
  videoItem: {
    width: VIDEO_SIZE,
    height: VIDEO_SIZE * 1.4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoViews: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  durationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0f0d1a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 24,
    fontWeight: '500',
  },
  cardPreviewArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  themePicker: {
    width: '100%',
    marginBottom: 24,
  },
  themePickerContent: {
    paddingHorizontal: 4,
    gap: 10,
    flexDirection: 'row',
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  themeColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  themeChipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_MUTED,
  },
  themeChipLabelActive: {
    color: '#FFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalShareButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  modalShareText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  // Legacy card styles (kept for reference, no longer used in modal)
  modalContent: { alignItems: 'center' },
  cardWrapper: { marginBottom: 24, alignItems: 'center' },
  cardContainer: { width: 280, borderRadius: 24, overflow: 'hidden', borderWidth: 4, borderColor: '#8B5CF6' },
  shieldBorder: {},
  cardContent: { paddingTop: 25, paddingHorizontal: 25, paddingBottom: 25, alignItems: 'center' },
  position: { fontSize: 32, fontWeight: '900', color: '#FFD700', letterSpacing: 3, marginBottom: 10 },
  flag: { fontSize: 24, marginBottom: 16 },
  playerImg: { width: 180, height: 180, borderRadius: 16, marginBottom: 16 },
  statsRow1: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.3)' },
  statsRow2: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, marginBottom: 14 },
  stat: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(139,92,246,0.4)' },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#FFD700', marginBottom: 4, letterSpacing: 1 },
  statVal: { fontSize: 24, fontWeight: '900', color: '#FFD700' },
  statValSmall: { fontSize: 16, fontWeight: '900', color: '#FFD700' },
  playerNameCard: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: 3, textAlign: 'center' },
});
