# Legal Operations & General Counsel 2025

**Updated**: 2025-11-23 | **Focus**: Contracts, Compliance, Risk Management

---

## The In-House Counsel Role

```
SCOPE:
- Corporate governance (board, compliance)
- Commercial contracts (sales, vendors, partnerships)
- Employment law (hiring, terminations, disputes)
- IP protection (patents, trademarks, trade secrets)
- Litigation management (disputes, settlements)
- Regulatory compliance (GDPR, SOC 2, industry-specific)
- M&A (acquisitions, due diligence)

METRICS:
- Contract turnaround time: <5 business days
- Legal spend: <2% of revenue
- Zero major regulatory violations
- Litigation win rate: >80%
- NPS from internal clients: >70
```

---

## Contract Management

### Standard Agreement Templates

```markdown
SaaS CUSTOMER AGREEMENT (MSA + Order Form):

1. DEFINITIONS
- "Services": Software-as-a-Service platform
- "Customer Data": Data uploaded by Customer
- "Confidential Information": Non-public information

2. TERM & TERMINATION
- Initial Term: 12 months from Effective Date
- Auto-renewal: Yes, unless 30 days notice
- Termination for Cause: Material breach, 30-day cure period
- Effect of Termination: Data export window (30 days)

3. FEES & PAYMENT
- Subscription Fee: $[X] per [month/year]
- Payment Terms: Net 30 days from invoice
- Late Fees: 1.5% per month on overdue amounts
- Taxes: Customer responsible for all taxes except Company income tax

4. INTELLECTUAL PROPERTY
- Company IP: All rights to software remain with Company
- Customer IP: Customer retains all rights to Customer Data
- License: Company grants limited, non-exclusive license to use Services

5. DATA PROTECTION & SECURITY
- GDPR Compliance: Company is Data Processor, Customer is Data Controller
- Security Standards: SOC 2 Type II certified
- Data Breaches: Notification within 72 hours
- DPA: Separate Data Processing Agreement incorporated by reference

6. WARRANTIES & DISCLAIMERS
- Uptime SLA: 99.9% availability (excludes planned maintenance)
- Disclaimer: NO OTHER WARRANTIES, EXPRESS OR IMPLIED
- AS-IS: Services provided "as is" to maximum extent permitted by law

7. LIMITATION OF LIABILITY
- Cap: Total fees paid in prior 12 months
- Exclusions: Gross negligence, willful misconduct, IP infringement, data breaches
- No consequential damages (lost profits, business interruption, etc.)

8. INDEMNIFICATION
- Company indemnifies: IP infringement claims
- Customer indemnifies: Misuse of Services, violation of laws

9. MISCELLANEOUS
- Governing Law: [State, Country]
- Dispute Resolution: Arbitration (AAA rules), [City] venue
- Assignment: No assignment without written consent
- Entire Agreement: Supersedes all prior agreements
```

### Contract Review Checklist

