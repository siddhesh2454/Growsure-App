import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ Added SafeAreaView

const API_KEY = "4a12b4480d9a8fa87a921254782d560e";
const CITY = "Mumbai";

interface ForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string }[];
}

const ForecastScreen: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [hourly, setHourly] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();

      const dailyForecast: ForecastItem[] = [];
      const addedDates = new Set<string>();
      data.list.forEach((item: ForecastItem) => {
        const [date, time] = item.dt_txt.split(" ");
        if (time === "12:00:00" && !addedDates.has(date)) {
          dailyForecast.push(item);
          addedDates.add(date);
        }
      });
      setForecast(dailyForecast.slice(0, 5));
      setHourly(data.list.slice(0, 8));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (description: string) => {
    if (description.includes("cloud")) return "weather-cloudy";
    if (description.includes("rain")) return "weather-rainy";
    if (description.includes("sun") || description.includes("clear")) return "weather-sunny";
    return "weather-partly-cloudy";
  };

  const getDay = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
  const getTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getCropRecommendations = () => {
    if (!forecast.length) return ["Data not available"];
    const avgTemp = forecast.reduce((sum, item) => sum + item.main.temp, 0) / forecast.length;
    const rainCount = forecast.filter((item) => item.weather[0].description.includes("rain")).length;

    const crops: { name: string; score: number }[] = [
      { name: "Rice 🌾", score: 0 },
      { name: "Jute 🌱", score: 0 },
      { name: "Millet 🌽", score: 0 },
      { name: "Maize 🌽", score: 0 },
      { name: "Cotton 🌿", score: 0 },
      { name: "Wheat 🌾", score: 0 },
      { name: "Soybean 🌾", score: 0 },
      { name: "Potato 🥔", score: 0 },
      { name: "Barley 🌾", score: 0 },
      { name: "Peas 🥬", score: 0 },
      { name: "Vegetables 🥦", score: 0 },
      { name: "Pulses 🌱", score: 0 },
    ];

    crops.forEach((crop) => {
      if (["Rice 🌾", "Jute 🌱"].includes(crop.name) && rainCount >= 2) crop.score += 3;
      if (["Millet 🌽", "Maize 🌽", "Cotton 🌿"].includes(crop.name) && avgTemp > 30) crop.score += 3;
      if (["Wheat 🌾", "Rice 🌾", "Soybean 🌾"].includes(crop.name) && avgTemp >= 20 && avgTemp <= 30)
        crop.score += 3;
      if (["Potato 🥔", "Barley 🌾", "Peas 🥬"].includes(crop.name) && avgTemp < 20) crop.score += 3;
      if (["Vegetables 🥦", "Pulses 🌱"].includes(crop.name)) crop.score += 1;
    });

    return crops
      .sort((a, b) => b.score - a.score)
      .filter((c) => c.score > 0)
      .map((c) => c.name)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#43A047" />
      </View>
    );
  }

  const cropList = getCropRecommendations();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView style={styles.container}>
        {/* ✅ Safe Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

        {/* 24-Hour Forecast */}
        <Text style={styles.title}>24-Hour Forecast ⏰</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
        >
          {hourly.map((item, index) => (
            <View key={index} style={styles.hourlyCard}>
              <Text style={styles.day}>{getTime(item.dt_txt)}</Text>
              <Icon
                name={getWeatherIcon(item.weather[0].description)}
                size={30}
                color="#2196F3"
                style={{ marginVertical: 6 }}
              />
              <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
              <Text style={styles.desc}>{item.weather[0].description}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 5-Day Forecast */}
        <Text style={styles.title}>5-Day Forecast 🌦️</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
        >
          {forecast.map((item, index) => (
            <View key={index} style={styles.dailyCard}>
              <Text style={styles.day}>{getDay(item.dt_txt)}</Text>
              <Icon
                name={getWeatherIcon(item.weather[0].description)}
                size={40}
                color="#2196F3"
                style={{ marginVertical: 8 }}
              />
              <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
              <Text style={styles.desc}>{item.weather[0].description}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Crop Suggestions */}
        <Text style={[styles.title, { marginTop: 5 }]}>Top Crop Suggestions 🌱</Text>
        <View style={styles.cropCard}>
          {cropList.map((crop, index) => (
            <Text key={index} style={styles.crops}>
              {index + 1}. {crop}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForecastScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingVertical: 20 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43A047",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  backButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8, paddingTop: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, marginTop: 4, paddingHorizontal: 16, paddingVertical: 15 },
  horizontalContainer: { paddingHorizontal: 8, paddingBottom: 12 },
  hourlyCard: {
    backgroundColor: "#fff",
    width: 100,
    marginHorizontal: 6,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dailyCard: {
    backgroundColor: "#fff",
    width: 140,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cropCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 16,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  day: { fontSize: 14, fontWeight: "bold", color: "#333", textAlign: "center" },
  temp: { fontSize: 22, fontWeight: "bold", marginVertical: 6 },
  desc: { fontSize: 12, textTransform: "capitalize", color: "#555", textAlign: "center" },
  crops: { fontSize: 16, fontStyle: "italic", color: "#4CAF50", textAlign: "left", marginVertical: 2 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
