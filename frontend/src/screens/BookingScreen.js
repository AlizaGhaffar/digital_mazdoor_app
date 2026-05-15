import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CheckCircle, Calendar, Clock, MapPin, DollarSign, ChevronRight } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';

export default function BookingScreen({ navigation }) {
  const { currentBooking } = useGlobalState();
  const provider = currentBooking?.provider;

  if (!provider) {
    return (
      <View style={styles.container}>
        <Text>Loading booking details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.successHeader}>
        <View style={styles.successCircle}>
          <CheckCircle size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>Your service is scheduled successfully.</Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Service Details</Text>
        
        <View style={styles.row}>
          <Calendar size={18} color="#4A90E2" />
          <View style={styles.rowContent}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>May 16, 2026</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Clock size={18} color="#4A90E2" />
          <View style={styles.rowContent}>
            <Text style={styles.label}>Estimated Time</Text>
            <Text style={styles.value}>11:00 AM - 12:30 PM</Text>
          </View>
        </View>

        <View style={styles.row}>
          <MapPin size={18} color="#4A90E2" />
          <View style={styles.rowContent}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{provider.location.neighborhood}, Karachi</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Provider Info</Text>
        <View style={styles.providerInfo}>
          <View style={styles.providerAvatar}>
            <Text style={styles.avatarText}>{provider.full_name.charAt(0)}</Text>
          </View>
          <View style={styles.providerDetails}>
            <Text style={styles.providerNameText}>{provider.full_name}</Text>
            <Text style={styles.providerServiceText}>{provider.service_type}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Estimated Price</Text>
          <Text style={styles.priceValue}>Rs. {provider.base_rate}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyButtonText}>View Booking History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  successHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#48BB78',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  rowContent: {
    marginLeft: 15,
  },
  label: {
    fontSize: 12,
    color: '#A0AEC0',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 15,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  providerDetails: {
    flex: 1,
  },
  providerNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  providerServiceText: {
    fontSize: 14,
    color: '#718096',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    color: '#4A5568',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  homeButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  historyButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
});