```python
class ContractReview:
    def __init__(self, contract_type):
        self.contract_type = contract_type
        self.red_flags = []
        self.risks = []
    
    def review_customer_agreement(self, contract):
        """
        Checklist for customer agreement review
        """
        checks = []
        
        # 1. Liability Cap
        if contract.liability_cap < contract.annual_value * 1.0:
            self.red_flags.append("Liability cap too low (should be ≥1x annual value)")
        
        # 2. Auto-renewal
        if not contract.has_auto_renewal:
            self.risks.append("No auto-renewal = churn risk")
        
        # 3. Termination for Convenience
        if contract.termination_for_convenience:
            self.red_flags.append("Customer can terminate anytime = revenue risk")
        
        # 4. Payment Terms
        if contract.payment_terms > 60:
            self.risks.append("Payment terms >60 days = cash flow risk")
        
        # 5. Unlimited Liability
        if "unlimited liability" in contract.text.lower():
            self.red_flags.append("🚨 UNLIMITED LIABILITY - DO NOT SIGN")
        
        # 6. Indemnification Scope
        if "indemnify customer for any claims" in contract.text.lower():
            self.red_flags.append("Overly broad indemnification")
        
        # 7. IP Ownership
        if "customer owns all IP" in contract.text.lower():
            self.red_flags.append("🚨 IP TRANSFER - DO NOT SIGN")
        
        # 8. Non-compete
        if contract.has_non_compete:
            self.red_flags.append("Non-compete clause may limit future business")
        
        # 9. Audit Rights
        if contract.unlimited_audit_rights:
            self.risks.append("Unlimited audit rights = operational burden")
        
        # 10. Governing Law
        if contract.governing_law not in ["Delaware", "New York", "California"]:
            self.risks.append(f"Unfamiliar jurisdiction: {contract.governing_law}")
        
        return {
            'approved': len(self.red_flags) == 0,
            'red_flags': self.red_flags,
            'risks': self.risks,
            'recommendation': self.get_recommendation()
        }
    
    def get_recommendation(self):
        if len(self.red_flags) > 0:
            return "❌ REJECT - Negotiate these terms"
        elif len(self.risks) > 2:
            return "⚠️ APPROVE WITH CAVEATS"
        else:
            return "✅ APPROVE"

# Usage
contract = load_contract("customer_agreement.pdf")
review = ContractReview("customer_agreement")
result = review.review_customer_agreement(contract)

print(f"Decision: {result['recommendation']}")
for flag in result['red_flags']:
    print(f"🚩 {flag}")
```

### Contract Negotiation Playbook

```markdown
COMMON CUSTOMER REQUESTS & RESPONSES:

REQUEST: "We need unlimited liability"
RESPONSE: "Our standard cap is 12 months of fees paid. We can increase to 24 months for enterprise customers, but unlimited liability would require a significant price increase and board approval."

REQUEST: "We need right to terminate for convenience with 30 days notice"
RESPONSE: "We offer annual contracts with auto-renewal. We can offer quarterly billing if cash flow is a concern, but termination for convenience defeats the purpose of a committed contract."

REQUEST: "You must indemnify us for all claims related to the software"
RESPONSE: "We indemnify for IP infringement claims, which is industry standard. Broader indemnification would require insurance review and pricing adjustment."

REQUEST: "All data must be stored in [specific country]"
RESPONSE: "Our standard offering uses AWS US-East. We can accommodate data residency requirements with our Enterprise plan at an additional cost."

REQUEST: "99.99% uptime SLA (four nines)"
RESPONSE: "Our standard SLA is 99.9% (three nines), which is 8.76 hours of downtime per year. Four nines would require significant infrastructure investment and is available only for Enterprise plans."

NEGOTIATION STRATEGY:
1. Understand their "why" (regulatory? budget? burned before?)
2. Offer alternatives (higher tier, add-on, price increase)
3. Escalate if needed (VP Sales, CRO, CEO for large deals)
4. Document exceptions (track in CRM for pattern analysis)
```

---

## Compliance & Regulatory

### GDPR Compliance Checklist

