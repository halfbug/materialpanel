module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'next/core-web-vitals',
    'prettier',
    'airbnb'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: "tsconfig.json"
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'no-use-before-define': 'off',
    'linebreak-style': 0,
    'react/react-in-jsx-scope' : 'off',
    'react/function-component-definition' : 'off',
    "react/require-default-props":'off',
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
    "@typescript-eslint/strict-boolean-expressions": "off",
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/no-unused-prop-types': 'warn',
    'radix': 'warn',
    '@typescript-eslint/no-floating-promises' : 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    // '@typescript-eslint/no-unused-vars': 'warn',
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
