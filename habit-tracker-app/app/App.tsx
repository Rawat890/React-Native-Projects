import React from 'react'
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App;