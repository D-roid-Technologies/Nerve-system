import React from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, Animated, useColorScheme, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Theme";
import { RootState } from "../../Redux/store";
import { SafeAreaView } from "react-native-safe-area-context";

const orderTabs = [
    { label: "Paid", icon: "card-outline", sliceKey: "paidOrders" },
    { label: "Sealed", icon: "lock-closed-outline", sliceKey: "sealedOrders" },
    { label: "Dispatched", icon: "cube-outline", sliceKey: "dispatchedOrders" },
    { label: "Arrived", icon: "airplane-outline", sliceKey: "arrivedOrders" },
    { label: "Confirmed", icon: "checkmark-circle-outline", sliceKey: "confirmedOrders" },
    { label: "Returned", icon: "refresh-circle-outline", sliceKey: "returnedOrders" },
    { label: "Review", icon: "star-outline", sliceKey: "reviewOrders" },
];

const OrderScreen: React.FC<any> = ({ navigation }) => {
    const orders = useSelector((state: RootState) => state.order);
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const slideAnim = React.useRef(new Animated.Value(Dimensions.get("window").width)).current;

    React.useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
            <SafeAreaView>
                <TouchableOpacity style={styles.backView} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
                    <Text style={[styles.headerText, { color: colors.text }]}>Track Order</Text>
                </TouchableOpacity>

                <FlatList
                    horizontal
                    data={orderTabs}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }) => (
                        <View style={styles.tabContainer}>
                            <View style={styles.header}>
                                <Ionicons name={item.icon || require("../../Assets/png/bed.png")} size={24} color={colors.primary} />
                                <Text style={styles.headerText}>{item.label}</Text>
                            </View>
                            <FlatList
                                data={orders[item.sliceKey] || []}
                                keyExtractor={(order) => order.id}
                                renderItem={({ item: order }) => (
                                    <View style={styles.orderItem}>
                                        <Text style={styles.orderText}>{order.name} - {order.status}</Text>
                                    </View>
                                )}
                            />ƒ
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    tabContainer: { width: Dimensions.get("window").width - 40, marginRight: 10, padding: 16, backgroundColor: "#f9f9f9", borderRadius: 10 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    headerText: { fontSize: 18, fontWeight: "bold", marginLeft: 8 },
    orderItem: { padding: 10, backgroundColor: "white", borderRadius: 8, marginVertical: 5 },
    orderText: { fontSize: 14, color: "#333" },
    backView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
});

export default OrderScreen;