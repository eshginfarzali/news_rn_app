import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewsCard from '../components/NewsCard';
import { useNews } from '../hooks/useNews';
import { useThemeStore } from '../store/useThemeStore';
import { createThemedStyles, palettes } from '../theme/palette';
import type { Article } from '../types/article';

export default function HomeScreen() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useNews();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const themed = themedStyles[theme];
  const textColor = palettes[theme].text;

  const articles = useMemo(
    () => data?.pages.flatMap(page => page.articles) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <NewsCard article={item} />,
    [],
  );

  const containerStyle = [styles.container, themed.container];
  const messageStyle = [styles.message, themed.text];

  if (isLoading) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={textColor} />
          <Text style={messageStyle}>Loading news...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && articles.length === 0) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.centered}>
          <Text style={[styles.message, themed.error]}>
            Error: {error.message}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={textColor} />
          <Text style={messageStyle}>Loading more articles...</Text>
        </View>
      );
    }
    if (!hasNextPage && articles.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={messageStyle}>You&apos;re all caught up.</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={containerStyle} edges={['top']}>
      <View style={[styles.switchContainer, themed.surface]}>
        <Text style={[styles.themeLabel, themed.text]}>Dark Mode</Text>
        <Switch
          accessibilityLabel="Dark mode"
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <FlatList
        testID="news-list"
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.url || `article-${index}`}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={messageStyle}>No news available</Text>
          </View>
        }
        refreshing={isRefetching && !isFetchingNextPage}
        onRefresh={refetch}
      />
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(palette =>
  StyleSheet.create({
    container: { backgroundColor: palette.background },
    surface: { backgroundColor: palette.surface },
    text: { color: palette.text },
    error: { color: palette.error },
  }),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f92c46',
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});
