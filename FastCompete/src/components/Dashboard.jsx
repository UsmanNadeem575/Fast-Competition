import React, {useCallback, useEffect, useState,useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button,FlatList,Image, Animated, } from 'react-native';
import {ProgressChart} from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import API_BASE_URL from '../Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { sendToGemini } from './geminiService';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { LinearGradient } from 'react-native-svg';
import { faClockFour } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from './ThemeContext';



const Dashboard = () => {
  const {isDarkMode,toggleTheme}=useTheme();
  // State Management
  const [tasks, setTasks] = useState([]);
  const [mood, setMood] = useState(null);
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('Buy a milk tommorrow');
  const [isMoodModalVisible, setMoodModalVisible] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [noteText, setNoteText] = useState('Education plays a critical role in shaping the future of individuals and societies. Despite its importance, many women around the world still face barriers to accessing quality education. These barriers include cultural norms, lack of financial resources, and gender discrimination. In many parts of the world, girls are expected to stay home and take care of household duties, while boys are encouraged to pursue their studies. This disparity limits women’s opportunities for personal and professional growth, perpetuating cycles of poverty and inequality. Empowering women through education not only benefits the individual but also contributes to the development of the entire community.');
  const [summary, setSummary] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [tasksForDate, setTasksForDate] = useState([]);
  const panelTranslateY = useRef(new Animated.Value(600)).current;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const convertTaskDate = (dueDateString) => {
    const [day, month, year] = dueDateString.split(' ');
    const monthIndex = monthNames.indexOf(month) + 1;
    if (monthIndex === 0) return null; // invalid month
    const formattedMonth = monthIndex.toString().padStart(2, '0');
    const formattedDay = parseInt(day, 10).toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`; 
  };
  
  const mapTasksToCalendar = () => {
    const marked = {};
    tasks.forEach(task => {
      const formattedDate =  convertTaskDate(task.due_date); 
      console.log(formattedDate)
      if (formattedDate) {
        marked[formattedDate] = {
          marked: true,
          dotColor: 'blue',
          activeOpacity: 0.8,
        };
      }
    });
    setMarkedDates(marked);
  };
  

const handleSummarize = async () => {
  const summarizedNotes = await sendToGemini(noteText, true);
  const bulletPoints = summarizedNotes
  .split('\n')
  .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))  // handle both - and *
  .map(line => `• ${line.replace(/^[-*]\s*/, '').trim()}`)  // remove - or * and spaces
  .join('\n');

setNoteText(bulletPoints);


};

  
  // Mock Data
  const progressData = {
    labels: ['Completed'],
    data: [0.7],
    colors: ['#4CAF50'],
  };
  const fetchTasks = async () => {
    try {
      const userId = await getUserId();  // Retrieve the user ID from AsyncStorage
      if (userId) {
        const response = await axios.get(`${API_BASE_URL}/api/fetchTasks`, {
          params: { user_id: userId },
        });
        if (response) {
          const { mood, data } = response.data;  
          setMood(mood); // Set the mood
          setTasks(data);  // Set tasks
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(()=>{
fetchTasks();
mapTasksToCalendar();
  },[])

  
  const getFilteredTasks = () => {
    // 1. Sort the tasks first
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return new Date(a.due) - new Date(b.due);
    });
  
    // 2. Filter based on mood
    switch (mood) {
      case 'happy':
        return sortedTasks; // Show all tasks if happy
      case 'neutral':
        return sortedTasks.slice(0, Math.max(1, Math.floor(sortedTasks.length / 2))); // Half tasks
      case 'sad':
        return sortedTasks.slice(0, 1); // Only 1 task
      default:
        return sortedTasks; // Default fallback
    }
  };
  
  

  const mockAnalyzeMood = (selectedMood) => {
    const suggestions = {
      happy: "You're doing great! Plan something fun!",
      sad: 'Take a break and listen to music.',
      neutral: "Stay focused, you're on track!",
    };
    return suggestions[selectedMood] || 'Keep going!';
  };

  const handleSend = async inputText => {
    try {
      const reply = await sendToGemini(inputText);
      const cleanedString = reply
        .replace(/^\\\` json /, '')
        .replace(/\\\`$/, '')
        .trim();

      const parsedObject = JSON.parse(cleanedString);
      return parsedObject;
    } catch (error) {
      console.error('Error extracting task details:', error);
    }
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
    const data = await handleSend(taskInput);  // Assuming this returns a cleaned version of task title
    const userId = await getUserId();  // Retrieve the user ID from AsyncStorage

    if (userId) {
      const newTask = {
        user_id: userId, 
        title:data.title,  
        due_date:data.due_date,                // Set the title to the value received from the input
        category:data.category,                // Set the title to the value received from the input
        priority:data.priority,                // Set the title to the value received from the input
      };
      
      try {
        // Send the POST request to the Laravel API
        const response = await axios.post(`${API_BASE_URL}/api/tasks`, newTask);

        if (response.status === 200) {
          setTaskInput('');               // Clear the input field
          setTaskModalVisible(false);     // Close the modal
          fetchTasks();
          alert('Task added successfully!'); // Show success message
        } else {
          console.error('Failed to add task:', response.data.message);
          alert('Failed to add task: ' + response.data.message);  // Show error message
        }
      } catch (error) {
        console.error('Error adding task:', error);
        alert('An error occurred. Please try again.');  // Show error message to user
      }
    } else {
      console.error('User ID is not available.');
      alert('User ID is not available. Please log in.');  // Show error message
    }
  } else {
    console.error('Task input is empty.');
    alert('Please enter a task title.');  // Show error message
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
  
  const formatSelectedDate = (selectedDateString) => {
    const date = new Date(selectedDateString); // "2025-04-27"
    const day = date.getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${monthName} ${year}`;
  };

    const handleDatePress = (day) => {
    const selected = day.dateString;
    setSelectedDate(selected);
    const formattedSelected = formatSelectedDate(selected);
    console.log(formattedSelected)
    const filteredTasks = tasks.filter(task => task.due_date === formattedSelected);
    setTasksForDate(filteredTasks);

    if (filteredTasks.length > 0) {
      showPanel();
    } else {
      hidePanel();
    }
  };

  const showPanel = () => {
    setIsPanelVisible(true);
    Animated.timing(panelTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hidePanel = () => {
    Animated.timing(panelTranslateY, {
      toValue: 600,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsPanelVisible(false);
      setTasksForDate([]);
    });
  };
  const renderTaskItem = ({ item }) => (
        <View style={{ marginBottom: 20 }}>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 12 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Ubuntu-Medium', fontSize: 20, color: 'white', marginBottom: 6 }}>
                {item.title}
              </Text>
              <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 14, color: 'white', opacity: 0.9 }}>
                {item.desc}
              </Text>
            </View>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3039/3039393.png' }}
              style={{ width: 50, height: 50, marginLeft: 10 }}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>
      );

  return (
    <ScrollView style={[styles.container,{backgroundColor:isDarkMode ? 'white':'grey'}]}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello, User!</Text>
      <TouchableOpacity onPress={toggleTheme}> 
        <Text>Change Mode</Text> </TouchableOpacity>
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
      <View style={styles.Simplifycontainer}>
      <TextInput
        style={styles.paragraphInput}
        placeholder="Enter your notes here..."
        multiline
        value={noteText}
        onChangeText={setNoteText}
      />
      <Button title="Summarize" onPress={handleSummarize} />
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
    
    
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
       <Calendar
       
        onDayPress={handleDatePress}
        // markedDates={{
        //   [selectedDate]: { selected: true, marked: true, selectedColor: '#00adf5' }
        // }}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: '#00adf5',
        }}
      />

      {isPanelVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 600,
            backgroundColor: 'white',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            transform: [{ translateY: panelTranslateY }],
            padding: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 10,
            zIndex: 99,
          }}
        >
          <Text style={{ fontFamily: 'Ubuntu-Medium', fontSize: 24, marginBottom: 20, textAlign: 'center' }}>
            Tasks for {selectedDate}
          </Text>

          {tasksForDate.length > 0 ? (
            <FlatList
              data={tasksForDate}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={{ fontSize: 16, fontFamily: 'Ubuntu-Regular', marginTop: 20, color: '#333', textAlign: 'center' }}>
              No tasks for this date.
            </Text>
          )}

          <TouchableOpacity
            onPress={hidePanel}
            style={{ marginTop: 20, alignSelf: 'center', backgroundColor: '#ed1439', paddingVertical: 10, width: '100%', borderRadius: 30 }}
          >
            <Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'Ubuntu-Medium', fontSize: 16 }}>Close Panel</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
   </ScrollView>
  );
};

// // Sub-component for Task Item
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
        <Text>{task.due_date}</Text>
      </Text>
      <Text style={styles.taskDue}>
        <Text>{task.category}</Text>
      </Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
  </View>
);


// // Styles
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
  calendar: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
      },
      Simplifycontainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
      },
      paragraphInput: {
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
        textAlignVertical: 'top',
      },
      summaryContainer: {
        marginTop: 16,
        paddingHorizontal: 8,
      },
      heading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
      },
      summaryText: {
        fontSize: 16,
        marginBottom: 4,
      },
});



export default Dashboard;


