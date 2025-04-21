// src/contexts/SensorContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchSensorData, fetchAvailableSensors } from '../api/sensorApi';

const SensorContext = createContext();

export const useSensor = () => useContext(SensorContext);

export const SensorProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState('sensor1'); // Default sensor
  const [availableSensors, setAvailableSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cargar la lista de sensores al iniciar
  useEffect(() => {
    const loadSensors = async () => {
      try {
        const sensors = await fetchAvailableSensors();
        setAvailableSensors(sensors);
        if (sensors.length > 0 && !selectedSensor) {
          setSelectedSensor(sensors[0].id);
        }
      } catch (err) {
        setError('Error al cargar la lista de sensores');
        console.error(err);
      }
    };
    
    loadSensors();
  }, []);

  // Cargar datos del sensor seleccionado
  const loadSensorData = async (sensorId = selectedSensor) => {
    setLoading(true);
    try {
      const data = await fetchSensorData(sensorId);
      setSensorData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Error al cargar datos del sensor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (selectedSensor) {
      loadSensorData(selectedSensor);
    }
  }, [selectedSensor]);

  // Configurar la actualización periódica cada 5 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedSensor) {
        loadSensorData(selectedSensor);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedSensor]);

  const refreshData = () => {
    loadSensorData(selectedSensor);
  };

  const selectSensor = (sensorId) => {
    setSelectedSensor(sensorId);
  };

  return (
    <SensorContext.Provider
      value={{
        sensorData,
        loading,
        error,
        lastUpdated,
        availableSensors,
        selectedSensor,
        refreshData,
        selectSensor
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};