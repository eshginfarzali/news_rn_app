module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest/setup.js'],
  moduleNameMapper: {
    '^@env$': '<rootDir>/jest/env.mock.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native[^/]*|@react-native(-community)?|@react-navigation)/)',
  ],
  collectCoverageFrom: ['App.tsx', 'src/**/*.{ts,tsx}', '!src/types/**'],
};
