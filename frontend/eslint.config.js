// @ts-check
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: ['projects/**/*'],
  },
  ...compat
    .config({
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            prefix: 'perfect',
            style: 'kebab-case',
            type: 'element',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            prefix: 'perfect',
            style: 'camelCase',
            type: 'attribute',
          },
        ],
        // This project uses NgModules and constructor injection throughout;
        // these newer recommended rules push toward standalone components
        // and inject(), which isn't a migration in scope here.
        '@angular-eslint/prefer-standalone': 'off',
        '@angular-eslint/prefer-inject': 'off',
      },
    })
    .map((config) => ({ ...config, files: ['**/*.ts'] })),
  ...compat
    .config({
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    })
    .map((config) => ({ ...config, files: ['**/*.html'] })),
];
