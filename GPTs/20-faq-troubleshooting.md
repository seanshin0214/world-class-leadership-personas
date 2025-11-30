# FAQ & Troubleshooting Guide

## Frequently Asked Questions

### How do I activate an expert?

**Option 1: Direct mention**
```
@strategic-oracle
@fullstack-developer
@ux-designer
```

**Option 2: Domain request**
```
"I need a backend expert"
"Help from a business strategist"
```

**Option 3: Describe your challenge**
```
"I'm struggling with React performance optimization"
→ System auto-suggests: React Expert (102) + Performance Engineer (120)
```

---

### How do I use expert chaining?

**Simple chain:**
```
"Chain strategy-consultant and cfo for acquisition analysis"
```

**Detailed chain:**
```
"I need to analyze a new market entry:
1. Strategy Consultant: Market analysis
2. CFO: Financial projections
3. Legal Advisor: Regulatory review"
```

**Parallel chain:**
```
"Run security-engineer and legal-advisor in parallel,
then synthesize with strategy-consultant"
```

---

### Which expert should I use?

| Challenge | Recommended Expert(s) |
|-----------|----------------------|
| Code review | Fullstack (101) or domain specialist |
| System design | Solution Architect (108) |
| Security assessment | Security Engineer (113) |
| Product strategy | Product Manager (305) |
| User research | UX Designer (201) + UX Researcher (205) |
| Financial planning | CFO (309) |
| Team leadership | Leadership Coach (801) |
| AI/ML project | LLM Engineer (410) + AI PM (411) |
| Legal question | Legal Advisor (901) |

---

### Can I combine multiple experts?

**Yes! Three ways:**

1. **Sequential Chain**
   - Experts consult one after another
   - Each builds on previous output
   - Best for: Progressive refinement

2. **Parallel Chain**
   - Experts consult simultaneously
   - Results synthesized at end
   - Best for: Multiple perspectives

3. **Review Pattern**
   - Creator → Reviewer → Creator
   - Iterative improvement
   - Best for: Quality assurance

---

### How detailed should my question be?

**Minimum information:**
- What you're trying to achieve
- Current situation/context
- Any constraints

**Ideal information:**
- Specific challenge description
- Technology/domain context
- Scale/size parameters
- Timeline constraints
- What success looks like

**Example of ideal query:**
```
"We're a B2B SaaS startup (50 employees, $5M ARR).
Building a new analytics feature for enterprise customers.
Tech stack: React, Python, PostgreSQL on AWS.
Need to support 1000+ concurrent users.
Launch target: 3 months.

Need help with:
1. Architecture that scales
2. Security for enterprise compliance
3. Testing strategy

What experts should I consult?"
```

---

## Troubleshooting

### "The expert's response doesn't match my needs"

**Solutions:**

1. **Be more specific**
   ```
   Instead of: "Help with React"
   Try: "Help with React 18 server components and Suspense"
   ```

2. **Provide context**
   ```
   "Context: I'm building an e-commerce checkout flow.
   Problem: Cart state not persisting across pages.
   Stack: Next.js 14 with App Router, Zustand."
   ```

3. **Request a different expert**
   ```
   "This is more of a performance issue.
   Can you switch to Performance Engineer?"
   ```

---

### "I'm not sure which expert to use"

**Solution: Describe your challenge in plain language**

The system will suggest appropriate experts based on:
- Keywords in your query
- Problem domain
- Complexity assessment

Example:
```
"I need to make a decision about whether to build
or buy a CRM system for our 200-person company."

→ Suggested experts:
   - Strategy Consultant (301) for build vs buy analysis
   - CFO (309) for financial comparison
   - Product Manager (305) for requirements definition
```

---

### "The chain isn't working as expected"

**Common issues and fixes:**

1. **Unclear handoff**
   - Be explicit about what each expert should do
   ```
   "1. Strategy Consultant: Analyze market positioning
    2. CFO: Model financial scenarios (use Strategy's output)
    3. Legal: Review regulatory implications"
   ```

2. **Missing context between steps**
   - Request synthesis at each step
   ```
   "After each expert, summarize key points
   before moving to next expert"
   ```

3. **Wrong order**
   - Consider dependencies
   ```
   Design → Build → Test (not Test → Build → Design)
   ```

---

### "Response is too technical/not technical enough"

**Adjust the level:**

```
"Explain like I'm a non-technical executive"
"Give me the technical deep-dive, I'm a senior engineer"
"I need this for a board presentation"
"I need implementation-level detail"
```

---

### "I need help outside the 142 experts"

**The experts cover broad domains. Try:**

1. **Finding the closest match**
   ```
   "I need help with supply chain"
   → Operations Director (316) + Strategy Consultant (301)
   ```

2. **Combining experts**
   ```
   "I need a data ethics perspective"
   → AI Ethics Officer (409) + Legal Advisor (901)
   ```

3. **Requesting general assistance**
   ```
   "I know this isn't a specific expert area, but..."
   → System will provide best-effort guidance
   ```

---

## Best Practices Summary

### Do:
- Provide specific context
- State your goal clearly
- Mention relevant technology
- Use chaining for complex problems
- Ask for recommendations

### Don't:
- Ask vague questions ("help with my code")
- Expect experts outside their domain
- Skip context that affects the answer
- Forget to mention constraints

---

## Getting Support

If you need help:
1. Describe your challenge in detail
2. Mention what you've already tried
3. Specify what kind of help you need

Example:
```
"I'm stuck on [specific issue].
I've tried [approach 1] and [approach 2].
I need help with [specific aspect].
Can you suggest the right expert(s)?"
```

---

## Expert Activation

Just describe your challenge. The system will:
1. Analyze your query
2. Suggest relevant expert(s)
3. Offer chaining if needed
4. Provide tailored guidance
