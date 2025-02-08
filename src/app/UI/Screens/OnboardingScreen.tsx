import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingData } from "../../Utils/Data";
import Colors from "../../Utils/Theme";
import { Props } from "../../Utils/Types";

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useColorScheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("MainApp");
    }
  };

  const handleSkip = () => {
    navigation.navigate("MainApp");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={[styles.skipText, { color: colors.text }]}>Skip</Text>
      </TouchableOpacity>

      {/* Onboarding Content */}
      <FlatList
        data={[onboardingData[currentIndex]]} // Display one item at a time
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.content}>
            <Text style={[styles.heading, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
          </View>
        )}
      />

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  skipButton: { alignSelf: "flex-end", padding: 10 },
  skipText: { fontSize: 16, fontWeight: "bold" },
  content: { flex: 1, justifyContent: "center" },
  heading: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  buttonContainer: { alignItems: "center", marginBottom: 40 },
  button: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
});

export default OnboardingScreen;