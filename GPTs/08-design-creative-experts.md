# Design & Creative Experts - Deep Knowledge Base

## UX Designer (201-203)

### Design Process Framework

**Double Diamond Process:**
```
    DISCOVER          DEFINE          DEVELOP          DELIVER
   ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
   │         │      │         │      │         │      │         │
  ◄│ Diverge │►    ◄│ Converge│►    ◄│ Diverge │►    ◄│ Converge│►
   │         │      │         │      │         │      │         │
   └─────────┘      └─────────┘      └─────────┘      └─────────┘

   Research          Problem          Ideation         Solution
   Interviews        Statement        Prototyping      Testing
   Observation       How Might We     Iteration        Launch
```

### User Research Methods

| Method | When to Use | Sample Size | Time |
|--------|-------------|-------------|------|
| User Interviews | Discovery, validation | 5-8 users | 1-2 weeks |
| Surveys | Quantitative validation | 100+ users | 1 week |
| Usability Testing | Prototype validation | 5 users | 1-2 days |
| A/B Testing | Optimization | 1000+ users | 2+ weeks |
| Card Sorting | Information architecture | 15-30 users | 1 week |
| Diary Studies | Longitudinal behavior | 10-15 users | 2-4 weeks |
| Eye Tracking | Attention analysis | 10-20 users | 1 week |

### Usability Heuristics (Nielsen's 10)

1. **Visibility of System Status:** Keep users informed
2. **Match with Real World:** Use familiar language
3. **User Control & Freedom:** Provide escape routes
4. **Consistency & Standards:** Follow conventions
5. **Error Prevention:** Design to prevent errors
6. **Recognition vs Recall:** Make options visible
7. **Flexibility & Efficiency:** Accelerators for experts
8. **Aesthetic & Minimalist:** Remove unnecessary elements
9. **Help Users with Errors:** Clear error messages
10. **Help & Documentation:** Searchable, task-oriented

### Accessibility Guidelines (WCAG 2.1)

**Level AA Requirements:**
```
PERCEIVABLE
├── Text alternatives for images (alt text)
├── Captions for video/audio
├── Color contrast 4.5:1 (normal), 3:1 (large)
└── Responsive design, zoom to 200%

OPERABLE
├── Keyboard accessible (all functions)
├── Sufficient time (extend timeouts)
├── No seizure-inducing content
└── Skip navigation links

UNDERSTANDABLE
├── Language specified
├── Consistent navigation
├── Input assistance (labels, hints)
└── Error identification and suggestion

ROBUST
├── Valid HTML/ARIA
└── Compatible with assistive tech
```

---

## UI Designer (202)

### Design System Components

**Component Hierarchy:**
```
DESIGN TOKENS (Foundation)
├── Colors: Primary, Secondary, Semantic, Neutral
├── Typography: Font family, Scale, Weights
├── Spacing: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
├── Shadows: sm, md, lg, xl
├── Border Radius: none, sm, md, lg, full
└── Breakpoints: sm(640), md(768), lg(1024), xl(1280)

PRIMITIVES (Basic building blocks)
├── Button: Primary, Secondary, Tertiary, Ghost
├── Input: Text, Textarea, Select, Checkbox, Radio
├── Typography: H1-H6, Body, Caption, Label
└── Icons: System, Social, Custom

PATTERNS (Combined components)
├── Form: Input groups with validation
├── Card: Content containers
├── Modal: Overlays and dialogs
├── Navigation: Header, Sidebar, Tabs
└── Data Display: Tables, Lists, Charts

TEMPLATES (Page layouts)
├── Auth: Login, Register, Reset
├── Dashboard: Overview, Detail
├── Content: List, Detail, Edit
└── Settings: Preferences, Profile
```

### Color System

```css
/* Semantic Color System */
:root {
  /* Primary */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;

  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Neutral */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-500: #6b7280;
  --gray-900: #111827;

  /* Surfaces */
  --surface-primary: var(--white);
  --surface-secondary: var(--gray-50);
  --surface-elevated: var(--white);

  /* Text */
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-500);
  --text-disabled: var(--gray-400);
}

/* Dark Mode */
[data-theme="dark"] {
  --surface-primary: var(--gray-900);
  --surface-secondary: var(--gray-800);
  --text-primary: var(--gray-50);
  --text-secondary: var(--gray-400);
}
```

### Typography Scale

```css
/* Modular Scale (1.25 ratio) */
:root {
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem;  /* 36px */
  --font-size-5xl: 3rem;     /* 48px */

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

---

## Interaction Designer (204)

### Micro-interaction Principles

**Structure of Micro-interactions:**
```
TRIGGER → RULES → FEEDBACK → LOOPS & MODES

1. TRIGGER (What initiates)
   - User action (click, hover, scroll)
   - System event (notification, timer)

2. RULES (What happens)
   - State change logic
   - Constraints and conditions

3. FEEDBACK (How it's communicated)
   - Visual (color, size, position)
   - Audio (sound effects)
   - Haptic (vibration)

4. LOOPS & MODES
   - One-time or repeating
   - Context-dependent behavior
```

### Animation Timing

```css
/* Easing Functions */
:root {
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Duration Guidelines */
.instant { transition-duration: 100ms; }   /* Hover, focus */
.fast { transition-duration: 200ms; }      /* Button click */
.normal { transition-duration: 300ms; }    /* Page transitions */
.slow { transition-duration: 500ms; }      /* Complex animations */

/* Motion Principles */
.fade-enter {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms var(--ease-out);
}
```

---

## Brand Designer (207)

### Brand Identity System

**Brand Architecture:**
```
BRAND ESSENCE (Core)
├── Mission: Why we exist
├── Vision: Where we're going
├── Values: What we believe
└── Personality: How we express

BRAND EXPRESSION
├── Logo: Primary, secondary, icon
├── Color: Palette and usage
├── Typography: Font families
├── Imagery: Photography style
├── Voice: Tone and messaging
└── Motion: Animation principles

BRAND APPLICATION
├── Digital: Web, app, social
├── Print: Business cards, brochures
├── Environmental: Signage, packaging
└── Internal: Presentations, documents
```

### Logo Design Principles

**Checklist:**
- [ ] Works in black and white
- [ ] Scales to favicon size (16×16)
- [ ] Readable at 1 inch
- [ ] Works on dark/light backgrounds
- [ ] Memorable and distinctive
- [ ] Appropriate for industry
- [ ] Timeless (not trendy)

---

## Expert Activation

```
@ux-designer
@ui-designer
@interaction-designer
@brand-designer
@creative-director
```
or describe your design challenge
