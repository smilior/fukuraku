# GitHub Actions CI/CD 設定

## 1. テスト用ワークフロー

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

jobs:
  # ユニットテスト + インテグレーションテスト
  unit-and-integration:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Run unit tests
        run: npm run test:run -- --coverage

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/

  # E2E テスト
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: unit-and-integration

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

      - name: Run E2E tests
        run: npx playwright test --project=chromium
        env:
          E2E_BASE_URL: http://localhost:3000
          E2E_TEST_EMAIL: ${{ secrets.E2E_TEST_EMAIL }}
          E2E_TEST_PASSWORD: ${{ secrets.E2E_TEST_PASSWORD }}

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # PR へのテスト結果コメント
  report:
    name: Test Report
    runs-on: ubuntu-latest
    needs: [unit-and-integration, e2e]
    if: always() && github.event_name == 'pull_request'

    steps:
      - name: Download coverage report
        uses: actions/download-artifact@v4
        with:
          name: coverage-report
          path: coverage/

      - name: Comment PR with coverage
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: test-coverage
          message: |
            ## テスト結果

            | テスト | ステータス |
            |--------|-----------|
            | Unit & Integration | ${{ needs.unit-and-integration.result == 'success' && 'Pass' || 'Fail' }} |
            | E2E | ${{ needs.e2e.result == 'success' && 'Pass' || 'Fail' }} |
```

---

## 2. PR マージ前の必須チェック設定

```markdown
## GitHub リポジトリ設定

Settings > Branches > Branch protection rules > main:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - [x] Unit & Integration Tests
  - [x] E2E Tests
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings
```
