// src/components/ARScene.js
import React, { useState } from 'react';
import {
  ViroARScene,
  ViroAmbientLight,
  ViroSpotLight,
  ViroNode,
  Viro3DObject,
  ViroARPlaneSelector,
} from '@viro-community/react-viro'; 
import ARDataPanel from './ARDatapanel';

const ARScene = ({ sensorData, lastUpdated, onTrackingUpdated }) => {
  const [modelPlaced, setModelPlaced] = useState(false);
  const [, setPlaneReady] = useState(false);

  // Función que se llama cuando cambia el estado de tracking de la cámara AR
  const handleTrackingUpdated = (state, reason) => {
    if (onTrackingUpdated) {
      onTrackingUpdated(state, reason);
    }
    
    // Actualizar el estado del tracking para la UI
    if (state === 'TRACKING_NORMAL') {
      setPlaneReady(true);
    } else {
      setPlaneReady(false);
    }
  };

  // Función que se llama cuando el usuario coloca un objeto en un plano detectado
  const handlePlaneSelected = () => {
    if (!modelPlaced) {
      setModelPlaced(true);
    }
  };

  return (
    <ViroARScene onTrackingUpdated={handleTrackingUpdated}>
      {/* Luces para visualizar mejor objetos 3D */}
      <ViroAmbientLight color="#FFFFFF" intensity={200} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={45}
        direction={[0, -1, -0.2]}
        position={[0, 3, 0]}
        color="#FFFFFF"
        castsShadow={true}
        influenceBitMask={2}
        shadowMapSize={2048}
        shadowNearZ={2}
        shadowFarZ={5}
        shadowOpacity={0.7}
      />

      {/* Selector de planos AR donde el usuario puede colocar objetos */}
      <ViroARPlaneSelector
        onPlaneSelected={handlePlaneSelected}
        maxPlanes={1}
        minHeight={0.05}
        minWidth={0.05}
      >
        {/* Nodo que contiene el modelo 3D y el panel de datos */}
        <ViroNode
          position={[0, 0, 0]}
          dragType="FixedToWorld"
          onDrag={() => {}}
        >
          {/* Panel de datos flotante */}
          <ARDataPanel 
            sensorData={sensorData} 
            lastUpdated={lastUpdated} 
          />
          
          {/* Modelo 3D del sensor (opcional) */}
          <Viro3DObject
            source={require('../../assets/models/sensor.obj')} // Ensure this file exists
            resources={[require('../../assets/models/sensor.mtl')]} // Ensure this file exists
            position={[0, -0.5, -1.5]}
            scale={[0.05, 0.05, 0.05]}
            type="OBJ"
            onError={(error) => console.error('Error loading 3D model:', error)} // Log errors if the model fails to load
          />
        </ViroNode>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

export default ARScene;