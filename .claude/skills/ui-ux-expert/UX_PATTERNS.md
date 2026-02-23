# UX Patterns & Performance

## Top 7 UX Patterns

### Pattern 1: Progressive Disclosure

Reveal information progressively to reduce cognitive load.

**When to Use**:
- Complex forms with many fields
- Advanced settings or options
- Multi-step processes
- Feature-rich dashboards

**Implementation**:
```
[Step Indicator]
Step 1 of 3: Basic Info

[Form Fields - Only Essential]
Name: [_______]
Email: [_______]

[Collapsible Section]
> Advanced Options (Optional)
  [Hidden by default, expands on click]

[Primary Action]
[Continue →]

Design Principles:
- Show only essential info by default
- Use "Show more" links for optional content
- Indicate progress in multi-step flows
- Allow users to expand sections as needed
```

**Accessibility**: Ensure expanded/collapsed state is announced to screen readers using `aria-expanded`.

---

### Pattern 2: Clear Error Prevention & Recovery

Design to prevent errors and help users recover gracefully.

**Implementation**:
```
[Input Field with Validation]
Email Address
[user@example] ⚠️
└─ "Please include '@' in the email address"
   (Inline, real-time validation)

[Confirmation Dialog]
┌─────────────────────────────┐
│ Delete Account?             │
│                             │
│ This action cannot be       │
│ undone. All your data will  │
│ be permanently deleted.     │
│                             │
│ Type "DELETE" to confirm:   │
│ [_______]                   │
│                             │
│ [Cancel] [Delete Account]  │
└─────────────────────────────┘

Best Practices:
- Validate inline, not just on submit
- Use clear, helpful error messages
- Highlight error fields with color + icon
- Place errors near the relevant field
- Provide suggested fixes when possible
- Use confirmation dialogs for destructive actions
```

**Accessibility**: Use `aria-invalid` and `aria-describedby` to link errors to fields.

---

### Pattern 3: Logical Information Architecture

Organize content in a way that matches user mental models.

**Card Sorting Approach**:
1. Conduct open card sorts with users
2. Identify common groupings
3. Create clear navigation hierarchy
4. Use familiar categorization

**Navigation Patterns**:
```
[Primary Navigation]
Top-level (5-7 items max)
├─ Dashboard
├─ Projects
├─ Team
├─ Settings
└─ Help

[Breadcrumbs]
Home > Projects > Website Redesign > Design Files

[Sidebar Navigation]
Settings
├─ Profile
├─ Security
├─ Notifications
├─ Billing
└─ Integrations

Principles:
- Limit top-level nav to 7±2 items
- Group related items logically
- Use familiar labels
- Provide multiple navigation paths
- Show current location clearly
```

---

### Pattern 4: Effective Form Design

Design forms that are easy to complete with minimal errors.

**Best Practices**:
```
[Single Column Layout]
Full Name *
[________________________]

Email Address *
[________________________]
Helper text: We'll never share your email

Password *
[________________________] [👁️ Show]
At least 8 characters, including a number

[Label Above Input - Scannable]

[Visual Field Grouping]
Shipping Address
┌─────────────────────────┐
│ Street [____________]   │
│ City   [____________]   │
│ State  [▼ Select]       │
│ ZIP    [_____]          │
└─────────────────────────┘

Design Rules:
- One column layout for better scanning
- Labels above inputs, left-aligned
- Mark required fields clearly
- Use appropriate input types
- Show password visibility toggle
- Group related fields visually
- Use smart defaults when possible
- Provide inline validation
- Make CTAs action-oriented
```

**Accessibility**: Associate labels with inputs using `for`/`id`, mark required fields semantically.

---

### Pattern 5: Responsive Touch Targets

Design for both mouse and touch input.

**Touch Target Sizing**:
```
[Mobile Touch Targets - 44x44px minimum]

❌ Too Small:
[Submit] (30x30px - hard to tap)

✅ Proper Size:
[    Submit    ] (48x48px - easy to tap)

[Button Spacing]
Minimum 8px between interactive elements

Guidelines:
- 44x44px minimum (WCAG 2.2)
- 48x48px recommended
- 8px minimum spacing between targets
- Larger targets for primary actions
- Consider thumb zones on mobile
- Test on actual devices
```

---

### Pattern 6: Loading States & Feedback

Provide clear feedback for all user actions.

**Loading Patterns**:
```
[Skeleton Screens - Better than spinners]
┌─────────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░      │ (Title loading)
│ ░░░░░░░░░░░░░░░░        │ (Description)
│ ▓▓▓▓░░░░ ▓▓▓▓░░░░      │ (Cards loading)
└─────────────────────────┘

[Progress Indicators]
Uploading file... 47%
[████████░░░░░░░░░░]

[Optimistic UI]
User clicks "Like" →
1. Show liked state immediately
2. Send request in background
3. Revert if request fails

[Toast Notifications]
┌─────────────────────────┐
│ ✓ Settings saved        │
└─────────────────────────┘
(Auto-dismiss after 3-5s)

Feedback Types:
- Immediate: Button states, toggles
- Short (< 3s): Spinners, animations
- Long (> 3s): Progress bars with %
- Completion: Success messages, toasts
```

**Accessibility**: Announce loading states to screen readers using `aria-live` regions.

---

### Pattern 7: Consistent Visual Hierarchy

Guide users' attention through clear hierarchy.

