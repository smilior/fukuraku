# Accessibility Standards (WCAG 2.2)

## Core WCAG 2.2 Principles (POUR)

**Perceivable**: Information must be presentable to users in ways they can perceive.
- Provide text alternatives for non-text content
- Provide captions and transcripts for media
- Make content adaptable to different presentations
- Ensure sufficient color contrast (4.5:1 for text, 3:1 for large text)

**Operable**: User interface components must be operable.
- Make all functionality keyboard accessible
- Give users enough time to read and use content
- Don't design content that causes seizures
- Provide ways to help users navigate and find content
- Make target sizes at least 44x44px (WCAG 2.2)

**Understandable**: Information and operation must be understandable.
- Make text readable and understandable
- Make content appear and operate in predictable ways
- Help users avoid and correct mistakes
- Provide clear error messages and recovery paths

**Robust**: Content must be robust enough for assistive technologies.
- Maximize compatibility with current and future tools
- Use valid, semantic HTML
- Implement ARIA correctly (don't over-use)

---

## Critical Accessibility Requirements

### Color Contrast (WCAG 2.2 Level AA)

```
Text Contrast:
- Normal text (< 24px): 4.5:1 minimum
- Large text (≥ 24px): 3:1 minimum
- UI components: 3:1 minimum

Examples:
✅ #000000 on #FFFFFF (21:1) - Excellent
✅ #595959 on #FFFFFF (7:1) - Good
✅ #767676 on #FFFFFF (4.6:1) - Passes AA
❌ #959595 on #FFFFFF (3.9:1) - Fails AA

Tools:
- WebAIM Contrast Checker
- Stark plugin for Figma
- Chrome DevTools Accessibility Panel
```

### Keyboard Navigation

- All interactive elements must be reachable via Tab
- Logical tab order following visual order
- Visible focus indicators (3px outline minimum)
- Skip links to bypass repetitive content
- No keyboard traps
- Support Escape to close modals/menus

### Screen Reader Support

```html
<!-- Semantic HTML -->
<nav>, <main>, <article>, <aside>, <header>, <footer>

<!-- ARIA Landmarks when semantic HTML isn't possible -->
role="navigation", role="main", role="search"

<!-- ARIA Labels -->
<button aria-label="Close dialog">×</button>

<!-- ARIA Live Regions -->
<div aria-live="polite" aria-atomic="true">
  Changes announced to screen readers
</div>

<!-- ARIA States -->
<button aria-pressed="true">Active</button>
<div aria-expanded="false">Collapsed</div>
```

### Form Accessibility

```html
<!-- Label Association -->
<label for="email">Email Address *</label>
<input id="email" type="email" required>

<!-- Error Handling -->
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>

<!-- Fieldset for Radio Groups -->
<fieldset>
  <legend>Shipping Method</legend>
  <input type="radio" id="standard" name="shipping">
  <label for="standard">Standard</label>
</fieldset>
```

---

## WCAG 2.2 New Success Criteria

**2.4.11 Focus Not Obscured (Minimum)** - Level AA:
- Focused elements must not be completely hidden by other content
- At least part of the focus indicator must be visible

**2.4.12 Focus Not Obscured (Enhanced)** - Level AAA:
- The entire focused element should be visible

**2.4.13 Focus Appearance** - Level AAA:
- Focus indicators must have sufficient size and contrast
- Minimum 2px perimeter or equivalent area

**2.5.7 Dragging Movements** - Level AA:
- Provide alternatives to dragging interactions
- Example: Drag-to-reorder should also allow keyboard-based reordering

**2.5.8 Target Size (Minimum)** - Level AA:
- Interactive targets must be at least 24x24 CSS pixels
- Exception: If there's adequate spacing (24px) between targets

**3.2.6 Consistent Help** - Level A:
- Help mechanisms should appear in the same relative order across pages

**3.3.7 Redundant Entry** - Level A:
- Don't ask for the same information twice in a session
- Auto-fill or allow copy from previous entry

**3.3.8 Accessible Authentication (Minimum)** - Level AA:
- Don't require cognitive function tests for authentication
- Provide alternatives to CAPTCHAs and memory tests

**3.3.9 Accessible Authentication (Enhanced)** - Level AAA:
- No cognitive function tests required at all

---

## Accessibility Checklist (Before Commit)

- [ ] axe DevTools shows no violations
- [ ] Keyboard navigation tested (Tab, Enter, Escape)
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] Color contrast verified (4.5:1 text, 3:1 UI)
- [ ] Lighthouse accessibility: 100
- [ ] Labels associated with all inputs
- [ ] ARIA attributes correctly applied
- [ ] Focus management for modals/dropdowns
- [ ] Skip links for navigation
- [ ] Touch targets: 44x44px minimum

---

## Common Accessibility Mistakes

### 1. Insufficient Color Contrast

❌ **Mistake**:
```
Light gray text on white background
#CCCCCC on #FFFFFF (1.6:1 contrast)
Fails WCAG AA - unreadable for many users
```

✅ **Solution**:
```
Use sufficient contrast ratios:
- Body text: #333333 on #FFFFFF (12.6:1)
- Secondary text: #666666 on #FFFFFF (5.7:1)
- Always test with contrast checker tools
```

### 2. Color as Only Visual Indicator

❌ **Mistake**:
```
Error shown only by red border
[_________] (red border)
No icon, no text - fails for colorblind users
```

✅ **Solution**:
```
Use multiple indicators:
⚠️ [_________]
└─ "Email address is required"

Combine: Color + Icon + Text
```

### 3. Tiny Touch Targets on Mobile

❌ **Mistake**:
```
[×] Close button: 20x20px
Too small for reliable tapping
```

✅ **Solution**:
```
[    ×    ] Minimum 44x44px tap area
Even if icon is smaller, padding increases hit area
```

### 4. Non-Semantic HTML

❌ **Mistake**:
```html
<div onclick="submit()">Submit</div>
Not keyboard accessible, no semantic meaning
```

✅ **Solution**:
```html
<button type="submit">Submit</button>
Semantic, keyboard accessible by default
```

### 5. Missing Form Labels

❌ **Mistake**:
```html
<input type="text" placeholder="Enter email">
Screen readers can't identify the field
```

✅ **Solution**:
```html
<label for="email">Email Address</label>
<input id="email" type="email" placeholder="user@example.com">
```

### 6. Auto-Playing Media

❌ **Mistake**:
```
Video with sound auto-plays on page load
Disorienting for screen reader users
```

✅ **Solution**:
```
- Never auto-play with sound
- Provide play/pause controls
- Show captions by default
- Allow users to control media
```

---

## Accessibility Testing with Playwright

```typescript
// tests/a11y/pages.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Audits', () => {
  test('home page passes accessibility audit', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze()

    expect(results.violations).toHaveLength(0)
  })

  test('form page has accessible inputs', async ({ page }) => {
    await page.goto('/contact')

    const results = await new AxeBuilder({ page })
      .include('form')
      .analyze()

    expect(results.violations).toHaveLength(0)
  })

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Tab through navigation
    await page.keyboard.press('Tab')
    const firstNavItem = page.locator('nav a:first-child')
    await expect(firstNavItem).toBeFocused()

    // Can activate with Enter
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/.*about/)
  })
})
```
