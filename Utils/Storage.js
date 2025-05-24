import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem('@BubblyDay:tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (e) {
    console.error('Error loading tasks', e);
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem('@BubblyDay:tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks', e);
  }
};
