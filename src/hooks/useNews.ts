import { useInfiniteQuery } from '@tanstack/react-query';

const API_KEY = 'db31291ab416491784597a156613ab8e';
const BASE_URL = 'https://newsapi.org/v2';

const fetchNews = async ({ pageParam = 1 }) => {
  const response = await fetch(
    `${BASE_URL}/top-headlines?country=us&page=${pageParam}&pageSize=10&apiKey=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();

  return {
    articles: data.articles || [],
    currentPage: pageParam,
    totalResults: data.totalResults || 0,
    hasMore: pageParam * 20 < (data.totalResults || 0),
  };
};

export const useNews = () => {
  return useInfiniteQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.hasMore) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    // cacheTime: 10 * 60 * 1000, // 10 dəqiqə
  });
};
