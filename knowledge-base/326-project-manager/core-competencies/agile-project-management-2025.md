# Agile Project Management 2025

**Updated**: 2025-11-23 | **Focus**: Scrum, Kanban, Stakeholder Management

---

## Agile Methodologies

### Scrum Framework

```
ROLES:

PRODUCT OWNER (1 person):
- Owns product backlog
- Prioritizes features (ROI, business value)
- Accepts/rejects work
- Stakeholder liaison

SCRUM MASTER (1 person):
- Facilitates ceremonies
- Removes impediments
- Coaches team on agile practices
- Shields team from distractions
- NOT a project manager (no command/control)

DEVELOPMENT TEAM (5-9 people):
- Cross-functional (devs, designers, testers)
- Self-organizing
- Collectively accountable
- No titles/sub-teams

---

CEREMONIES:

SPRINT PLANNING (2-4 hours):
- When: First day of sprint
- Attendees: Entire team
- Goal: Commit to sprint backlog
- Activities:
  1. PO presents top priorities
  2. Team estimates & commits to realistic amount
  3. Team breaks down stories into tasks
- Output: Sprint goal, sprint backlog

DAILY STANDUP (15 min):
- When: Every day, same time
- Attendees: Development team (PO/SM optional)
- Format (each person):
  * What I did yesterday
  * What I'm doing today
  * Any blockers?
- NOT status report (quick sync, identify impediments)
- Stand up (literally) to keep it short

SPRINT REVIEW/DEMO (1-2 hours):
- When: Last day of sprint
- Attendees: Team + stakeholders
- Activities:
  * Demo completed work (working software only)
  * Stakeholder feedback
  * PO accepts/rejects stories
- NOT a "ta-da!" presentation (working session)

SPRINT RETROSPECTIVE (1 hour):
- When: After sprint review
- Attendees: Development team + Scrum Master
- Format:
  * What went well? (keep doing)
  * What didn't go well? (stop doing)
  * What should we try? (action items)
- Output: 1-3 concrete improvements for next sprint
- Safe space (no blame, focus on process)

BACKLOG REFINEMENT (1 hour/week):
- Ongoing activity (not formal ceremony)
- PO + team
- Clarify upcoming stories
- Break down epics
- Estimate stories
- Goal: Top of backlog always ready for sprint planning

---

ARTIFACTS:

PRODUCT BACKLOG:
- Prioritized list of features
- Living document (constantly evolving)
- Ordered by value (top = highest priority)
- Example:
  | Story | Priority | Estimate | Status |
  |-------|----------|----------|--------|
  | User login | High | 8 | Done |
  | Password reset | High | 5 | In Progress |
  | Profile page | Medium | 13 | To Do |

SPRINT BACKLOG:
- Stories team commits to for current sprint
- Tasks broken down from stories
- Updated daily

INCREMENT:
- Sum of all backlog items completed during sprint
- Must be "done" (potentially shippable)

---

DEFINITION OF DONE (DoD):
Example:
✅ Code complete
✅ Unit tests written & passing
✅ Code reviewed & approved
✅ Deployed to staging
✅ QA tested (no critical bugs)
✅ Documentation updated
✅ PO acceptance

→ Story not "done" until ALL criteria met
```

---

## User Stories

```markdown
FORMAT:
"As a [user type], I want [goal], so that [benefit]"

GOOD EXAMPLES:

"As a customer, I want to reset my password via email, 
so that I can regain access to my account if I forget it."

"As an admin, I want to export user data to CSV, 
so that I can analyze it in Excel."

"As a developer, I want API documentation, 
so that I can integrate with the service."

ACCEPTANCE CRITERIA (Given-When-Then):

Story: Password reset

Given I'm on the login page
When I click "Forgot password" and enter my email
Then I receive a reset link within 5 minutes

Given I click the reset link
When I enter a new password (min 8 characters)
Then my password is updated and I'm logged in

Given the reset link is >24 hours old
When I click it
Then I see "Link expired" message

---

INVEST CRITERIA (Good stories):
I - Independent (can be developed in any order)
N - Negotiable (not a contract, details flexible)
V - Valuable (delivers value to user)
E - Estimable (team can size it)
S - Small (fits in one sprint)
T - Testable (clear acceptance criteria)

BAD STORIES:
❌ "Improve performance" (not specific, not testable)
❌ "Build entire checkout flow" (too big)
❌ "Refactor code" (no user value)

BETTER:
✅ "Reduce page load time to <2 seconds"
✅ "User can add items to cart"
✅ "User can apply promo code at checkout"
```

