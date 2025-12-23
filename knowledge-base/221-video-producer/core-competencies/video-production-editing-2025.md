# Video Production & Editing 2025

**Updated**: 2025-11-23 | **Stack**: Premiere Pro, After Effects, DaVinci Resolve

---

## Pre-Production Planning

```markdown
SHOT LIST:

Project: Product Demo Video
Duration: 90 seconds

| Shot # | Type | Description | Duration | Notes |
|--------|------|-------------|----------|-------|
| 1 | Wide | Product on desk | 3s | Establish scene |
| 2 | Close-up | Hand opens product | 2s | Focus on packaging |
| 3 | Medium | Person using product | 5s | Show interface |
| 4 | Insert | Screen recording | 10s | Feature demo |
| 5 | Wide | Person smiling | 2s | Satisfaction |

EQUIPMENT:
- Camera: Sony A7IV
- Lens: 24-70mm f/2.8
- Tripod: Manfrotto
- Lighting: 2x softboxes, 1x backlight
- Audio: Rode VideoMic Pro
- Backup: Phone camera (safety)

---

STORYBOARD:

[Frame 1: Wide shot, product on desk]
   Person enters frame →

[Frame 2: Close-up, hands opening]
   Cut to →

[Frame 3: Medium shot, using product]
   Voiceover: "Introducing..."

[Frame 4: Screen recording]
   Highlight features

[Frame 5: Back to person, smiling]
   End card with CTA

SCRIPT & VOICEOVER:
"Introducing the XYZ App - 
the easiest way to manage your tasks.
With intuitive design and powerful features,
you'll get more done in less time.
Try it free today."

(60 words × 2.5 = 150 words/min → 24 seconds voiceover)
```

---

## Camera Techniques

```markdown
COMPOSITION RULES:

RULE OF THIRDS:
┌─────┬─────┬─────┐
│     │     │     │
├─────┼─────┼─────┤
│     │  👤 │     │  ← Place subject at intersection
├─────┼─────┼─────┤
│     │     │     │
└─────┴─────┴─────┘

LEADING LINES:
Use natural lines to guide eye to subject
(roads, fences, shadows)

HEADROOM & NOSE ROOM:
- Headroom: Space above subject (not too much/little)
- Nose room: Space in direction subject is facing

---

SHOT TYPES:

EXTREME WIDE (EWS): Establish location
WIDE (WS): Full body, context
MEDIUM (MS): Waist up, conversation
CLOSE-UP (CU): Face, emotion
EXTREME CLOSE-UP (ECU): Eyes, detail

B-ROLL: Supplementary footage (cutaways, context)
- Product shots
- Environment
- Hands working
- Details

---

CAMERA MOVEMENT:

PAN: Horizontal rotation (left/right)
TILT: Vertical rotation (up/down)
DOLLY: Move camera toward/away from subject
TRUCK: Move camera left/right
ZOOM: Change focal length (avoid unless intentional)

HANDHELD vs TRIPOD:
- Tripod: Stable, professional (interviews, products)
- Handheld: Dynamic, documentary feel (action, vlogs)
- Gimbal/Steadicam: Smooth movement

---

LIGHTING SETUPS:

THREE-POINT LIGHTING:

KEY LIGHT (Main, 45° from subject)
    ↓
    👤
  ↗   ↖
FILL     BACK
(Soften  (Separate
shadows) from BG)

SOFT LIGHT: Diffused, flattering (interviews)
- Use: Softbox, umbrella, bounce

HARD LIGHT: Direct, dramatic (product, drama)
- Use: Open bulb, spotlight

NATURAL LIGHT: Window light (golden hour = best)
- Position subject facing window
- Reflector to fill shadows
```

---

## Video Editing

### Premiere Pro Workflow

