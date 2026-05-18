import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Send, User, Bot, Brain } from 'lucide-react-native';
import { orchestrate } from '../services/api';
import { useGlobalState } from '../store/GlobalContext';
import { useTheme } from '../store/ThemeContext';

export default function RequestScreen({ route, navigation }) {
  const { initialService } = route.params || {};
  const [input, setInput] = useState(initialService ? `I need a ${initialService}` : '');
  const [fallbackResponse, setFallbackResponse] = useState('');
  const { updateWorkflow, setLoading, loading, userLocation } = useGlobalState();
  const { colors, isDark } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
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
            {/* Initial Welcome Bubble */}
            <View style={styles.aiMessage}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Bot size={20} color="#FFFFFF" />
              </View>
              <View style={[styles.bubble, { backgroundColor: colors.bubbleAI, borderColor: colors.border }]}>
                <Text style={[styles.aiText, { color: colors.text }]}>
                  Assalam-o-Alaikum! I am your AI Orchestrator. Tell me what service you need today. 
                  {"\n\n"}
                  <Text style={[styles.hint, { color: colors.textSecondary }]}>Example: "AC kharab hai Gulshan me theek karwana hai" or "Plumber needed for kitchen leak in DHA".</Text>
                </Text>
              </View>
            </View>

            {/* User Message */}
            {input.length > 0 && !loading && (
              <View style={styles.userMessage}>
                <View style={[styles.bubble, styles.userBubble, { backgroundColor: colors.bubbleUser }]}>
                  <Text style={styles.userText}>{input}</Text>
                </View>
              </View>
            )}
            
            {loading && (
              <View style={styles.userMessage}>
                <View style={[styles.bubble, styles.userBubble, { backgroundColor: colors.bubbleUser }]}>
                  <Text style={styles.userText}>{input}</Text>
                </View>
              </View>
            )}

            {/* Loading Indicator */}
            {loading && (
              <View style={styles.loadingContainer}>
                <View style={[styles.reasoningTeaser, { backgroundColor: colors.primaryLight }]}>
                  <Brain size={16} color={colors.primary} />
                  <Text style={[styles.reasoningTeaserText, { color: colors.primary }]}>Agent reasoning in progress...</Text>
                  <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 10 }} />
                </View>
              </View>
            )}

            {/* Fallback Response */}
            {fallbackResponse ? (
              <View style={styles.aiMessage}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Bot size={20} color="#FFFFFF" />
                </View>
                <View style={[styles.bubble, { backgroundColor: colors.bubbleAI, borderColor: colors.border }]}>
                  <Text style={[styles.aiText, { color: colors.text }]}>{fallbackResponse}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputArea, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Type your request here..."
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: input.trim() && !loading ? colors.primary : colors.border }
            ]} 
            onPress={handleOrchestration}
            disabled={loading || !input.trim()}
          >
            <Send size={20} color={input.trim() && !loading ? '#FFFFFF' : colors.icon} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    paddingBottom: 20,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
    borderWidth: 0,
  },
  aiText: {
    lineHeight: 24,
    fontSize: 16,
  },
  userText: {
    color: '#FFFFFF',
    lineHeight: 24,
    fontSize: 16,
  },
  hint: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginLeft: 48,
    marginBottom: 20,
  },
  reasoningTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  reasoningTeaserText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    marginRight: 12,
    minHeight: 52,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
