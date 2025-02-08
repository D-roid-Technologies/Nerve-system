import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Theme";

const OTPScreen: React.FC = () => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const navigation = useNavigation();

    const [otp, setOtp] = useState("");

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.heading, { color: colors.text }]}>Enter OTP Code</Text>

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="Enter OTP"
                placeholderTextColor={colors.text}
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
            />

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => {}
                // navigation.navigate("PasswordReset")
                }>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    icon: {
        marginBottom: 10,
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
    },
    loginText: {
        marginTop: 15,
        fontSize: 16,
    },
});

export default OTPScreen;
