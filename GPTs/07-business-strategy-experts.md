# Business & Strategy Experts - Deep Knowledge Base

## Strategy Consultant (301)

### Strategic Analysis Frameworks

**Porter's Five Forces:**
```
┌─────────────────────────────────────────┐
│         Threat of New Entrants          │
│    (Barriers, capital, regulations)     │
└─────────────────────────────────────────┘
                    ↓
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Supplier │ → │ Industry │ ← │  Buyer   │
│  Power   │    │ Rivalry  │    │  Power   │
└──────────┘    └──────────┘    └──────────┘
                    ↑
┌─────────────────────────────────────────┐
│       Threat of Substitutes             │
│  (Alternative products/services)        │
└─────────────────────────────────────────┘
```

**McKinsey 7S Framework:**
```
           ┌───────────┐
           │  SHARED   │
           │  VALUES   │
           └─────┬─────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───┴───┐   ┌───┴───┐   ┌───┴───┐
│STRATEGY│   │STRUCTURE│  │SYSTEMS│
└───┬───┘   └───┬───┘   └───┬───┘
    │           │           │
    └────────────┼────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───┴───┐   ┌───┴───┐   ┌───┴───┐
│ STYLE │   │ STAFF │   │SKILLS │
└───────┘   └───────┘   └───────┘
```

### Strategic Planning Process

**10-Step Strategy Development:**
1. **Vision Setting:** Where do we want to be in 10 years?
2. **Current State Analysis:** Honest assessment of position
3. **External Analysis:** PESTEL + Porter's Five Forces
4. **Internal Analysis:** Value chain, capabilities, resources
5. **Strategic Options:** Brainstorm alternatives
6. **Evaluation:** Suitability, feasibility, acceptability
7. **Selection:** Choose optimal strategy
8. **Cascade:** Break down into business unit strategies
9. **Implementation:** Action plans, KPIs, governance
10. **Review:** Quarterly strategy reviews

### BCG Growth-Share Matrix

```
                    HIGH Market Share    LOW Market Share
HIGH Growth Rate   ┌────────────────────┬────────────────────┐
                   │       STAR         │     QUESTION       │
                   │   (Invest)         │      MARK          │
                   │   High cash flow   │   (Analyze)        │
                   │   High investment  │   Cash drain       │
                   ├────────────────────┼────────────────────┤
LOW Growth Rate    │       CASH         │       DOG          │
                   │       COW          │    (Divest)        │
                   │   (Harvest)        │   Low return       │
                   │   Cash generator   │   Exit             │
                   └────────────────────┴────────────────────┘
```

---

## Product Manager (305)

### Product Strategy Framework

**Product Vision Template:**
```
FOR [target customer]
WHO [statement of need]
THE [product name] IS A [product category]
THAT [key benefit]
UNLIKE [primary competitive alternative]
OUR PRODUCT [statement of primary differentiation]
```

**Prioritization Frameworks:**

| Framework | Best For | Formula |
|-----------|----------|---------|
| RICE | Feature prioritization | (Reach × Impact × Confidence) / Effort |
| ICE | Quick decisions | Impact × Confidence × Ease |
| MoSCoW | Release planning | Must/Should/Could/Won't |
| Kano | Customer satisfaction | Must-be/One-dimensional/Attractive |
| Value vs. Effort | Simple comparison | 2×2 matrix |

**RICE Scoring Example:**
```python
def calculate_rice(reach: int, impact: float,
                   confidence: float, effort: int) -> float:
    """
    Calculate RICE score for feature prioritization.

    Args:
        reach: Number of users/quarter affected
        impact: 0.25 (minimal) to 3 (massive)
        confidence: 0-100% certainty
        effort: Person-months required

    Returns:
        RICE score
    """
    return (reach * impact * confidence) / effort

# Example
features = [
    {"name": "Dark Mode", "reach": 5000, "impact": 1, "confidence": 0.8, "effort": 2},
    {"name": "API v2", "reach": 1000, "impact": 3, "confidence": 0.9, "effort": 6},
    {"name": "Mobile App", "reach": 10000, "impact": 2, "confidence": 0.5, "effort": 12},
]

for f in features:
    f["score"] = calculate_rice(f["reach"], f["impact"], f["confidence"], f["effort"])

# Sort by RICE score
sorted_features = sorted(features, key=lambda x: x["score"], reverse=True)
```

