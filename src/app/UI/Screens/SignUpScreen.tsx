import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    useColorScheme,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardTypeOptions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Theme";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Facebook icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Google icon
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { appBackendService } from "../../Redux/Services/service";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

// Define User Type
type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePic?: string;
    phone: string;
    address: string;
    verified: boolean;
};

// Define Navigation Props
type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    MainApp: undefined
};


type ScreenProps<T extends keyof RootStackParamList> = {
    route: RouteProp<RootStackParamList, T>;
    navigation: NativeStackNavigationProp<RootStackParamList, T>;
};

const SignUpScreen: React.FC<ScreenProps<'Login'>> = ({ navigation, route }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;

    // Form Data State
    const [formData, setFormData] = useState<Partial<User>>({});
    console.log(formData)
    const [step, setStep] = useState(0);

    // Form Fields
    const fields = [
        { key: "firstName", placeholder: "Enter your First Name" },
        { key: "lastName", placeholder: "Enter your Last Name" },
        { key: "email", placeholder: "Enter your Email" },
        { key: "password", placeholder: "Create a Password", secureTextEntry: true },
        { key: "phone", placeholder: "Enter your Phone Number", keyboardType: "phone-pad" },
        { key: "address", placeholder: "Enter your Delivery Address" },
    ];

    // Handle Input Change
    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    // Go to Next Step
    const handleNext = () => {
        if (step < fields.length - 1) {
            setStep(step + 1);
        }
    };

    const addData = async () => {
        try {
            await addDoc(collection(db, "users"), formData);
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    const getData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    };

    const signUpUser = async (email: any, password: any) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password).then((res) => {
            console.log("User signed up:", res.user);
            addData().then((res) => {
                getData()
            })
        }).catch((err) => {
            console.error("Error from sign up user function", err.message);
        })
        return userCredential
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
                secureTextEntry={!!fields[step].secureTextEntry}
                keyboardType={fields[step].keyboardType as KeyboardTypeOptions | undefined}
                value={String(formData[fields[step].key as keyof User] || "")} // ✅ Ensure it's always a string
                onChangeText={(text) => handleChange(fields[step].key, text)}
            />

            {/* Continue / Sign Up Button */}
            {step < fields.length - 1 ? (
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleNext}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => {
                    signUpUser(formData.email, formData.password)
                    navigation.navigate("MainApp")
                }} style={[styles.button, { backgroundColor: colors.primary }]}
                // onPress={signupUser}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            )}

            {/* Social Sign Up Buttons */}
            {step === fields.length - 1 && (
                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <MaterialCommunityIcons name="google" size={28} color="#DB4437" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome name="facebook" size={28} color="#1877F2" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Already Have an Account? */}
            <TouchableOpacity onPress={() => { }
                // navigation.navigate("Login")
            }>
                <Text style={[styles.loginText, { color: colors.primary }]}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    backButton: {
        // position: "absolute",
        // top: 20,
        // left: 20,
        // zIndex: 10,
    },
    icon: {
        alignSelf: "center",
        marginBottom: 10,
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        position: "absolute",
        bottom: 40,
        width: "100%",
        alignSelf: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        // position: "absolute",
        // bottom: 20,
        width: "100%",
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        backgroundColor: "#EEE",
    },
    loginText: {
        marginTop: 15,
        fontSize: 16,
        textAlign: "center",
    },
});

export default SignUpScreen;
