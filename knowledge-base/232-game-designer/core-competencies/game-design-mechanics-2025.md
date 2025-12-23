# Game Design & Mechanics 2025

**Updated**: 2025-11-24 | **Focus**: Game Mechanics, Level Design, Player Experience, Monetization, Prototyping

---

## Core Game Design Principles

```markdown
GAME MECHANICS (Rules, systems):

CORE LOOP (What player does repeatedly):
- Example (Puzzle game):
  * See puzzle → Solve → Get reward → Next puzzle (repeat)
- Example (RPG):
  * Fight enemies → Gain XP → Level up → Unlock abilities → Fight stronger enemies (repeat)
- Goal: Addictive, satisfying (players want to repeat)

PLAYER ACTIONS (Verbs):
- Jump, shoot, collect, build, trade, explore, solve, compete
- Fewer verbs, deeper mechanics > Many shallow mechanics
- Example (Portal): Shoot portal, walk through portal (2 verbs, infinite possibilities)

FEEDBACK:
- Visual: Health bar decreases, score increases, item glows
- Audio: Coin sound, damage grunt, level-up fanfare
- Haptic: Controller vibrates (damage, explosion)
- Immediate, clear (player knows action's effect)

CHALLENGE & DIFFICULTY:
- Too easy: Boring (player quits)
- Too hard: Frustrating (player quits)
- FLOW STATE (Csikszentmihalyi): Challenge matches skill (fully engaged, lose track of time)
- Dynamic difficulty (game adjusts based on player performance)

---

MDA FRAMEWORK (Mechanics, Dynamics, Aesthetics):

MECHANICS:
- Rules, systems (what player CAN do)
- Example: Mario can jump, stomp enemies, collect coins

DYNAMICS:
- Emergent behavior (how mechanics interact, create gameplay)
- Example: Jump on enemy → enemy dies + player bounces higher (sequence chaining stomps)

AESTHETICS (Player experience, emotions):
- Sensation: Game as sense-pleasure (graphics, sound, feel)
- Fantasy: Game as make-believe (role-play, immersion)
- Narrative: Game as drama (story, characters)
- Challenge: Game as obstacle course (skill, mastery)
- Fellowship: Game as social framework (co-op, community)
- Discovery: Game as uncharted territory (exploration, secrets)
- Expression: Game as self-discovery (creativity, customization)
- Submission: Game as pastime (relaxation, casual)

DESIGN APPROACH:
- Start with aesthetics (what emotion/experience you want)
- Design mechanics to create that experience
- Example (Horror game):
  * Aesthetics: Fear, tension
  * Mechanics: Limited resources (ammo, health), slow movement, dark environments, unpredictable enemies
  * Dynamics: Players conserve ammo, avoid combat, heightened fear

---

GAME BALANCE:

DOMINANT STRATEGY (Avoid):
- One strategy that's always best (players use only that, gameplay boring)
- Example (Fighting game): One character too powerful → everyone uses that character
- Solution: Nerf (reduce power), buff others, add counters

RISK VS REWARD:
- High risk → High reward (worth it)
- Low risk → Low reward (safe, consistent)
- Example (RPG): Easy path (low XP, common loot) vs Hard path (high XP, rare loot)

FAIRNESS (Symmetric vs Asymmetric):
- Symmetric: All players equal start (Chess, most sports)
- Asymmetric: Different roles, abilities (Dead by Daylight: 1 killer vs 4 survivors)
- Asymmetric requires careful balancing (each role fun, viable)

PLAYTESTING:
- Watch players (don't tell them what to do)
- Observe: Where do they struggle? What's confusing? What's fun?
- Iterate (change, test again, repeat)
```

---

## Level Design

