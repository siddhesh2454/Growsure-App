import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  ActionSheetIOS,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { getGeminiAnswer } from "../services/aiServices";
import { SafeAreaView } from "react-native-safe-area-context";


const BASE_URL = "http://172.20.10.2:8000"; // ⚠️ Replace with your backend IP if needed

// 📚 Soil Information
const SOIL_INFO: Record<string, string> = {
  "Alluvial Soil":
    "Alluvial soil is one of India's most fertile types, found mainly in river plains such as the Ganga and Brahmaputra. It is rich in potash and lime, ideal for growing rice, wheat, and sugarcane. Its fine texture and good moisture retention make it excellent for agriculture year-round.",
  "Black Soil":
    "Black soil, also called Regur soil, is common in Maharashtra and Madhya Pradesh. It is moisture-retentive and rich in iron and lime, making it perfect for cotton and soybean cultivation. Its self-ploughing nature helps crops even in dry conditions.",
  "Red Soil":
    "Red soil is found in southern and eastern India and is formed from weathered crystalline rocks. It has good drainage and aeration but low nitrogen and organic matter, requiring fertilizers for better productivity. Crops like millets, pulses, and groundnuts thrive in it.",
  "Laterite Soil":
    "Laterite soil is rich in iron and aluminum and is found in high rainfall regions like Kerala, Karnataka, and Assam. It becomes hard when dry but is suitable for crops like tea, coffee, and cashew. Adding organic manure improves its fertility significantly.",
  "Arid Soil":
    "Arid soil occurs in desert regions of Rajasthan and Gujarat. It is sandy, saline, and poor in moisture but suitable for drought-resistant crops like barley and bajra. Proper irrigation and gypsum treatment can enhance its fertility.",
  "Clay Soil":
    "Clay soil has very fine particles that retain moisture and nutrients well. It is heavy, sticky when wet, and cracks when dry. With proper drainage and organic matter addition, it supports crops like rice, jute, and sugarcane effectively."
};

// 🌾 Crop Suitability Mapping (auto-generated from mapping.json)
const CROP_INFO: Record<string, Record<string, string>> = {
  "Alluvial Soil": {
  Rice:
    "Rice thrives in alluvial soil because of its high fertility, smooth texture, and excellent moisture-holding capacity. Found mainly in river plains, this soil supports dense paddy fields and ensures high grain yield with minimal fertilizer use.",
  Wheat:
    "Wheat grows well in well-drained alluvial soil that provides a balanced mix of sand, silt, and clay. Its rich nutrient content and moderate moisture support uniform germination, healthy tillering, and high-quality grains.",
  Sugarcane:
    "Sugarcane flourishes in deep, fertile alluvial soils with abundant organic matter and good drainage. The soil’s water-retaining capacity and nutrient richness help in producing thick, juicy, and high-sugar-content stalks.", 
  Pulses:
    "Pulses perform well in light, well-aerated alluvial soils that maintain balanced moisture and fertility. The soil’s fine texture promotes root nodulation and nitrogen fixation, improving both yield and soil health for future crops."
},
  "Black Soil": {
  Cotton:
    "Cotton suits black soil because of its excellent moisture retention and rich mineral content, ideal for long growth cycles. The soil’s clayey texture supports deep root development and provides essential nutrients, resulting in high-quality cotton fibers.",
  Soybean:
    "Soybean thrives in the deep, clayey structure of black soil, which helps maintain steady moisture and nutrient supply. The soil’s fertility and good water-holding capacity promote healthy pods and higher oil content in the seeds.",
  Groundnut:
    "Groundnut grows well in well-drained black soil that is rich in lime, iron, and calcium. These minerals support strong pod formation, while the soil’s balanced moisture helps in uniform and healthy seed development.",
  Sunflower:
    "Sunflower adapts easily to black soil because of its mineral richness and moderate alkalinity. The soil’s depth allows robust root growth, supporting tall plants with large, bright blooms and oil-rich seeds."
},
  "Clay Soil": {
  Rice:
    "Rice grows excellently in clay soil because of its high water-holding capacity and compact structure, which create ideal flooded conditions for paddy cultivation. The soil’s ability to retain nutrients also supports vigorous plant growth and higher grain yield.",
  Jute:
    "Jute prefers moisture-rich clay soil found in monsoon regions, where consistent water availability supports tall plant growth. The sticky nature of clay soil helps jute roots anchor firmly, resulting in strong, high-quality fibers.",
  Sugarcane:
    "Sugarcane benefits greatly from clay soil’s rich nutrient content and strong moisture retention. The soil keeps the roots hydrated and nourished throughout the growing season, leading to thick, juicy, and high-yielding stalks."
},
  "Laterite Soil": {
  Cashew: 
    "Cashew is ideal for laterite soil as it tolerates acidity and grows well in the porous, well-drained structure. The soil prevents waterlogging and supports strong root development, making it perfect for dry coastal and hilly regions.",
  Tea: 
    "Tea plantations thrive in laterite soil’s acidic and iron-rich nature, which promotes healthy leaf growth. The well-drained hilly slopes help maintain moisture balance and prevent root diseases, ideal for tea cultivation.",
  Coffee: 
    "Coffee grows best in laterite soil due to its low pH and rich iron content. This soil ensures proper drainage and aeration, helping coffee plants produce high-quality beans, especially in southern India.",
  Rubber: 
    "Rubber trees grow well in humid regions with laterite soil, benefiting from its excellent drainage and mineral richness. The soil’s porous texture supports deep root growth and helps sustain healthy latex production."

  },
  "Red Soil": {
  Millets:
    "Millets thrive in red soil because it is well-drained and slightly sandy, making it perfect for crops that need less water. The soil’s warmth and low moisture retention help the plants grow steadily even in dry regions.",
  Groundnut:
    "Groundnut grows well in red soil due to its sandy and loose structure, which allows proper aeration for root and pod development. The soil also warms up quickly, promoting healthy flowering and seed formation.",
  Potato:
    "Potato cultivation benefits from red soil’s loose and well-drained texture that allows tubers to expand easily. The soil prevents water stagnation and helps produce clean, healthy potatoes with better yield.",
  Pulses:
    "Pulses adapt easily to red soil’s moderate fertility and porous nature, which supports good root aeration. The soil also aids nitrogen fixation, improving soil health and productivity for the next crop cycle."
},
  "Arid Soil": {
  Bajra:
    "Bajra grows excellently in arid soil as it can tolerate salinity, drought, and extreme heat. Its deep roots help it access moisture from lower soil layers, making it a reliable crop for dry desert regions.",
  
  Jowar:
    "Jowar suits arid soil because of its strong, deep root system that enables it to survive with minimal water. It performs well in hot and dry climates, producing stable yields even under moisture stress.",
  
  Guar:
    "Guar thrives in sandy arid soils with very little water and high temperatures. It is a drought-resistant crop that enriches the soil with nitrogen, making it suitable for semi-desert and desert areas.",
  
  Cumin:
    "Cumin performs well in arid soils, especially in the dry regions of Rajasthan. It prefers sunny weather and low humidity, which help the seeds mature with rich flavor and high oil content."
},
};

