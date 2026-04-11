import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigation/RootNavigator';

const App: React.FC = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} style={{flex: 1}}>
      <RootNavigator />
      <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

export default App;