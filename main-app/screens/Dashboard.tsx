import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

const API_KEY = "4a12b4480d9a8fa87a921254782d560e";
const CITY = "Mumbai";

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const cards = [
    { name: "Weather", icon: "weather-cloudy", color: "#2196F3", navigateTo: "Weather" },
    { name: "News", icon: "newspaper", color: "#FF9800", navigateTo: "News" },
    { name: "IoT Crop Recommender", icon: "chip", color: "#4CAF50", navigateTo: "Soil" },
    { name: "Consulting", icon: "account-tie", color: "#9C27B0", navigateTo: "Chatbot" },
    { name: "Policies", icon: "file-document", color: "#607D8B", navigateTo: "Policies" },
    { name: "Hydroponic/Aeroponic Farming", icon: "sprout", color: "#009688", navigateTo: "HydroponicFarming" },
    { name: "Detect Plant Disease", icon: "leaf", color: "#8BC34A", navigateTo: "Detectdisease" },
    { name: "Check Weather Forecast", icon: "weather-partly-rainy", color: "#03A9F4", navigateTo: "Forecast" },
  ] as const;

  const [weather, setWeather] = useState<null | {
    temp: number;
    description: string;
    city: string;
  }>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (response.ok) {
          setWeather({
            temp: data.main.temp,
            description: data.weather[0].description,
            city: data.name,
          });
        }
      } catch (err) {
        console.error("Weather fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 🌞";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient colors={["#43A047", "#66BB6A"]} style={styles.header}>
        <Text style={styles.headerTitle}>GrowSure</Text>
        <Text style={styles.greeting}>{getGreeting()}, Farmer!</Text>
      </LinearGradient>

      {/* Cards Grid */}
      <View style={styles.grid}>
        {cards.map((card, idx) => {
          const handlePress = () => {
            if ("navigateTo" in card && card.navigateTo) {
              navigation.navigate(card.navigateTo);
            }
          };

          return (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={handlePress}
              activeOpacity={0.85}
            >
              <View style={[styles.iconCircle, { backgroundColor: card.color }]}>
                <Icon
                  name={card.icon as keyof typeof Icon.glyphMap}
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.cardText}>{card.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Weather Card */}
      <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.weatherCard}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : weather ? (
          <>
            <Icon
              name={
                weather.description.includes("cloud")
                  ? "weather-cloudy"
                  : weather.description.includes("rain")
                  ? "weather-rainy"
                  : weather.description.includes("sun") || weather.description.includes("clear")
                  ? "weather-sunny"
                  : "weather-partly-cloudy"
              }
              size={60}
              color="#fff"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
            <Text style={styles.weatherText}>{weather.description}</Text>
            <Text style={styles.weatherCity}>{weather.city}</Text>
          </>
        ) : (
          <Text style={styles.weatherText}>Weather data not available</Text>
        )}
      </LinearGradient>

      {/* Daily Tip */}
      <View style={styles.tipCard}>
        <Icon name="lightbulb-on" size={32} color="#FFB300" />
        <Text style={styles.tipText}>
          🌾 Tip: Rotate crops regularly & Avoid over-fertilizing.   
        </Text>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F8E9" },

  header: {
    paddingVertical: 30,
    alignItems: "center",
    borderRadius: 20,
    margin: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  greeting: { fontSize: 16, color: "#fff", marginTop: 5 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    paddingVertical: 25,
    borderRadius: 18,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 3,
  },
  cardText: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 4,
  },

  weatherCard: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 15,
    marginVertical: 10,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  weatherTemp: { fontSize: 34, fontWeight: "bold", color: "#fff" },
  weatherText: { textTransform: "capitalize", fontSize: 18, color: "#fff" },
  weatherCity: { fontSize: 15, color: "#E3F2FD" },

  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#444",
    flexShrink: 1,
    lineHeight: 20,
  },
});
