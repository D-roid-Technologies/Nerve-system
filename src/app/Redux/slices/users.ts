import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define User Type
export type User = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    profilePic?: string;
    verified?: boolean;
    middleName?: string;
    verifiedEmail?: boolean;
    verifiPhoneNmber?: boolean;
    isUserLoggedIn?: boolean;
    agreedToTerms?: boolean;
    twoFactorSettings?: boolean;
    uniqueIdentifier?: string | null;
    gender?: string;
    dateOfBirth?: string;
    loginCount?: number;
    nameInitials?: string;
    country?: ""
};

// Initial State
const initialState: User = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    profilePic: "",
    verified: false,
    middleName: "",
    verifiedEmail: false,
    verifiPhoneNmber: false,
    isUserLoggedIn: false,
    agreedToTerms: false,
    twoFactorSettings: false,
    uniqueIdentifier: null,
    gender: "",
    dateOfBirth: "",
    loginCount: 0,
    nameInitials: "",
    country: ""
};

// Create User Slice
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Action to start a user-related operation
        startLoading(state) {
            // Example: If you want to track loading state later, add state.loading = true;
        },

        // Action to handle user fetch success
        fetchUserSuccess(state, action: PayloadAction<User>) {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.loginCount = action.payload.loginCount;
            state.country = action.payload.country;

            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.address = action.payload.address;
            state.verified = action.payload.verified;
            state.profilePic = action.payload.profilePic
            console.log("from user slice", state.profilePic, state.firstName);
        },

        storeUniqueIdentifier(state, action: PayloadAction<{ uniqueIdentifier: string }>) {
            state.uniqueIdentifier = action.payload.uniqueIdentifier;
            console.log("from user slice", state.uniqueIdentifier);
        },

        // Action to update user details
        updateUser(state, action: PayloadAction<Partial<User>>) {
            Object.assign(state, action.payload);
        },

        // Action to reset the user state
        resetUser() {
            return initialState; // Resets state to initial values
        },
    },
});

// Export Actions
export const { startLoading, fetchUserSuccess, updateUser, resetUser, storeUniqueIdentifier } = userSlice.actions;

// Export Reducer
export default userSlice.reducer;
