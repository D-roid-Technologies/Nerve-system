import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePic?: string;
    phone: string;
    address: string;
    verified: boolean
};

type AuthState = {
    user: User | null;
};

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
