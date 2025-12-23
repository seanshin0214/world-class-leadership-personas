# VP Sales: Building & Scaling Sales Organizations 2025

**Updated**: 2025-11-23 | **Focus**: Pipeline Management, Team Performance, Revenue

---

## Sales Organization Structure

```
VP SALES
├── Sales Development (SDR/BDR) - 20-30% of team
│   ├── Inbound SDRs (qualify marketing leads)
│   └── Outbound BDRs (cold outreach)
│
├── Account Executives (AEs) - 50-60%
│   ├── SMB AEs ($5K-25K deals)
│   ├── Mid-Market AEs ($25K-100K deals)
│   └── Enterprise AEs ($100K+ deals)
│
├── Sales Engineers (SEs) - 10-15%
│   └── Support technical evaluation
│
└── Sales Operations - 5-10%
    ├── CRM management (Salesforce)
    ├── Comp plans & quota setting
    └── Analytics & forecasting

TEAM RATIOS:
- 1 SDR : 2-3 AEs (SDR feeds AEs with qualified leads)
- 1 SE : 4-6 Enterprise AEs (SE supports demos/POCs)
- 1 Sales Ops : 20-30 reps (operations support)
```

---

## Sales Metrics & Dashboards

```python
# Core Sales Metrics
sales_metrics = {
    # Pipeline
    'pipeline_total': 15_000_000,  # $15M total pipeline
    'pipeline_weighted': 5_000_000,  # $5M (weighted by stage probability)
    'pipeline_coverage': 3.0,  # 3x quota (healthy: 3-4x)
    
    # Activity
    'calls_per_rep_per_day': 30,  # SDR activity
    'demos_per_ae_per_week': 8,  # AE activity
    'proposals_sent': 25,  # Monthly
    
    # Conversion Funnel
    'lead_to_sql': 0.20,  # 20% of leads become SQLs
    'sql_to_opp': 0.50,  # 50% of SQLs become opportunities
    'opp_to_close': 0.25,  # 25% close rate
    'overall_conversion': 0.025,  # 2.5% lead → customer
    
    # Efficiency
    'avg_sales_cycle': 45,  # days
    'avg_deal_size': 50_000,  # $50K
    'cac': 15_000,  # Customer Acquisition Cost
    'ltv_cac': 5.0,  # 5x (healthy: >3x)
    
    # Team Performance
    'quota_attainment': 0.85,  # 85% of reps hit quota
    'rep_ramp_time': 90,  # days to first deal
    'rep_tenure': 24,  # months (target: >18)
    'top_performer_multiple': 3.2,  # Top rep does 3.2x quota
}

# Calculate key metrics
def calculate_sales_health(metrics):
    """
    Sales health scorecard
    """
    health = {
        'pipeline_coverage': '🟢' if metrics['pipeline_coverage'] >= 3 else '🔴',
        'conversion_rate': '🟢' if metrics['opp_to_close'] >= 0.20 else '🟡',
        'quota_attainment': '🟢' if metrics['quota_attainment'] >= 0.80 else '🔴',
        'sales_cycle': '🟢' if metrics['avg_sales_cycle'] <= 60 else '🟡',
        'rep_tenure': '🟢' if metrics['rep_tenure'] >= 18 else '🔴',
    }
    
    return health

# Weekly sales dashboard
print("SALES DASHBOARD")
print("=" * 50)
for metric, value in sales_metrics.items():
    print(f"{metric}: {value}")
```

---

## Pipeline Management

### Opportunity Stages

```
STAGE 1: Discovery (50% weighted probability)
- Qualification complete (BANT)
- Pain points identified
- Budget confirmed
Duration: 1-2 weeks

STAGE 2: Demo (60%)
- Product demo delivered
- Key stakeholders engaged
- Technical fit validated
Duration: 1-2 weeks

STAGE 3: Proposal (70%)
- Proposal sent
- Pricing discussed
- ROI calculated
Duration: 1-2 weeks

STAGE 4: Negotiation (80%)
- Contract review
- Legal/security review
- Procurement involved
Duration: 1-3 weeks

STAGE 5: Closed-Won (100%)
- Contract signed
- Payment processed
- Handoff to Customer Success

STAGE X: Closed-Lost (0%)
- Reason: No budget / timing / competitor / no decision
- Post-mortem completed
- Re-engage date set (if applicable)

AVERAGE SALES CYCLE: 6-10 weeks (total)
```

