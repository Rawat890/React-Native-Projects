import React, { useState } from 'react';
import {
  Image, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { authService } from '../../firebase/authService';
import { reset } from '../../utils/navigationService';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../../utils/colors';
import {
  barIcon, logoIcon, medicineIcon, micIcon,
  calenderIcon, questionIcon, messageIcon,
  reminderIcon,
} from '../../utils/images';

const TOP_TABS = [
  { key: 'questions', label: 'Questions', icon: questionIcon },
  { key: 'reminders', label: 'Reminders', icon: reminderIcon },
  { key: 'messages', label: 'Messages', icon: messageIcon },
  { key: 'calendar', label: 'Calendar', icon: calenderIcon },
];

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const userName = authService.currentUser()?.displayName ?? 'User';
  const email = authService.currentUser()?.email ?? '';

  const handleSignOut = async () => {
    await authService.signOut();
    reset('Auth');
  };

  return (
    <View style={styles.root}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.menuBtn} onPress={handleSignOut}>
            <Image source={barIcon} style={styles.menuIcon} />
          </Pressable>
          <Image source={logoIcon} style={styles.logoIcon} resizeMode="contain" />
        </View>
        <Pressable style={styles.micBtn}>
          <Image source={micIcon} style={styles.micIcon} />
        </Pressable>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Top Tab Pills ── */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.topTabRow}>
          {TOP_TABS.map(t => {
            const active = activeTab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setActiveTab(t.key)}
                style={[styles.topTab, active && styles.topTabActive]}
              >
                <Text style={[styles.topTabText, active && styles.topTabTextActive]}>
                  {t.label}
                </Text>
                <Image
                  source={t.icon}
                  style={[styles.tabIcon, active && styles.tabIconActive]}
                  resizeMode="contain"
                />
              </Pressable>
            );
          })}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.uploadBanner}>
          <View style={styles.uploadBannerLeft}>
            <Text style={styles.uploadBannerTitle}>UPLOAD PRESCRIPTION</Text>
            <Text style={styles.uploadBannerSub}>
              Upload a Prescription and Tell Us What you Need. We do the Rest. !
            </Text>
            <Text style={styles.uploadBannerOffer}>Flat 25% OFF ON MEDICINES</Text>
          </View>
          <Pressable style={styles.orderBtn}>
            <Text style={styles.orderBtnText}>ORDER NOW</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInRight.delay(200).duration(450)} style={styles.promoCard}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoTagText}>Get the Best</Text>
            <Text style={styles.promoTitle}>Medical Service</Text>
            <Text style={styles.promoDesc}>
              Rem illum facere quo corporis Quis in saepe itaque ut quos pariatur. Qui numquam rerum hic repudiandae rerum id amet tempore nam molestias omnis qui earum voluptatem!
            </Text>
          </View>
          <Image source={medicineIcon} style={styles.promoImage} resizeMode="contain" />
        </Animated.View>

        {/* ── Offer Card (purple/lavender) ── */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.offerCard}>
          <View style={styles.offerLeft}>
            <View style={styles.offerLabelRow}>
              <View style={styles.uptoBox}>
                <Text style={styles.uptoText}>U{'\n'}P{'\n'}T{'\n'}O</Text>
              </View>
              <Text style={styles.offerPercent}>80 %</Text>
            </View>
            <Text style={styles.offerSub}>offer</Text>
            <Text style={styles.offerDesc}>On Health Products</Text>
            <Pressable style={styles.shopBtn}>
              <Text style={styles.shopBtnText}>SHOP NOW</Text>
            </Pressable>
          </View>
          <Image source={medicineIcon} style={styles.offerImage} resizeMode="contain" />
        </Animated.View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(32),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(14),
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },

  menuBtn: {
    padding: scale(4),
  },

  menuIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: COLORS.textSecondary,
  },

  logoIcon: {
    width: scale(80),
    height: scale(36),
  },

  micBtn: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    width: scale(22),
    height: scale(22),
    tintColor: COLORS.textSecondary,
  },
  topTabRow: {
    flexDirection: 'row',
    marginTop: scale(16),
    marginBottom: scale(16),
    gap: scale(10),
    flexWrap: 'wrap',
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    borderRadius: scale(10),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: scale(8),
    width: '47%',
  },
  topTabActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  topTabText: {
    fontSize: scale(13),
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  topTabTextActive: {
    color: COLORS.heading,
  },
  tabIcon: {
    width: scale(28),
    height: scale(28),
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  uploadBanner: {
    backgroundColor: COLORS.white,
    borderRadius: scale(14),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(16),
    shadowColor: COLORS.black,
    shadowOpacity: 0.06,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: scale(2) },
    elevation: 3,
  },
  uploadBannerLeft: {
    flex: 1,
    marginRight: scale(12),
  },
  uploadBannerTitle: {
    fontSize: scale(12),
    fontWeight: '800',
    color: COLORS.heading,
    letterSpacing: 0.8,
    marginBottom: scale(4),
  },
  uploadBannerSub: {
    fontSize: scale(11),
    color: COLORS.textSecondary,
    lineHeight: scale(16),
    marginBottom: scale(8),
  },
  uploadBannerOffer: {
    fontSize: scale(11),
    fontWeight: '700',
    color: COLORS.heading,
  },
  orderBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBtnText: {
    color: COLORS.white,
    fontSize: scale(12),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoCard: {
    borderRadius: scale(14),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
    backgroundColor: COLORS.light,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  promoLeft: {
    flex: 1,
    marginRight: scale(10),
  },

  promoTagText: {
    fontSize: scale(13),
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: scale(2),
  },

  promoTitle: {
    fontSize: scale(20),
    fontWeight: '800',
    color: COLORS.heading,
    marginBottom: scale(8),
  },

  promoDesc: {
    fontSize: scale(11),
    color: COLORS.textSecondary,
    lineHeight: scale(17),
  },

  promoImage: {
    width: scale(100),
    height: scale(110),
  },

  // ── Offer Card ────────────────────────────────────────────────
  offerCard: {
    borderRadius: scale(14),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D8D8F0', // lavender/purple from image
    marginBottom: scale(16),
  },

  offerLeft: {
    flex: 1,
  },

  offerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },

  uptoBox: {
    backgroundColor: COLORS.heading,
    paddingHorizontal: scale(3),
    paddingVertical: scale(2),
    borderRadius: scale(3),
    marginRight: scale(2),
  },

  uptoText: {
    color: COLORS.white,
    fontSize: scale(6),
    fontWeight: '800',
    lineHeight: scale(8),
    textAlign: 'center',
  },

  offerPercent: {
    fontSize: scale(30),
    fontWeight: '900',
    color: COLORS.heading,
    lineHeight: scale(36),
  },

  offerSub: {
    fontSize: scale(16),
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: scale(4),
  },

  offerDesc: {
    fontSize: scale(12),
    fontWeight: '600',
    color: COLORS.heading,
    marginBottom: scale(12),
  },

  shopBtn: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingVertical: scale(9),
    paddingHorizontal: scale(18),
    borderRadius: scale(8),
  },

  shopBtnText: {
    color: COLORS.white,
    fontSize: scale(12),
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  offerImage: {
    width: scale(110),
    height: scale(110),
  },
});

export default HomeScreen;