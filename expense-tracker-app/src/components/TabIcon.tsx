import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../utils/colors';

const TabIcon: React.FC<{ focused: boolean; label: string, icon: any }> = ({ focused, label, icon }) => {
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.15 : 1, { damping: 12 }) }],
  }));
  return (
    <Animated.View style={[styles.tabIconWrap, animStyle]}>
      <Image source={icon} style={[styles.tabIcon, { tintColor: focused ? COLORS.primary : COLORS.tabInactive }]} />
      {focused && <View style={styles.activeIndicator} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(32),
    height: scale(32),
  },
  tabIcon: {
    width: scale(22),
    height: scale(22),
    resizeMode: 'contain',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: scale(-4),
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: COLORS.primary,
  },
});

export default TabIcon