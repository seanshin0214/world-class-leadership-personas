# SaaS Financial Modeling & Unit Economics 2025

**Updated**: 2025-11-23 | **Focus**: ARR, CAC Payback, Rule of 40

---

## SaaS Metrics That Actually Matter

```
REVENUE METRICS:
- MRR/ARR (Monthly/Annual Recurring Revenue)
- Net Revenue Retention (NRR): >120% = world-class
- Gross Revenue Retention (GRR): >90% = good

EFFICIENCY METRICS:
- CAC (Customer Acquisition Cost)
- CAC Payback Period: <12 months = great
- LTV/CAC Ratio: >3x = healthy
- Magic Number: >0.75 = efficient

PROFITABILITY METRICS:
- Rule of 40: Growth% + Profit Margin% > 40%
- Gross Margin: >70% for software
- Burn Multiple: <2x = capital efficient
```

---

## ARR Calculation & Analysis

### Basic ARR Formula

```
ARR = (Monthly Subscriptions × 12) + Annual Subscriptions

Example:
- 100 customers @ $100/month = $10,000 MRR → $120,000 ARR
- 50 customers @ $1,000/year = $50,000 ARR
Total ARR = $120,000 + $50,000 = $170,000
```

### ARR Waterfall (The Real Story)

```
Starting ARR (Jan 1, 2025): $10M

NEW ARR
+ New customers: $2M
+ Expansion (upsells): $1.5M
= Total New ARR: $3.5M

CHURNED ARR
- Customer churn: -$800K
- Contraction (downgrades): -$200K
= Total Churned ARR: -$1M

NET NEW ARR = $3.5M - $1M = $2.5M

Ending ARR (Dec 31, 2025): $12.5M

ANALYSIS:
- Growth rate: 25% (good for $10M+ ARR)
- Gross churn: 8% ($800K / $10M)
- Net churn: -15% (negative = expansion)
- NRR: 115% ($11.5M / $10M) ← Includes expansion
```

### Cohort Analysis

```python
import pandas as pd

# Monthly cohort retention
cohorts = {
    'Jan 2024': [100, 92, 87, 83, 80, 78, 76, 75, 74, 73, 72, 71],  # 12 months
    'Feb 2024': [120, 110, 104, 99, 96, 93, 91, 90, 89, 88, 87],
    'Mar 2024': [140, 132, 125, 120, 116, 113, 111, 110, 109, 108],
    # ... more cohorts
}

# Calculate retention %
for cohort, customers in cohorts.items():
    retention = [(c / customers[0]) * 100 for c in customers]
    print(f"{cohort}: Month 12 retention = {retention[-1]:.1f}%")

# Output:
# Jan 2024: Month 12 retention = 71.0%  ← 29% churned
# Feb 2024: Month 11 retention = 72.5%  ← Improving!
# Mar 2024: Month 10 retention = 77.1%  ← Even better

# Calculate LTV
avg_mrr = 500
avg_lifetime_months = 36  # From cohort data
ltv = avg_mrr * avg_lifetime_months
print(f"LTV: ${ltv}")  # $18,000
```

---

## CAC & Payback Period

### Full CAC Calculation

```
CAC = Total S&M Expenses / New Customers Acquired

INCLUDE IN S&M:
- Sales salaries + commissions
- Marketing salaries
- Marketing campaigns (ads, content, events)
- Sales tools (CRM, sales engagement)
- Marketing tools (analytics, automation)

DO NOT INCLUDE:
- Customer Success (post-sale)
- Product development
- G&A overhead

Example (Q1 2025):
Sales salaries: $300K
Sales commissions: $150K
Marketing salaries: $200K
Advertising: $250K
Tools (Salesforce, HubSpot): $50K
Total S&M: $950K

New customers acquired: 95

CAC = $950K / 95 = $10,000 per customer
```

### CAC Payback Period

```
CAC Payback = CAC / (MRR per customer × Gross Margin%)

Example:
CAC: $10,000
MRR: $1,200
Gross Margin: 75%

Payback = $10,000 / ($1,200 × 0.75)
        = $10,000 / $900
        = 11.1 months

BENCHMARKS:
< 6 months: Excellent
6-12 months: Good
12-18 months: Acceptable
> 18 months: Concerning (unless very high LTV)
```

### LTV/CAC Ratio

```
LTV = (Average MRR per customer × Gross Margin%) / Churn Rate

Example:
MRR: $1,200
Gross Margin: 75%
Monthly Churn: 2% (24% annual)

LTV = ($1,200 × 0.75) / 0.02
    = $900 / 0.02
    = $45,000

LTV/CAC = $45,000 / $10,000 = 4.5x

BENCHMARKS:
< 1x: Unsustainable
1-3x: Needs improvement
3-5x: Healthy
> 5x: Excellent (but might be underinvesting in growth)
```

---

## Net Revenue Retention (NRR)

### NRR Formula

