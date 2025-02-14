import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../Redux/slices/cartSlice";
import authReducer from "../Redux/slices/authSlice";
import orderRducer from "../Redux/slices/orderSlice";
import paymentReducer from "../Redux/slices/paymentSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderRducer,
    payment: paymentReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