```markdown
IMPORT & ORGANIZE:

PROJECT STRUCTURE:
my-project/
├── footage/
│   ├── 01-interview/
│   ├── 02-broll/
│   └── 03-screen-recording/
├── audio/
│   ├── voiceover/
│   └── music/
├── graphics/
│   └── lower-thirds/
└── exports/

BINS IN PREMIERE:
- Raw Footage
- Selects (good takes)
- B-Roll
- Audio
- Graphics
- Sequences

---

EDITING TECHNIQUES:

CUT (Hard cut):
Most common, instant transition
Use: Between similar shots, pacing

CROSS DISSOLVE (Fade):
Smooth transition, passage of time
Use: Montages, slower pacing
Duration: 12-24 frames (0.5-1 sec)

JUMP CUT:
Cut within same shot (removes time)
Use: Vlogs, interviews (remove "ums")

J-CUT & L-CUT:
- J-Cut: Audio starts before video
- L-Cut: Audio continues after video
Use: Natural conversations, smooth transitions

MATCH CUT:
Match subject/action between shots
Example: Ball throw → Moon (visual similarity)

---

PACING:

FAST PACE (Action, excitement):
- 1-2 second clips
- Quick cuts
- Upbeat music

SLOW PACE (Dramatic, emotional):
- 3-5+ second clips
- Slower transitions
- Ambient sound

RHYTHM:
- Cut on beat (music-driven)
- Vary shot length (not monotonous)
- Build to climax (increase pace)

---

AUDIO MIXING:

LEVELS (dBFS):
- Dialogue: -12 to -6 dB
- Music: -18 to -12 dB (lower than dialogue!)
- Sound effects: -12 to -6 dB

EQ (Equalize):
- Cut low frequencies (<80 Hz) - Remove rumble
- Boost 2-5 kHz - Clarity for vocals
- De-esser - Reduce sibilance (harsh "S" sounds)

COMPRESSION:
- Even out loud/quiet parts
- Threshold: -20 dB
- Ratio: 3:1
- Makes dialogue easier to hear

NOISE REDUCTION:
- Record room tone (30 sec silence)
- Apply noise profile
- Reduce by 12-18 dB

---

COLOR GRADING (Lumetri Color):

EXPOSURE:
- Adjust overall brightness
- Highlights: -10 (recover blown out areas)
- Shadows: +15 (lift dark areas)
- Whites/Blacks: Fine-tune

CONTRAST:
- Increase: More dramatic
- Decrease: Flatter, "filmic"

COLOR:
- Temperature: Warm (orange) vs Cool (blue)
- Tint: Green vs Magenta
- Saturation: +10 to +20 (don't overdo!)

CINEMATIC LOOK:
1. Slightly lift shadows (crushed blacks = less "video")
2. Desaturate blues slightly
3. Add slight orange/teal split (popular)
4. Vignette: -10 to -20 (darken edges)
5. Film grain: 5-10% (texture)

LUTs (Look-Up Tables):
- Pre-made color grades
- Apply after exposure/contrast correction
- Popular: FilmConvert, RocketStock
```

---

## Motion Graphics (After Effects)

```markdown
LOWER THIRD (Name plate):

DESIGN:
┌────────────────────────────────┐
│                                │
│                                │
│ ┌──────────────┐               │
│ │ JOHN DOE     │               │
│ │ CEO, Company │               │
│ └──────────────┘               │
└────────────────────────────────┘

ANIMATION:
0:00 - Start off-screen (left)
0:10 - Slide in (ease out)
0:30 - Hold
3:00 - Fade out

KEYFRAMES:
- Position: -500 → 50 (slide in)
- Opacity: 0 → 100 (fade in)
- Easing: Easy Ease (F9)

---

TEXT ANIMATION PRESETS:

FADE UP:
- Opacity: 0 → 100
- Position: Y +20 → 0
- Use: Clean, professional

TYPEWRITER:
- Character offset reveal
- Use: Tech, coding videos

SCALE IN:
- Scale: 0% → 100%
- Use: Punchy, energetic

TRACKING IN:
- Letter spacing: 200 → 0
- Use: Title cards

---

KINETIC TYPOGRAPHY:

Sync text to voiceover:
"We [scale] launched [rotate] our app [bounce]"

1. Split text into words
2. Add animation to emphasize keywords
3. Time to audio waveform
4. Add motion blur (180° shutter)

---

TRANSITIONS:

ZOOM TRANSITION:
1. Scale clip 1 to 150% (ease in)
2. Overlap with clip 2 at same scale
3. Scale clip 2 to 100% (ease out)
Result: Smooth zoom between clips

WHIP PAN:
1. Motion blur clip 1 (direction right)
2. Overlap with clip 2
3. Motion blur clip 2 (same direction)
Result: Fast swipe transition

GLITCH EFFECT:
1. Duplicate layer 3 times
2. Shift RGB channels (red left, blue right)
3. Add displacement
4. Flicker opacity
Result: Digital distortion
```

