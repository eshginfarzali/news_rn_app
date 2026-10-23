import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import { PAGE_SIZE } from '../../src/api/news';
import { jsonResponse, makeArticle, makeResponse } from '../../jest/fixtures';

const fetchMock = jest.fn();
global.fetch = fetchMock;

const articles = (from: number, count: number) =>
  Array.from({ length: count }, (_, i) => makeArticle(from + i));

const pageOf = (url: string) => Number(new URL(url).searchParams.get('page'));

const renderScreen = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false, gcTime: Infinity } },
        })
      }
    >
      <HomeScreen />
    </QueryClientProvider>,
  );

beforeEach(() => fetchMock.mockReset());

describe('HomeScreen infinite scroll', () => {
  it('loads the next page on end reached and stops at the last page', async () => {
    const total = PAGE_SIZE + 3;
    fetchMock.mockImplementation((url: string) =>
      Promise.resolve(
        jsonResponse(
          pageOf(url) === 1
            ? makeResponse(articles(1, PAGE_SIZE), total)
            : makeResponse(articles(PAGE_SIZE + 1, 3), total),
        ),
      ),
    );

    renderScreen();
    expect(await screen.findByText('Headline 1')).toBeOnTheScreen();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fireEvent(screen.getByTestId('news-list'), 'onEndReached');

    // FlatList virtualizes rows, so assert on the list data rather than on text.
    await waitFor(() =>
      expect(screen.getByTestId('news-list').props.data).toHaveLength(total),
    );
    expect(pageOf(fetchMock.mock.calls[1][0])).toBe(2);
    expect(screen.getByText("You're all caught up.")).toBeOnTheScreen();

    // No more pages: reaching the end again must not trigger another request.
    fireEvent(screen.getByTestId('news-list'), 'onEndReached');
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it('shows the API error and retries on demand', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ status: 'error', message: 'rateLimited' }, 429),
    );

    renderScreen();
    expect(await screen.findByText('Error: rateLimited')).toBeOnTheScreen();

    fetchMock.mockResolvedValueOnce(
      jsonResponse(makeResponse([makeArticle(1)], 1)),
    );
    fireEvent.press(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Headline 1')).toBeOnTheScreen();
  });
});
