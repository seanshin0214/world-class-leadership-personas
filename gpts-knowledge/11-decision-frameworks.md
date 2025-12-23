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
│  └──────────┘    └──────────┘    └────┬─────┘      │
│       ▲                               │            │
│       │          ┌──────────┐         │            │
│       │          │   ACT    │◄────────┘            │
│       │          │          │                      │
│       │          │ Execute  │                      │
│       └──────────┤ & learn  │                      │
│                  └──────────┘                      │
│                                                     │
│  Key: Cycle faster than competitors               │
└─────────────────────────────────────────────────────┘

USE WHEN:
- Competitive situations
- Rapidly changing environments
- Need for quick adaptation
```

### McKinsey 7-S Framework
```
            STRATEGY
               │
    ┌──────────┼──────────┐
    │          │          │
STRUCTURE──────┼──────SYSTEMS
    │          │          │
    │    ┌─────▼─────┐    │
    │    │  SHARED   │    │
    │    │  VALUES   │    │
    │    └─────┬─────┘    │
    │          │          │
 SKILLS────────┼────────STAFF
               │
             STYLE

HARD ELEMENTS (easier to change):
- Strategy: Plan to achieve goals
- Structure: Organization design
- Systems: Processes and workflows

SOFT ELEMENTS (harder to change):
- Shared Values: Core beliefs
- Style: Leadership approach
- Staff: People capabilities
- Skills: Organizational competencies

USE WHEN:
- Organizational change
- M&A integration
- Performance diagnosis
```

### Cynefin Framework
```
┌─────────────────────┬─────────────────────┐
│      COMPLEX        │    COMPLICATED      │
│                     │                     │
│  Probe-Sense-Respond│  Sense-Analyze-     │
│                     │  Respond            │
│  • Emergent practice│  • Good practice    │
│  • Enable patterns  │  • Expert analysis  │
│  • Many unknowns    │  • Cause knowable   │
├─────────────────────┼─────────────────────┤
│      CHAOTIC        │      CLEAR          │
│                     │     (Obvious)       │
│  Act-Sense-Respond  │  Sense-Categorize-  │
│                     │  Respond            │
│  • Novel practice   │  • Best practice    │
│  • Crisis response  │  • Standard process │
│  • Act first        │  • Clear cause      │
└─────────────────────┴─────────────────────┘
        Center: DISORDER (not yet classified)

DOMAIN SELECTION:
├── Clear: Use standard procedures
├── Complicated: Engage experts
├── Complex: Run experiments
└── Chaotic: Act decisively first
```

---

## Problem Analysis Frameworks

### Root Cause Analysis: 5 Whys
```
PROBLEM: Customer complaints increased 25%

Why 1: Why are complaints up?
→ Response time increased from 2h to 8h

Why 2: Why did response time increase?
→ Support team is overwhelmed

Why 3: Why is the team overwhelmed?
→ Ticket volume doubled

Why 4: Why did ticket volume double?
→ New product launch had many bugs

Why 5: Why were there many bugs?
→ Testing was cut short due to deadline pressure

ROOT CAUSE: Inadequate testing process under time pressure

COUNTERMEASURE: Implement automated testing + buffer time

TIPS:
- Keep asking "why" until you reach something actionable
- May need more or fewer than 5 whys
- Often reveals systemic issues
```

### Fishbone (Ishikawa) Diagram
```
                                        ┌──────────┐
PEOPLE          PROCESS                 │          │
   ┌────────────────┬───────────────────│ PROBLEM  │
   │                │                   │          │
   ├── Training     ├── Workflow        └──────────┘
   ├── Motivation   ├── Bottlenecks           │
   ├── Skills       └── Documentation         │
   │                                          │
───┼──────────────────────────────────────────┼───
   │                                          │
   ├── Raw materials  ├── Hardware            │
   ├── Suppliers      ├── Software            │
   └── Quality        └── Technology          │
                                              │
MATERIALS          MACHINES/TECHNOLOGY

CATEGORIES (6M):
- Man (People)
- Method (Process)
- Material
- Machine
- Measurement
- Mother Nature (Environment)
```

### Pareto Analysis (80/20)
```
IDENTIFY THE VITAL FEW:

Category          Count    %      Cumulative
────────────────────────────────────────────
User interface     45     45%        45%
Performance        25     25%        70%
Data errors        15     15%        85%  ← 80% line
Feature gaps        8      8%        93%
Documentation       7      7%       100%

VISUALIZATION:
100% |         ────────────────────●
     |     ────●
 80% |────●─────────────────────────
     | ─●
 60% |●
     |
 40% |
     |
 20% |
     |
  0% |____|____|____|____|____|____
      UI   Perf  Data  Feat  Doc

ACTION: Focus on UI (45%) and Performance (25%)
        Solving these addresses 70% of issues
```

---

## Decision-Making Models

### RAPID Framework (Bain)
```
R - RECOMMEND
    Who proposes a decision?
    ├── Gathers input
    ├── Develops alternatives
    └── Makes recommendation

A - AGREE
    Who must agree for decision to proceed?
    ├── Has veto power
    ├── Legal, compliance, policy
    └── Escalation if no agreement

P - PERFORM
    Who implements the decision?
    ├── Accountable for execution
    ├── Needs clear direction
    └── Reports on progress

I - INPUT
    Who provides information?
    ├── Subject matter experts
    ├── Data and analysis
    └── Perspectives and opinions

D - DECIDE
    Who makes the final call?
    ├── Single decision-maker
    ├── Considers all input
    └── Accountable for outcome

EXAMPLE:
Decision: Launch new product feature
R: Product Manager
A: Legal (privacy), Security
P: Engineering team
I: Customer Success, Sales, Marketing
D: VP Product
```

### Decision Matrix (Weighted)
```
CRITERIA & WEIGHTS:

