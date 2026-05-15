import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Clock, CheckCircle, XCircle, Info, ChevronRight } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';

const StatusBadge = ({ status }) => {
  const isCompleted = status === 'STARTING' || status === 'Active' || status === 'SUCCESS'; // Simplified for demo
  
  return (
    <View style={[styles.statusBadge, isCompleted ? styles.statusSuccess : styles.statusPending]}>
      <Text style={[styles.statusText, isCompleted ? styles.statusTextSuccess : styles.statusTextPending]}>
        {status || 'Unknown'}
      </Text>
    </View>
  );
};

export default function HistoryScreen({ navigation }) {
  const { history } = useGlobalState();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyCard}
      onPress={() => {
        // In a real app, we would load the specific workflow traces
        // For demo, we just show the card
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{item.intent?.service_type || 'General Service'}</Text>
          <Text style={styles.dateText}>{item.workflow_id || 'ID: 20260515'}</Text>
        </View>
        <StatusBadge status={item.workflow_status} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Clock size={14} color="#718096" />
          <Text style={styles.infoText}>Urgency: {item.intent?.urgency || 'Medium'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Info size={14} color="#718096" />
          <Text style={styles.infoText}>Location: {item.location_name || 'Karachi'}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerLink}>View Full AI Trace</Text>
        <ChevronRight size={16} color="#4A90E2" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
          <Clock size={60} color="#E2E8F0" />
          <Text style={styles.emptyTitle}>No Booking History</Text>
          <Text style={styles.emptySubtitle}>Your agentic AI requests will appear here.</Text>
          <TouchableOpacity 
            style={styles.startBtn}
            onPress={() => navigation.navigate('Request')}
          >
            <Text style={styles.startBtnText}>Make First Request</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 20,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  dateText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusSuccess: {
    backgroundColor: '#C6F6D5',
  },
  statusPending: {
    backgroundColor: '#FEEBC8',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextSuccess: {
    color: '#22543D',
  },
  statusTextPending: {
    color: '#744210',
  },
  cardContent: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#4A5568',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerLink: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  startBtn: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
