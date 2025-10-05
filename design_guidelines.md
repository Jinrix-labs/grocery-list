# Smart Grocery Budgeter - Design Guidelines

## Design Approach
**System Selected**: Bootstrap 5 Framework (as specified)
**Justification**: Utility-focused budgeting application requiring fast, mobile-responsive deployment with established patterns for forms and data display.

---

## Core Design Elements

### A. Color Palette

**Primary Colors** (as specified):
- Primary Teal: `180 100% 25%` (#008080)
- White: `0 0% 100%` (#fff)
- Light Gray Background: `210 17% 98%` (#f8f9fa)

**Supporting Colors**:
- Success Green: `142 71% 45%` (for under-budget status)
- Warning Orange: `27 98% 54%` (for over-budget alerts)
- Dark Text: `210 11% 15%` (for primary content)
- Muted Text: `210 7% 56%` (for secondary information)
- Border Gray: `210 14% 89%` (for card and input borders)

**Dark Mode**: Not required for this utility application

---

### B. Typography

**Font Stack**: Bootstrap's native system font stack
- Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Type Scale**:
- App Header: 2rem (32px), bold, teal color
- Section Headings: 1.5rem (24px), semibold
- Card Titles: 1.25rem (20px), medium
- Body Text: 1rem (16px), regular
- Labels/Captions: 0.875rem (14px), medium
- Price Text: 1.125rem (18px), semibold (for emphasis)

---

### C. Layout System

**Spacing Primitives** (Bootstrap utilities):
- Primary spacing: 3 (1rem), 4 (1.5rem), 5 (3rem)
- Form elements: py-3, px-4
- Card padding: p-4 (desktop), p-3 (mobile)
- Section margins: my-5 (desktop), my-4 (mobile)

**Grid Structure**:
- Container: max-width 1140px (lg breakpoint)
- Single-column layout for primary flow
- Two-column for saved lists grid (col-md-6) on tablet+

**Responsive Breakpoints**:
- Mobile-first approach
- sm: 576px, md: 768px, lg: 992px

---

### D. Component Library

**Header**:
- Sticky navigation bar with teal background
- App name/logo on left, white text
- Height: 70px
- Subtle box-shadow for elevation

**Budget Input Form**:
- White card with rounded corners (border-radius: 8px)
- Vertical form layout with clear labels above inputs
- Input fields with light gray borders, focus state in teal
- Dropdown styled with Bootstrap's form-select
- Number inputs with increment/decrement controls
- Primary CTA button: teal background, white text, rounded, full-width on mobile
- Form spacing: 20px between field groups

**Grocery List Display Card**:
- White background with subtle shadow
- Header showing total cost (large, bold) and budget status badge
- Status badge: Green pill for "Under Budget", orange for "Over Budget"
- Itemized list with three columns: Item name | Quantity | Price
- Separator lines between items
- Swap suggestion displayed as alert box (light orange background) when over budget
- AI tip displayed as info callout (light teal background) at bottom

**Saved Lists Section**:
- Grid of compact cards (2 columns on tablet+)
- Each card shows: date saved, total cost, item count
- Hover state: subtle lift effect (translateY -2px, shadow increase)
- Expandable accordion to view full list details

**Buttons**:
- Primary (Generate List): Teal background, white text, rounded-lg, py-3
- Secondary (View Saved): White background, teal border and text, rounded-lg
- Small action buttons: py-2, px-3, medium text

**Data Display**:
- Tables for itemized lists: striped rows, hover states
- Price values: right-aligned, bold
- Quantities: centered alignment

**Error/Info Messages**:
- Toast notifications positioned top-right
- Error: red background, white text
- Info: blue background, white text
- Auto-dismiss after 5 seconds

---

### E. Animations

**Minimal Motion** (utility-focused):
- Form submission: Disable button, show spinner (0.5s fade-in)
- Card appearance: Subtle fade-in on load (0.3s ease-out)
- Hover states: Smooth shadow transitions (0.2s)
- No decorative animations

---

## Mobile Optimization

**Touch Targets**: Minimum 44px height for all interactive elements
**Form Inputs**: Full-width on mobile (< 768px), larger text (16px to prevent zoom)
**Cards**: Single column stack on mobile, 16px padding
**Buttons**: Full-width on mobile for primary actions
**Tables**: Horizontal scroll on mobile, compact font sizes

---

## Visual Hierarchy

**Priority Order**:
1. Budget input form (primary user action)
2. Generated grocery list results (immediate feedback)
3. AI savings tips (actionable insights)
4. Saved lists history (secondary reference)

**Emphasis Techniques**:
- Size variation for importance
- Color contrast (teal) for CTAs
- White space to separate sections
- Bold weights for prices and totals

---

## Accessibility

- WCAG AA contrast ratios minimum
- Label all form inputs clearly
- ARIA labels for icon buttons
- Keyboard navigation support
- Clear focus indicators (teal outline)
- Error messages linked to form fields

---

## Images

**No hero image required** - This is a utility application focused on functionality. The header should feature the app name with a simple shopping cart SVG icon (32px, teal color) positioned to the left of the text.

**Icon Usage**:
- Bootstrap Icons via CDN for UI elements (cart, save, info, warning)
- Shopping cart SVG favicon in teal
- Small icons (16px) next to dietary preference options