Criteria        Weight   Option A   Option B   Option C
───────────────────────────────────────────────────────
Cost             30%        3          5          4
Speed            25%        5          3          4
Quality          25%        4          4          5
Risk             20%        3          4          3
───────────────────────────────────────────────────────
Weighted Score          3.65       4.05       4.05

CALCULATION (Option A):
(0.30 × 3) + (0.25 × 5) + (0.25 × 4) + (0.20 × 3)
= 0.9 + 1.25 + 1.0 + 0.6
= 3.75

SCALE:
1 = Poor
2 = Below Average
3 = Average
4 = Good
5 = Excellent
```

### Pre-Mortem Analysis
```
CONCEPT: Imagine the project has failed.
         What caused it?

PROCESS:
1. Assume the decision was made
2. Fast-forward: "It's one year later and this was a disaster"
3. Each person writes reasons for failure
4. Share and discuss all potential failure modes
5. Develop mitigation strategies

TEMPLATE:
┌────────────────────────────────────────────────┐
│ DECISION: Launch new pricing model             │
├────────────────────────────────────────────────┤
│ ASSUMED FAILURE DATE: 6 months from launch     │
├────────────────────────────────────────────────┤
│ POTENTIAL CAUSES OF FAILURE:                   │
│                                                │
│ 1. Customers churned due to price shock        │
│    Mitigation: Grandfather existing customers  │
│                                                │
│ 2. Sales couldn't explain new value            │
│    Mitigation: Training + collateral           │
│                                                │
│ 3. Competitors undercut us                     │
│    Mitigation: Add bundled value               │
│                                                │
│ 4. Implementation had billing errors           │
│    Mitigation: Extended QA + phased rollout    │
└────────────────────────────────────────────────┘
```

---

## Prioritization Frameworks

### MoSCoW Method
```
MUST HAVE (Critical)
├── System fails without it
├── Non-negotiable requirements
├── Legal/regulatory requirements
└── Core functionality

SHOULD HAVE (Important)
├── High priority
├── Not critical for launch
├── Workarounds may exist
└── Deliver if at all possible

COULD HAVE (Desirable)
├── Nice to have
├── Small improvement
├── Include if easy
└── First to drop if needed

WON'T HAVE (Not now)
├── Explicitly out of scope
├── Maybe future version
├── Helps manage expectations
└── Not "never," just "not now"

DISTRIBUTION GUIDELINE:
Must: 60% of effort
Should: 20% of effort
Could: 20% of effort
```

### ICE Scoring
```
FORMULA: ICE = (Impact + Confidence + Ease) / 3

IMPACT (1-10)
How much will this move the metric?
10 = Massive impact
1 = Negligible impact

CONFIDENCE (1-10)
How sure are we about impact and ease?
10 = Data-backed certainty
1 = Pure guess

EASE (1-10)
How simple is implementation?
10 = Trivial (< 1 day)
1 = Massive (> 1 quarter)

EXAMPLE:
Feature         Impact  Confidence  Ease   ICE
─────────────────────────────────────────────
Checkout fix      8        9         7     8.0
New dashboard     7        5         4     5.3
Mobile app        9        4         2     5.0
Email redesign    5        8         9     7.3

PRIORITY ORDER:
1. Checkout fix (8.0)
2. Email redesign (7.3)
3. New dashboard (5.3)
4. Mobile app (5.0)
```

### Value vs. Complexity Matrix
```
            HIGH VALUE
                │
    ┌───────────┼───────────┐
    │   QUICK   │   BIG     │
    │   WINS    │   BETS    │
    │           │           │
    │ Do first! │ Plan      │
    │           │ carefully │
LOW ├───────────┼───────────┤ HIGH
COMPLEXITY     │           COMPLEXITY
    │   FILL   │   MONEY   │
    │   INS    │   PITS    │
    │           │           │
    │ Do if    │ Avoid or  │
    │ time     │ redesign  │
    └───────────┼───────────┘
                │
            LOW VALUE

PLACEMENT CRITERIA:
Value: Revenue impact, user satisfaction, strategic fit
Complexity: Time, cost, risk, dependencies
```

---

## Risk Assessment

### Risk Matrix
```
                IMPACT
           Low    Med    High
         ┌──────┬──────┬──────┐
    High │  M   │  H   │  H   │
         ├──────┼──────┼──────┤
L   Med  │  L   │  M   │  H   │
I        ├──────┼──────┼──────┤
K   Low  │  L   │  L   │  M   │
E        └──────┴──────┴──────┘
L
I   L = Low (accept/monitor)
H   M = Medium (mitigate)
O   H = High (avoid/transfer)
O
D

RISK REGISTER:
Risk         Likelihood  Impact  Score  Response
─────────────────────────────────────────────────
Data breach     Low       High    M     Transfer (insurance)
Key person      Med       High    H     Mitigate (cross-train)
Delay           High      Med     H     Avoid (buffer time)
Budget          Med       Med     M     Accept (contingency)
```

### Expected Value Analysis
```
FORMULA: EV = Σ (Probability × Outcome)

EXAMPLE: New Product Launch

Outcome        Probability    Value      Expected
─────────────────────────────────────────────────
Big success      20%         $5M        $1.0M
Moderate         50%         $2M        $1.0M
Break-even       20%         $0         $0
Failure          10%        -$1M       -$0.1M
─────────────────────────────────────────────────
Expected Value                          $1.9M

Investment required: $1.5M
Net Expected Value: $400K → Positive ROI

DECISION RULE:
EV > Investment → Proceed
EV < Investment → Reject (or reassess)
```
