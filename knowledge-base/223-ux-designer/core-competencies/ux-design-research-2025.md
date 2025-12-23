# UX Design & Research 2025

**Updated**: 2025-11-23 | **Focus**: User Research, Wireframing, Usability Testing

---

## UX Design Process

```
DOUBLE DIAMOND:

DISCOVER (Diverge) → DEFINE (Converge) → DEVELOP (Diverge) → DELIVER (Converge)

1. DISCOVER: Understand the problem
   - User research
   - Stakeholder interviews
   - Market analysis
   - Problem identification

2. DEFINE: Clarify the problem
   - Personas
   - User journeys
   - Problem statement
   - Success metrics

3. DEVELOP: Create solutions
   - Ideation
   - Sketching
   - Wireframes
   - Prototypes

4. DELIVER: Implement & test
   - High-fidelity designs
   - Usability testing
   - Handoff to developers
   - Launch & iterate
```

---

## User Research

### Research Methods

```markdown
GENERATIVE RESEARCH (Discover what users need):

USER INTERVIEWS:
- When: Early stage, exploring problems
- Format: 1-on-1, 30-60 min
- Questions:
  * "Tell me about the last time you [task]..."
  * "What's frustrating about [current process]?"
  * "Walk me through your typical day..."
- Avoid leading questions: "Don't you think X is better?" ❌
- Best practice: "5 Whys" (dig deeper)
  * User: "I don't like this app"
  * Why? "It's slow"
  * Why? "Takes 10 seconds to load"
  * Why? "I have poor internet at home"
  * Why? "I live in rural area"
  → Real problem: Need offline mode!

FIELD STUDIES (Contextual Inquiry):
- Observe users in their natural environment
- Example: Watch how barista uses POS system
- Uncover unspoken pain points
- Time-consuming but rich insights

SURVEYS:
- When: Large sample size needed
- Format: Online, 5-10 min
- Question types:
  * Multiple choice
  * Likert scale (1-5: Strongly Disagree → Strongly Agree)
  * Open-ended (qualitative)
- Tools: Google Forms, Typeform, SurveyMonkey
- Sample size: 100+ for statistical significance

---

EVALUATIVE RESEARCH (Test solutions):

USABILITY TESTING:
- When: Prototype ready
- Format: 1-on-1, 30-45 min
- Task-based: "Find a blue t-shirt in size M and add to cart"
- Think aloud protocol: "Say what you're thinking as you go"
- Observe:
  * Task completion rate (80%+ = good)
  * Time on task
  * Error rate
  * User frustration (verbal cues, body language)
- 5 users finds 80% of usability issues (Nielsen)

A/B TESTING:
- When: Live product, comparing variations
- Example: Blue button vs Green button
- Metrics: Conversion rate, click-through rate
- Tools: Optimizely, Google Optimize
- Sample size: Depends on traffic, typically 1000+ per variant
- Statistical significance: p < 0.05 (95% confidence)

ANALYTICS:
- Quantitative data (what users do, not why)
- Tools: Google Analytics, Mixpanel, Hotjar
- Metrics:
  * Bounce rate (% who leave immediately)
  * Time on page
  * Conversion funnel (where drop-offs occur)
  * Heat maps (where users click/scroll)
```

---

## Personas & User Journeys

### Creating Personas

