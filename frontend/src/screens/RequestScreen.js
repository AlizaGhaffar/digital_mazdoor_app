import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, User, Bot, Brain } from 'lucide-react-native';
import { orchestrate } from '../services/api';
import { useGlobalState } from '../store/GlobalContext';

export default function RequestScreen({ route, navigation }) {
  const { initialService } = route.params || {};
  const [input, setInput] = useState(initialService ? `I need a ${initialService}` : '');
  const [isTyping, setIsTyping] = useState(false);
  const { updateWorkflow, setLoading, loading } = useGlobalState();

  const handleOrchestration = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const data = await orchestrate(input);
      updateWorkflow(data);
      navigation.navigate('Results');
    } catch (error) {
      alert('Failed to connect to AI Orchestrator. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.chatContainer}>
          <View style={styles.aiMessage}>
            <View style={styles.avatar}>
              <Bot size={20} color="#FFFFFF" />
            </View>
            <View style={styles.bubble}>
              <Text style={styles.aiText}>
                Assalam-o-Alaikum! I am your AI Orchestrator. Tell me what service you need today. 
                {"\n\n"}
                <Text style={styles.hint}>Example: "AC kharab hai Gulshan me theek karwana hai" or "Plumber needed for kitchen leak in DHA".</Text>
              </Text>
            </View>
          </View>

          {input.length > 0 && (
            <View style={styles.userMessage}>
              <View style={[styles.bubble, styles.userBubble]}>
                <Text style={styles.userText}>{input}</Text>
              </View>
              <View style={[styles.avatar, styles.userAvatar]}>
                <User size={20} color="#FFFFFF" />
              </View>
            </View>
          )}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>AI is analyzing your request...</Text>
            <View style={styles.reasoningTeaser}>
              <Brain size={16} color="#4A90E2" />
              <Text style={styles.reasoningTeaserText}>Running Intent & Context Agents...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your request in Urdu or English..."
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !input.trim() && styles.disabledButton]} 
          onPress={handleOrchestration}
          disabled={loading || !input.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  chatContainer: {
    flex: 1,
  },
  aiMessage: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatar: {
    backgroundColor: '#4A5568',
    marginLeft: 10,
    marginRight: 0,
  },
  bubble: {
    maxWidth: '80%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#4A90E2',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
  },
  aiText: {
    color: '#2D3748',
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  reasoningTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reasoningTeaserText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#3182CE',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#CBD5E0',
  },
});
