import { useFonts } from 'expo-font';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { toastConfig } from './components/Notification';
import { ExpenseContextProvider } from './context/ExpenseContext';
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
    <SafeAreaProvider>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ExpenseContextProvider>
          <AppNavigator />
          <Toast config={toastConfig} />
        </ExpenseContextProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App