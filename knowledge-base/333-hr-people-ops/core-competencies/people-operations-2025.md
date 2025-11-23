# People Operations & HR Excellence 2025

**Updated**: 2025-11-23 | **Focus**: Talent Acquisition, Culture, Performance

---

## The Modern HR Function

```
OLD HR (2015):
- Administrative (payroll, benefits)
- Reactive (handle complaints)
- Compliance-focused

NEW PEOPLE OPS (2025):
- Strategic partner to CEO
- Proactive (culture building)
- Data-driven (metrics, analytics)
- Employee experience obsessed

KEY METRICS:
- Time to hire: <30 days
- Offer acceptance rate: >85%
- Employee NPS: >50
- Retention (12-month): >90%
- Internal promotion rate: 15-20%
- Diversity: 40%+ underrepresented groups
```

---

## Talent Acquisition at Scale

### Hiring Funnel Metrics

```
TOP OF FUNNEL:
- Job posting views: 10,000
- Applications: 500 (5% conversion)

SCREENING:
- Phone screens: 100 (20% pass rate)
- Technical screens: 50 (50% pass rate)

ONSITE:
- Onsite interviews: 25 (50% pass rate)
- Offers extended: 12 (48% of onsites)
- Offers accepted: 10 (83% acceptance rate)

EFFICIENCY METRICS:
- Applications to hire: 50:1 ratio
- Time to hire: 28 days (target: <30)
- Cost per hire: $5,000 (industry average: $4,000-$7,000)
- Recruiter productivity: 3-4 hires/month/recruiter
```

### Structured Interview Process

```markdown
ROLE: Senior Software Engineer

INTERVIEW LOOP (4-5 hours):

Round 1: Coding (60 min)
- 2 LeetCode-style problems (medium difficulty)
- Evaluates: Problem-solving, code quality, communication
- Scorecard:
  * Problem-solving: 1-5
  * Code quality: 1-5
  * Communication: 1-5
  * Overall: Strong Yes / Yes / No / Strong No

Round 2: System Design (60 min)
- Design [Twitter/Uber/etc.]
- Evaluates: Architecture, scalability, tradeoffs
- Scorecard: Same 1-5 scale

Round 3: Behavioral (45 min)
- STAR method questions
  * Situation: Describe the context
  * Task: What needed to be done
  * Action: What you did
  * Result: What happened
- Example questions:
  * "Tell me about a time you disagreed with your manager"
  * "Describe your biggest technical failure and what you learned"
- Scorecard: Leadership principles (1-5 each)
  * Ownership
  * Bias for action
  * Customer obsession
  * etc.

Round 4: Hiring Manager (45 min)
- Team fit, project interests, motivations
- Two-way conversation (sell the role)
- Scorecard: Culture fit, passion, long-term potential

CALIBRATION MEETING:
- All interviewers share scores
- Discuss pros/cons
- Forced ranking against other candidates
- Final decision: Hire / No hire
```

### Candidate Experience

```python
# Automated candidate journey
class CandidateJourney:
    def __init__(self, candidate):
        self.candidate = candidate
        self.stage = "applied"
    
    def stage_transitions(self):
        """
        Track candidate through hiring funnel
        """
        stages = {
            'applied': {
                'email': 'Application received',
                'sla': '2 days',  # Respond within 2 days
                'next': 'phone_screen'
            },
            'phone_screen': {
                'email': 'Phone screen scheduled',
                'sla': '5 days',
                'next': 'technical_screen'
            },
            'technical_screen': {
                'email': 'Technical interview invitation',
                'sla': '7 days',
                'next': 'onsite'
            },
            'onsite': {
                'email': 'Onsite interview details',
                'sla': '3 days',  # Fast decision after onsite
                'next': 'offer'
            },
            'offer': {
                'email': 'Offer letter',
                'sla': '7 days',  # Give time to decide
                'next': 'hired'
            },
            'hired': {
                'email': 'Welcome & onboarding',
                'sla': '30 days',  # Start date
                'next': None
            }
        }
        
        return stages[self.stage]
    
    def send_rejection(self, personalized=True):
        """
        Always send rejection emails (candidate experience!)
        """
        if personalized:
            template = f"""
            Hi {self.candidate.name},

            Thank you for your interest in [Company] and for taking the time 
            to interview with us.

            After careful consideration, we've decided to move forward with 
            other candidates whose experience more closely matches our needs.

            This was a difficult decision – we were impressed by [specific 
            positive feedback from interviews].

            We'll keep your information on file and reach out if a role 
            becomes available that's a better fit.

            Best of luck in your job search!

            Best,
            [Recruiter Name]
            """
        else:
            template = "Thank you for applying. Unfortunately..."
        
        send_email(self.candidate.email, template)

# Metrics to track:
# - Response time at each stage
# - Drop-off rates (where do candidates abandon?)
# - NPS for candidate experience (even rejected ones!)
```

