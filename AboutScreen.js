// screens/AboutScreen.js
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>PlantLens</Text>
        <Text style={styles.subtitle}>Know Nature. Grow Nature. 🌿</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌱 About the App</Text>
        <Text style={styles.sectionText}>
          PlantLens helps you identify, learn, and care for plants using your phone’s camera.
          Just snap a photo, and our intelligent plant recognition system will tell you
          everything about your plant — name, species, and care tips!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Features</Text>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="leaf" size={22} color="#2E7D32" />
          <Text style={styles.featureText}>Identify plants instantly using the camera.</Text>
        </View>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#2E7D32" />
          <Text style={styles.featureText}>Learn care guides and detailed plant info.</Text>
        </View>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="heart" size={22} color="#2E7D32" />
          <Text style={styles.featureText}>Save your favorite plants for quick access.</Text>
        </View>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="account" size={22} color="#2E7D32" />
          <Text style={styles.featureText}>Profile management and personalized experience.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👩‍💻 Developer</Text>
        <Text style={styles.sectionText}>
          Designed and developed with love by <Text style={styles.bold}>Ishwari and Akshata</Text>.  
          Special thanks to open plant databases and APIs like Perenual and Plant.id for
          powering the plant identification feature.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2025 PlantLens. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    borderRadius: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B5E20",
  },
  subtitle: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 20,
  },
  section: {
    marginVertical: 14,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "bold",
    color: "#1B5E20",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#444",
    flexShrink: 1,
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: "#666",
  },
});
