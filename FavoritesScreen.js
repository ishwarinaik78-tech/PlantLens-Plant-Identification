import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FavoritesContext } from "../src/context/FavoritesContext";
import { normalizeImageSource } from "../src/utils/imageHelper";

export default function FavoritesScreen() {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);

  // Convert object → array
  const favoriteList = Object.values(favorites);

  const renderItem = ({ item }) => {
    const fadeAnim = new Animated.Value(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        {item.image ? (
          <Image
            source={normalizeImageSource(item.image)}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons
              name="image-off-outline"
              size={42}
              color="#A5D6A7"
            />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>
            {item.info?.length > 60
              ? item.info.substring(0, 60) + "..."
              : item.info}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={24}
            color="#E53935"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌿 Your Saved Plants</Text>

      {favoriteList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="leaf-off" size={85} color="#A5D6A7" />
          <Text style={styles.emptyText}>No saved plants yet</Text>
          <Text style={styles.tipText}>Explore and add your first one 🌱</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8E9",
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B5E20",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 14,
  },
  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 14,
    backgroundColor: "#C8E6C9",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1B5E20",
  },
  category: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    lineHeight: 19,
  },
  deleteButton: {
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 9,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 20,
    color: "#388E3C",
    marginTop: 14,
    fontWeight: "600",
  },
  tipText: {
    fontSize: 15,
    color: "#6B6B6B",
    marginTop: 4,
  },
});
