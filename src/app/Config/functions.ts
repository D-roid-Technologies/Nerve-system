import { appBackendService } from "../Redux/Services/Service";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, storage } from "../../../firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { RootState, store } from "../Redux/store";
import { fetchUserSuccess, resetUser, storeUniqueIdentifier, updateUser } from "../Redux/slices/users";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SignpUser } from "../UI/Screens/SignUpScreen";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const addAllUserData = async (formData: SignpUser, uniqueIdentifier: string, country: string) => {
//     let loginCountNum: number = 0;
//     function capitalizeFirstLetter(str: string) {
//         return str.charAt(0).toUpperCase() + str.slice(1);
//     }
//     const handleLoginCount = (num: number): number => {
//         return num + 1
//     }
//     const getCurrentDateTime = () => {
//         const now = new Date();

//         const year = now.getFullYear(); // Retrieves the full year (e.g., 2024)
//         const month = now.getMonth() + 1; // Retrieves the month (0-11), adding 1 to make it 1-12
//         const date = now.getDate(); // Retrieves the day of the month (1-31)
//         const hours = now.getHours(); // Retrieves the hour (0-23)
//         const minutes = now.getMinutes(); // Retrieves the minutes (0-59)
//         const seconds = now.getSeconds(); // Retrieves the seconds (0-59)

//         // Formatting the date and time as strings
//         const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
//         const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

//         return {
//             year,
//             month,
//             date,
//             time: formattedTime,
//             formattedDateTime: `${formattedDate} ${formattedTime}`
//         };
//     }
//     const currentDateTime = getCurrentDateTime();
//     if (!formData.firstName || !formData.lastName) {
//         console.error("Email and password are required");
//         return;
//     }

//     const savedUserInformation = await addDoc(collection(db, "users"), {
//         primaryInformation: {
//             firstName: capitalizeFirstLetter(formData.firstName),
//             middleName: "",
//             lastName: capitalizeFirstLetter(formData.lastName),
//             email: formData.email,
//             address: formData.address,
//             profilePic: formData.profilePic,
//             verifiedEmail: formData.verified,
//             verifiPhoneNmber: false,
//             isUserLoggedIn: false,
//             phone: formData.phone,
//             agreedToTerms: false,
//             twoFactorSettings: false,
//             uniqueIdentifier: uniqueIdentifier,
//             gender: "",
//             dateOfBirth: "",
//             loginCount: handleLoginCount(loginCountNum),
//             nameInitials: `${formData.firstName[0].toUpperCase()}${formData.lastName[0].toUpperCase()}`,
//         },
//         location: {
//             countrySelected: country,
//             currentdateTime: currentDateTime,
//         },
//         notifications: {
//             allNotifications: []
//         },
//         items: {
//             allItems: []
//         }
//     }).then((res) => {
//         console.log("Document successfully written!", res.id);
//     }).catch(error => {
//         console.log(`Document not successfully written - ${error.message}`);
//     })

//     return savedUserInformation
// }

// const getOnlyUserData = async () => {
//     try {
//         const querySnapshot = await getDocs(collection(db, "users"));

//         querySnapshot.forEach((doc) => {
//             const data = doc.data();

//             if (data.primaryInformation || data.location) {
//                 const filteredData: any = {
//                     firstName: data.primaryInformation.firstName,
//                     lastName: data.primaryInformation.lastName,
//                     loginCount: data.primaryInformation.loginCount,
//                     country: data.location.country,
//                 }

//                 //     ...data.primaryInformation, // Spread user fields
//                 //     location: data.location || null, // Keep location as an optional field
//                 // };

//                 // Dispatch to Redux Store
//                 store.dispatch(fetchUserSuccess(filteredData));

//                 console.log(`User ${doc.id} Data:`, data);
//             } else {
//                 console.warn(`User ${doc.id} is missing primaryInformation`);
//             }
//         });
//     } catch (error) {
//         console.error("Error getting documents: ", error);
//     }
// };

// const updateData = async (docId: any, updatedData: any) => {
//     try {
//         const userRef = doc(db, "users", docId);
//         await updateDoc(userRef, updatedData);
//         console.log("Document successfully updated!");
//     } catch (error) {
//         console.error("Error updating document: ", error);
//     }
// };

// const deleteData = async (docId: any) => {
//     try {
//         await deleteDoc(doc(db, "users", docId));
//         console.log("Document successfully deleted!");
//     } catch (error) {
//         console.error("Error deleting document: ", error);
//     }
// };

// const uploadProfilePic = async () => {
//     const profilePic = useSelector((state: RootState) => state.user.profilePic); // Get profilePic from Redux

//     if (!profilePic) {
//         console.log("No profile picture found.");
//         return;
//     }

//     try {
//         const response = await fetch(profilePic); // Fetch image from profilePic URL
//         const blob = await response.blob(); // Convert to blob

//         // Create a unique storage reference
//         const storageRef = ref(storage, `profile_pics/${Date.now()}`);

//         // Upload file to Firebase Storage
//         await uploadBytes(storageRef, blob);
//         console.log("File uploaded successfully!");

//         // Get the download URL
//         const downloadURL = await getDownloadURL(storageRef);
//         console.log("Download URL:", downloadURL);

//         // Dispatch action to update user profile picture in Redux
//         store.dispatch(updateUser({ profilePic: downloadURL }));

//     } catch (error) {
//         console.error("Error uploading file:", error);
//     }
// };

// const resetPassword = async (email: any) => {
//     try {
//         await sendPasswordResetEmail(auth, email);
//         console.log("Password reset email sent.");
//     } catch (error: any) {
//         console.error("Password Reset Error:", error.message);
//     }
// };

const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password).then(async (res) => {
        const querySnapshot = await getDocs(collection(db, "users"));
        // console.log(res.user.uid, querySnapshot.docs)
        const userId = res.user.uid;
        const matchedUser = querySnapshot.docs
            .map(doc => doc.data())
            .find(user => user.primaryInformation.uniqueIdentifier === userId);
        if (!matchedUser) {
            console.log("⚠️ No user found with the provided USERID");
            return { error: "No matching user found" };
        }
        store.dispatch(fetchUserSuccess({
            firstName: matchedUser.primaryInformation.firstName,
            lastName: matchedUser.primaryInformation.lastName,
            middleName: matchedUser.primaryInformation.middleName,
            loginCount: matchedUser.primaryInformation.loginCount,
            country: matchedUser.location?.countrySelected,
            email: matchedUser.primaryInformation.email,
            phone: matchedUser.primaryInformation.phone,
            address: matchedUser.primaryInformation.address,
            verified: matchedUser.primaryInformation.verified,
            profilePic: matchedUser.primaryInformation.profilePic,
            gender: matchedUser.primaryInformation.gender,
            dateOfBirth: matchedUser.primaryInformation.dateOfBirth,
        }));

        console.log("✅ User data stored successfully!");
    }).catch((error) => {
        console.error("Login Error:", error.message);

        // Handle Firebase authentication errors
        if (error.code === "auth/user-not-found") {
            return { error: "User does not exist. Please sign up." };
        } else if (error.code === "auth/wrong-password") {
            return { error: "Incorrect password. Please try again." };
        } else if (error.code === "auth/invalid-credential") {
            return { error: "Invalid email or password." };
        } else {
            return { error: "An unexpected error occurred. Please try again later." };
        }
    });
    return userCredential;
};

