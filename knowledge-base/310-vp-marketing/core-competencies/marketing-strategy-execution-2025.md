# VP Marketing: Strategy to Execution 2025

**Updated**: 2025-11-23 | **Focus**: Demand Gen, Brand, Product Marketing

---

## Marketing Organization Structure

```
VP MARKETING
├── Demand Generation (40% of budget)
│   ├── Paid Acquisition (Google, LinkedIn, Meta)
│   ├── SEO/Content Marketing
│   ├── Email Marketing & Automation
│   └── Webinars & Events
│
├── Product Marketing (25%)
│   ├── Positioning & Messaging
│   ├── Competitive Intelligence
│   ├── Sales Enablement
│   └── Launch Strategy
│
├── Brand & Communications (20%)
│   ├── Brand Strategy
│   ├── PR & Media Relations
│   ├── Social Media
│   └── Content Strategy
│
└── Marketing Operations (15%)
    ├── MarTech Stack (HubSpot, Salesforce, Analytics)
    ├── Data & Analytics
    ├── Campaign Operations
    └── Budget Management

TEAM SIZE (by ARR):
- $5M ARR: 3-5 marketers
- $25M ARR: 10-15 marketers
- $100M ARR: 30-50 marketers
```

---

## Marketing Metrics & KPIs

```python
# Marketing dashboard
marketing_metrics = {
    # Pipeline Generation
    'mqls': 1500,  # Marketing Qualified Leads (monthly)
    'sqls': 450,  # Sales Qualified Leads (30% conversion)
    'pipeline_generated': 5_000_000,  # $5M pipeline
    'pipeline_influenced': 12_000_000,  # $12M (80% of total)
    
    # Conversion Funnel
    'website_visits': 50_000,  # Monthly
    'conversion_to_lead': 0.03,  # 3% (50K → 1.5K)
    'lead_to_mql': 1.0,  # 100% (assume all leads are MQL)
    'mql_to_sql': 0.30,  # 30%
    'sql_to_opp': 0.50,  # 50%
    'opp_to_close': 0.25,  # 25%
    
    # Channel Performance
    'channels': {
        'paid_search': {'spend': 150_000, 'mqls': 450, 'cpl': 333},
        'paid_social': {'spend': 100_000, 'mqls': 300, 'cpl': 333},
        'seo_content': {'spend': 50_000, 'mqls': 500, 'cpl': 100},
        'events': {'spend': 200_000, 'mqls': 250, 'cpl': 800},
    },
    
    # Efficiency
    'cac': 12_000,  # Customer Acquisition Cost
    'marketing_contribution_to_cac': 8_000,  # 67%
    'ltv_cac_ratio': 4.5,  # 4.5x (healthy)
    'cac_payback_months': 14,  # Target: <18
    
    # Brand
    'brand_awareness': 0.25,  # 25% aided awareness in target market
    'nps': 42,  # Net Promoter Score
    'website_traffic_growth': 0.15,  # 15% MoM
}

# Calculate ROI
total_marketing_spend = sum(c['spend'] for c in marketing_metrics['channels'].values())
pipeline_generated = marketing_metrics['pipeline_generated']
win_rate = 0.25
avg_deal_size = 50_000

expected_revenue = pipeline_generated * win_rate
roi = (expected_revenue / total_marketing_spend) - 1

print(f"Marketing Spend: ${total_marketing_spend:,}")
print(f"Pipeline Generated: ${pipeline_generated:,}")
print(f"Expected Revenue: ${expected_revenue:,}")
print(f"ROI: {roi*100:.0f}%")  # Should be >200%
```

---

## Demand Generation Playbook

### Paid Acquisition Strategy

