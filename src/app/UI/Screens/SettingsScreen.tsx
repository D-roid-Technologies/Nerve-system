import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../Utils/Theme'

const SettingsScreen: React.FC<any> = ({ navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    return (
        <SafeAreaView style={[styles.container]}>
            <TouchableOpacity style={styles.backView} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
                <Text style={[styles.headerText, { color: colors.text }]}>Settings</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    backView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    headerText: { fontSize: 18, fontWeight: "bold", marginLeft: 8 },
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
})