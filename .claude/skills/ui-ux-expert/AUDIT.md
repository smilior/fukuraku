# UI Audit & Pre-Implementation Checklist

## Pre-Implementation Checklist

### Phase 1: Before Writing Code

1. **User Research Complete**
   - [ ] Defined user personas with real data
   - [ ] Mapped user journeys and pain points
   - [ ] Identified key tasks and user goals
   - [ ] Conducted competitive analysis

2. **Design System Review**
   - [ ] Design tokens defined (colors, spacing, typography)
   - [ ] Component library inventoried
   - [ ] Patterns documented with usage guidelines
   - [ ] Figma components structured correctly

3. **Accessibility Planning**
   - [ ] WCAG 2.2 AA requirements identified
   - [ ] Keyboard navigation flow planned
   - [ ] ARIA patterns selected for complex widgets
   - [ ] Color contrast verified (4.5:1 text, 3:1 UI)

4. **Performance Budget Set**
   - [ ] LCP target: < 2.5s
   - [ ] FID target: < 100ms
   - [ ] CLS target: < 0.1
   - [ ] Bundle size limits defined

5. **Tests Written First (TDD)**
   - [ ] Accessibility tests for ARIA and keyboard
   - [ ] Responsive behavior tests
   - [ ] Interaction state tests
   - [ ] Visual regression baselines

### Phase 2: During Implementation

1. **Component Development**
   - [ ] Following TDD workflow (test first)
   - [ ] Using semantic HTML elements
   - [ ] Implementing touch targets (44x44px minimum)
   - [ ] Adding visible focus indicators
   - [ ] Including loading/error states

2. **Accessibility Implementation**
   - [ ] Labels associated with inputs
   - [ ] ARIA attributes correctly applied
   - [ ] Focus management for modals/dropdowns
   - [ ] Skip links for navigation

3. **Responsive Implementation**
   - [ ] Mobile-first CSS
   - [ ] Fluid typography with clamp()
   - [ ] Responsive images with srcset
   - [ ] Touch-friendly on mobile

4. **Performance Optimization**
   - [ ] Images lazy loaded below fold
   - [ ] Critical CSS inlined
   - [ ] Components code-split
   - [ ] Layout shifts prevented

### Phase 3: Before Committing

1. **Test Verification**
   ```bash
   # Run all tests
   npm run test:unit
   npm run test:a11y
   npm run test:visual
   npm run test:e2e
   ```

2. **Accessibility Audit**
   - [ ] axe DevTools shows no violations
   - [ ] Keyboard navigation tested (Tab, Enter, Escape)
   - [ ] Screen reader tested (VoiceOver/NVDA)
   - [ ] Color contrast verified

3. **Performance Audit**
   ```bash
   # Run Lighthouse
   npm run lighthouse

   # Check bundle size
   npm run build -- --report
   ```
   - [ ] Lighthouse accessibility: 100
   - [ ] Lighthouse performance: > 90
   - [ ] No layout shifts (CLS < 0.1)

4. **Cross-Browser Testing**
   - [ ] Chrome, Firefox, Safari, Edge
   - [ ] Mobile browsers (iOS Safari, Chrome Android)
   - [ ] Assistive technology compatibility

5. **Design Review**
   - [ ] Matches design specs
   - [ ] All states implemented (hover, focus, active, disabled)
   - [ ] Responsive breakpoints work correctly
   - [ ] Consistent with design system

6. **Documentation**
   - [ ] Component usage documented
   - [ ] Props and events described
   - [ ] Accessibility notes included
   - [ ] Examples provided

---

## Visual Regression Tests

```typescript
// tests/visual/button.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Button Visual Tests', () => {
  test('button states render correctly', async ({ page }) => {
    await page.goto('/storybook/button')

    // Default state
    await expect(page.locator('.btn-primary')).toHaveScreenshot('button-default.png')

    // Hover state
    await page.locator('.btn-primary').hover()
    await expect(page.locator('.btn-primary')).toHaveScreenshot('button-hover.png')

    // Focus state
    await page.locator('.btn-primary').focus()
    await expect(page.locator('.btn-primary')).toHaveScreenshot('button-focus.png')

    // Disabled state
    await expect(page.locator('.btn-primary[disabled]')).toHaveScreenshot('button-disabled.png')
  })

  test('button has sufficient contrast', async ({ page }) => {
    await page.goto('/storybook/button')

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
```