```markdown
GOOGLE ADS (Best for High-Intent):

CAMPAIGN STRUCTURE:
1. BRAND CAMPAIGN (10% of budget)
   - Keywords: [Company Name], [Product Name]
   - CPC: $2-5
   - Conversion rate: 15-25%
   - Purpose: Capture existing demand

2. COMPETITOR CAMPAIGN (15%)
   - Keywords: [Competitor 1], [Competitor 2]
   - CPC: $15-30 (expensive!)
   - Conversion rate: 5-10%
   - Purpose: Steal market share

3. PRODUCT CATEGORY (50%)
   - Keywords: "project management software", "crm for startups"
   - CPC: $10-20
   - Conversion rate: 3-7%
   - Purpose: Capture demand generation

4. PROBLEM/PAIN POINT (25%)
   - Keywords: "how to track projects", "manage customer relationships"
   - CPC: $5-10
   - Conversion rate: 1-3%
   - Purpose: Early-stage education

OPTIMIZATION:
- Negative keywords (exclude "free", "open source", "cheap")
- Ad extensions (sitelinks, callouts, structured snippets)
- Landing page A/B testing
- Quality Score >7 (reduces CPC by 30-50%)

LINKEDIN ADS (Best for B2B):

TARGETING:
- Job titles: "VP Marketing", "Head of Sales", "CTO"
- Company size: 50-1000 employees
- Industries: SaaS, Technology
- Seniority: Director+

AD FORMATS:
1. Sponsored Content (70% of budget)
   - Native in feed
   - CPC: $8-15
   - Best for: Awareness, lead gen

2. Sponsored InMail (20%)
   - Direct message
   - CPC: $0.80-1.50 per send
   - Best for: Event invites, high-value offers

3. Text Ads (10%)
   - Cheap, low performance
   - CPC: $4-8
   - Best for: Budget-conscious retargeting

BENCHMARKS (B2B SaaS):
- CTR: 0.5-1.5%
- Conversion rate: 5-10%
- CPL (Cost Per Lead): $80-150
- CPA (Cost Per Acquisition): $800-1500
```

### Content Marketing Engine

```markdown
CONTENT PYRAMID:

TOP (Authority Content): 10% of effort
- Original research reports (annual)
- Industry benchmarks
- Whitepapers
→ Purpose: PR, backlinks, brand authority

MIDDLE (Pillar Content): 20% of effort
- Ultimate guides (5000+ words)
- Video tutorials
- Webinars
→ Purpose: SEO, lead generation

BOTTOM (Daily Content): 70% of effort
- Blog posts (weekly)
- Social media (daily)
- Email newsletters (2x/week)
→ Purpose: Engagement, nurture

CONTENT CALENDAR:

MONDAY:
- Publish blog post
- Share on LinkedIn, Twitter
- Send to email subscribers

TUESDAY:
- Product update (feature launch, case study)
- Sales enablement content

WEDNESDAY:
- Industry news commentary
- Thought leadership post

THURSDAY:
- Customer success story
- Video snippet

FRIDAY:
- Weekly roundup newsletter
- Promote upcoming webinar

SEO OPTIMIZATION:
- Primary keyword in H1, URL, meta description
- Internal linking (3-5 links to related posts)
- External links to authoritative sources (2-3)
- Images with alt text
- Featured snippet optimization (answer common questions)
- Minimum 1500 words for pillar content

DISTRIBUTION:
- Organic social (LinkedIn, Twitter)
- Email nurture campaigns
- Sales outreach (SDRs use in prospecting)
- Paid promotion (boost top performers)
```

---

## Product Marketing

### Go-to-Market Launch Plan

