# Animation Production 2025

**Updated**: 2025-11-23 | **Tools**: Blender, After Effects, Toon Boom, Maya

---

## 12 Principles of Animation

```markdown
1. SQUASH & STRETCH:
   - Gives weight, flexibility
   - Ball bouncing: Squash on impact, stretch in air
   - Face: Squash when smile, stretch when surprised
   - Maintain volume (don't shrink/grow)

2. ANTICIPATION:
   - Prepares viewer for action
   - Jump: Crouch down first
   - Throw: Wind up arm back
   - Turn head: Look opposite direction first

3. STAGING:
   - Clear silhouette
   - Direct attention (composition, lighting, motion)
   - One idea at a time (don't confuse viewer)

4. STRAIGHT AHEAD vs POSE-TO-POSE:
   - Straight ahead: Draw frame-by-frame (fluid, spontaneous)
   - Pose-to-pose: Key poses first, fill in-betweens (controlled)
   - Hybrid: Use both (pose for main action, straight for details)

5. FOLLOW THROUGH & OVERLAPPING:
   - Parts move at different rates
   - Hair keeps moving after head stops
   - Coat tails drag behind, then settle
   - Creates realism

6. SLOW IN & SLOW OUT:
   - Ease in/out (not constant speed)
   - More drawings near start/end poses
   - Fewer in middle (faster motion)
   - Natural physics (acceleration/deceleration)

7. ARC:
   - Most actions follow curved path (not straight lines)
   - Arm swing: Arc motion
   - Head turn: Arc path
   - Straight lines = robotic

8. SECONDARY ACTION:
   - Adds dimension
   - Walk: Arms swing (secondary to leg motion)
   - Talk: Eyebrow raise, head tilt
   - Don't distract from primary action

9. TIMING:
   - Speed of action
   - Fast = few frames (energetic)
   - Slow = many frames (lethargic, heavy)
   - 24 fps (film), 30 fps (TV), 12 fps (animation on 2s)

10. EXAGGERATION:
    - Push reality (not copy)
    - Facial expressions: Bigger than real life
    - Movements: More dynamic
    - Makes animation appealing

11. SOLID DRAWING:
    - 3D space, weight, balance
    - Avoid "twins" (symmetrical poses, boring)
    - Line of action (gesture, flow)
    - Perspective, anatomy knowledge

12. APPEAL:
    - Charisma (villain or hero)
    - Clear design (simple shapes)
    - Asymmetry (more interesting)
    - Easy to read
```

---

## 2D Animation

```markdown
TRADITIONAL (Hand-drawn):

WORKFLOW:
1. Storyboard (plan scenes)
2. Animatic (rough animated storyboard with timing)
3. Layout (backgrounds, camera angles)
4. Key animation (key poses by lead animator)
5. In-betweening (fill frames between keys)
6. Clean-up (trace rough animation, clean lines)
7. Ink & paint (color)
8. Compositing (combine layers)
9. Sound & effects

FRAME RATE:
- "On 1s": 24 drawings/second (smooth, expensive)
- "On 2s": 12 drawings/second (economical, still smooth)
- "On 3s": 8 drawings/second (limited animation, TV)

---

DIGITAL 2D (Toon Boom Harmony, Adobe Animate):

ADVANTAGES:
- Undo! (huge time-saver)
- Reuse drawings (library)
- Easy color changes
- Layer management
- Camera moves (zoom, pan, rotate)

RIG ANIMATION:
- Create character once (parts separated: head, torso, arms, legs)
- Rig with bones (skeleton)
- Animate rig (faster than redrawing every frame)
- Good for: TV, web series (speed)
- Limitations: Less fluid than frame-by-frame

FRAME-BY-FRAME:
- Draw each frame (traditional approach, digital tools)
- Expressive, fluid
- Time-consuming
- Good for: High-quality shorts, films

---

TOOLS:

TOON BOOM HARMONY:
- Industry standard (TV animation)
- Rigging, traditional, hybrid
- $25/month (Essentials), $64/month (Premium)

ADOBE ANIMATE:
- Vector-based (scalable)
- Web animations (HTML5, interactive)
- $23/month (Creative Cloud)

PROCREATE (iPad):
- Frame-by-frame animation
- Animation Assist (onion skinning, playback)
- $13 one-time (affordable!)

KRITA:
- Free, open-source
- Frame-by-frame
- Good for beginners
```

---

## 3D Animation

