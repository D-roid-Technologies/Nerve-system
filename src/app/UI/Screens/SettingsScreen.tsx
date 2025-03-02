import React from "react";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../../Utils/Theme";

const SettingsScreen: React.FC<any> = ({ navigation }) => {
  const theme = useColorScheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  const settingsOptions = [
    { id: "1", label: "Profile" },
    { id: "2", label: "Shipping Address" },
    { id: "3", label: "Ship To" },
    { id: "4", label: "Currency" },
    { id: "5", label: "Language" },
    { id: "6", label: "Notification Settings" },
    { id: "7", label: "Viewed" },
    { id: "8", label: "Cookies" },
    { id: "9", label: "Clear Cache" },
    { id: "10", label: "Rate Nerves" },
    { id: "11", label: "Privacy Settings" },
    { id: "12", label: "Privacy Policy" },
    { id: "13", label: "Legal Information" },
    { id: "14", label: "Version" },
  ];

  const handleSettingPress = (settingLabel: string) => {
    // Navigate to different settings screens based on the option clicked
    console.log(`Navigating to: ${settingLabel}`);
    // You can add specific navigation logic for each setting screen here if needed
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <TouchableOpacity style={styles.backView} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
        <Text style={[styles.headerText, { color: colors.text }]}>Settings</Text>
      </TouchableOpacity>

      <FlatList
        data={settingsOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.card }]}
            onPress={() => handleSettingPress(item.label)}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.settingsList}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  backView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  settingsList: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
