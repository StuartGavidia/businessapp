module.exports = {
  root: true,
  env: { browser: true, es2020: true, "cypress/globals": true, node: true },
  overrides: [
    {
      files: ['cypress/**/*.js', 'cypress/**/*.ts'],
      env: {
        "cypress/globals": true
      }
    },
  ],  
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:cypress/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'cypress', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
