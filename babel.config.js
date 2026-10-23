module.exports = api => {
  // In Jest, `@env` is mapped to jest/env.mock.ts instead of being inlined from .env.
  const isTest = api.env('test');
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: isTest
      ? []
      : [['module:react-native-dotenv', { moduleName: '@env' }]],
  };
};
