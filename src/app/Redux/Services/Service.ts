import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth"; // Import Firebase Auth for React Native
import { User } from "../../Utils/Types";

export class Service {

    // Register User in Firebase Auth
    signupUser = async (formData: { email: string; password: string }) => {
        try {
            const { email, password } = formData; // Destructure formData

            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            console.log("User registered successfully:", userCredential.user);

            // Store user data in Realtime Database
            await database().ref(`/users/${userCredential.user.uid}`).set({
                email: userCredential.user.email,
                createdAt: new Date().toISOString(),
            });

            return userCredential.user;
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    };


    // Authenticate User (Login)
    async loginUser(email: string, password: string) {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            console.log("User logged in successfully:", userCredential.user);
            return userCredential.user;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    // Logout User
    async logoutUser() {
        try {
            await auth().signOut();
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }

    // Password Reset
    async resetPassword(email: string) {
        try {
            await auth().sendPasswordResetEmail(email);
            console.log("Password reset email sent");
        } catch (error) {
            console.error("Error sending password reset email:", error);
            throw error;
        }
    }
}

export const appBackendService = new Service();
