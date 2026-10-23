import type { Article, NewsApiResponse } from '../src/types/article';

export const makeArticle = (n: number, overrides: Partial<Article> = {}) => ({
  url: `https://example.com/article-${n}`,
  title: `Headline ${n}`,
  description: `Description ${n}`,
  urlToImage: `https://example.com/image-${n}.jpg`,
  source: { name: 'Example News' },
  publishedAt: '2025-08-01T10:00:00Z',
  ...overrides,
});

export const makeResponse = (
  articles: Article[],
  totalResults: number,
): NewsApiResponse => ({ status: 'ok', totalResults, articles });

/** A minimal fetch Response stand-in for mocking global.fetch. */
export const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
