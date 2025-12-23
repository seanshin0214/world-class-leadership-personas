# SRE & Incident Management 2025

**Updated**: 2025-11-23 | **Focus**: Reliability, Monitoring, On-Call

---

## SRE Principles

```markdown
ERROR BUDGETS:

SLO (Service Level Objective): 99.9% uptime
= 43.2 minutes downtime/month allowed

ERROR BUDGET = 1 - SLO = 0.1% = 43.2 min/month

POLICY:
- If error budget > 0: Ship new features
- If error budget exhausted: Freeze deploys, focus on reliability

CALCULATION:
Month uptime: 99.85%
SLO: 99.9%
Budget used: (99.9 - 99.85) / 0.1 = 50%
Remaining budget: 21.6 minutes

---

TOIL:

DEFINITION: Manual, repetitive, automatable work

EXAMPLES:
- Manually restarting services
- Updating configuration files
- Ticket triaging
- Capacity planning

TARGET: <50% of SRE time on toil
- Remaining 50%: Automation, improvements, projects

REDUCING TOIL:
- Automate deployments (CI/CD)
- Self-service tooling
- Runbooks → scripts
- Alerts → auto-remediation

---

BLAMELESS POSTMORTEMS:

FOCUS: Learn, not punish
- What happened?
- Why did it happen? (root cause)
- How do we prevent it? (action items)

NOT:
❌ "John deployed bad code"

INSTEAD:
✅ "Deploy lacked proper testing. Action: Add integration tests to CI"
```

---

## SLIs, SLOs, SLAs

```markdown
SLI (Service Level Indicator): Measurement

EXAMPLES:
- Request latency: % requests < 200ms
- Availability: % successful requests
- Throughput: Requests/second
- Error rate: % requests returning 5xx

---

SLO (Service Level Objective): Target

EXAMPLES:
- 99.9% of requests succeed
- 95% of requests < 200ms latency
- API available 99.95% of time

CHOOSING SLOs:
- Too strict (99.999%): Expensive, slow innovation
- Too loose (95%): Unhappy users
- Right fit: Balance cost & user experience

---

SLA (Service Level Agreement): Contract

EXAMPLE:
"We guarantee 99.9% uptime. If we fail, you get credit:
- 99.0-99.9%: 10% credit
- 98.0-99.0%: 25% credit
- <98.0%: 100% credit"

SLA < SLO (buffer):
- SLO: 99.9%
- SLA: 99.0%
- Buffer: 0.9% (avoid SLA violations)

---

MEASURING SLIs:

# Python (Prometheus client)
from prometheus_client import Counter, Histogram

# Request counter
requests_total = Counter(
    'requests_total',
    'Total requests',
    ['method', 'endpoint', 'status']
)

# Latency histogram
request_duration = Histogram(
    'request_duration_seconds',
    'Request duration',
    ['endpoint']
)

# Instrument code
@app.route('/api/users')
def get_users():
    with request_duration.labels(endpoint='/api/users').time():
        requests_total.labels(method='GET', endpoint='/api/users', status=200).inc()
        return get_users_from_db()

# Query in Prometheus:
# Success rate (last 30 days):
sum(rate(requests_total{status=~"2.."}[30d])) 
/ 
sum(rate(requests_total[30d])) 
* 100

# p95 latency:
histogram_quantile(0.95, 
  rate(request_duration_seconds_bucket[5m])
)
```

---

## Monitoring & Alerting

```markdown
THE FOUR GOLDEN SIGNALS:

LATENCY:
- Time to serve request
- Measure: p50, p95, p99
- Why: User experience

TRAFFIC:
- Requests/second
- Measure: QPS (queries per second)
- Why: Capacity planning

ERRORS:
- Failed requests (%)
- Measure: 4xx, 5xx responses
- Why: Reliability

SATURATION:
- Resource utilization (CPU, memory, disk)
- Measure: % used
- Why: Prevent outages

---

ALERTING BEST PRACTICES:

ACTIONABLE:
❌ "CPU >80%" (So what?)
✅ "CPU >80% for 5 min → Autoscale or page oncall"

LOW FALSE POSITIVES:
- Tune thresholds (avoid alert fatigue)
- Use time windows (transient spikes ok)
- Example: Alert if error rate >1% for 10 minutes

CLEAR SEVERITY:

P0 (Critical):
- User-facing outage
- Page immediately (wake up oncall)
- Example: API down, payment processing broken

P1 (High):
- Degraded performance
- Page during business hours
- Example: Slow response times, increased errors

P2 (Medium):
- Warning, not urgent
- Ticket, no page
- Example: Disk 80% full (will be full in 3 days)

P3 (Low):
- FYI, no action needed
- Log only
- Example: Cache hit rate slightly lower

---

ALERT EXAMPLE (Prometheus):

groups:
- name: api_alerts
  rules:
  - alert: HighErrorRate
    expr: |
      (
        sum(rate(requests_total{status=~"5.."}[5m]))
        /
        sum(rate(requests_total[5m]))
      ) > 0.01
    for: 10m
    labels:
      severity: critical
    annotations:
      summary: "High error rate on API"
      description: "Error rate is {{ $value | humanizePercentage }} (threshold 1%)"
      runbook: "https://wiki.company.com/runbooks/high-error-rate"

  - alert: HighLatency
    expr: |
      histogram_quantile(0.95,
        rate(request_duration_seconds_bucket[5m])
      ) > 0.5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "API p95 latency >500ms"
      runbook: "https://wiki.company.com/runbooks/high-latency"
```