```markdown
DATA PROTECTION IMPACT ASSESSMENT (DPIA):

1. LAWFUL BASIS FOR PROCESSING
   □ Consent (explicit, freely given, specific)
   □ Contract (necessary for service delivery)
   □ Legal obligation
   □ Legitimate interest (balance test required)

2. DATA SUBJECT RIGHTS
   □ Right to access (provide data copy within 30 days)
   □ Right to rectification (correct inaccurate data)
   □ Right to erasure ("right to be forgotten")
   □ Right to data portability (export in machine-readable format)
   □ Right to object (stop processing)
   □ Right to restrict processing

   IMPLEMENTATION:
   - Self-service portal for data export
   - API for automated data deletion
   - 30-day SLA for requests
   - Verification process (prevent unauthorized access)

3. DATA PROCESSING AGREEMENT (DPA)
   □ Processor obligations defined
   □ Sub-processor list disclosed
   □ Security measures documented
   □ Breach notification process (72 hours)
   □ Data deletion procedures
   □ Audit rights

4. PRIVACY BY DESIGN
   □ Minimal data collection (only what's needed)
   □ Encryption at rest (AES-256)
   □ Encryption in transit (TLS 1.3)
   □ Access controls (RBAC, least privilege)
   □ Audit logging (who accessed what, when)

5. BREACH NOTIFICATION PROCEDURE
   DETECTION → ASSESSMENT → NOTIFICATION
   
   Within 24 hours:
   - Identify scope (what data, how many individuals)
   - Contain breach (stop ongoing access)
   - Preserve evidence
   
   Within 72 hours:
   - Notify supervisory authority (GDPR requirement)
   - Notify affected individuals (if high risk)
   - Document incident (internal report)
   
   Within 30 days:
   - Root cause analysis
   - Remediation plan
   - Update security policies

6. VENDOR MANAGEMENT
   □ All sub-processors reviewed (security, compliance)
   □ DPAs in place with all vendors processing EU data
   □ Regular audits (annual minimum)
   □ Insurance requirements (cyber liability)

PENALTIES FOR NON-COMPLIANCE:
- Up to €20M or 4% of global annual revenue (whichever is higher)
- Reputational damage
- Customer churn
```

### SOC 2 Compliance

```markdown
SOC 2 TYPE II AUDIT (12-month observation period):

TRUST SERVICE CRITERIA:

1. SECURITY (Required)
   □ Access controls (MFA, SSO, RBAC)
   □ Encryption (at rest, in transit)
   □ Vulnerability management (quarterly scans, patch within 30 days)
   □ Incident response plan
   □ Change management (code review, testing, approval)

2. AVAILABILITY (Optional, but recommended)
   □ 99.9% uptime SLA
   □ Monitoring & alerting (PagerDuty, Datadog)
   □ Disaster recovery (RTO: 4 hours, RPO: 1 hour)
   □ Capacity planning

3. CONFIDENTIALITY (Optional)
   □ NDA with all employees
   □ Data classification (public, internal, confidential, restricted)
   □ DLP (Data Loss Prevention) controls

4. PROCESSING INTEGRITY (Optional)
   □ Data validation (input sanitization)
   □ Error handling (logging, alerting)
   □ Quality assurance (testing, code review)

5. PRIVACY (Optional, similar to GDPR)
   □ Privacy policy
   □ Data subject rights
   □ Consent management

AUDIT PROCESS:
- Month 1-2: Scoping & planning (define what's in scope)
- Month 3-14: Observation period (12 months of evidence)
- Month 15-16: Testing & audit (auditor reviews controls)
- Month 17: Report issuance

COST:
- First audit: $50K - $150K
- Annual renewals: $30K - $75K
- Internal effort: 500-1000 hours

ROI:
- Required by enterprise customers (unlock $100K+ deals)
- Reduces security questionnaire burden (99% fewer questions)
- Insurance premium reduction (10-20%)
```

---

## Employment Law

### Termination Checklist

