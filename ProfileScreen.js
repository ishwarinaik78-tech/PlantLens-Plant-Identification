// screens/ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut, updateProfile } from "firebase/auth";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");

  // Refresh info when screen loads
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile(user, { displayName: name });
      Alert.alert("Success", "Profile updated!");
      setEditing(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.replace("Login");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* 🌿 Gradient Header */}
      <LinearGradient
        colors={["#A5D6A7", "#C8E6C9", "#E8F5E9"]}
        style={styles.header}
      >
        <Text style={styles.headerText}>My Profile</Text>
      </LinearGradient>

      {/* 🪴 Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image source={require("../assets/profile.png")} style={styles.avatar} />

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (editing) handleSave();
              setEditing(!editing);
            }}
          >
            <MaterialCommunityIcons
              name={editing ? "check-circle" : "account-edit"}
              size={28}
              color="#2E7D32"
            />
          </TouchableOpacity>
        </View>

        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              placeholderTextColor="#777"
            />

            {/* Email not editable */}
            <TextInput
              style={[styles.input, { backgroundColor: "#ddd" }]}
              value={email}
              editable={false}
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{name || "Your Name"}</Text>
            <Text style={styles.email}>{email}</Text>
          </>
        )}
      </View>

      {/* 🌱 Menu Section */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Favorites")}
        >
          <MaterialCommunityIcons name="heart-outline" size={24} color="#2E7D32" />
          <Text style={styles.menuText}>Saved Plants</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Settings")}
        >
          <MaterialCommunityIcons name="cog-outline" size={24} color="#2E7D32" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("About")}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color="#2E7D32"
          />
          <Text style={styles.menuText}>About PlantLens</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItemLogout} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={24} color="#E53935" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingVertical: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    elevation: 6,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1B5E20",
  },
  profileCard: {
    marginTop: -40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 6,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#C8E6C9",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    padding: 6,
    elevation: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B5E20",
    marginTop: 6,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 2,
  },
  input: {
    backgroundColor: "#F1F8E9",
    width: "100%",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 10,
    fontSize: 16,
    color: "#2E7D32",
    elevation: 1,
  },
  menuSection: {
    width: "90%",
    marginTop: 25,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 7,
    elevation: 2,
  },
  menuItemLogout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 10,
    elevation: 2,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "600",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#E53935",
    fontWeight: "600",
  },
});