### Pipeline Reviews

```markdown
WEEKLY PIPELINE REVIEW (60 minutes):

ATTENDEES: VP Sales, Sales Managers, Revenue Ops

AGENDA:

1. PIPELINE SNAPSHOT (10 min)
   - Total pipeline: $15M (goal: $12M)
   - Weighted pipeline: $5M (goal: $4.5M)
   - Pipeline coverage: 3.0x (healthy)
   - Pipeline created this week: $2.5M

2. AT-RISK DEALS (20 min)
   Review deals that:
   - Slipped from previous forecast
   - Stalled >2 weeks in same stage
   - High value (>$100K)
   
   For each:
   - Why at risk?
   - Action plan to save?
   - Need executive involvement?

3. COMMIT DEALS (20 min)
   - Deals forecasted to close this month/quarter
   - Confidence level (90%+)
   - Blockers?
   - Next steps?

4. HYGIENE CHECK (10 min)
   - Opportunities with no activity in >7 days
   - Deals in stage >expected duration
   - Missing information (close date, amount, etc.)
   
   Action: Clean up or close-lost

OUTCOME:
- Updated forecast (commit, best case, upside)
- Action items assigned
- At-risk deals escalated
```

---

## Sales Compensation

### OTE Structure

```
OTE = On-Target Earnings (Base + Variable)

SMB AE:
- Base: $80K (50%)
- Variable: $80K (50%)
- OTE: $160K
- Quota: $800K ARR (5x OTE)

MID-MARKET AE:
- Base: $100K (45%)
- Variable: $120K (55%)
- OTE: $220K
- Quota: $1.2M ARR (5.5x OTE)

ENTERPRISE AE:
- Base: $120K (40%)
- Variable: $180K (60%)
- OTE: $300K
- Quota: $2M ARR (6.5x OTE)

COMMISSION STRUCTURE:

RAMP:
Month 1-3: 50% quota (ramp period)
Month 4-6: 75% quota
Month 7+: 100% quota

TIERS (Accelerators):
0-79% of quota: 8% commission rate
80-99%: 10% commission rate
100-119%: 12% commission rate
120%+: 15% commission rate (accelerator!)

EXAMPLE:
AE with $1M quota closes $1.2M:
- $800K at 10% = $80K
- $200K at 12% = $24K
- $200K at 15% = $30K
Total commission: $134K (vs $120K target)

CLAWBACK POLICY:
- If customer churns <90 days: 100% clawback
- If customer churns 90-180 days: 50% clawback
- If customer churns >180 days: 0% clawback
```

---

## Sales Hiring & Onboarding

### Sales Interview Process

```markdown
ROUND 1: PHONE SCREEN (30 min) - Recruiter
- Resume walkthrough
- Quota attainment history (must be >80% avg)
- Why sales? Why our company?
- Comp expectations
Pass rate: 40%

ROUND 2: ROLE PLAY (45 min) - Sales Manager
Scenario: Cold call to VP Marketing
- Prospect research (5 min prep)
- Cold call (10 min)
- Objection handling
- Close for next meeting

Evaluate:
- Research quality (did they look up company?)
- Discovery questions (did they ask good questions?)
- Listening (did they listen or just pitch?)
- Handling objections
- Closing (did they ask for meeting?)

Pass rate: 50%

ROUND 3: CASE STUDY (60 min) - VP Sales
Scenario: Lost deal post-mortem
- Given: Lost $100K deal to competitor
- Task: Analyze why we lost, how to win next time
- Presentation: 15-min presentation + Q&A

Evaluate:
- Critical thinking
- Customer empathy
- Strategic thinking
- Communication

Pass rate: 60%

ROUND 4: CULTURAL FIT (30 min) - Peer AEs
- Team collaboration
- Competitiveness vs collaboration balance
- Work ethic

Pass rate: 80%

OVERALL: ~10-15% of applicants get offer
```

### 90-Day Onboarding

