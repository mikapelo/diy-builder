const js = require('@eslint/js');
const nextEslintConfig = require('eslint-config-next');

module.exports = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'playwright-report/**',
      '.coverage/**',
      'dist/**',
      'build/**'
    ]
  },
  ...nextEslintConfig
];
