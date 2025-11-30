# Best Practices - Cross-Domain Guide

## Software Engineering Best Practices

### Code Quality

```
CLEAN CODE PRINCIPLES:

1. MEANINGFUL NAMES
   Bad:  int d; // elapsed time in days
   Good: int elapsedTimeInDays;

2. FUNCTIONS SHOULD DO ONE THING
   Bad:  createUserAndSendEmailAndLogEvent()
   Good: createUser() → sendWelcomeEmail() → logUserCreated()

3. DRY (Don't Repeat Yourself)
   Extract common logic into reusable functions

4. YAGNI (You Ain't Gonna Need It)
   Don't add functionality until needed

5. KISS (Keep It Simple, Stupid)
   Simplest solution that works

6. COMMENTS EXPLAIN WHY, NOT WHAT
   Bad:  // increment counter
   Good: // Retry up to 3 times to handle transient failures
```

### Code Review Checklist

```markdown
## Functionality
- [ ] Code accomplishes the stated purpose
- [ ] Edge cases handled
- [ ] Error handling appropriate

## Design
- [ ] Follows existing patterns
- [ ] Appropriate abstraction level
- [ ] No over-engineering

## Code Quality
- [ ] Readable and self-documenting
- [ ] DRY - no duplication
- [ ] Proper naming conventions

## Testing
- [ ] Unit tests for new code
- [ ] Tests cover edge cases
- [ ] Tests are deterministic

## Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevented

## Performance
- [ ] No N+1 queries
- [ ] Appropriate caching
- [ ] No memory leaks

## Documentation
- [ ] Public APIs documented
- [ ] Complex logic explained
- [ ] README updated if needed
```

---

## Product Management Best Practices

### Product Development Lifecycle

```
DISCOVERY                    DELIVERY
(Learn)                      (Build)
    │                            │
    ▼                            ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Problem │→ │Solution │→ │  Build  │→ │ Launch  │
│Discovery│  │Discovery│  │         │  │         │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
    │             │            │            │
    ▼             ▼            ▼            ▼
User         Prototypes    Working      Metrics
Research     & Tests       Software     & Learning
```

### Metrics That Matter

```
ACQUISITION
├── CAC (Customer Acquisition Cost)
├── Traffic by channel
└── Conversion rates

ACTIVATION
├── Signup to first value
├── Time to first action
└── Onboarding completion

RETENTION
├── Daily/Weekly/Monthly Active Users
├── Cohort retention curves
└── Churn rate

REVENUE
├── ARPU (Average Revenue Per User)
├── LTV (Lifetime Value)
├── LTV:CAC ratio (target: 3:1)
└── MRR/ARR growth

REFERRAL
├── NPS (Net Promoter Score)
├── Viral coefficient
└── Referral conversion
```

---

## Design Best Practices

### Design System Principles

```
1. CONSISTENCY
   Same components behave the same everywhere

2. MODULARITY
   Components are self-contained and reusable

3. ACCESSIBILITY
   Works for users with diverse abilities

4. SCALABILITY
   Grows with the product without breaking

5. DOCUMENTATION
   Every component is documented with examples

6. VERSIONING
   Changes are tracked and communicated
```

### Responsive Design Breakpoints

```css
/* Mobile First Approach */

/* Base styles for mobile */
.container {
  width: 100%;
  padding: 16px;
}

/* Small devices (640px and up) */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

/* Medium devices (768px and up) */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

/* Large devices (1024px and up) */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

/* Extra large devices (1280px and up) */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

---

## Leadership Best Practices

### Effective 1:1 Meetings

```
FREQUENCY: Weekly, 30-60 minutes
OWNER: Direct report owns the agenda

STRUCTURE:
┌─────────────────────────────────────────────────────────────┐
│  TIME  │           TOPIC                                    │
├─────────────────────────────────────────────────────────────┤
│  5 min │  Check-in: How are you doing?                     │
│ 15 min │  Their topics: What's on your mind?               │
│ 10 min │  Your topics: Updates, feedback, alignment        │
│  5 min │  Career/Growth: Development, goals                │
│  5 min │  Action items: Clear next steps                   │
└─────────────────────────────────────────────────────────────┘

QUESTIONS TO ASK:
- What's going well?
- What's challenging?
- How can I help?
- What feedback do you have for me?
- What would you like to learn?
```

### Delegation Framework

```
DELEGATION LEVELS:

LEVEL 1: "Look into this and report back"
├── Full investigation, no action
└── For: New employees, high-risk decisions

LEVEL 2: "Research and recommend options"
├── Present alternatives with recommendation
└── For: Developing employees, medium decisions

LEVEL 3: "Decide and inform me before acting"
├── Make decision, get approval
└── For: Experienced employees, reversible decisions

LEVEL 4: "Decide and act, tell me what you did"
├── Full autonomy, keep informed
└── For: Senior employees, routine decisions

LEVEL 5: "Handle it completely"
├── Full ownership, no reporting needed
└── For: Experts, operational decisions
```

---

## Project Management Best Practices

### Sprint Planning

```
PRE-PLANNING (Before sprint)
├── Backlog groomed and prioritized
├── Stories estimated
└── Dependencies identified

PLANNING MEETING (2-4 hours)
├── Review sprint goal
├── Team capacity calculated
├── Stories selected and committed
└── Tasks broken down

SPRINT EXECUTION
├── Daily standups (15 min)
├── Work in progress limits
├── Blockers escalated immediately
└── Demo preparation ongoing

SPRINT CLOSE
├── Demo to stakeholders
├── Retrospective
└── Metrics captured
```

### Meeting Best Practices

```
BEFORE THE MEETING:
- [ ] Is this meeting necessary?
- [ ] Clear agenda with time allocation
- [ ] Required attendees only
- [ ] Pre-read materials sent 24h before

DURING THE MEETING:
- [ ] Start on time
- [ ] Assign note-taker
- [ ] Follow agenda
- [ ] End with action items

AFTER THE MEETING:
- [ ] Send notes within 24 hours
- [ ] Action items assigned with deadlines
- [ ] Follow up on commitments

DEFAULT MEETING LENGTHS:
- Quick sync: 15 min
- Working session: 25 min
- Deep discussion: 50 min
- Extended workshop: 80 min
(Leave buffer between meetings)
```

---

## Security Best Practices

### Secure Development

```
INPUT VALIDATION:
- Validate on server side (never trust client)
- Whitelist allowed values
- Sanitize before storage and display

AUTHENTICATION:
- Use established libraries (never roll your own)
- Implement MFA
- Secure session management
- Password requirements + breach checking

AUTHORIZATION:
- Principle of least privilege
- Check permissions on every request
- Use RBAC or ABAC
- Log access decisions

DATA PROTECTION:
- Encrypt at rest (AES-256)
- Encrypt in transit (TLS 1.3)
- Hash passwords (bcrypt, Argon2)
- Minimize data collection
```

---

## Expert Activation

```
@fullstack-developer
@devops-engineer
@product-manager
@leadership-coach
@security-engineer
```
or describe your domain
