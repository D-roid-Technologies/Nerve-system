// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getDatabase(app);
const analytics = getAnalytics(app);

export {db}