const logoutUser = async () => {
    try {
        await signOut(auth);
        store.dispatch(resetUser())
        console.log("User logged out.");
    } catch (error: any) {
        console.error("Logout Error:", error.message);
    }
};

const signUpUser = async (formData: SignpUser, country: string) => {
    if (!formData.email || !formData.password) {
        console.error("Email and password are required");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );
        const USERID = userCredential.user.uid; // The UserID
        await AsyncStorage.setItem("USERID", USERID);
        store.dispatch(storeUniqueIdentifier({ uniqueIdentifier: USERID }));

        let loginCountNum: number = 0;

        // Helper function to capitalize the first letter
        function capitalizeFirstLetter(str: string) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        // Handle login count increment
        const handleLoginCount = (num: number): number => {
            return num + 1;
        };
        // Function to get the current date and time
        const getCurrentDateTime = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const date = now.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            return {
                year,
                month,
                date,
                time: formattedTime,
                formattedDateTime: `${formattedDate} ${formattedTime}`
            };
        };

        const currentDateTime = getCurrentDateTime();

        // Adding the user data to Firestore
        await addDoc(collection(db, "users"), {
            primaryInformation: {
                firstName: capitalizeFirstLetter(formData.firstName),
                middleName: "",
                lastName: capitalizeFirstLetter(formData.lastName),
                email: formData.email,
                address: formData.address,
                profilePic: formData.profilePic,
                verifiedEmail: false,
                verifiPhoneNmber: false,
                isUserLoggedIn: false,
                phone: formData.phone,
                agreedToTerms: false,
                twoFactorSettings: false,
                uniqueIdentifier: USERID,
                gender: "",
                dateOfBirth: "",
                loginCount: handleLoginCount(loginCountNum),
                nameInitials: `${formData.firstName[0].toUpperCase()}${formData.lastName[0].toUpperCase()}`
            },
            location: {
                countrySelected: country,
                currentdateTime: currentDateTime
            },
            notifications: {
                allNotifications: []
            },
            items: {
                allItems: []
            }
        }).then(async () => {
            console.log("Document successfully written!");

            // Fetching the user from the database
            const querySnapshot = await getDocs(collection(db, "users"));

            let matchedUser: any = null;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.primaryInformation.uniqueIdentifier === USERID) {
                    matchedUser = data;
                }
            });
            if (matchedUser) {
                store.dispatch(fetchUserSuccess({
                    firstName: matchedUser.primaryInformation.firstName,
                    lastName: matchedUser.primaryInformation.lastName,
                    loginCount: matchedUser.primaryInformation.loginCount,
                    country: matchedUser.location?.countrySelected,
                    email: matchedUser.primaryInformation.email,
                    phone: matchedUser.primaryInformation.phone,
                    address: matchedUser.primaryInformation.address,
                    verified: matchedUser.primaryInformation.verified,
                    profilePic: matchedUser.primaryInformation.profilePic
                }));
            } else {
                console.log("No user found with the provided USERID");
            }

        }).catch((error) => {
            console.log(`Document not successfully written - ${error.message}`);
        });
        return userCredential;
    } catch (err: any) {
        console.error("Error Setting up your account", err.message);
    }
};

