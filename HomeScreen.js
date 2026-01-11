// screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/leaves.png")}  // 🌿 full-screen leaf image you uploaded
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to PlantLens 🌱</Text>
        <Text style={styles.subtitle}>Start exploring your plants today!</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#43A047" }]}
            onPress={() => navigation.navigate("Identify")}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#fff" />
            <Text style={styles.buttonText}>Identify a Plant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2E7D32" }]}
            onPress={() => navigation.navigate("Favorites")}
          >
            <MaterialCommunityIcons name="heart-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Your Saved Plants</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9F5EE", // fallback background
  },

  // 🌿 FULL VISIBILITY BACKGROUND IMAGE
  backgroundImage: {
    opacity: 0.50,          // full visible intensity
    resizeMode: "cover", // cover entire screen
  },

  // Transparent overlay to keep text readable
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.20)", 
    // lower opacity lets the background show more
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1B5E20",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#2e2e2e",
    marginBottom: 40,
    textAlign: "center",
  },

  buttons: {
    width: "100%",
    alignItems: "center",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 15,
    width: "85%",
    marginBottom: 18,
    elevation: 5,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 8,
  },
});
