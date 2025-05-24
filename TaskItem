import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const TaskItem = ({ task, onDrag, onDelete, isActive }) => {
  const rightSwipe = () => {
    return (
      <View style={styles.deleteBox}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={rightSwipe}
      onSwipeableRightOpen={() => onDelete(task.id)}
    >
      <TouchableOpacity
        onLongPress={onDrag}
        disabled={isActive}
        style={[
          styles.taskItem,
          { backgroundColor: getColorByIndex(task.colorIndex) },
          isActive && { opacity: 0.8 }
        ]}
      >
        <Text style={styles.taskText}>{task.text}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

const getColorByIndex = (index) => {
  const colors = [
    '#b0e0e6', // Powder blue
    '#afeeee', // Pale turquoise
    '#e6e6fa', // Lavender
    '#ffb6c1', // Light pink
    '#98fb98', // Pale green
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  taskItem: {
    padding: 20,
    borderRadius: 25,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskText: {
    fontSize: 18,
    color: '#333',
  },
  deleteBox: {
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 25,
    marginVertical: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default TaskItem;
