// src/screens/ARScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { ViroARSceneNavigator } from '@viro-community/react-viro';
import { useSensor } from '../contexts/SensorContext';
import ARScene from '../components/ARScene';
import LoadingScreen from '../components/LoadingScreen';

const ARScreen = ({ navigation }) => {
  const { sensorData, loading, refreshData, lastUpdated, selectedSensor, availableSensors } = useSensor();
  const [arTrackingState, setArTrackingState] = useState('INITIALIZING');
  const [showInstructions, setShowInstructions] = useState(true);

  // Buscar el nombre del sensor seleccionado
  const selectedSensorName = availableSensors.find(s => s.id === selectedSensor)?.name || 'Sensor';

  // Maneja los cambios en el estado de tracking de AR
  const handleTrackingUpdated = (state, reason) => {
    setArTrackingState(state);
    
    // Ocultar instrucciones después de que AR esté listo
    if (state === 'TRACKING_NORMAL') {
      setTimeout(() => {
        setShowInstructions(false);
      }, 3000);
    }
  };

  // Manejar la actualización manual de datos
  const handleRefresh = () => {
    refreshData();
  };

  // Mostrar pantalla de carga si los datos aún no están disponibles
  if (loading && !sensorData) {
    return <LoadingScreen message="Cargando datos del sensor..." />;
  }

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{
          scene: () => <ARScene 
            sensorData={sensorData} 
            lastUpdated={lastUpdated}
            onTrackingUpdated={handleTrackingUpdated}
          />
        }}
        style={styles.arView}
      />
      
      {/* Overlay UI sobre la vista AR */}
      <SafeAreaView style={styles.uiContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>{selectedSensorName}</Text>
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>↻ Actualizar</Text>
          </TouchableOpacity>
        </View>
        
        {/* Instrucciones AR (visibles solo durante inicialización) */}
        {showInstructions && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              {arTrackingState === 'INITIALIZING' 
                ? 'Inicializando AR...' 
                : 'Mueve tu cámara hacia una superficie plana para colocar el panel de datos'}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  uiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: 'rgba(0,102,204,0.7)',
    borderRadius: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ARScreen;