import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
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

const AuthStackNavigator = createNativeStackNavigator();

const AuthStack: React.FC = () => {
  return (
    <AuthStackNavigator.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* Auth Screens - NO Bottom Tabs */}
      <AuthStackNavigator.Screen name="Onboarding" component={OnboardingScreen} />
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

      {/* Welcome + Main App - HAS Bottom Tabs */}
      <AuthStackNavigator.Screen name="MainApp" component={BottomTabNavigator} />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;
