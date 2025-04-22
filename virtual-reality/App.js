import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';

const WEATHER_API_KEY = 'be0e503bfb1bbdcc1b49628f73af3cc1';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

export default function App() {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [loadingWx, setLoadingWx] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permiso de ubicación denegado');
          setLoadingLoc(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCoords(location.coords);
        setLoadingLoc(false);
      } catch (err) {
        console.warn('GPS ERROR', err);
        setError('No se pudo obtener ubicación');
        setLoadingLoc(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!coords) return;

    const fetchWeather = () => {
      setLoadingWx(true);
      fetch(
        `${WEATHER_URL}?lat=${coords.latitude}&lon=${coords.longitude}` +
        `&units=metric&lang=es&appid=${WEATHER_API_KEY}`
      )
        .then(r => r.json())
        .then(json => {
          if (json.cod !== 200) throw new Error(json.message);
          setWeather({
            city: json.name,
            temp: json.main.temp.toFixed(1),
            humidity: json.main.humidity,
            desc: json.weather[0].description
          });
        })
        .catch(e => {
          console.warn('WX ERROR', e);
          setError('Error al obtener clima');
        })
        .finally(() => setLoadingWx(false));
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, [coords]);

  if (loadingLoc) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Obteniendo ubicación…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }
  if (loadingWx) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Consultando clima…</Text>
      </View>
    );
  }
  if (!weather) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weather.city}</Text>
      <Text style={styles.temp}>{weather.temp}°C</Text>
      <Text style={styles.desc}>{weather.desc}</Text>
      <Text style={styles.hum}>💧 Humedad: {weather.humidity}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  desc: {
    fontSize: 18,
    color: '#666',
  },
  hum: {
    fontSize: 16,
    color: '#888',
  },
});