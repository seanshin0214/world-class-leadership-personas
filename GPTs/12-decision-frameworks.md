# Decision Frameworks - Comprehensive Guide

## Strategic Decision Frameworks

### OODA Loop (Observe-Orient-Decide-Act)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │ OBSERVE  │───►│  ORIENT  │───►│  DECIDE  │      │
│  │          │    │          │    │          │      │
│  │ Gather   │    │ Analyze  │    │ Choose   │      │
│  │ data     │    │ context  │    │ action   │      │
│  └──────────┘    └──────────┘    └──────────┘      │
│       ▲                               │             │
│       │                               ▼             │
│       │          ┌──────────┐                      │
│       └──────────│   ACT    │◄─────────────────────┘
│                  │          │
│                  │ Execute  │
│                  │ decision │
│                  └──────────┘
│                                                     │
│  Speed of cycle = Competitive advantage            │
└─────────────────────────────────────────────────────┘
```

**Application:**
- Military: Faster OODA loop beats opponent
- Business: Rapid market response
- Personal: Agile decision-making

---

### RAPID Framework

```
RAPID = Recommend, Agree, Perform, Input, Decide

R - RECOMMEND
│   Who proposes the decision?
│   └── Builds business case, gathers data
│
A - AGREE
│   Who must sign off?
│   └── Can veto but must engage constructively
│
P - PERFORM
│   Who executes?
│   └── Responsible for implementation
│
I - INPUT
│   Who provides information?
│   └── Consulted for expertise, no veto
│
D - DECIDE
    Who makes final call?
    └── Single point of accountability
```

**Example Application:**
| Role | Person | Responsibility |
|------|--------|----------------|
| R | Product Manager | Recommend feature |
| A | Legal, Security | Must approve |
| P | Engineering Team | Build feature |
| I | Customer Success | Provide feedback |
| D | VP Product | Final decision |

---

### Cynefin Framework

```
                 COMPLEX              COMPLICATED
               (Emergent)            (Good Practice)
           ┌─────────────────────┬─────────────────────┐
           │                     │                     │
           │  Probe              │  Sense              │
           │  Sense              │  Analyze            │
           │  Respond            │  Respond            │
           │                     │                     │
           │  Enable emergence   │  Apply expertise    │
           │                     │                     │
           ├─────────────────────┼─────────────────────┤
           │                     │                     │
           │  Act                │  Sense              │
           │  Sense              │  Categorize         │
           │  Respond            │  Respond            │
           │                     │                     │
           │  Novel approaches   │  Best practice      │
           │                     │                     │
           └─────────────────────┴─────────────────────┘
                 CHAOTIC               CLEAR/OBVIOUS
                (Novel)               (Best Practice)

               ┌─────────────────┐
               │    DISORDER     │
               │   (Confused)    │
               └─────────────────┘
```

**Domain Characteristics:**

| Domain | Relationship | Approach | Example |
|--------|--------------|----------|---------|
| Clear | Obvious | Best practice | Standard procedures |
| Complicated | Requires analysis | Expert opinion | Engineering problems |
| Complex | Emergent patterns | Experiments | Market dynamics |
| Chaotic | No patterns | Act immediately | Crisis management |

---

### Eisenhower Matrix

```
                    URGENT              NOT URGENT
           ┌─────────────────────┬─────────────────────┐
           │                     │                     │
  IMPORTANT│      DO FIRST       │      SCHEDULE       │
           │                     │                     │
           │  Crises             │  Long-term goals    │
           │  Deadlines          │  Relationship       │
           │  Problems           │  Planning           │
           │                     │                     │
           ├─────────────────────┼─────────────────────┤
           │                     │                     │
NOT IMPORTANT      DELEGATE       │      ELIMINATE      │
           │                     │                     │
           │  Interruptions      │  Time wasters       │
           │  Some meetings      │  Busy work          │
           │  Some emails        │  Escape activities  │
           │                     │                     │
           └─────────────────────┴─────────────────────┘
```

---

## Analytical Decision Frameworks

### Decision Matrix (Weighted Scoring)

```
STEP 1: List options and criteria
STEP 2: Assign weights to criteria (must sum to 100%)
STEP 3: Score each option on each criterion (1-10)
STEP 4: Calculate weighted scores
STEP 5: Compare and decide

