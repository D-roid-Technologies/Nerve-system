import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";
import Colors from "../../Utils/Theme";

interface RootStackParamList extends ParamListBase {
    SuccessScreen: undefined;
    HomeScreen: undefined;
}

interface SuccessScreenProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SuccessScreen">;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    return (
        <SafeAreaView style={styles.container}>
            <Ionicons name="checkmark-circle-outline" size={80} color="green" />
            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.subtitle}>Your order has been placed successfully.</Text>

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate("MainApp")}>
                <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SuccessScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
        color: "green",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#555",
    },
    button: {
        padding: 15,
        borderRadius: 8,
        width: "80%",
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