```markdown
PERSONA EXAMPLE:

┌─────────────────────────────────────────────────┐
│ SARAH, THE BUSY PROFESSIONAL                    │
├─────────────────────────────────────────────────┤
│ [Photo]                                         │
│                                                 │
│ DEMOGRAPHICS:                                   │
│ • Age: 32                                       │
│ • Occupation: Marketing Manager                 │
│ • Location: San Francisco                       │
│ • Income: $120K/year                            │
│ • Tech-savvy                                    │
│                                                 │
│ GOALS:                                          │
│ • Stay organized with tasks/calendar            │
│ • Collaborate with team efficiently             │
│ • Work-life balance                             │
│                                                 │
│ PAIN POINTS:                                    │
│ • Too many tools (email, Slack, Asana, etc.)    │
│ • Meetings interrupt deep work                  │
│ • Overwhelmed by notifications                  │
│                                                 │
│ BEHAVIORS:                                      │
│ • Checks phone first thing in morning           │
│ • Prefers mobile apps over desktop              │
│ • Values speed & simplicity                     │
│                                                 │
│ QUOTE:                                          │
│ "I need tools that just work. I don't have      │
│  time to learn complicated software."           │
└─────────────────────────────────────────────────┘

NUMBER OF PERSONAS:
- 2-3 primary personas (focus on these)
- 1-2 secondary personas
- Avoid: 10+ personas (too diluted)

---

USER JOURNEY MAP:

SCENARIO: Sarah books a doctor appointment

┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ STAGE    │ Aware    │ Search   │ Book     │ Visit    │ Follow-up │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ ACTIONS  │ Feels    │ Googles  │ Fills    │ Arrives  │ Receives │
│          │ sick     │ doctors  │ form     │ at       │ summary  │
│          │          │ nearby   │ online   │ clinic   │          │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ TOUCH-   │ Symptom  │ Google   │ Website  │ Front    │ Email    │
│ POINTS   │ checker  │ Maps     │ booking  │ desk     │          │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ EMOTIONS │ Worried  │ Hopeful  │ Annoyed  │ Relieved │ Satisfied│
│          │ 😟       │ 🙂       │ 😤       │ 😊       │ 😊       │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ PAIN     │ -        │ Too many │ Form     │ Long     │ -        │
│ POINTS   │          │ options  │ too long │ wait     │          │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ OPPOR-   │ Symptom  │ Filters  │ Shorter  │ Text     │ -        │
│ TUNITIES │ AI       │ (rating, │ form     │ when     │          │
│          │          │ insur.)  │          │ ready    │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘

INSIGHTS:
- Booking form too long → Simplify (only essential fields)
- Long wait time frustrating → SMS notification system

```

---

## Information Architecture

### Site Map & Card Sorting

```markdown
SITEMAP:

Home
├── Products
│   ├── Category A
│   │   ├── Product 1
│   │   └── Product 2
│   └── Category B
│       └── Product 3
├── About
│   ├── Our Story
│   └── Team
├── Support
│   ├── FAQ
│   ├── Contact
│   └── Live Chat
└── Account
    ├── Profile
    ├── Orders
    └── Settings

CARD SORTING:
- Method: Users organize topics into categories
- Types:
  * Open: Users create their own categories
  * Closed: Predefined categories
- Tools: OptimalSort, Miro
- Goal: Understand users' mental models
- Example: Do users expect "Returns" under "Support" or "Orders"?
```

---

## Wireframing & Prototyping

### Low-Fidelity Wireframes

```markdown
PAPER SKETCHES (Fastest):
- Sharpie + paper
- Rapid ideation (10 ideas in 10 minutes)
- Don't get attached (throw away bad ideas)

┌─────────────────────────┐
│  [LOGO]    🔍 Search  👤│
├─────────────────────────┤
│                         │
│   Hero Image            │
│   "Welcome to..."       │
│   [CTA Button]          │
│                         │
├─────────────────────────┤
│  [Feat 1] [Feat 2] [Feat 3] │
├─────────────────────────┤
│  Footer                 │
└─────────────────────────┘

DIGITAL WIREFRAMES (Balsamiq, Whimsical):
- Still lo-fi (gray boxes, no colors)
- Communicates layout, not visual design
- Fast to iterate
- Tools: Balsamiq, Whimsical, Excalidraw

WHEN TO USE:
- Early stage, exploring ideas
- Aligning with stakeholders
- Testing information architecture

---

HIGH-FIDELITY PROTOTYPES (Figma):

FEATURES:
- Interactive (clickable hotspots)
- Realistic (real content, colors, images)
- Animations (transitions, hover states)
- Responsive (mobile, tablet, desktop views)

FIGMA PROTOTYPING:
1. Create frames (screens)
2. Add interaction hotspots:
   - Click → Navigate to frame
   - Hover → Show overlay
   - Drag → Scrollable area
3. Preview & test (share link with stakeholders)

WHEN TO USE:
- Testing with users
- Developer handoff
- Presenting to executives
```

---

## Usability Testing

