// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { SensorProvider } from './src/contexts/SensorContext';
import HomeScreen from './src/screens/HomeScreen';
import ARScreen from './src/screens/ARScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <SensorProvider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: 'EnviroAR Monitor',
              headerShown: true,
            }}
          />
          <Stack.Screen 
            name="AR" 
            component={ARScreen} 
            options={{ 
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </SensorProvider>
    </NavigationContainer>
  );
}