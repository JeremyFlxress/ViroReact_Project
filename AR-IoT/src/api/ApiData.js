import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid , Platform } from 'react-native';

const WEATHER_API_KEY = 'be0e503bfb1bbdcc1b49628f73af3cc1';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';


const requestAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permiso de ubicación",
          message: "La aplicación necesita acceso a tu ubicación para mostrar el clima local",
          buttonNeutral: "Preguntar después",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  export const getCurrentLocation = () => {
    return new Promise(async (resolve, reject) => {
      // Verificar permisos en Android
      if (Platform.OS === 'android') {
        const hasPermission = await requestAndroidPermission();
        if (!hasPermission) {
          return reject(new Error('Permiso de ubicación denegado'));
        }
      }
      
      // Obtener ubicación
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('GEOLOCATION ERROR', error);
          reject(new Error('No se pudo obtener ubicación'));
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000 
        }
      );
    });
  };

  export const fetchWeatherData = async (coords) => {
    try {
      const response = await fetch(
        `${WEATHER_URL}?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&lang=es&appid=${WEATHER_API_KEY}`
      );
      
      const json = await response.json();
      
      if (json.cod !== 200) {
        throw new Error(json.message || 'Error al obtener datos del clima');
      }
      
      // Retorna los datos relevantes del clima en formato estructurado
      return {
        city: json.name.toUpperCase(),
        temp: json.main.temp.toFixed(1),
        humidity: json.main.humidity,
        desc: json.weather[0].description
      };
    } catch (err) {
      console.warn('WEATHER API ERROR', err);
      throw new Error('Error al obtener datos del clima');
    }
  };