---

## Onboarding Program

### First 90 Days

```markdown
WEEK 1: WELCOME & SETUP
Day 1:
- 9:00 AM: Welcome breakfast with team
- 10:00 AM: IT setup (laptop, accounts, tools)
- 11:00 AM: Office tour
- 12:00 PM: Lunch with manager
- 2:00 PM: Company culture & values presentation
- 3:00 PM: Benefits enrollment
- 4:00 PM: Set up 1-on-1s with key stakeholders

Day 2-5:
- Complete onboarding checklist (20 items)
- Set up development environment
- Ship first code commit (small bug fix)
- Meet with cross-functional teams
- Read company handbook

WEEK 2-4: LEARNING
- Shadow experienced team members
- Complete product training
- Attend all team meetings
- Small project assignments
- Weekly check-in with manager

WEEK 5-8: CONTRIBUTING
- Own first real project
- Present at team meeting
- Pair programming sessions
- Code reviews (giving and receiving)
- Start participating in on-call rotation

WEEK 9-12: OWNING
- Fully ramped on team processes
- Leading projects independently
- Mentoring newer hires
- 90-day review with manager

SUCCESS METRICS:
- Onboarding checklist: 100% complete by Week 2
- First commit: Within 3 days
- First project shipped: Within 30 days
- 90-day survey: >4.5/5 satisfaction
- Retention: >95% at 90 days
```

---

## Performance Management

### Continuous Feedback Model

```
OLD MODEL (Annual Reviews):
- Once-per-year rating
- Surprises in December
- Demotivating for underperformers
- Too late to course-correct

NEW MODEL (Continuous Feedback):
- Weekly 1-on-1s (manager + employee)
- Monthly skip-level (employee + manager's manager)
- Quarterly performance reviews
- Real-time feedback (via Slack, email, in-person)
- 360-degree feedback (peers, reports, cross-functional)

WEEKLY 1-ON-1 TEMPLATE:
1. How are you doing? (personal, mental health check)
2. What did you accomplish this week?
3. What are you working on next week?
4. Any blockers I can help remove?
5. Feedback (both directions)
6. Career development (long-term goals)

Duration: 30 minutes
Frequency: Every week, same day/time
Owner: Manager (prepares agenda)
```

### Performance Improvement Plan (PIP)

```markdown
WHEN TO USE PIP:
- Consistent underperformance (2+ quarters)
- Behavioral issues (after coaching)
- Skill gaps that can be closed

PIP STRUCTURE (30-60-90 days):

GOAL: Get employee back to high performance OR
      Document performance issues for termination

DAY 1: PIP KICKOFF MEETING
- Present PIP document
- Explain expectations (be specific!)
- Set measurable goals
- Define support (training, mentorship, resources)
- Weekly check-ins scheduled

Example PIP Goals (Engineering):
1. Ship 3 high-quality features (defined scope)
   - Metric: 0 P0 bugs, <2 P1 bugs per feature
   
2. Improve code review quality
   - Metric: Average code review score >4/5 (from peers)
   
3. Reduce production incidents
   - Metric: 0 incidents caused by your code

WEEK 2-4 (30 DAYS):
- Weekly check-in (progress on goals)
- Manager provides detailed feedback
- Adjust support if needed

DAY 30: FIRST CHECKPOINT
- Review progress (on track / not on track)
- If not on track: Extend PIP OR terminate
- If on track: Continue to day 60

DAY 60: SECOND CHECKPOINT
- Same process

DAY 90: FINAL REVIEW
- Met goals: Exit PIP, return to normal performance reviews
- Didn't meet goals: Termination

SUCCESS RATE:
- Industry: ~20% successfully exit PIP
- Best companies: ~40% (better support, clearer goals)

LEGAL PROTECTION:
- Document everything (email summaries after each meeting)
- Fair and consistent (apply same standards to everyone)
- Reasonable goals (achievable with effort)
- Adequate support (training, resources, time)
```

