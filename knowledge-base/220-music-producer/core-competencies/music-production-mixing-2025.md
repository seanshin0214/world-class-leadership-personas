# Music Production & Mixing 2025

**Updated**: 2025-11-23 | **DAW**: Ableton Live, Logic Pro, FL Studio

---

## Production Workflow

```
SONGWRITING → PRODUCTION → MIXING → MASTERING

1. SONGWRITING (Idea):
   - Melody, chords, lyrics
   - Voice memo, piano sketch
   - Reference tracks

2. PRODUCTION (Arrangement):
   - Drums, bass, synths, vocals
   - Sound design
   - Structure (intro, verse, chorus, etc.)

3. MIXING (Balance):
   - EQ, compression, reverb
   - Panning, levels
   - Make everything sit together

4. MASTERING (Polish):
   - Final EQ, compression, limiting
   - Loudness optimization
   - Export for streaming platforms
```

---

## Song Structure

```markdown
TYPICAL POP SONG:

Intro (4-8 bars)
Verse 1 (8 bars)
Pre-Chorus (4 bars)
Chorus (8 bars)
Verse 2 (8 bars)
Pre-Chorus (4 bars)
Chorus (8 bars)
Bridge (8 bars)
Chorus (8 bars) × 2
Outro (4-8 bars)

TOTAL: ~3-4 minutes

---

TEMPO (BPM):

Hip-Hop: 80-100 BPM
House: 120-130 BPM
Techno: 125-135 BPM
Drum & Bass: 160-180 BPM
Pop: 100-130 BPM

---

KEY:
- Choose key signature (C major, A minor, etc.)
- Stay in key (most of the time)
- Borrow chords for color (modal interchange)

COMMON PROGRESSIONS:
- I - V - vi - IV (C - G - Am - F) "Pop progression"
- vi - IV - I - V (Am - F - C - G) "Emotional"
- I - vi - IV - V (C - Am - F - G) "50s progression"
```

---

## Drums & Rhythm

```markdown
DRUM ELEMENTS:

KICK (Low frequency, 50-100 Hz):
- Drives energy
- On beat 1 of every bar (minimum)
- Four-on-the-floor (house, techno): Every beat

SNARE / CLAP (Mid frequency, 200-500 Hz):
- Backbeat (beats 2 & 4)
- Adds punch

HI-HAT (High frequency, 8-12 kHz):
- Rhythm, groove
- Closed (tight), Open (sustained)
- 8th notes or 16th notes

PATTERNS:

Basic 4/4 beat:
| Kick | Snare | HH |
|------|-------|-----|
| 1    | 2     | 1234|
| 3    | 4     | 5678|

```
Kick:  X . . . X . . . X . . . X . . .
Snare: . . X . . . X . . . X . . . X .
HiHat: X X X X X X X X X X X X X X X X
```

DRUM MIXING:
- Kick: Boost 60 Hz (sub), cut 400 Hz (boxiness), boost 4 kHz (click)
- Snare: Boost 200 Hz (body), boost 5 kHz (snap)
- Hi-hat: High-pass filter at 500 Hz (remove low end)

SIDECHAIN COMPRESSION:
- Duck other instruments when kick hits
- Creates "pumping" effect (house, EDM)
- Kick triggers compressor on bass

---

MIDI PROGRAMMING:

VELOCITY (How hard note is hit):
- 0 (softest) to 127 (hardest)
- Vary velocity for humanization (70-100 range)
- Accents on downbeats (higher velocity)

HUMANIZATION:
- Slight timing variations (±5-10ms)
- Velocity variations
- Avoid perfect grid (quantize to 90-95%, not 100%)
```

---

## Sound Design (Synthesis)

