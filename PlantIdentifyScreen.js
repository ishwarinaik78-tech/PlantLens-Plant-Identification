// screens/PlantIdentifyScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { identifyPlant } from "../src/api/plantNetApi";
import { getPlantDetails } from "../src/api/perenualApi";

export default function PlantIdentifyScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plantInfo, setPlantInfo] = useState(null);

  const getFallbackInfo = (name) => {
    if (!name) return {};

    const n = name.toLowerCase();

    const db = {
      rose: {
        watering: "Water 2–3 times a week; keep soil moist.",
        sunlight: "Requires 6 hours of direct sunlight.",
        tips: "Prune regularly for continuous blooming.",
      },
      periwinkle: {
        watering: "Water when soil becomes dry.",
        sunlight: "Prefers partial to full sunlight.",
        tips: "Avoid overwatering to prevent fungus.",
      },
      money: {
        watering: "Water weekly; allow soil to dry between watering.",
        sunlight: "Grows well in indirect bright light.",
        tips: "Vine grows longer with regular trimming.",
      },
      tulsi: {
        watering: "Water daily in summer, less in winter.",
        sunlight: "Needs 4–6 hours of sunlight daily.",
        tips: "Pinch flowers early for more leaf growth.",
      },
    };

    for (let key in db) {
      if (n.includes(key)) return db[key];
    }

    return {
      watering: "Water when the top soil feels dry.",
      sunlight: "Place in bright indirect sunlight.",
      tips: "Avoid overwatering. Check soil weekly.",
    };
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPlantInfo(null);
    }
  };

  const identify = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const identified = await identifyPlant(image);
      if (!identified || !identified.species) {
        Alert.alert("Not identified", "No confident result. Try a clearer photo.");
        setLoading(false);
        return;
      }

      const details = await getPlantDetails(identified.species);

      const fallback = getFallbackInfo(identified.name || identified.species);

      const merged = {
        id: Date.now().toString(),
        name: identified.name || details?.common_name || identified.species,
        species: identified.species,
        confidence: identified.confidence,
        watering: details?.watering || fallback.watering,
        sunlight: details?.sunlight || fallback.sunlight,
        tips: fallback.tips,
        image: details?.image ?? null,
        imageUri: image,
        rawIdentify: identified.raw,
        rawPerenual: details?.raw ?? null,
      };

      setPlantInfo(merged);
      navigation.navigate("PlantDetails", { plant: merged });
    } catch (error) {
      console.error("Identify error:", error);
      Alert.alert("Error", error.message || "Could not identify plant. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/leaves.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.5 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🌱 Identify Your Plant</Text>

        <View style={styles.iconRow}>
          <MaterialCommunityIcons name="leaf" size={36} color="#388E3C" />
          <MaterialCommunityIcons name="flower" size={36} color="#66BB6A" />
          <MaterialCommunityIcons name="sprout" size={36} color="#81C784" />
        </View>

        <Text style={styles.subtitle}>
          Capture or upload a photo to identify your plant instantly.
        </Text>

        {/* ⭐ Updated Gallery button only */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <MaterialCommunityIcons name="image" size={26} color="#fff" />
            <Text style={styles.btnText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}

        <TouchableOpacity
          style={[styles.identifyButton, { opacity: image ? 1 : 0.6 }]}
          onPress={identify}
          disabled={!image || loading}
        >
          <Text style={styles.identifyText}>
            {loading ? "Identifying..." : "Identify Plant"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 25 }} />
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#F9FFF6",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1B5E20",
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#558B2F",
    textAlign: "center",
    marginBottom: 18,
    paddingHorizontal: 15,
      fontWeight: "700",  
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 22,
  },

  // ⭐ Updated ONLY this button style
  button: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 26,   // increased width
    paddingVertical: 14,     // increased height
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
  },

  // ⭐ Slightly larger text
  btnText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "700",
    fontSize: 16,
  },

  imageWrapper: {
    elevation: 4,
    borderRadius: 14,
    overflow: "hidden",
  },
  image: {
    width: 270,
    height: 270,
    borderRadius: 14,
    marginVertical: 15,
  },
  identifyButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 30,
    paddingHorizontal: 40,
    marginTop: 10,
    elevation: 5,
  },
  identifyText: { color: "#fff", fontWeight: "700", fontSize: 17 },
});
