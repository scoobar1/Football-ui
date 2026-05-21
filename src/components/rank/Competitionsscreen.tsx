import { ChevronDown } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';
import { SafeAreaView } from "react-native-safe-area-context";

import CompetitionCard from "./CompetitionCard";
import RankHeader from "./RankHeader";
import RankProfileCard from "./RankProfileCard";
import SectionHeader from "./SectionHeader";
import TopPlayerCard from "./TopPlayerCard";
import WorldCupCard from "./WorldCupCard";

const competitions = [
  {
    title: "King of Predictions",
    subtitle: "Predict matches and be the best!",
    // Replace with your local images: require('../assets/ball.png')
    image: { uri: "https://i.imgur.com/JvQnqg6.png" },
  },
  {
    title: "Share & Earn",
    subtitle: "Share the app and climb the rankings!",
    image: { uri: "https://i.imgur.com/xRqwwXV.png" },
  },
  {
    title: "Daily Quiz",
    subtitle: "Answer daily questions and win points!",
    image: { uri: "https://i.imgur.com/L3ZTFOJ.png" },
  },
];

const topPodium = [
  {
    name: "CR7_legend",
    xp: "11,230 XP",
    place: 2 as const,
    avatarUri: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Mo Salah",
    xp: "12,850 XP",
    place: 1 as const,
    avatarUri: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "The Goat",
    xp: "9,780 XP",
    place: 3 as const,
    avatarUri: "https://i.pravatar.cc/150?img=8",
  },
];

const extraPlayers = [
  { rank: 4, name: "NeymarJr", role: "Pro Player", xp: "8,450 XP", avatarUri: "https://i.pravatar.cc/150?img=5" },
  { rank: 5, name: "BlueLion", role: "Rising Star", xp: "7,210 XP", avatarUri: "https://i.pravatar.cc/150?img=9" },
];

export default function CompetitionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <RankHeader />

        {/* Hero Title Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.heroTitle}>Competitions</Text>
            </View>
            <Text style={styles.heroSubtitle}>Play. Compete. Win.</Text>
            <Text style={styles.heroDesc}>Join challenges and climb the ranks!</Text>
          </View>
          {/* Trophy image placeholder */}
          <Image
            source={{ uri: "https://i.imgur.com/5fDZGYr.png" }}
            style={styles.trophyImage}
            resizeMode="contain"
          />
        </View>

        {/* Profile Card */}
        <RankProfileCard />

        {/* All Competitions */}
        <SectionHeader title="All Competitions" showViewAll rightLabel="View All" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingRight: 16 }}>
          {competitions.map((item, index) => (
            <CompetitionCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
            />
          ))}
          <View style={{ width: 16 }} />
        </ScrollView>

        {/* World Cup Card */}
        <WorldCupCard />

        {/* Top Players */}
        <SectionHeader
          title="Top Players"
          rightComponent={
            <TouchableOpacity style={styles.weekButton}>
              <Text style={styles.weekText}>This Week</Text>
              <ChevronDown size={14} color="#fff" />
            </TouchableOpacity>
          }
        />

        {/* Podium */}
        <View style={styles.podiumRow}>
          {topPodium.map((player) => (
            <TopPlayerCard key={player.place} {...player} />
          ))}
        </View>

        {/* Extra Players List */}
        <View style={styles.listContainer}>
          {extraPlayers.map((player) => (
            <View key={player.rank} style={styles.listRow}>
              <Text style={styles.listRank}>{player.rank}</Text>
              <Image source={{ uri: player.avatarUri }} style={styles.listAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.listName}>{player.name}</Text>
                <Text style={styles.listRole}>{player.role}</Text>
              </View>
              <Text style={styles.listXp}>{player.xp}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05010D",
  },
  heroSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 24,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroLeft: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trophyIcon: {
    fontSize: 28,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
  },
  heroDesc: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },
  trophyImage: {
    width: 120,
    height: 140,
    marginTop: -20,
  },
  weekButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1030",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#2A1A5A",
    gap: 4,
  },
  weekText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  listContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    gap: 2,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1030",
    gap: 12,
  },
  listRank: {
    color: "#666",
    fontSize: 16,
    fontWeight: "700",
    width: 24,
    textAlign: "center",
  },
  listAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  listName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  listRole: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  listXp: {
    color: "#A855F7",
    fontWeight: "800",
    fontSize: 14,
  },
});