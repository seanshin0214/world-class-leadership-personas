# Expert Collaboration Scenarios

## Common Collaboration Patterns

### Pattern 1: Technical Project Launch
```
SCENARIO: Launching a new SaaS product

PHASE 1: STRATEGY
┌─────────────────────────────────────────┐
│ Strategy Consultant (303)               │
│ • Market analysis                       │
│ • Competitive positioning               │
│ • Go-to-market strategy                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
PHASE 2: PRODUCT DEFINITION
┌─────────────────────────────────────────┐
│ Product Manager (306)                   │
│ • Feature prioritization                │
│ • User stories                          │
│ • MVP definition                        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
PHASE 3: DESIGN
┌─────────────────────────────────────────┐
│ UX Designer (201) + UI Designer         │
│ • User research                         │
│ • Wireframes                            │
│ • Prototypes                            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
PHASE 4: ARCHITECTURE
┌─────────────────────────────────────────┐
│ Systems Architect (128)                 │
│ • Technical architecture                │
│ • Technology stack                      │
│ • Scalability planning                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
PHASE 5: DEVELOPMENT
┌─────────────────────────────────────────┐
│ Fullstack Dev (101) + DevOps (108)      │
│ • Implementation                        │
│ • CI/CD setup                           │
│ • Deployment                            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
PHASE 6: SECURITY & QUALITY
┌─────────────────────────────────────────┐
│ Security Expert (126) + QA (501)        │
│ • Security review                       │
│ • Testing                               │
│ • Performance validation                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
PHASE 7: LAUNCH
┌─────────────────────────────────────────┐
│ Marketing Director (314)                │
│ • Launch campaign                       │
│ • Content strategy                      │
│ • PR coordination                       │
└─────────────────────────────────────────┘
```

---

### Pattern 2: Crisis Management
```
SCENARIO: Major production incident

IMMEDIATE RESPONSE (Parallel):
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ DevOps (108)    │  │ Security (126)  │  │ Systems Arch    │
│ • Assess scope  │  │ • Security      │  │ (128)           │
│ • Mitigate      │  │   implications  │  │ • Root cause    │
│ • Communicate   │  │ • Data breach   │  │ • Fix strategy  │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
COMMUNICATION:
┌─────────────────────────────────────────┐
│ PR Specialist (322)                     │
│ • Stakeholder communication             │
│ • Customer notification                 │
│ • Media response                        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
LEGAL REVIEW:
┌─────────────────────────────────────────┐
│ Legal Advisor (901)                     │
│ • Compliance implications               │
│ • Liability assessment                  │
│ • Regulatory notifications              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
POST-MORTEM:
┌─────────────────────────────────────────┐
│ QA Lead (501) + DevOps (108)            │
│ • Root cause documentation              │
│ • Prevention measures                   │
│ • Process improvements                  │
└─────────────────────────────────────────┘
```

---

### Pattern 3: AI Product Development
```
SCENARIO: Building an AI-powered feature

FEASIBILITY:
┌─────────────────────────────────────────┐
│ AI Strategy Consultant (304)            │
│ • Use case validation                   │
│ • ROI analysis                          │
│ • Build vs buy decision                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
DATA & MODEL:
┌─────────────────────────────────────────┐
│ Data Engineer (106) + Data Scientist    │
│ (401)                                   │
│ • Data pipeline                         │
│ • Model development                     │
│ • Training & validation                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
LLM INTEGRATION:
┌─────────────────────────────────────────┐
│ LLM Engineer (410)                      │
│ • Prompt engineering                    │
│ • RAG implementation                    │
│ • Fine-tuning if needed                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
ETHICS REVIEW:
┌─────────────────────────────────────────┐
│ AI Ethics Expert (404)                  │
│ • Bias assessment                       │
│ • Fairness testing                      │
│ • Governance framework                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
PRODUCTIZATION:
┌─────────────────────────────────────────┐
│ Product Manager (306) + Engineer (104)  │
│ • Feature integration                   │
│ • User experience                       │
│ • Monitoring & feedback                 │
└─────────────────────────────────────────┘
```

---