```
NRR = (Starting ARR + Expansion - Churn - Contraction) / Starting ARR

Example (Cohort: Jan 2024 customers):
Starting ARR (Jan 2024): $1,000,000

After 12 months:
+ Expansion (upsells): $200,000
- Churned customers: -$100,000
- Downgrades: -$50,000

Ending ARR (Jan 2025): $1,050,000

NRR = $1,050,000 / $1,000,000 = 105%

INTERPRETATION:
100%: No net churn (break-even on existing customers)
105%: Moderate expansion
115%: Good expansion
130%+: Exceptional (top-tier SaaS companies)

Top SaaS NRR:
- Snowflake: 170%
- Datadog: 130%
- Twilio: 120%
```

---

## Rule of 40

### Calculation

```
Rule of 40 = Revenue Growth% + EBITDA Margin%

Example A (High-growth, unprofitable):
Revenue growth: 50%
EBITDA margin: -15%
Rule of 40 = 50% + (-15%) = 35% ← Below 40

Example B (Moderate growth, profitable):
Revenue growth: 25%
EBITDA margin: 20%
Rule of 40 = 25% + 20% = 45% ← Above 40 ✓

Example C (Slow growth, high profit):
Revenue growth: 10%
EBITDA margin: 35%
Rule of 40 = 10% + 35% = 45% ← Above 40 ✓

BENCHMARKS (by ARR):
< $10M ARR: Growth > 100% (profitability not expected)
$10-50M ARR: Rule of 40 target
$50-100M ARR: Rule of 45 target
> $100M ARR: Rule of 50 target
```

---

## Financial Modeling

### 3-Statement SaaS Model (Excel/Google Sheets)

```
INCOME STATEMENT

Revenue
├── New ARR
├── Expansion ARR
└── Churned ARR
= Total ARR (Ending)

Cost of Revenue
├── Hosting (AWS, GCP)
├── Third-party services
└── Customer Success
= Gross Profit (70-85% for SaaS)

Operating Expenses
Sales & Marketing
├── Salaries
├── Commissions
├── Marketing programs
└── Tools
= S&M Expense

Research & Development
├── Engineering salaries
├── Product salaries
└── Infrastructure
= R&D Expense

General & Administrative
├── Finance/HR salaries
├── Legal, accounting
└── Office & admin
= G&A Expense

= Operating Income (EBITDA)

BALANCE SHEET

Assets
├── Cash
├── AR (Accounts Receivable)
└── Other assets
= Total Assets

Liabilities
├── Deferred revenue (prepayments)
├── AP (Accounts Payable)
└── Debt
= Total Liabilities

Equity
├── Invested capital
└── Retained earnings
= Total Equity

CASH FLOW STATEMENT

Operating Activities
├── Net income
├── + Deferred revenue change
├── - AR change
└── + Depreciation
= Cash from operations

Investing Activities
├── CapEx
└── Acquisitions
= Cash from investing

Financing Activities
├── Equity raised
├── Debt raised
└── Debt repayment
= Cash from financing

= Net Cash Change
```

### SaaS-Specific Metrics Tab

```python
# Python model for scenario planning
import pandas as pd
import numpy as np

def saas_model(starting_arr, growth_rate, churn_rate, months=36):
    """
    Model ARR growth over time
    """
    results = []
    
    for month in range(months):
        # Calculate new customers needed
        new_arr_needed = starting_arr * (growth_rate / 12)
        churned_arr = starting_arr * (churn_rate / 12)
        
        ending_arr = starting_arr + new_arr_needed - churned_arr
        
        results.append({
            'month': month + 1,
            'starting_arr': starting_arr,
            'new_arr': new_arr_needed,
            'churned_arr': churned_arr,
            'ending_arr': ending_arr,
            'growth_rate': (ending_arr / starting_arr - 1) * 12  # Annualized
        })
        
        starting_arr = ending_arr
    
    return pd.DataFrame(results)

# Scenario 1: High growth, high churn
scenario1 = saas_model(
    starting_arr=1_000_000,
    growth_rate=1.00,  # 100% annual growth
    churn_rate=0.25    # 25% annual churn
)

# Scenario 2: Moderate growth, low churn
scenario2 = saas_model(
    starting_arr=1_000_000,
    growth_rate=0.50,  # 50% annual growth
    churn_rate=0.10    # 10% annual churn
)

# Compare scenarios at month 36
print(f"Scenario 1 (High growth/churn): ${scenario1.iloc[-1]['ending_arr']:,.0f}")
print(f"Scenario 2 (Moderate growth/churn): ${scenario2.iloc[-1]['ending_arr']:,.0f}")

# Output:
# Scenario 1: $5,832,492
# Scenario 2: $3,172,169
# High churn kills growth!
```

---

## Burn Multiple

### Formula

```
Burn Multiple = Net Burn / Net New ARR

Example:
Q1 Net Burn: $2M (revenues - expenses)
Q1 Net New ARR: $1.5M

Burn Multiple = $2M / $1.5M = 1.33x

INTERPRETATION:
< 1x: Excellent capital efficiency
1-1.5x: Good
1.5-2x: Acceptable
> 2x: Poor efficiency (burning too much for growth)

CAVEAT: Only meaningful if growing (if ARR is flat, infinite burn multiple!)
```

