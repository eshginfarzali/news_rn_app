import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNewsPage, getNextPageParam } from '../api/news';

export const useNews = () => {
  return useInfiniteQuery({
    queryKey: ['news', 'top-headlines'],
    queryFn: ({ pageParam }) => fetchNewsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: 5 * 60 * 1000,
  });
};
