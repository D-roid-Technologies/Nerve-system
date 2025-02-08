import React from "react";
import { Text, StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Icon Library
import Colors from "../../Utils/Theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type AuthStackParamList = {
  Login: undefined;
};
type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const WelcomeScreen: React.FunctionComponent<Props> = ({navigation}) => {
  const theme = useColorScheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  
  // const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Icon */}
      <Ionicons name="cart-outline" size={80} color={colors.primary} style={styles.icon} />

      {/* Heading */}
      <Text style={[styles.heading, { color: colors.text }]}>Welcome to Nerve Systems</Text>

      {/* Description */}
      <Text style={[styles.description, { color: colors.text }]}>
        Buy and sell anything securely with ease. Get started today!
      </Text>

      {/* Button to Navigate */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() =>
          navigation.navigate("Login")
        }
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50, // Moves content down naturally
  },
  icon: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: "flex-start", // Aligns button to the left
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default WelcomeScreen;
