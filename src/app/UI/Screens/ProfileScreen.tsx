import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Pressable,
    ScrollView,
    Alert,
    useColorScheme,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import Colors from "../../Utils/Theme";
import { logout } from "../../Redux/slices/authSlice";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

type RootStackParamList = {
    ProfileScreen: undefined;
    EditProfileScreen: undefined;
    SettingsScreen: undefined;
    NotificationsScreen: undefined;
    OrdersScreen: undefined;
    ReviewsScreen: undefined;
    Login: undefined;
    Home: undefined;
    UploadItemScreen: undefined;
};

type ScreenProps<T extends keyof RootStackParamList> = {
    route: RouteProp<RootStackParamList, T>;
    navigation: NativeStackNavigationProp<RootStackParamList, T>;
};

const ProfileScreen: React.FC<ScreenProps<'EditProfileScreen'>> = ({ route, navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const dispatch = useDispatch();
    const toast = useToast();

    const user = useSelector((state: RootState) => state.auth.user);
    const orders = useSelector((state: RootState) => state.order);

    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Yes, Sign Out",
                onPress: () => {
                    dispatch(logout());
                    toast.show("You have logged out successfully", { type: "success" });
                    navigation.navigate("Home");
                },
            },
        ]);
    };

    const orderCounts = {
        paidOrders: orders.paidOrders.length,
        sealedOrders: orders.sealedOrders.length,
        dispatchedOrders: orders.dispatchedOrders.length,
        arrivedOrders: orders.arrivedOrders.length,
        confirmedOrders: orders.confirmedOrders.length,
        returnedOrders: orders.returnedOrders.length,
        reviewOrders: orders.reviewOrders.length,
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileContainer}>
                    <TouchableOpacity
                        style={styles.profileInfo}
                        onPress={() => {
                            if (!user || !user.profilePic) {
                                navigation.navigate("Login");
                            } else {
                                navigation.navigate("EditProfileScreen");
                            }
                        }}
                    >
                        <Image
                            source={
                                user?.profilePic
                                    ? { uri: user.profilePic }
                                    : require("../../Assets/png/profile-icon.png")
                            }
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={[styles.profileName, { color: colors.text }]}>
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : "Please log in"}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.settingsContainer}>
                        <Pressable onPress={() => navigation.navigate("UploadItemScreen")}>
                            <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate("SettingsScreen")}>
                            <Ionicons name="settings-outline" size={24} color={colors.text} />
                        </Pressable>
                    </View>
                </View>

                {/* Order Tracking Section */}
                <View style={styles.orderTrackingContainer}>
                    <View style={styles.trackHeader}>
                        <Text style={[styles.trackTitle, { color: colors.text }]}>Track Orders</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("OrdersScreen")}>
                            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.orderStatus}>
                        {[
                            { label: "Paid", icon: "card-outline", count: orderCounts.paidOrders },
                            { label: "Sealed", icon: "lock-closed-outline", count: orderCounts.sealedOrders },
                            { label: "Dispatched", icon: "cube-outline", count: orderCounts.dispatchedOrders },
                            { label: "Arrived", icon: "airplane-outline", count: orderCounts.arrivedOrders },
                            { label: "Confirmed", icon: "checkmark-circle-outline", count: orderCounts.confirmedOrders },
                            { label: "Returned", icon: "refresh-circle-outline", count: orderCounts.returnedOrders },
                            { label: "Review", icon: "star-outline", count: orderCounts.reviewOrders },
                        ].map((item, index) => {
                            // const orderCount = orders[item.key as keyof typeof orders].length;
                            // const count = Array.isArray(state[category]) ? state[category].length : 0;

                            return (
                                <View key={index} style={styles.orderItem}>
                                    <Ionicons name={item.icon} size={28} color={colors.primary} />
                                    <Text style={styles.orderLabel}>
                                        {item.label} ({item.count})
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* User Information Section */}
                <View style={styles.userDetails}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>User Information</Text>
                    <Text style={styles.detailText}>Email: {user?.email}</Text>
                    <Text style={styles.detailText}>Phone: {user?.phone}</Text>
                    <Text style={styles.detailText}>Address: {user?.address}</Text>
                    <Text style={styles.detailText}>Verified: {user?.verified ? "Yes ✅" : "No ❌"}</Text>
                    <TouchableOpacity
                        style={styles.editProfileBtn}
                        onPress={() => navigation.navigate("EditProfileScreen")}
                    >
                        <Text style={styles.editProfileText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Reviews Section */}
                <View style={styles.reviewSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews About My Services</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("ReviewsScreen")}>
                        <Text style={styles.viewAllText}>View Reviews</Text>
                    </TouchableOpacity>
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },

    profileContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    profileInfo: { flexDirection: "row", alignItems: "center" },
    profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    profileName: { fontSize: 18, fontWeight: "bold" },

    settingsContainer: { flexDirection: "row", alignItems: "center", gap: 12 },

    orderTrackingContainer: { marginBottom: 20 },
    trackHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    trackTitle: { fontSize: 18, fontWeight: "bold" },
    viewAllText: { fontSize: 14, color: Colors.light.primary },

    orderStatus: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" },
    orderItem: { alignItems: "center", width: "30%", marginVertical: 10 },
    orderLabel: { fontSize: 14, marginTop: 5 },

    userDetails: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    detailText: { fontSize: 16, marginBottom: 5 },
    editProfileBtn: { backgroundColor: Colors.light.secondary, padding: 10, borderRadius: 8, marginTop: 10 },
    editProfileText: { color: "white", textAlign: "center", fontSize: 16 },

    reviewSection: { marginBottom: 20 },

    signOutBtn: { backgroundColor: Colors.light.warning, padding: 12, borderRadius: 8, marginTop: 20 },
    signOutText: { color: "white", textAlign: "center", fontSize: 16 },
});