---

## Compensation & Benefits

### Compensation Bands

```
ENGINEERING LEVELS (Total Compensation):

L3 (Junior):
- Base: $90K - $120K
- Equity: $20K - $40K (4-year vest)
- Total: $110K - $160K

L4 (Mid-Level):
- Base: $130K - $160K
- Equity: $40K - $80K
- Total: $170K - $240K

L5 (Senior):
- Base: $170K - $210K
- Equity: $80K - $150K
- Total: $250K - $360K

L6 (Staff):
- Base: $220K - $270K
- Equity: $150K - $300K
- Total: $370K - $570K

L7 (Principal):
- Base: $280K - $350K
- Equity: $300K - $600K
- Total: $580K - $950K

PHILOSOPHY:
- Pay at 75th percentile (competitive but not highest)
- More equity at senior levels (align incentives)
- Transparent bands (published internally)
- Regular market adjustments (annually)
```

### Benefits Package

```markdown
HEALTH & WELLNESS:
- Medical: 100% premium covered (employee + family)
- Dental & Vision: 100% covered
- Mental health: Unlimited therapy sessions ($0 copay)
- Gym membership: $100/month stipend
- Annual health screening: Fully paid

TIME OFF:
- Unlimited PTO (minimum 15 days encouraged)
- Parental leave: 16 weeks (primary), 8 weeks (secondary)
- Sick leave: Unlimited
- Sabbatical: 4 weeks after 5 years

FINANCIAL:
- 401(k) matching: 100% up to 6% of salary
- HSA contribution: $1,500/year
- Financial planning: Free advisor access
- Student loan repayment: $5,000/year (up to $50K total)

PROFESSIONAL DEVELOPMENT:
- Learning budget: $2,000/year (books, courses, conferences)
- Conference travel: Approved on case-by-case
- Tuition reimbursement: $10,000/year (graduate programs)

PERKS:
- Work from home stipend: $1,000 (one-time setup)
- Commuter benefits: $300/month (pre-tax)
- Team offsites: 2x per year
- Free lunch: Monday, Wednesday, Friday
- Snacks & drinks: Unlimited
```

---

## Diversity, Equity & Inclusion (DEI)

### DEI Goals & Metrics

```
REPRESENTATION GOALS (by 2026):
- Overall workforce: 40%+ underrepresented groups
- Leadership (VP+): 30%+ underrepresented groups
- Technical roles: 35%+ underrepresented groups
- Pay equity: <5% gap for same role/level

CURRENT STATE (2025):
- Overall: 32% underrepresented groups
- Leadership: 20%
- Technical: 28%
- Pay gap: 3% (within acceptable range)

INITIATIVES:
1. DIVERSE SOURCING
   - Partner with HBCUs, Hispanic-Serving Institutions
   - Women in Tech programs
   - Veteran hiring program
   - Referral bonuses: +50% for diverse candidates

2. INCLUSIVE HIRING
   - Diverse interview panels (at least 1 underrepresented interviewer)
   - Blind resume reviews (remove names, schools)
   - Standardized questions (reduce bias)

3. RETENTION & ADVANCEMENT
   - ERGs (Employee Resource Groups): 6 active groups
   - Mentorship program (match underrepresented employees with senior leaders)
   - Sponsorship program (leaders advocate for high-potential diverse talent)
   - DEI training: Mandatory for all employees (2x per year)

4. PAY EQUITY AUDITS
   - Semi-annual compensation review
   - Adjust salaries if >5% gap found
   - Transparent process (employees can request review)
```

---

## Employee Engagement

### Pulse Surveys

