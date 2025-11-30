# Context Detection - Smart Expert Matching

## How Context Detection Works

### Overview
The system analyzes conversation context to suggest the most appropriate expert(s) for your needs. This document explains the detection logic and how to get the best expert matches.

---

## Keyword-Based Detection

### Engineering Keywords
```
FULLSTACK DEVELOPER (101)
Triggers: fullstack, full-stack, end-to-end, MERN, MEAN, web app
Context: Building complete applications

REACT EXPERT (102)
Triggers: React, Redux, Next.js, hooks, components, JSX, virtual DOM
Context: Frontend development with React ecosystem

DEVOPS ENGINEER (108/109)
Triggers: CI/CD, pipeline, Jenkins, GitHub Actions, deployment, Docker, Kubernetes
Context: Infrastructure and deployment automation

SECURITY EXPERT (126/127)
Triggers: security, OWASP, vulnerability, penetration, authentication, encryption
Context: Application and infrastructure security

SYSTEMS ARCHITECT (128/129)
Triggers: architecture, scalability, microservices, design patterns, distributed
Context: System design and technical planning
```

### Business Keywords
```
STRATEGY CONSULTANT (303)
Triggers: strategy, competitive analysis, market entry, positioning, strategic
Context: Business strategy and planning

CFO ADVISOR (312)
Triggers: financial, budget, ROI, revenue, P&L, funding, valuation, cash flow
Context: Financial decisions and analysis

PRODUCT MANAGER (306)
Triggers: roadmap, prioritization, feature, user story, backlog, sprint
Context: Product development and management

MARKETING DIRECTOR (314)
Triggers: marketing, campaign, brand, SEO, content, leads, conversion
Context: Marketing strategy and execution

SALES COACH (313)
Triggers: sales, pipeline, quota, closing, negotiation, objection handling
Context: Sales strategy and techniques
```

### AI/ML Keywords
```
LLM ENGINEER (410)
Triggers: LLM, GPT, Claude, prompt engineering, fine-tuning, RAG
Context: Large language model development

DATA SCIENTIST (401)
Triggers: machine learning, model, prediction, classification, regression
Context: ML model development and analysis

AI ETHICS (404)
Triggers: AI ethics, bias, fairness, responsible AI, governance
Context: Ethical AI development and deployment

AI AGENT DEVELOPER (411)
Triggers: agent, autonomous, LangChain, tool use, multi-agent
Context: AI agent development
```

---

## Intent-Based Detection

### Problem-Solving Intents
```
DEBUGGING/TROUBLESHOOTING
"I have an error..." → Relevant domain expert
"Something is broken..." → Systems + domain expert
"Not working as expected..." → QA + domain expert

PLANNING/DESIGN
"How should I architect..." → Systems Architect (128)
"What's the best approach..." → Strategy Consultant (303)
"Help me plan..." → Product Manager (306)

REVIEW/OPTIMIZATION
"Can you review my code..." → Security Expert (126) + domain
"How can I improve..." → Relevant domain expert
"Optimize this..." → Performance-focused expert

LEARNING/EXPLANATION
"Explain how..." → Educator (600s) or domain expert
"What is..." → Relevant domain expert
"Why does..." → Domain expert + theory focus
```

### Action-Based Intents
```
BUILD/CREATE
"Build a..." → Engineering experts
"Create a..." → Design or Engineering
"Develop..." → Engineering experts

ANALYZE/EVALUATE
"Analyze this..." → Data Scientist (401) or domain
"Evaluate..." → CFO (312) or domain
"Compare..." → Strategy (303) or domain

DECIDE/CHOOSE
"Should I..." → Strategy (303) or CFO (312)
"Which option..." → Domain expert
"Help me decide..." → Multiple experts recommended

COMMUNICATE/PRESENT
"Write a..." → Creative Writer (206) or domain
"Present to..." → Leadership Coach (801)
"Pitch..." → Sales Coach (313)
```

---

## Domain Detection Patterns

### Technology Domain
```
FRONTEND
Patterns: UI, interface, React, Vue, CSS, responsive, browser
Expert: React Expert (102), Vue Specialist (103), UX Designer (201)

BACKEND
Patterns: API, server, database, endpoint, REST, GraphQL
Expert: Backend expertise, API Architect (117)

INFRASTRUCTURE
Patterns: deploy, server, cloud, AWS, Azure, GCP, scaling
Expert: DevOps (108), Systems Architect (128)

DATA
Patterns: database, SQL, analytics, warehouse, pipeline
Expert: Data Engineer (106), Database Expert (112)
```

