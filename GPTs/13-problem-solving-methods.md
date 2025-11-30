# Problem-Solving Methods - Comprehensive Guide

## Structured Problem-Solving

### A3 Problem Solving (Toyota)

```
┌─────────────────────────────────────────────────────┐
│                    A3 REPORT                        │
├─────────────────────────────────────────────────────┤
│ TITLE: [Problem Name]         DATE:                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. BACKGROUND              2. CURRENT CONDITION    │
│  ┌───────────────────┐     ┌───────────────────┐   │
│  │ Why is this       │     │ What's happening  │   │
│  │ important?        │     │ now? Data/facts   │   │
│  │                   │     │                   │   │
│  └───────────────────┘     └───────────────────┘   │
│                                                     │
│  3. GOAL/TARGET             4. ROOT CAUSE ANALYSIS  │
│  ┌───────────────────┐     ┌───────────────────┐   │
│  │ What should be    │     │ 5 Whys            │   │
│  │ happening?        │     │ Fishbone diagram  │   │
│  │ Measurable target │     │                   │   │
│  └───────────────────┘     └───────────────────┘   │
│                                                     │
│  5. COUNTERMEASURES         6. IMPLEMENTATION PLAN  │
│  ┌───────────────────┐     ┌───────────────────┐   │
│  │ What will we do?  │     │ Who? When? How?   │   │
│  │ Specific actions  │     │ Timeline          │   │
│  │                   │     │                   │   │
│  └───────────────────┘     └───────────────────┘   │
│                                                     │
│  7. FOLLOW-UP               OWNER:                  │
│  ┌───────────────────┐                              │
│  │ How will we       │                              │
│  │ verify success?   │                              │
│  │ Metrics           │                              │
│  └───────────────────┘                              │
└─────────────────────────────────────────────────────┘
```

---

### 5 Whys Analysis

```
PROBLEM: Website checkout has 40% abandonment rate

WHY 1: Why do users abandon checkout?
→ Page takes too long to load

WHY 2: Why does the page take too long?
→ Too many API calls blocking render

WHY 3: Why are there too many API calls?
→ Each form field validates against separate endpoint

WHY 4: Why separate endpoints?
→ Original architecture from MVP, never optimized

WHY 5: Why was it never optimized?
→ No performance monitoring, issue not visible

ROOT CAUSE: Lack of performance monitoring
COUNTERMEASURE: Implement APM, consolidate API calls
```

---

### Fishbone Diagram (Ishikawa)

```
                    ┌──────────────────────┐
                    │      PROBLEM         │
                    │  [Effect to analyze] │
                    └──────────┬───────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │                          │                          │
    ▼                          ▼                          ▼
 METHODS                   MACHINES                   MATERIALS
    │                          │                          │
    ├─ Process issues          ├─ Equipment failure       ├─ Quality issues
    ├─ Missing steps           ├─ Maintenance             ├─ Specifications
    └─ Wrong sequence          └─ Calibration             └─ Suppliers
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │                          │                          │
    ▼                          ▼                          ▼
 PEOPLE                    MEASUREMENT               ENVIRONMENT
    │                          │                          │
    ├─ Training                ├─ Accuracy                ├─ Temperature
    ├─ Skills                  ├─ Data collection         ├─ Humidity
    └─ Communication           └─ Metrics                 └─ Workspace
```

---

### 8D Problem Solving

```
D0: PREPARE
├── Identify symptoms
├── Form initial response
└── Emergency containment if needed

D1: ESTABLISH THE TEAM
├── Cross-functional expertise
├── Clear roles (Champion, Leader, Members)
└── Adequate time allocation

D2: DESCRIBE THE PROBLEM
├── IS / IS NOT analysis
├── 5W2H (What, Where, When, Who, Why, How, How much)
└── Quantify the gap

D3: DEVELOP INTERIM CONTAINMENT
├── Protect the customer
├── Verify containment effectiveness
└── Document actions taken

D4: IDENTIFY ROOT CAUSES
├── 5 Whys, Fishbone, Fault Tree
├── Verify cause-effect relationship
└── Escape point analysis

D5: DEVELOP PERMANENT CORRECTIVE ACTIONS
├── Brainstorm solutions
├── Evaluate against criteria
└── Pilot test selected solutions

D6: IMPLEMENT AND VALIDATE
├── Execute implementation plan
├── Monitor effectiveness
└── Remove interim containment

D7: PREVENT RECURRENCE
├── Update processes, procedures
├── Modify systems
└── Train personnel

D8: RECOGNIZE THE TEAM
├── Document lessons learned
├── Share best practices
└── Celebrate success
```

---

## Creative Problem-Solving

### Design Thinking

