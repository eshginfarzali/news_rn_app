import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useThemeStore } from '../store/useThemeStore';
import NewsCard from '../components/NewsCard';

export default function FavoritesScreen() {
    const { favorites, clearFavorites } = useFavoritesStore();
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const handleClearAll = () => {
        Alert.alert(
            'Clear All Favorites',
            'Are you sure you want to remove all favorite articles?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: clearFavorites,
                },
            ]
        );
    };

    const themedStyles = {
        container: {
            flex: 1,
            backgroundColor: isDark ? '#121212' : '#ffffff',
        },
        header: {
            ...styles.header,
            backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
        },
        headerTitle: {
            ...styles.headerTitle,
            color: isDark ? '#ffffff' : '#000000',
        },
        emptyContainer: {
            ...styles.emptyContainer,
        },
        emptyText: {
            ...styles.emptyText,
            color: isDark ? '#cccccc' : '#666666',
        },
        emptySubtext: {
            ...styles.emptySubtext,
            color: isDark ? '#999999' : '#888888',
        },
        clearButton: {
            ...styles.clearButton,
            backgroundColor: isDark ? '#ff4757' : '#ff3742',
        },
    };

    const renderEmptyState = () => (
        <View style={themedStyles.emptyContainer}>

            <Text style={themedStyles.emptyText}>No Favorite Articles</Text>
            <Text style={themedStyles.emptySubtext}>
                Articles you favorite will appear here
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={themedStyles.container}>
            <View style={themedStyles.header}>
                <Text style={themedStyles.headerTitle}>
                    Favorites ({favorites.length})
                </Text>
                {favorites.length > 0 && (
                    <TouchableOpacity
                        style={themedStyles.clearButton}
                        onPress={handleClearAll}
                    >
                        <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={favorites}
                renderItem={({ item }) => <NewsCard article={item} />}
                keyExtractor={(item, index) => item.url || `favorite-${index}`}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={favorites.length === 0 ? { flex: 1 } : undefined}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 10,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    clearButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    clearButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
});