## Test Organization

### Custom Fixtures

```typescript
// fixtures/todos.ts
import { test as base } from '@playwright/test';

type TodoFixtures = {
  todoPage: TodoPage;
  createTodo: (title: string) => Promise<void>;
};

export const test = base.extend<TodoFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },

  createTodo: async ({ page }, use) => {
    const create = async (title: string) => {
      await page.fill('.new-todo', title);
      await page.press('.new-todo', 'Enter');
    };
    await use(create);
  },
});

// tests/todos.spec.ts
import { test } from '../fixtures/todos';

test('can create new todo', async ({ todoPage, createTodo }) => {
  await createTodo('Buy groceries');
  await expect(todoPage.todoItems).toHaveCount(1);
  await expect(todoPage.todoItems).toHaveText('Buy groceries');
});
```

### Test Tags and Filtering

```typescript
test('smoke test', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Home');
});

test('regression test', { tag: ['@regression', '@critical'] }, async ({ page }) => {
  // Complex test
});

// Run: npx playwright test --grep @smoke
// Run: npx playwright test --grep-invert @slow
```

## Visual Testing

### Screenshot Comparison

```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/dashboard');

  // Full page screenshot
  await expect(page).toHaveScreenshot('dashboard.png', {
    maxDiffPixels: 100,
  });

  // Element screenshot
  await expect(page.locator('.widget')).toHaveScreenshot('widget.png');

  // Full page with scroll
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
  });

  // Mask dynamic elements
  await expect(page).toHaveScreenshot('masked.png', {
    mask: [page.locator('.timestamp'), page.locator('.avatar')],
  });

  // Custom threshold
  await expect(page).toHaveScreenshot('comparison.png', {
    maxDiffPixelRatio: 0.05, // 5% difference allowed
  });
});
```

### Video and Trace

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});

// Programmatic video
test('record video', async ({ page }) => {
  await page.goto('/');
  // Test actions...

  // Video saved automatically to test-results/
});

// View trace: npx playwright show-trace trace.zip
```

## Parallel Execution

### Test Sharding

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
});

// Run shards in CI
// npx playwright test --shard=1/4
// npx playwright test --shard=2/4
// npx playwright test --shard=3/4
// npx playwright test --shard=4/4
```

### Serial Tests

```typescript
test.describe.configure({ mode: 'serial' });

test.describe('order matters', () => {
  let orderId: string;

  test('create order', async ({ page }) => {
    // Create order
    orderId = await createOrder(page);
  });

  test('verify order', async ({ page }) => {
    // Use orderId from previous test
    await verifyOrder(page, orderId);
  });
});
```

## Debugging

### UI Mode

```bash
# Interactive debugging
npx playwright test --ui

# Debug specific test
npx playwright test --debug login.spec.ts

# Step through test
npx playwright test --headed --slow-mo=1000
```

### Trace Viewer

```typescript
// Generate trace
test('with trace', async ({ page }) => {
  await page.context().tracing.start({ screenshots: true, snapshots: true });

  // Test actions
  await page.goto('/');

  await page.context().tracing.stop({ path: 'trace.zip' });
});

// View: npx playwright show-trace trace.zip
```

### Console Logs

```typescript
test('capture console', async ({ page }) => {
  page.on('console', msg => console.log(`Browser: ${msg.text()}`));
  page.on('pageerror', error => console.error(`Error: ${error.message}`));

  await page.goto('/');
});
```

## Best Practices

### 1. Use Stable Locators
```typescript
// Good - Role-based, stable
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('test@example.com');

// Bad - Fragile, implementation-dependent
await page.click('button.btn-primary.submit-btn');
await page.fill('div > form > input:nth-child(3)');
```

### 2. Leverage Auto-Waiting
```typescript
// Good - Auto-waits
await page.click('button');
await expect(page.locator('.result')).toBeVisible();

// Bad - Manual waits
await page.waitForTimeout(2000);
await page.click('button');
```

### 3. Use Page Object Model
```typescript
// Good - Reusable, maintainable
const loginPage = new LoginPage(page);
await loginPage.login('user', 'pass');

// Bad - Duplicated selectors
await page.fill('[name="username"]', 'user');
await page.fill('[name="password"]', 'pass');
```

### 4. Parallel-Safe Tests
```typescript
// Good - Isolated
test('user signup', async ({ page }) => {
  const uniqueEmail = `user-${Date.now()}@test.com`;
  await signUp(page, uniqueEmail);
});

// Bad - Shared state
test('user signup', async ({ page }) => {
  await signUp(page, 'test@test.com'); // Conflicts in parallel
});
```

### 5. Handle Flakiness
```typescript
// Good - Wait for network idle
await page.goto('/', { waitUntil: 'networkidle' });
await expect(page.locator('.data')).toBeVisible();

// Configure retries
test.describe(() => {
  test.use({ retries: 2 });

  test('flaky test', async ({ page }) => {
    // Test with auto-retry
  });
});
```

## Common Patterns

### Multi-Page Scenarios

```typescript
test('popup handling', async ({ page, context }) => {
  // Listen for new page
  const popupPromise = context.waitForEvent('page');
  await page.click('a[target="_blank"]');
  const popup = await popupPromise;

  await popup.waitForLoadState();
  await expect(popup).toHaveTitle('New Window');
  await popup.close();
});
```

### Conditional Logic

```typescript
test('handle optional elements', async ({ page }) => {
  await page.goto('/');

  // Close modal if present
  const modal = page.locator('.modal');
  if (await modal.isVisible()) {
    await page.click('.modal .close-button');
  }

  // Or use count
  const cookieBanner = page.locator('.cookie-banner');
  if ((await cookieBanner.count()) > 0) {
    await page.click('.accept-cookies');
  }
});
```

### Data-Driven Tests

```typescript
const testCases = [
  { input: 'hello', expected: 'HELLO' },
  { input: 'World', expected: 'WORLD' },
  { input: '123', expected: '123' },
];

for (const { input, expected } of testCases) {
  test(`transforms "${input}" to "${expected}"`, async ({ page }) => {
    await page.goto('/transform');
    await page.fill('input', input);
    await page.click('button');
    await expect(page.locator('.result')).toHaveText(expected);
  });
}
```
