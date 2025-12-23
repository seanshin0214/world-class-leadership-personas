# Business & Strategy Experts - Deep Knowledge Base

## Strategy Consultant (303)

### Strategic Analysis Frameworks

**Porter's Five Forces**
```
┌─────────────────────────────────────────┐
│         Threat of New Entrants          │
│    (Barriers to entry, capital needs)   │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│                                         │
│  Supplier ◄────► Industry ◄────► Buyer  │
│   Power          Rivalry         Power  │
│                                         │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│        Threat of Substitutes            │
│   (Alternative products/services)       │
└─────────────────────────────────────────┘

Analysis Questions:
1. How easy is it for new competitors to enter?
2. How much power do suppliers have?
3. How much power do buyers have?
4. What substitutes exist?
5. How intense is competitive rivalry?
```

**SWOT Analysis Template**
```
┌─────────────────────┬─────────────────────┐
│     STRENGTHS       │    WEAKNESSES       │
│     (Internal+)     │    (Internal-)      │
├─────────────────────┼─────────────────────┤
│ • Core competencies │ • Resource gaps     │
│ • Unique resources  │ • Skill deficits    │
│ • Market position   │ • Process issues    │
│ • Brand strength    │ • Cost structure    │
├─────────────────────┼─────────────────────┤
│   OPPORTUNITIES     │      THREATS        │
│    (External+)      │    (External-)      │
├─────────────────────┼─────────────────────┤
│ • Market trends     │ • Competition       │
│ • Tech advances     │ • Regulation        │
│ • Customer needs    │ • Economic factors  │
│ • Partnerships      │ • Disruption        │
└─────────────────────┴─────────────────────┘
```

**Blue Ocean Strategy Canvas**
```
Factors:        Low ────────────────► High
                 1    2    3    4    5

Price           [Industry: 4] [Us: 2]
Quality         [Industry: 3] [Us: 5]
Service         [Industry: 3] [Us: 5]
Features        [Industry: 5] [Us: 3]
Convenience     [Industry: 2] [Us: 5]

Strategy: Eliminate (costly features)
          Reduce (price)
          Raise (service, quality)
          Create (convenience)
```

### Strategic Planning Process

**Vision-Strategy-Execution Framework**
```
VISION (10 years)
"Where do we want to be?"
↓
MISSION (Ongoing)
"Why do we exist?"
↓
STRATEGIC OBJECTIVES (3-5 years)
"What must we achieve?"
↓
INITIATIVES (1 year)
"How will we achieve it?"
↓
KPIs (Quarterly)
"How do we measure success?"
```

---

## CFO Advisor (312)

### Financial Analysis Frameworks

**Key Financial Metrics**
```
PROFITABILITY
- Gross Margin = (Revenue - COGS) / Revenue
- Operating Margin = Operating Income / Revenue
- Net Margin = Net Income / Revenue
- EBITDA Margin = EBITDA / Revenue

LIQUIDITY
- Current Ratio = Current Assets / Current Liabilities (Target: >1.5)
- Quick Ratio = (Current Assets - Inventory) / Current Liabilities (Target: >1.0)

EFFICIENCY
- Asset Turnover = Revenue / Total Assets
- Inventory Turnover = COGS / Average Inventory
- DSO = (Accounts Receivable / Revenue) × 365

LEVERAGE
- Debt-to-Equity = Total Debt / Total Equity
- Interest Coverage = EBIT / Interest Expense (Target: >3x)

GROWTH
- Revenue Growth Rate = (Current - Previous) / Previous
- CAC = Total Sales & Marketing / New Customers
- LTV = Average Revenue per Customer × Customer Lifetime
- LTV:CAC Ratio (Target: >3:1)
```

### Valuation Methods

**DCF (Discounted Cash Flow)**
```
Enterprise Value = Σ [FCF_t / (1 + WACC)^t] + Terminal Value

Where:
- FCF = Free Cash Flow
- WACC = Weighted Average Cost of Capital
- Terminal Value = FCF_n × (1 + g) / (WACC - g)
- g = Long-term growth rate (typically 2-3%)

WACC = (E/V × Re) + (D/V × Rd × (1-T))
- E = Market value of equity
- D = Market value of debt
- V = E + D
- Re = Cost of equity
- Rd = Cost of debt
- T = Tax rate
```

**Comparable Company Analysis**
```
Metric          Company A    Company B    Average    Our Company
Revenue         $100M        $150M        $125M      $80M
EV/Revenue      3.5x         4.0x         3.75x      ?
EV/EBITDA       12x          15x          13.5x      ?

Implied Valuation:
EV = $80M × 3.75x = $300M (Revenue multiple)
```

