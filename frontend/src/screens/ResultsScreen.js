import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Brain, Star, MapPin, DollarSign, CheckCircle, Info, ChevronRight } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';

export default function ResultsScreen({ navigation }) {
  const { workflowContext, setCurrentBooking } = useGlobalState();
  const intent = workflowContext?.intent || {};
  const providers = workflowContext?.ranked_providers || [];

  const handleSelectProvider = (provider) => {
    setCurrentBooking({
      provider,
      intent,
      timestamp: new Date().toISOString(),
      workflow_id: workflowContext?.workflow_id
    });
    navigation.navigate('Booking');
  };

  if (!workflowContext) {
    return (
      <View style={styles.emptyContainer}>
        <Info size={48} color="#CBD5E0" />
        <Text style={styles.emptyText}>No analysis results found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* AI Analysis Summary */}
        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <Brain size={24} color="#4A90E2" />
            <Text style={styles.cardTitle}>AI Orchestrator Analysis</Text>
          </View>
          
          <View style={styles.intentGrid}>
            <View style={styles.intentItem}>
              <Text style={styles.intentLabel}>Service</Text>
              <Text style={styles.intentValue}>{intent.service_type}</Text>
            </View>
            <View style={styles.intentItem}>
              <Text style={styles.intentLabel}>Location</Text>
              <Text style={styles.intentValue}>{intent.location_name}</Text>
            </View>
            <View style={styles.intentItem}>
              <Text style={styles.intentLabel}>Urgency</Text>
              <Text style={styles.intentValue}>{intent.urgency}</Text>
            </View>
            <View style={styles.intentItem}>
              <Text style={styles.intentLabel}>Confidence</Text>
              <Text style={[styles.intentValue, { color: intent.confidence > 0.7 ? '#48BB78' : '#ECC94B' }]}>
                {(intent.confidence * 100).toFixed(0)}%
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.traceButton}
            onPress={() => navigation.navigate('Trace')}
          >
            <Text style={styles.traceButtonText}>View AI Reasoning Trace</Text>
            <ChevronRight size={16} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {/* Recommended Providers */}
        <Text style={styles.sectionTitle}>Recommended Providers</Text>
        
        {providers.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.providerCard, index === 0 && styles.topMatch]}
            onPress={() => handleSelectProvider(item)}
          >
            {index === 0 && (
              <View style={styles.badge}>
                <CheckCircle size={12} color="#FFFFFF" />
                <Text style={styles.badgeText}>BEST MATCH</Text>
              </View>
            )}
            
            <View style={styles.providerHeader}>
              <View>
                <Text style={styles.providerName}>{item.full_name}</Text>
                <View style={styles.ratingRow}>
                  <Star size={14} color="#F6AD55" fill="#F6AD55" />
                  <Text style={styles.ratingText}>{item.rating} ({item.reliability_score}% Reliable)</Text>
                </View>
              </View>
              <Text style={styles.priceText}>Rs. {item.base_rate}</Text>
            </View>

            <View style={styles.providerFooter}>
              <View style={styles.metaItem}>
                <MapPin size={12} color="#718096" />
                <Text style={styles.metaText}>{item.location.neighborhood}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>AI Score: {item.orchestrator_score}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#718096',
    fontSize: 16,
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  intentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  intentItem: {
    width: '50%',
    marginBottom: 15,
  },
  intentLabel: {
    fontSize: 12,
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  intentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
  },
  traceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  traceButtonText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    marginRight: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 15,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topMatch: {
    borderColor: '#4A90E2',
    borderWidth: 2,
    backgroundColor: '#F0F7FF',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 15,
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
  scoreBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A5568',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
