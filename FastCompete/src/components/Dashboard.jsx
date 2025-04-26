import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button, } from 'react-native';
import {ProgressChart} from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import API_BASE_URL from '../Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const Dashboard = () => {
  // State Management
  const [tasks, setTasks] = useState([]);
  const [mood, setMood] = useState(null);
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [isMoodModalVisible, setMoodModalVisible] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  
  // Mock Data
  const progressData = {
    labels: ['Completed'],
    data: [0.7],
    colors: ['#4CAF50'],
  };
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = await getUserId();  // Retrieve the user ID from AsyncStorage
        if (userId) {
          const response = await axios.get(`${API_BASE_URL}/api/fetchTasks`, {
            params: { user_id: userId },
          });
          if (response) {
            const { mood, data } = response.data;  // Get mood and tasks
            setMood(mood); // Set the mood
            setTasks(data);  // Set tasks
          }
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  
  // Function to filter tasks based on mood
  const getFilteredTasks = () => {
    if (mood === 'happy') {
      return tasks;  // Show all tasks
    } else if (mood === 'neutral') {
      return tasks.slice(0, Math.floor(tasks.length / 2));  // Show half the tasks
    } else if (mood === 'sad') {
      return tasks.slice(0, 1);  // Show only one task
    }
    return [];
  };

  const mockAnalyzeMood = (selectedMood) => {
    const suggestions = {
      happy: "You're doing great! Plan something fun!",
      sad: 'Take a break and listen to music.',
      neutral: "Stay focused, you're on track!",
    };
    return suggestions[selectedMood] || 'Keep going!';
  };



  
const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  } catch (error) {
    console.error('Error retrieving user ID', error);
    return null;
  }
};

const handleAddTask = async () => {
  if (taskInput.trim()) {
    const userId = await getUserId();  // Retrieve the user ID from AsyncStorage

    if (userId) {
      const newTask = {
        title: taskInput,
        user_id: userId,  // Include the user_id in the request
      };

      try {
        // Send the POST request to the Laravel API
        const response = await axios.post(`${API_BASE_URL}/api/tasks`, newTask);

        // If successful, add the task to the local state
        // setTasks([response.data, ...tasks]);
        setTaskInput(''); // Clear the input field
        setTaskModalVisible(false); // Close the modal
      } catch (error) {
        console.error('Error adding task:', error);
        // Handle any error (e.g., show a message to the user)
      }
    } else {
      console.error('User ID is not available.');
    }
  }
};

  

  // Sort tasks: high priority first, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;
    return new Date(a.due) - new Date(b.due); 
  });

  const handleMoodSelect = async (selectedMood) => {
    const userId = await getUserId();  // Retrieve the user ID from AsyncStorage
  
    if (userId) {
      const data = {
        user_id: userId,  // Include the user_id in the request
        mood: selectedMood,  // Send the selected mood
      };
  
      try {
        // Send the selected mood and user_id to the Laravel API
        const response = await axios.post(`${API_BASE_URL}/api/updateMood`, data);
  
        if (response.status === 200) {
          console.log('Mood updated successfully');
          setMood(selectedMood); // Update the local state with selected mood
          setSuggestion(mockAnalyzeMood(selectedMood)); // Update the suggestion based on mood
          setMoodModalVisible(false); // Close the modal
        }
      } catch (error) {
        console.error('Error updating mood:', error);
      }
    }
  };
  
  

  return (
    <ScrollView style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello, User!</Text>
    </View>

    {/* Quick Actions */}
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setTaskModalVisible(true)}>
        <MaterialIcons name="add-task" size={24} color="#4285F4" />
        <Text style={styles.actionText}>Add Task</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setMoodModalVisible(true)}>
        <FontAwesome name="smile-o" size={24} color="#4285F4" />
        <Text style={styles.actionText}>Log Mood</Text>
      </TouchableOpacity>
    </View>

    {/* Priority Tasks */}
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Priority Tasks</Text>
      {getFilteredTasks().map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ScrollView>

    {/* Mood Suggestion */}
    {suggestion && (
      <View style={styles.suggestionCard}>
        <Ionicons name="bulb-outline" size={24} color="#FFC107" />
        <Text style={styles.suggestionText}>{suggestion}</Text>
      </View>
    )}

    {/* Task Input Modal */}
    <Modal visible={isTaskModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Add New Task</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 'Buy milk tomorrow'"
          value={taskInput}
          onChangeText={setTaskInput}
        />
        <View style={styles.modalButtons}>
          <Button title="Cancel" onPress={() => setTaskModalVisible(false)} />
          <Button title="Add" onPress={handleAddTask} />
        </View>
      </View>
    </Modal>

    {/* Mood Selection Modal */}
    <Modal visible={isMoodModalVisible} animationType="fade" transparent>
      <View style={styles.moodModalContainer}>
        <View style={styles.moodModalContent}>
          <Text style={styles.modalTitle}>How are you feeling?</Text>
          {['happy', 'neutral', 'sad'].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.moodOption, mood === m && styles.selectedMood]}
              onPress={() => handleMoodSelect(m)}>
              <Text style={styles.moodText}>
                {m === 'happy' ? '😊 Happy' : m === 'sad' ? '😢 Sad' : '😐 Neutral'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  </ScrollView>
  );
};


// Sub-component for Task Item
const TaskItem = ({ task }) => (
  <View style={styles.taskItem}>
    <View
      style={[
        styles.priorityDot,
        { backgroundColor: task.priority === 'high' ? '#F44336' : '#FFC107' },
      ]}
    />
    <View style={styles.taskDetails}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDue}>
        <Text>{formatDate(task.created_at)}</Text>
      </Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
  </View>
);


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    elevation: 2,
  },
  actionText: {
    marginLeft: 8,
    color: '#4285F4',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
  },
  taskDue: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  chart: {
    alignSelf: 'center',
  },
  suggestionCard: {
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionText: {
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  moodModalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 20,
  },
  moodOption: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  selectedMood: {
    backgroundColor: '#E3F2FD',
  },
  moodText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Dashboard;