export default function SoilScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [translated, setTranslated] = useState<string | null>(null);
  const [lang, setLang] = useState("English");

  // 📸 Pick Image
  const pickImage = async (fromCamera: boolean) => {
    try {
      let picked;
      if (fromCamera) {
        await ImagePicker.requestCameraPermissionsAsync();
        picked = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 1 });
      } else {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 1 });
      }

      if (!picked.canceled && picked.assets?.length > 0) {
        setImageUri(picked.assets[0].uri);
        setResult(null);
        setTranslated(null);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Unable to open camera or gallery.");
    }
  };

  // 🧠 Analyze and Translate
  const analyzeImage = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please capture or upload a soil image first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setTranslated(null);

    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const file = new File([blob], "soil_image.jpg", { type: blob.type || "image/jpeg" });
        formData.append("file", file);
      } else {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append("file", {
          uri: imageUri,
          name: "soil_image.jpg",
          type: blob.type || "image/jpeg",
        } as any);
      }

      const res = await axios.post(`${BASE_URL}/recommend-crops`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      setResult(data);

      if (lang !== "English") {
        const textToTranslate = `
🧩 Soil Type: ${data.predicted_soil}
pH Level: ${data.sensor_data?.ph}
Moisture: ${data.sensor_data?.soil ?? data.sensor_data?.moisture}%
Temperature: ${data.sensor_data?.temperature}°C

🌍 About Soil:
${SOIL_INFO[data.predicted_soil] || "No description available."}

🌾 Recommended Crops:
${data.recommended_crops
  .map(
    (crop: string) =>
      `• ${crop}: ${
        CROP_INFO[data.predicted_soil]?.[crop] ||
        "This crop grows well in this soil under suitable conditions."
      }`
  )
  .join("\n")}
`;

        const translation = await getGeminiAnswer(
          `Translate ONLY the text below into ${lang}. 
Keep the same structure, headings, and bullet points. 
Do NOT summarize or add anything — preserve formatting:\n\n${textToTranslate}`,
          "translate",
          lang
        );
        setTranslated(translation);
      }
    } catch (error: any) {
      console.error("❌ Error uploading file:", error.message);
      Alert.alert("Upload Failed", "Please ensure the backend is running and reachable.");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Language Picker
  const openIosLanguagePicker = () => {
    const options = ["English", "Hindi", "Marathi", "Cancel"];
    ActionSheetIOS.showActionSheetWithOptions(
      { options, cancelButtonIndex: 3 },
      (buttonIndex) => {
        if (buttonIndex >= 0 && buttonIndex < 3) setLang(options[buttonIndex]);
      }
    );
  };

  const renderLanguagePicker = () =>
    Platform.OS === "ios" ? (
      <TouchableOpacity style={styles.langButton} onPress={openIosLanguagePicker}>
        <Text style={styles.langText}>{lang}</Text>
        <Ionicons name="chevron-down" size={18} color="#000" />
      </TouchableOpacity>
    ) : (
      <View style={styles.langDropdown}>
        <Picker
          selectedValue={lang}
          style={{ height: 40, color: "#000" }}
          dropdownIconColor="#000"
          onValueChange={(value) => setLang(value)}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Hindi" value="Hindi" />
          <Picker.Item label="Marathi" value="Marathi" />
        </Picker>
      </View>
    );

  // ================== UI ==================
  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f9f4" }}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🌱 Live Soil Analysis & Crop Recommendation</Text>
      </View>

      <View style={styles.langPickerContainer}>{renderLanguagePicker()}</View>

      {/* Image Box */}
      <View style={styles.imageBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Ionicons name="leaf-outline" size={100} color="#8bc34a" />
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={() => pickImage(true)}>
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.buttonText}> Capture </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={() => pickImage(false)}>
          <Ionicons name="image" size={20} color="#fff" />
          <Text style={styles.buttonText}> Upload </Text>
        </TouchableOpacity>
      </View>

      {/* Analyze */}
      {imageUri && !loading && (
        <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
          <Ionicons name="analytics" size={20} color="#fff" />
          <Text style={styles.buttonText}> Analyze </Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#1b5e20" style={{ marginTop: 20 }} />}

      {/* Results */}
      {result && result.status === "success" && (
        <View style={styles.resultContainer}>
          <Text style={styles.sectionTitle}>🧠 Soil Analysis Report</Text>

          {lang === "English" ? (
            <>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>🧩 Soil Details</Text>
                <Text style={styles.boxText}>Soil Type: {result.predicted_soil}</Text>
                <Text style={styles.boxText}>pH: {result.sensor_data?.ph}</Text>
                <Text style={styles.boxText}>
                  Moisture: {result.sensor_data?.soil ?? result.sensor_data?.moisture}%
                </Text>
                <Text style={styles.boxText}>
                  Temperature: {result.sensor_data?.temperature}°C
                </Text>
              </View>

              <View style={styles.box}>
                <Text style={styles.boxTitle}>🌍 About Soil</Text>
                <Text style={styles.boxText}>
                  {SOIL_INFO[result.predicted_soil] || "No description available."}
                </Text>
              </View>

              <View style={styles.box}>
                <Text style={styles.boxTitle}>🌾 Recommended Crops</Text>
                {result.recommended_crops.map((crop: string, i: number) => (
                  <Text key={i} style={styles.boxText}>
                    • {crop}:{" "}
                    {CROP_INFO[result.predicted_soil]?.[crop] ||
                      "This crop grows well in this soil."}
                  </Text>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.translatedBox}>
              <Text style={styles.boxTitle}>🌐 Translated Report ({lang})</Text>
              <Text style={styles.translatedText}>{translated || "Translating..."}</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  </SafeAreaView>
);
}
// ============ Styles ============
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f4f9f4", alignItems: "center", paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b5e20",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { marginRight: 10 },
  headerTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  langPickerContainer: { marginVertical: 10, alignSelf: "center" },
  langDropdown: {
    width: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  langButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    width: 150,
    justifyContent: "space-between",
  },
  langText: { fontSize: 14, color: "#000" },
  imageBox: {
    width: "90%",
    height: 230,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 20 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginBottom: 10 },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cameraButton: { backgroundColor: "#4caf50" },
  galleryButton: { backgroundColor: "#f9a825" },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e7d32",
    paddingVertical: 12,
    borderRadius: 10,
    width: "90%",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  resultContainer: { width: "90%", marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1b5e20", marginBottom: 10 },
  box: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  boxTitle: { fontWeight: "bold", fontSize: 15, color: "#2e7d32", marginBottom: 5 },
  boxText: { fontSize: 14, color: "#333", marginBottom: 4 },
  translatedBox: {
    backgroundColor: "#fffef3",
    borderRadius: 12,
    padding: 15,
    borderWidth: 0.5,
    borderColor: "#f1d17b",
  },
  translatedText: { fontSize: 15, color: "#000", lineHeight: 22 },
});
