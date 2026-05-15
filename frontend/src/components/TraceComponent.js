import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TraceComponent = ({ traces }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>AI Reasoning Trace</Text>
      {traces.map((step, index) => (
        <View key={index} style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.agentId}>{step.agent_id.replace('_', ' ').toUpperCase()}</Text>
            <Text style={styles.timestamp}>{new Date(step.timestamp).toLocaleTimeString()}</Text>
          </View>
          <View style={styles.logicContainer}>
            {step.reasoning_logic.map((logic, lIdx) => (
              <Text key={lIdx} style={styles.logicText}>• {logic}</Text>
            ))}
          </View>
          <View style={styles.decisionContainer}>
            <Text style={styles.decisionLabel}>Decision:</Text>
            <Text style={styles.decisionText}>{JSON.stringify(step.decision, null, 2)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A202C',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  agentId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  timestamp: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  logicContainer: {
    marginBottom: 8,
  },
  logicText: {
    fontSize: 13,
    color: '#2D3748',
    marginBottom: 2,
  },
  decisionContainer: {
    backgroundColor: '#EDF2F7',
    padding: 8,
    borderRadius: 4,
  },
  decisionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 2,
  },
  decisionText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#2D3748',
  },
});

export default TraceComponent;