```markdown
WORKFLOW:

1. MODELING:
   - Create 3D geometry (polygons, vertices, edges)
   - Low-poly (games, real-time) vs High-poly (films, renders)
   - Tools: Blender, Maya, ZBrush

2. RIGGING:
   - Add skeleton (bones, joints)
   - Weight painting (which polygons move with which bones)
   - Controls (IK/FK, sliders for facial expressions)

3. ANIMATION:
   - Keyframe animation (pose at key frames, computer interpolates)
   - Graph editor (adjust curves for smooth motion)
   - Timing, spacing

4. TEXTURING:
   - UV unwrapping (flatten 3D model to 2D)
   - Paint textures (Substance Painter, Photoshop)
   - Shaders (how surface reacts to light)

5. LIGHTING:
   - 3-point lighting (key, fill, rim)
   - HDRI (environment lighting)
   - Shadows, reflections

6. RENDERING:
   - Calculate final image (lights, shadows, textures)
   - CPU vs GPU (GPU faster)
   - Render engines: Cycles (realistic), Eevee (real-time)

7. COMPOSITING:
   - Combine render passes (beauty, shadows, reflections)
   - Color grading
   - VFX (particles, explosions)
   - Tools: After Effects, Nuke, Fusion

---

BLENDER (Free, open-source):

MODELING:
- Box modeling (start with cube, extrude, shape)
- Modifiers (mirror, array, subdivision)
- Sculpting (organic shapes, characters)

RIGGING:
- Armature (bones)
- Automatic weights vs manual weight painting
- IK (Inverse Kinematics): Move hand, arm follows
- FK (Forward Kinematics): Rotate shoulder → elbow → wrist

ANIMATION:
- Dopesheet (timeline, keyframes)
- Graph editor (curves for smooth motion)
- NLA (Non-Linear Animation): Blend animations (walk cycle + wave)

SHADING:
- Shader Editor (nodes for materials)
- PBR (Physically Based Rendering): Realistic materials
- Procedural textures (noise, voronoi) vs Image textures

RENDERING:
- Cycles: Path tracing (realistic, slow)
- Eevee: Real-time (fast, less realistic but still good)
- Denoise (reduce render noise without more samples)

---

MAYA (Industry standard, $235/month):

ADVANTAGES:
- Animation tools (robust graph editor)
- Studio pipeline integration
- MASH (motion graphics)
- Arnold renderer (included, high-quality)

USE CASES:
- Feature films (Pixar, DreamWorks use Maya)
- VFX
- Games (modeling, rigging)

---

CHARACTER ANIMATION:

WALK CYCLE (8-frame basic):

Frame 1: Contact (left foot forward, right back, both on ground)
Frame 2: Recoil (body lowers, weight shifts)
Frame 3: Passing (right leg passes left, body high)
Frame 4: High point (right foot forward, body highest)
Frame 5: Contact (right foot forward, left back - mirror of frame 1)
Frame 6: Recoil (mirror of frame 2)
Frame 7: Passing (mirror of frame 3)
Frame 8: High point (mirror of frame 4)

Loop back to Frame 1

WEIGHT SHIFT:
- Hip sways opposite to raised leg
- Shoulders rotate opposite to hips (counter-rotation)
- Arms swing opposite to legs

PERSONALITY:
- Confident: Wide stance, high chest, quick pace
- Sad: Slouched, slow, small steps, head down
- Sneaky: Low, exaggerated tiptoe, look around

---

FACIAL ANIMATION:

BLEND SHAPES (Shape keys in Blender):
- Neutral (base pose)
- Smile, frown, surprise, angry
- Phonemes (mouth shapes for speech):
  * M, B, P: Lips together
  * A, I: Mouth open
  * O, U: Lips rounded
  * F, V: Lower lip to upper teeth

LIP SYNC:
1. Record audio (or use voiceover)
2. Break down phonemes (mark on timeline)
3. Animate mouth shapes (blend between)
4. Add blinks (every 3-5 seconds)
5. Eye direction (where looking?)
6. Eyebrow raises (emphasize words)
7. Head tilts, nods (secondary motion)
```

---

## Motion Graphics

