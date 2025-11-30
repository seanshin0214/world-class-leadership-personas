# Education & Science Experts - Deep Knowledge Base

## Elite Tutor (605) / Academic Coaches

### Learning Science Principles

**Bloom's Taxonomy (Revised):**
```
CREATE (Highest)
├── Design, construct, produce, invent
│
EVALUATE
├── Judge, critique, assess, argue
│
ANALYZE
├── Compare, organize, deconstruct, attribute
│
APPLY
├── Execute, implement, solve, use
│
UNDERSTAND
├── Interpret, summarize, classify, explain
│
REMEMBER (Foundation)
├── Recall, list, recognize, identify
```

**Effective Learning Strategies:**

| Strategy | Effectiveness | Best For |
|----------|---------------|----------|
| Spaced Repetition | Very High | Memorization, languages |
| Active Recall | Very High | All learning |
| Interleaving | High | Problem-solving, math |
| Elaboration | High | Conceptual understanding |
| Dual Coding | High | Visual learners |
| Feynman Technique | High | Deep understanding |
| Mind Mapping | Medium | Organization, brainstorming |

### Spaced Repetition Algorithm

```python
# SuperMemo SM-2 Algorithm
def calculate_next_review(quality: int, repetitions: int,
                         easiness: float, interval: int) -> tuple:
    """
    Calculate next review date using SM-2 algorithm.

    Args:
        quality: 0-5 (0=complete blackout, 5=perfect response)
        repetitions: number of successful reviews
        easiness: easiness factor (starts at 2.5)
        interval: current interval in days

    Returns:
        (new_interval, new_repetitions, new_easiness)
    """
    if quality >= 3:  # Correct response
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(interval * easiness)

        repetitions += 1
        easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    else:  # Incorrect response
        repetitions = 0
        interval = 1

    easiness = max(1.3, easiness)  # Minimum easiness

    return interval, repetitions, easiness
```

### Teaching Methodology Matrix

**Instructional Strategies by Objective:**

| Objective | Strategy | Activities |
|-----------|----------|------------|
| Knowledge | Direct Instruction | Lecture, reading, video |
| Comprehension | Guided Discovery | Discussion, Q&A, summary |
| Application | Practice | Exercises, simulations, labs |
| Analysis | Case Study | Problem-based learning, debate |
| Synthesis | Project-Based | Design challenges, research |
| Evaluation | Socratic Method | Peer review, critique, reflection |

---

## Research Advisor (606)

### Research Methodology Framework

**Research Design Selection:**
```
RESEARCH QUESTION
       │
       ▼
┌──────────────────┐
│ What to discover?│
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
EXPLORATORY  CONFIRMATORY
    │             │
    ▼             ▼
Qualitative  Quantitative
- Interviews - Experiments
- Observation- Surveys
- Focus groups- Analytics
```

**Literature Review Process:**
1. **Define scope:** Research questions, keywords, databases
2. **Search systematically:** Multiple databases, citation chaining
3. **Screen results:** Title/abstract → Full text → Quality assessment
4. **Extract data:** Key findings, methods, gaps
5. **Synthesize:** Thematic analysis, conceptual framework
6. **Report:** PRISMA flow diagram, narrative synthesis

### Academic Writing Structure

**IMRaD Format:**
```markdown
# Title
[Concise, informative, includes key variables]

## Abstract (250 words)
- Background (1-2 sentences)
- Methods (2-3 sentences)
- Results (3-4 sentences)
- Conclusion (1-2 sentences)

## Introduction
- Hook: Why this topic matters
- Background: What we know
- Gap: What we don't know
- Purpose: What this study addresses
- Significance: Why it matters

## Methods
- Study design
- Participants/sample
- Measures/instruments
- Procedures
- Analysis

## Results
- Descriptive statistics
- Main findings
- Secondary findings
- Tables and figures

## Discussion
- Summary of findings
- Interpretation
- Comparison to prior work
- Limitations
- Future directions

## Conclusion
- Key takeaway
- Implications
```

---

## Neuroscientist (701)

### Brain Science Fundamentals

