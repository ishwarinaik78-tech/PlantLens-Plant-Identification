// screens/LandingScreen.js
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function LandingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />

      <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />

      <Text style={styles.appName}>PlantLens</Text>
      <Text style={styles.tagline}>Identify and save your plants — fast and simple 🌿</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.signupText}>Create Account</Text>
      </TouchableOpacity>

      {/* ✅ Now clickable to open About Screen */}
      <TouchableOpacity onPress={() => navigation.navigate("About")}>
        <Text style={styles.aboutText}>About PlantLens</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F5EE",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#43A047", opacity: 0.1 },
  logo: { width: width * 0.4, height: width * 0.4, marginBottom: 10 },
  appName: { fontSize: 36, fontWeight: "bold", color: "#2E7D32", marginBottom: 4 },
  tagline: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 30,
    marginBottom: 40,
    opacity: 0.8,
  },
  loginButton: {
    backgroundColor: "#43A047",
    paddingVertical: 14,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginBottom: 14,
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  signupButton: {
    borderColor: "#43A047",
    borderWidth: 1.5,
    paddingVertical: 13,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginBottom: 40,
  },
  signupText: { color: "#2E7D32", fontSize: 18, fontWeight: "600" },
  aboutText: { fontSize: 13, color: "#2E7D32", opacity: 0.8, textDecorationLine: "underline" },
});
