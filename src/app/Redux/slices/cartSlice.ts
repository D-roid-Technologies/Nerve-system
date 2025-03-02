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
    image: ImageSourcePropType | null;
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
        addOrUpdateCartItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (item) =>
                    item.id === action.payload.id &&
                    JSON.stringify(item.options) === JSON.stringify(action.payload.options)
            );
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    // addToCart, 
    removeFromCart,
    clearCart,
    addOrUpdateCartItem
} = cartSlice.actions;
export default cartSlice.reducer;