```markdown
WEEK 1-2: LEARN
- Product training (features, use cases, positioning)
- Competitive training (battlecards)
- Sales process (stages, CRM, tools)
- Shadow 10+ sales calls
- Pass product certification exam

WEEK 3-4: OBSERVE
- Continue shadowing (demos, discovery, negotiations)
- Reverse shadow (give demo to team, get feedback)
- Role play objection handling
- Small accounts assigned (low-risk practice)

WEEK 5-8: PRACTICE
- Lead own discovery calls (manager listens)
- Deliver demos (SE support)
- Work 5-10 active opportunities
- Goal: Close first deal by Week 8

WEEK 9-12: PERFORM
- Full opportunity load
- 50% quota (ramp)
- Weekly coaching with manager
- Quarterly business review (QBR)

SUCCESS METRICS:
- Week 8: First deal closed
- Week 12: 50% of quota hit
- Month 6: 100% of quota hit
- Month 12: Consistent quota attainment
```

---

## Sales Methodologies

### MEDDIC (Enterprise Sales)

```
M - METRICS
- What ROI are they expecting?
- What KPIs will improve?
- How will they measure success?

E - ECONOMIC BUYER
- Who has budget authority?
- Who signs contracts?
- Have we met them?

D - DECISION CRITERIA
- How will they evaluate solutions?
- What's most important? (price, features, support)
- What's the evaluation process?

D - DECISION PROCESS
- Who's involved in decision?
- Timeline?
- Any approval steps?

I - IDENTIFY PAIN
- What's the business problem?
- What's the cost of not solving it?
- Why now?

C - CHAMPION
- Who internally advocates for us?
- Do they have influence?
- Will they sell for us when we're not in the room?

QUALIFICATION:
If missing 2+ letters → Low priority or disqualify
```

### SPIN Selling (Consultative)

```
S - SITUATION QUESTIONS
"Tell me about your current process for [X]"
"How many people are on your team?"

P - PROBLEM QUESTIONS
"What challenges are you facing with [current solution]?"
"How is this impacting your team?"

I - IMPLICATION QUESTIONS
"What happens if you don't solve this?"
"How much time/money are you losing?"

N - NEED-PAYOFF QUESTIONS
"If you could solve [problem], what would that mean for your team?"
"What would success look like?"

PATTERN:
Situation → Problem → Implication → Need-Payoff → Solution

DON'T pitch until you've asked all 4 question types!
```

---

## Sales Enablement

### Sales Playbook

```markdown
TARGET CUSTOMER PROFILE:

FIRMOGRAPHICS:
- Industry: SaaS, Technology
- Company size: 50-500 employees
- Revenue: $10M-$100M
- Growth stage: Series A - Series C

BUYER PERSONAS:

1. VP MARKETING (Economic Buyer)
   - Pain: Can't track marketing ROI
   - Goal: Increase pipeline by 50%
   - Metrics: MQLs, SQL conversion, pipeline $
   - Objection: "Too expensive"
   - Response: "Let's calculate ROI..."

2. MARKETING MANAGER (User)
   - Pain: Manual reporting takes 10 hours/week
   - Goal: Automate reporting
   - Metrics: Time saved, report accuracy
   - Objection: "Looks complicated"
   - Response: "Let me show you how easy..."

3. CTO (Technical Buyer)
   - Pain: Security, integrations
   - Goal: Ensure data security
   - Metrics: Compliance (SOC 2, GDPR)
   - Objection: "Integration concerns"
   - Response: "We have 50+ integrations..."

USE CASES (Customer Success Stories):
- Company A: Increased pipeline 3x in 6 months
- Company B: Saved 15 hours/week on reporting
- Company C: Improved attribution accuracy by 40%
```

---

## Key Takeaways

1. **Pipeline coverage: 3-4x quota** - Always be building pipeline
2. **Activity drives results** - Calls, demos, proposals = lagging indicators
3. **Hire slow, fire fast** - Bad reps hurt team morale
4. **Coaching > managing** - Spend time making reps better
5. **Celebrate wins** - Public recognition drives motivation

---

## References

- "The Sales Acceleration Formula" - Mark Roberge
- "Predictable Revenue" - Aaron Ross
- "SPIN Selling" - Neil Rackham
- Winning by Design Sales Methodology

**Related**: `sales-process-optimization.md`, `account-executive-playbook.md`, `compensation-planning.md`