const updateUserPrimaryInfo = async (formData: any) => {
    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    try {
        const USERID = await AsyncStorage.getItem("USERID");
        if (!USERID) {
            console.error("No USERID found. User might not be logged in.");
            return;
        }

        const querySnapshot = await getDocs(collection(db, "users"));
        let userDocId: string | null = null;

        // Find the correct document by USERID
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.primaryInformation?.uniqueIdentifier === USERID) {
                userDocId = docSnap.id;
            }
        });

        if (!userDocId) {
            console.error("No user document found for the provided USERID");
            return;
        }

        const userDocRef = doc(db, "users", userDocId);

        // Update the primaryInformation
        await updateDoc(userDocRef, {
            primaryInformation: {
                firstName: capitalizeFirstLetter(formData.firstName),
                middleName: capitalizeFirstLetter(formData.middleName || ""),
                lastName: capitalizeFirstLetter(formData.lastName),
                email: formData.email,
                address: formData.address,
                profilePic: formData.profilePic || "",
                verifiedEmail: false,
                verifiPhoneNmber: false,
                isUserLoggedIn: false,
                phone: formData.phone,
                agreedToTerms: false,
                twoFactorSettings: false,
                uniqueIdentifier: USERID,
                gender: formData.gender || "",
                dateOfBirth: formData.dateOfBirth || "",
                loginCount: 1, // Or keep previous count logic if needed
                nameInitials: `${formData.firstName[0].toUpperCase()}${formData.lastName[0].toUpperCase()}`
            }
        });

        console.log("User primary information successfully updated.");
    } catch (err) {
        console.error("Error updating user information:", err);
    }
};

