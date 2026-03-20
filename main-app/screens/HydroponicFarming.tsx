// screens/HydroponicFarming.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const HydroponicFarming = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hydroponic & Aeroponic Farming</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hydroponic Farming Section */}
        <Text style={styles.sectionTitle}>🌱 What is Hydroponic Farming?</Text>
        <Image
          source={{
            uri: "https://modernfarmer.com/wp-content/uploads/2017/05/hydrorganics.jpg",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.text}>
          Hydroponics is a method of growing plants without soil by using
          nutrient-rich water. Plants are supported in mediums like perlite,
          rockwool, or clay pellets, and nutrients are delivered directly to
          their roots.{"\n\n"}
          ✅ Advantages: Faster growth, higher yields, and up to 90% less water
          use compared to traditional farming.{"\n"}
          ⚠️ Limitations: Requires close monitoring of pH and nutrients, higher
          initial setup cost, and needs power supply.{"\n"}
          🌾 Crops: Lettuce, spinach, tomatoes, cucumbers, peppers, herbs, and
          strawberries grow very well in hydroponics.
        </Text>

        {/* Aeroponic Farming Section */}
        <Text style={styles.sectionTitle}>🌿 What is Aeroponic Farming?</Text>
        <Image
          source={{
            uri: "https://timesofagriculture.in/wp-content/uploads/2024/05/aeroponics-4-1024x576.webp",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.text}>
          Aeroponics is an advanced technique where plants grow with roots
          suspended in air, misted with nutrient solution. This maximizes
          oxygenation and growth speed.{"\n\n"}
          ✅ Advantages: Saves up to 95% water, rapid growth, higher nutrient
          absorption, and space efficiency.{"\n"}
          ⚠️ Limitations: Expensive equipment, requires constant misting, and
          needs technical expertise.{"\n"}
          🌾 Crops: Leafy greens, herbs, medicinal plants, strawberries, and
          high-value vegetables are best suited for aeroponics.
        </Text>

        {/* Comparison Section */}
        <Text style={styles.sectionTitle}>⚖️ Hydroponics vs Aeroponics</Text>
        <View style={styles.compareBox}>
          <Text style={styles.compareText}>
            💧 Water Use: Hydroponics saves ~90%, Aeroponics saves ~95%
          </Text>
          <Text style={styles.compareText}>
            ⚡ Cost: Hydroponics is cheaper, Aeroponics is more expensive
          </Text>
          <Text style={styles.compareText}>
            🌿 Crops: Both grow leafy greens; Aeroponics grows faster
          </Text>
          <Text style={styles.compareText}>
            🔧 Maintenance: Hydroponics is simpler; Aeroponics requires expertise
          </Text>
        </View>

        {/* Setup Guides */}
        <Text style={styles.sectionTitle}>🛠️ How to Set Up?</Text>
        <Text style={styles.text}>
          🔹 Hydroponics Setup:{"\n"}
          1. Tank with nutrient solution{"\n"}
          2. Water pump system{"\n"}
          3. Grow trays with medium (perlite/rockwool){"\n"}
          4. Net pots with plants{"\n"}
          5. Monitoring pH and EC regularly{"\n\n"}
          🔹 Aeroponics Setup:{"\n"}
          1. Root chamber to suspend plants{"\n"}
          2. High-pressure misting system{"\n"}
          3. Timer for regular nutrient spray{"\n"}
          4. Strong power backup{"\n"}
          5. Humidity and oxygen monitoring
        </Text>

        {/* Cost & Suitability */}
        <Text style={styles.sectionTitle}>💰 Cost & Suitability</Text>
        <Text style={styles.text}>
          Hydroponics is relatively cheaper and good for small-scale urban
          farming, rooftop gardens, and greenhouses. Aeroponics, though costly,
          is more profitable for commercial farms growing high-value crops.
        </Text>

        {/* Success Story */}
        <Text style={styles.sectionTitle}>🌾 Success Story</Text>
        <Text style={styles.text}>
          A farmer in Maharashtra adopted hydroponics to grow lettuce indoors.
          With just 20% of land and 10% of water compared to traditional farming,
          he doubled his profits by supplying fresh greens to urban supermarkets.
        </Text>

        {/* Future Scope */}
        <Text style={styles.sectionTitle}>🚀 Future Scope</Text>
        <Text style={styles.text}>
          Hydroponics and Aeroponics are the future of urban farming. They are
          integrated into vertical farming, smart greenhouses, and even space
          missions (NASA uses aeroponics!). With climate change and shrinking
          farmland, these techniques will play a crucial role in food security.
        </Text>

        {/* Blogs and Resources */}
        <Text style={styles.sectionTitle}>📖 Learn More (Blogs & Resources)</Text>
        <View style={styles.blogsContainer}>
          {[
            {
              title: "Hydroponics (USDA)",
              url: "https://www.nal.usda.gov/farms-and-agricultural-production-systems/hydroponics",
            },
            {
              title: "Modern Farming Techniques",
              url: "https://www.indofarm.in/4-popular-modern-farming-methods/",
            },
            {
              title: "Aeroponics Technology",
              url: "https://www.lettusgrow.com/aeroponic-technology",
            },
            {
              title: "Aeroponics in India",
              url: "https://www.nexsel.tech/blog/general-awareness/aeroponics-the-future-of-sustainable-farming-in-india-new-zealand-and-uae.php",
            },
          ].map((blog, index) => (
            <TouchableOpacity
              key={index}
              style={styles.blogCard}
              onPress={() => Linking.openURL(blog.url)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="open-in-new" size={20} color="#4CAF50" />
                <Text style={styles.blogText}>{blog.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* YouTube Videos */}
        <Text style={styles.sectionTitle}>🎥 Watch Videos</Text>
        <View style={styles.blogsContainer}>
          {[
            {
              title: "Hydroponics Basics (YouTube)",
              url: "https://www.youtube.com/watch?v=dY2tKZ6DMdE",
            },
            {
              title: "Aeroponics Explained (YouTube)",
              url: "https://www.youtube.com/watch?v=aRdpB5g4Wl0",
            },
          ].map((video, index) => (
            <TouchableOpacity
              key={index}
              style={styles.blogCard}
              onPress={() => Linking.openURL(video.url)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="youtube" size={20} color="red" />
                <Text style={styles.blogText}>{video.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>❓ FAQs</Text>
        <View style={styles.faqBox}>
          <Text style={styles.faqQ}>
            Q: Which is better, Hydroponics or Aeroponics?
          </Text>
          <Text style={styles.faqA}>
            A: Hydroponics is easier and cheaper for beginners. Aeroponics gives
            faster growth but requires high investment and maintenance.
          </Text>

          <Text style={styles.faqQ}>Q: Do these methods save water?</Text>
          <Text style={styles.faqA}>
            A: Yes! Hydroponics saves ~90% and Aeroponics saves ~95% water
            compared to traditional farming.
          </Text>

          <Text style={styles.faqQ}>Q: Can all plants be grown this way?</Text>
          <Text style={styles.faqA}>
            A: Leafy greens, herbs, and some fruits grow well. Large root crops
            like potatoes are not suitable for these systems.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
export default HydroponicFarming;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 12,
    flexShrink: 1,
  },
  scrollContent: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
    lineHeight: 22,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  compareBox: {
    backgroundColor: "#fff3e0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  compareText: {
    fontSize: 15,
    marginBottom: 6,
    color: "#444",
  },
  blogsContainer: {
    marginBottom: 20,
  },
  blogCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  blogText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "600",
  },
  faqBox: {
    backgroundColor: "#eef6f3",
    padding: 12,
    borderRadius: 10,
    marginBottom: 30,
  },
  faqQ: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  faqA: {
    fontSize: 15,
    color: "#444",
    marginBottom: 6,
  },
});
