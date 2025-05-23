import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, useColorScheme, ImageBackground, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp } from '@react-navigation/native';
import Colors from '../../Utils/Theme';
import { useToast } from 'react-native-toast-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateCartItem } from '../../Redux/slices/cartSlice';
import { RootState } from '../../Redux/store';
import { selectAllItems } from '../../Redux/slices/itemSlice';

type RootStackParamList = {
    DetailsScreen: { item: any; index: number };
};

type DetailsScreenProps = {
    route: RouteProp<RootStackParamList, 'DetailsScreen'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'DetailsScreen'>;
};

const DetailsScreen: React.FC<DetailsScreenProps> = ({ route, navigation }) => {
    const toast = useToast();
    const theme = useColorScheme();
    const dispatch = useDispatch();
    const colors = theme === 'dark' ? Colors.dark : Colors.light;
    const { item, index } = route.params;

    // ✅ Moved inside component to avoid "undefined" error
    const allItems = useSelector(selectAllItems);

    const findSimilarItems = (currentItem: any, allItems: any): any => {
        return allItems.filter((item: any) => item.category === currentItem.category && item.name !== currentItem.name);
    };

    const similarItems = findSimilarItems(item, allItems);

    const mockReviews = [
        { id: 1, reviewer: 'John Doe', comment: 'Amazing product!', rating: 5 },
        { id: 2, reviewer: 'Jane Smith', comment: 'Good quality.', rating: 4 },
    ];

    const generateUniqueString = (length: number = 10): string => {
        if (length < 6 || length > 15) {
            throw new Error("Length must be between 6 and 15 characters.");
        }
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let uniqueString = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            uniqueString += characters[randomIndex];
        }
        return uniqueString;
    };

    const pushToCart = () => {
        dispatch(addOrUpdateCartItem({ ...item, quantity: 1, id: generateUniqueString(7), image: typeof item.image === 'number' ? item.image : { uri: item.image } }));
        toast.show(`${item.name} added to cart`, { type: 'success' });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background Image */}
            <ImageBackground source={typeof item.image === 'number' ? item.image : { uri: item.image || '' }} style={styles.imageBackground} resizeMode="cover">
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toast.show('Share functionality here')}>
                        <Ionicons name="share-social-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Item Details */}
                <View style={styles.detailsContainer}>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.itemPrice, { color: colors.primary }]}>£ {item.price}</Text>
                    <Text style={[styles.itemDescription, { color: colors.text }]}>{item.description}</Text>
                </View>

                {/* Similar Items */}
                <View style={styles.similarItemsContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Similar Items</Text>
                    <FlatList
                        data={similarItems}
                        horizontal
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.similarItem}
                                onPress={() => navigation.navigate('DetailsScreen', { item, index })}
                            >
                                <Image source={typeof item.image === 'number' ? item.image : { uri: item.image }} style={styles.similarItemImage} />
                                <Text style={[styles.similarItemText, { color: colors.text }]}>{item.name}</Text>
                                <Text style={[styles.similarItemPrice, { color: colors.primary }]}>£ {item.price}</Text>
                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                {/* Reviews Section */}
                <View style={styles.reviewsContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Reviews</Text>
                    {mockReviews.length > 0 ? (
                        mockReviews.map((review) => (
                            <View key={review.id} style={styles.review}>
                                <Text style={[styles.reviewer, { color: colors.text }]}>{review.reviewer}</Text>
                                <Text style={[styles.comment, { color: colors.text }]}>{review.comment}</Text>
                                <Text style={[styles.rating, { color: colors.primary }]}>⭐ {review.rating}/5</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.noReviewText, { color: colors.text }]}>No review to display</Text>
                    )}
                </View>
            </ScrollView>

            {/* Add to Cart Button */}
            <TouchableOpacity style={styles.addToCartButton} onPress={pushToCart}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 10,
    },

    imageBackground: {
        width: '100%',
        height: 300,
    },

    content: {
        padding: 16,
    },

    detailsContainer: {
        marginBottom: 20,
    },

    itemName: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    itemPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
    },

    itemDescription: {
        fontSize: 14,
        marginVertical: 5,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    similarItemsContainer: {
        marginBottom: 20,
    },

    similarItem: {
        marginRight: 16,
        alignItems: 'center',
    },

    similarItemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },

    similarItemText: {
        fontSize: 14,
        marginTop: 5,
    },

    similarItemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    reviewsContainer: {
        marginBottom: 20,
    },

    review: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f4f4f4',
    },

    reviewer: {
        fontWeight: 'bold',
    },

    comment: {
        fontSize: 14,
        marginVertical: 5,
    },

    rating: {
        fontWeight: 'bold',
    },

    noReviewText: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
    },

    addToCartButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ff4500',
        padding: 16,
        alignItems: 'center',
    },

    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DetailsScreen;
