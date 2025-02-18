import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    FlatList,
    Image,
    ImageSourcePropType,
    Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Theme";
import { Images } from "../../Utils/Images";
import { useToast } from "react-native-toast-notifications";

// Define category type
type CategoryType = "Explore" | "Mens" | "Womens" | "Gadgets" | "Automotive";

// Define categories
const categories: CategoryType[] = ["Explore", "Mens", "Womens", "Gadgets", "Automotive"];

// Define item structure
interface Item {
    id: number;
    name: string;
    description: string;
    category: string;
    material: string;
    dimensions: {
        height: string;
        width: string;
        depth: string;
    };
    weight: string;
    color: string;
    price: number;
    rating: number;
    reviews: number;
    stock: number;
    image: ImageSourcePropType;
    features: string[];
    seller: {
        name: string;
        location: string;
        contact: string;
        rating: number;
    };
    tags: string[];
}

// Define sample items as an array of objects
const sampleItems: Record<CategoryType, Item[]> = {
    Explore: [
        {
            id: 1,
            name: "Elegant Wooden Chair",
            description:
                "A beautifully crafted wooden chair designed for comfort and durability. Made from high-quality oak wood with a smooth finish, this chair is perfect for both home and office use.",
            category: "Furniture",
            material: "Solid Oak Wood",
            dimensions: {
                height: "90cm",
                width: "50cm",
                depth: "45cm",
            },
            weight: "7kg",
            color: "Natural Wood",
            price: 79.99,
            rating: 4.7,
            reviews: 125,
            stock: 20,
            image: Images.woodenChair,
            features: [
                "Ergonomic design for maximum comfort",
                "Durable and long-lasting wood construction",
                "Scratch-resistant and polished finish",
                "Lightweight and easy to move",
                "Ideal for dining rooms, offices, and lounges",
            ],
            seller: {
                name: "HomeStyle Furniture",
                location: "Los Angeles, CA",
                contact: "support@homestylefurniture.com",
                rating: 4.8,
            },
            tags: ["wooden chair", "furniture", "dining chair", "modern design"],
        },
        {
            id: 2,
            name: "Modern Wooden Table",
            description:
                "A sleek and sturdy wooden table designed for both style and function. Its spacious surface makes it ideal for dining, work, or decorative purposes.",
            category: "Furniture",
            material: "Solid Pine Wood",
            dimensions: {
                height: "75cm",
                width: "120cm",
                depth: "60cm",
            },
            weight: "15kg",
            color: "Dark Brown",
            price: 149.99,
            rating: 4.5,
            reviews: 98,
            stock: 15,
            image: Images.table,
            features: [
                "Spacious and sturdy design",
                "Scratch and water-resistant finish",
                "Perfect for workspaces and dining areas",
                "Lightweight yet highly durable",
                "Minimalist and modern aesthetic",
            ],
            seller: {
                name: "FurniCraft",
                location: "New York, NY",
                contact: "sales@furnicraft.com",
                rating: 4.6,
            },
            tags: ["wooden table", "furniture", "office desk", "modern table"],
        },
        {
            id: 3,
            name: "Stylish LED Lamp",
            description:
                "A modern LED lamp with adjustable brightness levels, perfect for reading, working, or creating a cozy atmosphere in any room.",
            category: "Lighting",
            material: "Aluminum and Glass",
            dimensions: {
                height: "40cm",
                width: "15cm",
                depth: "15cm",
            },
            weight: "2.5kg",
            color: "Matte Black",
            price: 39.99,
            rating: 4.8,
            reviews: 152,
            stock: 30,
            image: Images.lamp,
            features: [
                "Adjustable brightness with touch control",
                "Energy-efficient LED technology",
                "Modern and elegant design",
                "Durable and lightweight construction",
                "Perfect for bedrooms, offices, and living rooms",
            ],
            seller: {
                name: "BrightHome",
                location: "Chicago, IL",
                contact: "info@brighthome.com",
                rating: 4.9,
            },
            tags: ["LED lamp", "lighting", "desk lamp", "modern decor"],
        },
        {
            id: 4,
            name: "Luxury Fabric Sofa",
            description:
                "A comfortable and stylish fabric sofa, offering ample seating space and premium cushioning for relaxation and luxury.",
            category: "Furniture",
            material: "High-density Foam and Linen Fabric",
            dimensions: {
                height: "85cm",
                width: "200cm",
                depth: "90cm",
            },
            weight: "45kg",
            color: "Deep Blue",
            price: 499.99,
            rating: 4.9,
            reviews: 210,
            stock: 10,
            image: Images.sofa,
            features: [
                "Spacious and ultra-comfortable",
                "Premium quality fabric upholstery",
                "Removable and washable cushion covers",
                "Modern and elegant design",
                "Durable frame and high-density foam padding",
            ],
            seller: {
                name: "CozyLiving",
                location: "San Francisco, CA",
                contact: "support@cozyliving.com",
                rating: 4.8,
            },
            tags: ["sofa", "living room", "modern furniture", "comfortable seating"],
        },
        {
            id: 5,
            name: "King-Size Luxury Bed",
            description:
                "A premium king-size bed crafted for ultimate comfort and support. Its solid wood frame and high-quality mattress ensure a restful night’s sleep.",
            category: "Furniture",
            material: "Solid Teak Wood and Memory Foam",
            dimensions: {
                height: "120cm",
                width: "200cm",
                depth: "180cm",
            },
            weight: "70kg",
            color: "Walnut Brown",
            price: 799.99,
            rating: 4.9,
            reviews: 185,
            stock: 8,
            image: Images.bed,
            features: [
                "Premium memory foam mattress included",
                "Sturdy and durable wooden frame",
                "Modern and luxurious design",
                "Ample space for a restful sleep",
                "Ideal for master bedrooms and luxury suites",
            ],
            seller: {
                name: "DreamBeds",
                location: "Seattle, WA",
                contact: "sales@dreambeds.com",
                rating: 4.9,
            },
            tags: ["king-size bed", "luxury furniture", "bedroom", "modern design"],
        },
    ],
    Mens: [
        {
            id: 1,
            name: "Shirt",
            description: "A stylish and comfortable cotton shirt, perfect for casual and formal occasions.",
            category: "Mens Fashion",
            material: "100% Cotton",
            dimensions: {
                height: "N/A",
                width: "Varies by size",
                depth: "N/A",
            },
            weight: "300g",
            color: "Available in multiple colors",
            price: 29.99,
            rating: 4.5,
            reviews: 120,
            stock: 50,
            image: Images.shirt,
            features: ["Breathable fabric", "Slim fit", "Machine washable"],
            seller: {
                name: "FashionHub",
                location: "New York, USA",
                contact: "support@fashionhub.com",
                rating: 4.7,
            },
            tags: ["Casual", "Formal", "Trendy", "Comfortable"],
        },
        {
            id: 2,
            name: "Pants",
            description: "Durable and stylish chino pants designed for everyday wear.",
            category: "Mens Fashion",
            material: "98% Cotton, 2% Spandex",
            dimensions: {
                height: "N/A",
                width: "Varies by size",
                depth: "N/A",
            },
            weight: "500g",
            color: "Black, Navy, Khaki",
            price: 39.99,
            rating: 4.6,
            reviews: 85,
            stock: 40,
            image: Images.pants,
            features: ["Stretchable fabric", "Wrinkle-resistant", "Multiple pockets"],
            seller: {
                name: "TrendWear",
                location: "Los Angeles, USA",
                contact: "support@trendwear.com",
                rating: 4.8,
            },
            tags: ["Casual", "Workwear", "Stylish"],
        },
        {
            id: 3,
            name: "Shoes",
            description: "Comfortable and stylish sneakers suitable for casual and athletic wear.",
            category: "Mens Fashion",
            material: "Leather & Mesh",
            dimensions: {
                height: "N/A",
                width: "Varies by size",
                depth: "N/A",
            },
            weight: "800g",
            color: "White, Black, Blue",
            price: 59.99,
            rating: 4.7,
            reviews: 200,
            stock: 30,
            image: Images.shoes,
            features: ["Breathable mesh", "Memory foam sole", "Anti-slip grip"],
            seller: {
                name: "UrbanFootwear",
                location: "London, UK",
                contact: "info@urbanfootwear.com",
                rating: 4.9,
            },
            tags: ["Casual", "Athletic", "Comfortable"],
        },
        {
            id: 4,
            name: "Watch",
            description: "Classic analog wristwatch with a stainless steel body and leather strap.",
            category: "Mens Fashion",
            material: "Stainless Steel & Leather",
            dimensions: {
                height: "N/A",
                width: "42mm Dial",
                depth: "10mm",
            },
            weight: "250g",
            color: "Black, Brown",
            price: 129.99,
            rating: 4.8,
            reviews: 95,
            stock: 20,
            image: Images.watch,
            features: ["Water-resistant", "Quartz movement", "Scratch-proof glass"],
            seller: {
                name: "LuxuryTime",
                location: "Tokyo, Japan",
                contact: "sales@luxurytime.com",
                rating: 4.9,
            },
            tags: ["Luxury", "Formal", "Elegant"],
        },
    ],
    Womens: [
        {
            id: 1,
            name: "Dress",
            description: "Elegant evening dress perfect for special occasions and parties.",
            category: "Womens Fashion",
            material: "Silk & Lace",
            dimensions: {
                height: "N/A",
                width: "Varies by size",
                depth: "N/A",
            },
            weight: "600g",
            color: "Red, Blue, Black",
            price: 79.99,
            rating: 4.8,
            reviews: 150,
            stock: 35,
            image: Images.dress,
            features: ["Soft and breathable", "Slim fit", "Machine washable"],
            seller: {
                name: "ElegantWear",
                location: "Paris, France",
                contact: "contact@elegantwear.com",
                rating: 4.7,
            },
            tags: ["Elegant", "Partywear", "Trendy"],
        },
        {
            id: 2,
            name: "Handbag",
            description: "Spacious and stylish handbag with multiple compartments.",
            category: "Womens Fashion",
            material: "Genuine Leather",
            dimensions: {
                height: "30cm",
                width: "40cm",
                depth: "15cm",
            },
            weight: "1.2kg",
            color: "Black, Beige, Brown",
            price: 99.99,
            rating: 4.6,
            reviews: 200,
            stock: 25,
            image: Images.handbag,
            features: ["Adjustable strap", "Multiple pockets", "Water-resistant"],
            seller: {
                name: "LuxuryBags",
                location: "Milan, Italy",
                contact: "info@luxurybags.com",
                rating: 4.8,
            },
            tags: ["Luxury", "Stylish", "Trendy"],
        },
        {
            id: 3,
            name: "Heels",
            description: "Chic high heels designed for comfort and elegance.",
            category: "Womens Fashion",
            material: "Suede & Rubber",
            dimensions: {
                height: "10cm heel",
                width: "Varies by size",
                depth: "N/A",
            },
            weight: "800g",
            color: "Red, Nude, Black",
            price: 69.99,
            rating: 4.7,
            reviews: 90,
            stock: 40,
            image: Images.heels,
            features: ["Slip-resistant sole", "Soft cushioning", "Elegant design"],
            seller: {
                name: "ChicFootwear",
                location: "New York, USA",
                contact: "support@chicfootwear.com",
                rating: 4.9,
            },
            tags: ["Elegant", "Trendy", "Comfortable"],
        },
        {
            id: 4,
            name: "Jewelry",
            description: "Premium 18K gold-plated jewelry set for an elegant touch.",
            category: "Womens Fashion",
            material: "18K Gold & Zircon",
            dimensions: {
                height: "N/A",
                width: "Adjustable",
                depth: "N/A",
            },
            weight: "200g",
            color: "Gold, Silver",
            price: 149.99,
            rating: 4.9,
            reviews: 110,
            stock: 15,
            image: Images.jewelry,
            features: ["Hypoallergenic", "Non-tarnish", "Elegant design"],
            seller: {
                name: "GoldLux",
                location: "Dubai, UAE",
                contact: "sales@goldlux.com",
                rating: 5.0,
            },
            tags: ["Luxury", "Elegant", "Exclusive"],
        },
    ],
    Gadgets: [
        {
            id: 1,
            name: "Smartphone",
            description: "A high-performance smartphone with a stunning display and advanced camera system.",
            category: "Gadgets & Electronics",
            material: "Glass & Aluminum",
            dimensions: {
                height: "150mm",
                width: "70mm",
                depth: "8mm",
            },
            weight: "180g",
            color: "Black, Silver, Blue",
            price: 699.99,
            rating: 4.8,
            reviews: 520,
            stock: 100,
            image: Images.smartphone,
            features: ["5G Connectivity", "OLED Display", "Triple-Lens Camera"],
            seller: {
                name: "TechZone",
                location: "San Francisco, USA",
                contact: "support@techzone.com",
                rating: 4.9,
            },
            tags: ["Mobile", "Tech", "Fast Charging"],
        },
        {
            id: 2,
            name: "Laptop",
            description: "Powerful laptop with a sleek design, ideal for work, gaming, and entertainment.",
            category: "Gadgets & Electronics",
            material: "Aluminum & Plastic",
            dimensions: {
                height: "20mm",
                width: "320mm",
                depth: "220mm",
            },
            weight: "1.5kg",
            color: "Grey, Silver",
            price: 1199.99,
            rating: 4.7,
            reviews: 350,
            stock: 50,
            image: Images.laptop,
            features: ["16GB RAM", "512GB SSD", "4K Display"],
            seller: {
                name: "DigitalWorld",
                location: "London, UK",
                contact: "info@digitalworld.com",
                rating: 4.8,
            },
            tags: ["Work", "Gaming", "Portable"],
        },
        {
            id: 3,
            name: "Headphones",
            description: "Wireless noise-canceling headphones for immersive audio experiences.",
            category: "Gadgets & Electronics",
            material: "Plastic & Memory Foam",
            dimensions: {
                height: "180mm",
                width: "160mm",
                depth: "80mm",
            },
            weight: "300g",
            color: "Black, White",
            price: 199.99,
            rating: 4.6,
            reviews: 240,
            stock: 75,
            image: Images.headphones,
            features: ["Bluetooth 5.0", "Active Noise Cancelling", "20h Battery Life"],
            seller: {
                name: "AudioPro",
                location: "Berlin, Germany",
                contact: "sales@audiopro.com",
                rating: 4.7,
            },
            tags: ["Music", "Wireless", "Travel"],
        },
        {
            id: 4,
            name: "Camera",
            description: "Professional DSLR camera with high-resolution image and video capture.",
            category: "Gadgets & Electronics",
            material: "Metal & Rubber",
            dimensions: {
                height: "120mm",
                width: "140mm",
                depth: "80mm",
            },
            weight: "1.2kg",
            color: "Black",
            price: 1499.99,
            rating: 4.9,
            reviews: 180,
            stock: 30,
            image: Images.camera,
            features: ["4K Video Recording", "Dual Lens", "WiFi & Bluetooth"],
            seller: {
                name: "PhotoGear",
                location: "Tokyo, Japan",
                contact: "support@photogear.com",
                rating: 5.0,
            },
            tags: ["Photography", "Professional", "High-Resolution"],
        },
    ],
    Automotive: [
        {
            id: 1,
            name: "Car Tires",
            description: "High-quality, all-season car tires designed for safety and durability.",
            category: "Automotive",
            material: "Rubber & Steel",
            dimensions: {
                height: "65cm",
                width: "21cm",
                depth: "N/A",
            },
            weight: "10kg",
            color: "Black",
            price: 149.99,
            rating: 4.8,
            reviews: 200,
            stock: 50,
            image: Images.carTires,
            features: ["All-season", "Anti-skid grip", "Long-lasting"],
            seller: {
                name: "AutoPartsPro",
                location: "Detroit, USA",
                contact: "info@autopartspro.com",
                rating: 4.9,
            },
            tags: ["Car", "Durable", "Safe"],
        },
        {
            id: 2,
            name: "Car Battery",
            description: "Reliable car battery with long-lasting power and quick charge capacity.",
            category: "Automotive",
            material: "Lead-Acid",
            dimensions: {
                height: "25cm",
                width: "35cm",
                depth: "20cm",
            },
            weight: "20kg",
            color: "Black, Blue",
            price: 199.99,
            rating: 4.7,
            reviews: 150,
            stock: 40,
            image: Images.carBattery,
            features: ["High Capacity", "Fast Charging", "Maintenance-Free"],
            seller: {
                name: "PowerDrive",
                location: "Toronto, Canada",
                contact: "sales@powerdrive.com",
                rating: 4.8,
            },
            tags: ["Battery", "Car", "Reliable"],
        },
        {
            id: 3,
            name: "Helmet",
            description: "Safety-certified motorcycle helmet with impact-resistant technology.",
            category: "Automotive",
            material: "Fiberglass & Polycarbonate",
            dimensions: {
                height: "35cm",
                width: "25cm",
                depth: "30cm",
            },
            weight: "1.5kg",
            color: "Black, Red, White",
            price: 89.99,
            rating: 4.9,
            reviews: 300,
            stock: 80,
            image: Images.helmet,
            features: ["Shock-absorption", "Adjustable Strap", "Lightweight"],
            seller: {
                name: "MotoGear",
                location: "Sydney, Australia",
                contact: "support@motogear.com",
                rating: 4.9,
            },
            tags: ["Motorcycle", "Safety", "Durable"],
        },
    ]
};