```markdown
LEVEL DESIGN PRINCIPLES:

3 C's (Camera, Controls, Character):
- Must feel good FIRST (before designing levels)
- Test in greybox (simple shapes, no art)

PACING (Rhythm):
- Action → Calm → Action (not constant intensity, exhausting)
- Climax (boss, big challenge) → Rest (safe area, reward)
- Example (FPS): Combat encounter → Exploration/puzzle → Combat

TEACHING WITHOUT TELLING:
- Don't rely on tutorials (players skip, forget)
- Teach through gameplay (environmental cues, safe practice)
- Example (Super Mario 1-1):
  * Goomba walks toward player (player learns enemies move)
  * Blocks above (player tries jump, discovers mechanic)
  * Coin in air (encourages jumping, rewards exploration)

GOLDEN PATH vs SIDE CONTENT:
- Golden path: Main route (all players take, core experience)
- Side content: Optional (secrets, collectibles, challenges)
- Design golden path FIRST (ensure satisfying for all)
- Add side content for engagement, replayability

---

LEVEL DESIGN PATTERNS:

GAUNTLET:
- Linear challenge (one way through, increasing difficulty)
- Example: Platforming section (jump → jump over pit → jump between moving platforms)

ARENA:
- Open area, waves of enemies
- Example: Horde mode, boss fight

HUB:
- Central area, branches to different levels
- Example: Overworld map (Mario), Firelink Shrine (Dark Souls)

BRANCHING:
- Multiple paths (choice, different challenges/rewards)
- Example: Stealth route (harder, more XP) vs Combat route (easier, less XP)

METROIDVANIA:
- Interconnected world, backtracking with new abilities
- Example: Can't reach area until you get double-jump ability

---

ENVIRONMENTAL STORYTELLING:

SHOW, DON'T TELL:
- Visual clues (skeletons = danger, blood trail = something hurt, destroyed village = war)
- Audio (distant screams, eerie music = unsafe area)
- Props (diary entries, graffiti, environmental details)

LEADING THE PLAYER:
- Light (bright area = go here)
- Color (different from surroundings, stands out)
- Movement (birds flying, NPC walking = follow)
- Path of least resistance (obvious route vs hidden, players take obvious)

LANDMARKS:
- Visible from distance (player navigates using landmarks)
- Example: Tower, mountain, unique building
- Helps orientation (players don't get lost)
```

---

## Game Economy & Monetization

```markdown
IN-GAME ECONOMY:

SOURCES (Where currency comes from):
- Combat (kill enemies, loot)
- Quests (complete missions, rewards)
- Selling items
- Daily rewards (log in bonuses)

SINKS (Where currency goes):
- Upgrades (weapons, armor, abilities)
- Consumables (health potions, ammo)
- Cosmetics (skins, emotes, no gameplay advantage)
- Fast-travel, conveniences

BALANCE:
- Faucets (sources) vs Drains (sinks) = Stable economy
- Too much currency: Inflation (nothing valuable)
- Too little currency: Frustration (can't buy anything, grind too long)

MULTIPLE CURRENCIES:
- Hard currency (premium, bought with real money, rare drops)
- Soft currency (common, earned through gameplay)
- Why: Separates free vs paid content, psychological (premium feels special)

---

MONETIZATION MODELS:

PREMIUM (Pay upfront):
- One-time purchase ($30-$70)
- Full game access (no ads, no microtransactions)
- Examples: Most console games (Call of Duty, Elden Ring)
- Pro: No predatory tactics, Con: High barrier to entry

FREE-TO-PLAY (F2P):
- No upfront cost
- Monetize through:
  * Ads (watch ad → reward)
  * Microtransactions (buy currency, items, cosmetics)
- Examples: Mobile games (Candy Crush, Clash of Clans), many online games (Fortnite, Apex Legends)
- Pro: More players, Con: Can be predatory (pay-to-win, aggressive ads)

SUBSCRIPTION:
- Monthly fee ($10-$15/month)
- Access to game, content, benefits
- Examples: MMOs (World of Warcraft, Final Fantasy XIV), Xbox Game Pass
- Pro: Steady revenue, Con: Must provide ongoing value (content updates)

BATTLE PASS:
- Seasonal ($10-$20, 2-3 months)
- Unlock tiers (play, complete challenges → earn rewards)
- Free tier (basic) + Premium tier (paid, better rewards)
- Examples: Fortnite, Call of Duty, Apex Legends
- Pro: Engagement (players play more to unlock tiers), Con: FOMO (fear of missing out, time-limited)

---

ETHICAL MONETIZATION:

COSMETIC-ONLY (Best practice):
- Sell skins, emotes, customization (NO gameplay advantage)
- Example: Fortnite (purely cosmetic, no pay-to-win)

AVOID PAY-TO-WIN:
- Buying power = unfair (free players can't compete)
- Example (Bad): Mobile games (buy powerful weapons, skip timers)

LOOT BOXES (Controversial):
- Random rewards (gamble for item)
- Can be predatory (gambling mechanics, especially for children)
- Some countries ban or regulate (Belgium, Netherlands)
- Ethical alternative: Show contents before purchase, or direct purchase

FAIR ADVERTISING:
- Opt-in (player chooses to watch ad for reward, not forced)
- Frequency limits (not ad every 30 seconds, intrusive)
- Skippable (if ad too long, allow skip after 5-10 sec)
```

