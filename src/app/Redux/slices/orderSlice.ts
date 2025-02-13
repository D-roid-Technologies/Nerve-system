import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
    activeTabIndex: number;
}

const initialState: OrderState = {
    activeTabIndex: 0,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setActiveTabIndex: (state, action: PayloadAction<number>) => {
            state.activeTabIndex = action.payload;
        },
    },
});

export const { setActiveTabIndex } = orderSlice.actions;
export default orderSlice.reducer;