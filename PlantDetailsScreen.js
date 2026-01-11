// screens/PlantDetailsScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FavoritesContext } from "../src/context/FavoritesContext";
import { normalizeImageSource } from "../src/utils/imageHelper";

export default function PlantDetailsScreen({ route, navigation }) {
  const { addToFavorites } = useContext(FavoritesContext);
  const [saving, setSaving] = useState(false);

  const { plant } = route.params || {};
  if (!plant) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>No plant data provided.</Text>
      </View>
    );
  }

  const name = plant.name || plant.species || "Unknown Plant";
  const scientificName = plant.species || "";
  const watering = plant.watering || "Not available";
  const sunlight = plant.sunlight || "Not available";
  const confidence = plant.confidence ? `${plant.confidence}%` : null;

  // normalize image for both types
  const displayImage = normalizeImageSource(plant.image ?? plant.imageUri);

  const saveToFavorites = async () => {
    try {
      setSaving(true);
      addToFavorites({
        id: plant.id ?? Date.now().toString(),
        name,
        info: `${scientificName}\nWatering: ${watering}\nSunlight: ${sunlight}`,
        image: displayImage ?? null,
      });
      setSaving(false);
      Alert.alert("Saved", `${name} added to your favorites.`);
    } catch (e) {
      setSaving(false);
      Alert.alert("Error", "Could not save. Try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {displayImage && <Image source={displayImage} style={styles.image} />}

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        {scientificName ? <Text style={styles.subText}>Scientific: {scientificName}</Text> : null}
        {confidence && <Text style={styles.subText}>Confidence: {confidence}</Text>}
        <Text style={styles.subText}>Watering: {watering}</Text>
        <Text style={styles.subText}>Sunlight: {sunlight}</Text>

        <TouchableOpacity style={styles.saveButton} onPress={saveToFavorites} disabled={saving}>
          <MaterialCommunityIcons name="heart-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>{saving ? "Saving..." : "Save to Favorites"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.scanButton, { backgroundColor: "#2E7D32" }]} onPress={() => navigation.navigate("Identify")}>
          <MaterialCommunityIcons name="leaf" size={20} color="#fff" />
          <Text style={styles.saveText}>Identify Another Plant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9" },
  image: { width: "100%", height: 280, resizeMode: "cover" },
  infoContainer: { padding: 20 },
  name: { fontSize: 28, fontWeight: "700", color: "#1B5E20" },
  subText: { fontSize: 16, color: "#555", marginTop: 6 },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#43A047",
    borderRadius: 30,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  scanButton: {
    flexDirection: "row",
    borderRadius: 30,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});
