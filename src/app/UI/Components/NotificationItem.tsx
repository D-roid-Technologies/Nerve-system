import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface NotificationProps {
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

const NotificationItem: React.FC<NotificationProps> = ({ title, message, timestamp, read }) => {
    return (
        <View style={[styles.container, read ? styles.read : styles.unread]}>
            <FontAwesome name={read ? "check-circle" : "circle"} size={20} color={read ? "green" : "red"} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: "row", padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    read: { backgroundColor: "#f0f0f0" },
    unread: { backgroundColor: "#ffffff" },
    textContainer: { marginLeft: 10 },
    title: { fontWeight: "bold", fontSize: 16 },
    message: { fontSize: 14, color: "#555" },
    timestamp: { fontSize: 12, color: "#999" },
});

export default NotificationItem;