```markdown
NEW FEATURE LAUNCH (T-8 weeks):

WEEK -8: POSITIONING
- Define target audience (who is this for?)
- Key benefits (why should they care?)
- Differentiation (how is this different?)
- Messaging framework (elevator pitch, value props)

WEEK -7: CONTENT CREATION
- Landing page (design + copy)
- Product demo video (2-3 minutes)
- Help docs & FAQs
- Sales enablement deck
- Email templates (3-5 variations)
- Blog post announcement

WEEK -6: INTERNAL ENABLEMENT
- Sales training (features, benefits, objection handling)
- CS training (how to demo, common questions)
- Support training (troubleshooting guide)

WEEK -5: BETA LAUNCH
- 10-20 customers invited
- Feedback collection
- Iterate on positioning/features

WEEK -4: PR & ANALYST RELATIONS
- Press release draft
- Media pitching (TechCrunch, VentureBeat, industry pubs)
- Analyst briefings (Gartner, Forrester if relevant)

WEEK -3: MARKETING ASSET FINALIZATION
- Social media posts scheduled (10+ posts)
- Paid ad campaigns ready (Google, LinkedIn)
- Email campaigns loaded in HubSpot
- Webinar scheduled

WEEK -2: PARTNER ENABLEMENT
- Integration partners notified
- Co-marketing opportunities identified
- Referral program promotion

WEEK -1: FINAL PREP
- QA all assets
- Dry run of demo
- Confirm launch date with engineering

LAUNCH DAY:
7:00 AM: Press release goes live
8:00 AM: Blog post published
9:00 AM: Email to customers
10:00 AM: Social media blitz
11:00 AM: Sales all-hands (launch celebration)
12:00 PM: Paid ads activated
2:00 PM: Webinar (live demo)

WEEK +1: OPTIMIZATION
- Track metrics (signups, usage, feedback)
- A/B test messaging
- Iterate based on results

WEEK +2-4: SUSTAIN
- Continue promotion
- Customer testimonials
- Case studies
```

### Competitive Intelligence

```markdown
COMPETITOR ANALYSIS FRAMEWORK:

1. PRODUCT COMPARISON
   Feature Matrix:
   | Feature | Us | Competitor A | Competitor B |
   |---------|-----|--------------|--------------|
   | Feature 1 | ✅ | ✅ | ❌ |
   | Feature 2 | ✅ | ❌ | ✅ |
   | Feature 3 | ✅ | ❌ | ❌ |

2. PRICING COMPARISON
   - Our pricing: $99/user/month
   - Competitor A: $120/user/month (20% more expensive)
   - Competitor B: $79/user/month (20% cheaper, but fewer features)

3. POSITIONING
   - Competitor A: Enterprise-focused, complex
   - Competitor B: SMB-focused, simple
   - Us: Mid-market sweet spot, balance of power + usability

4. SALES BATTLECARDS
   
   COMPETITOR A:
   
   They'll say: "We have more features and are more mature"
   You say: "True, but 80% of users don't need those features. 
            Our customers cite ease-of-use as #1 reason they chose us."
   
   They'll say: "We have better enterprise security"
   You say: "We're SOC 2 Type II certified, same as them. 
            What specific security requirement do you have?"
   
   Win Story:
   "Company X switched from Competitor A because they were paying for 
    features they never used. With us, they cut costs by 30% and their 
    team adoption went from 40% to 85%."

5. MONITOR COMPETITORS
   - Set Google Alerts ([Competitor Name] + "funding", "product launch")
   - Follow their blog, social media
   - Sign up for their product (free trial)
   - Quarterly review with sales team (what are we hearing?)
```

---

## Marketing Attribution & Analytics

### Attribution Models

```python
# Multi-touch attribution

# Customer journey example:
touchpoints = [
    {'channel': 'Organic Search', 'timestamp': '2025-01-01', 'cost': 0},
    {'channel': 'LinkedIn Ad', 'timestamp': '2025-01-05', 'cost': 50},
    {'channel': 'Email', 'timestamp': '2025-01-10', 'cost': 1},
    {'channel': 'Webinar', 'timestamp': '2025-01-15', 'cost': 100},
    {'channel': 'Demo Request', 'timestamp': '2025-01-20', 'cost': 0},
    # Closed-Won: $50,000 deal
]

total_deal_value = 50_000

# 1. FIRST-TOUCH ATTRIBUTION
# Credit: 100% to first touchpoint
first_touch = touchpoints[0]
print(f"First-touch: {first_touch['channel']} gets ${total_deal_value}")

# 2. LAST-TOUCH ATTRIBUTION
# Credit: 100% to last touchpoint
last_touch = touchpoints[-2]  # -1 is close, -2 is last marketing touch
print(f"Last-touch: {last_touch['channel']} gets ${total_deal_value}")

# 3. LINEAR ATTRIBUTION
# Credit: Equal across all touchpoints
credit_per_touch = total_deal_value / len(touchpoints)
for touch in touchpoints:
    print(f"Linear: {touch['channel']} gets ${credit_per_touch:.0f}")

# 4. TIME-DECAY ATTRIBUTION
# Credit: More recent touches get more credit
def time_decay_attribution(touchpoints, total_value, half_life=7):
    """
    Half-life: Days it takes for credit to reduce by 50%
    """
    from datetime import datetime
    import math
    
    close_date = datetime.strptime('2025-01-22', '%Y-%m-%d')
    weights = []
    
    for touch in touchpoints:
        touch_date = datetime.strptime(touch['timestamp'], '%Y-%m-%d')
        days_ago = (close_date - touch_date).days
        weight = math.exp(-days_ago * math.log(2) / half_life)
        weights.append(weight)
    
    total_weight = sum(weights)
    
    for i, touch in enumerate(touchpoints):
        credit = (weights[i] / total_weight) * total_value
        print(f"Time-decay: {touch['channel']} gets ${credit:.0f}")

time_decay_attribution(touchpoints, total_deal_value)

# 5. W-SHAPED ATTRIBUTION (Most accurate for B2B)
# Credit: 30% first touch, 30% lead creation, 30% opp creation, 10% others
# First: Organic Search (30%)
# Lead Creation: LinkedIn Ad (30%)
# Opp Creation: Demo Request (30%)
# Others: Email, Webinar (5% each)
```

