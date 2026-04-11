import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSequence, Easing, runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '../utils/colors';
import WaveLoader from '../components/WaveLoader';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const textOpacity = useSharedValue(0);
  const loaderOpacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value, transform: [{ scale: logoScale.value }] }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const loaderStyle = useAnimatedStyle(() => ({ opacity: loaderOpacity.value }));

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) });
    logoScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) });

    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));

    loaderOpacity.value = withDelay(700, withSequence(
      withTiming(1, { duration: 400 }),
      withDelay(1400, withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })),
    ));

    const timer = setTimeout(() => runOnJS(onFinish)(), 3200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoCircle, logoStyle]}>
        <Text style={styles.logoText}>Healthcare</Text>
      </Animated.View>

      <Animated.Text style={[styles.appName, textStyle]}>
        HealthCare
      </Animated.Text>
      <Animated.Text style={[styles.tagline, textStyle]}>
        Your health, our priority
      </Animated.Text>

      <Animated.View style={[styles.loaderWrapper, loaderStyle]}>
        <WaveLoader loading size={56} color={COLORS.primary} secondaryColor={COLORS.secondary} ringColor={COLORS.primary} backgroundColor={COLORS.white} />
      </Animated.View>
    </View>
  );
};

import { scale, moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.splash,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoCircle: {
    width: scale(160),
    height: scale(160),
    borderRadius: scale(75),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: scale(20),
    shadowOffset: { width: 0, height: scale(8) },

    elevation: 10,
  },

  logoText: {
    color: COLORS.white,
    fontSize: moderateScale(15),
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: scale(8),
  },

  appName: {
    fontSize: moderateScale(30),
    fontWeight: '800',
    color: COLORS.heading,
    letterSpacing: scale(0.5),
    marginBottom: scale(6),
  },

  tagline: {
    fontSize: moderateScale(13),
    color: COLORS.textSecondary,
    marginBottom: scale(48),
  },

  loaderWrapper: {
    position: 'absolute',
    bottom: scale(80),
  },
});

export default SplashScreen;