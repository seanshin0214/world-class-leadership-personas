# UX Research Methods 2025

**Updated**: 2025-11-23 | **Focus**: Qualitative & Quantitative Methods

---

## When to Use Which Method

| Method | Type | When | Sample Size |
|--------|------|------|-------------|
| **User Interviews** | Qualitative | Deep insights, motivations | 5-10 |
| **Surveys** | Quantitative | Patterns, validation | 100+ |
| **Usability Testing** | Both | Product validation | 5-8 |
| **A/B Testing** | Quantitative | Optimization | 1000+ |
| **Card Sorting** | Qualitative | Information architecture | 15-30 |
| **Diary Studies** | Qualitative | Long-term behavior | 10-20 |

---

## Qualitative Methods

### 1. User Interviews

**Structure**:
```
1. Warm-up (5 min): Build rapport
2. Context (10 min): Current situation
3. Deep dive (30 min): Pain points, needs
4. Wrap-up (5 min): Final thoughts

Total: 50 minutes
```

**Best Practices**:
- Ask "Why?" 5 times (5 Whys technique)
- Use silence (let them think)
- Avoid leading questions
- Record & transcribe

### 2. Usability Testing

**Protocol**:
```markdown
1. Introduction
   "Think aloud as you complete these tasks"

2. Tasks (3-5 scenarios)
   "You want to book a flight to Paris. Show me how you'd do that."

3. Metrics
   - Task completion rate
   - Time on task
   - Error rate
   - Satisfaction (1-5)

4. Debrief
   "What was most challenging?"
```

### 3. Diary Studies

**Setup**:
- Duration: 1-4 weeks
- Frequency: Daily or triggered by events
- Format: Text, photos, voice notes

**Example Prompt**:
"Each time you use our app today, take a screenshot and note: What were you trying to do? Did it work? How did you feel?"

---

## Quantitative Methods

### 1. Surveys

**Question Types**:
```markdown
# Multiple choice
How often do you use the app?
○ Daily
○ Weekly
○ Monthly
○ Rarely

# Likert scale (1-5)
The app is easy to use.
1 (Disagree) ━━━━━ 5 (Agree)

# Open-ended
What would make the app more useful?
[Text box]
```

**Sample Size Calculator**:
- Population: 10,000 users
- Confidence: 95%
- Margin of error: 5%
- **Required sample**: 370 responses

### 2. A/B Testing

**Framework**:
```python
# Hypothesis
H0: Variant B ≤ Variant A (no improvement)
H1: Variant B > Variant A (improvement)

# Sample size
from scipy.stats import norm
alpha = 0.05  # Significance level
power = 0.80  # Statistical power
baseline_rate = 0.10  # 10% conversion
mde = 0.02  # Minimum detectable effect (2%)

# Calculate
n = 3842 per variant  # 7684 total

# Run test for 2-4 weeks
```

**Statistical Significance**:
```python
from scipy.stats import chi2_contingency

data = [
    [conversions_A, non_conversions_A],
    [conversions_B, non_conversions_B]
]

chi2, p_value, dof, expected = chi2_contingency(data)

if p_value < 0.05:
    print("Statistically significant!")
```

---

## Analysis Frameworks

### Affinity Mapping

```
1. Collect insights (sticky notes)
2. Group similar items
3. Label categories
4. Identify themes
5. Prioritize by frequency/impact
```

### Jobs-to-be-Done (JTBD)

```markdown
When [situation],
I want to [motivation],
So I can [expected outcome].

Example:
When I'm rushing in the morning,
I want to quickly order coffee ahead,
So I can grab it without waiting.
```

### Empathy Mapping

```
┌─────────────┬─────────────┐
│ Says        │ Thinks      │
│             │             │
├─────────────┼─────────────┤
│ Does        │ Feels       │
│             │             │
└─────────────┴─────────────┘

Pains:
- [List pain points]

Gains:
- [List benefits sought]
```

---

## Research Plan Template

```markdown
# Research Plan

## Goals
1. Understand why users abandon checkout
2. Identify usability issues in payment flow

## Research Questions
- What causes hesitation at checkout?
- Which steps are confusing?
- What would increase trust?

## Method
- Usability testing (moderated)
- 8 participants
- Remote via Zoom
- 45 minutes each

## Participants
- Criteria: Used app 3+ times, abandoned cart
- Recruitment: Email invite to existing users
- Incentive: $75 gift card

## Timeline
- Recruit: Week 1
- Sessions: Week 2
- Analysis: Week 3
- Report: Week 4

## Deliverables
- Video highlights reel
- Key findings presentation
- Prioritized recommendations
```

---

## Tools

**User Interviews**: Zoom, Google Meet, Otter.ai (transcription)
**Usability Testing**: Maze, UserTesting, Lookback
**Surveys**: Typeform, Google Forms, Qualtrics
**Analytics**: Mixpanel, Amplitude, Google Analytics
**Card Sorting**: Optimal Workshop, UserZoom
**Prototyping**: Figma, Axure, InVision

---

## Key Takeaways

1. **5 users** uncover 85% of usability issues
2. **Mix methods** (qual + quant) for complete picture
3. **Test early, test often** (continuous research)
4. **Involve stakeholders** in sessions
5. **Prioritize actionable insights**

---

## References

- Nielsen Norman Group UX Research Guide
- "When to Use Which UX Research Methods" - NN/G
- UXPA Best Practices
- Google HEART Framework

**Related**: `usability-testing.md`, `user-interviews.md`, `analytics.md`
