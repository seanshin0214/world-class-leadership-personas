# Design Systems & Figma 2025

**Updated**: 2025-11-23 | **Focus**: Design Systems, Accessibility, Figma

---

## Design System Foundation

### Component Library Structure

```
Design System
├── Foundations
│   ├── Colors (primitives + semantic)
│   ├── Typography (scales, weights)
│   ├── Spacing (4px, 8px, 16px, 24px, 32px)
│   ├── Icons (consistent style)
│   └── Elevation (shadows, z-index)
│
├── Components
│   ├── Button (variants: primary, secondary, ghost)
│   ├── Input (text, email, password, search)
│   ├── Card (basic, elevated, interactive)
│   ├── Modal (dialog, alert, confirmation)
│   └── Navigation (navbar, sidebar, tabs)
│
└── Patterns
    ├── Forms (layouts, validation)
    ├── Data Display (tables, cards, lists)
    └── Feedback (toasts, alerts, loaders)
```

---

## Color System

### Primitive Colors

```css
/* Gray scale */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-500: #6b7280;
--gray-900: #111827;

/* Brand colors */
--blue-500: #3b82f6;
--blue-600: #2563eb;
--blue-700: #1d4ed8;
```

### Semantic Tokens

```css
/* Light mode */
--color-background: var(--gray-50);
--color-text-primary: var(--gray-900);
--color-text-secondary: var(--gray-500);
--color-primary: var(--blue-600);

/* Dark mode */
@media (prefers-color-scheme: dark) {
  --color-background: var(--gray-900);
  --color-text-primary: var(--gray-50);
  --color-text-secondary: var(--gray-400);
  --color-primary: var(--blue-500);
}
```

---

## Typography Scale

```css
/* Font sizes (1.250 ratio - Major Third) */
--text-xs: 0.64rem;   /* 10.24px */
--text-sm: 0.8rem;    /* 12.8px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.25rem;   /* 20px */
--text-xl: 1.563rem;  /* 25px */
--text-2xl: 1.953rem; /* 31.25px */
--text-3xl: 2.441rem; /* 39.06px */

/* Line heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Figma Variables (2025)

### Setup

```
Variables Panel
├── Colors
│   ├── Primitives (raw values)
│   └── Semantic (references primitives)
├── Typography
│   ├── Font Size
│   ├── Line Height
│   └── Font Weight
└── Spacing
    └── Base Unit: 4px
```

### Auto Layout 4.0

```
Component: Button
├── Auto layout: Horizontal
├── Padding: 12px 24px (var(--spacing-3) var(--spacing-6))
├── Gap: 8px (var(--spacing-2))
├── Border radius: 8px
└── Constraints: Hug contents
```

---

## Accessibility (WCAG 2.2 AA)

### Color Contrast

```markdown
MINIMUM RATIOS:
- Normal text (< 18pt): 4.5:1
- Large text (≥ 18pt): 3:1
- UI components: 3:1

CHECK:
✓ #111827 on #ffffff = 16.87:1 (Pass)
✗ #6b7280 on #ffffff = 4.54:1 (Marginal)
✗ #9ca3af on #ffffff = 2.85:1 (Fail)
```

**Figma Plugin**: Stark, Color Contrast Checker

### Focus States

```css
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Never remove outlines! */
button:focus {
  outline: none; /* ❌ Bad */
}
```

### Semantic HTML Mapping

```html
<!-- Design: "Card" → Code: <article> -->
<article class="card">
  <h2>Card Title</h2>
  <p>Card description</p>
  <button>Action</button>
</article>

<!-- Design: "Nav" → Code: <nav> -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>
```

---

## Component Documentation

### Button Component

```markdown
## Button

### Variants
- Primary: Main actions (CTA)
- Secondary: Secondary actions
- Ghost: Tertiary, low emphasis
- Danger: Destructive actions

### States
- Default
- Hover
- Active (pressed)
- Disabled
- Loading

### Props
- size: sm | md | lg
- variant: primary | secondary | ghost | danger
- icon: optional leading/trailing icon
- loading: boolean

### Usage
Primary: 1 per page/section
Secondary: Supporting actions
Ghost: Navigation, less important

### Accessibility
- Keyboard: Space/Enter to activate
- Screen reader: Descriptive label
- Focus: Visible outline
```

---

## Design Tokens

### JSON Format

```json
{
  "color": {
    "background": {
      "primary": {
        "value": "#ffffff",
        "type": "color"
      }
    },
    "text": {
      "primary": {
        "value": "#111827",
        "type": "color"
      }
    }
  },
  "spacing": {
    "1": {
      "value": "4px",
      "type": "spacing"
    },
    "2": {
      "value": "8px",
      "type": "spacing"
    }
  }
}
```

### Export to Code

```bash
# Style Dictionary
npx style-dictionary build

# Generates:
# - CSS variables
# - SCSS variables
# - JavaScript/TypeScript
# - iOS/Android tokens
```

---

## Figma Best Practices

### Naming Convention

```
Components:
- Button/Primary
- Button/Secondary
- Input/Text
- Card/Basic

Variants:
- Size: sm, md, lg
- State: default, hover, disabled
- Theme: light, dark
```

### Component Properties

```
Boolean: Has icon, Is loading
Instance Swap: Icon, Avatar
Text: Label, Description
Variant: Size, State
```

### Auto Layout Tips

```
1. Use Hug for buttons (wraps content)
2. Use Fill for inputs (stretches to container)
3. Set min-width on components
4. Use absolute positioning sparingly
```

---

## Workflow Integration

### Handoff to Developers

```
1. Figma Inspect Panel
   - Copy CSS
   - Export assets (SVG, PNG)
   - Measure spacing

2. Dev Mode (Figma)
   - Component properties
   - Variables view
   - Code snippets

3. Plugins
   - Zeplin (legacy)
   - Anima (React code gen)
   - Builder.io (no-code)
```

---

## Quality Checklist

```markdown
Design Review:
□ All states designed (hover, disabled, error)
□ Responsive behavior specified
□ Color contrast passes WCAG AA
□ Focus states visible
□ Touch targets ≥44×44px
□ Typography hierarchy clear
□ Consistent spacing
□ All assets exported (@1x, @2x, @3x)
□ Component documentation complete
```

---

## Tools Ecosystem

**Design**: Figma, Sketch (legacy), Adobe XD (sunset)
**Prototyping**: Figma, Framer, ProtoPie
**Handoff**: Figma Dev Mode, Zeplin
**Design Tokens**: Style Dictionary, Theo
**Accessibility**: Stark, axe DevTools
**Version Control**: Figma branches, Abstract (legacy)

---

## References

- Figma Best Practices Guide
- Material Design 3
- Apple Human Interface Guidelines
- WCAG 2.2 Specification
- "Design Systems" - Alla Kholmatova

**Related**: `accessibility-wcag.md`, `responsive-design.md`, `prototyping.md`
