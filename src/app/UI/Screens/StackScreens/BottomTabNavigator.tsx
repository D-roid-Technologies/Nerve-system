import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, useColorScheme } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store"; // Adjust path as necessary
import Colors from "../../../Utils/Theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../HomeScreen";
import SearchScreen from "../SearchScreen";
import { Image } from "react-native";
import CartScreen from "../CartScreen";
import ProfileScreen from "../ProfileScreen";

// Define the types for the bottom tab navigator
export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Profile: undefined;
};

// Define Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  const theme = useColorScheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  // Get cart length and user info from Redux
  const cart = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);

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
            case "Profile":
              return <Ionicons name="person-outline" size={size} color={color} />
            // return user?.profilePic ? (
            //   <Image
            //     source={{ uri: user.profilePic }}
            //     style={{ width: size, height: size, borderRadius: size / 2 }}
            //   />
            // ) : (
            //   <Ionicons name="person-outline" size={size} color={color} />
            // );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: cart.length > 0 ? cart.length : undefined,
          tabBarBadgeStyle: { backgroundColor: "red", color: "white" },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
