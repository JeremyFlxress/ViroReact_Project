import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroText,
  ViroNode,
  ViroTrackingReason,
  ViroTrackingStateConstants,
  ViroARPlaneSelector,
} from "@reactvision/react-viro";
import { ViroMaterials } from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet, TouchableHighlight, View, TouchableOpacity, Text } from "react-native";
import PanelAR from "./src/components/PanelAR";

export default () => {

  const PanelARconst = () => {
    return (
      <PanelAR
      />
    );
  };  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Panel de monitoreo: humedad y temperatura</Text>
      </View>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: PanelARconst,
        }}
        style={styles.f1}
      />
    </View>
  );
};


var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  f1: { 
    flex: 1 
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
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
});
