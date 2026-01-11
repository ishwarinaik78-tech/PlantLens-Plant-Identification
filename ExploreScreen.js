// screens/ExploreScreen.js
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
  Linking,
  Animated,
  Pressable,
  TextInput,
  RefreshControl,
} from "react-native";
import { FavoritesContext } from "../src/context/FavoritesContext";
import { fetchPlantImages } from "../src/api/unsplashApi";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");
const IMAGE_PER_PAGE = 20;

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "indoor plants", label: "Indoor" },
  { key: "succulent", label: "Succulents" },
  { key: "flowers", label: "Flowers" },
  { key: "green leaves", label: "Leaves" },
  { key: "trees", label: "Trees" },
];

export default function ExploreScreen() {
  const { addToFavorites, removeFromFavorites, favorites } = useContext(FavoritesContext);

  const [plants, setPlants] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [query, setQuery] = useState("plants");
  const [category, setCategory] = useState("all");

  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // heart animation refs map: { [id]: Animated.Value }
  const heartScales = useRef({}).current;
  const imageLoaded = useRef({}).current; // track loaded images

  // shimmer animation value for placeholders
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const ensureHeartRef = (id) => {
    if (!heartScales[id]) heartScales[id] = new Animated.Value(1);
    return heartScales[id];
  };

  // Start shimmer loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmerAnim]);

  // Build effective query (category overrides if not "all")
  const effectiveQuery = () => {
    if (category && category !== "all") return category + " " + query;
    return query || "plants";
  };

  // fetch helper
  const loadPlants = useCallback(
    async (nextPage = 1, replace = false) => {
      try {
        if (nextPage === 1) setLoading(true);
        else setLoadingMore(true);

        const q = effectiveQuery();
        const result = await fetchPlantImages({
          query: q,
          per_page: IMAGE_PER_PAGE,
          page: nextPage,
        });

        // prefetch images for smoother display (best-effort)
        result.forEach((r) => {
          if (r?.image) Image.prefetch(r.image).catch(() => {});
        });

        if (replace) setPlants(result);
        else if (nextPage === 1) setPlants(result);
        else setPlants((prev) => [...prev, ...result]);

        setPage(nextPage);
      } catch (e) {
        console.log("Error loading images:", e);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, query]
  );

  // initial load + reload when query/category changes
  useEffect(() => {
    // reset page when query/category changes
    loadPlants(1, true);
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // debounced search (300ms)
  const searchTimeout = useRef(null);
  useEffect(() => {
    // wait small delay before searching
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      loadPlants(1, true);
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlants(1, true);
    setRefreshing(false);
  };

  const loadMoreIfNeeded = () => {
    if (!loadingMore && !loading) {
      loadPlants(page + 1);
    }
  };

  const toggleFavorite = (item) => {
    const isFav = !!favorites[item.id];
    const scale = ensureHeartRef(item.id);

    if (!isFav) {
      scale.setValue(0.7);
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
      addToFavorites({
        id: item.id,
        name: item.name,
        image: item.image,
        author: item.author,
      });
    } else {
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.85, duration: 140, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      removeFromFavorites(item.id);
    }
  };

  const openModal = (item) => {
    setActiveItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActiveItem(null);
  };

  const numColumns = 2;
  const imageWidth = WINDOW_WIDTH / 2 - 24;

  const shortCaption = (text) => {
    if (!text) return "Plant";
    const words = text.replace(/\s+/g, " ").trim().split(" ");
    return words.slice(0, 3).join(" ");
  };

  const renderPlaceholder = (key) => {
    const opacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] });
    return (
      <Animated.View key={"ph_" + key} style={[styles.card, { opacity }]}>
        <View style={[styles.image, { width: imageWidth, height: imageWidth * 1.25, backgroundColor: "#e6efe5" }]} />
        <View style={{ height: 18, margin: 10, backgroundColor: "#edf6ee", borderRadius: 6 }} />
      </Animated.View>
    );
  };

  const renderItem = ({ item, index }) => {
    const isFavorite = !!favorites[item.id];
    const scale = ensureHeartRef(item.id);

    return (
      <View style={styles.card}>
        <Pressable onPress={() => openModal(item)}>
          <Image
            source={{ uri: item.image }}
            style={[styles.image, { width: imageWidth, height: imageWidth * 1.25 }]}
            onLoad={() => {
              imageLoaded[item.id] = true;
            }}
          />
        </Pressable>

        <Animated.View style={[styles.heartButton, { transform: [{ scale }] }]}>
          <TouchableOpacity onPress={() => toggleFavorite(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "red" : "white"} />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.caption} numberOfLines={1}>
          {shortCaption(item.name)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search + categories */}
      <View style={styles.headerRow}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="#4CAF50" />
          <TextInput
            placeholder="Search plants..."
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery("")} style={{ padding: 6 }}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.categoriesRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 6 }}>
          {CATEGORIES.map((c) => {
            const active = c.key === category;
            return (
              <TouchableOpacity
                key={c.key}
                style={[styles.categoryBtn, active && styles.categoryBtnActive]}
                onPress={() => {
                  setCategory(c.key);
                  // ensure refresh when switching category
                  loadPlants(1, true);
                }}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* content */}
      {loading ? (
        // show a grid of shimmer placeholders
        <FlatList
          data={Array.from({ length: 6 })}
          renderItem={({ index }) => renderPlaceholder(index)}
          keyExtractor={(_, idx) => "ph_" + idx}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      ) : (
        <FlatList
          data={plants}
          renderItem={renderItem}
          // unique key to avoid duplicate key warning
          keyExtractor={(item, index) => (item.id ? `${item.id}_${index}` : `u_${index}`)}
          numColumns={numColumns}
          onEndReached={loadMoreIfNeeded}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#388E3C" style={{ marginVertical: 20 }} /> : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#388E3C" />}
        />
      )}

      {/* Modal preview */}
      <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
                <MaterialCommunityIcons name="close" size={28} color="#333" />
              </TouchableOpacity>

              {activeItem ? (
                <>
                  <Image source={{ uri: activeItem.image_full || activeItem.image }} style={styles.modalImage} />

                  <View style={styles.modalInfo}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={styles.modalTitle}>{activeItem.name || "Plant"}</Text>

                      <TouchableOpacity onPress={() => toggleFavorite(activeItem)}>
                        <MaterialCommunityIcons
                          name={!!favorites[activeItem.id] ? "heart" : "heart-outline"}
                          size={28}
                          color={!!favorites[activeItem.id] ? "red" : "#333"}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.modalSubtitle}>
                      {activeItem.author ? `Photo by ${activeItem.author}` : "Image source: Unsplash"}
                    </Text>

                    <Text style={styles.modalText}>{activeItem.description || activeItem.name || "No extra description available."}</Text>

                    {activeItem.author_link ? (
                      <TouchableOpacity
                        style={styles.authorLink}
                        onPress={() => {
                          Linking.openURL(activeItem.author_link).catch(() => {});
                        }}
                      >
                        <Text style={styles.authorLinkText}>Open photographer profile</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FFF3",
    padding: 10,
  },
  headerRow: { marginBottom: 8 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: "#2E7D32" },

  categoriesRow: { marginVertical: 8, minHeight: 40 },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    elevation: 2,
  },
  categoryBtnActive: {
    backgroundColor: "#2E7D32",
  },
  categoryText: { color: "#2E7D32", fontWeight: "600" },
  categoryTextActive: { color: "#fff" },

  card: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    marginHorizontal: 4,
  },
  image: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    resizeMode: "cover",
    backgroundColor: "#e6efe5",
  },
  caption: {
    padding: 8,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#2E7D32",
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.28)",
    padding: 6,
    borderRadius: 20,
  },

  /* modal styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 18,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 14,
    maxHeight: WINDOW_HEIGHT - 80,
    overflow: "hidden",
  },
  modalScroll: { paddingBottom: 24 },
  modalClose: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: 4,
  },
  modalImage: {
    width: WINDOW_WIDTH - 36,
    height: (WINDOW_WIDTH - 36) * 0.9,
    resizeMode: "cover",
  },
  modalInfo: { padding: 14 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#1B5E20" },
  modalSubtitle: { marginTop: 6, fontSize: 13, color: "#666" },
  modalText: { marginTop: 12, fontSize: 15, color: "#333", lineHeight: 20 },
  authorLink: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#E8F5E9", borderRadius: 10, alignSelf: "flex-start" },
  authorLinkText: { color: "#2E7D32", fontWeight: "700" },
});