// const signUpUser = async (formData: SignpUser, country: string) => {
//     if (!formData.email || !formData.password) {
//         console.error("Email and password are required");
//         return;
//     }

//     try {
//         // Sign up with email and password using Supabase
//         const { data, error } = await supabase.auth.signUp({
//             email: formData.email,
//             password: formData.password,
//         });

//         if (error) {
//             console.error("Error signing up:", error.message);
//             return;
//         }

//         // const USERID = data.user?.id; // Accessing the user ID from the data property
//         const USERID: any = data.user?.id
//         await AsyncStorage.setItem("USERID", USERID);
//         store.dispatch(storeUniqueIdentifier({ uniqueIdentifier: USERID }));

//         let loginCountNum = 0;

//         // Helper function to capitalize the first letter
//         const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

//         // Helper function for login count increment
//         const handleLoginCount = (num: number) => num + 1;

//         // Function to get the current date and time
//         const getCurrentDateTime = () => {
//             const now = new Date();
//             const year = now.getFullYear();
//             const month = now.getMonth() + 1;
//             const date = now.getDate();
//             const hours = now.getHours();
//             const minutes = now.getMinutes();
//             const seconds = now.getSeconds();

//             const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
//             const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

//             return {
//                 year,
//                 month,
//                 date,
//                 time: formattedTime,
//                 formattedDateTime: `${formattedDate} ${formattedTime}`,
//             };
//         };

//         const currentDateTime = getCurrentDateTime();

//         // Inserting user data into Supabase table
//         const { error: insertError } = await supaBase
//             .from('users') // Replace 'users' with your table name
//             .insert([
//                 {
//                     first_name: capitalizeFirstLetter(formData.firstName),
//                     last_name: capitalizeFirstLetter(formData.lastName),
//                     email: formData.email,
//                     address: formData.address,
//                     profile_pic: formData.profilePic,
//                     verified_email: false,
//                     verified_phone_number: false,
//                     is_user_logged_in: false,
//                     phone: formData.phone,
//                     agreed_to_terms: false,
//                     two_factor_settings: false,
//                     unique_identifier: USERID,
//                     gender: "", // Replace with formData.gender if available
//                     date_of_birth: "", // Replace with formData.dateOfBirth if available
//                     login_count: handleLoginCount(loginCountNum),
//                     name_initials: `${formData.firstName[0].toUpperCase()}${formData.lastName[0].toUpperCase()}`,
//                     country: country,
//                     current_date_time: currentDateTime.formattedDateTime,
//                 },
//             ]);

//         if (insertError) {
//             console.error("Error inserting user data:", insertError.message);
//             return;
//         }

//         console.log("User data successfully inserted!");

//         // Fetching the user from the database
//         const { data: userData, error: fetchError } = await supaBase
//             .from('users')
//             .select('*')
//             .eq('unique_identifier', USERID)
//             .single();

//         if (fetchError) {
//             console.log("Error fetching user data:", fetchError.message);
//             return;
//         }

//         if (userData) {
//             store.dispatch(
//                 fetchUserSuccess({
//                     firstName: userData.first_name,
//                     lastName: userData.last_name,
//                     loginCount: userData.login_count,
//                     country: userData.country,
//                     email: userData.email,
//                     phone: userData.phone,
//                     address: userData.address,
//                     verified: userData.verified_email,
//                     profilePic: userData.profile_pic,
//                 })
//             );
//         } else {
//             console.log("No user found with the provided USERID");
//         }

//         return data.user; // Return the user from the response
//     } catch (err: any) {
//         console.error("Error setting up your account:", err.message);
//     }
// };


export { signUpUser, logoutUser, loginUser, updateUserPrimaryInfo }
