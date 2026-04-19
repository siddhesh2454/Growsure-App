// screens/DetectDisease.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
  Platform,
  ActionSheetIOS,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { getGeminiAnswer } from "../services/aiServices";
import axios from "axios";

const BASE_URL = "http://172.20.10.2:8001"; // ✅ Leaf backend
const API_URL = `${BASE_URL}/detect`;

const DetectDisease = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lang, setLang] = useState("English");

  // 📸 Open Camera
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required to take pictures.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPreview(result.assets[0].uri);
      setResult(null);
    }
  };

  // 🖼️ Pick from Gallery
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (Platform.OS === "web") {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const file = new File([blob], "leaf.jpg", { type: "image/jpeg" });

        setImage(file);
        setPreview(URL.createObjectURL(blob));
      } else {
        setImage(result.assets[0].uri);
        setPreview(result.assets[0].uri);
      }
      setResult(null);
    }
  };

  // 🧠 Analyze Image
  const analyzeImage = async () => {
    if (!image) {
      Alert.alert("No Image", "Please capture or upload an image first.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      if (Platform.OS === "web" && image instanceof File) {
        formData.append("file", image);
      } else if (Platform.OS === "web") {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "leaf.jpg", { type: "image/jpeg" });
        formData.append("file", file);
      } else {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append("file", {
          uri: image,
          name: "leaf.jpg",
          type: blob.type || "image/jpeg",
        } as any);
      }

      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      let translated = { ...data };

      // 🌐 Structured translation (keep headings same)
      if (lang !== "English") {
        try {
          const translatedDiseases = [];
          for (const d of data.detected_diseases) {
            const textToTranslate = `
Disease Name: ${d.disease}
Causes: ${d.causes}
Solution: ${d.solution}
`;

            const translation = await getGeminiAnswer(
              `Translate ONLY the text below into ${lang}. 
Maintain the same structure with headings: "Disease Name", "Causes", "Solution". 
Do not remove line breaks or numbering. Keep it clean and well-formatted:\n\n${textToTranslate}`,
              "translate",
              lang
            );

            translatedDiseases.push({
              diseaseBlock: translation,
              reference: d.reference,
            });
          }

          translated.detected_diseases_translated = translatedDiseases;
        } catch (err) {
          console.error("❌ Translation error:", err);
          translated.detected_diseases_translated = [
            { diseaseBlock: "⚠️ Translation failed", reference: "" },
          ];
        }
      }

      setResult(translated);
    } catch (error: any) {
      console.error("❌ Backend error:", error.message);
      Alert.alert(
        "Error",
        "Failed to connect to backend. Please check if FastAPI server is running at " + BASE_URL
      );
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>🌿 Detect Plant Disease</Text>
      <Text style={styles.subtitle}>
        Capture or upload a picture of the leaf to detect possible diseases.
      </Text>

      <View style={{ marginVertical: 10 }}>{renderLanguagePicker()}</View>

      {/* Image */}
      <View style={styles.imageContainer}>
        {result?.annotated_image_base64 ? (
          <Image
            source={{ uri: "data:image/jpeg;base64," + result.annotated_image_base64 }}
            style={styles.image}
          />
        ) : preview ? (
          <Image source={{ uri: preview }} style={styles.image} />
        ) : (
          <Ionicons name="leaf-outline" size={100} color="#8BC34A" />
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
          <Ionicons name="camera" size={22} color="#fff" />
          <Text style={styles.captureText}>Capture Leaf</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
          <Ionicons name="images" size={22} color="#fff" />
          <Text style={styles.captureText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Analyze */}
      <TouchableOpacity
        style={[styles.analyzeButton, !preview && { backgroundColor: "#aaa" }]}
        onPress={analyzeImage}
        disabled={loading || !preview}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="analytics" size={22} color="#fff" />
            <Text style={styles.captureText}>Analyze</Text>
          </>
        )}
      </TouchableOpacity>

      {/* 🧠 Results */}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>🧠 Prediction Results</Text>

          {lang === "English"
            ? result.detected_diseases?.map((d: any, index: number) => (
                <View key={index} style={styles.diseaseCard}>
                  <Text style={styles.diseaseName}>
                    {index === 0
                      ? `🟢 Leaf: ${d.disease}`
                      : `🟢 Disease ${index}: ${d.disease}`}
                  </Text>
                  <Text style={styles.resultText}>🔹 Causes: {d.causes}</Text>
                  <Text style={styles.resultText}>🔹 Solution: {d.solution}</Text>
                  <Text
                    style={styles.referenceLink}
                    onPress={() => d.reference && Linking.openURL(d.reference)}
                  >
                    🔹 Reference: {d.reference || "Not available"}
                  </Text>
                </View>
              ))
            : result.detected_diseases_translated?.map((d: any, index: number) => (
                <View key={index} style={styles.diseaseCard}>
                  <Text style={styles.diseaseName}>
                    🟢 {lang} Result {index + 1}
                  </Text>
                  {d.diseaseBlock.split("\n").map((line: string, i: number) => (
                    <Text key={i} style={styles.resultText}>
                      {line.trim()}
                    </Text>
                  ))}
                  <Text
                    style={styles.referenceLink}
                    onPress={() => d.reference && Linking.openURL(d.reference)}
                  >
                    🔹 Reference: {d.reference || "Not available"}
                  </Text>
                </View>
              ))}
        </View>
      )}
    </ScrollView>
  );
};

export default DetectDisease;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: { position: "absolute", top: 50, left: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginTop: 40 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginVertical: 10 },
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
  imageContainer: {
    width: "100%",
    height: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  captureButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  galleryButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  analyzeButton: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    width: "100%",
  },
  captureText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  diseaseCard: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  diseaseName: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#2e7d32" },
  resultText: { fontSize: 14, marginBottom: 4, color: "#000" },
  referenceLink: {
    fontSize: 14,
    color: "blue",
    marginTop: 5,
    textDecorationLine: "underline",
  },
});
