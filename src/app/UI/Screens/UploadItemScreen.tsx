import { StyleSheet, Text, View, ScrollView, ImageSourcePropType, TouchableOpacity, useColorScheme, Image, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
// import { addToCart } from '../../Redux/slices/cartSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import Colors from '../../Utils/Theme';
import * as ImagePicker from "expo-image-picker";
import { db } from '../../../../firebaseConfig'; // Import your Firestore instance
import { doc, getDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    image: ImageSourcePropType | null | string;
    features: string[];
    seller: Seller;
    tags: string[];
    sku: string;
    brand: string;
    barcode: string;
    discount: number;
    availability: string;
    warranty: string;
    shippingDetails: {
        time: string;
        cost: number;
    };
    returnPolicy: string;
    quantity: number;
}

const UploadItemScreen: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch();
    const theme = useColorScheme();
    const colors = theme === 'dark' ? Colors.dark : Colors.light;
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [uploadText, setUploadText] = useState<string>("Upload Item");

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

    const categories = [
        "Furniture", "Men", "Gadgets & Electronics", "Foods",
        "Women", "Fashion", "Automotive"
    ];

    const [createItem, setCreateItem] = useState<Item>({
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
        sku: "",
        brand: "",
        barcode: "",
        discount: 0,
        availability: "",
        warranty: "",
        shippingDetails: { time: "", cost: 0 },
        returnPolicy: "",
        quantity: 1,
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
        // allItems.push(createItem)
    };
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleChange("image", result.assets[0].uri);
        }
    };

    const handleItemUpload = async () => {
        try {
            setUploadText("Uploading your Item ...");

            // Ensure that 'createItem' has all the required data before uploading
            const itemData = {
                name: createItem.name,
                description: createItem.description,
                category: createItem.category,
                material: createItem.material,
                dimensions: createItem.dimensions,
                weight: createItem.weight,
                color: createItem.color,
                price: createItem.price,
                stock: createItem.stock,
                tags: createItem.tags,
                sku: createItem.sku,
                brand: createItem.brand,
                barcode: createItem.barcode,
                discount: createItem.discount,
                availability: createItem.availability,
                warranty: createItem.warranty,
                shippingDetails: createItem.shippingDetails,
                returnPolicy: createItem.returnPolicy,
                seller: createItem.seller,
                image: createItem.image, // Ensure image is set correctly
                timestamp: new Date(), // Add timestamp for when the item was created
            };

            // Retrieve the USERID from AsyncStorage
            const USERID = await AsyncStorage.getItem("USERID");

            if (!USERID) {
                setUploadText("Upload your Item");
                console.error("User is not logged in. Cannot upload item.");
                return;
            }

            // Get the reference to the user document
            const userDocRef = doc(db, "users", USERID);
            console.log(userDocRef)

            // Fetch the document from Firestore
            const userDocSnapshot = await getDoc(userDocRef);

            // Check if the document exists
            if (!userDocSnapshot.exists()) {
                setUploadText("Upload your Item");
                console.error("User document does not exist.");
                console.log(userDocSnapshot)
                return;
            }

            // Retrieve the current items array from the user document
            const matchedUser = userDocSnapshot.data();

            if (matchedUser && matchedUser.items && matchedUser.items.allItems) {
                // Add the new item to the existing array
                await updateDoc(userDocRef, {
                    "items.allItems": arrayUnion(itemData) // Use arrayUnion to add the item without duplication
                });

                setUploadText("Item uploaded successfully!");
                console.log("Item successfully added to the user's items list");

            } else {
                setUploadText("Upload your Item");
                console.error("User's items array is missing or empty.");
            }

        } catch (err) {
            setUploadText("Upload your Item");
            console.error("Error uploading item: ", err);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backView} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={24} color="#000" />
                <Text style={styles.headerText}>Create Your Item</Text>
            </TouchableOpacity>
            {/* Category Selection Modal */}
            <Modal visible={categoryModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleChange("category", item);
                                        setCategoryModalVisible(false);
                                    }}
                                    style={styles.modalItem}
                                >
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button onPress={() => setCategoryModalVisible(false)}>Cancel</Button>
                    </View>
                </View>
            </Modal>
            <ScrollView>
                <Text style={styles.title}>Step 1: Upload Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    {createItem.image ? <Image source={{ uri: createItem.image as string }} style={styles.image} /> : <Text>Select Image</Text>}
                </TouchableOpacity>

                <Text style={styles.title}>Step 2: Basic Information</Text>
                <TextInput label="Item Name" value={createItem.name} onChangeText={(text) => handleChange("name", text)} style={styles.input} />
                <TextInput label="Description" value={createItem.description} onChangeText={(text) => handleChange("description", text)} style={styles.input} />
                <TouchableOpacity
                    onPress={() => setCategoryModalVisible(true)}
                    style={styles.input}
                >
                    <Text>{createItem.category || "Select Category"}</Text>
                </TouchableOpacity>
                <TextInput label="Material" value={createItem.material} onChangeText={(text) => handleChange("material", text)} style={styles.input} />
                <TextInput label="Weight" value={createItem.weight} onChangeText={(text) => handleChange("weight", text)} style={styles.input} />
                <TextInput label="Color" value={createItem.color} onChangeText={(text) => handleChange("color", text)} style={styles.input} />
                <TextInput label="Price" value={String(createItem.price)} keyboardType="numeric" onChangeText={(text) => handleChange("price", Number(text))} style={styles.input} />
                <TextInput label="Stock" value={String(createItem.stock)} keyboardType="numeric" onChangeText={(text) => handleChange("stock", Number(text))} style={styles.input} />
                <TextInput label="SKU" value={createItem.sku} onChangeText={(text) => handleChange("sku", text)} style={styles.input} />

                <Text style={styles.title}>Step 3: Additional Details</Text>
                <TextInput label="Brand" value={createItem.brand} onChangeText={(text) => handleChange("brand", text)} style={styles.input} />
                <TextInput label="Barcode" value={createItem.barcode} onChangeText={(text) => handleChange("barcode", text)} style={styles.input} />
                <TextInput label="Discount" value={String(createItem.discount)} keyboardType="numeric" onChangeText={(text) => handleChange("discount", Number(text))} style={styles.input} />
                <TextInput label="Availability" value={createItem.availability} onChangeText={(text) => handleChange("availability", text)} style={styles.input} />
                <TextInput label="Warranty" value={createItem.warranty} onChangeText={(text) => handleChange("warranty", text)} style={styles.input} />
                <TextInput label="Shipping Time" value={createItem.shippingDetails.time} onChangeText={(text) => handleNestedChange("shippingDetails", "time", text)} style={styles.input} />
                <TextInput label="Shipping Cost" value={String(createItem.shippingDetails.cost)} keyboardType="numeric" onChangeText={(text) => handleNestedChange("shippingDetails", "cost", Number(text))} style={styles.input} />
                <TextInput label="Return Policy" value={createItem.returnPolicy} onChangeText={(text) => handleChange("returnPolicy", text)} style={styles.input} />

                <Text style={styles.title}>Seller Information</Text>
                <TextInput label="Seller Name" value={createItem.seller.name} onChangeText={(text) => handleNestedChange("seller", "name", text)} style={styles.input} />
                <TextInput label="Seller Location" value={createItem.seller.location} onChangeText={(text) => handleNestedChange("seller", "location", text)} style={styles.input} />
                <TextInput label="Seller Contact" value={createItem.seller.contact} onChangeText={(text) => handleNestedChange("seller", "contact", text)} style={styles.input} />
                <TextInput label="Seller Rating" value={String(createItem.seller.rating)} keyboardType="numeric" onChangeText={(text) => handleNestedChange("seller", "rating", Number(text))} style={styles.input} />

                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleItemUpload}>
                    <Text style={styles.buttonText}>{uploadText}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadItemScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    input: { width: "100%", padding: 8, borderWidth: 1, borderRadius: 8, marginBottom: 15, backgroundColor: "#ffffff" },
    button: { paddingVertical: 14, borderRadius: 8, alignItems: "center", width: "100%" },
    backView: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    headerText: { fontSize: 18, fontWeight: "bold", marginLeft: 8 },
    imagePicker: { alignItems: "center", padding: 10, borderWidth: 1, borderRadius: 8, marginBottom: 15 },
    image: { width: 100, height: 100, borderRadius: 8 },
    buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%"
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    }
});

