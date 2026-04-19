// screens/NewsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const NewsScreen = () => {
  const navigation = useNavigation();

  const news = [
    {
      title: "PM-Kisan Scheme: Farmers to Receive Next Installment Soon",
      description:
        "The government will release the 16th installment of the PM-Kisan scheme directly into farmers' bank accounts. " +
        "This income support scheme provides ₹6,000 annually in three installments. " +
        "It aims to reduce financial stress for small and marginal farmers across India.",
      url: "https://pmkisan.gov.in/",
    },
    {
      title: "New Subsidy Policy for Solar Pumps",
      description:
        "Farmers can now get up to 60% subsidy on installing solar water pumps. " +
        "This initiative aims to encourage renewable energy use and reduce electricity costs. " +
        "The move will ensure sustainable irrigation even in areas with poor power supply.",
      url: "https://mnre.gov.in/",
    },
    {
      title: "Minimum Support Price (MSP) Hike",
      description:
        "The government has increased the Minimum Support Price (MSP) for wheat and paddy. " +
        "This decision will ensure farmers get better returns for their produce this Rabi season. " +
        "It also strengthens income security and encourages food grain production.",
      url: "https://agricoop.nic.in/",
    },
    {
      title: "Kisan Credit Card (KCC) Expansion",
      description:
        "The Kisan Credit Card scheme has been expanded to include more farmers under its coverage. " +
        "Loan approvals will now be faster, ensuring timely access to funds. " +
        "This helps farmers meet cultivation expenses and reduce reliance on moneylenders.",
      url: "https://pmkisan.gov.in/",
    },
    {
      title: "Fertilizer Subsidy Extended",
      description:
        "The government has extended subsidies on fertilizers to reduce farmers’ input costs. " +
        "This ensures affordable access to essential nutrients like urea and DAP. " +
        "The extension aims to maintain soil fertility and improve crop yields.",
      url: "https://fert.nic.in/",
    },
    {
      title: "Crop Insurance Scheme Updates",
      description:
        "The Pradhan Mantri Fasal Bima Yojana (PMFBY) has been revised to cover more crops. " +
        "It offers farmers wider protection against losses from natural disasters. " +
        "The updated scheme ensures financial stability during uncertain weather conditions.",
      url: "https://pmfby.gov.in/",
    },
    {
      title: "eNAM Expands to More Mandis",
      description:
        "The National Agriculture Market (eNAM) has added over 100 new mandis across states. " +
        "This digital platform helps farmers sell produce online with better transparency. " +
        "It reduces middlemen and ensures farmers get fair market prices.",
      url: "https://enam.gov.in/",
    },
    {
      title: "Organic Farming Mission",
      description:
        "The government has launched new schemes to promote organic farming practices. " +
        "Farmers will receive training, certification, and subsidies to adopt eco-friendly methods. " +
        "This mission aims to improve soil health and boost demand for organic produce.",
      url: "https://pgsindia-ncof.gov.in/",
    },
    {
      title: "Soil Health Card Scheme",
      description:
        "The Soil Health Card Scheme continues to provide farmers with detailed soil nutrient reports. " +
        "It guides them on using the right fertilizers in correct quantities. " +
        "This reduces costs and increases productivity through better soil management.",
      url: "https://soilhealth.dac.gov.in/",
    },
    {
      title: "Atmanirbhar Bharat in Agriculture",
      description:
        "New policies under Atmanirbhar Bharat are boosting innovation in agri-tech. " +
        "The focus is on modern farming methods, digital platforms, and rural infrastructure. " +
        "These reforms aim to make Indian agriculture more self-reliant and globally competitive.",
      url: "https://agricoop.nic.in/",
    },
  ];

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#43A047" }} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* ✅ Header with Back */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
            <Text style={styles.headerText}>News</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ News List */}
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {news.map((item, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => openLink(item.url)}>
              <View style={styles.textBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <Icon name="open-in-new" size={24} color="#43A047" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43A047", // ✅ Same green as Policies
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  textBox: { flex: 1, marginRight: 10 },
  title: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  description: { fontSize: 14, color: "#666", lineHeight: 18 },
});