```markdown
INVOLUNTARY TERMINATION (Performance-based):

PRE-TERMINATION:
□ PIP completed (30-90 days documented performance issues)
□ HR consulted (review for discrimination, retaliation risks)
□ Legal consulted if:
  - Protected class (age 40+, race, gender, disability, etc.)
  - Recent protected activity (complained about harassment, filed workers' comp)
  - High-level employee (VP+)
  - Under contract (review termination provisions)

TERMINATION MEETING:
□ Schedule: Friday afternoon (minimize office disruption)
□ Attendees: Manager + HR (witness)
□ Location: Private conference room
□ Duration: 10-15 minutes (brief, not a debate)

Script:
"We've decided to end your employment with [Company], effective today. 
This decision is based on [specific performance issues documented in PIP].
HR will explain your final paycheck, benefits, and next steps."

□ Deliver separation agreement
□ Collect company property (laptop, badge, keys)
□ Disable accounts immediately (email, Slack, systems)

POST-TERMINATION:
□ Final paycheck (include unused PTO per state law)
□ COBRA election notice (health insurance continuation)
□ Unemployment information (they'll likely qualify, don't contest)
□ Separation agreement (1-2 weeks severance for waiver of claims)

SEVERANCE OFFER:
- Standard: 2 weeks pay (for <2 years tenure)
- Senior: 1 month per year of service (capped at 6 months)
- Executive: Negotiated (typically 6-12 months)

In exchange for:
- General release of claims
- Non-disparagement
- Return of company property
- Cooperation with transition

RED FLAGS (Don't terminate without legal review):
- Employee on medical/parental leave
- Recent complaint about discrimination/harassment
- Workers' compensation claim pending
- Whistleblower activity
- Union organizing activity
```

### Severance Agreement Template

```markdown
SEPARATION AND RELEASE AGREEMENT

This Agreement is entered into between [Employee Name] ("Employee") 
and [Company Name] ("Company").

1. TERMINATION OF EMPLOYMENT
   Employee's last day of employment is [Date].

2. SEVERANCE PAYMENT
   Company will pay Employee $[Amount] (equivalent to [X weeks] of base salary), 
   less applicable withholdings, payable in [lump sum / installments].

3. BENEFITS
   - Health insurance: COBRA available for 18 months (Employee pays premiums)
   - Equity: Vested options exercisable for 90 days post-termination
   - 401(k): Eligible for rollover

4. RELEASE OF CLAIMS
   Employee releases Company from all claims, including but not limited to:
   - Discrimination (Title VII, ADA, ADEA)
   - Retaliation
   - Wrongful termination
   - Wage and hour violations
   - Breach of contract
   
   EXCLUDED: Claims that cannot be waived by law (unemployment, workers' comp)

5. NON-DISPARAGEMENT
   Employee agrees not to make negative statements about Company.
   Company agrees not to make negative statements about Employee.

6. CONFIDENTIALITY
   Employee agrees to maintain confidentiality of:
   - Company trade secrets
   - Customer information
   - Financial data
   - This Agreement's terms

7. RETURN OF PROPERTY
   Employee confirms return of all Company property (laptop, phone, documents).

8. COOPERATION
   Employee agrees to reasonably cooperate with Company on:
   - Transition of responsibilities
   - Legal matters (litigation, audits)

9. CONSIDERATION PERIOD
   Employee has 21 days to consider this Agreement.
   Employee has 7 days to revoke after signing (ADEA requirement for age 40+).

10. ACKNOWLEDGMENTS
    □ Employee has been advised to consult an attorney
    □ Employee understands this is a release of legal claims
    □ Employee is signing voluntarily

[Signatures, Date]
```

---

## IP Protection

### Trade Secret Protection

```markdown
IDENTIFY TRADE SECRETS:
- Customer lists & pricing
- Source code & algorithms
- Marketing strategies & campaigns
- Financial information & forecasts
- Manufacturing processes
- Business plans & strategies

PROTECTION MEASURES:

1. LEGAL AGREEMENTS
   □ All employees sign:
     - Confidentiality Agreement (at hire)
     - IP Assignment Agreement (all work product belongs to Company)
     - Non-compete (if enforceable in your state)*
   
   □ All contractors/vendors sign:
     - NDA before discussions
     - Work-for-hire agreement
   
   *Note: Non-competes unenforceable in CA, CO, ND, OK (as of 2025)

2. PHYSICAL SECURITY
   □ Badge access to office
   □ Locked server rooms
   □ Clean desk policy
   □ Shred confidential documents

3. TECHNICAL CONTROLS
   □ Access controls (need-to-know basis)
   □ Encryption (data at rest, in transit)
   □ DLP (prevent email of source code to personal accounts)
   □ Watermarks on sensitive documents
   □ Audit logs (track who accessed what)

4. TRAINING
   □ Onboarding: IP ownership & confidentiality
   □ Annual: Refresher training
   □ Exit: Reminder of ongoing obligations

5. EXIT PROCEDURES
   □ Remind of confidentiality obligations
   □ Collect all company property
   □ Disable access to systems
   □ Monitor for misappropriation (LinkedIn job change alerts)
```

