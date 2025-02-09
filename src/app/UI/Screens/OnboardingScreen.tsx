import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingItem } from "../../Utils/Data";
import Colors from "../../Utils/Theme";
import { Props } from "../../Utils/Types";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

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

  const onboardingData: OnboardingItem[] = [
    {
      id: "1",
      title: "Secure & Seamless Payments",
      description:
        "Experience fast, encrypted, and secure transactions. Our integrated payment solutions ensure that you can buy and sell with confidence, anytime, anywhere.",
      icon: <FontAwesome name="lock" size={80} color={colors.primary} />,
    },
    {
      id: "2",
      title: "Find Anything You Need",
      description:
        "From electronics to fashion, home essentials to professional services—easily search and connect with sellers near you. Your perfect deal is just a tap away!",
      icon: <Ionicons name="search" size={80} color={colors.primary} />,
    },
    {
      id: "3",
      title: "Smart Recommendations",
      description:
        "Discover personalized deals and trending products tailored just for you. Our AI-powered system ensures you never miss out on the best offers!",
      icon: <MaterialIcons name="recommend" size={80} color={colors.primary} />,
    },
    {
      id: "4",
      title: "24/7 Customer Support",
      description:
        "Need help? Our dedicated support team is available round the clock to assist you with any inquiries, ensuring a hassle-free experience.",
      icon: <Ionicons name="headset" size={80} color={colors.primary} />,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={[styles.skipText, { color: colors.text }]}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        data={[onboardingData[currentIndex]]} // Display one item at a time
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.content}>
            {item.icon}
            <Text style={[styles.heading, { color: colors.primary }]}>{item.title}</Text>
            <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
          </View>
        )}
      />

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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50, backgroundColor: "#ffffff" },
  image: {
    width: "90%",
    height: "40%",
    resizeMode: "contain",
    marginBottom: 20
  },
  skipButton: { alignSelf: "flex-end", padding: 10 },
  skipText: { fontSize: 16, fontWeight: "bold" },
  content: { flex: 1, justifyContent: "center" },
  heading: { fontSize: 28, fontWeight: 900, marginBottom: 10, letterSpacing: 0.5 },
  description: { fontSize: 16, marginBottom: 20, letterSpacing: 2, fontWeight: 400 },
  buttonContainer: { alignItems: "center", marginBottom: 40 },
  button: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
});

export default OnboardingScreen;