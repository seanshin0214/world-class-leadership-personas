# Expert Chaining Patterns

## Overview

Expert chaining enables complex problem-solving by combining multiple experts sequentially or in parallel. This document provides proven patterns for effective expert collaboration.

---

## Basic Chaining Patterns

### Sequential Chain

```
PATTERN: Expert A → Expert B → Expert C
USE WHEN: Each expert builds on previous output

EXAMPLE: Product Launch
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Product    │    │     UX       │    │   Frontend   │
│   Manager    │ → │   Designer   │ → │   Engineer   │
│              │    │              │    │              │
│  Define PRD  │    │  Design UI   │    │  Implement   │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Parallel Chain

```
PATTERN: [Expert A, Expert B] → Synthesizer
USE WHEN: Need multiple perspectives simultaneously

EXAMPLE: Risk Assessment
┌──────────────┐
│   Security   │─────┐
│   Engineer   │     │    ┌──────────────┐
└──────────────┘     ├──→ │   Strategy   │
┌──────────────┐     │    │  Consultant  │
│    Legal     │─────┘    │              │
│   Advisor    │          │  Synthesize  │
└──────────────┘          └──────────────┘
```

### Review Chain

```
PATTERN: Creator → Reviewer → Creator (iterate)
USE WHEN: Need quality assurance or validation

EXAMPLE: Code Development
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Backend    │    │   Security   │    │   Backend    │
│   Engineer   │ → │   Engineer   │ → │   Engineer   │
│              │    │              │    │              │
│  Write code  │    │   Review     │    │    Fix       │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## Domain-Specific Chains

### Strategic Decision Making

```
Chain: strategy-consultant → cfo → legal-advisor → ceo-mentor

SCENARIO: Major acquisition decision

STEP 1: Strategy Consultant (301)
├── Market analysis
├── Strategic fit assessment
├── Synergy identification
└── Output: Strategic recommendation

STEP 2: CFO (309)
├── Financial modeling
├── Valuation analysis
├── ROI projection
└── Output: Financial assessment

STEP 3: Legal Advisor (901)
├── Due diligence requirements
├── Regulatory considerations
├── Contract structure
└── Output: Legal framework

STEP 4: CEO Mentor (805)
├── Board presentation strategy
├── Stakeholder management
├── Integration leadership
└── Output: Executive action plan
```

### Technical Architecture Review

```
Chain: solution-architect → security-engineer → devops-engineer → performance-engineer

SCENARIO: New system design review

STEP 1: Solution Architect (108)
├── Architecture review
├── Pattern assessment
├── Scalability analysis
└── Output: Architecture approval/concerns

STEP 2: Security Engineer (113)
├── Threat modeling
├── Security requirements
├── Compliance check
└── Output: Security sign-off

STEP 3: DevOps Engineer (110)
├── Deployment strategy
├── CI/CD requirements
├── Infrastructure planning
└── Output: Operational readiness

STEP 4: Performance Engineer (120)
├── Load requirements
├── Bottleneck identification
├── Optimization recommendations
└── Output: Performance baseline
```

### Product Development

```
Chain: product-manager → ux-designer → frontend-engineer → qa-lead

SCENARIO: New feature development

STEP 1: Product Manager (305)
├── PRD creation
├── User stories
├── Success metrics
└── Output: Feature specification

STEP 2: UX Designer (201)
├── User research synthesis
├── Wireframes
├── Prototype
└── Output: Design specification

STEP 3: Frontend Engineer (107)
├── Technical feasibility
├── Implementation plan
├── Component design
└── Output: Technical specification

STEP 4: QA Lead (501)
├── Test strategy
├── Acceptance criteria
├── Test plan
└── Output: Quality assurance plan
```

---

## Crisis Response Chains

### Security Incident

```
Chain: security-engineer → devops-engineer → legal-advisor → leadership-coach

TIMELINE: Immediate response (0-4 hours)

STEP 1: Security Engineer (IMMEDIATE)
├── Incident assessment
├── Containment actions
├── Evidence preservation
└── Output: Incident report

STEP 2: DevOps Engineer (HOUR 1)
├── System isolation
├── Log collection
├── Service restoration plan
└── Output: Technical response

STEP 3: Legal Advisor (HOUR 2)
├── Notification requirements
├── Regulatory obligations
├── Communication approval
└── Output: Legal guidance

STEP 4: Leadership Coach (HOUR 4)
├── Stakeholder communication
├── Team support
├── Post-incident culture
└── Output: Leadership response
```

### Business Crisis

```
Chain: strategy-consultant → cfo → legal-advisor → executive-coach

SCENARIO: Major customer loss or market disruption

STEP 1: Strategy Consultant
├── Situation analysis
├── Competitive response
├── Strategic options
└── Output: Response strategy

STEP 2: CFO
├── Financial impact
├── Cash flow projection
├── Cost reduction options
└── Output: Financial plan

STEP 3: Legal Advisor
├── Contractual obligations
├── Risk mitigation
├── Communication review
└── Output: Legal protection

STEP 4: Executive Coach
├── Leadership presence
├── Team communication
├── Stakeholder management
└── Output: Leadership plan
```

---

## Innovation Chains

### New Product Development

```
Chain: innovation-director → data-scientist → product-manager → ux-designer

SCENARIO: Data-driven product innovation

STEP 1: Innovation Director (302)
├── Market opportunity
├── Innovation thesis
├── Strategic alignment
└── Output: Innovation brief

STEP 2: Data Scientist (402)
├── Data feasibility
├── ML capabilities
├── Technical requirements
└── Output: Technical feasibility

STEP 3: Product Manager (305)
├── Product strategy
├── MVP definition
├── Go-to-market
└── Output: Product plan

STEP 4: UX Designer (201)
├── User research
├── Experience design
├── Prototype
└── Output: Design specification
```

### AI/ML Project

```
Chain: ai-product-manager → llm-engineer → mlops-engineer → security-engineer

SCENARIO: Deploy AI feature to production

STEP 1: AI Product Manager (411)
├── Use case definition
├── Success metrics
├── Risk assessment
└── Output: AI product spec

STEP 2: LLM Engineer (410)
├── Model selection
├── Prompt engineering
├── Evaluation framework
└── Output: AI implementation

STEP 3: MLOps Engineer (406)
├── Deployment pipeline
├── Monitoring setup
├── Scaling strategy
└── Output: Production readiness

STEP 4: Security Engineer (113)
├── AI security review
├── Data protection
├── Prompt injection prevention
└── Output: Security approval
```

---

## How to Request Chains

### Simple Request
```
"Chain strategy-consultant and cfo for M&A analysis"
```

### Detailed Request
```
"I need a chain for product launch:
1. Product Manager: Define requirements
2. UX Designer: Create designs
3. Frontend Engineer: Review feasibility
4. QA Lead: Plan testing

Context: [Your situation]"
```

### Parallel Request
```
"Run security-engineer and legal-advisor in parallel
to assess compliance, then synthesize with strategy-consultant"
```

---

## Expert Activation

Describe your scenario and preferred chain:
```
"I need [outcome] for [situation].
Suggest and execute the best expert chain."
```
