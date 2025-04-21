// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSensor } from '../contexts/SensorContext';

const HomeScreen = ({ navigation }) => {
  const { availableSensors, selectSensor, selectedSensor } = useSensor();

  const handleSensorSelect = (sensorId) => {
    selectSensor(sensorId);
    navigation.navigate('AR');
  };

  const renderSensorItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.sensorItem,
        selectedSensor === item.id && styles.selectedSensor
      ]}
      onPress={() => handleSensorSelect(item.id)}
    >
      <Text style={styles.sensorName}>{item.name}</Text>
      <Text style={styles.sensorLocation}>Ubicación: {item.location}</Text>
    </TouchableOpacity>
  );

  const openARView = () => {
    if (selectedSensor) {
      navigation.navigate('AR');
    } else {
      Alert.alert('Error', 'Por favor seleccione un sensor primero');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EnviroAR Monitor</Text>
      <Text style={styles.subtitle}>Seleccione un sensor para visualizar en AR:</Text>
      
      <FlatList
        data={availableSensors}
        renderItem={renderSensorItem}
        keyExtractor={item => item.id}
        style={styles.sensorList}
      />
      
      <TouchableOpacity style={styles.arButton} onPress={openARView}>
        <Text style={styles.arButtonText}>Iniciar Visualización AR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  sensorList: {
    marginVertical: 20,
  },
  sensorItem: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  selectedSensor: {
    backgroundColor: '#E0F0FF',
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  sensorName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  sensorLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  arButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  arButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default HomeScreen;