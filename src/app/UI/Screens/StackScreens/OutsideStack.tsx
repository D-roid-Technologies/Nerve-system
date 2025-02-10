import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DetailsScreen from "../DetailsScreen";

const AuthStackNavigator = createNativeStackNavigator();

const OutsideStack: React.FC = () => {
    return (
        <AuthStackNavigator.Navigator
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        >
            <AuthStackNavigator.Screen name="Onboarding" component={DetailsScreen} />
            {/* <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
      <AuthStackNavigator.Screen name="SignUp" component={SignUpScreen} />
      <AuthStackNavigator.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStackNavigator.Screen name="OTP" component={OTPScreen} />
      <AuthStackNavigator.Screen name="PasswordReset" component={PasswordResetScreen} /> */}
        </AuthStackNavigator.Navigator>
    );
};

export default OutsideStack;
