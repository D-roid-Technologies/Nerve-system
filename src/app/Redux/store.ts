import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../Redux/slices/cartSlice";
import authReducer from "../Redux/slices/authSlice";
import orderRducer from "../Redux/slices/orderSlice";
import paymentReducer from "../Redux/slices/paymentSlice";
import notificationReducer from "../Redux/slices/notificationSlice";
import userReducer from "../Redux/slices/users";
import itemReducer from "../Redux/slices/itemSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderRducer,
    payment: paymentReducer,
    notifications: notificationReducer,
    user: userReducer,
    items: itemReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

