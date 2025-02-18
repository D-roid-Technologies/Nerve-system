import { StyleSheet, Text, View, ScrollView, ImageSourcePropType, TouchableOpacity, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
// import { addToCart } from '../../Redux/slices/cartSlice';
import { allItems } from '../../Utils/Data';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import Colors from '../../Utils/Theme';

interface Dimensions {
    height: string;
    width: string;
    depth: string;
}

interface Seller {
    name: string;
    location: string;
    contact: string;
    rating: number;
}

interface Item {
    id: string;
    name: string;
    description: string;
    category: string;
    material: string;
    dimensions: Dimensions;
    weight: string;
    color: string;
    price: number;
    rating: number;
    reviews: number;
    stock: number;
    image: ImageSourcePropType | null;
    features: string[];
    seller: Seller;
    tags: string[];
    quantity: number
}

const UploadItemScreen: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch();
    const theme = useColorScheme();
    const colors = theme === 'dark' ? Colors.dark : Colors.light;

    const generateUniqueString = (length: number = 10): string => {
        if (length < 6 || length > 15) {
            throw new Error("Length must be between 6 and 15 characters.");
        }

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let uniqueString = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            uniqueString += characters[randomIndex];
        }

        return uniqueString;
    };

    const [createItem, setCreateItem] = useState<Item>({
        quantity: 1,
        id: generateUniqueString(9),
        name: "",
        description: "",
        category: "",
        material: "",
        dimensions: { height: "", width: "", depth: "" },
        weight: "",
        color: "",
        price: 0,
        rating: 0,
        reviews: 0,
        stock: 0,
        image: null,
        features: [],
        seller: { name: "", location: "", contact: "", rating: 0 },
        tags: [],
    });

    const handleChange = (key: keyof Item, value: string | number) => {
        setCreateItem((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleNestedChange = <T extends keyof Item, K extends keyof Item[T]>(
        parentKey: T,
        key: K,
        value: string | number
    ) => {
        setCreateItem((prev) => ({
            ...prev,
            [parentKey]: {
                ...(prev[parentKey] as any), // Ensure type safety for nested objects
                [key]: value,
            },
        }));
    };

    const validateAndAddToCart = (dispatch: any, createItem: Item) => {
        // Helper function to check if a value is empty
        const isEmpty = (value: any): boolean => {
            return (
                value === undefined ||
                value === null ||
                (typeof value === "string" && value.trim() === "") ||
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === "object" && Object.keys(value).length === 0)
            );
        };

        // Check required fields
        const requiredFields = [
            "id", "name", "description", "category", "material", "weight", "color", "price",
            "rating", "reviews", "stock", "image", "features", "tags", "quantity", "seller"
        ];

        for (const field of requiredFields) {
            if (isEmpty(createItem[field as keyof Item])) {
                throw new Error(`Field "${field}" cannot be empty`);
            }
        }

        // Check nested objects
        const requiredDimensions = ["height", "width", "depth"];
        for (const dim of requiredDimensions) {
            if (isEmpty(createItem.dimensions[dim as keyof Item["dimensions"]])) {
                throw new Error(`Dimension "${dim}" cannot be empty`);
            }
        }

        const requiredSellerFields = ["name", "location", "contact", "rating"];
        for (const field of requiredSellerFields) {
            if (isEmpty(createItem.seller[field as keyof Item["seller"]])) {
                throw new Error(`Seller field "${field}" cannot be empty`);
            }
        }

        // If all fields are valid, add to cart
        allItems.push(createItem)
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backView} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
                <Text style={[styles.headerText, { color: colors.text }]}>Create Your Item</Text>
            </TouchableOpacity>
            <ScrollView>
                <Text style={styles.title}>Add Item</Text>

                <TextInput
                    label="Item Name"
                    value={createItem.name}
                    onChangeText={(text) => handleChange("name", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Description"
                    value={createItem.description}
                    onChangeText={(text) => handleChange("description", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Category"
                    value={createItem.category}
                    onChangeText={(text) => handleChange("category", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Material"
                    value={createItem.material}
                    onChangeText={(text) => handleChange("material", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Weight"
                    value={createItem.weight}
                    onChangeText={(text) => handleChange("weight", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Color"
                    value={createItem.color}
                    onChangeText={(text) => handleChange("color", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Price"
                    value={String(createItem.price)}
                    keyboardType="numeric"
                    onChangeText={(text) => handleChange("price", Number(text))}
                    style={styles.input}
                />
                <TextInput
                    label="Stock"
                    value={String(createItem.stock)}
                    keyboardType="numeric"
                    onChangeText={(text) => handleChange("stock", Number(text))}
                    style={styles.input}
                />

                <Text style={styles.sectionTitle}>Dimensions</Text>
                <TextInput
                    label="Height"
                    value={createItem.dimensions.height}
                    onChangeText={(text) => handleNestedChange("dimensions", "height", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Width"
                    value={createItem.dimensions.width}
                    onChangeText={(text) => handleNestedChange("dimensions", "width", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Depth"
                    value={createItem.dimensions.depth}
                    onChangeText={(text) => handleNestedChange("dimensions", "depth", text)}
                    style={styles.input}
                />

                <Text style={styles.sectionTitle}>Seller Info</Text>
                <TextInput
                    label="Seller Name"
                    value={createItem.seller.name}
                    onChangeText={(text) => handleNestedChange("seller", "name", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Seller Location"
                    value={createItem.seller.location}
                    onChangeText={(text) => handleNestedChange("seller", "location", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Seller Contact"
                    value={createItem.seller.contact}
                    onChangeText={(text) => handleNestedChange("seller", "contact", text)}
                    style={styles.input}
                />
                <TextInput
                    label="Seller Rating"
                    value={String(createItem.seller.rating)}
                    keyboardType="numeric"
                    onChangeText={(text) => handleNestedChange("seller", "rating", Number(text))}
                    style={styles.input}
                />

                <Button mode="contained" onPress={() => {
                    validateAndAddToCart
                    // console.log(createItem)
                }
                } style={styles.button}>
                    Upload Item
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadItemScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    title: { fontSize: 13, fontWeight: "bold", marginBottom: 10 },
    sectionTitle: { fontSize: 13, fontWeight: "bold", marginTop: 20, marginBottom: 5 },
    input: { marginBottom: 10 },
    button: { marginTop: 20 },
    topCon: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    topConLeft: { flexDirection: "row", alignItems: "center" },
    topConRight: { flexDirection: "row", alignItems: "center" },
    backView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 10
    },
    headerText: { fontSize: 18, fontWeight: "bold", marginLeft: 8 },
});
