import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList, Image, TouchableOpacity, StyleSheet, useColorScheme
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { useToast } from "react-native-toast-notifications";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../../Utils/Theme";
import { removeFromCart } from "../../Redux/slices/cartSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type RootStackParamList = {
    CheckoutScreen: { selectedItems: any[] };
};

type DetailsScreenProps = {
    route: RouteProp<RootStackParamList, 'CheckoutScreen'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'CheckoutScreen'>;
};

const CartScreen: React.FC<DetailsScreenProps> = ({ route, navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const dispatch = useDispatch();
    const toast = useToast();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [location, setLocation] = useState<string>("Fetching location...");

    // Fetch user's location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setLocation("Location permission denied");
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            let reverseGeocode = await Location.reverseGeocodeAsync(userLocation.coords);

            if (reverseGeocode.length > 0) {
                setLocation(reverseGeocode[0].city || "Unknown location");
            } else {
                setLocation("Location unavailable");
            }
        })();
    }, []);

    // Toggle selection
    const toggleSelect = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Handle Delete
    const handleDelete = () => {
        selectedItems.forEach((id) => dispatch(removeFromCart(id)));
        setSelectedItems([]);
        toast.show("Selected items removed", { type: "success" });
    };

    // Price Calculation
    const calculateTotal = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * 1.2, 0);
        const shippingFee = cartItems.length > 0 ? 2 : 0;
        const tax = subtotal * 0.05;
        return { subtotal, shippingFee, tax, grandTotal: subtotal + shippingFee + tax };
    };

    const { subtotal, shippingFee, tax, grandTotal } = calculateTotal();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Cart ({cartItems.length})</Text>
                <View style={styles.headerRight}>
                    <Text style={styles.locationText}>{location}</Text>
                    {selectedItems.length > 0 && (
                        <TouchableOpacity onPress={handleDelete}>
                            <Ionicons name="trash-bin-outline" size={24} color="red" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Cart Items List */}
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        {/* Radio Button */}
                        <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                            <Ionicons
                                name={selectedItems.includes(item.id) ? "radio-button-on" : "radio-button-off"}
                                size={20}
                                color={colors.primary}
                            />
                        </TouchableOpacity>

                        {/* Image */}
                        <Image source={item.image} style={styles.itemImage} />

                        {/* Details */}
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Text style={styles.itemSeller}>{item.seller.name} | {item.category}</Text>
                            <Text style={styles.itemPrice}>£{(item.price * 1.2).toFixed(2)}</Text>
                            <Text style={styles.itemTax}>+ Tax Included</Text>
                        </View>
                    </View>
                )}
            />

            {/* Summary Section */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text>Subtotal:</Text>
                    <Text>£{subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Shipping Fee:</Text>
                    <Text>£{shippingFee.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Tax:</Text>
                    <Text>£{tax.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRowTotal}>
                    <Text style={styles.summaryTotalText}>Grand Total:</Text>
                    <Text style={styles.summaryTotalText}>£{grandTotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => navigation.navigate("CheckoutScreen", { selectedItems })}
                    disabled={selectedItems.length === 0} // Disable if no items selected
                >
                    <Text style={styles.checkoutButtonText}>
                        Checkout ({selectedItems.length} items)
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },

    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    headerText: { fontSize: 20, fontWeight: "bold" },
    headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
    locationText: { fontSize: 12, color: "gray" },

    // Cart Item
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        gap: 10,
    },
    itemImage: { width: 60, height: 60, borderRadius: 8 },
    itemDetails: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: "bold" },
    itemSeller: { fontSize: 12, color: "gray" },
    itemPrice: { fontSize: 14, fontWeight: "bold", color: "green" },
    itemTax: { fontSize: 12, color: "gray" },

    // Summary
    summaryContainer: {
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    summaryRowTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        marginTop: 8,
    },
    summaryTotalText: { fontSize: 18, fontWeight: "bold" },
    checkoutButton: {
        backgroundColor: "#FF6F00",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    checkoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

});
