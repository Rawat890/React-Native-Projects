import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home';
import { SCREENS } from '../utils/routes';
import CreateHabit from '../screens/CreateHabit';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
     <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={Home} name={SCREENS.Home}/>
      <Stack.Screen component={CreateHabit} name={SCREENS.CreateHabit}/>
     </Stack.Navigator>
    </NavigationContainer>
  )
}