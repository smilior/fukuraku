# Design System & Visual Design

## Design System Excellence

Create and maintain scalable design systems:
- Define design tokens (colors, spacing, typography)
- Create reusable component libraries
- Document patterns and usage guidelines
- Ensure consistency across all touchpoints
- Version control design assets
- Collaborate with developers on implementation
- Build in Figma with proper component structure

### Design System Checklist

- [ ] Design tokens defined (colors, spacing, typography)
- [ ] Component library inventoried
- [ ] Patterns documented with usage guidelines
- [ ] Figma components structured correctly
- [ ] Design system uses 4px or 8px spacing grid
- [ ] Color palette is limited and purposeful
- [ ] Typographic scale established (6-8 sizes maximum)
- [ ] Single source of truth maintained

---

## Responsive & Mobile-First Design

Design for all screen sizes:
- Start with mobile layouts, scale up to desktop
- Define breakpoints based on content, not devices
- Use fluid typography and spacing
- Design touch-friendly interfaces (44x44px minimum)
- Optimize for different orientations
- Consider context of use for different devices
- Test across multiple screen sizes

### Mobile-First Checklist

- [ ] Mobile-first CSS
- [ ] Fluid typography with clamp()
- [ ] Responsive images with srcset
- [ ] Touch-friendly on mobile
- [ ] Test on real devices, not just browser resize
- [ ] Consider touch vs. mouse interactions
- [ ] Optimize images for different screen densities
- [ ] Use responsive images (srcset, picture element)

---

## Visual Design Principles

Apply strong visual design:
- Establish clear visual hierarchy
- Use typography effectively (scale, weight, line height)
- Apply color purposefully with accessible palettes
- Create consistent spacing systems (4px or 8px grid)
- Use white space to improve readability
- Design for scannability with proper chunking
- Apply gestalt principles for grouping

### Typography Scale

```
H1: 32px / 2rem (Page title)
H2: 24px / 1.5rem (Section heading)
H3: 20px / 1.25rem (Subsection)
Body: 16px / 1rem (Base text)
Small: 14px / 0.875rem (Helper text)
```

### Visual Hierarchy Techniques

```
[Visual Weight]
1. Size (larger = more important)
2. Color (high contrast = emphasis)
3. Weight (bold = important)
4. Spacing (more space = separation)

[Z-Pattern for Scanning]
Logo ─────────────→ CTA
↓
Headline
↓
Content ─────────→ Image

[F-Pattern for Content]
Headline ──────────
Subhead ──────
Content
Content ───
Subhead ─────
Content

Principles:
- One clear primary action per screen
- Use size to indicate importance
- Maintain consistent spacing
- Create clear content sections
- Use color sparingly for emphasis
```

---

## TDD Workflow for UI Components

### Step 1: Write Failing Test First

```typescript
// tests/components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/ui/Button.vue'

describe('Button', () => {
  // Accessibility tests
  it('has accessible role and label', () => {
    const wrapper = mount(Button, {
      props: { label: 'Submit' }
    })
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.text()).toContain('Submit')
  })

  it('supports keyboard activation', async () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    })
    await wrapper.trigger('keydown.enter')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('has visible focus indicator', () => {
    const wrapper = mount(Button, {
      props: { label: 'Focus me' }
    })
    expect(wrapper.classes()).not.toContain('no-outline')
  })

  it('meets minimum touch target size', () => {
    const wrapper = mount(Button, {
      props: { label: 'Tap me' }
    })
    expect(wrapper.classes()).toContain('touch-target')
  })

  it('adapts to container width', () => {
    const wrapper = mount(Button, {
      props: { label: 'Responsive', fullWidth: true }
    })
    expect(wrapper.classes()).toContain('w-full')
  })

  it('shows loading state correctly', async () => {
    const wrapper = mount(Button, {
      props: { label: 'Submit', loading: true }
    })
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
```

### Step 2: Implement Minimum to Pass

```vue
<!-- components/ui/Button.vue -->
<template>
  <button
    :class="[
      'touch-target inline-flex items-center justify-center',
      'min-h-[44px] min-w-[44px] px-4 py-2',
      'rounded-md font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses,
      { 'w-full': fullWidth, 'opacity-50 cursor-not-allowed': disabled || loading }
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <span v-if="loading" class="animate-spin mr-2">
      <LoadingSpinner />
    </span>
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  click: [event: Event]
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
    case 'secondary':
      return 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500'
    case 'ghost':
      return 'bg-transparent hover:bg-gray-100 focus:ring-gray-500'
    default:
      return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
  }
})

function handleClick(event: Event) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
```

### Step 3: Refactor if Needed

After tests pass, refactor for:
- Better accessibility patterns
- Performance optimizations
- Design system alignment
- Code maintainability

### Step 4: Run Full Verification

```bash
# Run component tests
npm run test:unit -- --filter Button

# Run accessibility audit
npm run test:a11y

# Run visual regression tests
npm run test:visual

# Build and check for errors
npm run build

# Run Lighthouse audit
npm run lighthouse
```

---

## Modal Component Test Example

```typescript
// tests/components/Modal.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '@/components/ui/Modal.vue'

describe('Modal', () => {
  it('has correct ARIA attributes', () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true, title: 'Test Modal' }
    })
    expect(wrapper.attributes('role')).toBe('dialog')
    expect(wrapper.attributes('aria-modal')).toBe('true')
    expect(wrapper.attributes('aria-labelledby')).toBeDefined()
  })

  it('traps focus within modal', async () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true, title: 'Focus Trap' },
      attachTo: document.body
    })
    const focusableElements = wrapper.findAll('button, [tabindex="0"]')
    expect(focusableElements.length).toBeGreaterThan(0)
  })

  it('closes on Escape key', async () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true, title: 'Escape Test' }
    })
    await wrapper.trigger('keydown.escape')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('close button meets touch target size', () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true, title: 'Touch Target' }
    })
    const closeButton = wrapper.find('[aria-label="Close"]')
    expect(closeButton.classes()).toContain('touch-target')
  })
})
```

---

## Visual Design Checklist

### Forms & Input
- [ ] Single-column layouts for better completion rates
- [ ] Labels above fields, left-aligned for scannability
- [ ] Show password visibility toggle
- [ ] Validate inline, not just on submit
- [ ] Provide helpful error messages with recovery guidance
- [ ] Use appropriate input types (email, tel, date, etc.)
- [ ] Mark required fields clearly (* or "required" text)
- [ ] Group related fields with fieldsets

### Handoff to Development
- [ ] Detailed design specifications (spacing, colors, fonts)
- [ ] Consistent naming conventions used
- [ ] All interaction states included (hover, focus, active, disabled)
- [ ] Component behavior and variations documented
- [ ] Design tokens in developer-friendly format
- [ ] Accessibility annotations included
- [ ] Asset exports in correct formats and sizes

### Common Visual Mistakes to Avoid

**Inconsistent Patterns** ❌:
```
- Save button is blue on page 1
- Save button is green on page 2
- Save button position changes
```

**Consistent Design System** ✅:
```
Create design system with consistent:
- Component styles
- Button positions
- Interaction patterns
- Terminology
```

**Unclear Error Messages** ❌:
```
"Error: Invalid input"
Doesn't tell user what's wrong or how to fix it
```

**Clear, Actionable Messages** ✅:
```
"Password must be at least 8 characters and include a number"
Clear, actionable, helpful
```
