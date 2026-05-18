import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Send, User, Bot, Brain } from 'lucide-react-native';
import { orchestrate } from '../services/api';
import { useGlobalState } from '../store/GlobalContext';

export default function RequestScreen({ route, navigation }) {
  const { initialService } = route.params || {};
  const [input, setInput] = useState(initialService ? `I need a ${initialService}` : '');
  const [fallbackResponse, setFallbackResponse] = useState('');
  const { updateWorkflow, setLoading, loading, userLocation } = useGlobalState();
  const scrollViewRef = useRef();

  const handleOrchestration = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setFallbackResponse('');
    try {
      const data = await orchestrate(input, userLocation);
      updateWorkflow(data);
      if (data.final_context?.workflow_status === "UNSUPPORTED") {
        setFallbackResponse(data.final_context.fallback_response || "Sorry, we cannot process this request at the moment.");
      } else {
        navigation.navigate('Results');
      }
    } catch (error) {
      alert('Failed to connect to AI Orchestrator. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.scrollContent}
        >
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

            {input.length > 0 && !loading && (
              <View style={styles.userMessage}>
                <View style={[styles.bubble, styles.userBubble]}>
                  <Text style={styles.userText}>{input}</Text>
                </View>
                <View style={[styles.avatar, styles.userAvatar]}>
                  <User size={20} color="#FFFFFF" />
                </View>
              </View>
            )}

            {loading && (
              <View style={styles.userMessage}>
                <View style={[styles.bubble, styles.userBubble]}>
                  <Text style={styles.userText}>{input}</Text>
                </View>
                <View style={[styles.avatar, styles.userAvatar]}>
                  <User size={20} color="#FFFFFF" />
                </View>
              </View>
            )}

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4A90E2" />
                <View style={styles.reasoningTeaser}>
                  <Brain size={14} color="#4A90E2" />
                  <Text style={styles.reasoningTeaserText}>Agent reasoning in progress...</Text>
                </View>
              </View>
            )}

            {fallbackResponse ? (
              <View style={styles.aiMessage}>
                <View style={styles.avatar}>
                  <Bot size={20} color="#FFFFFF" />
                </View>
                <View style={styles.bubble}>
                  <Text style={styles.aiText}>{fallbackResponse}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="Message Digital Mazdoor..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && styles.disabledButton]} 
            onPress={handleOrchestration}
            disabled={loading || !input.trim()}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  chatContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  aiMessage: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    backgroundColor: '#4A5568',
    marginLeft: 8,
    marginRight: 0,
  },
  bubble: {
    maxWidth: '75%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#4A90E2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
  },
  aiText: {
    color: '#374151',
    lineHeight: 22,
    fontSize: 15,
  },
  userText: {
    color: '#FFFFFF',
    lineHeight: 22,
    fontSize: 15,
  },
  hint: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginLeft: 40,
    marginTop: -10,
    marginBottom: 20,
  },
  reasoningTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reasoningTeaserText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#2B6CB0',
    fontWeight: '500',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginRight: 12,
    minHeight: 44,
    maxHeight: 120,
    fontSize: 15,
    color: '#1F2937',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#E2E8F0',
    elevation: 0,
    shadowOpacity: 0,
  },
});

