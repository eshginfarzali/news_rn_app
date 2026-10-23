import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';
import { useFavoritesStore } from '../../src/store/useFavoritesStore';
import { makeArticle } from '../../jest/fixtures';

const store = () => useFavoritesStore.getState();

beforeEach(() => {
  act(() => store().clearFavorites());
});

describe('useFavoritesStore', () => {
  it('adds favorites newest first', () => {
    act(() => {
      store().addFavorite(makeArticle(1));
      store().addFavorite(makeArticle(2));
    });

    expect(store().favorites.map(a => a.title)).toEqual([
      'Headline 2',
      'Headline 1',
    ]);
  });

  it('ignores duplicates by URL', () => {
    act(() => {
      store().addFavorite(makeArticle(1));
      store().addFavorite(makeArticle(1, { title: 'Updated title' }));
    });

    expect(store().favorites).toHaveLength(1);
    expect(store().favorites[0].title).toBe('Headline 1');
  });

  it('removes a favorite and reports membership', () => {
    act(() => {
      store().addFavorite(makeArticle(1));
      store().addFavorite(makeArticle(2));
      store().removeFavorite(makeArticle(1));
    });

    expect(store().isFavorite(makeArticle(1).url)).toBe(false);
    expect(store().isFavorite(makeArticle(2).url)).toBe(true);
  });

  it('clears all favorites', () => {
    act(() => {
      store().addFavorite(makeArticle(1));
      store().clearFavorites();
    });

    expect(store().favorites).toEqual([]);
  });

  it('persists only the favorites list to AsyncStorage', async () => {
    act(() => store().addFavorite(makeArticle(7)));

    const raw = await AsyncStorage.getItem('favorites-storage');
    const persisted = JSON.parse(raw as string);

    expect(Object.keys(persisted.state)).toEqual(['favorites']);
    expect(persisted.state.favorites[0].url).toBe(makeArticle(7).url);
  });
});
