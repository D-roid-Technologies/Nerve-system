import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    useColorScheme, ScrollView, Image, KeyboardTypeOptions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../../Utils/Theme";
import { useToast } from "react-native-toast-notifications";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store"; // adjust to your path
import { updateUser } from "../../Redux/slices/users";
import { updateUserPrimaryInfo } from "../../Config/functions"; // the update function from earlier

type SignpUser = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    profilePic?: string;
    verified?: boolean;
    middleName?: string;
    gender?: string;
    dateOfBirth?: string;
};

const EditProfileScreen: React.FunctionComponent = ({ navigation }: any) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const toast = useToast();
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user); // pull from redux

    const [userInfo, setUserInfo] = useState<any>({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        profilePic: "",
        gender: "",
        dateOfBirth: "",
    });

    const [textA, setTextA] = useState<string>("Save Changes")

    useEffect(() => {
        if (user?.email) {
            setUserInfo({
                firstName: user.firstName || "",
                middleName: user.middleName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                profilePic: user.profilePic || "",
                gender: user.gender || "",
                dateOfBirth: user.dateOfBirth || "",
            });
        }
    }, [user]);

    const handleChange = (key: keyof SignpUser, value: string) => {
        setUserInfo({ ...userInfo, [key]: value });
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedImage = result.assets[0].uri;
            setUserInfo({ ...userInfo, profilePic: selectedImage });
        }
    };

    const handleSave = async () => {
        try {
            setTextA("Updaing yor Changes");
            await updateUserPrimaryInfo(userInfo); // use function you created before

            dispatch(updateUser(userInfo)); // update Redux store
            toast.show("Profile updated successfully", { type: "success" });
            navigation.goBack();
        } catch (error) {
            setTextA("Save Changes")
            console.error("Error updating profile", error);
            toast.show("Failed to update profile", { type: "danger" });
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color={colors.text} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
                <Text style={[styles.heading, { color: colors.text }]}>Edit Profile</Text>

                {/* Profile Picture */}
                <TouchableOpacity onPress={handleImagePick} style={styles.profilePicWrapper}>
                    {userInfo.profilePic ? (
                        <Image source={{ uri: userInfo.profilePic }} style={styles.profilePic} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={100} color={colors.border} />
                    )}
                    <Text style={{ color: colors.primary, marginTop: 8 }}>Change Photo</Text>
                </TouchableOpacity>

                {/* Input Fields */}
                {[
                    { label: "First Name", key: "firstName" },
                    { label: "Middle Name", key: "middleName" },
                    { label: "Last Name", key: "lastName" },
                    {
                        label: "Email",
                        key: "email",
                        keyboardType: "email-address" as KeyboardTypeOptions,
                        editable: false,
                    },
                    { label: "Phone", key: "phone", keyboardType: "phone-pad" as KeyboardTypeOptions },
                    { label: "Address", key: "address" },
                    { label: "Gender", key: "gender" },
                    { label: "Date of Birth", key: "dateOfBirth", placeholder: "YYYY-MM-DD" },
                ].map((field) => {
                    const isDisabled = field.editable === false;

                    return (
                        <TextInput
                            key={field.key}
                            style={[
                                styles.input,
                                {
                                    borderColor: colors.border,
                                    backgroundColor: isDisabled ? "#f0f0f0" : "#fff",
                                    color: isDisabled ? "#a0a0a0" : colors.text,
                                },
                            ]}
                            placeholder={field.placeholder || field.label}
                            placeholderTextColor="gray"
                            keyboardType={field.keyboardType ?? "default"}
                            value={userInfo[field.key as keyof SignpUser]?.toString() || ""}
                            onChangeText={(text) => handleChange(field.key as keyof SignpUser, text)}
                            editable={!isDisabled}
                        />
                    );
                })}


                {/* Save Button */}
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave}>
                    <Text style={styles.buttonText}>{textA}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    heading: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 20,
        width: "100%",
        alignSelf: "center"
    },
    buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
    backButton: {},
    profilePicWrapper: {
        alignItems: "center",
        marginBottom: 20,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: "cover",
    }
});

export default EditProfileScreen;