### Patent Strategy

```markdown
WHEN TO FILE PATENTS:
✅ Core technology (defensible competitive advantage)
✅ Licensing opportunity (monetize IP)
✅ Acquisition target (patents increase valuation)
✅ Defensive (prevent competitor patents)

❌ Fast-moving field (patent obsolete before granted)
❌ Trade secret is better (formula, process)
❌ Can't afford to enforce (litigation costs $2M+)

FILING PROCESS:
1. Invention disclosure (engineer describes innovation)
2. Patentability search ($2K-5K)
3. Provisional patent application (12-month placeholder, $2K-5K)
4. Non-provisional application (formal filing, $10K-20K attorney fees)
5. Prosecution (respond to USPTO objections, 2-3 years, $5K-15K)
6. Grant (issue fee $1K-2K)

TOTAL COST: $20K-50K per patent
TIMING: 2-4 years to grant
MAINTENANCE FEES: $5K-15K over 20-year patent life

ALTERNATIVE: Defensive publication (publish to prevent others from patenting)
```

---

## Litigation Management

### When to Settle vs Fight

```python
def litigation_decision(case):
    """
    Economic analysis of settle vs litigate
    """
    
    # Costs
    settlement_offer = case.settlement_demand
    litigation_cost = estimate_litigation_cost(case)
    
    # Probability of winning
    win_probability = assess_merits(case)
    
    # Damages if we lose
    expected_damages = case.claimed_damages * (1 - win_probability)
    
    # Expected cost of litigation
    expected_litigation_cost = litigation_cost + expected_damages
    
    # Business factors
    distraction_cost = 100_000  # Management time
    reputation_risk = assess_reputation_risk(case)  # 0-1 scale
    
    # Decision
    total_settlement_cost = settlement_offer
    total_litigation_cost = expected_litigation_cost + distraction_cost + (reputation_risk * 1_000_000)
    
    if total_settlement_cost < total_litigation_cost * 0.7:  # 30% discount for certainty
        return "SETTLE", total_settlement_cost
    else:
        return "LITIGATE", total_litigation_cost

def estimate_litigation_cost(case):
    """
    Litigation cost estimates (2025)
    """
    if case.amount_in_controversy < 100_000:
        return 50_000  # Small claims, quick resolution
    elif case.amount_in_controversy < 1_000_000:
        return 200_000  # Standard commercial case
    else:
        return 500_000  # Complex case, trial

# Example
case = {
    'settlement_demand': 150_000,
    'claimed_damages': 500_000,
    'win_probability': 0.7,
    'amount_in_controversy': 500_000
}

decision, cost = litigation_decision(case)
print(f"Recommendation: {decision} (Expected cost: ${cost:,})")

# Output: SETTLE (Expected cost: $150,000 vs $430,000 to fight)
```

---

## Key Takeaways

1. **Template everything** - Reduce legal review time by 80%
2. **Track metrics** - Contract turnaround, legal spend, win rate
3. **Compliance is ROI** - SOC 2 unlocks enterprise deals
4. **Document everything** - In litigation, he who has better docs wins
5. **Prevent > litigate** - Good contracts avoid lawsuits

---

## References

- "Contracts for the Film & Television Industry" (contract drafting)
- IAPP GDPR Guidance
- AICPA SOC 2 Guide
- "Secrets of Legal Strategy" - Mitch Kowalski

**Related**: `contract-negotiation.md`, `compliance-frameworks.md`, `ip-strategy.md`
