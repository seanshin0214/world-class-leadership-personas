# Operations Excellence & Process Optimization 2025

**Updated**: 2025-11-23 | **Focus**: Process Improvement, Supply Chain, Efficiency

---

## Operations Metrics

```python
# Key Operations KPIs

operations_metrics = {
    # Efficiency
    'throughput': 1000,  # Units per day
    'cycle_time': 2.5,   # Hours per unit
    'capacity_utilization': 0.85,  # 85% (target: 80-90%)
    'first_pass_yield': 0.95,  # 95% pass without rework
    
    # Quality
    'defect_rate': 0.02,  # 2% (target: <3%)
    'customer_complaints': 5,  # Per 1000 units
    'returns_rate': 0.01,  # 1%
    
    # Cost
    'cost_per_unit': 12.50,
    'labor_cost_ratio': 0.30,  # 30% of total cost
    'waste_percentage': 0.05,  # 5% material waste
    
    # Delivery
    'on_time_delivery': 0.92,  # 92% (target: 95%)
    'order_fulfillment_time': 3,  # Days
    'backlog': 150,  # Pending orders
    
    # Safety
    'ltir': 2.1,  # Lost Time Injury Rate (per 100 employees)
    'near_miss_reports': 12,  # Monthly
}

# Overall Equipment Effectiveness (OEE)
def calculate_oee(availability, performance, quality):
    """
    OEE = Availability × Performance × Quality
    World-class: >85%
    """
    return availability * performance * quality

oee = calculate_oee(0.90, 0.95, 0.95)
print(f"OEE: {oee*100:.1f}%")  # 81.2%
```

---

## Process Improvement

### Lean Manufacturing

```markdown
8 WASTES (DOWNTIME):

D - DEFECTS
- Rework, scrap, returns
- Root cause: Poor quality control
- Solution: Poka-yoke (error-proofing), SPC

O - OVERPRODUCTION
- Making more than needed
- Root cause: "Just in case" mentality
- Solution: Pull system, JIT

W - WAITING
- Idle time (machines, workers)
- Root cause: Bottlenecks, unbalanced line
- Solution: Line balancing, cross-training

N - NON-UTILIZED TALENT
- Not using employees' skills/ideas
- Root cause: Top-down culture
- Solution: Kaizen, suggestion programs

T - TRANSPORTATION
- Moving materials unnecessarily
- Root cause: Poor layout
- Solution: Cellular manufacturing

I - INVENTORY
- Excess raw materials, WIP, finished goods
- Root cause: Long lead times, batch production
- Solution: Kanban, reduce batch sizes

M - MOTION
- Unnecessary worker movement
- Root cause: Poor ergonomics, layout
- Solution: 5S, workstation design

E - EXTRA PROCESSING
- More work than customer needs
- Root cause: Over-engineering, gold plating
- Solution: Value stream mapping

---

5S SYSTEM:

SORT (Seiri): Remove unnecessary items
- Red tag items not used in 30 days
- Dispose or relocate

SET IN ORDER (Seiton): Organize workspace
- "A place for everything, everything in its place"
- Shadow boards (tool outlines)
- Label everything

SHINE (Seiso): Clean & inspect
- Daily cleaning
- Identify issues (leaks, cracks)
- Preventive maintenance

STANDARDIZE (Seiketsu): Create standards
- Checklists
- Visual controls (color coding)
- Standard operating procedures (SOPs)

SUSTAIN (Shitsuke): Maintain discipline
- Audits
- Training
- Continuous improvement culture

BENEFITS:
- 30% reduction in search time
- 15% increase in productivity
- Fewer accidents
- Better quality

---

VALUE STREAM MAPPING (VSM):

CURRENT STATE MAP:
Supplier → Receiving → Warehouse → Production → QA → Shipping → Customer

Calculate:
- Cycle time (value-added time): 4 hours
- Lead time (total time): 10 days
- Value-added ratio: 4 hrs / (10 days × 8 hrs) = 5%
  → 95% waste!

FUTURE STATE MAP:
- Eliminate: Non-value-added steps
- Reduce: Batch sizes, inventory
- Improve: Flow, pull system
- Target: 30% reduction in lead time

IMPLEMENTATION:
- Kaizen events (1-week improvement sprints)
- Assign owners for each improvement
- Track metrics monthly
```

---

## Supply Chain Management

```markdown
INVENTORY MANAGEMENT:

ECONOMIC ORDER QUANTITY (EOQ):
Formula: EOQ = √(2DS / H)
- D = Annual demand
- S = Ordering cost per order
- H = Holding cost per unit per year

Example:
- D = 10,000 units/year
- S = $100 per order
- H = $5 per unit per year

EOQ = √(2 × 10,000 × 100 / 5) = √400,000 = 632 units

REORDER POINT (ROP):
ROP = (Daily demand × Lead time) + Safety stock

Example:
- Daily demand = 50 units
- Lead time = 7 days
- Safety stock = 100 units
ROP = (50 × 7) + 100 = 450 units

→ Order 632 units when inventory reaches 450

---

ABC ANALYSIS:

Classify inventory by value:

A ITEMS (70% of value, 10% of items):
- High value, tight control
- Daily monitoring
- Safety stock = 1 week

B ITEMS (20% of value, 20% of items):
- Moderate value, moderate control
- Weekly monitoring
- Safety stock = 2 weeks

C ITEMS (10% of value, 70% of items):
- Low value, loose control
- Monthly monitoring
- Safety stock = 4 weeks

Focus effort on A items (80/20 rule)

---

JUST-IN-TIME (JIT):

PRINCIPLES:
- Pull system (produce only what's needed, when needed)
- Small batch sizes
- Quick changeovers
- Zero inventory (ideal, not reality)

KANBAN SYSTEM:
- Visual signal to trigger production/replenishment
- Example: 2-bin system
  * Bin 1 in use
  * When empty, signal to refill
  * Use Bin 2 while Bin 1 refills

BENEFITS:
- 50% reduction in inventory
- 30% reduction in space
- Improved cash flow

RISKS:
- Vulnerable to supply disruptions
- Requires reliable suppliers
- Less buffer for demand spikes

---

SUPPLIER MANAGEMENT:

SUPPLIER SCORECARD:

| Supplier | Quality | Delivery | Price | Responsiveness | Total |
|----------|---------|----------|-------|----------------|-------|
| Acme     | 95%     | 92%      | B     | A              | A-    |
| XYZ      | 88%     | 95%      | A     | B              | B+    |

METRICS:
- Quality: % defect-free deliveries
- Delivery: % on-time, in-full (OTIF)
- Price: Competitiveness
- Responsiveness: Lead time, flexibility

VENDOR-MANAGED INVENTORY (VMI):
- Supplier monitors your inventory
- Automatically replenishes when low
- Benefits: Reduced stockouts, less admin
- Example: Walmart + P&G
```

