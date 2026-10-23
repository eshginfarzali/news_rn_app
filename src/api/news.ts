import { NEWS_API_KEY } from '@env';
import type { NewsApiResponse, NewsPage } from '../types/article';

export const BASE_URL = 'https://newsapi.org/v2';
export const PAGE_SIZE = 10;

export async function fetchNewsPage(
  page: number,
  apiKey: string | undefined = NEWS_API_KEY,
): Promise<NewsPage> {
  if (!apiKey) {
    throw new Error('NEWS_API_KEY is missing. Copy .env.example to .env.');
  }

  const params = new URLSearchParams({
    country: 'us',
    page: String(page),
    pageSize: String(PAGE_SIZE),
    apiKey,
  });
  const response = await fetch(`${BASE_URL}/top-headlines?${params}`);
  const data: NewsApiResponse = await response.json().catch(() => ({
    status: 'error',
  }));

  if (!response.ok || data.status === 'error') {
    throw new Error(
      data.message ?? `Failed to fetch news (${response.status})`,
    );
  }

  return {
    // NewsAPI marks deleted articles with this placeholder title.
    articles: (data.articles ?? []).filter(a => a.title !== '[Removed]'),
    page,
    totalResults: data.totalResults ?? 0,
  };
}

/** Returns the next page number, or undefined when every result is loaded. */
export function getNextPageParam(lastPage: NewsPage): number | undefined {
  const loaded = lastPage.page * PAGE_SIZE;
  return loaded < lastPage.totalResults ? lastPage.page + 1 : undefined;
}
