# Visual Design Excellence 2025

**Updated**: 2025-11-23 | **Stack**: Figma, Adobe CC, Midjourney

---

## Design Fundamentals

### Typography Hierarchy

```
SCALE (Modular Scale 1.250 - Major Third):

H1 (Display): 48px / 56px line-height
- Use for: Hero headlines, landing pages
- Weight: Bold (700)
- Max width: 12 words

H2 (Heading): 39px / 48px
- Use for: Section titles
- Weight: Semi-bold (600)

H3 (Subheading): 31px / 40px
- Use for: Subsections
- Weight: Medium (500)

H4: 25px / 32px
H5: 20px / 28px
Body: 16px / 24px (1.5x line-height for readability)
Small: 13px / 20px
Caption: 10px / 16px

FONT PAIRING:
✅ Serif + Sans-serif: Classic, readable
   - Playfair Display (serif headers)
   - Inter (sans body text)

✅ Two sans-serifs with contrast:
   - Montserrat (geometric, headers)
   - Open Sans (humanist, body)

❌ Two similar fonts: Confusing
❌ More than 2-3 font families: Chaotic

READABILITY:
- Line length: 45-75 characters
- Line height: 1.4-1.6 for body text
- Letter spacing: -0.01em for large text, 0.02em for small
- Contrast: 4.5:1 minimum (WCAG AA)
```

### Color Theory

```css
/* Brand Color System */

/* Primary (Brand) */
--primary-50: #EFF6FF;
--primary-500: #3B82F6;  /* Main brand color */
--primary-900: #1E3A8A;

/* Semantic Colors */
--success: #10B981;  /* Green */
--warning: #F59E0B;  /* Amber */
--error: #EF4444;    /* Red */
--info: #3B82F6;     /* Blue */

/* Neutral (Grays) */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;  /* Backgrounds */
--gray-200: #E5E7EB;  /* Borders */
--gray-500: #6B7280;  /* Secondary text */
--gray-900: #111827;  /* Primary text */

/* Usage */
.button-primary {
  background: var(--primary-500);
  color: white;
  
  &:hover {
    background: var(--primary-600);
  }
  
  &:disabled {
    background: var(--gray-300);
  }
}

/* Color Accessibility */
/* Check contrast: WebAIM Contrast Checker */
/* #3B82F6 on white: 4.63:1 (Pass AA) */
/* #3B82F6 on #F3F4F6: 4.21:1 (Pass AA Large Text) */
```

### Layout & Grid Systems

```
12-COLUMN GRID (Desktop 1440px):

Container: 1200px max-width
Columns: 12 (each 80px)
Gutter: 24px
Margin: 120px (left + right)

BREAKPOINTS:
- Desktop: 1440px+
- Laptop: 1024px - 1439px
- Tablet: 768px - 1023px
- Mobile: < 768px

SPACING SCALE (8px base):
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px

Use multiples of 8 for consistency:
- Button padding: 12px 24px (vertical, horizontal)
- Section spacing: 64px or 96px
- Card padding: 24px or 32px
```

---

## Design Process

### Discovery Phase

```markdown
CLIENT BRIEF QUESTIONS:

1. BUSINESS GOALS
   - What problem are we solving?
   - Who is the target audience?
   - What action do we want them to take?
   - How will we measure success?

2. BRAND
   - Existing brand guidelines?
   - Competitors to reference/avoid?
   - Adjectives to describe brand (modern, playful, professional)?

3. CONSTRAINTS
   - Budget?
   - Timeline?
   - Technical limitations?
   - Must-have vs nice-to-have?

4. INSPIRATION
   - Websites/apps you like?
   - Designs you hate?
   - Industry references?

DELIVERABLES:
- Mood board (visual direction)
- Competitive analysis (3-5 competitors)
- User personas (if applicable)
- Sitemap/Information architecture
```

### Design Exploration

```markdown
MOOD BOARD (Pinterest, Figma, Milanote):

Collect 20-30 reference images:
- Color palettes (5-6)
- Typography examples (3-4)
- Layout styles (grid, asymmetric, minimal)
- Photography style
- Iconography
- UI patterns

Present 2-3 directions:
Direction A: Bold, colorful, playful
Direction B: Minimal, elegant, professional
Direction C: Modern, gradient, tech-forward

Get client feedback → Choose direction
```

### Wireframing

