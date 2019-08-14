module.exports = {
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  rules: {
    'no-var': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',

    // react plugin - options
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/jsx-key': 'warn',
    'react/jsx-no-undef': 'error',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:jsx-a11y/recommended', 'plugin:jest/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 8, // optional, recommended 6+
  },
}