---

## Critical Reminders by Category

### Design Process
- Start with research, not assumptions - validate with real users
- Create user personas based on actual user data
- Map user journeys to identify pain points and opportunities
- Sketch multiple concepts before committing to high-fidelity
- Test early and often with real users
- Iterate based on feedback and analytics
- Document design decisions and rationale

### Accessibility
- WCAG 2.2 Level AA is the minimum standard
- Test with keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Use actual screen readers (NVDA, JAWS, VoiceOver)
- Color contrast: 4.5:1 for text, 3:1 for UI components
- Touch targets: 44x44px minimum for all interactive elements
- Provide text alternatives for all non-text content
- Use semantic HTML before reaching for ARIA
- Focus indicators must be clearly visible (3px minimum)

### Design Systems
- Define design tokens before creating components
- Use 4px or 8px spacing grid for consistency
- Create a limited, purposeful color palette
- Establish typographic scale (6-8 sizes maximum)
- Document component usage and variations
- Version control design assets in Figma
- Maintain a single source of truth
- Collaborate with developers on implementation

### Responsive Design
- Start mobile-first, scale up to desktop
- Use fluid typography (clamp, viewport units)
- Define breakpoints based on content, not devices
- Test on real devices, not just browser resize
- Consider touch vs. mouse interactions
- Optimize images for different screen densities
- Use responsive images (srcset, picture element)

### Visual Design
- Establish clear visual hierarchy (size, color, weight, spacing)
- Use white space generously - don't cram content
- Limit font families (2 maximum in most cases)
- Create consistent spacing (multiples of 4px or 8px)
- Use color purposefully, not decoratively
- Ensure sufficient contrast for readability
- Design for scannability with proper content chunking

### Forms & Input
- Use single-column layouts for better completion rates
- Labels above fields, left-aligned for scannability
- Show password visibility toggle
- Validate inline, not just on submit
- Provide helpful error messages with recovery guidance
- Use appropriate input types (email, tel, date, etc.)
- Mark required fields clearly (* or "required" text)
- Group related fields with fieldsets

### Interaction Design
- Provide immediate feedback for all user actions
- Use loading states and progress indicators
- Show clear success/error messages
- Allow undo for destructive actions
- Use confirmation dialogs for irreversible actions
- Make primary actions visually prominent
- Disable buttons during processing to prevent double-submission

### Performance
- Optimize images (WebP, compression, lazy loading)
- Use SVGs for icons and simple graphics
- Implement skeleton screens for perceived performance
- Minimize layout shifts (CLS)
- Ensure fast interactive time (TTI)
- Test on slow connections and devices
- Progressive enhancement over graceful degradation

### Testing & Validation
- Conduct usability testing with 5+ users per iteration
- Use heuristic evaluation (Nielsen's 10 heuristics)
- Test across browsers (Chrome, Firefox, Safari, Edge)
- Test with assistive technologies
- Validate HTML and check for ARIA errors
- Use automated accessibility tools (axe, WAVE, Lighthouse)
- Monitor analytics for drop-off points and pain areas

### Handoff to Development
- Provide detailed design specifications (spacing, colors, fonts)
- Use consistent naming conventions
- Include all interaction states (hover, focus, active, disabled)
- Document component behavior and variations
- Share design tokens in developer-friendly format
- Include accessibility annotations
- Provide asset exports in correct formats and sizes
- Be available for questions during implementation

---

## Summary: Design Excellence Pillars

**User-Centered Design**:
- Research-driven decision making
- Validated through usability testing
- Iterative based on user feedback
- Focused on solving real user problems

**Accessibility Excellence**:
- WCAG 2.2 Level AA compliance minimum
- Keyboard navigation support
- Screen reader compatibility
- Inclusive design for all users

**Design System Thinking**:
- Consistent, reusable components
- Design tokens for scalability
- Documentation and governance
- Collaboration with development teams

**Responsive & Mobile-First**:
- Adaptive across all devices
- Touch-friendly interactions
- Performance-optimized
- Context-aware design

**Quality Assurance**:
- Rigorous testing across devices and browsers
- Accessibility validation with assistive tech
- Usability testing with real users
- Continuous iteration and improvement

Remember: Great design is invisible. It works so well that users don't have to think about it. Always design with empathy, test with real users, and iterate relentlessly toward better experiences.
