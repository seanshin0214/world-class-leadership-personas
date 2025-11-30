# Context Detection - Smart Expert Matching

## How Context Detection Works

### Overview

The system analyzes conversation context to suggest the most appropriate expert(s) for your needs. This document explains the detection logic and how to get the best expert matches.

---

## Keyword-Based Detection

### Engineering Keywords

| Keywords | Suggested Expert |
|----------|------------------|
| React, Next.js, frontend, component | Frontend Engineer (107), React Expert (102) |
| API, backend, server, database | Backend Engineer (106), Database Engineer (114) |
| Docker, Kubernetes, CI/CD, deploy | DevOps Engineer (110) |
| Security, auth, OWASP, vulnerability | Security Engineer (113) |
| Python, ML, model, training | Data Scientist (402), ML Engineer (401) |
| LLM, GPT, Claude, prompt, RAG | LLM Engineer (410), Prompt Engineer (408) |
| Test, QA, automation, Cypress | QA Lead (501), Test Automation Engineer (502) |
| Performance, load, latency, optimize | Performance Engineer (120), Performance Tester (503) |

### Business Keywords

| Keywords | Suggested Expert |
|----------|------------------|
| Strategy, market, competition | Strategy Consultant (301) |
| Product, roadmap, feature, prioritize | Product Manager (305) |
| Startup, funding, investor, pitch | VC Partner (310), Startup Advisor (313) |
| Revenue, P&L, forecast, budget | CFO (309), Financial Analyst (312) |
| Growth, acquisition, retention, funnel | Growth Manager (307) |
| Innovation, disrupt, new market | Innovation Director (302) |

### Design Keywords

| Keywords | Suggested Expert |
|----------|------------------|
| UX, user research, usability | UX Designer (201), UX Researcher (205) |
| UI, visual, design system | UI Designer (202) |
| Brand, logo, identity | Brand Designer (207) |
| Animation, motion, interaction | Interaction Designer (204) |
| Accessibility, WCAG, a11y | Accessibility Tester (507) |

### Leadership Keywords

| Keywords | Suggested Expert |
|----------|------------------|
| Team, leadership, culture | Leadership Coach (801) |
| Executive, C-level, board | Executive Coach (802) |
| Negotiation, deal, contract | Negotiation Expert (903), Legal Advisor (901) |
| Conflict, communication, feedback | Team Coach (803) |

---

## Intent-Based Detection

### Problem Types → Expert Mapping

```
"I have a bug in..."
└── Fullstack Developer (101) or relevant specialist

"How do I design..."
└── UX Designer (201) + UI Designer (202)

"Help me decide..."
└── Strategy Consultant (301) or relevant domain expert

"I need to hire..."
└── HR Director (317) + Leadership Coach (801)

"Is this secure..."
└── Security Engineer (113)

"How should I test..."
└── QA Lead (501) + relevant specialist

"Analyze this data..."
└── Data Scientist (402)

"Review this architecture..."
└── Solution Architect (108)

"Improve performance of..."
└── Performance Engineer (120)

"I'm presenting to..."
└── Executive Coach (802) + Pitch Coach (315)
```

---

## Multi-Expert Detection

### Scenarios Requiring Multiple Experts

```
SCENARIO: "Building a new feature"
SUGGESTED CHAIN:
├── Product Manager (305): Define requirements
├── UX Designer (201): Design experience
├── Frontend Engineer (107): Implement
└── QA Lead (501): Test

SCENARIO: "Launching a startup"
SUGGESTED CHAIN:
├── Startup Advisor (313): Strategy
├── Product Manager (305): Product
├── CFO (309): Finance
└── Legal Advisor (901): Legal structure

SCENARIO: "Scaling infrastructure"
SUGGESTED CHAIN:
├── Solution Architect (108): Architecture
├── DevOps Engineer (110): Infrastructure
├── Security Engineer (113): Security
└── SRE (111): Reliability

SCENARIO: "AI/ML product launch"
SUGGESTED CHAIN:
├── AI Product Manager (411): Strategy
├── LLM Engineer (410): Implementation
├── MLOps Engineer (406): Deployment
└── Security Engineer (113): AI security
```

---

## Confidence Levels

### High Confidence (Direct Match)

```
User: "Review my React component"
Detection: React Expert (102)
Confidence: HIGH
Reason: Direct technology mention
```

### Medium Confidence (Domain Match)

```
User: "Help me with my frontend"
Detection: Frontend Engineer (107), React Expert (102), Vue Specialist (103)
Confidence: MEDIUM
Reason: Domain match, multiple specialists possible

Response: "What technology stack are you using?"
```

### Low Confidence (Broad Query)

```
User: "I need help with my app"
Detection: Multiple possibilities
Confidence: LOW
Reason: Insufficient context

Response: "Could you describe:
1. What type of app (web/mobile/backend)?
2. What specific challenge?
3. What technology stack?"
```

---

## Improving Detection Accuracy

### Be Specific

```
VAGUE: "Help with my code"
BETTER: "Help with Python FastAPI authentication"
→ Backend Engineer (106) + Security Engineer (113)

VAGUE: "Design advice"
BETTER: "UX design for e-commerce checkout flow"
→ UX Designer (201) + Interaction Designer (204)

VAGUE: "Business question"
BETTER: "Should we acquire this competitor?"
→ Strategy Consultant (301) → CFO (309) → Legal Advisor (901)
```

### Include Context

```
MINIMAL: "Python help"
BETTER: "I'm building a machine learning pipeline in Python
        and need help with feature engineering"
→ Data Scientist (402) + ML Engineer (401)

MINIMAL: "Database question"
BETTER: "PostgreSQL query optimization for a table
        with 100M rows, getting slow reads"
→ Database Engineer (114) + Performance Engineer (120)
```

### State Your Goal

```
TASK-FOCUSED: "Write a test"
GOAL-FOCUSED: "Ensure my payment flow is reliable and secure"
→ QA Lead (501) + Security Tester (504) + API Tester (506)

TASK-FOCUSED: "Make a chart"
GOAL-FOCUSED: "Visualize revenue trends for board presentation"
→ Data Scientist (402) + Executive Coach (802)
```

---

## Manual Expert Selection

### Direct Activation

```
@strategic-oracle
@fullstack-developer
@ux-designer
@cfo
```

### Domain Request

```
"I need an engineering expert for..."
"Connect me with a business strategist"
"I want to talk to a design expert"
```

### Chain Request

```
"Chain strategy-consultant and cfo"
"Run product-manager then ux-designer then frontend-engineer"
"Parallel: security-engineer and legal-advisor"
```

---

## Expert Activation

The system will automatically suggest experts based on your query. For best results:

1. Describe your challenge clearly
2. Include relevant technology/domain
3. State your goal or desired outcome
4. Mention any constraints

Example:
```
"I'm building a B2B SaaS product. We have React frontend,
Node.js backend, PostgreSQL database. Currently 10k users,
growing 20% monthly. Need help with scaling architecture
while maintaining security compliance for enterprise customers."

→ Suggested: Solution Architect (108) → Security Engineer (113)
             → DevOps Engineer (110) → Database Engineer (114)
```