---

## Incident Response

```markdown
INCIDENT LIFECYCLE:

DETECTION (T+0):
- Alert fires
- User report
- Monitoring dashboard

RESPONSE (T+5 min):
- Oncall engineer paged
- Acknowledge alert
- Begin investigation

MITIGATION (T+15 min):
- Stop the bleeding (rollback, failover)
- Restore service
- NOT root cause fix (that's later)

RESOLUTION (T+30 min):
- Confirm service restored
- All-clear

POSTMORTEM (T+2 days):
- Write incident report
- Blameless analysis
- Action items

PREVENTION (T+2 weeks):
- Implement action items
- Verify fixes

---

INCIDENT ROLES:

INCIDENT COMMANDER (IC):
- Leads response
- Makes decisions
- Coordinates team

COMMUNICATIONS LEAD:
- Updates stakeholders
- Posts in #incidents Slack channel
- Updates status page

TECH LEAD:
- Debugging
- Implements fixes
- Runs commands

SCRIBE:
- Documents timeline
- Takes notes
- Records actions taken

---

INCIDENT COMMUNICATION:

INITIAL MESSAGE (5 min):
"🚨 Incident: API Down
Severity: P0
Impact: All users unable to login
Status: Investigating
IC: @alice"

UPDATE (every 15-30 min):
"Update: Identified database connection issue. 
Rolling back deploy. ETA 10 minutes."

RESOLUTION:
"✅ Resolved: Service restored. 
Cause: Database connection pool exhausted.
Postmortem: [link]"

STATUS PAGE:
- Investigating
- Identified
- Monitoring
- Resolved
```

---

## On-Call

```markdown
ON-CALL SCHEDULE:

ROTATION:
- 1 week shifts (Mon 9am → Mon 9am)
- Primary + Secondary (backup)
- No more than 1 week/month per person

HANDOFF:
- Monday morning meeting
- Review open issues
- Ongoing incidents
- Known problems

ESCALATION:
- L1 (Tier 1): Common issues, documented fixes
- L2 (SRE): Complex issues, require deep knowledge
- L3 (Engineering): Code changes needed

---

ON-CALL BEST PRACTICES:

DURING ON-CALL:
✅ Laptop charged, with you
✅ Phone volume on (even at night)
✅ Sober (no alcohol)
✅ Near reliable internet
❌ Traveling to remote area
❌ Activities that require full attention

RESPONDING TO PAGE:
1. Acknowledge (5 min)
2. Assess severity (P0 or false positive?)
3. Page backup if needed
4. Begin investigation
5. Update stakeholders

RUNBOOKS:
- Step-by-step procedures
- Common issues & fixes
- Example: "API returning 500s"
  1. Check service logs
  2. Check database connections
  3. If DB down, failover to replica
  4. If still failing, roll back last deploy

---

ON-CALL COMPENSATION:

PAY:
- Hourly rate while oncall (even if no pages)
- Higher rate for pages (2x-3x)
- Time off in lieu (TOIL) next week

LIMITS:
- Max 2 pages/night (excessive = process problem)
- Max 50% of time oncall (more = need more people)
- Mandatory day off after sleepless night

---

PREVENTING BURNOUT:

ROTATE FREQUENTLY:
- 1 week max
- Fair distribution

REDUCE TOIL:
- Automate common alerts
- Improve reliability (fewer pages)

POSTMORTEMS:
- Learn from incidents
- Prevent recurrence

SUPPORT:
- Mental health resources
- Peer support
- Manager check-ins
```

---

## Chaos Engineering

```markdown
DEFINITION: Intentionally inject failures to test resilience

PRINCIPLES:
1. Hypothesize steady state
2. Vary real-world events (failures)
3. Run in production (with safeguards!)
4. Automate experiments

TOOLS:
- Chaos Monkey (Netflix): Randomly kill instances
- Chaos Kong: Kill entire region
- Litmus Chaos: Kubernetes chaos
- Gremlin: Managed chaos platform

---

EXPERIMENTS:

LATENCY INJECTION:
- Add 500ms delay to 10% of requests
- Hypothesis: System gracefully degrades

CPU STRESS:
- Max out CPU on 1 instance
- Hypothesis: Autoscaler adds capacity

NETWORK PARTITION:
- Block traffic between services
- Hypothesis: Services fail over

KILL INSTANCE:
- Terminate random EC2 instance
- Hypothesis: Traffic routes to healthy instances

---

SAFETY:
- Start small (dev/staging first)
- Blast radius (limit % affected)
- Kill switch (abort if issues)
- Business hours (engineers available)
- Communication (warn team)

RESULTS:
- Found: DB failover took 5 minutes (too slow)
- Action: Improve failover to <30 seconds
- Outcome: More reliable system
```

---

## Key Takeaways

1. **Measure everything** - SLIs, error budgets, toil
2. **Automate toil** - Free time for improvements
3. **Blameless culture** - Learn from incidents, don't punish
4. **Sustainable oncall** - Rotate, compensate, support
5. **Continuous improvement** - Postmortems → action items

---

## References

- "Site Reliability Engineering" - Google
- "The Site Reliability Workbook" - Google
- Increment (magazine on reliability)

**Related**: `prometheus-monitoring.md`, `kubernetes-sre.md`, `incident-postmortems.md`
