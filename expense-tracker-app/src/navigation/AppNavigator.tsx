import { createBottomTabNavigator, } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import TabIcon from '../components/TabIcon';
import Create from '../screens/Create';
import Home from '../screens/Home';
import Insights from '../screens/Insights';
import Profile from '../screens/Profile';
import { COLORS } from '../utils/colors';
import { homeActiveIcon } from '../utils/images';
import { SCREENS } from '../utils/routes';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel
      }}
    >
      <Tab.Screen name={SCREENS.Home} component={Home} options={{
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} label='home' icon={homeActiveIcon} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive
      }} />
      <Tab.Screen name={SCREENS.Create} component={Create} options={{
        tabBarIcon: ({ focused }) => <TabIcon label='create' icon={homeActiveIcon} focused={focused} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive
      }} />
      <Tab.Screen name={SCREENS.Insights} component={Insights}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label='create' icon={homeActiveIcon} focused={focused} />,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tabInactive
        }} />
    </Tab.Navigator>
  )
}


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Screen name="BottomTabs" component={AppTabs} />
      <Stack.Screen name={SCREENS.Profile} component={Profile} />
    </NavigationContainer>

  )
}

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
})

export default AppNavigator