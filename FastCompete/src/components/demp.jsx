import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const AIChat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!prompt) return; // Don't submit if no prompt

    setLoading(true);
    setError('');
    try {
      const result = await axios.post(
        'https://api.openai.com/v1/completions', // URL for OpenAI (or any AI service endpoint)
        {
          model: 'text-davinci-003',  // You can change the model as needed
          prompt: prompt,
          max_tokens: 100,  // Max response length
          temperature: 0.7,  // Creativity level
        },
        {
          headers: {
            'Authorization': `Bearer YOUR_API_KEY`, // Replace with your AI API key
            'Content-Type': 'application/json',
          }
        }
      );

      setResponse(result.data.choices[0].text.trim()); // Adjust according to the AI response structure
    } catch (err) {
      setError('Error fetching AI response');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ask the AI!</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your prompt here"
        value={prompt}
        onChangeText={setPrompt}
      />
      <Button title={loading ? 'Loading...' : 'Get AI Response'} onPress={handleSubmit} disabled={loading} />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      {response && (
        <ScrollView style={styles.responseContainer}>
          <Text style={styles.responseText}>{response}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  responseContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AIChat;
