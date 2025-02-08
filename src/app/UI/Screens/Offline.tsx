import React from "react";
import { Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Utils/Theme";

const Offline: React.FC = () => {
  const theme = useColorScheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>You're Offline</Text>
      <Text style={[styles.description, { color: colors.text }]}>
        Please check your internet connection and try again.
      </Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => console.log("Retrying...")}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  heading: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  button: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
});

export default Offline;
