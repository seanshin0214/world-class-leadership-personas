# Design & Creative Experts - Deep Knowledge Base

## UX/UI Designer (201-204)

### Design Process Framework

**Double Diamond Process**
```
Discover → Define → Develop → Deliver

1. DISCOVER (Research)
   - User interviews
   - Competitive analysis
   - Analytics review
   - Stakeholder interviews

2. DEFINE (Synthesis)
   - User personas
   - Journey maps
   - Problem statements
   - Design principles

3. DEVELOP (Ideation)
   - Wireframes
   - Prototypes
   - Usability testing
   - Iteration

4. DELIVER (Implementation)
   - Design specs
   - Developer handoff
   - QA support
   - Launch & measure
```

### User Research Methods

**Quantitative Methods**
| Method | Sample Size | Best For |
|--------|-------------|----------|
| Surveys | 100-1000+ | Validation, trends |
| A/B Testing | 1000+ | Optimization |
| Analytics | All users | Behavior patterns |
| Card Sorting | 30-50 | Information architecture |

**Qualitative Methods**
| Method | Sample Size | Best For |
|--------|-------------|----------|
| User Interviews | 5-15 | Deep insights |
| Usability Testing | 5-8 | Problem discovery |
| Contextual Inquiry | 5-10 | Real environment |
| Focus Groups | 6-10 | Concept exploration |

### Design System Components

**Atomic Design Structure**
```
Atoms → Molecules → Organisms → Templates → Pages

Atoms:
- Buttons, inputs, labels, icons

Molecules:
- Search bar (input + button + icon)
- Form field (label + input + error)

Organisms:
- Header (logo + nav + search + user menu)
- Card grid (multiple cards)

Templates:
- Page layouts
- Grid systems

Pages:
- Actual content instances
```

**Design Tokens**
```json
{
  "color": {
    "primary": {
      "50": "#eff6ff",
      "500": "#3b82f6",
      "900": "#1e3a8a"
    },
    "semantic": {
      "success": "#22c55e",
      "warning": "#f59e0b",
      "error": "#ef4444"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "fontSize": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px"
    }
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  }
}
```

### Accessibility (WCAG 2.1)

**Level AA Requirements**
```
1. PERCEIVABLE
   - Alt text for images
   - Captions for videos
   - Color contrast 4.5:1 (text), 3:1 (large text)
   - Responsive design

2. OPERABLE
   - Keyboard navigation
   - Skip links
   - Focus indicators
   - No seizure-inducing content

3. UNDERSTANDABLE
   - Clear language
   - Consistent navigation
   - Error identification
   - Input assistance

4. ROBUST
   - Valid HTML
   - ARIA labels
   - Compatible with assistive tech
```

**Color Contrast Checker**
```
Background: #FFFFFF
Text Color: #374151

Contrast Ratio: 7.5:1 ✓
- Normal text: PASS (4.5:1 required)
- Large text: PASS (3:1 required)
- UI components: PASS (3:1 required)
```

---

## UX Researcher (223)

### Research Planning Template

**Research Brief**
```markdown
## Research Objective
What decision will this research inform?

## Research Questions
1. Primary: [Main question]
2. Secondary: [Supporting questions]

## Methodology
- Method: [Interview/Survey/Usability Test]
- Participants: [Number, criteria]
- Duration: [Timeline]
- Tools: [Software, equipment]

## Deliverables
- Research report
- Key findings presentation
- Recommendations document

## Success Metrics
How will we know the research was successful?
```

### Interview Guide Structure
```markdown
## Introduction (5 min)
- Thank participant
- Explain purpose
- Get consent for recording
- Set expectations

## Warm-up (5 min)
- Background questions
- Build rapport

## Main Questions (30-40 min)
Topic 1: Current behavior
- Tell me about the last time you...
- Walk me through how you typically...

Topic 2: Pain points
- What's the hardest part about...
- What frustrates you about...

Topic 3: Needs and goals
- What would make X easier?
- In an ideal world, how would...

## Wrap-up (5 min)
- Is there anything else?
- Thank you
- Next steps
```

### Synthesis Methods

**Affinity Mapping**
```
1. Write observations on sticky notes
2. Group related notes
3. Name each group
4. Identify patterns and themes
5. Prioritize insights
```

**Jobs to be Done Framework**
```
When [situation],
I want to [motivation],
So I can [expected outcome].

Example:
When I'm running late for a meeting,
I want to quickly check my schedule,
So I can know if I have time to grab coffee.
```

---

## Content Strategist (218)

### Content Strategy Framework

**Content Audit Template**
| URL | Title | Type | Owner | Last Updated | Traffic | Performance | Action |
|-----|-------|------|-------|--------------|---------|-------------|--------|
| /about | About Us | Page | Marketing | 2023-06 | Low | Poor | Rewrite |
| /blog/x | Post Title | Blog | Content | 2024-01 | High | Good | Update |

### Content Calendar Structure
```markdown
## Monthly Theme: [Topic]

### Week 1
- Mon: Blog post - [Title] (SEO focus)
- Wed: Social - [Platform] campaign
- Fri: Newsletter

### Week 2
- Mon: Case study publish
- Wed: Video content
- Fri: Blog post - [Title]

### Metrics to Track
- Pageviews, Time on page
- Social engagement
- Email open/click rates
- Conversions
```

### SEO Content Guidelines
```markdown
## On-Page SEO Checklist

Title Tag:
- [ ] Primary keyword included
- [ ] Under 60 characters
- [ ] Compelling for clicks

Meta Description:
- [ ] Primary keyword included
- [ ] Under 155 characters
- [ ] Clear value proposition

Content:
- [ ] H1 with primary keyword
- [ ] H2s with secondary keywords
- [ ] Internal links (3-5)
- [ ] External links to authority sites
- [ ] Images with alt text
- [ ] Minimum 1,500 words (for pillar content)
```

