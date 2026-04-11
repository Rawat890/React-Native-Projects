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
  doctor,
} from '../../utils/images';
import ButtonWithLabel from '../../components/ButtonWithLabel';
import { fonts } from '../../utils/fonts';

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
          </View>
          <View style={styles.orderView}>
            <Text style={styles.uploadBannerOffer}>Flat 25% OFF ON MEDICINES</Text>
            <ButtonWithLabel title='ORDER NOW' backgroundColor={COLORS.blue} onPress={() => { }} containerStyle={styles.orderBtn} textStyle={styles.orderBtnText} />
          </View>
        </Animated.View>
        <View style={styles.cardsSection}>

          <View style={styles.decorStrip} />

          <Animated.View entering={FadeInRight.delay(200).duration(450)} style={styles.promoCard}>
            <View style={styles.promoLeft}>
              <Text style={styles.promoTagText}>Get the Best</Text>
              <Text style={styles.promoTitle}>Medical Service</Text>
              <Text style={styles.promoDescription}>
                Rem illum facere quo corporis Quis in saepe itaque ut quos pariatur. Qui numquam rerum hic repudiandae rerum id amet tempore nam molestias omnis qui earum voluptatem!
              </Text>
            </View>
            <Image source={doctor} style={styles.doctorImage} resizeMode="contain" />
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(320).duration(450)} style={styles.offerCard}>
            <View style={styles.offerLeft}>
              <View style={styles.offerLabelRow}>
                <View style={styles.uptoBox}>
                  <Text style={[styles.uptoText, { transform: [{ rotate: '-90deg' }] }]}>O</Text>
                  <Text style={[styles.uptoText, { transform: [{ rotate: '-90deg' }] }]}>T</Text>
                  <Text style={[styles.uptoText, { transform: [{ rotate: '-90deg' }] }]}>P</Text>
                  <Text style={[styles.uptoText, { transform: [{ rotate: '-90deg' }] }]}>U</Text>
                </View>
                <View>
                  <Text style={styles.offerPercent}>80 %</Text>
                  <Text style={styles.offerSub}>offer</Text>
                </View>
              </View>
              <Text style={styles.offerDesc}>On Health Products</Text>
              <Pressable style={styles.shopBtn}>
                <Text style={styles.shopBtnText}>SHOP NOW</Text>
              </Pressable>
            </View>
            <Image source={medicineIcon} style={styles.offerImage} resizeMode="contain" />
          </Animated.View>

        </View>

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
    gap: scale(5),
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
    fontSize: scale(16),
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: fonts.balooMedium
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
    fontSize: scale(16),
    fontFamily: fonts.balooExtraBold,
    color: COLORS.heading,
    letterSpacing: 0.8,
    marginBottom: scale(4),
  },
  uploadBannerSub: {
    fontSize: scale(12),
    color: COLORS.textSecondary,
    lineHeight: scale(16),
    marginBottom: scale(8),
    fontFamily: fonts.balooMedium,
  },
  uploadBannerOffer: {
    fontSize: scale(12),
    fontFamily: fonts.balooExtraBold,
    width: '40%',
    color: COLORS.heading,
  },
  orderBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.light,
    shadowOpacity: 0.06,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: scale(2) },
  },
  orderBtnText: {
    color: COLORS.white,
    fontSize: scale(14),
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: fonts.balooExtraBold
  },
  promoLeft: {
    flex: 1,
    width: '90%'
  },
  promoTagText: {
    fontSize: scale(16),
    fontFamily: fonts.balooExtraBold,
    color: COLORS.heading,
    marginBottom: scale(2),
  },
  promoTitle: {
    fontSize: scale(20),
    fontFamily: fonts.balooExtraBold,
    color: COLORS.heading,
    marginBottom: scale(8),
  },
  promoDescription: {
    fontSize: scale(12),
    color: COLORS.textSecondary,
    lineHeight: scale(17),
    fontFamily: fonts.balooMedium,
  },
  promoImage: {
    width: scale(100),
    height: scale(110),
  },
  doctorImage: {
    width: scale(100),
    height: scale(130),
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
    borderRadius: scale(3),
    marginRight: scale(2),
    width: scale(20),
    height: scale(100),
    marginTop: scale(10)
  },
  uptoText: {
    color: COLORS.black,
    fontSize: scale(13),
    textAlign: 'center',
    fontFamily: fonts.balooExtraBold
  },
  offerPercent: {
    fontSize: scale(30),
    fontFamily: fonts.balooExtraBold,
    color: COLORS.heading,
    lineHeight: scale(36),
  },
  offerSub: {
    fontFamily: fonts.balooExtraBold,
    fontSize: scale(18),
    color: COLORS.heading,
    marginBottom: scale(4),
  },
  offerDesc: {
    fontSize: scale(16),
    fontFamily: fonts.balooBold,
    color: COLORS.heading,
    marginLeft: scale(15),
    marginBottom: scale(10),
    marginTop: scale(-15)
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingVertical: scale(9),
    paddingHorizontal: scale(18),
    borderRadius: scale(8),
    elevation: 3,
    shadowColor: COLORS.light,
    shadowOpacity: 0.06,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: scale(2) },
  },
  shopBtnText: {
    color: COLORS.white,
    fontSize: scale(14),
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: fonts.balooExtraBold
  },
  offerImage: {
    width: scale(110),
    height: scale(110),
  },
  orderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardsSection: {
    position: 'relative',
    marginBottom: scale(16),
  },

  decorStrip: {
    position: 'absolute',
    left: -scale(16),
    top: scale(120),
    width: scale(148),
    height: scale(140),
    backgroundColor: COLORS.pink,
    borderTopRightRadius: scale(12),
    borderBottomRightRadius: scale(12),
    zIndex: 0,
  },
  promoCard: {
    borderRadius: scale(14),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    backgroundColor: COLORS.lightGreen,
    zIndex: 1,
  },
  offerCard: {
    borderRadius: scale(14),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D8D8F0',
    marginBottom: scale(16),
    zIndex: 1,
  },

});

export default HomeScreen;