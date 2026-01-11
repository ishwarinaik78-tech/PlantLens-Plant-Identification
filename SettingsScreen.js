// screens/SettingsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function SettingsScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
      else setUserEmail("");
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have successfully logged out.");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings ⚙️</Text>

      {/* 👤 Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingItem}>
          <MaterialCommunityIcons name="account" size={24} color="#2E7D32" />
          <Text style={styles.settingText}>{userEmail || "Guest User"}</Text>
        </View>
      </View>

      {/* 🌗 Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingItem}>
          <MaterialCommunityIcons name="theme-light-dark" size={24} color="#2E7D32" />
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={(value) => setIsDarkMode(value)}
            thumbColor={isDarkMode ? "#43A047" : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: "#A5D6A7" }}
          />
        </View>
      </View>

      {/* 🚪 Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={22} color="#fff" />
          <Text style={styles.actionText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#2E7D32" }]}
          onPress={() => navigation.navigate("About")}
        >
          <MaterialCommunityIcons name="information-outline" size={22} color="#fff" />
          <Text style={styles.actionText}>About App</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>App Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9", padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#2E7D32", marginBottom: 10 },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingText: { flex: 1, marginLeft: 10, fontSize: 16, color: "#333" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#43A047",
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 10,
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  versionText: { textAlign: "center", color: "#666", fontSize: 13, marginTop: 10 },
});