---

## Game Designer (215)

### Game Design Document Template

**Core Concept**
```markdown
## High Concept
One-sentence description of the game.

## Genre
[Action/RPG/Puzzle/Strategy/etc.]

## Target Audience
- Age range
- Gaming experience
- Platform preference

## Unique Selling Points
1. [Differentiator 1]
2. [Differentiator 2]
3. [Differentiator 3]
```

### Core Loop Design
```
         ┌─────────────┐
         │   ACTION    │
         │ (gameplay)  │
         └──────┬──────┘
                │
         ┌──────▼──────┐
         │   REWARD    │
         │ (feedback)  │
         └──────┬──────┘
                │
         ┌──────▼──────┐
         │  EXPANSION  │
         │ (progress)  │
         └──────┬──────┘
                │
                └──────────► Loop
```

### Balancing Framework
```
Power Curve Formula:
Power = Base × (1 + Level × GrowthRate)

Example (Linear):
Level 1: 100 power
Level 10: 100 × (1 + 10 × 0.1) = 200 power
Level 50: 100 × (1 + 50 × 0.1) = 600 power

Economy Balance:
Income Rate ≈ Expense Rate × 1.1 (slight surplus)
Grinding time = Desired Item Cost / Average Income per Hour
Target: 2-4 hours for meaningful upgrades
```

---

## Creative Writer (206/207)

### Storytelling Frameworks

**Three-Act Structure**
```
ACT I (25%) - Setup
- Introduce protagonist
- Establish world
- Inciting incident
- First plot point

ACT II (50%) - Confrontation
- Rising action
- Midpoint twist
- Complications
- Dark moment

ACT III (25%) - Resolution
- Climax
- Falling action
- Resolution
- New equilibrium
```

**Hero's Journey**
```
DEPARTURE
1. Ordinary World
2. Call to Adventure
3. Refusal of Call
4. Meeting the Mentor
5. Crossing the Threshold

INITIATION
6. Tests, Allies, Enemies
7. Approach to Innermost Cave
8. Ordeal
9. Reward

RETURN
10. The Road Back
11. Resurrection
12. Return with Elixir
```

### Copywriting Formulas

**AIDA**
```
Attention: Headline that grabs
Interest: Engage with relevance
Desire: Create want
Action: Clear CTA

Example:
A: "Stop Losing 50% of Your Leads"
I: "Most companies lose leads due to slow response times..."
D: "Imagine converting 3x more leads with automated follow-up..."
A: "Start your free trial today →"
```

**PAS (Problem-Agitate-Solve)**
```
Problem: Identify pain point
Agitate: Make it worse
Solve: Present solution

Example:
P: "Your website loads in 8 seconds."
A: "Every second costs you 7% in conversions. That's thousands in lost revenue."
S: "Our optimization cuts load time to under 2 seconds."
```

**4 Cs of Copywriting**
```
Clear - Easy to understand
Concise - No fluff
Compelling - Emotionally engaging
Credible - Backed by proof
```

---

## Video Editor (211)

### Video Editing Workflow

**Post-Production Pipeline**
```
1. INGEST
   - Import footage
   - Create proxies (if needed)
   - Organize bins

2. ASSEMBLY
   - Rough cut
   - Select best takes
   - Establish structure

3. FINE CUT
   - Timing refinement
   - Pacing adjustment
   - Transitions

4. POLISH
   - Color correction
   - Color grading
   - Sound design
   - Music

5. DELIVERY
   - Export settings
   - Format conversions
   - Quality check
```

### Export Settings Guide

**YouTube**
```
Container: MP4
Codec: H.264
Resolution: 3840x2160 (4K) or 1920x1080 (1080p)
Frame Rate: Match source
Bitrate: 35-45 Mbps (4K), 16-24 Mbps (1080p)
Audio: AAC, 384 kbps, 48kHz
```

**Instagram**
```
Feed Post: 1080x1080 (1:1) or 1080x1350 (4:5)
Stories/Reels: 1080x1920 (9:16)
Frame Rate: 30fps
Bitrate: 10-15 Mbps
Duration: Reels up to 90 seconds
```

### Color Grading Basics
```
1. PRIMARY CORRECTION
   - White balance
   - Exposure
   - Contrast

2. SECONDARY CORRECTION
   - Skin tone isolation
   - Sky enhancement
   - Selective adjustments

3. CREATIVE GRADE
   - Look/mood
   - Color palette
   - Style consistency
```

---

## Sound Designer (220)

### Audio Post-Production

**Sound Design Layers**
```
1. DIALOGUE
   - Production audio
   - ADR (Automated Dialogue Replacement)
   - Voice-over

2. SOUND EFFECTS
   - Hard effects (doors, footsteps)
   - Foley (cloth, props)
   - Background/ambience

3. MUSIC
   - Score
   - Licensed tracks
   - Stingers

4. MIX
   - Levels
   - EQ
   - Compression
   - Spatial audio
```

### Audio Specifications
```
Broadcast Standard:
- Sample Rate: 48kHz
- Bit Depth: 24-bit
- Loudness: -24 LUFS (TV), -14 LUFS (streaming)
- True Peak: -2 dBTP

Podcast:
- Sample Rate: 44.1kHz
- Bit Depth: 16-bit
- Loudness: -16 LUFS
- Format: MP3 128-192 kbps or AAC
```
