import { useFonts } from 'expo-font';
import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { fonts } from './utils/fonts';

const App = () => {
  const [loaded] = useFonts({
    [fonts.balooBold]: require('../assets/fonts/BalooThambi2-Bold.ttf'),
    [fonts.balooExtraBold]: require('../assets/fonts/BalooThambi2-ExtraBold.ttf'),
    [fonts.balooMedium]: require('../assets/fonts/BalooThambi2-Medium.ttf'),
    [fonts.balooRegular]: require('../assets/fonts/BalooThambi2-Regular.ttf'),
    [fonts.balooSemi]: require('../assets/fonts/BalooThambi2-SemiBold.ttf'),
  });

  if (!loaded) return null;

  return (
    <AppNavigator />
  )
}

export default App