```
        ┌──────────────────────────────────────────────────────────┐
        │                    DESIGN THINKING                        │
        └──────────────────────────────────────────────────────────┘

        EMPATHIZE        DEFINE          IDEATE         PROTOTYPE        TEST
           │                │               │               │              │
           ▼                ▼               ▼               ▼              ▼
     ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   ┌──────────┐
     │ Observe  │    │ Problem  │    │Brainstorm│    │  Build   │   │ Validate │
     │ users    │    │Statement │    │ ideas    │    │  models  │   │ with     │
     │          │    │          │    │          │    │          │   │ users    │
     │Interview │    │ How      │    │ Diverge  │    │ Fail     │   │ Iterate  │
     │ users    │    │ Might    │    │ then     │    │ fast     │   │ based on │
     │          │    │ We...?   │    │ converge │    │ learn    │   │ feedback │
     └──────────┘    └──────────┘    └──────────┘    └──────────┘   └──────────┘

        ◄───────────────────── ITERATE ─────────────────────────►
```

**Empathy Tools:**
- User interviews (5-8 users)
- Observation/shadowing
- Empathy maps
- Journey maps
- Personas

**Ideation Techniques:**
- Brainstorming (quantity over quality)
- Crazy 8s (8 ideas in 8 minutes)
- SCAMPER (Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse)
- Mind mapping
- Analogous inspiration

---

### SCAMPER Method

```
S - SUBSTITUTE
│   What can be replaced? Who else? What other materials?
│   Example: Plastic → biodegradable material
│
C - COMBINE
│   What can be merged? Combine purposes/functions?
│   Example: Phone + camera + GPS
│
A - ADAPT
│   What else is like this? What ideas can we borrow?
│   Example: Velcro inspired by burrs
│
M - MODIFY/MAGNIFY/MINIMIZE
│   Change size, shape, color, frequency?
│   Example: Mini version, jumbo size
│
P - PUT TO OTHER USE
│   Other uses as is? Other uses if modified?
│   Example: Bubble wrap as insulation
│
E - ELIMINATE
│   What can be removed? Simplified?
│   Example: Remove complexity, features
│
R - REVERSE/REARRANGE
    Opposite? Flip the sequence? Different arrangement?
    Example: Self-service instead of full-service
```

---

### TRIZ (Theory of Inventive Problem Solving)

**40 Inventive Principles (Top 10):**

| # | Principle | Example |
|---|-----------|---------|
| 1 | Segmentation | Modular furniture |
| 2 | Taking Out | Noise-canceling headphones |
| 3 | Local Quality | Different features by region |
| 10 | Preliminary Action | Pre-heating, pre-positioning |
| 13 | The Other Way Round | Escalator vs stairs |
| 15 | Dynamics | Adjustable height desk |
| 18 | Mechanical Vibration | Ultrasonic cleaning |
| 25 | Self-Service | ATM machines |
| 28 | Mechanics Substitution | Electric car |
| 35 | Parameter Changes | Freeze-dried food |

**Contradiction Matrix:**
When improving one parameter worsens another, use TRIZ principles to resolve without trade-off.

---

## Rapid Problem-Solving

### Lightning Decision Jam (LDJ)

```
TIME: 60-90 minutes total

1. PROBLEMS (7 min)
   └── Sticky notes: What's not working?

2. REFRAME (3 min)
   └── Convert problems to "How Might We..."

3. VOTE (3 min)
   └── Dot vote on top problems

4. SOLUTIONS (7 min)
   └── Sticky notes: Ideas for top problem

5. PRIORITIZE (6 min)
   └── Plot on Effort/Impact matrix

6. ACTION (5 min)
   └── Convert top ideas to experiments

OUTPUT: 1-3 experiments to run immediately
```

---

### First Principles Thinking

```
ANALOGY THINKING (Common)
├── "This is like that"
├── Copies existing solutions
└── Limited by precedent

FIRST PRINCIPLES (Breakthrough)
├── Break down to fundamental truths
├── Rebuild from scratch
└── Enables innovation

EXAMPLE: SpaceX Rocket Costs

ANALOGY APPROACH:
"Rockets cost $65M because that's what they cost"

FIRST PRINCIPLES:
1. What is a rocket made of?
   └── Aluminum, titanium, copper, carbon fiber

2. What do these materials cost?
   └── ~2% of rocket price on commodity market

3. Why the 50x markup?
   └── Not materials but manufacturing, labor, overhead

4. Can we change manufacturing?
   └── Vertical integration, reusability, 3D printing

RESULT: 10x cost reduction
```

---

## Implementation

### Action Priority Matrix

```
                    HIGH IMPACT
           ┌─────────────────────────────┐
           │                             │
           │  QUICK WINS    MAJOR        │
           │  ★ Do these   PROJECTS      │
           │    first      □ Plan        │
           │               carefully     │
LOW EFFORT ├─────────────────────────────┤ HIGH EFFORT
           │                             │
           │  FILL-INS     THANKLESS     │
           │  ○ If time    ✗ Avoid or    │
           │    permits     rethink      │
           │                             │
           └─────────────────────────────┘
                    LOW IMPACT
```

---

## Expert Activation

```
@strategy-consultant
@product-manager
@innovation-director
@qa-lead
```
or describe your problem
