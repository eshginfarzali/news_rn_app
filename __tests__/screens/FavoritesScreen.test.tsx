import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import FavoritesScreen from '../../src/screens/FavoritesScreen';
import { useFavoritesStore } from '../../src/store/useFavoritesStore';
import { makeArticle } from '../../jest/fixtures';

beforeEach(() => useFavoritesStore.setState({ favorites: [] }));

describe('FavoritesScreen', () => {
  it('shows an empty state when there are no favorites', () => {
    render(<FavoritesScreen />);

    expect(screen.getByText('Favorites (0)')).toBeOnTheScreen();
    expect(screen.getByText('No Favorite Articles')).toBeOnTheScreen();
  });

  it('clears all favorites after confirmation', () => {
    useFavoritesStore.setState({
      favorites: [makeArticle(1), makeArticle(2)],
    });
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((_title, _message, buttons) => {
        buttons?.find(b => b.style === 'destructive')?.onPress?.();
      });

    render(<FavoritesScreen />);
    expect(screen.getByText('Favorites (2)')).toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Clear All' }));

    expect(alertSpy).toHaveBeenCalled();
    expect(screen.getByText('No Favorite Articles')).toBeOnTheScreen();
  });
});
