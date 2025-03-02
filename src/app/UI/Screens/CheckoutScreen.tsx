import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useToast } from "react-native-toast-notifications";
import Colors from "../../Utils/Theme";
import { processPayment } from "../../Redux/slices/paymentSlice";
import { addOrder } from "../../Redux/slices/orderSlice";
import { RouteProp, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { clearCart } from "../../Redux/slices/cartSlice";
import { addNotification } from "../../Redux/slices/notificationSlice";

const CheckoutScreen: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const toast = useToast();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const userDetails = useSelector((state: RootState) => state.auth);
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;

    const [email, setEmail] = useState(userDetails.user?.email);
    const [phone, setPhone] = useState(userDetails.user?.phone);
    const [address, setAddress] = useState(userDetails.user?.address);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: "",
        fullName: ""
    });

    // const handlePayment = async () => {
    //     setModalVisible(false);
    //     try {
    //         const success = await dispatch(processPayment(cartItems)).unwrap();
    //         if (success) {
    //             cartItems.forEach(item => dispatch(addOrder({ category: "paidOrders", order: item })));
    //             dispatch(clearCart());
    //             navigation.navigate("SuccessScreen");
    //         } else {
    //             navigation.navigate("UnsuccessfulScreen");
    //         }
    //     } catch (error) {
    //         toast.show("Payment failed, please try again.", { type: "danger" });
    //         navigation.navigate("UnsuccessfulScreen");
    //     }
    // };

    const handlePayment = async () => {
        setModalVisible(false);
        try {
            const success = await dispatch(processPayment(cartItems)).unwrap();
            if (success) {
                // Convert cart items to OrderItem format with status "paid"
                cartItems.forEach(item => {
                    dispatch(addOrder({
                        category: "paidOrders",
                        order: { ...item, status: "paid" } // ✅ Add required 'status' field
                    }));
                });

                // Clear the cart after successful payment
                dispatch(clearCart());

                // Add a notification for successful payment with item name and amount
                cartItems.forEach(item => {
                    const successNotification = {
                        id: new Date().toISOString(), // Unique ID based on current timestamp
                        title: "Payment Successful",
                        message: `Your payment for ${item.name} ${item.price} was successful. Your order has been processed.`,
                        timestamp: new Date().toLocaleTimeString(),
                        read: false
                    };
                    dispatch(addNotification(successNotification));
                });

                // Navigate to success screen
                navigation.navigate("SuccessScreen");
            } else {
                // Add a notification for unsuccessful payment
                const failureNotification = {
                    id: new Date().toISOString(), // Unique ID based on current timestamp
                    title: "Payment Failed",
                    message: "Your payment could not be processed. Please try again.",
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                };
                dispatch(addNotification(failureNotification));

                navigation.navigate("UnsuccessfulScreen");
            }
        } catch (error) {
            // Handle error and add failure notification
            const failureNotification = {
                id: new Date().toISOString(), // Unique ID based on current timestamp
                title: "Payment Error",
                message: "An error occurred during payment. Please try again.",
                timestamp: new Date().toLocaleTimeString(),
                read: false
            };
            dispatch(addNotification(failureNotification));

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
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <View>
                        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
                        <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} />
                        <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}><Text>{item.name} - ${item.price}</Text></View>
                )}
            />

            <TouchableOpacity style={[styles.button, {backgroundColor: colors.primary}]} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Proceed to Payment</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Close Button */}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>

                        {!paymentMethod ? (
                            <>
                                <Text style={styles.modalTitle}>Select Payment Method</Text>
                                <TouchableOpacity onPress={() => setPaymentMethod("card")} style={styles.paymentOption}>
                                    <Text style={styles.paymentOptionText}>Debit/Credit Card</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    placeholder="Card Number"
                                    onChangeText={text => setCardDetails({ ...cardDetails, number: text })}
                                    style={styles.input}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="Expiry Date (MM/YY)"
                                    onChangeText={text => setCardDetails({ ...cardDetails, expiry: text })}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="CVV"
                                    onChangeText={text => setCardDetails({ ...cardDetails, cvv: text })}
                                    style={styles.input}
                                    secureTextEntry
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="Full Name"
                                    onChangeText={text => setCardDetails({ ...cardDetails, fullName: text })}
                                    style={styles.input}
                                />
                                <TouchableOpacity style={styles.button} onPress={handlePayment}>
                                    <Text style={styles.buttonText}>Pay Now</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginVertical: 5 },
    itemContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
    button: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
    buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" },
    paymentOption: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 20
    },
    backView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    paymentOptionText: {
        color: "gray",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CheckoutScreen;