### Product Requirements Document (PRD) Template

```markdown
# [Feature Name] PRD

## Problem Statement
What problem are we solving? Who has this problem?

## Goals & Success Metrics
- Primary Metric: [e.g., 20% increase in activation]
- Secondary Metrics: [e.g., NPS improvement]
- Counter-metrics: [e.g., no increase in support tickets]

## User Stories
AS A [user type]
I WANT [capability]
SO THAT [benefit]

## Requirements
### Must Have (P0)
- Requirement 1
- Requirement 2

### Should Have (P1)
- Requirement 3

### Nice to Have (P2)
- Requirement 4

## Non-Functional Requirements
- Performance: Page load < 2s
- Accessibility: WCAG 2.1 AA
- Security: SOC 2 compliance

## Timeline
- Design: Week 1-2
- Development: Week 3-6
- Testing: Week 7
- Launch: Week 8

## Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ... | ... | ... | ... |
```

---

## CFO (309)

### Financial Analysis Frameworks

**DuPont Analysis:**
```
ROE = Net Profit Margin × Asset Turnover × Equity Multiplier

ROE = (Net Income/Sales) × (Sales/Assets) × (Assets/Equity)
```

**DCF Valuation Model:**
```python
def dcf_valuation(fcf_projections: list[float],
                  terminal_growth: float,
                  wacc: float) -> float:
    """
    Discounted Cash Flow valuation.

    Args:
        fcf_projections: Free cash flows for projection period
        terminal_growth: Long-term growth rate (typically 2-3%)
        wacc: Weighted average cost of capital

    Returns:
        Enterprise value
    """
    # Present value of projection period
    pv_fcf = sum(
        fcf / (1 + wacc) ** (i + 1)
        for i, fcf in enumerate(fcf_projections)
    )

    # Terminal value (Gordon Growth Model)
    terminal_fcf = fcf_projections[-1] * (1 + terminal_growth)
    terminal_value = terminal_fcf / (wacc - terminal_growth)

    # Present value of terminal value
    years = len(fcf_projections)
    pv_terminal = terminal_value / (1 + wacc) ** years

    return pv_fcf + pv_terminal
```

### Key Financial Ratios

| Category | Ratio | Formula | Benchmark |
|----------|-------|---------|-----------|
| Liquidity | Current Ratio | Current Assets / Current Liabilities | >1.5 |
| Liquidity | Quick Ratio | (Current Assets - Inventory) / Current Liabilities | >1.0 |
| Profitability | Gross Margin | (Revenue - COGS) / Revenue | Industry varies |
| Profitability | Net Margin | Net Income / Revenue | >10% good |
| Efficiency | Asset Turnover | Revenue / Total Assets | Higher better |
| Leverage | Debt/Equity | Total Debt / Total Equity | <2.0 |
| Leverage | Interest Coverage | EBIT / Interest Expense | >3.0 |

---

## VC Partner (310)

### Investment Criteria

**Due Diligence Checklist:**
```markdown
## Market Analysis
- [ ] TAM/SAM/SOM analysis
- [ ] Market growth rate
- [ ] Competitive landscape
- [ ] Regulatory environment

## Team Assessment
- [ ] Founder background check
- [ ] Team completeness
- [ ] Domain expertise
- [ ] Reference checks

## Product/Technology
- [ ] Product demo
- [ ] Technical architecture review
- [ ] IP assessment
- [ ] Moat analysis

## Financial Review
- [ ] Historical financials
- [ ] Unit economics (CAC, LTV, payback)
- [ ] Burn rate and runway
- [ ] Revenue model validation

## Legal
- [ ] Cap table review
- [ ] Outstanding litigation
- [ ] IP ownership
- [ ] Key contracts
```

**Startup Valuation Methods:**

| Stage | Method | Typical Range |
|-------|--------|---------------|
| Pre-seed | Berkus/Scorecard | $500K - $2M |
| Seed | Comparables | $2M - $10M |
| Series A | DCF + Comparables | $10M - $50M |
| Growth | Revenue Multiple | Based on ARR |

---

## Expert Activation

```
@strategy-consultant
@product-manager
@cfo
@vc-partner
@innovation-director
```
or describe your business challenge
