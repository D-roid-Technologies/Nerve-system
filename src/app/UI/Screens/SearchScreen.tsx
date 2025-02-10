import { FlatList, Image, ImageSourcePropType, ListRenderItem, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../Utils/Theme';
import { useToast } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { allItems } from '../../Utils/Data'; // Ensure 'allItems' is defined in this path
import { Item } from 'react-native-paper/lib/typescript/components/List/List';

const SearchScreen: React.FunctionComponent<any> = ({ navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const toast = useToast();
    const [search, setSearch] = React.useState<any>("");

    // Filter items based on search query
    const searchItem = () => {
        return allItems.filter((item) => {
            return search.toLowerCase() === ""
                ? item
                : item.category.toLowerCase().includes(search);
        });
    };

    // Render each item in the list
    const renderItem: ListRenderItem<any> = ({ item, index }) => {
        return (
            <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('DetailsScreen', { item, index })

                // toast.show("Leads to details screen")
            }>
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
                <Ionicons name="search-outline" size={24} color="gray" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Find any item"
                    placeholderTextColor="gray"
                    onChangeText={(text) => setSearch(text)} // Corrected event handler
                />
            </View>

            <FlatList
                data={searchItem()} // Get the filtered items based on search query
                keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
                renderItem={renderItem} // Render items using the `renderItem` function
                numColumns={2} // Display two items per row
                columnWrapperStyle={styles.row} // Apply styles to each row for spacing
            />
        </SafeAreaView>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 8,
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.light.primary
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 12, color: Colors.light.text },

    // Grid item styles
    row: {
        justifyContent: 'space-between', // Space between items on each row
        marginBottom: 10, // Margin between rows
    },
    itemContainer: {
        flex: 1,
        margin: 8,
        borderRadius: 8,
        backgroundColor: Colors.light.card, // Assuming this exists in your theme
        padding: 10,
        // alignItems: 'center',
    },
    itemImage: {
        width: '100%',
        height: 150,
        resizeMode: 'contain', // Make sure the image fits nicely
        borderRadius: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 900,
        color: Colors.light.text,
        marginVertical: 5,
    },
    itemCategory: {
        fontSize: 14,
        color: Colors.light.secondary,
        fontWeight: 300
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 600,
        color: Colors.light.primary,
        marginTop: 5,
    },
});
