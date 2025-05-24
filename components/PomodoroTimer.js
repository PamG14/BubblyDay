import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            // Play completion sound
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>
        {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          onPress={toggleTimer}
          style={[styles.button, isActive ? styles.pauseButton : styles.startButton]}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Pausa' : 'Inicio'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={resetTimer}
          style={[styles.button, styles.resetButton]}
        >
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6a5acd',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  startButton: {
    backgroundColor: '#98fb98', // Pale green
  },
  pauseButton: {
    backgroundColor: '#ffb6c1', // Light pink
  },
  resetButton: {
    backgroundColor: '#afeeee', // Pale turquoise
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PomodoroTimer;
