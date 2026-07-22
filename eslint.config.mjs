import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Legacy antd components scheduled for replacement by the shadcn/ui
    // rewrite; drop this override once they are rewritten.
    files: [
      'src/components/LoanForm.tsx',
      'src/components/BudgetForm.tsx',
      'src/table/EditButton.tsx',
      'src/routes/CarPage.tsx',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
)
