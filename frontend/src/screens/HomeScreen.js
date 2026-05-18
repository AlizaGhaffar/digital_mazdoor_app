import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search, MapPin, Wind, Droplets, Zap, Brush, BookOpen, Clock, Moon, Sun, ArrowRight } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';
import { useTheme } from '../store/ThemeContext';

const services = [
  { id: 'ac', name: 'AC Repair', icon: Wind, color: '#3B82F6' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: '#10B981' },
  { id: 'electric', name: 'Electrician', icon: Zap, color: '#F59E0B' },
  { id: 'painter', name: 'Painter', icon: Brush, color: '#EC4899' },
  { id: 'tutor', name: 'Tutor', icon: BookOpen, color: '#8B5CF6' },
];

export default function HomeScreen({ navigation }) {
  const { history, userLocation } = useGlobalState();
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.locationHeader}>
            <View style={[styles.locationIconBg, { backgroundColor: colors.primaryLight }]}>
               <MapPin size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Current Location</Text>
              <Text style={[styles.locationText, { color: colors.text }]}>{userLocation?.name || 'Locating...'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeToggle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {isDark ? <Sun size={20} color="#F59E0B" /> : <Moon size={20} color="#475569" />}
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.heroImage} 
          />
          <View style={[styles.heroOverlay, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(37, 99, 235, 0.8)' }]} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>AI Service Match</Text>
            <Text style={styles.heroSubtitle}>Find the perfect professional in seconds.</Text>
            <TouchableOpacity 
              style={[styles.heroButton, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('Request')}
            >
              <Text style={[styles.heroButtonText, { color: colors.primary }]}>Book Now</Text>
              <ArrowRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Request', { initialService: service.name })}
              >
                <View style={[styles.iconCircle, { backgroundColor: service.color + '20' }]}>
                  <service.icon size={28} color={service.color} />
                </View>
                <Text style={[styles.cardText, { color: colors.text }]}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        {history.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            {history.slice(0, 3).map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.recentItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('History')}
              >
                <View style={[styles.recentIcon, { backgroundColor: colors.inputBg }]}>
                  <Clock size={18} color={colors.primary} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={[styles.recentTitle, { color: colors.text }]}>{item.intent?.service_type || 'General Service'}</Text>
                  <Text style={[styles.recentSubtitle, { color: colors.textSecondary }]}>{item.workflow_status} • {item.location_name}</Text>
                </View>
                <ArrowRight size={16} color={colors.icon} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Search */}
      <View style={styles.fabContainer}>
         <TouchableOpacity 
            style={[styles.fabSearch, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Request')}
         >
            <Search size={22} color={colors.primary} />
            <Text style={[styles.fabText, { color: colors.textSecondary }]}>What do you need help with?</Text>
            <View style={[styles.fabGo, { backgroundColor: colors.primary }]}>
               <ArrowRight size={18} color="#FFF" />
            </View>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '800',
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  heroBanner: {
    width: '100%',
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 30,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#E2E8F0',
    fontSize: 14,
    marginBottom: 20,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  heroButtonText: {
    fontWeight: '700',
    marginRight: 6,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  card: {
    width: 110,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
  recentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  recentSubtitle: {
    fontSize: 13,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  fabSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 20,
    borderRadius: 30,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  fabText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  fabGo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
