import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Article } from '../types/article';
import { zustandStorage } from './zustandStorage';

interface FavoriteState {
  favorites: Article[];
  addFavorite: (article: Article) => void;
  removeFavorite: (article: Article) => void;
  clearFavorites: () => void;
  isFavorite: (url: string) => boolean;
}

export const useFavoritesStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (article: Article) => {
        const exists = get().favorites.some(item => item.url === article.url);
        if (!exists) {
          set(state => ({
            favorites: [article, ...state.favorites],
          }));
        }
      },

      removeFavorite: (article: Article) => {
        set(state => ({
          favorites: state.favorites.filter(item => item.url !== article.url),
        }));
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      isFavorite: (url: string) => {
        return get().favorites.some(item => item.url === url);
      },
    }),
    {
      name: 'favorites-storage',
      storage: zustandStorage,
      partialize: (state): Partial<FavoriteState> => ({
        favorites: state.favorites,
      }),
    },
  ),
);
