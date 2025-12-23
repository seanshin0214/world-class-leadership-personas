# UX/UI Design & User Research 2025

**Updated**: 2025-11-24 | **Focus**: User Research, Wireframing, Prototyping, Usability Testing

---

## UX Design Process

```markdown
DOUBLE DIAMOND MODEL:

DISCOVER (Diverge) → DEFINE (Converge) → DEVELOP (Diverge) → DELIVER (Converge)

1. DISCOVER (Research):
   - User interviews
   - Competitive analysis
   - Analytics review
   - Goal: Understand problem space

2. DEFINE (Synthesize):
   - Personas
   - User journeys
   - Problem statements
   - Goal: Define the right problem

3. DEVELOP (Ideate & Prototype):
   - Sketching
   - Wireframes
   - Prototypes
   - Goal: Explore solutions

4. DELIVER (Test & Iterate):
   - Usability testing
   - Iterate based on feedback
   - Handoff to development
   - Goal: Validate & refine solution

---

DESIGN THINKING (5 stages):

1. EMPATHIZE:
   - Understand users (observations, interviews)
   - Suspend assumptions

2. DEFINE:
   - Point of view statement
   - "[User] needs [need] because [insight]"
   - Example: "Busy parents need a quick meal planning solution because they lack time after work"

3. IDEATE:
   - Brainstorm solutions
   - Quantity over quality (divergent thinking)
   - "How might we...?" questions

4. PROTOTYPE:
   - Low-fidelity (paper, sketches)
   - Medium-fidelity (wireframes)
   - High-fidelity (interactive prototypes)

5. TEST:
   - Get user feedback
   - Iterate (back to ideate/prototype if needed)
```

---

## User Research

```markdown
QUALITATIVE RESEARCH:

USER INTERVIEWS:
- Goal: Understand motivations, pain points, behaviors
- Duration: 30-60 min
- Sample size: 5-10 users (diminishing returns after)

STRUCTURE:
1. Intro (5 min):
   - Explain purpose
   - Build rapport
   - Consent (recording)

2. Background (10 min):
   - Demographics (age, occupation)
   - Current behavior ("Tell me about how you currently...")

3. Deep dive (30 min):
   - Open-ended questions ("Why?" "Tell me more...")
   - Follow up ("Can you give an example?")
   - Avoid leading questions:
     * ❌ "Don't you think this feature would be useful?"
     * ✅ "How do you currently solve this problem?"

4. Wrap-up (5 min):
   - Anything missed?
   - Thank you

CONTEXTUAL INQUIRY:
- Observe users in their environment
- Watch them use current product/process
- Ask questions while they work
- Example: Watch accountant use spreadsheet software at desk

DIARY STUDIES:
- Users log activities over time (1-2 weeks)
- Capture behaviors in moment
- Example: "Log every time you order food delivery (what, why, how felt)"

---

QUANTITATIVE RESEARCH:

SURVEYS:
- Goal: Validate hypotheses at scale
- Sample size: 50-100+ users
- Question types:
  * Multiple choice
  * Likert scale (1-5: Strongly Disagree → Strongly Agree)
  * Open-ended (for quotes)

Tips:
- Keep short (5-10 min max, higher completion rate)
- Avoid double-barreled ("Is the app fast and easy to use?" - which one?)
- Pilot test (check for confusion)

ANALYTICS:
- Google Analytics, Mixpanel, Amplitude
- Metrics:
  * Page views, bounce rate, time on page
  * Conversion rate (funnels)
  * Feature usage
  * Drop-off points

A/B TESTING:
- Test two versions (A vs B)
- Measure impact on key metric
- Example: Green CTA button vs Blue (which has higher click rate?)

---

COMPETITIVE ANALYSIS:

1. Identify competitors (direct + indirect)
2. Evaluate features (what they have, we don't)
3. UX review (what works well, what doesn't)
4. Positioning (how do we differentiate?)

Template:
| Feature | Us | Competitor A | Competitor B |
|---------|----|--------------| -------------|
| Feature 1 | ✅ | ✅ | ❌ |
| Feature 2 | ❌ | ✅ | ✅ |
| Price | $10/mo | $15/mo | $8/mo |

---

SYNTHESIS (Making sense of data):

AFFINITY MAPPING:
- Write insights on sticky notes (1 insight per note)
- Group similar insights
- Label groups (themes)
- Identify patterns

PERSONAS:
- Fictional character representing user segment
- Based on research (not assumptions)

Template:
**Name**: Sarah, the Busy Parent
**Demographics**: 35, married, 2 kids, works full-time
**Goals**: Save time, feed family healthy meals
**Pain points**: No time to plan, recipes too complex
**Quote**: "I just want something quick and healthy"

USER JOURNEY MAP:
- Steps user takes to accomplish goal
- For each step:
  * Actions (what they do)
  * Thoughts (what they think)
  * Emotions (frustration, delight)
  * Touchpoints (website, app, email)
  * Pain points (where they struggle)

Example: Booking a flight
1. Search → 2. Compare → 3. Select → 4. Enter info → 5. Payment → 6. Confirmation

EMPATHY MAP:
- Says (quotes from interviews)
- Thinks (inferred thoughts)
- Does (observed behaviors)
- Feels (emotions)
```