### SaaS Metrics
```
MRR = Monthly Recurring Revenue
ARR = MRR × 12

Net Revenue Retention = (Starting MRR + Expansion - Churn) / Starting MRR
Target: >120%

Magic Number = Net New ARR / Sales & Marketing Spend
Target: >0.75

Rule of 40 = Revenue Growth % + Profit Margin %
Target: >40%

Burn Multiple = Net Burn / Net New ARR
Target: <1.5x
```

---

## Product Manager (306) / Product Strategist (307/308)

### Product Strategy Frameworks

**RICE Prioritization**
```
RICE Score = (Reach × Impact × Confidence) / Effort

Reach: How many users affected per quarter?
Impact: How much will it move the metric? (0.25 to 3)
Confidence: How sure are we? (0-100%)
Effort: Person-months required

Example:
Feature A: (1000 × 2 × 80%) / 2 = 800
Feature B: (5000 × 0.5 × 90%) / 1 = 2250
→ Prioritize Feature B
```

**Jobs to Be Done**
```
When [situation],
I want to [motivation],
So I can [expected outcome].

Example:
"When I'm commuting to work,
I want to catch up on news,
So I can feel informed for morning meetings."

→ Design for: Quick consumption, offline access, key highlights
```

**Product-Market Fit Survey**
```
Question: "How would you feel if you could no longer use [product]?"

Responses:
- Very disappointed: [Target: >40%]
- Somewhat disappointed
- Not disappointed

PMF Score = % Very Disappointed
>40% = Product-Market Fit achieved
```

### PRD Template
```markdown
# Product Requirements Document

## Overview
### Problem Statement
What problem are we solving?

### Goals & Success Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Metric 1 | X | Y |

## User Stories
As a [user type],
I want to [action],
So that [benefit].

## Requirements
### Must Have (P0)
- [ ] Requirement 1
- [ ] Requirement 2

### Should Have (P1)
- [ ] Requirement 3

### Nice to Have (P2)
- [ ] Requirement 4

## Design
[Link to designs]

## Technical Considerations
[Architecture notes, dependencies]

## Timeline
| Milestone | Date |
|-----------|------|
| Design complete | MM/DD |
| Dev complete | MM/DD |
| Launch | MM/DD |

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | High | Plan |
```

---

## Marketing Director (314)

### Marketing Strategy Framework

**Marketing Funnel**
```
AWARENESS (TOFU - Top of Funnel)
├── Content marketing
├── Social media
├── SEO/SEM
├── PR
└── Influencer marketing

CONSIDERATION (MOFU - Middle of Funnel)
├── Email nurture
├── Webinars
├── Case studies
├── Comparison content
└── Retargeting

CONVERSION (BOFU - Bottom of Funnel)
├── Free trials
├── Demos
├── Proposals
├── Testimonials
└── ROI calculators

RETENTION & ADVOCACY
├── Onboarding
├── Customer success
├── Loyalty programs
├── Referral programs
└── Community building
```

### Campaign Planning Template
```markdown
## Campaign Overview
- Name: [Campaign Name]
- Objective: [Awareness/Leads/Sales]
- Target Audience: [Persona]
- Duration: [Start - End]
- Budget: [$X]

## Channels & Tactics
| Channel | Tactic | Budget | KPI |
|---------|--------|--------|-----|
| Paid Search | Google Ads | $X | CPC, Conv |
| Social | LinkedIn Ads | $X | CPL |
| Email | Nurture sequence | $X | Open, CTR |

## Content Needs
- [ ] Landing page
- [ ] Ad creative (3 variants)
- [ ] Email copy (5 emails)
- [ ] Social posts

## Success Metrics
- Impressions: X
- Clicks: X (CTR: X%)
- Leads: X (CPL: $X)
- Pipeline: $X
- Revenue: $X (ROAS: X:1)
```

### Marketing Metrics
```
ACQUISITION
- CAC (Customer Acquisition Cost) = Marketing Spend / New Customers
- CPL (Cost per Lead) = Marketing Spend / Leads Generated
- CPC (Cost per Click)
- CTR (Click-through Rate)

ENGAGEMENT
- Email Open Rate (Target: >20%)
- Email CTR (Target: >3%)
- Social Engagement Rate
- Time on Site

CONVERSION
- MQL to SQL Rate (Target: >25%)
- SQL to Opportunity Rate
- Win Rate
- Average Deal Size

RETENTION
- Customer Churn Rate
- Net Promoter Score (NPS)
- Customer Lifetime Value (LTV)
```

---

## Sales Coach (313)

### Sales Methodology: MEDDIC

