import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, } from "react-native";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useThemeStore } from "../store/useThemeStore";

interface Article {
    url: string;
    title: string;
    urlToImage?: string;
    description?: string;
    source?: {
        name: string;
    };
    publishedAt?: string;
}

interface Props {
    article: Article;
}

const heart = require('../assets/heart.png');
const heartOutline = require('../assets/heart-outline.png');
const NewsCard: React.FC<Props> = ({ article }) => {
    const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const isFav = favorites.some((fav) => fav?.url === article?.url);

    const toggleFavorite = () => {
        if (isFav) {
            removeFavorite(article);
        } else {
            addFavorite(article);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '';
        }
    };

    // Theme-aware styles
    const themedStyles = {
        card: {
            ...styles.card,
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            shadowColor: isDark ? '#ffffff' : '#000000',
        },
        title: {
            ...styles.title,
            color: isDark ? '#ffffff' : '#000000',
        },
        description: {
            ...styles.description,
            color: isDark ? '#cccccc' : '#666666',
        },
        metadata: {
            ...styles.metadata,
            color: isDark ? '#999999' : '#888888',
        },
    };

    return (
        <TouchableOpacity style={themedStyles.card} activeOpacity={0.7}>
            {article?.urlToImage && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: article.urlToImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >

                        <Image source={isFav ? heart : heartOutline} tintColor={isFav ? "#ff4757" : "#ffffff"} width={30} height={20} style={{ width: 30, height: 30 }} />

                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.content}>
                <Text style={themedStyles.title} numberOfLines={3}>
                    {article?.title}
                </Text>

                {article?.description && (
                    <Text style={themedStyles.description} numberOfLines={2}>
                        {article.description}
                    </Text>
                )}

                <View style={styles.metadataContainer}>
                    {article?.source?.name && (
                        <Text style={themedStyles.metadata}>
                            {article.source.name}
                        </Text>
                    )}
                    {article?.publishedAt && (
                        <Text style={themedStyles.metadata}>
                            {formatDate(article.publishedAt)}
                        </Text>
                    )}
                </View>


            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        height: 200,
        width: "100%"
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 100,
        padding: 8,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 22,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    metadataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metadata: {
        fontSize: 12,
        fontWeight: '500',
    },

});

export default memo(NewsCard);