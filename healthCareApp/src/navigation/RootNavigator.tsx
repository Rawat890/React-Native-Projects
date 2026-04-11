import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authService } from '../firebase/authService';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeTabsNavigator from './HomeTabsNavigator';
import { navigationRef } from '../utils/navigationService';

const Stack = createNativeStackNavigator();

type AppState = 'splash' | 'auth' | 'home';

const RootNavigator: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');

  const handleSplashFinish = () => {
    const user = authService.currentUser();
    setAppState(user ? 'home' : 'auth');
  };

useEffect(() => {
  const unsub = authService.onAuthStateChanged((user) => {
    setAppState(user ? 'home' : 'auth');
  });

  return unsub;
}, []);

  if (appState === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {appState === 'auth' ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <Stack.Screen name="HomeTabs" component={HomeTabsNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
