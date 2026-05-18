import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Brain, Star, MapPin, CheckCircle, Info, ChevronRight } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';
import { useTheme } from '../store/ThemeContext';

export default function ResultsScreen({ navigation }) {
  const { workflowContext, setCurrentBooking } = useGlobalState();
  const { colors, isDark } = useTheme();
  
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
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Info size={48} color={colors.icon} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No analysis results found.</Text>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, { color: colors.buttonText }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* AI Analysis Summary */}
        <View style={[styles.analysisCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBg, { backgroundColor: colors.primaryLight }]}>
               <Brain size={24} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>AI Orchestrator Analysis</Text>
          </View>
          
          <View style={styles.intentGrid}>
            <View style={styles.intentItem}>
              <Text style={[styles.intentLabel, { color: colors.textSecondary }]}>Service</Text>
              <Text style={[styles.intentValue, { color: colors.text }]}>{intent.service_type}</Text>
            </View>
            <View style={styles.intentItem}>
              <Text style={[styles.intentLabel, { color: colors.textSecondary }]}>Location</Text>
              <Text style={[styles.intentValue, { color: colors.text }]}>{intent.location_name}</Text>
            </View>
            <View style={styles.intentItem}>
              <Text style={[styles.intentLabel, { color: colors.textSecondary }]}>Urgency</Text>
              <Text style={[styles.intentValue, { color: colors.text }]}>{intent.urgency}</Text>
            </View>
            <View style={styles.intentItem}>
              <Text style={[styles.intentLabel, { color: colors.textSecondary }]}>Confidence</Text>
              <Text style={[styles.intentValue, { color: intent.confidence > 0.7 ? colors.success : colors.warning }]}>
                {(intent.confidence * 100).toFixed(0)}%
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.traceButton, { borderTopColor: colors.border }]}
            onPress={() => navigation.navigate('Trace')}
          >
            <Text style={[styles.traceButtonText, { color: colors.primary }]}>View AI Reasoning Trace</Text>
            <ChevronRight size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Recommended Providers */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended Providers</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Ranked by AI considering distance, reliability, urgency, and pricing.
          </Text>
        </View>
        
        {providers.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.providerCard, 
              { backgroundColor: colors.card, borderColor: index === 0 ? colors.primary : colors.border }
            ]}
            onPress={() => handleSelectProvider(item)}
            activeOpacity={0.9}
          >
            {index === 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <CheckCircle size={14} color="#FFFFFF" />
                <Text style={styles.badgeText}>BEST MATCH</Text>
              </View>
            )}
            
            <View style={styles.providerHeader}>
              <View>
                <Text style={[styles.providerName, { color: colors.text }]}>{item.full_name}</Text>
                <View style={styles.ratingRow}>
                  <Star size={16} color={colors.warning} fill={colors.warning} />
                  <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{item.rating} ({item.reliability_score}% Reliable)</Text>
                </View>
              </View>
              <Text style={[styles.priceText, { color: colors.primary }]}>Rs. {item.base_rate}</Text>
            </View>

            <View style={[styles.providerFooter, { borderTopColor: colors.border }]}>
              <View style={styles.metaItem}>
                <MapPin size={16} color={colors.icon} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.location.neighborhood}</Text>
              </View>
              <View style={[styles.scoreBadge, { backgroundColor: colors.inputBg }]}>
                <Text style={[styles.scoreText, { color: colors.text }]}>AI Score: {item.orchestrator_score}</Text>
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
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  analysisCard: {
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontWeight: '800',
  },
  intentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  intentItem: {
    width: '50%',
    marginBottom: 20,
  },
  intentLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 6,
  },
  intentValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  traceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  traceButtonText: {
    fontWeight: '700',
    fontSize: 15,
    marginRight: 6,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  providerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
