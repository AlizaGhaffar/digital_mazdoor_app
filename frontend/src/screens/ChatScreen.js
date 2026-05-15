import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';

const ChatScreen = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Assalam-o-Alaikum! How can I help you today?', sender: 'ai' }
  ]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { id: Date.now().toString(), text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      onSend(input);
      setInput('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
      <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask for a service (e.g. AC repair in Gulshan)..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  chatList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#1A202C',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
