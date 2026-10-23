import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';
import { queryClient } from '../src/lib/queryClient';
import { jsonResponse, makeArticle, makeResponse } from '../jest/fixtures';

global.fetch = jest.fn(() =>
  Promise.resolve(jsonResponse(makeResponse([makeArticle(1)], 1))),
);

// Drop cached queries so their garbage-collection timers don't outlive the test.
afterAll(() => queryClient.clear());

test('renders the home tab with headlines', async () => {
  render(<App />);

  expect(await screen.findByText('Headline 1')).toBeOnTheScreen();
  expect(screen.getByText('Favorites')).toBeOnTheScreen();
});
