# Product Management 2025: Strategy to Execution

**Updated**: 2025-11-23 | **Focus**: Discovery, Roadmapping, Metrics

---

## Product Discovery

### Jobs-to-be-Done Framework

```markdown
When [situation],
I want to [motivation],
So I can [outcome].

Example:
When I'm commuting to work,
I want to listen to personalized podcasts,
So I can learn without using my phone.
```

### User Research Methods

1. **Customer Interviews** (5-10 users)
2. **Surveys** (100+ users, quantitative validation)
3. **Usability Testing** (5-8 users per iteration)
4. **Analytics** (Mixpanel, Amplitude)
5. **Prototypes** (Figma, low-fidelity)

---

## Prioritization Frameworks

### RICE Score

```
RICE = (Reach × Impact × Confidence) / Effort

Reach: Users affected (per quarter)
Impact: 0.25 (minimal) to 3 (massive)
Confidence: 0% to 100%
Effort: Person-months

Example:
Feature A: (10,000 × 2 × 80%) / 3 = 5,333
Feature B: (1,000 × 3 × 100%) / 1 = 3,000

Priority: Feature A > Feature B
```

### Value vs Effort Matrix

```
    High Value
        │
    A   │  B
────────┼────────
    C   │  D
        │
    Low Value

A: Quick wins (do first)
B: Big bets (strategic)
C: Fill-ins (when available)
D: Time sinks (avoid)
```

---

## Product Roadmap

### Now-Next-Later Format

```markdown
NOW (This Quarter)
- Launch mobile app (iOS + Android)
- A/B test new pricing page
- Improve onboarding flow

NEXT (Next Quarter)
- API for developers
- Team collaboration features
- Advanced analytics

LATER (6-12 months)
- AI-powered recommendations
- Enterprise SSO
- Integrations marketplace
```

### Gantt Chart (Quarterly)

```
Q1 2025
Week  1  2  3  4  5  6  7  8  9 10 11 12
      ├──────┤ Discovery
         ├────────┤ Design
              ├────────────┤ Development
                     ├──────┤ Testing
                           ├──┤ Launch
```

---

## Product Metrics (AARRR)

### Pirate Metrics

```
ACQUISITION: How do users find us?
- Traffic sources
- Cost per acquisition (CPA)
- Conversion rate

ACTIVATION: Do they have a good first experience?
- Signup completion rate
- Time to "aha moment"
- Feature adoption

RETENTION: Do they come back?
- Day 1, 7, 30 retention
- Monthly active users (MAU)
- Churn rate

REVENUE: Can we monetize?
- Customer lifetime value (LTV)
- Average revenue per user (ARPU)
- LTV/CAC ratio

REFERRAL: Do they tell others?
- Net Promoter Score (NPS)
- Viral coefficient
- Referral rate
```

### North Star Metric Examples

- **Spotify**: Time spent listening
- **Airbnb**: Nights booked
- **Slack**: Messages sent
- **Notion**: Active workspaces

---

## Product Requirements (PRD)

```markdown
# Feature: In-App Chat

## Problem
Users can't communicate within the app, leading to context switching.

## Success Metrics
- 50% of users send ≥1 message/week
- 20% reduction in support tickets

## User Stories
As a user,
I want to message teammates,
So I can collaborate in real-time.

## Requirements

### Functional
- Send text messages
- Real-time delivery
- Read receipts
- File attachments (≤10MB)

### Non-Functional
- <500ms message delivery
- 99.9% uptime
- GDPR compliant

## Out of Scope (V1)
- Voice/video calls
- Message editing
- Threaded conversations

## Design Mocks
[Link to Figma]

## Technical Approach
WebSocket for real-time, PostgreSQL for storage

## Launch Plan
1. Internal beta (Week 1-2)
2. 10% rollout (Week 3)
3. 100% rollout (Week 4)
```

---

## A/B Testing

### Hypothesis Template

```markdown
We believe that [change]
Will result in [outcome]
For [user segment]
We will measure [metric]

Example:
We believe that adding social proof (testimonials)
Will result in increased signups
For free trial users
We will measure signup conversion rate
```

### Statistical Significance

```python
Sample size needed (95% confidence, 80% power):
Baseline: 10% conversion
Minimum detectable effect: 2% (absolute)
Required: 3,842 users per variant

Run for 2-4 weeks to account for weekly patterns
```

---

## Stakeholder Management

### RACI Matrix

```
           PM  Eng  Design  Marketing
Strategy    R   C     C        I
PRD         R   C     C        I
Design      C   I     R        I
Dev         C   R     I        I
Launch      R   C     C        R

R: Responsible (does the work)
A: Accountable (final approval)
C: Consulted (provides input)
I: Informed (kept in loop)
```

---

## Go-to-Market Strategy

### Launch Checklist

```markdown
PRE-LAUNCH (4 weeks before)
□ Press release draft
□ Demo video
□ Help docs
□ Internal training
□ Beta testing complete

LAUNCH (Week 0)
□ Feature flag enabled
□ Monitoring dashboards
□ Support team ready
□ Social media posts
□ Email announcement

POST-LAUNCH (Weeks 1-4)
□ Daily metrics review
□ User feedback collection
□ Bug fixes prioritized
□ Iteration planning
```

---

## Key Takeaways

1. **Customer-centric**: Build what users need, not what you think they want
2. **Data-driven**: Measure everything, iterate based on data
3. **Ruthless prioritization**: Say no to good ideas for great ones
4. **Cross-functional**: Align engineering, design, marketing
5. **Ship fast, learn faster**: MVP > perfection

---

## References

- "Inspired" - Marty Cagan
- "The Lean Product Playbook" - Dan Olsen
- Reforge Product Strategy Course

**Related**: `user-research.md`, `product-analytics.md`, `roadmapping.md`
