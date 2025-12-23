# Growth Hacking Strategies 2025

**Updated**: 2025-11-23 | **Focus**: Viral Loops, PLG, Experimentation

---

## Growth Frameworks

### AARRR Funnel Optimization

```
ACQUISITION (1000 visitors)
    ↓ 20% signup rate
ACTIVATION (200 signups)
    ↓ 60% complete onboarding
RETENTION (120 active users)
    ↓ 10% convert to paid
REVENUE (12 paid users)
    ↓ 25% refer others
REFERRAL (3 new customers)

Optimize each step by 10% = 46% total growth
```

### North Star Framework

```markdown
Spotify: Time Spent Listening (TSL)
- Leading indicators: Playlist saves, follows
- Lagging indicators: Monthly active users

Slack: Messages Sent by Teams
- Leading: Team invites, channel creation
- Lagging: Daily active teams

Airbnb: Nights Booked
- Leading: Listings viewed, searches
- Lagging: Revenue
```

---

## Viral Loop Mechanics

### K-Factor Calculation

```
K = i × c

i = Number of invites sent per user
c = Conversion rate of invites

Example:
Average user invites 5 friends (i = 5)
20% of invites convert (c = 0.20)
K = 5 × 0.20 = 1.0

K > 1: Viral growth (exponential)
K = 1: Linear growth
K < 1: Requires paid acquisition
```

### Viral Cycle Time

```
Start: 100 users
Cycle 1 (Day 7): 100 + (100 × 1.2) = 220
Cycle 2 (Day 14): 220 + (220 × 1.2) = 484
Cycle 3 (Day 21): 484 + (484 × 1.2) = 1,065

Shorter cycle = faster growth
```

---

## Product-Led Growth (PLG)

### Freemium Model

```
FREE TIER
- Core features
- Limited usage (e.g., 100 requests/month)
- Community support

PAID TIER ($29/month)
- Advanced features
- Unlimited usage
- Priority support

ENTERPRISE ($299/month)
- Custom integrations
- SSO, audit logs
- Dedicated account manager

Conversion funnel: 10% free → paid
```

### Time-to-Value (TTV)

```markdown
Dropbox: <5 minutes
1. Sign up
2. Install desktop app
3. Drag file → See it sync
4. "Aha moment!" ✨

Slack: <15 minutes
1. Create workspace
2. Invite team
3. Send first message
4. Real-time response → Value realized

Goal: Minimize time to first value
```

---

## Channel Testing

### Bullseye Framework

```
INNER CIRCLE (Best channels)
- SEO: 40% of traffic, $0.50 CAC
- Referrals: 25% of traffic, $0 CAC

MIDDLE CIRCLE (Potential)
- Content marketing: Testing
- Partnerships: In discussion

OUTER CIRCLE (Tested, failed)
- Paid ads: $50 CAC, too expensive
- Cold email: <1% conversion
```

---

## A/B Testing Strategy

### Test Prioritization (ICE Score)

```
ICE = Impact × Confidence × Ease

Test A: New signup flow
- Impact: 9 (could double conversions)
- Confidence: 7 (70% sure it'll work)
- Ease: 5 (2 days to implement)
ICE = 9 × 7 × 5 = 315

Test B: New pricing page
- Impact: 6
- Confidence: 8
- Ease: 9 (just copy change)
ICE = 6 × 8 × 9 = 432

Run Test B first (higher ICE)
```

### Sample Test Results

```markdown
HYPOTHESIS
Adding social proof (testimonials) will increase signup rate

SETUP
Control: No testimonials
Variant: 3 customer testimonials above signup form

RESULTS (2 weeks, 10,000 visitors each)
Control: 1,000 signups (10.0%)
Variant: 1,150 signups (11.5%)

Uplift: +15% (statistically significant, p < 0.05)
Decision: Ship to 100%
```

---

## Retention Tactics

### Cohort Analysis

```
Signup Month | Day 1 | Day 7 | Day 30 | Day 90
Jan 2025     | 100%  | 45%   | 25%    | 15%
Feb 2025     | 100%  | 50%   | 30%    | 20%
Mar 2025     | 100%  | 55%   | 35%    | 25%

Trend: Improving retention (product improvements working)
```

### Email Re-engagement

```
Day 3: Welcome series (3 emails)
Day 7: Feature tutorial
Day 14: Case study / success story
Day 30: Special offer (if inactive)
Day 60: Win-back campaign
```

---

## SEO for Growth

### Content Strategy

```markdown
TOP OF FUNNEL (Awareness)
- Blog: "What is [topic]?"
- Traffic: 10,000/month
- Conversion: 2%

MIDDLE OF FUNNEL (Consideration)
- Guide: "[Topic] Best Practices"
- Traffic: 2,000/month
- Conversion: 10%

BOTTOM OF FUNNEL (Decision)
- Comparison: "[Our Product] vs [Competitor]"
- Traffic: 500/month
- Conversion: 30%

Focus: BOFU content for higher conversions
```

---

## Referral Programs

### Dropbox Model

```
Referrer: Gets 500MB free storage
Referee: Gets 500MB free storage

Results:
- 35% of signups from referrals
- 60% less churn for referred users
- 4x viral coefficient improvement
```

### Implementation

```typescript
// Track referral
const referralCode = generateCode(userId);
const referralLink = `https://app.com/signup?ref=${referralCode}`;

// On signup
if (params.ref) {
  await trackReferral(params.ref, newUserId);
  await rewardReferrer(params.ref, '500MB');
  await rewardReferee(newUserId, '500MB');
}
```

---

## Key Metrics Dashboard

```markdown
ACQUISITION
- CAC: $15 (target: <$20)
- Traffic: 50,000/month (+20% MoM)
- Signup rate: 12% (target: 15%)

ACTIVATION
- Onboarding completion: 65% (target: 70%)
- Time to first value: 8 minutes (target: <5)

RETENTION
- Day 7: 50% (target: 60%)
- Day 30: 30% (target: 40%)
- Churn: 5%/month (target: <3%)

REVENUE
- ARPU: $45/month
- LTV: $540 (12 months avg)
- LTV/CAC: 36x (healthy: >3x)

REFERRAL
- K-factor: 0.8 (target: >1.0)
- Referral rate: 15%
```

---

## Experimentation Velocity

```
Weekly experiment target: 3-5 tests
Monthly: 12-20 tests
Annual: 144-240 tests

Success rate: 30% (industry average)
Expected wins: 43-72 per year

Compounding effect: Massive growth
```

---

## Tools Stack

**Analytics**: Mixpanel, Amplitude, PostHog
**A/B Testing**: Optimizely, VWO, Google Optimize
**Email**: Customer.io, Braze, SendGrid
**Referral**: ReferralCandy, Viral Loops
**SEO**: Ahrefs, SEMrush, Moz
**Experimentation**: GrowthBook, LaunchDarkly

---

## References

- "Hacking Growth" - Sean Ellis
- "Traction" - Gabriel Weinberg
- Reforge Growth Series

**Related**: `conversion-optimization.md`, `analytics.md`, `seo-strategy.md`
