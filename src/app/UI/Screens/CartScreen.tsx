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
import { addOrUpdateCartItem, removeFromCart, } from "../../Redux/slices/cartSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Images } from "../../Utils/Images"

type RootStackParamList = {
    CheckoutScreen: { selectedItems: any[] };
    Search: undefined;
};

type DetailsScreenProps = {
    route: RouteProp<RootStackParamList, "CheckoutScreen">;
    navigation: NativeStackNavigationProp<RootStackParamList, "CheckoutScreen">;
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

    // Increase Quantity
    const increaseQuantity = (id: string) => {
        dispatch(addOrUpdateCartItem({
            id, quantity: cartItems.find((item) => item.id === id)?.quantity! + 1,
            name: "",
            description: "",
            category: "",
            material: "",
            dimensions: {
                height: "",
                width: "",
                depth: ""
            },
            weight: "",
            color: "",
            price: 0,
            rating: 0,
            reviews: 0,
            stock: 0,
            image: null,
            features: [],
            seller: {
                name: "",
                location: "",
                contact: "",
                rating: 0
            },
            tags: []
        }));
    };

    // Decrease Quantity
    const decreaseQuantity = (id: string) => {
        const item = cartItems.find((item) => item.id === id);
        if (item && item.quantity > 1) {
            dispatch(addOrUpdateCartItem({
                id, quantity: item.quantity - 1,
                name: "",
                description: "",
                category: "",
                material: "",
                dimensions: {
                    height: "",
                    width: "",
                    depth: ""
                },
                weight: "",
                color: "",
                price: 0,
                rating: 0,
                reviews: 0,
                stock: 0,
                image: null,
                features: [],
                seller: {
                    name: "",
                    location: "",
                    contact: "",
                    rating: 0
                },
                tags: []
            }));
        }
    };

    // Price Calculation for selected items only
    const calculateTotal = () => {
        const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
        const subtotal = selectedCartItems.reduce((acc, item) => acc + item.price * item.quantity * 1.2, 0);
        const shippingFee = selectedCartItems.length > 0 ? 2 : 0;
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
                ListEmptyComponent={
                    <View style={styles.emptyCart}>
                        <Text style={styles.emptyCartText}>No items available in cart</Text>
                    </View>
                }
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
                        <Image source={item.image || require("../../Assets/png/bed.png")} style={styles.itemImage} />
                        {/* <Image
                            source={item.image ? { uri: item.image } : Images.lamp}
                            style={styles.itemImage}
                        /> */}

                        {/* Details */}
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Text style={styles.itemSeller}>{item.seller.name} | {item.category}</Text>
                            <Text style={styles.itemPrice}>£{(item.price * 1.2).toFixed(2)}</Text>
                            <Text style={styles.itemTax}>+ Tax Included</Text>

                            {/* Quantity Control */}
                            {/* <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                                    <Ionicons name="remove-circle-outline" size={24} color="red" />
                                </TouchableOpacity>
                                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                                    <Ionicons name="add-circle-outline" size={24} color="green" />
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </View>
                )}
            />

            {/* Summary Section - Show only when items are selected */}
            {selectedItems.length > 0 && (
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
                </View>
            )}

            {/* Checkout Button */}
            <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() =>
                    selectedItems.length === 0
                        ? navigation.navigate("Search")
                        : navigation.navigate("CheckoutScreen", { selectedItems })
                }
            >
                <Text style={styles.checkoutButtonText}>
                    {selectedItems.length === 0 ? "Find Items you like" : `Checkout (${selectedItems.length} items)`}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default CartScreen;


const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },

    // Header
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    headerText: { fontSize: 20, fontWeight: "bold" },
    headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
    locationText: { fontSize: 12, color: "gray" },

    // Empty Cart
    emptyCart: { alignItems: "center", marginTop: 50 },
    emptyCartText: { fontSize: 18, color: "gray" },

    // Cart Item
    itemContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10, marginLeft: 10 },
    itemDetails: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: "bold" },
    itemSeller: { fontSize: 12, color: "gray" },
    itemPrice: { fontSize: 14, fontWeight: "bold", color: "green" },
    itemTax: { fontSize: 12, color: "gray" },
    itemQuantity: { fontSize: 14, fontWeight: "bold", color: "#555" },

    // Checkout Button
    checkoutButton: { backgroundColor: "#FF6F00", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
    checkoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

    // Summary
    summaryContainer: { padding: 16, borderTopWidth: 1, borderTopColor: "#ddd" },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
    summaryRowTotal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
    summaryTotalText: { fontSize: 18, fontWeight: "bold" },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10, // Ensures spacing between buttons and text
        marginTop: 5,
    },
});
