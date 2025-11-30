# Expert Chaining Patterns

## Overview

Expert chaining enables complex problem-solving by combining multiple experts sequentially or in parallel. This document provides proven patterns for effective expert collaboration.

---

## Basic Chaining Patterns

### Sequential Chain
Experts consulted one after another, each building on previous insights.

```
Pattern: A → B → C
Example: Architect → Developer → Security Expert

User: "Design and secure a new authentication system"
Flow:
1. Systems Architect (128) - Overall design
2. Backend Developer (103) - Implementation details
3. Security Expert (126) - Security review
```

### Parallel Chain
Multiple experts provide independent perspectives simultaneously.

```
Pattern: [A, B, C] → Synthesis
Example: [Marketing, Finance, Legal] → Decision

User: "Evaluate this acquisition opportunity"
Flow:
1. [Parallel]
   - Marketing Director (314) - Market impact
   - CFO Advisor (312) - Financial analysis
   - Legal Advisor (901) - Legal implications
2. Strategic Oracle (326) - Synthesize and recommend
```

### Iterative Chain
Cycle between experts until convergence.

```
Pattern: A ↔ B (repeat until done)
Example: Designer ↔ Developer

User: "Create a perfect user interface"
Flow:
1. UX Designer (201) - Initial design
2. Frontend Developer (102) - Technical feedback
3. UX Designer (201) - Refine based on constraints
4. Frontend Developer (102) - Confirm feasibility
```

---

## Domain-Specific Chains

### Product Development Chain
```
Product Manager (306)
    ↓
UX Designer (201)
    ↓
[Frontend (102), Backend (103)]
    ↓
QA Engineer (502)
    ↓
DevOps (108)
```

**When to use**: New feature development, MVP creation

### Technical Architecture Chain
```
Systems Architect (128)
    ↓
[Database Expert (112), API Architect (117)]
    ↓
Security Expert (126)
    ↓
DevOps Engineer (108)
    ↓
SRE perspective if needed
```

**When to use**: System design, infrastructure planning

### Business Strategy Chain
```
Strategy Consultant (303)
    ↓
[Market Analysis, Competitive Analysis]
    ↓
CFO Advisor (312)
    ↓
Operations Manager (316)
    ↓
Implementation Plan
```

**When to use**: Strategic decisions, market entry

### AI Implementation Chain
```
AI Strategy Consultant (304)
    ↓
Data Engineer (106)
    ↓
LLM Engineer (410) or Data Scientist (401)
    ↓
AI Ethics (404)
    ↓
DevOps for ML (108)
```

**When to use**: AI/ML project planning and execution

### Crisis Management Chain
```
[Domain Expert, Legal Advisor (901)]
    ↓
PR Specialist (322)
    ↓
Leadership Coach (801)
    ↓
Action Plan
```

**When to use**: PR crisis, legal issues, urgent decisions

---

## Advanced Patterns

### The Review Pattern
Every major decision gets a second opinion.

```
Primary Expert → Reviewer Expert
Examples:
- Code: Developer → Security Expert
- Strategy: Consultant → CFO Advisor
- Design: Designer → UX Researcher
```

### The Devil's Advocate Pattern
Intentionally seek opposing viewpoints.

```
Proposer → Challenger
Example:
- Innovation Expert (301) proposes idea
- CFO Advisor (312) challenges ROI
- Strategic Oracle (326) synthesizes
```

### The Specialization Ladder
Start broad, get increasingly specific.

```
Generalist → Specialist → Deep Expert
Example:
- Fullstack Dev (101) - General approach
- React Expert (102) - Frontend specifics
- Performance optimization details
```

### The Validation Loop
External validation before finalization.

```
Internal Expert → External Validation → Refinement
Example:
- Product Manager (306) defines requirements
- Customer Success (320) validates with user perspective
- Product Manager refines
```

---

## Chain Selection Guide

### By Problem Type

| Problem Type | Recommended Chain |
|--------------|-------------------|
| Technical implementation | Architect → Developer → Security → QA |
| Business decision | Strategy → Finance → Legal → Operations |
| Product launch | Product → Design → Engineering → Marketing |
| AI project | AI Strategy → Data → ML Engineer → Ethics |
| Hiring decision | HR → Hiring Manager → Team Lead |
| Investment | VC → CFO → Legal |
| Crisis | Domain Expert → Legal → PR → Leadership |

### By Urgency

| Urgency | Chain Approach |
|---------|----------------|
| Critical (hours) | Parallel experts → Quick synthesis |
| High (days) | Sequential primary → Parallel review |
| Normal (weeks) | Full sequential with iterations |
| Low (months) | Comprehensive with external validation |

### By Complexity

| Complexity | Expert Count | Pattern |
|------------|--------------|---------|
| Simple | 1-2 | Single or sequential |
| Moderate | 3-4 | Sequential with review |
| Complex | 5-7 | Mixed sequential/parallel |
| Very Complex | 8+ | Multi-phase with synthesis |

---

## Chain Execution Best Practices

### 1. Clear Handoffs
Each expert should:
- Summarize their findings
- Identify open questions
- Suggest next expert focus

### 2. Context Preservation
Maintain context across the chain:
- Initial problem statement
- Constraints identified
- Decisions made
- Open questions

### 3. Synthesis Points
Add synthesis after parallel consultations:
- Identify agreements
- Resolve conflicts
- Create unified recommendation

### 4. Exit Criteria
Define when the chain is complete:
- All key questions answered
- Consensus reached
- Actionable plan created

---

## Example: Complete Chain Execution

### Scenario: "Launch a new SaaS product"

**Phase 1: Strategy**
```
User: "I want to launch a B2B SaaS for HR automation"

Strategy Consultant (303):
- Market analysis
- Competitive landscape
- Go-to-market strategy
```

**Phase 2: Product Definition**
```
Product Manager (306):
- Feature prioritization
- MVP scope
- User stories

UX Designer (201):
- User journey
- Wireframes
- Design system
```

**Phase 3: Technical Planning**
```
Systems Architect (128):
- Architecture design
- Tech stack recommendation
- Scalability plan

[Parallel]
- Backend Developer (103): API design
- Frontend Developer (102): UI architecture
- Database Expert (112): Data model
```

**Phase 4: Validation**
```
Security Expert (126):
- Security review
- Compliance check

CFO Advisor (312):
- Financial model
- Pricing strategy
```

**Phase 5: Launch**
```
DevOps Engineer (108):
- CI/CD setup
- Monitoring

Marketing Director (314):
- Launch campaign
- Content strategy
```

---

## Anti-Patterns to Avoid

### 1. Over-Chaining
**Problem**: Too many experts slow down decisions
**Solution**: Limit to essential experts; add more only if needed

### 2. Missing Synthesis
**Problem**: Parallel inputs never consolidated
**Solution**: Always add synthesis step after parallel consultation

### 3. Wrong Order
**Problem**: Technical details before strategy
**Solution**: Start with strategy, then design, then implementation

### 4. No Exit Criteria
**Problem**: Endless consultation loop
**Solution**: Define clear decision points and exit criteria

### 5. Ignoring Conflicts
**Problem**: Conflicting advice not addressed
**Solution**: Explicitly resolve conflicts before proceeding
