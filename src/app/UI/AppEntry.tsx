import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "../UI/Screens/StackScreens/AuthStack";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { ToastProvider } from "react-native-toast-notifications";

// Create the main app navigator
const AppStack = createNativeStackNavigator();

// Define the theme for PaperProvider
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF8C00", // Dark Orange (Primary)
    accent: "#FFA500", // Light Orange (Accent)
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#000000",
  },
};

const AppEntry: React.FC = () => {
  return (
    <ToastProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppStack.Navigator initialRouteName="AuthStack" screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="AuthStack" component={AuthStack} />
            {/* Add Main App Screens here when needed */}
          </AppStack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ToastProvider>
  );
};

export default AppEntry;
