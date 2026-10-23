import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { createThemedStyles, useTheme } from '../theme/palette';
import type { Article } from '../types/article';

interface Props {
  article: Article;
}

const heart = require('../assets/heart.png');
const heartOutline = require('../assets/heart-outline.png');

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NewsCard: React.FC<Props> = ({ article }) => {
  // Narrow selectors so a card only re-renders when its own favorite flag changes.
  const isFav = useFavoritesStore(state =>
    state.favorites.some(fav => fav.url === article.url),
  );
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);
  const themed = themedStyles[useTheme()];

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(article);
    } else {
      addFavorite(article);
    }
  };

  const favoriteButton = (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityState={{ selected: isFav }}
      style={styles.favoriteButton}
      onPress={toggleFavorite}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Image
        source={isFav ? heart : heartOutline}
        tintColor={isFav ? '#ff4757' : '#ffffff'}
        style={styles.heartIcon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.card, themed.card]}>
      {article.urlToImage ? (
        <View>
          <Image
            source={{ uri: article.urlToImage }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.favoriteOverlay}>{favoriteButton}</View>
        </View>
      ) : null}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, themed.title]} numberOfLines={3}>
            {article.title}
          </Text>
          {/* Articles without an image still need a way to be favorited. */}
          {article.urlToImage ? null : favoriteButton}
        </View>

        {article.description ? (
          <Text
            style={[styles.description, themed.description]}
            numberOfLines={2}
          >
            {article.description}
          </Text>
        ) : null}

        <View style={styles.metadataContainer}>
          {article.source?.name ? (
            <Text style={[styles.metadata, themed.metadata]}>
              {article.source.name}
            </Text>
          ) : null}
          {article.publishedAt ? (
            <Text style={[styles.metadata, themed.metadata]}>
              {formatDate(article.publishedAt)}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 200,
    width: '100%',
  },
  favoriteOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    padding: 8,
  },
  heartIcon: {
    width: 24,
    height: 24,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
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

const themedStyles = createThemedStyles(palette =>
  StyleSheet.create({
    card: { backgroundColor: palette.card, shadowColor: palette.shadow },
    title: { color: palette.text },
    description: { color: palette.textSecondary },
    metadata: { color: palette.textMuted },
  }),
);

export default memo(NewsCard);
