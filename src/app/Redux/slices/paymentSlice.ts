import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Simulated Payment API
const mockPaymentAPI = async (cartItems: any[]) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2; // 80% chance of success
            isSuccess ? resolve({ status: 'success' }) : reject(new Error('Payment failed'));
        }, 2000);
    });
};

// Async Thunk to process payment
export const processPayment = createAsyncThunk(
    'payment/processPayment',
    async (cartItems: any[], { rejectWithValue }) => {
        try {
            const response = await mockPaymentAPI(cartItems);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        loading: false,
        error: "",
        success: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(processPayment.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.success = false;
            })
            .addCase(processPayment.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(processPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export default paymentSlice.reducer;
