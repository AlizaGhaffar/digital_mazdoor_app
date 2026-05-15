import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Brain, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';

const TraceStep = ({ step, isLast }) => {
  const [expanded, setExpanded] = React.useState(true);
  
  const agentName = step.agent_id.replace('_', ' ').toUpperCase();
  const timestamp = new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <View style={styles.stepContainer}>
      <View style={styles.timeline}>
        <View style={styles.dot}>
          <View style={styles.innerDot} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>
      
      <View style={styles.stepContent}>
        <TouchableOpacity 
          style={styles.stepHeader}
          onPress={() => setExpanded(!expanded)}
        >
          <View>
            <Text style={styles.agentId}>{agentName}</Text>
            <Text style={styles.stepTime}>{timestamp}</Text>
          </View>
          {expanded ? <ChevronUp size={16} color="#A0AEC0" /> : <ChevronDown size={16} color="#A0AEC0" />}
        </TouchableOpacity>

        {expanded && (
          <View style={styles.details}>
            <View style={styles.logicBox}>
              {step.reasoning_logic.map((item, idx) => (
                <View key={idx} style={styles.logicItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.logicText}>{item}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.decisionBox}>
              <Text style={styles.decisionLabel}>Decision Output:</Text>
              <Text style={styles.decisionValue}>{JSON.stringify(step.decision, null, 2)}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default function TraceScreen() {
  const { traces } = useGlobalState();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Brain size={28} color="#4A90E2" />
        <View style={styles.headerText}>
          <Text style={styles.title}>AI Reasoning Trace</Text>
          <Text style={styles.subtitle}>Step-by-step autonomous decision making</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {traces.length > 0 ? (
          traces.map((step, index) => (
            <TraceStep 
              key={index} 
              step={step} 
              isLast={index === traces.length - 1} 
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Info size={40} color="#E2E8F0" />
            <Text style={styles.emptyText}>No traces found for this workflow.</Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F7FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerText: {
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 12,
    color: '#718096',
  },
  scrollContent: {
    padding: 20,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  timeline: {
    alignItems: 'center',
    width: 20,
    marginRight: 15,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
    zIndex: 1,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    marginBottom: 25,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  agentId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  stepTime: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  details: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  logicBox: {
    marginBottom: 15,
  },
  logicItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4A90E2',
    marginTop: 8,
    marginRight: 8,
  },
  logicText: {
    fontSize: 13,
    color: '#2D3748',
    lineHeight: 18,
  },
  decisionBox: {
    backgroundColor: '#EDF2F7',
    padding: 10,
    borderRadius: 8,
  },
  decisionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#718096',
    marginBottom: 5,
  },
  decisionValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#2D3748',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    color: '#A0AEC0',
  },
});
