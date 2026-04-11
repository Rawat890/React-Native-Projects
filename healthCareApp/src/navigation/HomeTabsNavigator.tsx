import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import HomeScreen from '../screens/tabs/HomeScreen';
import NearbyPharmacyTab from '../screens/tabs/NearbyPharmacyTab';
import ReminderTab from '../screens/tabs/ReminderTab';
import { COLORS } from '../utils/colors';
import { SCREENS } from '../utils/routes';
import { scale } from 'react-native-size-matters';
import { homeActiveIcon, messageActiveIcon, uploadIcon } from '../utils/images';

const Tab = createBottomTabNavigator();
const EmptyScreen = () => null;
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

const HomeTabsNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: true,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tab.Screen
      name={SCREENS.Home}
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="home" icon={homeActiveIcon} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
      }}
    />
    <Tab.Screen
      name={SCREENS.NearBy}
      component={NearbyPharmacyTab}
      options={{
        tabBarLabel: 'Pharmacy',
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="pharmacy" icon={uploadIcon} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
      }}
    />
    <Tab.Screen
      name={SCREENS.Messages}
      component={EmptyScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            label="reminder"
            icon={messageActiveIcon}
          />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
      }}
    />
    <Tab.Screen
      name={SCREENS.Reminder}
      component={ReminderTab}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="reminder" icon={messageActiveIcon} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    height: scale(64),
    paddingBottom: scale(8),
    paddingTop: scale(6),
    shadowColor: COLORS.black,
    shadowOpacity: 0.06,
    shadowRadius: scale(12),
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  tabLabel: {
    fontSize: scale(10),
    fontWeight: '600',
  },
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

export default HomeTabsNavigator;