---

## Export Settings

```markdown
YOUTUBE (1080p):
- Format: H.264
- Preset: Match Source - High bitrate
- Resolution: 1920×1080 (16:9)
- Frame rate: Match source (24, 30, or 60fps)
- Bitrate: VBR, 1 pass, Target 10 Mbps
- Audio: AAC, 320 kbps, 48 kHz

INSTAGRAM (Vertical):
- Resolution: 1080×1350 (4:5) or 1080×1920 (9:16)
- Frame rate: 30fps
- Duration: <60 sec (Feed), <90 sec (Reels)
- Bitrate: 8 Mbps

TIKTOK:
- Resolution: 1080×1920 (9:16)
- Frame rate: 30fps
- Duration: <3 min
- Bitrate: 5-8 Mbps

PROFESSIONAL / ARCHIVE (ProRes):
- Format: QuickTime
- Codec: Apple ProRes 422 HQ
- No compression loss
- Large file size (1 min ≈ 1GB)
- Use: Client deliverables, archiving

---

FILE NAMING:
ProjectName_Version_Date_Resolution.ext
Example: ProductDemo_v3_2025-01-15_1080p.mp4

---

ASPECT RATIOS:
- 16:9 (1920×1080): YouTube, TV, standard
- 9:16 (1080×1920): TikTok, Instagram Reels, vertical
- 1:1 (1080×1080): Instagram Feed (square)
- 4:5 (1080×1350): Instagram Feed (portrait)
- 21:9 (2560×1080): Cinematic widescreen
```

---

## Video SEO

```markdown
YOUTUBE OPTIMIZATION:

TITLE (60 characters):
✅ "How to Edit Videos in Premiere Pro (Complete Tutorial)"
❌ "Video editing tutorial"

DESCRIPTION:
First 2 lines (157 characters) appear in search
- Include primary keyword
- Hook (what viewer will learn)
- Timestamps (YouTube likes this!)

Example:
"Learn Premiere Pro in 15 minutes! This beginner tutorial
covers importing, cutting, transitions, audio, and exporting.

📚 Chapters:
0:00 Intro
0:30 Importing Footage
2:15 Basic Cuts
5:40 Transitions..."

TAGS:
- Primary: "premiere pro tutorial"
- Secondary: "video editing", "how to edit videos"
- Long-tail: "premiere pro for beginners 2025"
- 10-15 tags total

THUMBNAIL:
- 1280×720px (16:9)
- Text: 3-5 words, large & readable
- High contrast (stand out in feed)
- Faces (eyes looking at camera)
- Arrow/circle to highlight
- A/B test (TubeBuddy, VidIQ)

ENGAGEMENT:
- Ask question in video ("Comment below...")
- Pattern interrupt at 0:30 (keep watching)
- End screen (subscribe + next video)
- CTR target: >10%
- Average view duration: >50%
```

---

## Key Takeaways

1. **Pre-production = 80%** - Planning saves time in edit
2. **Audio > Video** - Bad audio = unwatchable (invest in mic)
3. **Story first** - Don't rely on fancy effects
4. **Less is more** - Cut ruthlessly (tight pacing)
5. **Consistent uploads** - Algorithm loves consistency

---

## References

- "In the Blink of an Eye" - Walter Murch (editing)
- "The Filmmaker's Eye" - Gustavo Mercado (composition)
- Premiere Gal YouTube Channel

**Related**: `color-grading-advanced.md`, `motion-graphics-ae.md`, `youtube-growth.md`