```
LOW-FIDELITY (Grayscale, boxes):
- Focus on layout, hierarchy, content
- No colors, images, or final copy
- Fast iterations (1-2 days)

Tools: Figma, Sketch, Pen & paper

HOMEPAGE WIREFRAME:
┌────────────────────────┐
│  Logo    Navigation     │
├────────────────────────┤
│                        │
│   Hero Headline        │
│   Subheading           │
│   [CTA Button]         │
│                        │
├────────────────────────┤
│  Feature 1 │ Feature 2 │
│  Feature 3 │ Feature 4 │
├────────────────────────┤
│  Testimonials          │
├────────────────────────┤
│  Footer                │
└────────────────────────┘

HIGH-FIDELITY (Full design):
- Colors, images, final copy
- Pixel-perfect
- Ready for developer handoff
```

---

## UI Design Patterns

### Button States

```css
/* Primary Button */
.btn-primary {
  /* Default */
  background: #3B82F6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  
  /* Hover */
  &:hover {
    background: #2563EB;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  
  /* Active (pressed) */
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.4);
  }
  
  /* Disabled */
  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Loading */
  &.loading {
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.6s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Form Design

```
BEST PRACTICES:

✅ Single column (easier to scan)
✅ Clear labels above fields
✅ Placeholder text for examples (not instructions)
✅ Inline validation (real-time feedback)
✅ Error messages next to field (not just at top)
✅ Auto-focus first field
✅ Tab order logical
✅ Submit button at bottom
✅ Progress indicator for multi-step forms

❌ Dropdown for <5 options (use radio buttons)
❌ Asking for unnecessary information
❌ "Reset" button (users rarely want to clear everything)
❌ CAPTCHA (use honeypot or invisible CAPTCHA)

EXAMPLE:
┌─────────────────────────┐
│ Email *                 │
│ ┌─────────────────────┐ │
│ │ you@example.com     │ │
│ └─────────────────────┘ │
│                         │
│ Password *              │
│ ┌─────────────────────┐ │
│ │ ••••••••            │ │
│ └─────────────────────┘ │
│ [👁 Show]              │
│                         │
│ ┌─────────────────────┐ │
│ │  Sign In            │ │
│ └─────────────────────┘ │
│                         │
│ Forgot password?        │
└─────────────────────────┘
```

---

## Motion & Animation

### Animation Principles

```css
/* Timing Functions */

/* Ease-out (most common) */
/* Fast start, slow end - feels natural */
transition: transform 0.3s ease-out;

/* Ease-in-out */
/* Slow start, fast middle, slow end */
transition: opacity 0.4s ease-in-out;

/* Custom cubic-bezier (snappy) */
transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* DURATION:
- Micro-interactions: 100-200ms (hover, clicks)
- Transitions: 200-400ms (modal open, page change)
- Complex animations: 400-800ms (loading, success states)
*/

/* Example: Card hover */
.card {
  transition: transform 0.2s ease-out,
              box-shadow 0.2s ease-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  }
}

