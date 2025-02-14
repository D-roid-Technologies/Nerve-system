import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useToast } from "react-native-toast-notifications";
import Colors from "../../Utils/Theme";
import { processPayment } from "../../Redux/slices/paymentSlice";
import { RouteProp, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";

// Define navigation types
interface RootStackParamList extends ParamListBase {
    CheckoutScreen: undefined;
    PaymentScreen: undefined;
    SuccessScreen: undefined;
    UnsuccessfulScreen: undefined;
}

interface CheckoutScreenProps {
    route: RouteProp<RootStackParamList, "CheckoutScreen">;
    navigation: NativeStackNavigationProp<RootStackParamList, "CheckoutScreen">;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const toast = useToast();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    // console.log(cartItems)
    const userDetails = useSelector((state: RootState) => state.auth);
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;

    const [email, setEmail] = useState(userDetails.user?.email);
    const [phone, setPhone] = useState(userDetails.user?.phone);
    const [address, setAddress] = useState(userDetails.user?.address);

    const handlePayment = async () => {
        try {
            const success = await dispatch(processPayment(cartItems)).unwrap();
            if (success) {
                navigation.navigate("SuccessScreen");
            } else {
                navigation.navigate("UnsuccessfulScreen");
            }
        } catch (error) {
            toast.show("Payment failed, please try again.", { type: "danger" });
            navigation.navigate("UnsuccessfulScreen");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backView} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
                    <Text style={[styles.headerText, { color: colors.text }]}>Checkout</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: colors.primary }]}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: colors.primary }]}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: colors.primary }]}>Address</Text>
                            <TextInput
                                style={styles.input}
                                value={address}
                                onChangeText={setAddress}
                                multiline
                            />
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={[styles.itemText, { color: colors.text }]}>{item.name} - ${item.price}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }} // Add padding to prevent last item cutoff
            />

            <TouchableOpacity style={[styles.button, {backgroundColor: colors.primary}]} onPress={handlePayment}>
                <Text style={styles.buttonText}>Proceed to Payment</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    headerText: { fontSize: 20, fontWeight: "bold" },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    itemText: { fontSize: 16 },
    inputContainer: { marginVertical: 10 },
    label: { fontSize: 14, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default CheckoutScreen;