**Brain Regions and Functions:**
```
CEREBRAL CORTEX
├── Frontal Lobe
│   ├── Prefrontal: Decision-making, planning, personality
│   ├── Motor: Movement control
│   └── Broca's: Speech production
│
├── Parietal Lobe
│   ├── Sensory processing
│   └── Spatial awareness
│
├── Temporal Lobe
│   ├── Auditory processing
│   ├── Wernicke's: Language comprehension
│   └── Hippocampus: Memory formation
│
└── Occipital Lobe
    └── Visual processing

SUBCORTICAL
├── Amygdala: Emotion, fear response
├── Basal Ganglia: Habits, motor control
├── Thalamus: Sensory relay
└── Cerebellum: Coordination, balance
```

**Neurotransmitter Systems:**

| Neurotransmitter | Function | Imbalance Effects |
|------------------|----------|-------------------|
| Dopamine | Reward, motivation, movement | Parkinson's, addiction |
| Serotonin | Mood, sleep, appetite | Depression, anxiety |
| Norepinephrine | Alertness, attention | ADHD, stress |
| GABA | Inhibition, calm | Anxiety, seizures |
| Glutamate | Excitation, learning | Excitotoxicity |
| Acetylcholine | Memory, muscle | Alzheimer's |

### Cognitive Enhancement Strategies

**Evidence-Based Interventions:**

| Intervention | Cognitive Benefit | Evidence Level |
|--------------|-------------------|----------------|
| Aerobic Exercise | Memory, executive function | Very Strong |
| Sleep (7-9 hrs) | Consolidation, attention | Very Strong |
| Meditation | Attention, emotional regulation | Strong |
| Cognitive Training | Specific trained tasks | Moderate |
| Social Engagement | General cognitive health | Strong |
| Nutrition (Mediterranean) | Overall brain health | Moderate |

---

## Physicist (702)

### Physics Problem-Solving Framework

**IDEAL Problem-Solving:**
```
I - Identify the problem
    └── What is given? What is unknown?

D - Define and represent
    └── Draw diagrams, define variables

E - Explore strategies
    └── Which principles apply?

A - Act on the plan
    └── Execute calculations step by step

L - Look back
    └── Check units, verify reasonableness
```

**Common Physics Equations:**
```
MECHANICS
─────────────────────────────────
v = v₀ + at           (velocity)
x = x₀ + v₀t + ½at²  (position)
v² = v₀² + 2a(x-x₀)  (velocity-position)
F = ma               (Newton's 2nd Law)
W = Fd cos(θ)        (work)
KE = ½mv²            (kinetic energy)
PE = mgh             (potential energy)

ELECTROMAGNETISM
─────────────────────────────────
F = kq₁q₂/r²         (Coulomb's Law)
E = F/q              (electric field)
V = kq/r             (electric potential)
I = V/R              (Ohm's Law)
P = IV               (power)

WAVES
─────────────────────────────────
v = fλ               (wave velocity)
T = 1/f              (period)
```

---

## Health Advisor (705)

### Evidence-Based Health Guidelines

**Exercise Recommendations (WHO):**
```
ADULTS (18-64 years)
├── Aerobic: 150-300 min moderate OR 75-150 min vigorous/week
├── Strength: 2+ days/week all major muscle groups
├── Sedentary: Limit sitting, replace with any activity
└── Additional: More activity = more benefits

OPTIMAL WEEKLY STRUCTURE
────────────────────────
Mon: Strength (Upper)
Tue: Cardio (30-45 min moderate)
Wed: Strength (Lower)
Thu: Active Recovery (yoga, walking)
Fri: Strength (Full body)
Sat: Cardio (60 min moderate or HIIT)
Sun: Rest or light activity
```

**Sleep Hygiene Principles:**

| Principle | Implementation |
|-----------|----------------|
| Consistency | Same bed/wake time ±30 min |
| Duration | 7-9 hours for adults |
| Environment | Dark, cool (65-68°F), quiet |
| Pre-sleep | No screens 1 hour before |
| Caffeine | None after 2 PM |
| Alcohol | Avoid 3 hours before bed |
| Exercise | Complete 3+ hours before bed |

---

## Expert Activation

```
@elite-tutor
@research-advisor
@neuroscientist
@physicist
@health-advisor
```
or describe your educational/scientific challenge
