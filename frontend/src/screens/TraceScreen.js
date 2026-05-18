import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useGlobalState } from '../store/GlobalContext';
import { useTheme } from '../store/ThemeContext';

const TraceStep = ({ step, isLast, colors }) => {
  const [expanded, setExpanded] = React.useState(true);
  
  const agentName = step.agent_id.replace('_', ' ').toUpperCase();
  const timestamp = new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <View style={styles.stepContainer}>
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: colors.inputBg, borderColor: colors.primary }]}>
          <View style={[styles.innerDot, { backgroundColor: colors.primary }]} />
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: colors.border }]} />}
      </View>
      
      <View style={styles.stepContent}>
        <TouchableOpacity 
          style={styles.stepHeader}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <View>
            <Text style={[styles.agentId, { color: colors.text }]}>{agentName}</Text>
            <Text style={[styles.stepTime, { color: colors.textSecondary }]}>{timestamp}</Text>
          </View>
          <View style={[styles.expandIcon, { backgroundColor: colors.inputBg }]}>
             {expanded ? <ChevronUp size={16} color={colors.text} /> : <ChevronDown size={16} color={colors.text} />}
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={[styles.details, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.logicBox}>
              {step.reasoning_logic.map((item, idx) => (
                <View key={idx} style={styles.logicItem}>
                  <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.logicText, { color: colors.text }]}>{item}</Text>
                </View>
              ))}
            </View>
            
            <View style={[styles.decisionBox, { backgroundColor: colors.inputBg }]}>
              <Text style={[styles.decisionLabel, { color: colors.textSecondary }]}>Decision Output:</Text>
              <Text style={[styles.decisionValue, { color: colors.primary }]}>{JSON.stringify(step.decision, null, 2)}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default function TraceScreen() {
  const { traces } = useGlobalState();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
           <Brain size={28} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>AI Reasoning Trace</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Transparent autonomous decisions</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {traces.length > 0 ? (
          traces.map((step, index) => (
            <TraceStep 
              key={index} 
              step={step} 
              isLast={index === traces.length - 1} 
              colors={colors}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Brain size={60} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No traces found for this workflow.</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollContent: {
    padding: 24,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  timeline: {
    alignItems: 'center',
    width: 24,
    marginRight: 16,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 1,
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    marginBottom: 30,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  agentId: {
    fontSize: 16,
    fontWeight: '800',
  },
  stepTime: {
    fontSize: 12,
    marginTop: 4,
  },
  expandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  logicBox: {
    marginBottom: 20,
  },
  logicItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 10,
  },
  logicText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  decisionBox: {
    padding: 16,
    borderRadius: 12,
  },
  decisionLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  decisionValue: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});
