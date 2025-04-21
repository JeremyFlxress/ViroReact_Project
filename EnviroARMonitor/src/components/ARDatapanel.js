// src/components/ARDataPanel.js
import React from 'react';
import {
  ViroText,
  ViroFlexView,
  ViroImage,
} from '@viro-community/react-viro';

const ARDataPanel = ({ sensorData, lastUpdated }) => {
  if (!sensorData) return null;

  const { temperature, humidity, location, status } = sensorData;
  const formattedTime = lastUpdated ? 
    `${lastUpdated.getHours()}:${String(lastUpdated.getMinutes()).padStart(2, '0')}:${String(lastUpdated.getSeconds()).padStart(2, '0')}` : 
    'N/A';

  // Determinar color basado en temperatura
  const getTempColor = (temp) => {
    if (temp < 18) return '#66CCFF'; // Frío
    if (temp > 28) return '#FF6666'; // Caliente
    return '#66CC99'; // Normal
  };

  // Determinar color basado en humedad
  const getHumidityColor = (hum) => {
    if (hum < 30) return '#FFB347'; // Seco
    if (hum > 70) return '#66CCFF'; // Húmedo
    return '#66CC99'; // Normal
  };

  return (
    <ViroFlexView
      position={[0, 0, -1.5]}
      rotation={[0, 0, 0]}
      height={0.5}
      width={1.0}
      style={{
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 10,
        padding: 0.02,
      }}
    >
      {/* Panel Header */}
      <ViroFlexView 
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          padding: 0.01,
          backgroundColor: 'rgba(0,80,170,0.8)',
          borderRadius: 5,
        }}
      >
        <ViroText
          text={`Sensor: ${location}`}
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'left',
          }}
          width={0.7}
          height={0.05}
        />
        <ViroText
          text={`Status: ${status === 'active' ? '✓ ACTIVO' : '✗ INACTIVO'}`}
          style={{
            fontSize: 14,
            color: status === 'active' ? '#66FF66' : '#FF6666',
            textAlign: 'right',
          }}
          width={0.3}
          height={0.05}
        />
      </ViroFlexView>

      {/* Datos de sensor */}
      <ViroFlexView 
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          flex: 1,
          padding: 0.02,
        }}
      >
        {/* Temperatura */}
        <ViroFlexView 
          style={{ 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 5,
            padding: 0.01,
            margin: 0.01,
            width: 0.45,
          }}
        >
          <ViroText
            text={`${temperature}°C`}
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: getTempColor(temperature),
              textAlign: 'center',
            }}
            width={0.4}
            height={0.1}
          />
          <ViroText
            text="Temperatura"
            style={{
              fontSize: 12,
              color: 'white',
              textAlign: 'center',
            }}
            width={0.4}
            height={0.05}
          />
        </ViroFlexView>

        {/* Humedad */}
        <ViroFlexView 
          style={{ 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 5,
            padding: 0.01,
            margin: 0.01,
            width: 0.45,
          }}
        >
          <ViroText
            text={`${humidity}%`}
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: getHumidityColor(humidity),
              textAlign: 'center',
            }}
            width={0.4}
            height={0.1}
          />
          <ViroText
            text="Humedad"
            style={{
              fontSize: 12,
              color: 'white',
              textAlign: 'center',
            }}
            width={0.4}
            height={0.05}
          />
        </ViroFlexView>
      </ViroFlexView>

      {/* Footer con última actualización */}
      <ViroText
        text={`Última actualización: ${formattedTime}`}
        style={{
          fontSize: 10,
          color: '#CCCCCC',
          textAlign: 'center',
        }}
        width={1.0}
        height={0.05}
      />
    </ViroFlexView>
  );
};

export default ARDataPanel;