---

## Estimation

```markdown
STORY POINTS (Relative sizing):

FIBONACCI SEQUENCE: 1, 2, 3, 5, 8, 13, 21
(Larger stories = more uncertainty)

REFERENCE STORIES:
- 1 point: Simple config change (30 min)
- 3 points: Basic CRUD feature (4-6 hours)
- 5 points: Medium feature (1 day)
- 8 points: Complex feature (2 days)
- 13 points: Very complex (3-4 days)
- 21+ points: Epic (break down!)

PLANNING POKER:
1. PO reads story
2. Team discusses & asks questions
3. Each person privately picks card (1, 2, 3, 5, 8, 13)
4. Reveal simultaneously
5. If consensus → done
6. If not → highest & lowest explain reasoning, revote
7. Repeat until consensus

AVOID:
❌ Equating points to hours (not 1 point = 1 hour)
❌ Comparing velocity between teams (points are relative)
❌ Using points for performance reviews (kills honesty)

---

T-SHIRT SIZING (High-level):
XS, S, M, L, XL
- Faster for rough estimates
- Good for roadmap planning
- Later refined to story points

---

VELOCITY:
Average story points completed per sprint

Example:
- Sprint 1: 25 points
- Sprint 2: 30 points
- Sprint 3: 28 points
Average velocity: 27-28 points/sprint

Use for forecasting:
- 135 points remaining ÷ 28 velocity = ~5 sprints

WARNING:
- Velocity stabilizes after 3-4 sprints
- Don't artificially inflate (defeats purpose)
- Use for planning, not performance metric
```

---

## Kanban

```markdown
KANBAN BOARD:

┌────────┬───────────────┬─────────────┬──────────┬──────┐
│ Backlog│   To Do       │ In Progress │ Review   │ Done │
├────────┼───────────────┼─────────────┼──────────┼──────┤
│ Story A│ Story B [3]   │ Story C [2] │ Story D  │Story │
│ Story E│ Story F [1]   │ Story G [1] │          │  H   │
│ Story I│               │             │          │Story │
│        │               │             │          │  J   │
└────────┴───────────────┴─────────────┴──────────┴──────┘
         [WIP Limit: 3]  [WIP Limit: 2]

WIP (Work In Progress) LIMITS:
- Max items allowed in each column
- Prevents overloading
- Forces finishing before starting new work
- Example: "In Progress" limited to 2 items
  → If 2 items already there, must finish one before pulling new

FLOW METRICS:

CYCLE TIME:
- Time from "In Progress" → "Done"
- Average: 3 days = healthy
- Outliers: >10 days = investigate

LEAD TIME:
- Time from "Backlog" → "Done"
- Includes waiting time
- Longer than cycle time

THROUGHPUT:
- Items completed per week
- Example: 15 items/week

CUMULATIVE FLOW DIAGRAM (CFD):
- Stacked area chart showing work in each stage over time
- Stable = healthy flow
- Bulge in "In Progress" = bottleneck

---

KANBAN vs SCRUM:

KANBAN:
✅ Continuous flow (no sprints)
✅ Flexible priorities (can change anytime)
✅ No estimations required
✅ Good for: Support, maintenance, ops
❌ Less structure (needs discipline)

SCRUM:
✅ Timeboxed sprints (predictability)
✅ Clear ceremonies (structure)
✅ Sprint goal (focus)
✅ Good for: Product development
❌ Less flexible (can't change mid-sprint)

SCRUMBAN:
- Hybrid: Kanban board + Scrum ceremonies
- Best of both worlds
```

