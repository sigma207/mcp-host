import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  pluginJs.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    files: [
      'src/**/*.{js,mjs,cjs,ts}',
      'eslint.config.mjs',
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/quotes': [
        'error',
        'single',
      ],
      '@stylistic/indent': [
        'error',
        2,
      ],
      '@stylistic/comma-dangle': [
        'error',
        'always-multiline',
      ],
      '@stylistic/semi': [
        'error',
        'never',
      ],
      '@stylistic/array-bracket-newline': [
        'error',
        { minItems: 2 },
      ],
      '@stylistic/array-element-newline': [
        'error',
        { minItems: 2 },
      ],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          singleline: { delimiter: 'comma' },
        },
      ],
      '@stylistic/object-property-newline': 'error',
      '@stylistic/object-curly-newline': [
        'error',
        {
          ImportDeclaration: 'always',
          ObjectPattern: {
            multiline: true,
            consistent: true,
          },
          ObjectExpression: {
            multiline: true,
            consistent: true,
          },
        },
      ],
      '@stylistic/arrow-parens': [
        'error',
        'as-needed',
      ],
      '@stylistic/brace-style': [
        'error',
        '1tbs',
      ],
      'no-param-reassign': [
        'error',
        { props: true },
      ],
      'arrow-body-style': [
        'error',
        'as-needed',
      ],
      'no-unneeded-ternary': 'error',
      'no-nested-ternary': 'error',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint-config-myconfig.mjs',
            'eslint.config.mjs',
          ],
          defaultProject: 'tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  }
)