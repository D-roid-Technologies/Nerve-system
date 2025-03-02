import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckoutScreen from "../CheckoutScreen";
import DetailsScreen from "../DetailsScreen";
import EditProfileScreen from "../EditProfileScreen";
import ForgotPasswordScreen from "../ForgotPasswordScreen";
import LoginScreen from "../LoginScreen";
import NotificationsScreen from "../NotificationsScreen";
import OnboardingScreen from "../OnboardingScreen";
import OrderScreen from "../OrderScreen";
import OTPScreen from "../OTPScreen";
import PasswordResetScreen from "../PasswordResetScreen";
import SettingsScreen from "../SettingsScreen";
import SignUpScreen from "../SignUpScreen";
import SuccessScreen from "../SuccessScreen";
import UnsuccessfulScreen from "../UnsuccessfulScreen";
import UploadItemScreen from "../UploadItemScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { ActivityIndicator, View } from "react-native";

const AuthStackNavigator = createNativeStackNavigator();

const AuthStack: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        setInitialRoute(hasSeenOnboarding ? "MainApp" : "Onboarding");
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setInitialRoute("Onboarding"); // Default to Onboarding if error occurs
      }
    };

    checkOnboardingStatus();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <AuthStackNavigator.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* Onboarding Screen */}
      <AuthStackNavigator.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ animation: "fade" }}
      />

      {/* Auth Screens - NO Bottom Tabs */}
      <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
      <AuthStackNavigator.Screen name="SignUp" component={SignUpScreen} />
      <AuthStackNavigator.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStackNavigator.Screen name="OTP" component={OTPScreen} />
      <AuthStackNavigator.Screen name="PasswordReset" component={PasswordResetScreen} />
      <AuthStackNavigator.Screen name="DetailsScreen" component={DetailsScreen} />
      <AuthStackNavigator.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <AuthStackNavigator.Screen name="OrdersScreen" component={OrderScreen} />
      <AuthStackNavigator.Screen name="SuccessScreen" component={SuccessScreen} />
      <AuthStackNavigator.Screen name="UnsuccessfulScreen" component={UnsuccessfulScreen} />
      <AuthStackNavigator.Screen name="SettingsScreen" component={SettingsScreen} />
      <AuthStackNavigator.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <AuthStackNavigator.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <AuthStackNavigator.Screen name="UploadItemScreen" component={UploadItemScreen} />

      {/* Main App with Bottom Tabs */}
      <AuthStackNavigator.Screen name="MainApp" component={BottomTabNavigator} />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;
