// src/api/sensorApi.js
import axios from 'axios';

// En un caso real, esta URL vendría de tus variables de entorno
const API_URL = 'https://mocki.io/v1/d4367cb8-763a-49cd-b467-5f1b01e145c3'; // Mock API para simular datos

export const fetchSensorData = async (sensorId = 'default') => {
  try {
    // En un caso real, este endpoint incluiría el ID del sensor
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    // Retornamos datos simulados en caso de error con la API
    return {
      id: sensorId,
      temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
      location: 'Sector A',
      lastUpdate: new Date().toISOString(),
      status: 'active'
    };
  }
};

// Simulamos varios sensores para poder elegir
export const fetchAvailableSensors = async () => {
  try {
    // En un caso real, habría un endpoint para obtener la lista de sensores
    // Por ahora simulamos esta data
    return [
      { id: 'sensor1', name: 'Sensor Oficina', location: 'Sector A' },
      { id: 'sensor2', name: 'Sensor Exterior', location: 'Sector B' },
      { id: 'sensor3', name: 'Sensor Almacén', location: 'Sector C' },
    ];
  } catch (error) {
    console.error('Error fetching sensors list:', error);
    return [];
  }
};