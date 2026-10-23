import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import NewsCard, { formatDate } from '../../src/components/NewsCard';
import { useFavoritesStore } from '../../src/store/useFavoritesStore';
import { makeArticle } from '../../jest/fixtures';

beforeEach(() => useFavoritesStore.setState({ favorites: [] }));

describe('NewsCard', () => {
  it('renders the article and toggles it as a favorite', () => {
    const article = makeArticle(1);
    render(<NewsCard article={article} />);

    expect(screen.getByText('Headline 1')).toBeOnTheScreen();
    expect(screen.getByText('Example News')).toBeOnTheScreen();

    fireEvent.press(screen.getByLabelText('Add to favorites'));
    expect(useFavoritesStore.getState().favorites).toEqual([article]);

    fireEvent.press(screen.getByLabelText('Remove from favorites'));
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });

  it('can favorite articles that have no image', () => {
    render(<NewsCard article={makeArticle(2, { urlToImage: null })} />);

    fireEvent.press(screen.getByLabelText('Add to favorites'));

    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
  });
});

describe('formatDate', () => {
  it('returns an empty string for invalid dates', () => {
    expect(formatDate('not a date')).toBe('');
  });
});
