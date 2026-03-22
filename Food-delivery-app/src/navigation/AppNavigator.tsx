import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import { SCREENS } from '../utils/routes';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={SCREENS.Home} component={HomeScreen}/>
        <Stack.Screen name={SCREENS.MessageScreen} component={MessageScreen}/>
        <Stack.Screen name={SCREENS.ChatScreen} component={ChatScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}