Example: Technology Platform Selection
─────────────────────────────────────────────────────────────
Criteria       Weight   Option A   Option B   Option C
─────────────────────────────────────────────────────────────
Cost            25%     8 (2.0)    6 (1.5)    4 (1.0)
Performance     30%     7 (2.1)    9 (2.7)    8 (2.4)
Scalability     20%     6 (1.2)    8 (1.6)    9 (1.8)
Support         15%     9 (1.35)   7 (1.05)   5 (0.75)
Integration     10%     7 (0.7)    8 (0.8)    6 (0.6)
─────────────────────────────────────────────────────────────
TOTAL          100%     7.35       7.65       6.55
                         ▲
                    Winner: Option B
```

---

### Pre-Mortem Analysis

```
TRADITIONAL:  Plan → Execute → Post-mortem (if failed)
PRE-MORTEM:   Plan → Imagine failure → Identify risks → Mitigate

PROCESS:
1. "Imagine it's [future date] and this project has failed spectacularly."
2. Each team member independently lists reasons for failure
3. Share and consolidate failure modes
4. Prioritize by likelihood × impact
5. Develop mitigation strategies for top risks

EXAMPLE OUTPUT:
┌────────────────────────────────────────────────────────────┐
│ FAILURE MODE                 │ LIKELIHOOD │ IMPACT │ RISK │
├────────────────────────────────────────────────────────────┤
│ Key engineer leaves          │    HIGH    │  HIGH  │  ●   │
│ Scope creep delays launch    │   MEDIUM   │  HIGH  │  ●   │
│ Integration issues           │   MEDIUM   │ MEDIUM │  ◐   │
│ User adoption lower expected │    LOW     │  HIGH  │  ◐   │
│ Budget overrun               │   MEDIUM   │  LOW   │  ○   │
└────────────────────────────────────────────────────────────┘
```

---

### Six Thinking Hats

```
WHITE HAT - Facts & Information
│  What data do we have?
│  What data do we need?
│
RED HAT - Emotions & Intuition
│  How do we feel about this?
│  What's our gut reaction?
│
BLACK HAT - Critical Judgment
│  What could go wrong?
│  What are the risks?
│
YELLOW HAT - Optimistic View
│  What are the benefits?
│  What's the best case?
│
GREEN HAT - Creative Thinking
│  What are alternative ideas?
│  How can we innovate?
│
BLUE HAT - Process Control
    How should we organize thinking?
    What's the next step?
```

**Meeting Application:**
1. Blue: Set agenda and goals (5 min)
2. White: Review facts objectively (10 min)
3. Green: Generate ideas freely (15 min)
4. Yellow: Explore benefits (10 min)
5. Black: Identify risks (10 min)
6. Red: Gut check on options (5 min)
7. Blue: Summarize and decide (5 min)

---

## Risk Assessment Frameworks

### Risk Matrix

```
                    IMPACT
          LOW       MEDIUM      HIGH
       ┌─────────┬─────────┬─────────┐
  HIGH │  MEDIUM │   HIGH  │CRITICAL │
       │   ●     │    ●    │    ●    │
LIKELIHOOD─────────┼─────────┼─────────┤
MEDIUM │   LOW   │  MEDIUM │   HIGH  │
       │   ○     │    ●    │    ●    │
       ├─────────┼─────────┼─────────┤
  LOW  │   LOW   │   LOW   │  MEDIUM │
       │   ○     │    ○    │    ●    │
       └─────────┴─────────┴─────────┘

Response by Level:
─────────────────────────────────────
CRITICAL: Immediate action required
HIGH:     Active management needed
MEDIUM:   Monitor and plan response
LOW:      Accept or periodic review
```

---

## Quick Decision Rules

### 10/10/10 Rule
```
Before deciding, ask:
- How will I feel about this in 10 MINUTES?
- How will I feel about this in 10 MONTHS?
- How will I feel about this in 10 YEARS?
```

### Reversibility Test (Jeff Bezos)
```
TYPE 1 DECISIONS (Irreversible)
├── Take time
├── Gather data
├── Seek input
└── Decide carefully

TYPE 2 DECISIONS (Reversible)
├── Decide quickly
├── Delegate
├── Learn from results
└── Adjust as needed
```

### 2-Minute Rule
```
If a decision:
- Takes less than 2 minutes to make
- Has low stakes
- Is easily reversible
→ JUST DECIDE NOW. Don't schedule a meeting.
```

---

## Expert Activation

```
@strategic-oracle
@strategy-consultant
@leadership-coach
@executive-coach
```
or describe your decision challenge
