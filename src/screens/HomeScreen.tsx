import React, { useCallback } from "react";
import {
    FlatList,
    ActivityIndicator,
    View,
    Switch,
    StyleSheet,
    SafeAreaView,
    Text,
} from "react-native";
import { useNews } from "../hooks/useNews";
import { useThemeStore } from "../store/useThemeStore";
import NewsCard from "../components/NewsCard";

export default function HomeScreen() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        error
    } = useNews();
    const { theme, toggleTheme } = useThemeStore();
    const isDark = theme === "dark";

    const articles = data?.pages.flatMap((page) => page?.articles || []) || [];

    console.log('HomeScreen Render:', {
        articlesCount: articles.length,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        pagesCount: data?.pages?.length || 0,
        error: error?.message
    });

    const handleEndReached = useCallback(() => {
        console.log('🔄 onEndReached triggered');
        console.log('📊 Current state:', {
            hasNextPage,
            isFetchingNextPage,
            articlesLength: articles.length
        });

        if (hasNextPage && !isFetchingNextPage) {
            console.log('✅ Conditions met, fetching next page...');
            fetchNextPage()
                .then(() => console.log('✅ Next page fetch completed'))
                .catch((err) => console.log('❌ Next page fetch failed:', err));
        } else {
            console.log('❌ Conditions not met:', {
                hasNextPage,
                isFetchingNextPage
            });
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, articles.length]);

    // Theme-aware styles
    const themedStyles = {
        container: {
            flex: 1,
            backgroundColor: isDark ? '#121212' : '#ffffff',
        },
        switchContainer: {
            ...styles.switchContainer,
            backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
        },
        loadingText: {
            color: isDark ? '#ffffff' : '#000000',
        }
    };

    // Error handling
    if (error) {
        return (
            <SafeAreaView style={themedStyles.container}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: isDark ? '#ff6b6b' : '#d63384' }]}>
                        Error: {error.message}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isLoading && articles.length === 0) {
        return (
            <SafeAreaView style={themedStyles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
                    <Text style={[styles.loadingText, themedStyles.loadingText]}>Loading news...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={themedStyles.container}>
            <View style={themedStyles.container}>
                <View style={themedStyles.switchContainer}>
                    <Text style={[styles.themeLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                        Dark Mode
                    </Text>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
                    />
                </View>

                {/* Debug məlumatları */}
                <View style={styles.debugContainer}>
                    <Text style={[styles.debugText, { color: isDark ? '#ffffff' : '#000000' }]}>
                        Articles: {articles.length} | Pages: {data?.pages?.length || 0} | HasMore: {hasNextPage ? 'Yes' : 'No'}
                    </Text>
                </View>

                <FlatList
                    data={articles}
                    renderItem={({ item }) => <NewsCard article={item} />}
                    keyExtractor={(item, index) => item.url || `article-${index}`}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1} // Daha erkən trigger
                    ListFooterComponent={() => {
                        console.log('📱 Rendering footer:', { isFetchingNextPage, hasNextPage });

                        if (isFetchingNextPage) {
                            return (
                                <View style={styles.footerLoader}>
                                    <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
                                    <Text style={[styles.loadingText, themedStyles.loadingText]}>
                                        Loading more articles...
                                    </Text>
                                </View>
                            );
                        }

                        if (!hasNextPage && articles.length > 0) {
                            return (
                                <View style={styles.footerLoader}>
                                    <Text style={[styles.loadingText, themedStyles.loadingText]}>
                                        🎉 You've reached the end!
                                    </Text>
                                </View>
                            );
                        }

                        if (hasNextPage) {
                            return (
                                <View style={styles.footerLoader}>
                                    <Text style={[styles.loadingText, themedStyles.loadingText]}>
                                        👆 Scroll up for more articles
                                    </Text>
                                </View>
                            );
                        }

                        return null;
                    }}
                    ListEmptyComponent={
                        !isLoading ? (
                            <View style={styles.emptyContainer}>
                                <Text style={[styles.emptyText, { color: isDark ? '#ffffff' : '#000000' }]}>
                                    No news available
                                </Text>
                            </View>
                        ) : null
                    }
                    refreshing={isLoading}
                    onRefresh={refetch}
                    showsVerticalScrollIndicator={true}
                    removeClippedSubviews={false} // Debug üçün
                    onScroll={(event) => {
                        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
                        const isCloseToBottom = contentOffset.y >= contentSize.height - layoutMeasurement.height - 100;

                        if (isCloseToBottom) {
                            console.log('📍 Close to bottom detected');
                        }
                    }}
                    scrollEventThrottle={400}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    themeLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    debugContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: 'rgba(255, 255, 0, 0.1)',
        borderRadius: 5,
    },
    debugText: {
        fontSize: 12,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
    footerLoader: {
        padding: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
    },
});