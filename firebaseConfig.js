// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyDC2Qy8T_kRFyVQ9kHoQW0SskBSXvF9_Ks",
    authDomain: "nerve-systems.firebaseapp.com",
    projectId: "nerve-systems",
    storageBucket: "nerve-systems.firebasestorage.app",
    messagingSenderId: "974655658158",
    appId: "1:974655658158:web:53d826113a9bf73162753f",
    measurementId: "G-YE1NTKY187"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };