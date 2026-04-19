// screens/PoliciesScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const policies = [
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description:
      "Provides crop insurance to farmers against natural calamities, pests, and diseases. "
      + "It offers financial support when crops are damaged due to drought, flood, or storm. "
      + "The scheme encourages farmers to adopt modern practices without fear of losses.",
    url: "https://pmfby.gov.in/",
  },
  {
    name: "Soil Health Card Scheme",
    description:
      "Helps farmers understand the condition of their soil by testing nutrient levels. "
      + "Farmers receive a detailed report card with recommendations for fertilizer and manure use. "
      + "This improves productivity and reduces the cost of cultivation in the long run.",
    url: "https://soilhealth.dac.gov.in/",
  },
  {
    name: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
    description:
      "Focused on ensuring water for every farm through irrigation facilities. "
      + "Encourages micro-irrigation systems like drip and sprinkler to save water. "
      + "It helps reduce dependence on rainfall and ensures better crop growth.",
    url: "https://pmksy.gov.in/",
  },
  {
    name: "National Agriculture Market (eNAM)",
    description:
      "An online marketplace that connects farmers directly with buyers across India. "
      + "It reduces middlemen and ensures fair prices for agricultural produce. "
      + "The platform also provides transparency, efficiency, and better profit margins.",
    url: "https://enam.gov.in/web/",
  },
  {
    name: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description:
      "Provides funding support to states for agriculture development projects. "
      + "The scheme focuses on innovation, infrastructure, and technology-driven farming. "
      + "It aims to boost farmers’ income by strengthening allied sectors like dairy and fisheries.",
    url: "https://rkvy.nic.in/",
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description:
      "Encourages farmers to adopt organic farming practices across clusters of villages. "
      + "Promotes the use of bio-fertilizers, compost, and natural pesticides. "
      + "The scheme improves soil fertility and provides farmers access to organic markets.",
    url: "https://pgsindia-ncof.gov.in/PKVY/index.aspx",
  },
  {
    name: "Kisan Credit Card (KCC)",
    description:
      "Provides farmers with easy access to short-term credit for agriculture and allied activities. "
      + "Farmers can withdraw money as needed, similar to an ATM card. "
      + "It reduces dependence on informal moneylenders and offers low-interest loans.",
    url: "https://www.pmkisan.gov.in/",
  },
  {
    name: "PM-Kisan Samman Nidhi",
    description:
      "Offers direct income support of ₹6,000 per year to small and marginal farmers. "
      + "The amount is transferred in three equal installments directly into bank accounts. "
      + "This financial help reduces stress and ensures funds for crop inputs and household needs.",
    url: "https://pmkisan.gov.in/",
  },
  {
    name: "National Mission on Sustainable Agriculture (NMSA)",
    description:
      "Promotes eco-friendly farming practices that adapt to climate change. "
      + "It focuses on soil health, water conservation, and integrated farming systems. "
      + "The scheme helps farmers become resilient to droughts, floods, and climate variations.",
    url: "https://agricoop.nic.in/en/divisiontype/nmsa",
  },
  {
    name: "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
    description:
      "A pension scheme that provides ₹3,000 per month to farmers after 60 years of age. "
      + "Farmers contribute a small premium during working years which is matched by the government. "
      + "It ensures social security and financial stability for elderly farmers in rural areas.",
    url: "https://maandhan.in/",
  },
];

const PoliciesScreen = ({ navigation }: any) => {
  const openPolicy = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#43A047" }} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Government Policies</Text>
        </View>

        {/* List of Policies */}
        {policies.map((policy, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => openPolicy(policy.url)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.policyName}>{policy.name}</Text>
              <Text style={styles.description}>{policy.description}</Text>
            </View>
            <Icon name="open-in-new" size={22} color="#43A047" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PoliciesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43A047",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  policyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
});