```markdown
SYNTHESIZER BASICS:

OSCILLATOR:
- Generates waveform
- Types:
  * Sine: Pure tone (no harmonics)
  * Square: Hollow, clarinet-like
  * Saw: Bright, buzzy
  * Triangle: Mellow, flute-like

FILTER:
- Shapes sound by removing frequencies
- Types:
  * Low-pass: Let low frequencies pass (remove highs)
  * High-pass: Let high frequencies pass (remove lows)
  * Band-pass: Let middle frequencies pass
- Cutoff: Frequency where filter starts cutting
- Resonance: Boost at cutoff (adds character)

ENVELOPE (ADSR):
- Attack: Time to reach full volume (0-1000ms)
  * Fast (0-10ms): Plucky, percussive
  * Slow (100ms+): Pad, strings
- Decay: Time to drop to sustain level
- Sustain: Volume while key held
- Release: Time to fade out after key released

EXAMPLE (Analog Bass):
1. Oscillator: Saw wave
2. Filter: Low-pass, cutoff 200 Hz, resonance 30%
3. Envelope: Attack 5ms, Decay 200ms, Sustain 50%, Release 100ms
4. Result: Punchy bass with quick attack

---

EFFECTS:

REVERB (Space):
- Simulates room acoustics
- Parameters:
  * Size: Room dimension (small = tight, large = spacious)
  * Decay: How long reverb lasts
  * Pre-delay: Gap before reverb starts (20-50ms = clarity)
- Use: Vocals, drums, synths (adds depth)

DELAY (Echo):
- Repeats signal
- Parameters:
  * Time: Milliseconds or sync to tempo (1/4 note, 1/8 note)
  * Feedback: How many repeats
  * Mix: Dry/wet balance
- Use: Vocals (slap-back), guitars, synths

CHORUS (Thickening):
- Duplicate signal, detune slightly
- Creates width, movement
- Use: Synths, guitars, vocals

DISTORTION:
- Adds harmonics (grit, warmth)
- Types: Overdrive, distortion, saturation
- Use: Guitars, drums, synths (add edge)
```

---

## Mixing

```markdown
GAIN STAGING:
- Set levels before mixing
- Peak at -6 dB (headroom for mastering)
- Avoid clipping (red meters)

MIXING PROCESS:

1. VOLUME BALANCE (Faders):
   - Start with drums (kick, snare)
   - Add bass
   - Layer instruments
   - Vocals on top (loudest)

2. PANNING (Stereo Width):
   - Kick, snare, bass: Center (mono)
   - Hi-hats: Slightly left/right (10-20%)
   - Guitars: Hard left/right (80-100%)
   - Synths: Spread across stereo field
   - Vocals: Center (lead), sides (harmonies)

3. EQ (Frequency Balance):
   - SUBTRACTIVE EQ: Cut mud, harshness
     * Cut 200-400 Hz: Boxiness, mud
     * Cut 2-4 kHz: Harshness
   - ADDITIVE EQ: Boost presence, air
     * Boost 5-8 kHz: Clarity, presence
     * Boost 10-15 kHz: Air, sparkle
   
   TIPS:
   - High-pass everything except kick, bass (remove rumble)
   - Cut before you boost
   - Use narrow Q for cuts, wide Q for boosts

4. COMPRESSION (Dynamics):
   - Evens out volume (loud quieter, quiet louder)
   - Parameters:
     * Threshold: Level where compression starts (-20 dB)
     * Ratio: Amount of compression (4:1 = moderate)
     * Attack: How fast compressor reacts (fast = punchy, slow = natural)
     * Release: How fast compressor stops (100-300ms)
   
   USE CASES:
   - Vocals: 3:1 to 6:1 ratio, fast attack (5-10ms)
   - Drums: 4:1 ratio, fast attack (1-5ms)
   - Bass: 5:1 ratio, medium attack (10-30ms)
   - Master bus: 2:1 ratio, slow attack (30ms+)

5. REVERB & DELAY (Space):
   - Send tracks to reverb bus (not insert)
   - Vocals: Medium reverb (1-2 sec decay), 20ms pre-delay
   - Drums: Short room (0.5 sec decay)
   - Avoid reverb on bass (muddies low end)

---

FREQUENCY CHART:

20-60 Hz: Sub-bass (rumble, kick fundamental)
60-250 Hz: Bass (power, warmth)
250-500 Hz: Mud zone (cut here!)
500 Hz-2 kHz: Midrange (presence, body)
2-5 kHz: High-mids (definition, clarity)
5-10 kHz: Presence (air, sparkle)
10-20 kHz: Air (shimmer, brightness)

---

MIXING TIPS:

REFERENCE TRACK:
- Import commercial track in same genre
- A/B compare levels, EQ, stereo width
- Match overall loudness (but don't limit yet!)

MONO CHECK:
- Sum to mono (check phase issues)
- Mix should sound good in mono
- Panned elements should still be audible

TAKE BREAKS:
- Ear fatigue after 1-2 hours
- Fresh ears = better decisions
- Come back next day for final tweaks
```

