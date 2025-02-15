import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the allowed keys for orders
export type OrderKeys =
    | "paidOrders"
    | "sealedOrders"
    | "dispatchedOrders"
    | "arrivedOrders"
    | "confirmedOrders"
    | "returnedOrders"
    | "reviewOrders";

// Define the structure of an order item
export interface OrderItem {
    id: string;
    name: string;
    status: string;
}

// Define the Redux state for orders
export interface OrderState {
    activeTabIndex: number;
    paidOrders: OrderItem[];
    sealedOrders: OrderItem[];
    dispatchedOrders: OrderItem[];
    arrivedOrders: OrderItem[];
    confirmedOrders: OrderItem[];
    returnedOrders: OrderItem[];
    reviewOrders: OrderItem[];
}

// Initial state for Redux store
const initialState: OrderState = {
    activeTabIndex: 0,
    paidOrders: [],
    sealedOrders: [],
    dispatchedOrders: [],
    arrivedOrders: [],
    confirmedOrders: [],
    returnedOrders: [],
    reviewOrders: [],
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        // Reducer to set the active tab index
        setActiveTabIndex: (state, action: PayloadAction<number>) => {
            state.activeTabIndex = action.payload;
        },
        
        // Reducer to add an order dynamically
        addOrder: (
            state,
            action: PayloadAction<{ category: OrderKeys; order: OrderItem }>
        ) => {
            const { category, order } = action.payload;
            state[category] = [...state[category], order]; // ✅ No more TypeScript error!
        },
    },
});

export const { setActiveTabIndex, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