---

## Brand Building

### Brand Metrics

```markdown
BRAND AWARENESS (Quarterly Survey):

Question: "Which of the following project management tools 
          have you heard of?" (unaided)

Results:
- Asana: 65%
- Monday.com: 55%
- Trello: 80%
- Our Product: 25%  ← Target: 40% by end of year

BRAND PREFERENCE (Among aware customers):

Question: "Which tool would you most likely choose?"

Results:
- Asana: 30%
- Monday.com: 25%
- Our Product: 35%  ← We win on preference!
- Other: 10%

BRAND EQUITY DRIVERS:
1. Product quality (40%)
2. Customer service (25%)
3. Brand personality (20%)
4. Social proof (15%)

INVESTMENT PRIORITIES:
✅ Customer testimonials (video case studies)
✅ Thought leadership (CEO on podcasts, LinkedIn)
✅ Awards & recognition (G2, Capterra badges)
✅ Community building (user conference, Slack community)
```

---

## Marketing Budget Allocation

```markdown
TOTAL BUDGET: $2M (for $25M ARR company = 8% of revenue)

ALLOCATION:

1. DEMAND GENERATION (40% = $800K)
   - Paid Search: $300K
   - Paid Social: $200K
   - Content/SEO: $150K
   - Events/Webinars: $100K
   - Email Marketing: $50K

2. PRODUCT MARKETING (25% = $500K)
   - Sales Enablement: $200K
   - Competitive Intel: $100K
   - Market Research: $100K
   - Launch Campaigns: $100K

3. BRAND & PR (20% = $400K)
   - PR Agency: $150K
   - Content Creation: $100K
   - Social Media: $75K
   - Sponsorships: $75K

4. MARTECH & OPERATIONS (15% = $300K)
   - HubSpot/Marketo: $60K
   - Salesforce (marketing licenses): $40K
   - Analytics Tools: $30K
   - Other SaaS tools: $70K
   - Headcount support: $100K

BENCHMARKS (by ARR):
- $1-5M ARR: 15-25% of revenue
- $5-25M ARR: 8-12% of revenue
- $25-100M ARR: 6-8% of revenue
- $100M+ ARR: 4-6% of revenue

As you scale, marketing % decreases (brand + word-of-mouth)
```

---

## Key Takeaways

1. **Pipeline generation is #1 priority** - Everything else is secondary
2. **Attribution is hard, directionally correct > perfectly wrong** - Use W-shaped for B2B
3. **Content is a long game** - Takes 6-12 months to see SEO results
4. **Test everything** - A/B test ads, landing pages, emails
5. **Sales alignment** - Marketing exists to make sales easier

---

## References

- "Demand Gen Playbook" - Drift
- "Obviously Awesome" - April Dunford (positioning)
- HubSpot State of Marketing Report
- Gartner CMO Spend Survey

**Related**: `demand-generation.md`, `product-marketing.md`, `brand-strategy.md`
