import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import {ProgressChart} from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Dashboard = () => {
  // State Management
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Submit SOFTEC project',
      due: 'Today 3 PM',
      priority: 'high',
    },
    {id: 2, title: 'Buy groceries', due: 'Today 6 PM', priority: 'medium'},
  ]);
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

  // Mock API Functions
  const mockAddTask = text => {
    const newTask = {
      id: Math.random(),
      title: text.split(' ')[0], // Simple parsing
      due: 'Tomorrow',
      priority: 'medium',
    };
    setTasks([...tasks, newTask]);
  };

  const mockAnalyzeMood = selectedMood => {
    const suggestions = {
      happy: "You're doing great! Plan something fun!",
      sad: 'Take a break and listen to music.',
      neutral: "Stay focused, you're on track!",
    };
    return suggestions[selectedMood] || 'Keep going!';
  };

  // Handlers
  const handleAddTask = () => {
    if (taskInput.trim()) {
      mockAddTask(taskInput);
      setTaskInput('');
      setTaskModalVisible(false);
    }
  };

  const handleMoodSelect = selectedMood => {
    setMood(selectedMood);
    setSuggestion(mockAnalyzeMood(selectedMood));
    setMoodModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, User!</Text>
        <TouchableOpacity>
          {/* <Ionicons name="person-circle-outline" size={28} color="#333" /> */}
          {/* <Fort */}
        </TouchableOpacity>
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Tasks</Text>
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </View>

      {/* Progress Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <ProgressChart
          data={progressData}
          width={300}
          height={200}
          strokeWidth={16}
          radius={70}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>

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
            {['happy', 'neutral', 'sad'].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.moodOption, mood === m && styles.selectedMood]}
                onPress={() => handleMoodSelect(m)}>
                <Text style={styles.moodText}>
                  {m === 'happy'
                    ? '😊 Happy'
                    : m === 'sad'
                    ? '😢 Sad'
                    : '😐 Neutral'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Sub-component for Task Item
const TaskItem = ({task}) => (
  <View style={styles.taskItem}>
    <View
      style={[
        styles.priorityDot,
        {backgroundColor: task.priority === 'high' ? '#F44336' : '#FFC107'},
      ]}
    />
    <View style={styles.taskDetails}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDue}>Due: {task.due}</Text>
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