---

## Stakeholder Management

```markdown
STAKEHOLDER MAP:

HIGH POWER, HIGH INTEREST (Manage Closely):
- CEO, VP, key customers
- Frequent updates, involve in decisions

HIGH POWER, LOW INTEREST (Keep Satisfied):
- CFO, legal
- Periodic updates, don't overwhelm

LOW POWER, HIGH INTEREST (Keep Informed):
- End users, support team
- Regular communication, demos

LOW POWER, LOW INTEREST (Monitor):
- Distant teams, minimal involvement

---

COMMUNICATION PLAN:

WEEKLY:
- Team: Daily standups, slack updates
- Manager: 1-on-1 (15 min)
- Stakeholders: Status email (dashboard link)

BI-WEEKLY:
- Stakeholders: Sprint demo (30 min)

MONTHLY:
- Executives: Roadmap review (30 min)
- All-hands: Progress presentation (15 min)

AD-HOC:
- Blockers/risks: Immediate escalation
- Scope changes: Decision meeting

DASHBOARD (Real-time visibility):
- Burndown chart
- Velocity trend
- Feature completion %
- Key metrics (uptime, bugs, etc.)

---

MANAGING SCOPE CREEP:

WHEN STAKEHOLDER REQUESTS NEW FEATURE:

BAD:
❌ "Sure, we'll add it!" (overcommit)
❌ "No, we're too busy" (dismissive)

GOOD:
✅ "Great idea! Let's add it to the backlog. 
   We can prioritize it relative to other features.
   If it's urgent, what should we deprioritize?"

CHANGE REQUEST PROCESS:
1. Document request (what, why, who)
2. Impact analysis (effort, cost, timeline)
3. Present options to stakeholders:
   - Option A: Add to backlog (next quarter)
   - Option B: Swap with existing feature
   - Option C: Extend timeline (more budget)
4. Stakeholder decides
5. Update plan

PROTECT YOUR TEAM:
- Shield from constant interruptions
- Push back on unrealistic deadlines
- Say "no" to protect quality
```

---

## Risk Management

```markdown
RISK REGISTER:

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Key developer leaves | Medium | High | Knowledge sharing, documentation | PM |
| Vendor delays API | Low | High | Have backup plan, early integration | Tech Lead |
| Scope creep | High | Medium | Clear requirements, change control | PM |
| Technical debt | High | Medium | Reserve 20% capacity for refactoring | Eng Manager |

PROBABILITY:
- High: >50%
- Medium: 20-50%
- Low: <20%

IMPACT:
- High: Delays >1 month or >$100K
- Medium: Delays 1-4 weeks or $10K-100K
- Low: <1 week or <$10K

MITIGATION STRATEGIES:
- Avoid: Change plan to eliminate risk
- Transfer: Insurance, outsource
- Mitigate: Reduce probability or impact
- Accept: Monitor, have contingency plan

---

RED FLAGS (Escalate immediately):
🚩 Team velocity dropping 20%+ 
🚩 Critical path item blocked >3 days
🚩 Key team member burnout
🚩 Stakeholder disengagement
🚩 Quality declining (bugs increasing)
```

---

## Key Takeaways

1. **Deliver value incrementally** - Working software every sprint
2. **Inspect & adapt** - Retrospectives drive continuous improvement
3. **Empower the team** - Self-organizing, not command/control
4. **Communicate transparently** - Visibility = trust
5. **Focus on outcomes** - Not activity or busy-work

---

## References

- "Scrum Guide" - Schwaber & Sutherland
- "User Story Mapping" - Jeff Patton
- "Agile Estimating and Planning" - Mike Cohn

**Related**: `scrum-master-guide.md`, `product-ownership.md`, `agile-metrics.md`