```markdown
AFTER EFFECTS:

KEYFRAME ANIMATION:
- Position, Scale, Rotation, Opacity
- Easy Ease (F9): Smooth in/out
- Graph Editor: Adjust bezier curves

EXPRESSIONS:
- Automate animation (code-driven)
- Wiggle: wiggle(5, 20) (5× per sec, 20 pixels)
- Loop: loopOut("cycle")
- Time: time*100 (property increases over time)

SHAPE LAYERS:
- Vector shapes (circles, rectangles, stars)
- Trim Paths (animate stroke reveal)
- Merge Paths (combine shapes)

TEXT ANIMATION:
- Animate by character, word, or line
- Presets (typewriter, fade in, slide in)
- Range Selector (control which letters animate)

EFFECTS:
- Glow, Drop Shadow
- CC Particle World (particles, explosions)
- Warp, Distort

PLUGINS:
- Element 3D (3D objects in AE, $200)
- Trapcode Suite (particles, $999)
- Motion Bro (free animation presets)

---

USE CASES:

LOGO ANIMATION:
- 5-10 seconds
- Reveal logo with motion
- Sound design (whoosh, impact)

EXPLAINER VIDEOS:
- Animated infographics
- Character animation (rigged 2D)
- Voiceover + text + visuals

TITLE SEQUENCES:
- Film/TV opening credits
- Typography animation
- Camera moves through 3D space

SOCIAL MEDIA:
- Short (15-60 sec)
- Eye-catching (bright colors, fast motion)
- No sound (captions needed)
```

---

## Production Pipeline

```markdown
PRE-PRODUCTION:

SCRIPT:
- Story beats
- Dialogue
- Scene descriptions

STORYBOARD:
- Visual script (panels showing each shot)
- Camera angles
- Character positions
- Arrows for motion

ANIMATIC:
- Storyboard timed to audio
- Rough animation (pose-to-pose)
- Establish timing, pacing
- Edit before full animation (save time!)

DESIGN:
- Character designs (turnaround: front, side, back, 3/4 view)
- Prop designs
- Environment designs
- Color keys (mood, palette)

---

PRODUCTION:

LAYOUT:
- Camera placement
- Character blocking (where in scene?)
- Background art

ANIMATION:
- Rough animation (key poses)
- In-betweens
- Polish (refine, add secondary motion)

CLEAN-UP (2D):
- Trace rough animation with clean lines
- Consistent line weight

RENDERING (3D):
- Final render (lights, textures, shadows)
- Render passes (separate layers)
- Takes time! (minutes to hours per frame)

---

POST-PRODUCTION:

COMPOSITING:
- Combine layers (characters, backgrounds, effects)
- Color correction
- VFX (fire, smoke, magic)

SOUND DESIGN:
- Dialogue (record voiceover)
- Foley (footsteps, cloth rustling)
- SFX (whoosh, impact, magic sounds)
- Music (score, soundtrack)

EDITING:
- Assemble shots
- Pacing (cut shots shorter if drags)
- Transitions
- Final export (H.264, ProRes)
```

---

## Career Paths

```markdown
ROLES:

2D ANIMATOR:
- TV animation (series, commercials)
- Independent films
- Salary: $40K-$80K

3D ANIMATOR:
- Feature films (Pixar, DreamWorks)
- Games (cinematic cutscenes)
- VFX (Marvel, ILM)
- Salary: $60K-$120K

MOTION GRAPHICS DESIGNER:
- Commercials, ads
- Explainer videos
- Title sequences
- Salary: $50K-$90K

RIGGING ARTIST:
- Create character rigs (bones, controls)
- Technical + artistic
- Salary: $60K-$100K

STORYBOARD ARTIST:
- Plan shots, camera angles
- Drawing skills + cinematic knowledge
- Salary: $50K-$90K

---

INDUSTRIES:

FILM & TV:
- Feature films (theatrical release)
- TV series (cable, streaming)
- Commercials (30-60 sec ads)

GAMES:
- Cinematic trailers
- In-game cutscenes
- Character animation (real-time)

ADVERTISING:
- Product demos
- Logo animations
- Social media ads

EDUCATION:
- Explainer videos (YouTube, online courses)
- Training videos (corporate)

---

FREELANCE vs STUDIO:

FREELANCE:
- Flexible schedule
- Work from home
- Variety of projects
- Inconsistent income
- Find own clients

STUDIO:
- Stable salary, benefits
- Team collaboration
- Specialized role (rigging, lighting, etc.)
- Office hours (9-5, or more... crunch time)
- Less variety (work on one project for months/years)
```

---

## Key Takeaways

1. **Master basics** - 12 principles apply to all animation
2. **Observe reality** - Study real movement, then exaggerate
3. **Timing is key** - Fast = energetic, slow = heavy
4. **Show, don't tell** - Action conveys emotion better than words
5. **Iterate** - Animate rough first, refine later (don't perfect first pass)

---

## References

- "The Animator's Survival Kit" - Richard Williams
- "The Illusion of Life" - Frank Thomas & Ollie Johnston
- Blender Guru (YouTube), CG Cookie

**Related**: `3d-modeling.md`, `rigging-tutorial.md`, `motion-graphics-ae.md`
