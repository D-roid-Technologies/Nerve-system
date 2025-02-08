import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type AuthStackParamList = {
    MainApp: undefined;
};

export type Props = NativeStackScreenProps<AuthStackParamList, "MainApp">;