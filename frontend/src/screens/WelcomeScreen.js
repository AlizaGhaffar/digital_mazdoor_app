import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image } from 'react-native';
import { ArrowRight, Bot, Sparkles } from 'lucide-react-native';
import { useTheme } from '../store/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topSection}>
        <View style={styles.brandContainer}>
          <Bot size={48} color={colors.primary} style={styles.logoIcon} />
          <Text style={[styles.title, { color: colors.text }]}>Digital Mazdoor</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            AI-Powered Service Connection
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
           <Image
            source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={[styles.badge, { backgroundColor: colors.card, borderColor: colors.border }]}>
             <Sparkles size={16} color={colors.primary} />
             <Text style={[styles.badgeText, { color: colors.text }]}>Smart Matching</Text>
          </View>
        </View>
      </View>

      <View style={[styles.bottomSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Find Trusted Labour & Services Instantly</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Just tell our AI what you need in Urdu or English, and we'll connect you with the best verified professionals nearby.
        </Text>

        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryButtonText, { color: colors.buttonText }]}>Get Started</Text>
          <ArrowRight size={20} color={colors.buttonText} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
    zIndex: 10,
  },
  logoIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  illustrationContainer: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 20,
    right: -10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  bottomSection: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});
