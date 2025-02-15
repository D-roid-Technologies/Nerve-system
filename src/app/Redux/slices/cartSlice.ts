import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageSourcePropType } from "react-native";

type CartItem = {
    id: string;
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
    image: ImageSourcePropType;
    features: string[];
    seller: {
        name: string;
        location: string;
        contact: string;
        rating: number;
    };
    tags: string[];
    quantity: number;
    options?: Record<string, any>;
};

type CartState = {
    items: CartItem[];
};

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // addToCart: (state, action: PayloadAction<CartItem>) => {
        //     state.items.push(action.payload);
        // },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (item) => 
                    item.id === action.payload.id &&
                    JSON.stringify(item.options) === JSON.stringify(action.payload.options) 
            );
            if (existingItem) {
                existingItem.quantity + 1; // Increase quantity if item exists
                console.log(action.payload)
            } else {
                state.items.push({ ...action.payload, quantity: 1 }); // Add new item with quantity 1
            }
        },
        updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find((item) => item.id === action.payload.id);
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity); // Ensure quantity is at least 1
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { addToCart, removeFromCart, updateCartItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