**Hierarchy Techniques**:
```
[Typography Scale]
H1: 32px / 2rem (Page title)
H2: 24px / 1.5rem (Section heading)
H3: 20px / 1.25rem (Subsection)
Body: 16px / 1rem (Base text)
Small: 14px / 0.875rem (Helper text)

[Visual Weight]
1. Size (larger = more important)
2. Color (high contrast = emphasis)
3. Weight (bold = important)
4. Spacing (more space = separation)

Principles:
- One clear primary action per screen
- Use size to indicate importance
- Maintain consistent spacing
- Create clear content sections
- Use color sparingly for emphasis
```

---

## Performance Patterns

### Pattern 1: Lazy Loading

**Bad** - Load all images immediately:
```html
<img src="/hero-large.jpg" alt="Hero image" />
<img src="/product-1.jpg" alt="Product" />
```

**Good** - Lazy load below-fold images:
```html
<!-- Critical above-fold image - load immediately -->
<img src="/hero-large.jpg" alt="Hero image" fetchpriority="high" />

<!-- Below-fold images - lazy load -->
<img src="/product-1.jpg" alt="Product" loading="lazy" decoding="async" />
```

```vue
<!-- Vue component with intersection observer -->
<template>
  <img v-if="isVisible" :src="src" :alt="alt" @load="onLoad" />
  <div v-else ref="placeholder" class="skeleton" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps(['src', 'alt'])
const placeholder = ref(null)
const isVisible = ref(false)

onMounted(() => {
  const { stop } = useIntersectionObserver(
    placeholder,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true
        stop()
      }
    },
    { rootMargin: '100px' }
  )
})
</script>
```

### Pattern 2: Image Optimization

**Good** - Responsive images with modern formats:
```html
<picture>
  <source
    type="image/avif"
    srcset="/photo-400.avif 400w, /photo-800.avif 800w, /photo-1200.avif 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
  />
  <source
    type="image/webp"
    srcset="/photo-400.webp 400w, /photo-800.webp 800w, /photo-1200.webp 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
  />
  <img
    src="/photo-800.jpg"
    alt="Photo description"
    loading="lazy"
    decoding="async"
    width="800"
    height="600"
  />
</picture>
```

### Pattern 3: Critical CSS

**Good** - Inline critical CSS, defer non-critical:
```html
<head>
  <style>
    /* Above-fold styles only */
    .hero { ... }
    .nav { ... }
    .cta-button { ... }
  </style>
  <link
    rel="preload"
    href="/styles.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
  <noscript><link rel="stylesheet" href="/styles.css" /></noscript>
</head>
```

### Pattern 4: Skeleton Screens

**Good** - Show skeleton that matches final layout:
```vue
<template>
  <article class="card">
    <template v-if="loading">
      <div class="skeleton-image animate-pulse bg-gray-200 h-48 rounded-t" />
      <div class="p-4 space-y-3">
        <div class="skeleton-title h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div class="skeleton-text h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div class="skeleton-text h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    </template>
    <template v-else>
      <img :src="image" :alt="title" class="h-48 object-cover rounded-t" />
      <div class="p-4">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <p class="text-gray-600">{{ description }}</p>
      </div>
    </template>
  </article>
</template>
```

### Pattern 5: Code Splitting

**Good** - Lazy load routes and heavy components:
```typescript
// router/index.ts
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/analytics',
    component: () => import(/* webpackPrefetch: true */ '@/views/Analytics.vue')
  }
]

// Lazy load heavy components
const HeavyChart = defineAsyncComponent({
  loader: () => import('@/components/HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  delay: 200,
  timeout: 10000
})
```

### Pattern 6: Minimize Layout Shifts (CLS)

**Good** - Reserve space to prevent shift:
```html
<!-- Always specify dimensions -->
<img
  src="/photo.jpg"
  alt="Photo"
  width="800"
  height="600"
  class="aspect-[4/3] object-cover"
/>

<!-- Use aspect-ratio for responsive images -->
<div class="aspect-video">
  <img src="/video-thumb.jpg" alt="Video" class="w-full h-full object-cover" />
</div>

<!-- Reserve space for dynamic content -->
<div class="min-h-[200px]">
  <AsyncContent />
</div>
```

---

## Performance Tests

```typescript
// tests/performance/core-web-vitals.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Core Web Vitals', () => {
  test('LCP is under 2.5 seconds', async ({ page }) => {
    await page.goto('/')

    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          resolve(entries[entries.length - 1].startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })

    expect(lcp).toBeLessThan(2500)
  })

  test('CLS is under 0.1', async ({ page }) => {
    await page.goto('/')

    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          resolve(clsValue)
        }).observe({ entryTypes: ['layout-shift'] })

        setTimeout(() => resolve(clsValue), 5000)
      })
    })

    expect(cls).toBeLessThan(0.1)
  })
})
```

---

## Performance Checklist

- [ ] Images lazy loaded below fold
- [ ] Critical CSS inlined
- [ ] Components code-split
- [ ] Layout shifts prevented (CLS < 0.1)
- [ ] LCP target: < 2.5s
- [ ] FID target: < 100ms
- [ ] Bundle size limits defined
- [ ] Lighthouse performance: > 90

### UX Best Practices Reminders

- No Loading or Error States: `[Submit] → [Submitting...] → [✓ Saved]`
- No Complex Navigation: Limit top-level nav to 5-7 items
- Allow undo for destructive actions
- Use confirmation dialogs for irreversible actions
- Disable buttons during processing to prevent double-submission
- Provide immediate feedback for all user actions
