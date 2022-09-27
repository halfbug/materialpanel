module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'no-use-before-define': 'off',
    'linebreak-style': 0,
    // 'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    // 'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'jsx-a11y/anchor-is-valid': 'warn',
    'react/prop-types': 'warn',
    'import/prefer-default-export': 'warn',
    'react/forbid-prop-types': 'warn',
    'react/jsx-props-no-spreading': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'eol-last': 'warn',
    'import/no-extraneous-dependencies': 'warn',
    'import/extensions': 'off',
    'react/no-unescaped-entities': 'warn',
    'no-unused-vars': 'warn',
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '/'],
      },
      typescript: {},
    },
  },
}
