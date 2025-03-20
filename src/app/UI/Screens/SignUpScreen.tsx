import React, { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    useColorScheme,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Theme";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { signUpUser } from "../../Config/functions";
import { useToast } from "react-native-toast-notifications";

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
    Profile: undefined;
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
    const [step, setStep] = useState(0);
    const toast = useToast();

    const [formData, setFormData] = useState<SignpUser>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        profilePic: "",
        verified: false,
        middleName: "",
        verifiedEmail: false,
        verifiPhoneNmber: false,
        isUserLoggedIn: false,
        agreedToTerms: false,
        twoFactorSettings: false,
        uniqueIdentifier: "",
        gender: "",
        dateOfBirth: "",
        loginCount: 0,
        nameInitials: ""
    });

    useEffect(() => {
        const getCountry = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission required", "Please enable location.");
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

    // Handle Image Selection
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setProfilePicture(result.assets[0].uri);
            setFormData((prev) => ({ ...prev, profilePic: result.assets[0].uri }));
        }
    };

    // Handle Input Change
    const handleChange = (key: keyof SignpUser, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    // Regex Validation
    const validateInput = () => {
        const nameRegex = /^[A-Za-z]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9]{7,15}$/;
        const addressRegex = /^[\w\s,.#-]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

        if (!profilePicture) return "Please select a profile picture.";
        if (!nameRegex.test(formData.firstName)) return "Enter a valid first name.";
        if (!nameRegex.test(formData.lastName)) return "Enter a valid last name.";
        if (!emailRegex.test(formData.email)) return "Enter a valid email.";
        if (!passwordRegex.test(formData.password))
            return "Password must be at least 6 characters and include letters & numbers.";
        if (!phoneRegex.test(formData.phone)) return "Enter a valid phone number.";
        if (!addressRegex.test(formData.address)) return "Enter a valid address.";

        return null;
    };

    // Handle Next Step
    const handleNext = () => {
        if (!profilePicture) {
            Alert.alert("Missing Profile Picture", "Please select a profile picture.");
            return;
        }
        setStep(1);
    };

    // Handle Sign Up
    const handleSignUp = async () => {
        const errorMessage = validateInput();
        if (errorMessage) {
            Alert.alert("Invalid Input", errorMessage);
            return;
        }
        try {
            await signUpUser(formData, country).then(() => {
                toast.show("We have signed you up successfully", { type: "success" });
                navigation.navigate("MainApp");
            }).catch((err: any) => {
                toast.show(`${err.message}` || `Signing you up FAILED, check all details and try again`, { type: "danger" });
            })

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

            {/* Step 1: Profile Picture */}
            {step === 0 && (
                <>
                    {/* App Icon */}
                    <Ionicons name="person-circle-outline" size={80} color={colors.primary} style={styles.icon} />

                    {/* Heading */}
                    <Text style={[styles.heading, { color: colors.text }]}>Let's Set Up Your Account</Text>
                    <Text style={[styles.heading, { color: colors.text }]}>Upload Profile Picture</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        {profilePicture ? (
                            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
                        ) : (
                            <Ionicons name="camera-outline" size={50} color={colors.primary} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleNext}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Step 2: Form Inputs */}
            {step === 1 && (
                <>
                    {/* App Icon */}
                    <Ionicons name="person-circle-outline" size={80} color={colors.primary} style={styles.icon} />

                    {/* Heading */}
                    <Text style={[styles.heading, { color: colors.text }]}>Let's set Your Account Up</Text>
                    <Text style={[styles.heading, { color: colors.text }]}>Enter Your Details</Text>
                    {Object.keys(formData).slice(0, 6).map((key) => (
                        <TextInput
                            key={key}
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder={`Enter your ${key}`}
                            placeholderTextColor="gray"
                            secureTextEntry={key === "password"}
                            value={String(formData[key as keyof SignpUser] ?? "")}
                            onChangeText={(text) => handleChange(key as keyof SignpUser, text)}
                        />
                    ))}

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
    backButton: { position: "absolute", top: 60, left: 20 },
    heading: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 20 },
    imagePicker: { alignSelf: "center", borderRadius: 100, padding: 20, backgroundColor: "#f0f0f0", marginBottom: 20 },
    profileImage: { width: 120, height: 120, borderRadius: 60 },
    input: { width: "100%", padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 15 },
    button: { paddingVertical: 14, borderRadius: 8, alignItems: "center", width: "100%" },
    buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
    icon: { alignSelf: "center", marginBottom: 10 },
});

export default SignUpScreen;
