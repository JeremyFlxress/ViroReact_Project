import {
  ViroARScene,
  ViroBox,
  ViroText,
  ViroNode,
  ViroAnimations,
} from "@reactvision/react-viro";
import { ViroMaterials } from "@reactvision/react-viro";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { getCurrentLocation, fetchWeatherData } from '../api/ApiData';

const PanelAR = () => {

  const [weather, setWeather] = useState({});
  const [loadingWx, setLoadingWx] = useState(false);
  const [coords, setCoords] = useState(null);
  const [tempColor, setTempColor] = useState('lightblue');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (!coords) return;
    fetchAndSetWeather();
    const interval = setInterval(fetchAndSetWeather, 32000);
    return () => clearInterval(interval);
  }, [coords]);

  const getLocation = async () => {
    try {
      const coordinates = await getCurrentLocation();
      setCoords(coordinates);
    } catch (err) {
      console.warn('GPS ERROR', err);
    }
  };

  const fetchAndSetWeather = async () => {
    console.log("Actualizando datos...");
    if (!coords) return;
    setLoadingWx(true);
    setRefreshing(true);
    try {
      const weatherData = await fetchWeatherData(coords);
      setWeather(weatherData);

      if (weatherData.temp < 10) setTempColor('#4287f5');
      else if (weatherData.temp < 20) setTempColor('#42b8f5');
      else if (weatherData.temp < 30) setTempColor('#f5a742');
      else setTempColor('#f54242');
    } catch (err) {
      console.warn('WX ERROR', err);
      setError('Error al obtener clima');
    } finally {
      setLoadingWx(false);
      // Desactivar el estado de actualización después de un tiempo para mostrar animación
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  // Configuración de materiales más atractivos
  ViroMaterials.createMaterials({
    panelBackground: {
      diffuseColor: "#1E293B",
      lightingModel: "Blinn",
      shininess: 2,
      writesToDepthBuffer: true,
      opacity: 0.8
    },
    panelBorder: {
      diffuseColor: "#2563EB", 
      lightingModel: "Constant",
      opacity: 0.5
    },
    headerBar: {
      diffuseColor: "#2563EB", 
      lightingModel: "Constant", 
      opacity: 0.9
    },
    refreshButton: {
      diffuseColor: "#9932FF", // Verde esmeralda
      opacity: 0.9
    },
    refreshButtonPressed: {
      diffuseColor: "#9932CC", // Verde más oscuro cuando está presionado
      opacity: 1.0
      
    }
  });

  // Animaciones para elementos
  ViroAnimations.registerAnimations({
    fadeIn: {
      properties: {
        opacity: 1.0
      },
      duration: 500
    },
    scaleUp: {
      properties: {
        scaleX: 1.1,
        scaleY: 1.1,
        scaleZ: 1.1,
      },
      duration: 300,
      easing: "EaseInEaseOut"
    },
    scaleDown: {
      properties: {
        scaleX: 1.0,
        scaleY: 1.0,
        scaleZ: 1.0,
      },
      duration: 300,
      easing: "EaseInEaseOut"
    },
    pulseSize: [
      ["scaleUp", "scaleDown"]
    ],
  });

  return (
    <ViroARScene>
      <ViroNode position={[0, 0, -4]} animation={{ name: "fadeIn", run: true, loop: false }}>
        {/* Panel principal con esquinas redondeadas */}
        <ViroBox
          position={[0, 0, 0]}
          scale={[3.0, 2.0, 0.1]}
          materials={["panelBackground"]}
          opacity={0.8}
          cornerRadius={0.15}
        />
        
        {/* Efecto de borde iluminado con esquinas redondeadas */}
        <ViroBox
          position={[0, 0, -0.01]}
          scale={[3.1, 2.1, 0.05]}
          materials={["panelBorder"]}
          cornerRadius={0.18}
          opacity={0.5}
        />

        {/* Barra de título con esquinas redondeadas */}
        <ViroBox
          position={[0, 0.75, 0.01]}
          scale={[2.8, 0.4, 0.05]}
          materials={["headerBar"]}
          cornerRadius={0.1}
        />
        
        <ViroText
          text={"PANEL DE MONITOREO"}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0.75, 0.05]}
          style={styles.headerText}
          width={5}
          height={1}
        />

        {/* Botón de actualización manual */}
        <ViroBox
          position={[0, 1.35, 0.1]}
          scale={[1, 0.4, 0]}
          materials={[refreshing ? "refreshButtonPressed" : "refreshButton"]}
          cornerRadius={0.05}
          onClick={fetchAndSetWeather}
        />
        
        {/* Ícono de actualización (texto simplificado, idealmente usarías una textura) */}
        <ViroText
          text={refreshing ? "Actualizando..." : "Actualizar"}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 1.3, 0.2]}
          style={styles.refreshIcon}
          width={1}
          height={1}
        />

        {!weather.city ? (
          <ViroText
            text={"Cargando datos..."}
            scale={[0.5, 0.5, 0.5]}
            position={[0, 0, 0.05]}
            style={styles.loadingText}
            width={5}
            animation={{ name: "pulseSize", run: true, loop: true }}
          />
        ) : (
          <>
            {/* Ubicación */}
            <ViroText
              text={weather.city}
              scale={[0.5, 0.5, 0.5]}
              position={[0, 0.35, 0.05]}
              style={styles.locationText}
              width={5}
            />

            {/* Temperatura */}
            <ViroText
              text={weather.temp + " °C"}
              scale={[0.7, 0.7, 0.7]}
              position={[0, -0.05, 0.05]}
              style={[styles.tempText, { color: tempColor }]}
              width={3.5}
              animation={{ name: "pulseSize", run: loadingWx, loop: false }}
            />

            {/* Humedad */}
            <ViroText
              text={"Humedad: " + weather.humidity + "%"}
              scale={[0.4, 0.4, 0.4]}
              position={[0, -0.5, 0.05]}
              style={styles.humidityText}
              width={6}
            />

            {/* Estado */}
            <ViroText
              text={"Estado: " + weather.estado}
              scale={[0.4, 0.4, 0.4]}
              position={[0, -0.7, 0.05]}
              style={weather.estado === 'Activo' ? styles.estadoText : styles.estadoText2}
              width={6}
            />
          </>
        )}
        
        {/* Contenedores de datos con bordes redondeados */}
        <ViroBox
          position={[0, -0.05, 0.02]}
          scale={[2.0, 0.8, 0.03]}
          materials={["panelBackground"]}
          cornerRadius={0.15}
          opacity={0.4}
        />
        
        <ViroBox
          position={[0, -0.5, 0.02]}
          scale={[2.0, 0.4, 0.03]}
          materials={["panelBackground"]}
          cornerRadius={0.15}
          opacity={0.4}
        />
      </ViroNode>
    </ViroARScene>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Helvetica',
    fontSize: 24,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  locationText: {
    fontFamily: 'Helvetica',
    fontSize: 32,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  tempText: {
    fontFamily: 'Helvetica',
    fontSize: 30,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  humidityText: {
    fontFamily: 'Helvetica',
    fontSize: 28,
    color: '#94A3B8',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  loadingText: {
    fontFamily: 'Helvetica',
    fontSize: 32,
    color: '#94A3B8',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  estadoText: {
    fontFamily: 'Helvetica',
    fontSize: 28,
    color: '#90EE90',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  estadoText2:{
    fontFamily: 'Helvetica',
    fontSize: 28,
    color: 'red',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  refreshIcon: {
    fontFamily: 'Helvetica',
    fontSize: 20,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default PanelAR;