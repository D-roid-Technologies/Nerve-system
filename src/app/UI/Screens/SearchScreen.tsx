import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ListRenderItem,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../Utils/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { selectAllItems } from '../../Redux/slices/itemSlice';

const SearchScreen: React.FunctionComponent<any> = ({ navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;

    // Get all items from Redux store
    const allItems = useSelector(selectAllItems);

    // Search query state
    const [search, setSearch] = useState<string>("");

    // Filter items based on search query
    const filteredItems = allItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    // Render each item in the list
    const renderItem: ListRenderItem<any> = ({ item, index }) => {
        return (
            <Pressable
                style={styles.itemContainer}
                onPress={() => navigation.navigate('DetailsScreen', { item, index })}
            >
                <Image
                    source={typeof item.image === 'number' ? item.image : { uri: String(item.image) }}
                    style={styles.itemImage}
                />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Search Bar */}
            <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
                <Ionicons name="search-outline" size={24} color="gray" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Find any item"
                    placeholderTextColor="gray"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
            </View>

            {/* Items List */}
            <FlatList
                data={filteredItems} // Display filtered items
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={<Text style={styles.emptyText}>No items found</Text>} // Show if no results
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
    },
    itemImage: {
        width: '100%',
        height: 150,
        resizeMode: 'contain', // Make sure the image fits nicely
        borderRadius: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '900',
        color: Colors.light.text,
        marginVertical: 5,
    },
    itemCategory: {
        fontSize: 14,
        color: Colors.light.secondary,
        fontWeight: '300'
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.primary,
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
        marginTop: 20,
    }
});
