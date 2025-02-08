import React, { useState } from "react";
import { Text, StyleSheet, useColorScheme, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Theme";

const SignUpScreen: React.FunctionComponent = () => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Icon */}
            <Ionicons name="person-add-outline" size={80} color={colors.primary} style={styles.icon} />

            {/* Heading */}
            <Text style={[styles.heading, { color: colors.text }]}>Create an Account</Text>

            {/* Input Fields */}
            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="Full Name"
                placeholderTextColor={colors.text}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="Email"
                placeholderTextColor={colors.text}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="Password"
                placeholderTextColor={colors.text}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* Sign Up Button */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => console.log("Sign Up Pressed")}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Navigate to Login */}
            <TouchableOpacity onPress={() => {}
                // navigation.navigate("Welcome")
                }>
                <Text style={[styles.loginText, { color: colors.primary }]}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

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

export default SignUpScreen;
