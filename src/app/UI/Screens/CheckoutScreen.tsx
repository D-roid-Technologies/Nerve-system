import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch } from 'react-redux'
import Colors from '../../Utils/Theme'
import { useToast } from 'react-native-toast-notifications'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type RootStackParamList = {
    DetailsScreen: { item: any; index: number };
};

type DetailsScreenProps = {
    route: RouteProp<RootStackParamList, 'DetailsScreen'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'DetailsScreen'>;
};

const CheckoutScreen: React.FC<DetailsScreenProps> = ({ navigation }) => {
    const theme = useColorScheme();
    const dispatch = useDispatch();
    const toast = useToast();
    const colors = theme === 'dark' ? Colors.dark : Colors.light;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backView} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
                    <Text style={styles.headerText}>Order Confrimation</Text>
                    <Text></Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toast.show('Share functionality here')}>
                    <Ionicons name="share-social-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default CheckoutScreen

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        zIndex: 10,
    },
    backView: {
        gap: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    headerText: { fontSize: 20, fontWeight: "bold" },
})