---

## Wireframing & Prototyping

```markdown
FIDELITY LEVELS:

LOW-FIDELITY (Paper, Sketches):
- Quick, cheap
- Focus on layout, flow
- No colors, real content
- Use: Early ideation, team brainstorming
- Tools: Paper, whiteboard, Balsamiq

MEDIUM-FIDELITY (Wireframes):
- Grayscale, no images
- Placeholder text ("Lorem ipsum" or real-ish)
- Focus on structure, hierarchy
- Use: Stakeholder review, usability testing (early)
- Tools: Figma, Sketch, Adobe XD

HIGH-FIDELITY (Mockups & Prototypes):
- Colors, images, real content
- Pixel-perfect
- Interactive (clickable)
- Use: Developer handoff, usability testing (final), client presentation
- Tools: Figma, Sketch, Adobe XD, Framer

---

WIREFRAME BEST PRACTICES:

LAYOUT:
- Grid system (12-column common)
- Alignment (everything lines up)
- Consistent spacing (8px increments: 8, 16, 24, 32)
- White space (let it breathe, don't cram)

HIERARCHY:
- Visual weight (size, color, position)
- Primary action (largest, brightest)
- Secondary action (smaller, subtle)
- Tertiary (text links)

Example: Button hierarchy
- Primary: Solid blue, "Sign Up"
- Secondary: Outlined blue, "Learn More"
- Tertiary: Text link, "Skip"

ANNOTATIONS:
- Add notes (explain interactions, logic)
- Example: "Clicking 'Add to Cart' shows success message for 3 sec"

---

PROTOTYPING:

INTERACTIONS:
- Hover states (button darkens)
- Click/tap (navigate to next screen)
- Scroll (long pages)
- Transitions (fade, slide)

HOTSPOTS:
- Define clickable areas
- Link to target screen
- Example: Click "Sign Up" → Goes to registration form

USER FLOWS:
- Map out paths through prototype
- Happy path (expected flow)
- Edge cases (errors, back button)

EXAMPLE FLOW:
1. Landing page → Click "Sign Up"
2. Registration → Enter email, password → Click "Create Account"
3. Email verification → Check email → Click link
4. Welcome screen → Click "Get Started"
5. Dashboard

---

DESIGN SYSTEMS (Component libraries):

COMPONENTS:
- Buttons (primary, secondary, disabled states)
- Input fields (text, email, password, error states)
- Dropdowns, checkboxes, radio buttons
- Cards, modals, toasts (notifications)
- Navigation (header, footer, sidebar)

BENEFITS:
- Consistency (same button everywhere)
- Efficiency (reuse, don't redesign each time)
- Collaboration (designers & developers use same components)

TOOLS:
- Figma (components, variants, auto-layout)
- Storybook (component documentation for developers)

POPULAR DESIGN SYSTEMS:
- Material Design (Google)
- Human Interface Guidelines (Apple)
- Fluent Design (Microsoft)
- Ant Design (Alibaba)
```

---

## UI Design Principles

```markdown
VISUAL DESIGN:

COLOR:
- Primary (brand color, CTAs)
- Secondary (accents)
- Neutrals (background, text, borders)
- Semantic (success green, error red, warning yellow, info blue)

60-30-10 RULE:
- 60% Dominant (background)
- 30% Secondary (containers, cards)
- 10% Accent (CTAs, highlights)

CONTRAST:
- Text on background: 4.5:1 ratio (WCAG AA)
- Large text (18pt+): 3:1 ratio
- Use contrast checker (WebAIM, Figma plugins)

---

TYPOGRAPHY:

HIERARCHY:
- H1 (page title): 32-48px, bold
- H2 (section title): 24-32px, semi-bold
- H3 (subsection): 20-24px, semi-bold
- Body: 16px (minimum for readability)
- Small: 14px (captions, labels)

TYPE SCALE:
- Consistent sizes (e.g., 12, 14, 16, 20, 24, 32, 48)
- Use ratio (1.25×, 1.5×, etc.)

READABILITY:
- Line length: 50-75 characters (easier to scan)
- Line height: 1.5× font size (breathing room between lines)
- Font pairing: Sans-serif header + serif body (or vice versa)

---

SPACING:

8-POINT GRID:
- All spacing multiples of 8 (8, 16, 24, 32, 40, 48...)
- Why 8? Divisible by 2 (responsive, scales well)

PADDING:
- Button: 12px (top/bottom) × 24px (left/right)
- Card: 16-24px
- Page margins: 16px (mobile), 24-48px (desktop)

---

ICONS:

SIZE:
- Small: 16px (inline with text)
- Medium: 24px (buttons)
- Large: 32-48px (features)

STYLE:
- Outlined (hollow, modern)
- Filled (solid, bolder)
- Rounded (friendly, Apple-esque)
- Sharp (professional, Microsoft-esque)

LIBRARIES:
- Material Icons (Google, free)
- Font Awesome (free + paid)
- Heroicons (Tailwind, free)
- Feather Icons (minimal, free)

CUSTOM ICONS:
- Consistent stroke width (e.g., all 2px)
- Same corner radius
- Align to grid (pixel-perfect)
```

