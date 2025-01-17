module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/react',
  ],
  plugins: [
    'import',
    'react-hooks',
  ],
  rules: {
    'arrow-body-style': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'max-len': 'off',
    'new-cap': 'off',
    'no-else-return': 'warn',
    'no-nested-ternary': 'warn',
    'no-restricted-imports': ['error', {
      paths: [{
        name: 'react-bootstrap',
        message: 'Please use `components/graylog` instead.',
      }],
    }],
    'no-underscore-dangle': 'off',
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'object-shorthand': ['error', 'methods'],
    'react/forbid-prop-types': 'off',
    'react/jsx-closing-bracket-location': ['warn', 'after-props'],
    'react/jsx-first-prop-new-line': ['warn', 'never'],
    'react/jsx-indent-props': ['error', 'first'],
    'react/jsx-one-expression-per-line': 'off',
    'react/prefer-es6-class': 'off',
    'react/prefer-stateless-function': 'warn',
  },
};
