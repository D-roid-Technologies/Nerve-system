import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type AuthStackParamList = {
    MainApp: undefined;
};

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePic?: string;
    phone: string;
    address: string;
    verified: boolean;
};
export type Props = NativeStackScreenProps<AuthStackParamList, "MainApp">;