### Pattern 4: Fundraising
```
SCENARIO: Series A fundraising

PREPARATION:
┌─────────────────────────────────────────┐
│ CFO Advisor (312)                       │
│ • Financial model                       │
│ • Valuation analysis                    │
│ • Metrics dashboard                     │
└─────────────────┬───────────────────────┘
                  │
         ┌───────┴───────┐
         ▼               ▼
┌─────────────────┐ ┌─────────────────┐
│ Strategy (303)  │ │ Business Story  │
│ • Market sizing │ │ teller (333)    │
│ • Competitive   │ │ • Narrative     │
│   landscape     │ │ • Pitch deck    │
└────────┬────────┘ └────────┬────────┘
         │                   │
         └─────────┬─────────┘
                   ▼
INVESTOR PERSPECTIVE:
┌─────────────────────────────────────────┐
│ Venture Capitalist (317)                │
│ • Deck review from VC lens              │
│ • Objection preparation                 │
│ • Negotiation strategy                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
LEGAL:
┌─────────────────────────────────────────┐
│ Legal Advisor (901)                     │
│ • Term sheet review                     │
│ • Due diligence prep                    │
│ • Corporate structure                   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
NEGOTIATION:
┌─────────────────────────────────────────┐
│ Harvard PhD Negotiation (903)           │
│ • BATNA development                     │
│ • Negotiation strategy                  │
│ • Deal terms optimization               │
└─────────────────────────────────────────┘
```

---

### Pattern 5: Digital Transformation
```
SCENARIO: Enterprise digital transformation

ASSESSMENT:
┌─────────────────────────────────────────┐
│ Digital Transformation Leader (334)     │
│ • Current state assessment              │
│ • Opportunity identification            │
│ • Transformation roadmap                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
PARALLEL WORKSTREAMS:
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Systems Arch    │ │ AI Strategy     │ │ Operations Mgr  │
│ (128)           │ │ (304)           │ │ (316)           │
│ • Tech stack    │ │ • AI use cases  │ │ • Process       │
│ • Cloud         │ │ • Automation    │ │   redesign      │
│   migration     │ │   opportunities │ │ • Efficiency    │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
PEOPLE & CHANGE:
┌─────────────────────────────────────────┐
│ Human Dynamics Architect (328)          │
│ + HR Consultant (315)                   │
│ • Change management                     │
│ • Training programs                     │
│ • Culture transformation                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
EXECUTION:
┌─────────────────────────────────────────┐
│ Agile Growth Architect (331)            │
│ + Scrum Master (337)                    │
│ • Agile implementation                  │
│ • Sprint planning                       │
│ • Continuous delivery                   │
└─────────────────────────────────────────┘
```

---

## Expert Handoff Templates

### Technical Handoff
```
FROM: [Expert A]
TO: [Expert B]

CONTEXT:
• Original request: [What was asked]
• Work completed: [What was done]
• Key findings: [Main insights]

CURRENT STATE:
• [Status of deliverables]
• [Open questions]
• [Blockers if any]

FOR YOUR REVIEW:
• [Specific items needing attention]
• [Decisions needed]
• [Validation required]

NEXT STEPS SUGGESTED:
1. [Action 1]
2. [Action 2]
3. [Action 3]
```

### Strategic Handoff
```
FROM: Strategy Consultant (303)
TO: CFO Advisor (312)

STRATEGIC RECOMMENDATION:
[Summary of strategy]

FINANCIAL IMPLICATIONS:
• Investment required: [Estimate]
• Expected returns: [Projections]
• Risk factors: [Key risks]

NEEDS FROM YOU:
1. Financial model validation
2. ROI analysis
3. Funding recommendations

TIMELINE:
• Decision needed by: [Date]
• Implementation start: [Date]
```

---

## Best Practices for Collaboration

### Do's
```
✓ Be explicit about what you need from each expert
✓ Provide context from previous expert consultations
✓ Specify handoff points and dependencies
✓ Set clear success criteria
✓ Allow for expert disagreement and synthesis
```

### Don'ts
```
✗ Skip experts to save time (may cause rework)
✗ Ignore expert recommendations without discussion
✗ Rush through phases without validation
✗ Fail to document decisions and rationale
✗ Change requirements without updating all experts
```

### Conflict Resolution
```
WHEN EXPERTS DISAGREE:

1. CLARIFY POSITIONS
   • What exactly is the disagreement?
   • What evidence supports each view?

2. IDENTIFY ROOT CAUSE
   • Different assumptions?
   • Different priorities?
   • Different risk tolerance?

3. SEEK SYNTHESIS
   • Is there a middle ground?
   • Can both approaches be tested?
   • What would change each expert's mind?

4. ESCALATE IF NEEDED
   • Bring in additional perspective
   • Use Strategic Oracle (326) for tie-breaking
   • Document trade-offs for decision-maker
```