### Business Domain
```
FINANCE
Patterns: budget, revenue, cost, investment, ROI, profit
Expert: CFO Advisor (312), Accountant (318)

MARKETING
Patterns: brand, campaign, leads, conversion, SEO, content
Expert: Marketing Director (314), Brand Strategist (321)

OPERATIONS
Patterns: process, efficiency, workflow, optimization, lean
Expert: Operations Manager (316)

PEOPLE
Patterns: hiring, culture, team, performance, feedback
Expert: HR Consultant (315), Leadership Coach (801)
```

---

## Multi-Expert Scenarios

### When Multiple Experts Are Recommended

```
SCENARIO: "Help me launch a new product"

DETECTED NEEDS:
├── Product strategy → Product Manager (306)
├── Technical implementation → Systems Architect (128)
├── Market positioning → Marketing Director (314)
├── Financial planning → CFO Advisor (312)
└── Legal review → Legal Advisor (901)

RECOMMENDATION:
Primary: Product Manager (306)
Chain: PM → Architect → Marketing → CFO
```

```
SCENARIO: "Review my startup pitch deck"

DETECTED NEEDS:
├── Content strategy → Content Strategist (218)
├── Financial model → CFO Advisor (312)
├── Investor perspective → Venture Capitalist (317)
└── Presentation → Business Storyteller (333)

RECOMMENDATION:
Primary: Venture Capitalist (317)
Support: CFO Advisor (312)
```

```
SCENARIO: "My API is slow and unreliable"

DETECTED NEEDS:
├── Performance analysis → Systems Architect (128)
├── Database optimization → Database Expert (112)
├── Caching strategy → Redis Expert (121)
└── Monitoring → DevOps Engineer (108)

RECOMMENDATION:
Primary: Systems Architect (128)
Chain: Architect → Database → DevOps
```

---

## Confidence Scoring

### How Matches Are Scored
```
SCORING FACTORS:

KEYWORD MATCH (40%)
- Exact keyword matches
- Related term matches
- Domain terminology

INTENT MATCH (30%)
- Action type alignment
- Problem type alignment
- Goal alignment

CONTEXT FIT (20%)
- Industry relevance
- Complexity level
- Scope appropriateness

HISTORY (10%)
- Previous successful matches
- User preferences
- Conversation continuity

SCORE INTERPRETATION:
90-100%: Perfect match, high confidence
70-89%:  Good match, likely appropriate
50-69%:  Possible match, consider alternatives
<50%:    Low confidence, ask for clarification
```

---

## Manual Override

### How to Specify Experts Directly

```
DIRECT CALL BY NAME:
"@security-expert" → Security Expert (126)
"Call the CFO" → CFO Advisor (312)
"I need the strategy consultant" → Strategy Consultant (303)

DIRECT CALL BY ID:
"@128" → Systems Architect
"Expert 312" → CFO Advisor
"Use persona 410" → LLM Engineer

CATEGORY CALL:
"Engineering expert" → Shows 100s options
"Business expert" → Shows 300s options
"Any AI expert" → Shows 400s options

CHAIN REQUEST:
"Chain: architect → security → devops"
"First product manager, then marketing"
"Sequential: 303, 312, 901"
```

---

## Improving Detection Accuracy

### Tips for Better Matches

```
BE SPECIFIC:
✗ "Help with my code"
✓ "Help optimize my React component's rendering performance"

INCLUDE CONTEXT:
✗ "Review this"
✓ "Review this API design for a high-traffic e-commerce platform"

STATE YOUR GOAL:
✗ "I have a question about marketing"
✓ "I need to create a go-to-market strategy for a B2B SaaS product"

MENTION CONSTRAINTS:
✗ "Build me an app"
✓ "Build a mobile app with limited budget and 3-month timeline"
```

### Feedback Loop
```
CORRECT MISMATCHES:
"Actually, I need more of a [X] perspective"
"Can you switch to the [Y] expert?"
"This is more of a [Z] question"

The system learns from:
- Explicit corrections
- Follow-up expert changes
- Conversation outcomes
```
