import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalProvider } from './src/store/GlobalContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </GlobalProvider>
    </SafeAreaProvider>
  );
}