---

## Mastering

```markdown
MASTERING CHAIN (Order matters!):

1. EQ (Corrective):
   - Subtle adjustments (±2 dB max)
   - Cut harsh frequencies
   - Boost air (10-15 kHz) slightly

2. COMPRESSION (Glue):
   - 1.5:1 to 2:1 ratio (gentle)
   - Slow attack (30-50ms)
   - 1-2 dB gain reduction (subtle)
   - Binds mix together

3. MULTIBAND COMPRESSION (Optional):
   - Compress different frequency bands independently
   - Control boomy bass, harsh highs

4. SATURATION / EXCITER (Warmth):
   - Adds harmonics
   - Analog tape emulation
   - Subtle (don't overdo!)

5. LIMITING (Loudness):
   - Brick wall limiter (prevents clipping)
   - Ceiling: -0.3 dB (true peak)
   - Target loudness:
     * Spotify: -14 LUFS (integrated)
     * Apple Music: -16 LUFS
     * YouTube: -13 LUFS
     * Club: -8 LUFS
   - Use LUFS meter (not peak meter!)

---

EXPORT SETTINGS:

STREAMING (Spotify, Apple Music):
- Format: WAV or FLAC
- Bit depth: 24-bit
- Sample rate: 44.1 kHz or 48 kHz
- Don't export MP3 for mastering!

CD:
- 16-bit, 44.1 kHz

MASTERING SERVICES:
- LANDR (AI, $5-15/track)
- eMastered (AI, $9/track)
- Professional engineer ($50-200/track)
```

---

## DAW Shortcuts (Ableton Live)

```markdown
NAVIGATION:
Cmd/Ctrl + T: New MIDI track
Cmd/Ctrl + Shift + T: New audio track
Cmd/Ctrl + D: Duplicate
Cmd/Ctrl + J: Consolidate (bounce to audio)
Cmd/Ctrl + E: Split at playhead
Tab: Switch between Arrangement & Session view

PLAYBACK:
Space: Play/pause
0 (zero): Stop (return to start)
Shift + Space: Continue playback

EDITING:
Cmd/Ctrl + L: Loop selection
Cmd/Ctrl + M: Insert MIDI clip
Cmd/Ctrl + Shift + M: Insert audio clip
Cmd/Ctrl + U: Quantize (snap to grid)

MIXING:
Cmd/Ctrl + G: Group tracks
Cmd/Ctrl + R: Show/hide Returns (reverb, delay sends)
Cmd/Ctrl + Alt + F: Freeze track (save CPU)
```

---

## Key Takeaways

1. **Arrangement** - Build energy (drops, buildups, breaks)
2. **Frequency balance** - Each instrument has its space
3. **Reference tracks** - Learn from pros (A/B compare)
4. **Less is more** - Don't overprocess (subtle changes)
5. **Finish songs** - 10 finished tracks > 100 half-done

---

## References

- "Mixing Secrets" - Mike Senior
- "The Art of Mixing" - David Gibson
- Produce Like A Pro YouTube

**Related**: `sound-design-synthesis.md`, `vocal-mixing.md`, `mastering-techniques.md`
