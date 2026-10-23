import { fetchNewsPage, getNextPageParam, PAGE_SIZE } from '../../src/api/news';
import { jsonResponse, makeArticle, makeResponse } from '../../jest/fixtures';

const fetchMock = jest.fn();
global.fetch = fetchMock;

beforeEach(() => fetchMock.mockReset());

describe('fetchNewsPage', () => {
  it('requests the given page of US top headlines', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(makeResponse([makeArticle(1)], 1)),
    );

    await fetchNewsPage(3, 'abc');

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe(
      'https://newsapi.org/v2/top-headlines',
    );
    expect(Object.fromEntries(url.searchParams)).toEqual({
      country: 'us',
      page: '3',
      pageSize: String(PAGE_SIZE),
      apiKey: 'abc',
    });
  });

  it('returns articles with paging info and drops removed articles', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        makeResponse(
          [makeArticle(1), makeArticle(2, { title: '[Removed]' })],
          42,
        ),
      ),
    );

    const page = await fetchNewsPage(1, 'abc');

    expect(page).toEqual({
      articles: [makeArticle(1)],
      page: 1,
      totalResults: 42,
    });
  });

  it('surfaces the NewsAPI error message', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          status: 'error',
          code: 'apiKeyInvalid',
          message: 'Your API key is invalid.',
        },
        401,
      ),
    );

    await expect(fetchNewsPage(1, 'bad')).rejects.toThrow(
      'Your API key is invalid.',
    );
  });

  it('fails fast without calling the API when no key is configured', async () => {
    await expect(fetchNewsPage(1, '')).rejects.toThrow(/NEWS_API_KEY/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('getNextPageParam', () => {
  const page = (n: number, totalResults: number) => ({
    articles: [],
    page: n,
    totalResults,
  });

  it('returns the next page while results remain', () => {
    expect(getNextPageParam(page(1, 25))).toBe(2);
    expect(getNextPageParam(page(2, 25))).toBe(3);
  });

  it('stops exactly when every result has been loaded', () => {
    expect(getNextPageParam(page(3, 25))).toBeUndefined();
    expect(getNextPageParam(page(2, 20))).toBeUndefined();
  });

  it('stops when the API reports no results', () => {
    expect(getNextPageParam(page(1, 0))).toBeUndefined();
  });
});