---

## Prototyping & Iteration

```markdown
PROTOTYPING:

WHY PROTOTYPE:
- Test idea quickly (before investing time/money in art, polish)
- Fail fast (if not fun in prototype, won't be fun with art)
- Iterate (make changes quickly, test, repeat)

TYPES:

PAPER PROTOTYPE (Fastest, cheapest):
- Cards, tokens, dice (simulate mechanics)
- Example: Card game, turn-based strategy
- Pro: Change rules instantly, Con: Can't test real-time action

DIGITAL PROTOTYPE (Greybox):
- Simple shapes (cubes, spheres, no textures)
- Focus on mechanics, feel (not visuals)
- Tools: Unity, Unreal, Godot, GameMaker
- Example: FPS prototype (shoot boxes, test gun feel)

VERTICAL SLICE (Polished section):
- One level, fully polished (art, sound, effects)
- Represents final quality (show to publishers, investors)
- Example: First 10 minutes of game (tutorial, first level)

---

PLAYTESTING:

INTERNAL (Team):
- Frequent (daily, weekly)
- Fast feedback (iterate quickly)
- Bias: Know game too well (may miss confusion)

EXTERNAL (Target audience):
- Less frequent (monthly, milestones)
- Fresh eyes (find issues you missed)
- Observe silently (don't explain, don't help)
- Questions:
  * What did you like?
  * What was frustrating?
  * What was confusing?
  * Would you play again?

METRICS (Data-driven):
- Track: Time played, completion rate, where players quit, what they buy
- Heatmaps (where players die, get stuck)
- A/B testing (two versions, compare which performs better)

---

ITERATION:

AGILE DEVELOPMENT (Sprints):
- 2-week cycles (plan → develop → test → review → repeat)
- Shippable product each sprint (could release if needed)
- Flexible (adapt to feedback, changing priorities)

KILL YOUR DARLINGS:
- Remove features that don't serve core experience (even if you love them)
- "When in doubt, cut it out"
- Example: Cool mechanic, but confuses players, slows pacing → Cut

FEATURE CREEP (Avoid):
- Adding too many features (scope bloat, never finish)
- Focus on core (do few things REALLY well > many things mediocre)
```

---

## Game Design Documentation

```markdown
GAME DESIGN DOCUMENT (GDD):

PURPOSE:
- Blueprint (team reference, consistent vision)
- Pitch (show publishers, investors)

SECTIONS:

1. OVERVIEW:
   - Title, genre, platform, target audience
   - High concept (1-2 sentences, elevator pitch)
   - Example: "A fast-paced roguelike where you play as a time-traveling ninja fighting through procedurally generated levels to prevent the apocalypse."

2. CORE MECHANICS:
   - Player actions (verbs)
   - Rules, systems
   - Core loop

3. STORY & SETTING:
   - World, characters, plot (if narrative-driven)

4. FEATURES:
   - List of gameplay features (combat, crafting, multiplayer, etc.)

5. ART STYLE:
   - Visual direction (realistic, stylized, pixel art, etc.)
   - Mood board (reference images)

6. AUDIO:
   - Music style, sound effects

7. TECHNICAL:
   - Engine, platform, technical requirements

8. MONETIZATION:
   - Business model (premium, F2P, etc.)

9. ROADMAP:
   - Milestones (prototype, alpha, beta, release)
   - Timeline

LIVING DOCUMENT:
- Update regularly (design changes, new ideas)
- Don't over-detail early (waste time on features that may get cut)

---

ONE-PAGE (Quick pitch):
- Title
- Genre, platform
- Hook (1 sentence)
- Key features (3-5 bullet points)
- Target audience
- Comparable games ("It's like X meets Y")
- Example: "It's like Dark Souls meets Stardew Valley"
```

---

## Key Takeaways

1. **Core loop first** - Nail the core experience (before adding features, content)
2. **Playtesting is critical** - Watch real players (not friends/family who are polite)
3. **Fail fast** - Prototype quickly (cut ideas that don't work early)
4. **Player-centric** - Design for player experience (not what YOU think is cool)
5. **Simplicity** - Do one thing great > many things mediocre (cut ruthlessly)

---

## References

- "The Art of Game Design: A Book of Lenses" - Jesse Schell
- "A Theory of Fun for Game Design" - Raph Koster
- GDC Vault (talks from Game Developers Conference)

**Related**: `level-design-patterns.md`, `game-balancing-strategies.md`, `ethical-monetization-f2p.md`
