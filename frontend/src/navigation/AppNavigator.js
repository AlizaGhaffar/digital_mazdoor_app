import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { ThemeContext } from '../store/ThemeContext';

// Import Screens (To be created)
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import RequestScreen from '../screens/RequestScreen';
import ResultsScreen from '../screens/ResultsScreen';
import TraceScreen from '../screens/TraceScreen';
import BookingScreen from '../screens/BookingScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { colors, isDark } = React.useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
          },
          headerTintColor: colors.primary,
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Digital Mazdoor' }}
        />
        <Stack.Screen 
          name="Request" 
          component={RequestScreen} 
          options={{ title: 'New Request' }}
        />
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen} 
          options={{ title: 'AI Analysis' }}
        />
        <Stack.Screen 
          name="Trace" 
          component={TraceScreen} 
          options={{ title: 'Reasoning Trace' }}
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen} 
          options={{ title: 'Confirmation' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{ title: 'My Bookings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
