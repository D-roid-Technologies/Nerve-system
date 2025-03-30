import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  useColorScheme, Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import Colors from "../../Utils/Theme";
import Ionicons from "react-native-vector-icons/Ionicons"; // Icon for the top
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Facebook icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Google icon
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import { loginUser } from "../../Config/functions";
import { async } from "@firebase/util";
import { useToast } from "react-native-toast-notifications";


type RootStackParamList = {
  ForgotPassword: undefined;
  SignUp: undefined;
  MainApp: undefined;
};

type ScreenProps<T extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, T>;
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
};

const LoginScreen: React.FC<ScreenProps<'ForgotPassword'>> = ({ route, navigation }) => {
  const theme = useColorScheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUserLogin = async () => {
    try {
      await loginUser(email, password).then(() => {
        toast.show("Login successfully", { type: "success" });
        navigation.navigate("MainApp");
      })
    } catch (err) {
      toast.show(`Login is unsuccessfully - ${err}`, { type: "danger" });
      console.log(err)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={colors.text} />
      </TouchableOpacity>

      {/* App Icon */}
      <Ionicons name="person-circle-outline" size={80} color={colors.primary} style={styles.icon} />

      {/* Heading */}
      <Text style={[styles.heading, { color: colors.text }]}>Log In to Your Account</Text>

      {/* Email Input */}
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Email"
        placeholderTextColor="gray"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      {/* Password Input */}
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {/* Forgot Password & Sign Up */}
      <View style={styles.forgotSignUpRow}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={[styles.linkText, { color: colors.primary }]}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={[styles.linkText, { color: colors.text, marginHorizontal: 10 }]}>{" "}</Text>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[styles.linkText, { color: colors.primary }]}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Social Login Buttons */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <MaterialCommunityIcons name="google" size={28} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={28} color="#1877F2" />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleUserLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, },

  icon: { alignSelf: "center", marginBottom: 10 }, // Centered app icon

  heading: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },

  input: { width: "100%", padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 15 },

  forgotSignUpRow: { justifyContent: "center", alignItems: "center", marginBottom: 30 },

  linkText: { fontSize: 16 },

  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignSelf: "center"
  },

  buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },

  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    // bottom: 20,
    width: "100%"
  },

  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: "#EEE"
  },

  socialIcon: { width: 30, height: 30, resizeMode: "contain" },
  backButton: {
    // position: "absolute",
    // top: 20,
    // left: 20,
    // zIndex: 10
  },
});

export default LoginScreen;