import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, useColorScheme } from "react-native";
import Colors from "../../../Utils/Theme";
import WelcomeScreen from "../WelcomeScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../HomeScreen";

// Define the types for the tab navigator
export type BottomTabParamList = {
  Welcome: undefined;
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Account: undefined;
};


const SearchScreen: React.FC = () => (
  <View>
    <Text>Search Screen</Text>
  </View>
);
const CartScreen: React.FC = () => (
  <View>
    <Text>Cart Screen</Text>
  </View>
);
const AccountScreen: React.FC = () => (
  <View>
    <Text>Account Screen</Text>
  </View>
);

// Define bottom tab navigator
const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  const theme = useColorScheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: keyof BottomTabParamList } }) => ({
        tabBarStyle: { backgroundColor: colors.background },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName = "";

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Search":
              iconName = "search-outline";
              break;
            case "Cart":
              iconName = "cart-outline";
              break;
            case "Account":
              iconName = "person-outline";
              break;
            // case "Welcome":
            //   iconName = "happy-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      {/* <Tab.Screen name="Welcome" component={WelcomeScreen} /> */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
