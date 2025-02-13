import React from "react";
import { View, Text, StyleSheet, useColorScheme, Dimensions, ScrollView, FlatList } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { setActiveTabIndex } from "../../Redux/slices/orderSlice";
import Colors from "../../Utils/Theme";
import { RootState } from "../../Redux/store";
import { SafeAreaView } from "react-native-safe-area-context";

// Define order tab types
type OrderTab = {
    label: string;
    icon: "card-outline" | "lock-closed-outline" | "cube-outline" | "airplane-outline" |
    "checkmark-circle-outline" | "refresh-circle-outline" | "star-outline";
};

// Define order statuses
const orderTabs: OrderTab[] = [
    { label: "Paid", icon: "card-outline" },
    { label: "Sealed", icon: "lock-closed-outline" },
    { label: "Dispatched", icon: "cube-outline" },
    { label: "Arrived", icon: "airplane-outline" },
    { label: "Confirmed", icon: "checkmark-circle-outline" },
    { label: "Returned", icon: "refresh-circle-outline" },
    { label: "Review", icon: "star-outline" },
];

// Component for each order tab
const OrderTab = ({ status }: { status: string }) => (
    <View style={styles.scene}>
        <Text style={styles.text}>{status} Orders</Text>
    </View>
);

// Create scenes dynamically
const renderScene = SceneMap(
    Object.fromEntries(orderTabs.map(({ label }) => [label, () => <OrderTab status={label} />]))
);

const OrderScreen: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const index = useSelector((state: RootState) => state.order.activeTabIndex);
    const [routes] = React.useState(orderTabs.map(({ label }) => ({ key: label, title: label })));

    return (
        // <SafeAreaView>
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={(i) => dispatch(setActiveTabIndex(i))}
            // initialLayout={{ width: Dimensions.get("window").width }}
            renderTabBar={(props) => (
                <FlatList
                    horizontal
                    data={props.navigationState.routes}
                    renderItem={({ item }) => {
                        const icon = orderTabs.find((tab) => tab.label === item.title)?.icon;
                        const isActive = props.navigationState.index === props.navigationState.routes.findIndex(r => r.key === item.key);

                        return (
                            <View style={styles.tabItem}>
                                {icon && (
                                    <Ionicons
                                        name={icon}
                                        size={24}
                                        color={isActive ? colors.primary : "gray"}
                                    />
                                )}
                                <Text style={{ color: isActive ? colors.primary : "gray", fontSize: 12 }}>
                                    {item.title}
                                </Text>
                            </View>
                        );
                    }}
                    keyExtractor={(item) => item.key}
                    showsHorizontalScrollIndicator={false}
                />
            )}
        />

    );
};

// Styles
const styles = StyleSheet.create({
    scene: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
    },
    tabBar: {
        elevation: 0,
        shadowOpacity: 0,
    },
    tabItem: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
    },
});

export default OrderScreen;