const HomeScreen: React.FC<any> = ({ navigation }) => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>("Explore");
    const toast = useToast()

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.imageView}>
                    <Image source={Images.logoInner} style={styles.mainLogo} />
                </View>
                <TouchableOpacity onPress={() => toast.show("Leads to Notification Screen")}>
                    <Ionicons name="notifications-outline" size={28} color={colors.text} />
                    {/* <Ionicons name="person-outline" size={28} color={colors.text} /> */}
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <Pressable onPress={() => navigation.navigate("Search")}>
                <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
                    <Ionicons name="search-outline" size={24} color={colors.text} />
                    <Text style={styles.searchInput}>
                        Search...
                    </Text>
                </View>
            </Pressable>

            <View>
                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryItem,
                                selectedCategory === category && { backgroundColor: colors.primary },
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === category ? { color: colors.card } : { color: colors.text }]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Ad View */}
                <View style={styles.adView}>
                    <Text style={styles.adText}>🔥 Special Deals! Up to 50% OFF</Text>
                </View>
            </View>

            {/* Household Items Scroll (Only shows when 'Explore' is selected) */}
            {selectedCategory === "Explore" && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.householdScroll}>
                    {sampleItems.Explore.map((item, index) => (
                        <TouchableOpacity key={item.id} style={styles.householdItem} onPress={() => navigation.navigate('DetailsScreen', { item, index })}>
                            <View style={styles.householdItemView}>
                                <Image source={item.image} style={styles.image} />
                                <Text style={styles.householdText}>{item.name}</Text>
                                <View>
                                    <Text style={styles.householdTextPrice}>{`£ ${item.price}`}</Text>
                                    <Text style={styles.householdTextRating}>{`Rated - ${item.rating}`}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Main Items List (Dynamically Updates Based on Category Selection) */}

            <FlatList
                data={sampleItems[selectedCategory]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={[styles.itemBox, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('DetailsScreen', { item, index })}>
                        <View style={[styles.householdItemView, { height: 250 }]}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                <Image source={item.image} style={styles.image} />
                            </View>
                            <Text style={styles.householdText}>{item.name}</Text>
                            <View>
                                <Text style={styles.householdTextPrice}>{`£ ${item.price}`}</Text>
                                <Text style={styles.householdTextRating}>{`Rated - ${item.rating}`}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.itemsList}
                ListEmptyComponent={<Text style={styles.noItems}>No items available</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },

    imageView: {
        width: 100,
        height: 30
    },
    mainLogo: {
        width: "auto",
        height: 30
    },
    // Header
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },

    // Search Bar
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 8,
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.light.primary
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 12, color: Colors.light.text },

    // Category List
    categoryList: { flexDirection: "row", paddingVertical: 10 },
    categoryItem: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 8 },
    categoryText: { fontWeight: 800 },

    // Ad View
    adView: { height: 50, backgroundColor: Colors.light.warning, borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 20 },
    adText: { fontSize: 16, fontWeight: 800, color: "#333333" },

    // Household Items Scroll
    householdItemView: { width: "95%", backgroundColor: "white", height: 550, marginRight: 50, paddingHorizontal: 10, borderRadius: 20 },
    householdScroll: { flexDirection: "row", marginBottom: 30, borderRadius: 20 },
    householdItem: { width: "20%", borderRadius: 20 },
    householdText: { fontSize: 14, fontWeight: "800", marginTop: 10, letterSpacing: 1 },
    householdTextPrice: { fontSize: 12, fontWeight: 400, marginTop: 10, letterSpacing: 1 },
    householdTextRating: { fontSize: 12, fontWeight: 400, marginTop: 10, letterSpacing: 1 },

    // Main Items
    itemsList: { paddingBottom: 20 },
    itemBox: { padding: 20, borderRadius: 20, marginVertical: 6, },
    itemText: { fontSize: 16, fontWeight: "bold" },
    noItems: { textAlign: "center", fontSize: 16, marginVertical: 20 },

    // Image Styles
    image: { width: "100%", height: 150, }
});

export default HomeScreen;
