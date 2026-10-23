/** Subset of a NewsAPI article that the app renders and stores. */
export interface Article {
  url: string;
  title: string;
  urlToImage?: string | null;
  description?: string | null;
  source?: {
    name: string;
  };
  publishedAt?: string;
}

export interface NewsApiResponse {
  status: 'ok' | 'error';
  totalResults?: number;
  articles?: Article[];
  code?: string;
  message?: string;
}

export interface NewsPage {
  articles: Article[];
  page: number;
  totalResults: number;
}
