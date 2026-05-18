import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';
import { useTheme } from '../store/ThemeContext';

export default function BookingScreen({ navigation }) {
  const { currentBooking } = useGlobalState();
  const { colors } = useTheme();
  
  const provider = currentBooking?.provider;

  if (!provider) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading booking details...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.successHeader}>
        <View style={[styles.successCircle, { backgroundColor: colors.success }]}>
          <CheckCircle size={48} color="#FFFFFF" />
        </View>
        <Text style={[styles.successTitle, { color: colors.text }]}>Booking Confirmed!</Text>
        <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>Your service is scheduled successfully.</Text>
      </View>

      <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Details</Text>
        
        <View style={styles.row}>
          <View style={[styles.iconBg, { backgroundColor: colors.inputBg }]}>
             <Calendar size={20} color={colors.primary} />
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
            <Text style={[styles.value, { color: colors.text }]}>May 16, 2026</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.iconBg, { backgroundColor: colors.inputBg }]}>
             <Clock size={20} color={colors.primary} />
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Estimated Time</Text>
            <Text style={[styles.value, { color: colors.text }]}>11:00 AM - 12:30 PM</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.iconBg, { backgroundColor: colors.inputBg }]}>
             <MapPin size={20} color={colors.primary} />
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Location</Text>
            <Text style={[styles.value, { color: colors.text }]}>{provider.location.neighborhood}, Karachi</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Provider Info</Text>
        <View style={styles.providerInfo}>
          <View style={[styles.providerAvatar, { backgroundColor: colors.primary }]}>
             <User size={24} color="#FFF" />
          </View>
          <View style={styles.providerDetails}>
            <Text style={[styles.providerNameText, { color: colors.text }]}>{provider.full_name}</Text>
            <Text style={[styles.providerServiceText, { color: colors.textSecondary }]}>{provider.service_type}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Estimated Price</Text>
          <Text style={[styles.priceValue, { color: colors.primary }]}>Rs. {provider.base_rate}</Text>
        </View>
      </View>

      <View style={styles.bottomActions}>
         <TouchableOpacity 
            style={[styles.homeButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Home')}
         >
            <Text style={[styles.homeButtonText, { color: colors.buttonText }]}>Back to Home</Text>
         </TouchableOpacity>

         <TouchableOpacity 
            style={[styles.historyButton, { backgroundColor: colors.inputBg }]}
            onPress={() => navigation.navigate('History')}
         >
            <Text style={[styles.historyButtonText, { color: colors.text }]}>View Booking History</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
  },
  detailsCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    marginLeft: 16,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  providerDetails: {
    flex: 1,
  },
  providerNameText: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  providerServiceText: {
    fontSize: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  bottomActions: {
     marginTop: 40,
  },
  homeButton: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  historyButton: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
