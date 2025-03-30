import React, { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    View,
    ScrollView,
    FlatList,
    Image,
    ImageSourcePropType,
    Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Theme";
import { Images } from "../../Utils/Images";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { selectAllItems } from "../../Redux/slices/itemSlice";

const HomeScreen: React.FC<any> = ({ navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const toast = useToast();
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const unreadCount = notifications.filter(notification => !notification.read).length;
    const allItems = useSelector(selectAllItems) || [];

    // Function to get unique categories
    const getUniqueCategories = (items: any[]) => {
        const categoriesSet = new Set<string>();
        categoriesSet.add("All"); // Ensure "All" is always included

        items.forEach((item) => {
            if (item.category) {
                categoriesSet.add(item.category);
            }
        });

        return Array.from(categoriesSet);
    };

    const adTexts = [
        "🔥 Special Deals! Up to 50% OFF",
        "🚚 Free Shipping on Orders Over £30!",
        "🛒 Buy One Get One Free on Select Items!",
        "🎉 Huge Discounts on Household Products!",
        "💥 Flash Sale! 40% OFF on Selected Furniture!"
    ];

    const [currentAd, setCurrentAd] = useState<string>(adTexts[0]);

    const uniqueCategories = getUniqueCategories(allItems);

    // Filtered items based on selected category
    const filteredItems = selectedCategory === "All"
        ? allItems
        : allItems.filter(item => item.category === selectedCategory);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomAd = adTexts[Math.floor(Math.random() * adTexts.length)];
            setCurrentAd(randomAd); // Update the ad text
        }, 5000); // Change ad every 5 seconds

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.imageView}>
                    <Image source={Images.logoInner} style={styles.mainLogo} />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("NotificationsScreen")}>
                    <View style={{ position: 'relative' }}>
                        <Ionicons name="notifications-outline" size={28} color={colors.text} />
                        {unreadCount > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <Pressable onPress={() => navigation.navigate("Search")}>
                <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
                    <Ionicons name="search-outline" size={24} color={colors.text} />
                    <Text style={styles.searchInput}>Search...</Text>
                </View>
            </Pressable>

            <View style={styles.categoryMain}>
                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                    {uniqueCategories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryItem,
                                selectedCategory === category && { backgroundColor: colors.primary },
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category ? { color: colors.card } : { color: colors.text }
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Ad View */}
                {/* Ad View */}
                <View style={styles.adView}>
                    <Text style={styles.adText}>{currentAd}</Text>
                </View>
            </View>


            {/* Main Items List */}
            <FlatList
                data={filteredItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[styles.itemBox, { backgroundColor: colors.card }]}
                        onPress={() => navigation.navigate('DetailsScreen', { item, index })}
                    >
                        <View style={[styles.householdItemView, { height: 250 }]}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                <Image
                                    source={typeof item.image === 'number' ? item.image : { uri: String(item.image) }}
                                    style={styles.itemImage}
                                />
                            </View>
                            <Text style={styles.householdText}>{item.name}</Text>
                            <View>
                                <Text style={styles.householdTextPrice}>{`£ ${item.price}`}</Text>
                                <Text style={styles.householdTextRating}>{`Rated - ${item.rating}`}</Text>
                            </View>
                        </View>
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

    imageView: {
        width: 100,
        height: 30
    },
    mainLogo: {
        width: "auto",
        height: 30
    },
    // Header
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },

    itemImage: {
        width: '100%',
        height: 150,
        resizeMode: 'contain', // Make sure the image fits nicely
        borderRadius: 8,
    },
    // Search Bar
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 8,
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.light.primary
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 12, color: Colors.light.text },

    // Category List
    categoryList: {
        paddingHorizontal: 10,
        marginBottom: 25
    },

    categoryItem: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginRight: 10,
        borderRadius: 8,
    },

    categoryText: {
        fontSize: 16,
        fontWeight: '600',
    },

    // Ad View
    adView: { height: 50, backgroundColor: Colors.light.warning, borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 20 },
    adText: { fontSize: 16, fontWeight: 800, color: "#333333" },

    // Household Items Scroll
    householdItemView: { width: "95%", backgroundColor: "white", height: 550, marginRight: 50, paddingHorizontal: 10, borderRadius: 20 },
    householdScroll: { flexDirection: "row", marginBottom: 30, borderRadius: 20 },
    householdItem: { width: "20%", borderRadius: 20 },
    householdText: { fontSize: 14, fontWeight: "800", marginTop: 10, letterSpacing: 1 },
    householdTextPrice: { fontSize: 12, fontWeight: 400, marginTop: 10, letterSpacing: 1 },
    householdTextRating: { fontSize: 12, fontWeight: 400, marginTop: 10, letterSpacing: 1 },

    // Main Items
    itemsList: { paddingBottom: 20 },
    itemBox: { padding: 20, borderRadius: 20, marginVertical: 6, },
    itemText: { fontSize: 16, fontWeight: "bold" },
    noItems: { textAlign: "center", fontSize: 16, marginVertical: 20 },

    // Image Styles
    image: { width: "100%", height: 150, },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    categoryMain: {
        marginBottom: 0
    }
});

export default HomeScreen;