```python
# Quarterly engagement survey
questions = [
    {
        'question': 'I would recommend [Company] as a great place to work',
        'type': '1-10 scale',  # eNPS (Employee Net Promoter Score)
    },
    {
        'question': 'I have the tools and resources to do my job effectively',
        'type': '1-5 scale',
    },
    {
        'question': 'My manager supports my career development',
        'type': '1-5 scale',
    },
    {
        'question': 'I understand how my work contributes to company goals',
        'type': '1-5 scale',
    },
    {
        'question': 'What would make [Company] an even better place to work?',
        'type': 'open-ended',
    }
]

# Calculate eNPS
def calculate_enps(scores):
    """
    Promoters (9-10): Enthusiastic
    Passives (7-8): Satisfied but not loyal
    Detractors (0-6): Unhappy
    
    eNPS = (% Promoters) - (% Detractors)
    """
    promoters = sum(1 for s in scores if s >= 9) / len(scores)
    detractors = sum(1 for s in scores if s <= 6) / len(scores)
    
    enps = (promoters - detractors) * 100
    
    # Benchmarks:
    # >50: Excellent
    # 30-50: Good
    # 10-30: Needs improvement
    # <10: Crisis
    
    return enps

# Example:
scores = [9, 10, 8, 9, 7, 10, 6, 9, 8, 10]  # 10 employee responses
enps = calculate_enps(scores)
print(f"eNPS: {enps}")  # Output: eNPS: 50 (Excellent)
```

### Retention Strategies

```markdown
HIGH-RISK FLIGHT FACTORS:
1. No promotion in 2+ years
2. Below-market compensation
3. Low engagement scores (<3/5)
4. Recent negative feedback
5. Manager turnover
6. Reduced responsibilities

RETENTION PLAYBOOK:

TIER 1: CRITICAL TALENT (Top 10%)
- Quarterly skip-level 1-on-1 with VP/C-level
- Equity refresh (annual, proactive)
- Custom career path (accelerated promotion track)
- Special projects (high-visibility, growth opportunities)
- Compensation: 90th percentile

TIER 2: HIGH PERFORMERS (Next 20%)
- Semi-annual career development conversations
- Mentorship program
- Leadership training
- Compensation: 75th percentile

TIER 3: SOLID PERFORMERS (Next 60%)
- Annual performance reviews
- Standard benefits
- Compensation: 50-75th percentile

TIER 4: UNDERPERFORMERS (Bottom 10%)
- PIP or exit
- Focus retention efforts on Tiers 1-3

PREEMPTIVE RETENTION:
- Stay interviews (not just exit interviews)
  * "What would make you leave?"
  * "What keeps you here?"
  * "What can we improve?"
- Quarterly compensation reviews (adjust before they ask)
- Career pathing (show them the future here)
```

---

## Offboarding & Exit Interviews

### Exit Interview Template

```markdown
WHEN: Last week of employment
WHO: HR, not their manager (more candid)
FORMAT: 30-minute 1-on-1

QUESTIONS:

1. Why did you decide to leave?
   (Listen for: compensation, manager, career growth, culture)

2. What did you enjoy most about working here?
   (Capture positives to amplify)

3. What would you change about [Company]?
   (Actionable feedback)

4. How was your relationship with your manager?
   (Red flag if many people cite same manager)

5. Did you feel you had growth opportunities?
   (Career development gap?)

6. Would you recommend [Company] to a friend?
   (NPS for departing employees)

7. What could we have done to keep you?
   (Retention insights)

DATA ANALYSIS:
- Track trends (top 3 reasons for leaving)
- Manager-specific issues (if 3+ cite same manager → investigate)
- Compensation benchmarking (are we losing people to higher pay?)
- Action items (share quarterly with leadership)

RETENTION IMPACT:
- Companies that act on exit interview feedback: 15% lower turnover
- Companies that ignore it: No improvement
```

---

## Key Takeaways

1. **Hire slow, fire fast** - Bad hires are expensive
2. **Continuous feedback > annual reviews** - No surprises
3. **Pay fairly, transparently** - Comp issues cause 30% of turnover
4. **Invest in DEI** - Diverse teams perform 35% better
5. **Listen to employees** - Pulse surveys, skip-levels, stay interviews

---

## References

- "Work Rules!" - Laszlo Bock (Google)
- "Powerful" - Patty McCord (Netflix)
- SHRM HR Benchmarks
- Glassdoor Employer Branding Guide

**Related**: `talent-acquisition.md`, `compensation-strategy.md`, `culture-building.md`
