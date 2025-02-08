import { useColorScheme } from "react-native";
import Colors from "../Utils/Theme";

const theme = useColorScheme(); // Returns 'light' or 'dark'
const currentColors = theme === "dark" ? Colors.dark : Colors.light;