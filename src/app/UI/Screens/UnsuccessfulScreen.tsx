import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";

interface RootStackParamList extends ParamListBase {
    UnsuccessfulScreen: undefined;
    CheckoutScreen: undefined;
}

interface UnsuccessfulScreenProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "UnsuccessfulScreen">;
}

const UnsuccessfulScreen: React.FC<UnsuccessfulScreenProps> = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Ionicons name="close-circle-outline" size={80} color="red" />
            <Text style={styles.title}>Payment Failed!</Text>
            <Text style={styles.subtitle}>Something went wrong. Please try again.</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CheckoutScreen")}>
                <Text style={styles.buttonText}>Retry Payment</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default UnsuccessfulScreen;

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
        color: "red",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#555",
    },
    button: {
        backgroundColor: "red",
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
