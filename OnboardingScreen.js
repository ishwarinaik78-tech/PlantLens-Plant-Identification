// screens/OnboardingScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "one",
    title: "Identify Plants Easily",
    subtitle: "Snap a picture and learn the plant’s name and care tips.",
    image: require("../assets/onboard1.png"), // add a friendly image in assets
  },
  {
    key: "two",
    title: "Daily Care Tips",
    subtitle: "Short plant tips to help your plants thrive every day.",
    image: require("../assets/onboard2.png"),
  },
  {
    key: "three",
    title: "Track Your Garden",
    subtitle: "Save favorites and get reminders for watering and care.",
    image: require("../assets/onboard3.png"),
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

  const onNext = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else onDone();
  };

  const onSkip = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("Landing");
  };

  const onDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("Landing");
  };

  const slide = slides[index];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageWrapper}>
        {/* If you don't have these images in assets, replace with a placeholder Image or simple colored view */}
        <Image source={slide.image} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pips}>
          {slides.map((s, i) => (
            <View key={s.key} style={[styles.pip, i === index ? styles.pipActive : null]} />
          ))}
        </View>

        <TouchableOpacity onPress={onNext} style={styles.nextButton}>
          <Text style={styles.nextText}>{index < slides.length - 1 ? "Next" : "Get Started"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const THEME = "#2E7D32";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topRow: { padding: 18, alignItems: "flex-end" },
  skip: { color: "#666", fontSize: 14 },
  imageWrapper: { flex: 0.6, justifyContent: "center", alignItems: "center" },
  image: { width: width * 0.75, height: width * 0.75 },
  content: { flex: 0.2, paddingHorizontal: 28 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", color: THEME },
  subtitle: { fontSize: 16, color: "#444", marginTop: 12, textAlign: "center" },
  footer: { flex: 0.2, paddingHorizontal: 28, justifyContent: "center" },
  pips: { flexDirection: "row", justifyContent: "center", marginBottom: 14 },
  pip: { width: 8, height: 8, borderRadius: 6, backgroundColor: "#E0E0E0", marginHorizontal: 6 },
  pipActive: { backgroundColor: THEME, width: 18 },
  nextButton: {
    backgroundColor: THEME,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
