import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import TaskItem from './components/TaskItem';
import PomodoroTimer from './components/PomodoroTimer';
import { loadTasks, saveTasks } from './utils/storage';

const BubblyDay = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const savedTasks = await loadTasks();
      if (savedTasks) setTasks(savedTasks);
    };
    loadData();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar",
      "¿Eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => confirmDelete(id) }
      ]
    );
  };

  const confirmDelete = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
    // Play plop sound here
  };

  const handleDragEnd = ({ data }) => {
    setTasks(data);
    saveTasks(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BubblyDay</Text>
      
      <DraggableFlatList
        data={tasks}
        renderItem={({ item, drag, isActive }) => (
          <TaskItem 
            task={item} 
            onDrag={drag} 
            onDelete={handleDelete}
            isActive={isActive}
          />
        )}
        keyExtractor={(item) => item.id}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.list}
      />
      
      <PomodoroTimer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Light azure background
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6a5acd', // Soft lilac
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 15,
  }
});

export default BubblyDay;
