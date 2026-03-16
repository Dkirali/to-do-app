module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@store': './src/store',
            '@theme': './src/theme',
            '@app-types': './src/types',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@config': './src/config',
            '@services': './src/services',
            '@database': './src/database',
            '@navigation': './src/navigation',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