```
MEDDIC Framework:

M - Metrics
   "What are the measurable goals this solution must achieve?"
   Example: "Reduce processing time by 50%"

E - Economic Buyer
   "Who has budget authority?"
   Identify the person who can approve the purchase

D - Decision Criteria
   "What factors will influence the decision?"
   Technical requirements, integration, support, price

D - Decision Process
   "What is the buying process?"
   Steps, timeline, stakeholders involved

I - Identify Pain
   "What problem are they trying to solve?"
   Current state, desired state, gap

C - Champion
   "Who will sell internally for you?"
   Find and enable your internal advocate
```

### Discovery Call Framework
```
SITUATION Questions (5 min)
- Tell me about your current process for X
- How long have you been doing it this way?
- How many people are involved?

PROBLEM Questions (10 min)
- What challenges are you facing with X?
- How often does this problem occur?
- What happens when it goes wrong?

IMPLICATION Questions (10 min)
- What's the impact on your team?
- How does this affect your goals?
- What's the cost of not solving this?

NEED-PAYOFF Questions (5 min)
- If you could solve this, what would that mean?
- How would success look?
- What would you be able to do differently?
```

### Objection Handling
```
Framework: LAER

L - Listen (fully, don't interrupt)
A - Acknowledge (validate their concern)
E - Explore (understand the real objection)
R - Respond (address with evidence)

Common Objections:

"Too expensive"
→ "I understand budget is important. Help me understand -
   compared to what? And when you think about the cost of
   [current problem], how does that factor in?"

"We're happy with current solution"
→ "That's great to hear. What made you take this meeting then?
   Often there's something that sparked interest..."

"Need to think about it"
→ "Of course. What specific aspects do you need to think through?
   I want to make sure you have all the information you need."

"Not the right time"
→ "When would be a better time? And what would need to change
   between now and then for this to become a priority?"
```

---

## Operations Manager (316)

### Process Improvement

**Lean Six Sigma DMAIC**
```
DEFINE
- Problem statement
- Project scope
- Voice of Customer
- Project charter

MEASURE
- Current process map
- Data collection plan
- Baseline metrics
- Measurement system analysis

ANALYZE
- Root cause analysis
- Data analysis
- Process analysis
- Identify improvement opportunities

IMPROVE
- Generate solutions
- Pilot solutions
- Implement changes
- Validate improvement

CONTROL
- Control plan
- Standard work
- Training
- Monitoring dashboard
```

**Process Mapping**
```
Current State (As-Is):
[Start] → [Step 1] → [Decision?] → [Step 2] → [End]
                         ↓ No
                    [Rework Loop]

Identify:
- Value-add steps (keep)
- Non-value-add but necessary (minimize)
- Waste (eliminate)

Future State (To-Be):
[Start] → [Optimized Step] → [End]

Metrics:
- Cycle time: Before vs After
- Error rate: Before vs After
- Cost: Before vs After
```

### Operational KPIs
```
EFFICIENCY
- Process cycle time
- Throughput rate
- Resource utilization
- First-pass yield

QUALITY
- Defect rate
- Customer complaints
- Rework percentage
- On-time delivery

COST
- Cost per unit
- Operating expenses
- Variance to budget
- Cost avoidance

PEOPLE
- Employee satisfaction
- Turnover rate
- Training completion
- Safety incidents
```

---

## Venture Capitalist (317)

### Investment Evaluation Framework

**Due Diligence Checklist**
```
MARKET (TAM/SAM/SOM)
- [ ] Market size validation
- [ ] Growth rate
- [ ] Market trends
- [ ] Competitive landscape

PRODUCT
- [ ] Product-market fit evidence
- [ ] Technology differentiation
- [ ] IP/moat
- [ ] Roadmap clarity

TEAM
- [ ] Founder background
- [ ] Domain expertise
- [ ] Execution track record
- [ ] Team completeness

TRACTION
- [ ] Revenue/growth metrics
- [ ] Customer validation
- [ ] Unit economics
- [ ] Retention/engagement

FINANCIALS
- [ ] Use of funds
- [ ] Path to profitability
- [ ] Capital efficiency
- [ ] Historical performance
```

**Investment Thesis Template**
```markdown
## Company: [Name]
## Stage: [Seed/Series A/B/C]
## Ask: [$X at $Y valuation]

### Why This Market?
- TAM: $X billion
- Growing at X% CAGR
- Tailwinds: [trends]

### Why This Team?
- Founder background
- Relevant experience
- Why they will win

### Why Now?
- Market timing
- Technology enablers
- Regulatory changes

### Investment Highlights
1. [Key strength 1]
2. [Key strength 2]
3. [Key strength 3]

### Key Risks
1. [Risk 1] - Mitigation: [plan]
2. [Risk 2] - Mitigation: [plan]

### Return Analysis
Entry: $X million at $Y valuation
Expected exit: $Z million in N years
Target return: Xx
```
