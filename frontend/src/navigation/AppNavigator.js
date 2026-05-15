import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Screens (To be created)
import HomeScreen from '../screens/HomeScreen';
import RequestScreen from '../screens/RequestScreen';
import ResultsScreen from '../screens/ResultsScreen';
import TraceScreen from '../screens/TraceScreen';
import BookingScreen from '../screens/BookingScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#E2E8F0',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#2D3748',
          },
          headerTintColor: '#4A90E2',
        }}
      >
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
