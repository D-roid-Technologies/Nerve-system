import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import Colors from "../../Utils/Theme";
import { SafeAreaView } from "react-native-safe-area-context";

const PasswordResetScreen: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const navigation = useNavigation();
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
  
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Set New Password</Text>
  
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Enter new password"
          placeholderTextColor={colors.text}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
  
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => {}
            // navigation.navigate("Login")
            }>
          <Text style={styles.buttonText}>Confirm</Text>
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
  
  export default PasswordResetScreen;
  