/* Example: Modal enter/exit */
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal {
  animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## Design Systems

### Component Library

```markdown
ATOMS (Basic building blocks):
- Button (primary, secondary, tertiary, danger)
- Input (text, email, password, number)
- Checkbox, Radio, Toggle
- Icon (consistent icon set, e.g., Lucide, Heroicons)
- Badge, Tag
- Avatar

MOLECULES (Combinations of atoms):
- Search bar (input + icon + button)
- Form field (label + input + error message)
- Card header (avatar + title + subtitle + actions)

ORGANISMS (Complex components):
- Navigation bar
- Card (image + header + body + footer)
- Modal dialog
- Data table
- Form (multiple fields + submit)

TEMPLATES (Page layouts):
- Landing page
- Dashboard
- Article page
- Settings page

PAGES (Instances with real content):
- Homepage (template + actual copy/images)
- Product page
- About page
```

---

## Tools & Workflow

### Figma Best Practices

```markdown
FILE ORGANIZATION:

Project
├── 📂 Design System
│   ├── 🎨 Colors
│   ├── 📝 Typography
│   ├── 🔘 Buttons
│   └── 🧩 Components
│
├── 📂 Website Redesign
│   ├── 📄 Homepage
│   ├── 📄 Product Page
│   └── 📄 About Page
│
└── 📂 Archive
    └── Old versions

NAMING CONVENTIONS:
- Pages: "01 - Homepage", "02 - Product Page"
- Frames: "Desktop 1440", "Mobile 375"
- Components: "Button/Primary/Default"
- Layers: "Header", "Hero Section", "CTA Button"

AUTO LAYOUT (Essential!):
- Use for responsive components
- Hug contents or Fixed size
- Padding & gap instead of manual spacing

COMPONENTS & VARIANTS:
Button component with variants:
- Type: Primary, Secondary, Tertiary
- Size: Small, Medium, Large
- State: Default, Hover, Disabled

PLUGINS:
- Unsplash (free stock photos)
- Iconify (icon library)
- Contrast (accessibility checker)
- Content Reel (generate realistic content)
- Autoflow (draw arrows for user flows)
```

---

## AI-Assisted Design

### Midjourney for Concept Art

```
PROMPT STRUCTURE:

[Subject] [Style] [Composition] [Lighting] [Parameters]

EXAMPLES:

"Modern tech startup office, isometric view, vibrant colors, 
soft lighting, highly detailed --ar 16:9 --v 6"

"SaaS dashboard UI, glassmorphism style, dark mode, 
blue accent colors, clean layout --ar 16:9"

"Abstract background, gradient mesh, purple and blue, 
smooth curves, minimal --ar 16:9 --no people"

PARAMETERS:
--ar 16:9 (aspect ratio)
--v 6 (version 6, latest)
--style raw (more photographic)
--s 250 (stylization, 0-1000)
--c 50 (chaos/variety, 0-100)

USE CASES:
✅ Hero images, backgrounds
✅ Concept exploration
✅ Mood boards
✅ Marketing visuals

❌ Logos (inconsistent)
❌ UI components (use Figma)
❌ Photos of specific people/products
```

### ChatGPT for Design Tasks

```
PROMPTS:

"Generate 5 headline options for a SaaS landing page targeting 
marketing managers. Product: Email automation tool."

"Write micro-copy for a 404 error page. Brand voice: Friendly, 
helpful, slightly humorous."

"Suggest 10 color palette ideas for a health & wellness app. 
Include hex codes."

"Create a sitemap for an e-commerce website selling outdoor gear."

LIMITATION:
- Can't generate actual visuals (use Midjourney/DALL-E)
- Descriptions only, not design files
```

---

## Design Handoff to Developers

### Developer-Friendly Figma Files

```markdown
CHECKLIST:

□ Organized layers (logical naming)
□ Components for reusable elements
□ Consistent spacing (8px grid)
□ Design tokens exported (colors, typography)
□ Assets exported (icons, images)
  - SVG for icons
  - WebP for photos (smaller than PNG)
  - Multiple resolutions (@1x, @2x, @3x for mobile)
□ Annotations for interactions (hover states, animations)
□ Responsive breakpoints documented
□ Edge cases designed (loading, empty states, errors)

FIGMA DEV MODE:
- Inspect tab shows CSS/React code
- Measures distances automatically
- Highlights components & variants
```

### Design Specs Document

```markdown
# Button Component Spec

## Variants
- Primary: Blue background, white text
- Secondary: White background, blue border, blue text
- Tertiary: Transparent background, blue text

## Sizes
- Small: 32px height, 12px 16px padding, 14px font
- Medium: 40px height, 12px 24px padding, 16px font
- Large: 48px height, 16px 32px padding, 18px font

## States
- Default: background #3B82F6
- Hover: background #2563EB, translateY(-1px)
- Active: background #1D4ED8, translateY(0)
- Disabled: background #D1D5DB, cursor not-allowed

## Accessibility
- Min contrast ratio: 4.5:1
- Focus state: 2px solid blue outline
- Keyboard navigable (Enter/Space triggers)

## Code Example
```jsx
<Button 
  variant="primary" 
  size="medium"
  onClick={handleClick}
>
  Click Me
</Button>
```
```

---

## Key Takeaways

1. **Consistency > creativity** - Reuse patterns, build systems
2. **Accessibility is not optional** - 4.5:1 contrast, keyboard nav
3. **Mobile-first** - Design for smallest screen first
4. **Prototype early** - Test interactions before full design
5. **Collaborate with developers** - Design is implementation-aware

---

## References

- "Refactoring UI" - Adam Wathan & Steve Schoger
- "The Design of Everyday Things" - Don Norman
- Material Design Guidelines (Google)
- Human Interface Guidelines (Apple)
- Laws of UX

**Related**: `ui-design-systems.md`, `figma-advanced.md`, `accessibility.md`