---

## Capacity Planning

```markdown
CAPACITY ANALYSIS:

DESIGN CAPACITY: 100 units/hour (theoretical max)
EFFECTIVE CAPACITY: 90 units/hour (realistic, accounting for breaks, maintenance)
ACTUAL OUTPUT: 81 units/hour

UTILIZATION = Actual / Design = 81 / 100 = 81%
EFFICIENCY = Actual / Effective = 81 / 90 = 90%

TARGET:
- Utilization: 85-90% (not 100%! Need buffer)
- Efficiency: >90%

---

BOTTLENECK ANALYSIS:

Production Line:
Step A: 10 units/hr → Step B: 8 units/hr → Step C: 12 units/hr
                         ↑ BOTTLENECK

System capacity = 8 units/hr (limited by bottleneck)

THEORY OF CONSTRAINTS (TOC):
1. IDENTIFY bottleneck (Step B)
2. EXPLOIT: Run bottleneck at 100% (no downtime)
3. SUBORDINATE: Upstream produces at bottleneck rate (no overproduction)
4. ELEVATE: Add capacity to bottleneck (hire worker, buy machine)
5. REPEAT: New bottleneck emerges (Step A now?)

DRUM-BUFFER-ROPE:
- Drum: Bottleneck sets pace
- Buffer: Inventory before bottleneck (insurance)
- Rope: Signal to upstream (pull system)

---

TAKT TIME:

Formula: Takt = Available time / Customer demand

Example:
- Available time: 8 hours = 480 min
- Breaks: 2 × 15 min = 30 min
- Maintenance: 10 min
- Net available: 440 min
- Demand: 220 units/day

Takt time = 440 / 220 = 2 min/unit

→ Must produce 1 unit every 2 minutes to meet demand

LINE BALANCING:
Assign tasks to workstations so each takes ~2 min
- Workstation 1: 1.9 min (OK)
- Workstation 2: 2.3 min (PROBLEM! Bottleneck)
- Workstation 3: 1.8 min (OK)

Solution: Move some tasks from WS2 to WS1/WS3
```

---

## Quality Management

```markdown
SIX SIGMA (DMAIC):

DEFINE:
- Problem statement: "Customer complaints increased 20% this quarter"
- Goal: Reduce complaints to <5 per 1000 units
- Scope: Production line A

MEASURE:
- Collect baseline data
- Current defect rate: 3.5%
- Pareto analysis (80% of defects from 20% of causes)

ANALYZE:
- Root cause analysis (5 Whys, Fishbone diagram)
- Example: Defect = Misaligned parts
  * Why? Fixture worn
  * Why? No preventive maintenance schedule
  * Why? No maintenance budget
  * Why? Not seen as priority
  * Why? Reactive culture
  → Root cause: Culture, not fixture!

IMPROVE:
- Pilot solution
- Example: Implement PM schedule, train operators
- Run for 1 month

CONTROL:
- Standardize improvements (update SOPs)
- Statistical process control (SPC) charts
- Monitor ongoing (monthly reviews)

---

CONTROL CHARTS:

Upper Control Limit (UCL)
─────────────────────────────
        •  •
      •      •  •
    •            •
─────────────────────────────  Target
  •                  •
•                        •
─────────────────────────────
Lower Control Limit (LCL)

IN CONTROL:
- Points within UCL/LCL
- Random variation
- Process stable

OUT OF CONTROL (investigate):
- Point outside limits
- 7+ consecutive points above/below center
- Trend up or down

---

ROOT CAUSE ANALYSIS:

FISHBONE DIAGRAM (Ishikawa):

                          Problem
                             ↑
            ┌───────────────┴───────────────┐
            │                               │
         People                         Process
         • Training                     • Steps unclear
         • Fatigue                      • No checklist
            │                               │
            └───────────────┬───────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
        Equipment                       Materials
         • Old machine                  • Wrong spec
         • Not calibrated               • Supplier issue

CATEGORIES (6 Ms):
- Man (People)
- Machine (Equipment)
- Material
- Method (Process)
- Measurement
- Mother Nature (Environment)
```

---

## Key Takeaways

1. **Measure everything** - "What gets measured gets managed"
2. **Eliminate waste** - Lean thinking, continuous improvement
3. **Optimize flow** - Remove bottlenecks, balance lines
4. **Quality at source** - Catch defects early (cheaper)
5. **Empower workers** - Frontline has best insights

---

## References

- "The Goal" - Eliyahu Goldratt
- "Lean Thinking" - Womack & Jones
- "The Toyota Way" - Jeffrey Liker

**Related**: `lean-manufacturing.md`, `supply-chain-optimization.md`, `six-sigma-dmaic.md`
