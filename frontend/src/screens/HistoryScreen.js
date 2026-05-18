import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Clock, Info, ChevronRight, CheckCircle, Search } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';
import { useTheme } from '../store/ThemeContext';

export default function HistoryScreen({ navigation }) {
  const { history } = useGlobalState();
  const { colors, isDark } = useTheme();

  const StatusBadge = ({ status }) => {
    const isCompleted = status === 'STARTING' || status === 'Active' || status === 'SUCCESS' || status === 'CONFIRMED'; 
    
    return (
      <View style={[
        styles.statusBadge, 
        { backgroundColor: isCompleted ? colors.success + '20' : colors.warning + '20' }
      ]}>
        <Text style={[
          styles.statusText, 
          { color: isCompleted ? colors.success : colors.warning }
        ]}>
          {status || 'Unknown'}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>{item.intent?.service_type || 'General Service'}</Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>{item.workflow_id || 'ID: 20260515'}</Text>
        </View>
        <StatusBadge status={item.workflow_status} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Clock size={16} color={colors.icon} />
          <Text style={[styles.infoText, { color: colors.text }]}>Urgency: {item.intent?.urgency || 'Medium'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.icon} />
          <Text style={[styles.infoText, { color: colors.text }]}>Location: {item.location_name || 'Karachi'}</Text>
        </View>
      </View>

      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerLink, { color: colors.primary }]}>View Full AI Trace</Text>
        <ChevronRight size={18} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Search size={80} color={colors.border} style={{ marginBottom: 20 }} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Booking History</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Your agentic AI requests will appear here.</Text>
          <TouchableOpacity 
            style={[styles.startBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Request')}
          >
            <Text style={[styles.startBtnText, { color: colors.buttonText }]}>Make First Request</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Temporary import fix for MapPin (missed in initial imports)
import { MapPin } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  historyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardContent: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 40,
    lineHeight: 24,
  },
  startBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
