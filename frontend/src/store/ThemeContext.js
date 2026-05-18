import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@theme');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        }
      } catch (e) {
        console.error('Failed to load theme preference', e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('@theme', newTheme ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  };

  const theme = {
    isDark: isDarkMode,
    colors: isDarkMode ? darkColors : lightColors,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const lightColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  icon: '#64748B',
  inputBg: '#F1F5F9',
  buttonText: '#FFFFFF',
  bubbleAI: '#FFFFFF',
  bubbleUser: '#2563EB',
};

const darkColors = {
  background: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  primary: '#3B82F6',
  primaryLight: '#1E3A8A',
  border: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  icon: '#94A3B8',
  inputBg: '#0F172A',
  buttonText: '#FFFFFF',
  bubbleAI: '#1E293B',
  bubbleUser: '#3B82F6',
};