### Testing Script

```markdown
INTRODUCTION (5 min):
"Hi [Name], thanks for joining! Today we're testing a new app design.
There are no right or wrong answers - we're testing the design, not you.
Please think aloud as you go. I'll be taking notes but won't be able to help.
Do you have any questions before we start?"

TASKS (20 min):

Task 1 (Easy warm-up):
"Imagine you want to see your recent orders. Where would you go?"
→ Success criteria: Finds "Orders" page within 30 seconds

Task 2 (Medium):
"You want to buy a blue t-shirt in size Medium. Please add it to your cart."
→ Success criteria: Navigates to product, selects options, adds to cart

Task 3 (Complex):
"You want to apply a promo code 'SAVE20' at checkout."
→ Success criteria: Finds promo code field, enters code, sees discount

FOLLOW-UP QUESTIONS (5 min):
- "What did you like about the experience?"
- "What was confusing or frustrating?"
- "On a scale of 1-10, how likely would you recommend this to a friend?"
- "Any other feedback?"

THANK YOU:
"Thank you so much! Your feedback is incredibly valuable."
[Provide incentive: $50 gift card]

---

RECORDING:
- Screen recording: Loom, Zoom
- User's face: See expressions (frustration, delight)
- Get consent: "Is it okay if I record this session?"

---

ANALYZING RESULTS:

AFFINITY DIAGRAM:
1. Write each observation on sticky note
2. Group similar issues together
3. Prioritize by frequency & severity

Example findings:
┌─────────────────────────────────────┐
│ NAVIGATION (3 users)                │
│ • "Where's the search?"             │
│ • "Couldn't find account settings"  │
│ • "Too many menu items"             │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ CHECKOUT (4 users)                  │
│ • "Promo code field hidden"         │
│ • "Shipping options confusing"      │
│ • "Form too long"                   │
└─────────────────────────────────────┘

SEVERITY:
- Critical: Prevents task completion (fix immediately)
- Major: Significant friction (fix soon)
- Minor: Annoyance (fix if time)
```

---

## UX Laws & Principles

```markdown
FITTS'S LAW:
- Larger targets = easier to click
- Closer targets = faster to reach
- Application: Make primary buttons large (48×48px minimum for mobile)

HICK'S LAW:
- More choices = longer decision time
- Application: Limit menu items to 5-7, progressive disclosure

MILLER'S LAW:
- People remember ~7 items (±2)
- Application: Phone numbers chunked (555-1234), not 5551234

JAKOB'S LAW:
- Users expect your site to work like others
- Application: Logo in top-left, cart icon top-right (conventions)

AESTHETIC-USABILITY EFFECT:
- Beautiful design perceived as more usable
- But don't sacrifice usability for aesthetics!

---

F-PATTERN & Z-PATTERN:

F-PATTERN (Content-heavy pages):
Users read in F shape:
- Horizontal across top
- Down left side
- Horizontal again (shorter)
→ Put important info top-left

Z-PATTERN (Simple pages):
- Top-left → Top-right
- Diagonal → Bottom-left
- Bottom-right
→ Logo top-left, CTA top-right, features middle, CTA bottom-right

---

GESTALT PRINCIPLES:

PROXIMITY:
- Items close together = related
- Use whitespace to separate sections

SIMILARITY:
- Similar items = related
- Use consistent styling (color, shape) for related elements

CLOSURE:
- Brain completes incomplete shapes
- Don't need to fully outline everything

FIGURE-GROUND:
- Contrast separates foreground & background
- Use shadows, contrast to create depth
```

---

## Key Takeaways

1. **Empathy** - Understand users deeply (research, not assumptions)
2. **Iterate** - Test early, test often (lo-fi first, hi-fi later)
3. **Simplicity** - Reduce cognitive load (less is more)
4. **Accessibility** - Design for everyone (contrast, keyboard nav, screen readers)
5. **Measure** - Define success metrics, track improvements

---

## References

- "Don't Make Me Think" - Steve Krug
- "The Design of Everyday Things" - Don Norman
- Nielsen Norman Group Articles

**Related**: `ui-design-systems.md`, `accessibility-wcag.md`, `design-thinking.md`
