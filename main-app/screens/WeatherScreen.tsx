import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type WeatherScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Weather'>;

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { description: string; icon: string }[];
}

const cities = ['Mumbai', 'Chennai', 'Bengaluru', 'Delhi', 'Noida','Kolkata'];
const API_KEY = '4a12b4480d9a8fa87a921254782d560e';

const WeatherScreen: React.FC = () => {
  const navigation = useNavigation<WeatherScreenNavigationProp>();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const responses = await Promise.all(
          cities.map(city =>
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
              .then(res => res.json())
          )
        );
        setWeatherData(responses);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
        </View>

        {/* Weather Cards in Grid */}
        <View style={styles.weatherGrid}>
          {weatherData.map((city, index) => (
            <LinearGradient
              key={index}
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.weatherCard}
            >
              <Text style={styles.cityName}>{city.name}</Text>
              <Image source={{ uri: getWeatherIcon(city.weather[0].icon) }} style={styles.weatherIcon} />
              <Text style={styles.temperature}>{Math.round(city.main.temp)}°C</Text>
              <Text style={styles.description}>{city.weather[0].description}</Text>
            </LinearGradient>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WeatherScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2196F3',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 15 
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  weatherCard: {
    width: '48%',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 4,
  },
  cityName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 4 
  },
  weatherIcon: { 
    width: 40, 
    height: 40, 
    marginBottom: 4 
  },
  temperature: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 2 
  },
  description: { 
    fontSize: 12, 
    color: '#f0f0f0', 
    textTransform: 'capitalize', 
    textAlign: 'center' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});
