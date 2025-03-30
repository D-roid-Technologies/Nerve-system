// src/store/itemsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageSourcePropType } from 'react-native';
import { Images } from '../../Utils/Images';

// Define the type for an individual item
interface Item {
    name: string;
    description: string;
    category: string;
    material: string;
    dimensions: {
        height: string;
        width: string;
        depth: string;
    };
    weight: string;
    color: string;
    price: number;
    rating: number;
    reviews: number;
    stock: number;
    image: ImageSourcePropType | null | string; // Assuming image is a path or URL to the image
    features: string[];
    seller: {
        name: string;
        location: string;
        contact: string;
        rating: number;
    };
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
}

// Initial state of the items
interface ItemsState {
    allItems: Item[];
    loading: boolean;
    error: string | null;
}

const initialState: ItemsState = {
    allItems: [
        // 🛋️ Furniture Category
        {
            name: "Elegant Wooden Chair",
            description: "A beautifully crafted wooden chair designed for comfort and durability.",
            category: "Furniture",
            material: "Solid Oak Wood",
            dimensions: { height: "90cm", width: "50cm", depth: "45cm" },
            weight: "7kg",
            color: "Natural Wood",
            price: 79.99,
            rating: 4.7,
            reviews: 125,
            stock: 20,
            image: Images.woodenChair,
            features: [
                "Ergonomic design",
                "Scratch-resistant finish",
                "Lightweight and easy to move"
            ],
            seller: {
                name: "HomeStyle Furniture",
                location: "Los Angeles, CA",
                contact: "support@homestylefurniture.com",
                rating: 4.8,
            },
            tags: ["wooden chair", "furniture", "modern design"],
            sku: "FURN001",
            brand: "HomeStyle",
            barcode: "1234567890",
            discount: 10,
            availability: "in stock",
            warranty: "1 year manufacturer warranty",
            shippingDetails: { time: "3-5 days", cost: 15 },
            returnPolicy: "30-day return policy",
        },
        {
            name: "Modern Wooden Table",
            description: "A sleek and sturdy wooden table designed for both style and function.",
            category: "Furniture",
            material: "Solid Pine Wood",
            dimensions: { height: "75cm", width: "120cm", depth: "60cm" },
            weight: "15kg",
            color: "Dark Brown",
            price: 149.99,
            rating: 4.5,
            reviews: 98,
            stock: 15,
            image: Images.table,
            features: ["Spacious design", "Scratch-resistant", "Lightweight yet durable"],
            seller: {
                name: "FurniCraft",
                location: "New York, NY",
                contact: "sales@furnicraft.com",
                rating: 4.6,
            },
            tags: ["wooden table", "office desk", "modern table"],
            sku: "FURN002",
            brand: "FurniCraft",
            barcode: "0987654321",
            discount: 5,
            availability: "in stock",
            warranty: "2-year warranty",
            shippingDetails: { time: "5-7 days", cost: 25 },
            returnPolicy: "14-day return policy",
        },

        // 👕 Men's Fashion Category
        {
            name: "Shirt",
            description: "A stylish and comfortable cotton shirt, perfect for casual and formal occasions.",
            category: "Men",
            material: "100% Cotton",
            dimensions: { height: "N/A", width: "Varies by size", depth: "N/A" },
            weight: "300g",
            color: "Available in multiple colors",
            price: 29.99,
            rating: 4.5,
            reviews: 120,
            stock: 50,
            image: Images.shirt,
            features: ["Breathable fabric", "Slim fit", "Machine washable"],
            seller: {
                name: "FashionHub",
                location: "New York, USA",
                contact: "support@fashionhub.com",
                rating: 4.7,
            },
            tags: ["Casual", "Formal", "Trendy"],
            sku: "MENS001",
            brand: "FashionHub",
            barcode: "9876543210",
            discount: 15,
            availability: "in stock",
            warranty: "No warranty",
            shippingDetails: { time: "2-4 days", cost: 5 },
            returnPolicy: "7-day return policy",
        },

        // 📱 Electronics Category
        {
            name: "Smartphone",
            description: "A high-performance smartphone with a stunning display and advanced camera system.",
            category: "Gadgets & Electronics",
            material: "Glass & Aluminum",
            dimensions: { height: "150mm", width: "70mm", depth: "8mm" },
            weight: "180g",
            color: "Black, Silver, Blue",
            price: 699.99,
            rating: 4.8,
            reviews: 520,
            stock: 100,
            image: Images.smartphone,
            features: ["5G Connectivity", "OLED Display", "Triple-Lens Camera"],
            seller: {
                name: "TechZone",
                location: "San Francisco, USA",
                contact: "support@techzone.com",
                rating: 4.9,
            },
            tags: ["Mobile", "Tech", "Fast Charging"],
            sku: "TECH001",
            brand: "TechZone",
            barcode: "1122334455",
            discount: 10,
            availability: "in stock",
            warranty: "1-year manufacturer warranty",
            shippingDetails: { time: "1-3 days", cost: 10 },
            returnPolicy: "30-day return policy",
        },

        // 🚗 Automotive Category
        {
            name: "Car Tires",
            description: "High-quality, all-season car tires designed for safety and durability.",
            category: "Automotive",
            material: "Rubber & Steel",
            dimensions: { height: "65cm", width: "21cm", depth: "N/A" },
            weight: "10kg",
            color: "Black",
            price: 149.99,
            rating: 4.8,
            reviews: 200,
            stock: 50,
            image: Images.carTires,
            features: ["All-season", "Anti-skid grip", "Long-lasting"],
            seller: {
                name: "AutoPartsPro",
                location: "Detroit, USA",
                contact: "info@autopartspro.com",
                rating: 4.9,
            },
            tags: ["Car", "Durable", "Safe"],
            sku: "AUTO001",
            brand: "AutoPartsPro",
            barcode: "6677889900",
            discount: 5,
            availability: "in stock",
            warranty: "3-year warranty",
            shippingDetails: { time: "4-7 days", cost: 30 },
            returnPolicy: "30-day return policy",
        },
    ],
    loading: false,
    error: null,
};

// Create the slice
const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        // Set items (replace existing list)
        setItems(state, action: PayloadAction<Item[]>) {
            state.allItems = action.payload;
        },
        // Add an item to the list
        addItem(state, action: PayloadAction<Item>) {
            state.allItems.push(action.payload);
        },
        // Set loading state
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        // Set error state
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

// Selector to get all items
export const selectAllItems = (state: { items: ItemsState }) => state.items.allItems;

// Export actions for use in components
export const { setItems, addItem, setLoading, setError } = itemsSlice.actions;

// Export the reducer for the store
export default itemsSlice.reducer;
