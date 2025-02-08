import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Icon Library
import Colors from "../../Utils/Theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import Logo from "../../assets/logo.svg"; // Assuming you have an SVG logo

// Define categories and sample items
type CategoryType = "Household" | "Mens" | "Womens" | "Gadgets" | "Automotive";

const categories: CategoryType[] = ["Household", "Mens", "Womens", "Gadgets", "Automotive"];

const sampleItems: Record<CategoryType, string[]> = {
  Household: ["Chair", "Table", "Lamp", "Sofa", "Bed"],
  Mens: ["Shirt", "Pants", "Shoes", "Watch"],
  Womens: ["Dress", "Handbag", "Heels", "Jewelry"],
  Gadgets: ["Smartphone", "Laptop", "Headphones", "Camera"],
  Automotive: ["Car Tires", "Car Battery", "Helmet"],
};

const HomeScreen: React.FC = () => {
  const theme = useColorScheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("Household");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text>Logo</Text>
        {/* <Logo width={120} height={40} /> */}
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
        <Ionicons name="search-outline" size={24} color="gray" />
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="gray" />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryItem,
              selectedCategory === category && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && { color: "#FFF" }]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Ad View */}
      <View style={styles.adView}>
        <Text style={styles.adText}>🔥 Special Deals! Up to 50% OFF</Text>
      </View>

      {/* Household Items Scroll (Only shows when 'Household' is selected) */}
      {selectedCategory === "Household" && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.householdScroll}>
          {sampleItems.Household.map((item, index) => (
            <TouchableOpacity key={index} style={styles.householdItem}>
              <Text style={styles.householdText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Main Items List (Dynamically Updates Based on Category Selection) */}
      <FlatList
        data={sampleItems[selectedCategory as keyof typeof sampleItems] || []} // Fix Here
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.itemBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.itemText, { color: colors.text }]}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.itemsList}
        ListEmptyComponent={<Text style={styles.noItems}>No items available</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },

  // Search Bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 40,
    marginBottom: 10,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },

  // Category List
  categoryList: { flexDirection: "row", paddingVertical: 10 },
  categoryItem: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 8 },
  categoryText: { fontSize: 16, fontWeight: "500" },

  // Ad View
  adView: { height: 50, backgroundColor: "#ffcc00", borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  adText: { fontSize: 16, fontWeight: "bold", color: "#333" },

  // Household Items Scroll
  householdScroll: { flexDirection: "row", paddingVertical: 10 },
  householdItem: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#ddd", borderRadius: 20, marginRight: 8 },
  householdText: { fontSize: 14, fontWeight: "500" },

  // Main Items
  itemsList: { paddingBottom: 20 },
  itemBox: { padding: 12, borderRadius: 8, marginVertical: 6, alignItems: "center" },
  itemText: { fontSize: 16, fontWeight: "bold" },
  noItems: { textAlign: "center", fontSize: 16, marginVertical: 20 },
});

export default HomeScreen;
