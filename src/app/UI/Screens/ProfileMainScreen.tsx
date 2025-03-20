import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Redux/store';
import Colors from '../../Utils/Theme';

const ProfileMainScreen: React.FC<any> = ({ navigation }) => {
    const user = useSelector((state: RootState) => state.user); // Access user data from Redux store
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.profileHeader}>
                {user?.profilePic ? (
                    <Image source={{ uri: user?.profilePic }} style={styles.profileImage} />
                ) : (
                    <Ionicons name="person-circle" size={100} color="gray" />
                )}
                <Text style={styles.name}>{`${user.firstName} ${user.middleName ?? ''} ${user.lastName}`}</Text>
                <Text style={styles.email}>{`${user.email} - ${user.phone}`}</Text>
                <Text style={styles.email}>{`${user.country}`}</Text>

                {/* ✅ Verification Status List */}
                <View style={styles.statusContainer}>
                    <StatusItem label="Account Verified" status={user.verified} />
                    <StatusItem label="Email Verified" status={user.verifiedEmail} />
                    <StatusItem label="Phone Verified" status={user.verifiPhoneNmber} />
                    <StatusItem label="Agreed to Terms" status={user.agreedToTerms} />
                    <StatusItem label="2FA Enabled" status={user.twoFactorSettings} />
                </View>
            </View>
        </SafeAreaView>
    );
};

// ✅ Reusable Touchable Component for Status Indicators
const StatusItem = ({ label, status }: { label: string; status?: boolean }) => (
    <TouchableOpacity style={[styles.statusItem, { backgroundColor: Colors.light.primary }]}>
        <Text style={styles.statusText}>{label}</Text>
        <Text style={[styles.statusValue, { color: status ? "#27AE60" : "#E4AB59" }]}>
            {status ? "Verified" : "Not Verified"}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
    backButton: { marginTop: 20 },
    profileHeader: { alignItems: 'center', marginTop: 50 },
    profileImage: { width: 100, height: 100, borderRadius: 50 },
    name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    email: { fontSize: 16, color: '#777', marginTop: 5 },
    statusContainer: { marginTop: 20, alignSelf: 'stretch' },
    statusItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff'
    },
    statusText: { fontSize: 16, color: '#ffffff', fontWeight: "800" },
    statusValue: { fontSize: 16, fontWeight: '400' },
});

export default ProfileMainScreen;
