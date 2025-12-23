# Prompt Engineering Fundamentals 2025

**Last Updated**: 2025-11-23  
**Based on**: OpenAI, Anthropic, Bolt.new, Cluely production systems

---

## Why Prompt Engineering Still Matters

**Reality Check**: The best AI products are obsessed with prompts.

- **Bolt.new**: $50M ARR in 5 months - system prompt is key to success
- **Cluely**: $6M ARR in 2 months - sophisticated prompt engineering
- **Context Engineering**: Prompts provide 85% of the value

---

## Production System Prompt Patterns

### Pattern 1: Bracket-Based Structure (Cluely)

```markdown
[IDENTITY]
You are Cluely, an AI research assistant.

[CORE CAPABILITIES]
- Research synthesis
- Source citation
- Contextual analysis

[NEVER]
- NEVER fabricate sources
- NEVER ignore user context
- NEVER use placeholder text

[ALWAYS]
- ALWAYS cite with [1], [2] format
- ALWAYS ask when unclear
- ALWAYS maintain professional tone

[IF/THEN LOGIC]
If source unavailable:
→ State "I don't have access to..."
→ Suggest alternative

[QUALITY CHECKS]
Before responding:
✓ Sources cited?
✓ Context considered?
✓ Format correct?
```

### Pattern 2: XML Tags (Claude Best Practice)

```xml
<role>
Senior software architect specializing in cloud-native systems.
</role>

<task>
Design scalable microservice architecture for e-commerce platform.
</task>

<context>
<current_system>Monolithic Rails app, 10M users</current_system>
<constraints>
  - Budget: $500K
  - Timeline: 6 months
  - Team: 5 engineers
</constraints>
</context>

<output_format>
1. Architecture diagram (Mermaid)
2. Service breakdown (per service: responsibilities, tech stack, scaling strategy)
3. Migration roadmap (phases with milestones)
4. Cost estimation (infrastructure + development)
</output_format>

<examples>
<good>
Service: User Authentication
- Responsibilities: Login, OAuth, JWT tokens
- Tech: Node.js, Redis, PostgreSQL
- Scaling: Horizontal autoscaling, 100-1000 pods
- Cost: $2K/month
</good>
</examples>
```

**Why XML works**: Clear boundaries, no context bleed, model-friendly parsing

---

## Advanced Techniques

### 1. Chain-of-Thought (CoT)

```markdown
Question: If a company grows revenue 40% YoY for 3 years starting at $10M, what's final revenue?

Let's think step by step:
1. Year 0: $10M
2. Year 1: $10M × 1.40 = $14M
3. Year 2: $14M × 1.40 = $19.6M
4. Year 3: $19.6M × 1.40 = $27.44M

Answer: $27.44M
```

**Result**: +25% accuracy on complex reasoning

### 2. Few-Shot Learning

```markdown
Task: Classify sentiment

Example 1:
Input: "This product is amazing! Fast shipping too."
Output: POSITIVE (0.95)

Example 2:
Input: "It's okay, does what it says."
Output: NEUTRAL (0.7)

Example 3:
Input: "Waste of money. Broke after one week."
Output: NEGATIVE (0.98)

Now classify:
Input: {{USER_INPUT}}
```

**Optimal**: 3-5 examples

### 3. ReAct (Reasoning + Acting)

```
Question: What's the GDP of France's capital?

Thought 1: Need to find France's capital
Action 1: search("capital of France")
Observation 1: Paris

Thought 2: Need Paris GDP
Action 2: search("Paris GDP 2025")
Observation 2: €739 billion

Answer: Paris (France's capital) has GDP of €739B
```

---

## Cost Economics

### Token Costs (2025)

```
GPT-4 Turbo: $10/$30 per M tokens (in/out)
Claude Sonnet: $3/$15 per M tokens
GPT-4o mini: $0.15/$0.60 per M tokens
```

### ROI Example

**Short prompt (50 tokens)**: "Summarize this article"
- Cost: $0.0005/call
- Quality: 70%
- Manual review: 30% of outputs
- Total cost: $1250/day (1000 calls)

**Long prompt (500 tokens)**: Detailed with examples, format, style
- Cost: $0.005/call (10x)
- Quality: 95%
- Manual review: 5% of outputs
- Total cost: $213/day

**Savings**: $378K/year from better prompts!

---

## Common Pitfalls

### ❌ Over-Prompting
```
You are an expert senior principal staff architect with 30 years experience in distributed systems cloud computing microservices...
[10,000 words]
```

### ✅ Focused
```
You are a senior software architect specializing in cloud-native systems.
Focus: Design scalable, maintainable microservice architectures.
```

### ❌ Vague
```
Analyze this data and give insights.
```

### ✅ Specific
```
Analyze sales data and provide:
1. Top 3 revenue drivers (% contribution)
2. Declining segments (>10% drop)
3. Seasonal patterns
4. Prioritized recommendations
```

---

## Production Checklist

```markdown
Before deploying:
☐ Security review (no secrets)
☐ Cost estimation
☐ Rate limiting
☐ Error handling
☐ Logging/monitoring
☐ A/B test (n=100)
☐ Edge cases tested
☐ Rollback plan
```

---

## References

- Bolt.new production prompts (2025)
- Cluely system architecture (2025)
- Anthropic prompt engineering guide
- OpenAI best practices
- "Prompt Engineering is Context Engineering" - Aakash Gupta

**Related**: See `rag-systems.md`, `model-optimization.md`, `case-studies/`