---

## Usability Testing

```markdown
PLANNING:

GOALS:
- What do you want to learn?
- "Can users complete checkout in <2 min?"
- "Do users understand the pricing page?"

TASKS:
- Realistic scenarios (not "Click the sign-up button")
- Example: "You want to buy a laptop under $1000. Find one and add it to cart."

PARTICIPANTS:
- 5-8 users (80% of issues found with 5)
- Match target audience (personas)
- Incentivize ($50-$100 gift card)

---

MODERATION:

THINK ALOUD:
- Ask users to verbalize thoughts
- "What are you thinking right now?"
- "What are you looking for?"

DON'T HELP:
- Let them struggle (reveals pain points)
- Resist urge to explain
- If stuck >2 min, offer hint or move on

NEUTRAL PROMPTS:
- ❌ "That was easy, right?" (leading)
- ✅ "How did that feel?" (open-ended)

---

METRICS:

SUCCESS RATE:
- Did user complete task?
- 80%+ = Good
- <60% = Major issues

TIME ON TASK:
- How long did it take?
- Compare to benchmarks

ERROR RATE:
- How many mistakes?
- Did they recover?

SATISFACTION (Post-test survey):
- SUS (System Usability Scale): 10 questions, 1-5 scale
  * Score 68+ = Average
  * 80+ = Excellent

---

ANALYSIS:

RAINBOW SPREADSHEET:
- Rows: Participants
- Columns: Tasks
- Color code: Green (success), Yellow (struggled), Red (failed)
- Quickly see patterns (all red on task 3 = redesign needed)

SEVERITY RATING:
- Critical: Blocks task completion (fix immediately)
- Major: Causes confusion, workaround exists (fix soon)
- Minor: Cosmetic, doesn't impact usability (fix if time)

RECOMMENDATIONS:
- For each issue:
  * What happened
  * Why it's a problem
  * Suggested fix
  * Priority (critical, major, minor)

Example:
- **Issue**: 4/5 users couldn't find search bar
- **Why**: Too small, blends into header
- **Fix**: Increase size, add icon, change color
- **Priority**: Critical
```

---

## Accessibility (a11y)

```markdown
WCAG 2.1 (Web Content Accessibility Guidelines):

LEVEL A (Minimum):
- Alt text for images
- Keyboard navigation (no mouse required)
- No flashing content (seizure risk)

LEVEL AA (Recommended):
- Color contrast 4.5:1 (text), 3:1 (large text, UI elements)
- Resize text 200% (still readable)
- Multiple ways to navigate (search, sitemap, breadcrumbs)

LEVEL AAA (Enhanced):
- Color contrast 7:1
- Sign language for audio

---

KEYBOARD NAVIGATION:
- Tab (next element)
- Shift+Tab (previous)
- Enter/Space (activate button, link)
- Arrow keys (dropdown, radio buttons)
- Esc (close modal)

FOCUS STATES:
- Visible indicator (blue outline, background color)
- Logical order (top to bottom, left to right)

---

SCREEN READERS (Blind users):

SEMANTIC HTML:
- Use <button> (not <div onclick>)
- Use <nav>, <header>, <main>, <footer>
- Headings hierarchy (H1 → H2 → H3, don't skip)

ARIA (Accessible Rich Internet Applications):
- aria-label: "Search" (for icon-only button)
- aria-labelledby: Points to element ID (for complex labels)
- aria-live: Announces dynamic content (e.g., "Item added to cart")
- aria-expanded: "true/false" (dropdown state)

ALT TEXT:
- Describe image ("Woman typing on laptop")
- Not: "image123.jpg"
- Decorative images: alt="" (screen reader skips)

---

INCLUSIVE DESIGN:

COLOR BLINDNESS:
- Don't rely on color alone (use icons, labels)
- Example: Error message = Red + "Error" icon (not just red text)

MOTOR IMPAIRMENTS:
- Large click targets (44×44px minimum, mobile)
- Avoid hover-only (use click/tap)

COGNITIVE:
- Clear language (avoid jargon)
- Consistent navigation (same place on every page)
- Error prevention (confirmations: "Are you sure you want to delete?")
```

---

## Key Takeaways

1. **User-centered** - Design for users (not yourself, not stakeholders)
2. **Test early, test often** - 5 users find 80% of issues (don't wait for "perfect")
3. **Simplicity** - Remove, don't add (every element should serve a purpose)
4. **Accessibility** - Not optional (legal requirement, moral imperative)
5. **Iterate** - First design is rarely right (feedback → improve → repeat)

---

## References

- "Don't Make Me Think" - Steve Krug
- "The Design of Everyday Things" - Don Norman
- Nielsen Norman Group (NN/g)

**Related**: `user-research-methods.md`, `figma-prototyping.md`, `accessibility-checklist.md`
