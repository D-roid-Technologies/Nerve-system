import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of a user
export interface User {
    id: string;
    name: string;
    email: string;
    role: string; // e.g., "admin", "user", etc.
    isActive: boolean;
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: User = {
    id: "",
    name: "",
    email: "",
    role: "",
    isActive: false,
    loading: false,
    error: null,
};

// Create the slice
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Action to start a user-related operation
        startLoading(state) {
            state.loading = true;
            state.error = null;
        },

        // Action to handle user fetch success
        fetchUserSuccess(state, action: PayloadAction<User>) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.isActive = action.payload.isActive;
            state.loading = false;
        },

        // Action to handle errors during user operations
        fetchUserFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Action to update user details
        updateUser(state, action: PayloadAction<Partial<User>>) {
            Object.assign(state, action.payload);
        },

        // Action to reset the user state
        resetUser(state) {
            state.id = "";
            state.name = "";
            state.email = "";
            state.role = "";
            state.isActive = false;
            state.loading = false;
            state.error = null;
        },
    },
});

// Export actions for use in components or thunks
export const { startLoading, fetchUserSuccess, fetchUserFailure, updateUser, resetUser } =
    userSlice.actions;

// Export the reducer to be included in the store
// export default userSlice.reducer;
