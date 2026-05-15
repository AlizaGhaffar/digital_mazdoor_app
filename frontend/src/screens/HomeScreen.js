import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, MapPin, Wind, Droplets, Zap, Brush, BookOpen, Clock } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';

const services = [
  { id: 'ac', name: 'AC Repair', icon: Wind, color: '#4299E1' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: '#48BB78' },
  { id: 'electric', name: 'Electrician', icon: Zap, color: '#ECC94B' },
  { id: 'painter', name: 'Painter', icon: Brush, color: '#ED64A6' },
  { id: 'tutor', name: 'Tutor', icon: BookOpen, color: '#9F7AEA' },
];

export default function HomeScreen({ navigation }) {
  const { history } = useGlobalState();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Location Header */}
        <View style={styles.locationHeader}>
          <MapPin size={20} color="#4A90E2" />
          <Text style={styles.locationText}>Gulshan-e-Iqbal, Karachi</Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Request')}
        >
          <Search size={20} color="#A0AEC0" />
          <Text style={styles.searchPlaceholder}>What service do you need?</Text>
        </TouchableOpacity>

        {/* Service Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <View style={styles.grid}>
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.card}
                onPress={() => navigation.navigate('Request', { initialService: service.name })}
              >
                <View style={[styles.iconCircle, { backgroundColor: service.color + '20' }]}>
                  <service.icon size={24} color={service.color} />
                </View>
                <Text style={styles.cardText}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        {history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            {history.slice(0, 3).map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.recentItem}
                onPress={() => navigation.navigate('History')}
              >
                <View style={styles.recentIcon}>
                  <Clock size={16} color="#4A5568" />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle}>{item.intent?.service_type || 'General Service'}</Text>
                  <Text style={styles.recentSubtitle}>{item.workflow_status} • {item.location_name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Agentic AI Orchestration</Text>
          <Text style={styles.bannerSubtitle}>Experience the future of service booking with autonomous AI agents.</Text>
        </View>
      </ScrollView>

      {/* Quick Action FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Request')}
      >
        <Search size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#A0AEC0',
    fontSize: 16,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 1,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  recentSubtitle: {
    fontSize: 12,
    color: '#718096',
  },
  banner: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 100,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bannerSubtitle: {
    color: '#E2E8F0',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4A90E2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
