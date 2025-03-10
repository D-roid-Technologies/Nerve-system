import React, { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    useColorScheme,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardTypeOptions,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Theme";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Facebook icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Google icon
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { signUpUser } from "../../Config/functions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

// Define User Type
export type SignpUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    profilePic?: string;
    verified?: boolean;
    middleName?: string;
    verifiedEmail?: boolean;
    verifiPhoneNmber?: boolean;
    isUserLoggedIn?: boolean;
    agreedToTerms?: boolean;
    twoFactorSettings?: boolean;
    uniqueIdentifier?: string;
    gender?: string;
    dateOfBirth?: string;
    loginCount?: number;
    nameInitials?: string;
};

// Define Navigation Props
type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    MainApp: undefined;
};

type ScreenProps<T extends keyof RootStackParamList> = {
    route: RouteProp<RootStackParamList, T>;
    navigation: NativeStackNavigationProp<RootStackParamList, T>;
};

const SignUpScreen: React.FC<ScreenProps<"Login">> = ({ navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [country, setCountry] = useState("");

    // Form Data State (Ensuring Required Fields Have Default Values)
    const [formData, setFormData] = useState<SignpUser>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        profilePic: "",
        nameInitials: "",
    });

    const [step, setStep] = useState(0);

    // Form Fields
    const fields = [
        { key: "firstName", placeholder: "Enter your First Name" },
        { key: "lastName", placeholder: "Enter your Last Name" },
        { key: "email", placeholder: "Enter your Email" },
        { key: "password", placeholder: "Create a Password" },
        { key: "phone", placeholder: "Enter your Phone Number", },
        { key: "address", placeholder: "Enter your Delivery Address" },
    ];

    useEffect(() => {
        const getCountry = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission required", "Please enable location.", [
                    { text: "Retry", onPress: getCountry },
                ]);
                return;
            }
            try {
                let location = await Location.getCurrentPositionAsync({});
                let geo = await Location.reverseGeocodeAsync(location.coords);
                setCountry(geo[0]?.country || "");
            } catch (error) {
                console.error("Location error:", error);
            }
        };

        getCountry();
    }, []);

    // Handle Input Change
    const handleChange = (key: keyof SignpUser, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    // const pickImage = async () => {
    //     let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [1, 1],
    //         quality: 1,
    //     });

    //     // ✅ Check if `result.canceled` is false and `result.assets` exists
    //     if (!result.canceled && result.assets && result.assets.length > 0) {
    //         setProfilePicture(result.assets[0].uri);
    //         setFormData((prev) => ({ ...prev, profilePic: result.assets[0].uri }));
    //     } else {
    //         console.log("Image selection was canceled.");
    //     }
    // };


    // Go to Next Step
    const handleNext = () => {
        if (!formData[fields[step].key as keyof SignpUser]) {
            Alert.alert("Missing Input", "Please fill in this field before continuing.");
            return;
        }
        if (step < fields.length - 1) {
            setStep(step + 1);
        }
    };

    // Handle Sign Up
    const handleSignUp = async () => {
        if (!formData.email || !formData.password) {
            Alert.alert("Error", "Email and password are required.");
            return;
        }

        try {
            await signUpUser(formData, country);
            navigation.navigate("MainApp");
        } catch (error: any) {
            console.error("Sign-up error:", error);
            Alert.alert("Sign Up Failed", error.message || "An unexpected error occurred.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color={colors.text} />
            </TouchableOpacity>

            {/* Signup Icon */}
            <Ionicons name="person-add-outline" size={80} color={colors.primary} style={styles.icon} />

            {/* Heading */}
            <Text style={[styles.heading, { color: colors.text }]}>Create an Account</Text>

            {/* Dynamic Text Input Based on Step */}
            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder={fields[step].placeholder}
                placeholderTextColor="gray"
                secureTextEntry={!fields[step]}
                // keyboardType={fields[step]}
                value={String(formData[fields[step].key as keyof SignpUser] ?? "")}
                onChangeText={(text) => handleChange(fields[step].key as keyof SignpUser, text)}
            />

            {/* Continue / Sign Up Button */}
            {step < fields.length - 1 ? (
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleNext}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            )}

            {/* Already Have an Account? */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={[styles.loginText, { color: colors.primary }]}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    backButton: {},
    icon: { alignSelf: "center", marginBottom: 10 },
    heading: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: { width: "100%", padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 15 },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
        alignSelf: "center",
        position: "absolute",
        bottom: 40
        // marginTop: 20, // ✅ Adds space between input & button
    },
    
    buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
    loginText: { marginTop: 15, fontSize: 16, textAlign: "center" },
});

export default SignUpScreen;