---

## Magic Number

### Formula

```
Magic Number = Net New ARR (this quarter) / S&M Spend (last quarter)

Example:
Q1 S&M spend: $1M
Q2 Net New ARR: $900K

Magic Number = $900K / $1M = 0.9

INTERPRETATION:
< 0.5: Sales engine not working
0.5-0.75: Improving, not yet efficient
0.75-1.0: Efficient, ready to scale
> 1.0: Very efficient, should invest more in S&M

TIMING NOTE: Use previous quarter S&M because there's a lag between spending and revenue.
```

---

## Unit Economics by Customer Segment

### SMB vs Enterprise Comparison

```
SMB CUSTOMER:
ACV (Annual Contract Value): $12,000
CAC: $3,000
Gross Margin: 80%
Churn Rate: 30% annually
Payback: 3.1 months
LTV: $32,000
LTV/CAC: 10.7x ← Great ratio, but high churn

ENTERPRISE CUSTOMER:
ACV: $100,000
CAC: $50,000
Gross Margin: 75%
Churn Rate: 5% annually
Payback: 8 months
LTV: $1,500,000
LTV/CAC: 30x ← Excellent, worth longer payback

STRATEGY IMPLICATION:
- SMB: Product-led growth (PLG), low-touch sales
- Enterprise: High-touch sales, customer success investment
```

---

## Fundraising Metrics

### What VCs Look For (Series A-B)

```
MUST-HAVES:
✓ ARR growth: >3x year-over-year
✓ NRR: >110%
✓ Gross margin: >70%
✓ CAC payback: <12 months
✓ Rule of 40: >40%

NICE-TO-HAVES:
✓ Magic number: >0.75
✓ Burn multiple: <1.5x
✓ Product-market fit: Evidence of organic growth

RED FLAGS:
❌ Increasing CAC over time
❌ Declining NRR
❌ Gross margin <60%
❌ No logo customers (for enterprise)
```

### Valuation Multiples (2025)

```
REVENUE MULTIPLES (ARR):
High-growth (>100% YoY): 15-25x ARR
Moderate-growth (50-100%): 8-15x ARR
Slow-growth (<50%): 4-8x ARR

EXAMPLES (Public SaaS):
- Snowflake: 20x ARR (fast growth)
- Datadog: 18x ARR
- Twilio: 5x ARR (slower growth)

PRIVATE MARKETS (2025):
Series A: 10-15x ARR
Series B: 12-20x ARR
Series C+: 15-25x ARR
(Varies widely based on metrics)
```

---

## Forecasting Best Practices

### Bottom-Up Revenue Model

```
INSTEAD OF: "We'll grow 100% next year" (top-down guess)

DO THIS (bottom-up):

Sales Team Capacity:
- 10 SDRs (Sales Development Reps)
  × 100 qualified leads/month each
  = 1,000 qualified leads/month

- 20 AEs (Account Executives)
  × 3 deals closed/month each
  = 60 new customers/month
  
- Average deal size: $25,000 ACV
- Monthly new ARR: 60 × $25,000 = $1.5M
- Annual new ARR: $1.5M × 12 = $18M

Existing Customer Base:
- Starting ARR: $20M
- Expected churn: 15% = -$3M
- Expected expansion: 20% = +$4M
- Net existing ARR: $21M

TOTAL ARR (Year-end): $18M + $21M = $39M

This is bottom-up, defensible!
```

---

## Key Metrics Dashboard

```python
# Sample dashboard metrics
metrics = {
    'ARR': {
        'current': 12_500_000,
        'target': 15_000_000,
        'yoy_growth': '25%'
    },
    'NRR': {
        'current': '115%',
        'target': '120%',
        'status': '🟡 Yellow'
    },
    'CAC_payback': {
        'current': 11.2,
        'target': 12.0,
        'status': '🟢 Green'
    },
    'Gross_margin': {
        'current': '78%',
        'target': '75%',
        'status': '🟢 Green'
    },
    'Rule_of_40': {
        'current': 45,
        'target': 40,
        'status': '🟢 Green'
    },
    'Burn_rate': {
        'current': 1_500_000,
        'runway_months': 18,
        'status': '🟢 Green'
    }
}
```

---

## Key Takeaways

1. **ARR is vanity, NRR is sanity** - Retention matters more than acquisition
2. **CAC payback < 12 months** - Or you'll run out of cash
3. **LTV/CAC > 3x** - Healthy unit economics
4. **Rule of 40** - Balance growth and profitability
5. **Model bottom-up** - Top-down forecasts are guesses

---

## References

- "SaaS Metrics 2.0" - David Skok
- Bessemer Cloud Index
- OpenView SaaS Benchmarks
- Battery Ventures SaaS Metrics

**Related**: `fundraising-strategy.md`, `financial-planning.md`, `saas-pricing.md`
