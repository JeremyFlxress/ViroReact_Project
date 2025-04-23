import {
  ViroARScene,
  ViroBox,
  ViroText,
  ViroNode,
  ViroFlexView,
} from "@reactvision/react-viro";
import { ViroMaterials } from "@reactvision/react-viro";
import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ActivityIndicator, Text } from "react-native";
import { getCurrentLocation, fetchWeatherData } from '../api/ApiData';


const PanelAR = () => {
  const [weather, setWeather] = useState({});
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [loadingWx, setLoadingWx] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const coordinates = await getCurrentLocation();
        setCoords(coordinates);
        setLoadingLoc(false);
      } catch (err) {
        console.warn('GPS ERROR', err);
        setError(err.message || 'No se pudo obtener ubicación');
        setLoadingLoc(false);
      }
    };

    getLocation();
  }, []);


  useEffect(() => {
    if (!coords) return;

    const getWeather = async () => {
      setLoadingWx(true);
      try {
        const weatherData = await fetchWeatherData(coords);
        setWeather(weatherData);
      } catch (err) {
        console.warn('WX ERROR', err);
        setError('Error al obtener clima');
      } finally {
        setLoadingWx(false);
      }
    };

    getWeather(); // Obtiene el clima inicialmente

    // Configura la actualización periódica
    const interval = setInterval(getWeather, 320000); // Actualiza cada 60 segundos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [coords]);

  ViroMaterials.createMaterials({
    box: {
      diffuseColor: "#FFFFFF",
      lightingModel: "Blinn",
      shininess: 2,
      writesToDepthBuffer: true
    },
    border : {
      diffuseColor: "#000000",
      lightingModel: "Constant",
      opacity: 0.2
    },
  });

  return (
    <ViroARScene>
      <ViroNode position={[0, 0, -7]}>
          <ViroBox
            materials={["box"]}
            position={[0, 0, 0]}       // relativa al nodo
            scale={[2.9, 1.9, 0.1]}
            opacity={0.6}
          />
          <ViroBox
            position={[0, 0, 0.01]} // Ligeramente al frente
            scale={[2.9, 1.9, 0.05]}
            materials={["border"]}
            opacity={0.9}
          />
        {!weather.city ? ( 
        <ViroText
            text={"Cargando datos…"}            
            scale={[0.1, 0.1, 0.1]}
            position={[0, 0, 1]}     // 1.0 mitad de altura + margen
            style={styles.city}
        />
        ) : (
          <>
            <ViroText
              text={"Datos de Sensor de Temperatura y Humedad"}
              scale={[0.2, 0.2, 0.2]}
              position={[0, 0.4, 1]}     // 1.0 mitad de altura + margen
              style={styles.data}
            />
            <ViroText
              text={weather.city}
              scale={[0.2, 0.2, 0.2]}
              position={[0, 0.2, 1]}     // 1.0 mitad de altura + margen
              style={styles.data}
            />
                <ViroText
                  text={weather.temp  + " °C"}
                  scale={[0.3, 0.3, 0.3]}
                  position={[0, -0.1, 1]}
                  style={[styles.data, { fontSize: 80 , color: 'lightblue' }]}
                />

                <ViroText
                  text={"Humedad:       " + weather.humidity  + " %"}
                  scale={[0.2, 0.2, 0.2]}
                  position={[0, -0.3, 1]}
                  style={styles.data}
                />
          </>
        )}
      </ViroNode>
    </ViroARScene>
  );
}

var styles = StyleSheet.create({
  city: {
    fontSize: 105,
    color: 'black',
    textAlignVertical: "center",
    textAlign: "center",
    width: 200,
  },
  data: {
    fontSize: 50,
    color: 'white',
    textAlignVertical: "center",
    textAlign: "center",
    width: 10,
    flex: 1
  },
  textStyle: {
    fontFamily: 'Segoe UI',
    fontWeight: '900',
    fontSize: 30,
    color: 'black',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  }
});

export default PanelAR;

