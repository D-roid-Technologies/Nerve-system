import { appBackendService } from "../Redux/Services/Service";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { SignpUser } from "../UI/Screens/SignUpScreen";
import { store } from "../Redux/store";
import { fetchUserSuccess } from "../Redux/slices/users";

const addAllUserData = async (formData: SignpUser, uniqueIdentifier: string, country: string) => {
    let loginCountNum: number = 0;
    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const handleLoginCount = (num: number): number => {
        return num + 1
    }
    const getCurrentDateTime = () => {
        const now = new Date();

        const year = now.getFullYear(); // Retrieves the full year (e.g., 2024)
        const month = now.getMonth() + 1; // Retrieves the month (0-11), adding 1 to make it 1-12
        const date = now.getDate(); // Retrieves the day of the month (1-31)
        const hours = now.getHours(); // Retrieves the hour (0-23)
        const minutes = now.getMinutes(); // Retrieves the minutes (0-59)
        const seconds = now.getSeconds(); // Retrieves the seconds (0-59)

        // Formatting the date and time as strings
        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        return {
            year,
            month,
            date,
            time: formattedTime,
            formattedDateTime: `${formattedDate} ${formattedTime}`
        };
    }
    const currentDateTime = getCurrentDateTime();
    if (!formData.firstName || !formData.lastName) {
        console.error("Email and password are required");
        return;
    }

    const savedUserInformation = await addDoc(collection(db, "users"), {
        primaryInformation: {
            firstName: capitalizeFirstLetter(formData.firstName),
            middleName: "",
            lastName: capitalizeFirstLetter(formData.lastName),
            email: formData.email,
            address: formData.address,
            profilePic: formData.profilePic,
            verifiedEmail: formData.verified,
            verifiPhoneNmber: false,
            isUserLoggedIn: false,
            phone: formData.phone,
            agreedToTerms: false,
            twoFactorSettings: false,
            uniqueIdentifier: uniqueIdentifier,
            gender: "",
            dateOfBirth: "",
            loginCount: handleLoginCount(loginCountNum),
            nameInitials: `${formData.firstName[0].toUpperCase()}${formData.lastName[0].toUpperCase()}`,
        },
        location: {
            countrySelected: country,
            currentdateTime: currentDateTime,
        },
        notifications: {
            allNotifications: []
        },
        items: {
            allItems: []
        }
    }).then((res) => {
        console.log("Document successfully written!", res.id);
    }).catch(error => {
        console.log(`Document not successfully written - ${error.message}`);
    })

    return savedUserInformation
}

const getOnlyUserData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (data.primaryInformation || data.location) {
                const filteredData: any = {
                    firstName: data.primaryInformation.firstName,
                    lastName: data.primaryInformation.lastName,
                    loginCount: data.primaryInformation.loginCount,
                    country: data.location.country,
                }

                //     ...data.primaryInformation, // Spread user fields
                //     location: data.location || null, // Keep location as an optional field
                // };

                // Dispatch to Redux Store
                store.dispatch(fetchUserSuccess(filteredData));

                console.log(`User ${doc.id} Data:`, data);
            } else {
                console.warn(`User ${doc.id} is missing primaryInformation`);
            }
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
};


const signUpUser = async (formData: SignpUser, country: string) => {
    if (!formData.email || !formData.password) {
        console.error("Email and password are required");
        return;
    }

    try {
        // Creating user with email and password
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );

        const USERID = userCredential.user.uid; // The UserID
        console.log("User Authenticated, ID is -", USERID);

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
                // Check if the primaryInformation.uniqueIdentifier matches USERID
                if (data.primaryInformation.uniqueIdentifier === USERID) {
                    matchedUser = data;
                }
            });

            // If a user with matching USERID is found, dispatch the data to Redux
            if (matchedUser) {
                store.dispatch(fetchUserSuccess({
                    firstName: matchedUser.primaryInformation.firstName,
                    lastName: matchedUser.primaryInformation.lastName,
                    loginCount: matchedUser.primaryInformation.loginCount,
                    country: matchedUser.location?.countrySelected,
                    email: matchedUser.primaryInformation.email,
                    phone: matchedUser.primaryInformation.phone,
                    address: matchedUser.primaryInformation.address
                }));
                // console.log("Matched User Data:", matchedUser);
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


export { signUpUser }