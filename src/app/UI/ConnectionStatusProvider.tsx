import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AppEntry from "./AppEntry";
import Offline from "./Screens/Offline";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

interface ConnectionStatusContextType {
    isOnline: boolean;
}

const ConnectionStatusContext = createContext<ConnectionStatusContextType | null>(null);

export const ConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOnline, setIsOnline] = useState<boolean>(true);

    const updateConnectionStatus = useCallback(() => {
        NetInfo.fetch().then((state: any) => {
            setIsOnline(state.isConnected === true);
        });
    }, []);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            setIsOnline(state.isConnected === true);
        });

        // Ensure the initial state is set correctly
        updateConnectionStatus();

        return () => {
            unsubscribe();
        };
    }, [updateConnectionStatus]);

    return (
        <ConnectionStatusContext.Provider value={{ isOnline }}>
            {children}
        </ConnectionStatusContext.Provider>
    );
};

const useConnectionStatus = (): ConnectionStatusContextType => {
    const context = useContext(ConnectionStatusContext);
    if (!context) {
        throw new Error("useConnectionStatus must be used within a ConnectionStatusProvider");
    }
    return context;
};

export const ConnectionStatusIndicator: React.FC = () => {
    const { isOnline } = useConnectionStatus();

    return (
        <View style={styles.container}>
            {isOnline ? <AppEntry /> : <Offline />}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#080B13"
    },
});
