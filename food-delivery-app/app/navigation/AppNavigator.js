import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, RestaurantScreen } from '../screens/HomeScreen';
import { SCREENS } from '../utils/routes';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={SCREENS.Home} component={HomeScreen}/>
          <Stack.Screen name={SCREENS.Restaurant} component={RestaurantScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}