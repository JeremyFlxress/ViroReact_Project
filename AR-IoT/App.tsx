import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroText,
  ViroNode,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import { ViroMaterials } from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

const HelloWorldSceneAR = () => {
  const [text, setText] = useState("Initializing AR...");

  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("onInitialized", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("EDUARDO CULON!");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  ViroMaterials.createMaterials({
    greenBox: {
      diffuseColor: "white"
    }
  });

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroNode position={[0, 0, -5]}>
        <ViroBox
          style={styles.caja}
          materials={["greenBox"]}
          position={[0, 0, 0]}       // relativa al nodo
          scale={[1, 1, 1]}
        />

        <ViroText
          text="Texto sobre la caja"
          scale={[0.1, 0.1, 0.1]}
          position={[0, 0.5, 1]}     // 1.0 mitad de altura + margen
          style={styles.helloWorldTextStyle}
        />

        <ViroText
          text={text}
          scale={[0.2, 0.2, 0.2]}
          position={[0, -0.5, 1]}
          style={styles.helloWorldTextStyle}
        />
      </ViroNode>
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};


var styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'Segoe UI',
    fontWeight: '900',
    fontSize: 30,
    color: 'red',
    textAlignVertical: "center",
    textAlign: "center",
    borderColor: 'red',
    borderWidth: 1,
    width: 200,
  },
  textStyle: {
    fontFamily: 'Segoe UI',
    fontWeight: '900',
    fontSize: 30,
    color: 'black',
  },
  caja: {
    height: 2,
    width: 2,
  }
});
