# Nursing Care & Patient Management 2025

**Updated**: 2025-11-23 | **Focus**: Clinical Skills, Patient Safety, Care Coordination

---

## Nursing Process (ADPIE)

```
A - ASSESSMENT
Collect patient data (vital signs, symptoms, history)

D - DIAGNOSIS
Identify nursing diagnoses (e.g., "Risk for falls", "Acute pain")

P - PLANNING
Set goals & interventions

I - IMPLEMENTATION
Execute the care plan

E - EVALUATION
Did interventions work? Reassess & adjust
```

---

## Vital Signs & Assessment

### Taking Vital Signs

```markdown
BLOOD PRESSURE:

Equipment: Sphygmomanometer, stethoscope
Procedure:
1. Patient seated, arm at heart level, rested 5 minutes
2. Correct cuff size (bladder 80% of arm circumference)
3. Inflate 20-30 mmHg above palpated systolic
4. Deflate 2-3 mmHg/second
5. Listen for Korotkoff sounds:
   - Phase 1 (systolic): First sound
   - Phase 5 (diastolic): Sound disappears

Common errors:
- Wrong cuff size (too small → falsely high)
- Arm not supported → falsely high
- Talking during measurement → falsely high

HEART RATE:

Radial pulse (wrist):
- Palpate with index & middle fingers (not thumb)
- Count for 30 seconds × 2 (or 15 sec × 4)
- Note: Rate, rhythm (regular vs irregular), quality

Apical pulse (chest):
- Use stethoscope, 5th intercostal space, midclavicular line
- Count for full 60 seconds
- Indicated for: Irregular rhythms, medications affecting HR

RESPIRATORY RATE:

- Observe chest rise & fall
- Count for 30 seconds × 2
- Don't tell patient (they'll alter breathing)
- Note: Rate, depth, pattern, use of accessory muscles

TEMPERATURE:

Routes:
- Oral: Most common, wait 15 min after eating/drinking
- Rectal: Most accurate core temp (add 1°F to oral)
- Axillary: Least accurate (subtract 1°F from oral)
- Tympanic: Fast, convenient
- Temporal artery: Non-invasive, accurate

OXYGEN SATURATION (SpO2):

- Pulse oximeter on finger
- Normal: 95-100%
- Hypoxemia: <90%
- Factors affecting accuracy: Nail polish, poor perfusion, anemia
```

---

## Medication Administration (5 Rights + 3)

```
5 RIGHTS:
1. Right Patient (check 2 identifiers: name + DOB)
2. Right Medication (check label 3 times)
3. Right Dose
4. Right Route (PO, IV, IM, SC, topical, etc.)
5. Right Time

+ 3 MORE:
6. Right Documentation
7. Right to Refuse
8. Right Assessment (check vitals, allergies, contraindications)

BEFORE ADMINISTERING:
□ Check allergies
□ Check vital signs (e.g., hold beta-blocker if HR <60)
□ Check labs (e.g., hold metformin if Cr >1.5)
□ Check for interactions
□ Verify order in MAR (Medication Administration Record)

AFTER ADMINISTERING:
□ Document immediately (time, dose, route, site)
□ Monitor for adverse effects (15-30 minutes)
□ Assess effectiveness (pain meds: reassess pain in 1 hour)
```

### High-Alert Medications

```markdown
INSULIN:
- Always verify with second nurse
- Use insulin syringe (U-100)
- Check blood glucose before administering
- Common error: Confusing rapid-acting (lispro) vs long-acting (glargine)

ANTICOAGULANTS (heparin, warfarin):
- Check INR/PTT before dose
- Monitor for bleeding (gums, bruising, hematuria)
- Have reversal agents available:
  * Heparin → Protamine sulfate
  * Warfarin → Vitamin K, FFP

OPIOIDS (morphine, fentanyl):
- Assess pain level (0-10 scale)
- Check respiratory rate (hold if <12/min)
- Monitor for sedation
- Have naloxone (Narcan) available

CHEMOTHERAPY:
- Verify with second nurse
- Wear PPE (gown, gloves)
- Use closed system transfer device
- Monitor for extravasation

POTASSIUM:
- Never IV push (cardiac arrest risk)
- Max rate: 10 mEq/hour (20 mEq/hour with cardiac monitoring)
- Dilute in IV fluid
- Check renal function before administering
```

---

## IV Therapy

### Starting an IV

```markdown
EQUIPMENT:
- Tourniquet
- Alcohol swabs, chlorhexidine
- IV catheter (18G for trauma/surgery, 20-22G for routine)
- Transparent dressing
- Saline flush
- Extension set

PROCEDURE:

1. PREPARE:
   - Wash hands, don gloves
   - Explain to patient
   - Position arm below heart level
   - Apply tourniquet 4-6 inches above insertion site

2. SELECT VEIN:
   - Preferred: Dorsal hand veins, cephalic vein (forearm)
   - Avoid: Antecubital fossa (restricts movement), areas with phlebitis
   - Palpate for bounce (hard = sclerosed, soft = good)

3. INSERT:
   - Cleanse site (alcohol → chlorhexidine, let dry)
   - Anchor vein with thumb below insertion site
   - Insert at 10-30° angle, bevel up
   - Watch for blood flashback
   - Advance catheter while withdrawing needle
   - Release tourniquet

4. SECURE:
   - Attach extension set
   - Flush with saline (should flow easily, no swelling)
   - Apply transparent dressing
   - Label with date, time, catheter size, initials

5. DOCUMENT:
   - Site, catheter size, number of attempts, patient tolerance

COMPLICATIONS:
- Infiltration: Fluid leaking into tissue (swelling, coolness, pain)
  → Remove IV, elevate arm, warm compress
- Phlebitis: Vein inflammation (redness, warmth, tenderness along vein)
  → Remove IV, warm compress, consider antibiotic
- Air embolism: Rare, but serious
  → Prevention: Prime all tubing, close clamps when disconnecting
```

### IV Drip Rate Calculations

```python
def calculate_iv_drip_rate(volume_ml, time_hours, drop_factor):
    """
    Calculate IV drip rate in drops per minute
    
    volume_ml: Total volume to infuse (mL)
    time_hours: Time to infuse (hours)
    drop_factor: Drops per mL (10, 15, 20, or 60 for microdrip)
    """
    drops_per_min = (volume_ml * drop_factor) / (time_hours * 60)
    return round(drops_per_min)

# Example: Infuse 1000 mL over 8 hours, drop factor 15
rate = calculate_iv_drip_rate(1000, 8, 15)
print(f"Drip rate: {rate} drops/min")  # 31 drops/min

# For IV pump (mL/hour):
def calculate_pump_rate(volume_ml, time_hours):
    return volume_ml / time_hours

pump_rate = calculate_pump_rate(1000, 8)
print(f"Pump rate: {pump_rate} mL/hr")  # 125 mL/hr
```

---

## Wound Care

### Pressure Injury Staging

```markdown
STAGE 1: Non-blanchable erythema
- Intact skin
- Redness that doesn't blanch with pressure
- May be warm, firm
Treatment: Reposition q2h, moisture barrier cream

STAGE 2: Partial-thickness skin loss
- Dermis exposed (pink, moist)
- Shallow ulcer, blister
Treatment: Foam dressing, hydrocolloid

STAGE 3: Full-thickness skin loss
- Subcutaneous fat visible
- May have slough (yellow tissue)
- Undermining possible
Treatment: Debridement, alginate or foam dressing

STAGE 4: Full-thickness tissue loss
- Muscle, tendon, bone exposed
- Eschar (black necrotic tissue) present
- Deep undermining
Treatment: Surgical debridement, wound vac, specialized dressing

UNSTAGEABLE: Obscured by eschar
- Can't determine depth until eschar removed
Treatment: Consult wound care specialist

DEEP TISSUE INJURY: Purple/maroon discoloration
- Intact skin
- Evolves to Stage 3-4 despite treatment
- Common: Heels, sacrum
Prevention: Heel protectors, turn q2h
```

### Wound Dressing Types

```markdown
GAUZE:
- Basic, absorbent
- Change daily or when saturated
- Use: Wounds with heavy drainage

FOAM:
- Absorbent, cushioning
- Change every 3-7 days
- Use: Moderate drainage, pressure relief

HYDROCOLLOID:
- Forms gel with wound fluid
- Change every 3-7 days
- Use: Minimal to moderate drainage, Stage 2 ulcers

ALGINATE:
- Derived from seaweed, highly absorbent
- Change daily or when saturated
- Use: Heavy drainage, packing deep wounds

TRANSPARENT FILM:
- Waterproof, allows visualization
- Change every 5-7 days
- Use: IV sites, Stage 1 ulcers, protection

NEGATIVE PRESSURE (Wound VAC):
- Promotes granulation, removes excess fluid
- Change every 48-72 hours
- Use: Deep wounds, surgical dehiscence
```

---

## Patient Safety

### Fall Prevention

```markdown
FALL RISK ASSESSMENT (Morse Fall Scale):

1. History of falling: 25 points
2. Secondary diagnosis: 15 points
3. Ambulatory aid:
   - None/bedrest: 0
   - Crutches/cane: 15
   - Furniture: 30
4. IV/heparin lock: 20 points
5. Gait:
   - Normal: 0
   - Weak: 10
   - Impaired: 20
6. Mental status:
   - Oriented: 0
   - Forgets limitations: 15

TOTAL:
- 0-24: Low risk
- 25-50: Moderate risk
- ≥51: High risk

INTERVENTIONS:

ALL PATIENTS:
□ Call light within reach
□ Bed in lowest position
□ Brake locks engaged
□ Adequate lighting
□ Non-skid socks
□ Clutter-free environment

MODERATE RISK:
□ Yellow arm band
□ Assist with ambulation
□ Toileting schedule (q2-4h)
□ Bed alarm

HIGH RISK:
□ Red arm band
□ Bed/chair alarm
□ 1:1 sitter (if confused, pulling at lines)
□ Low bed or floor mat
□ Consider restraints (last resort, requires MD order)
```

### Infection Control

```markdown
STANDARD PRECAUTIONS (All patients):
- Hand hygiene (before/after patient contact)
- Gloves (if touching blood, body fluids)
- Gown (if splashing likely)
- Mask/eye protection (if airborne droplets expected)

TRANSMISSION-BASED PRECAUTIONS:

CONTACT (C. diff, MRSA, VRE, scabies):
- Private room or cohort
- Gloves + gown for all contact
- Dedicated equipment (stethoscope, BP cuff)
- Clean room with bleach (C. diff)

DROPLET (Influenza, COVID-19, pertussis):
- Private room or cohort
- Surgical mask within 6 feet
- Patient wears mask during transport

AIRBORNE (TB, measles, varicella):
- Negative pressure room
- N95 respirator (fit-tested)
- Keep door closed
- Limit transport

HAND HYGIENE:
Alcohol-based hand rub:
- Most situations
- 20 seconds, cover all surfaces
- NOT effective for C. diff (use soap & water)

Soap & water:
- Visibly soiled hands
- C. diff, norovirus
- After using restroom
- 20 seconds, scrub thoroughly
```

---

## Emergency Situations

### Code Blue (Cardiac Arrest)

```markdown
YOUR ROLE AS BEDSIDE NURSE:

1. RECOGNIZE:
   - Unresponsive, not breathing normally
   - No pulse

2. CALL FOR HELP:
   - Press code blue button / call overhead
   - State: "Code Blue, Room [X]"

3. START CPR:
   - Position backboard under patient
   - Begin chest compressions (100-120/min, 2 inches deep)
   - Continue until code team arrives

4. CODE TEAM ARRIVES:
   - Provide patient information:
     * Age, code status (full code vs DNR)
     * Chief complaint, recent events
     * Allergies, medications
     * Last vital signs
   - Assist with:
     * Drawing labs (ABG, troponin, lactate)
     * Medication administration
     * Charting (document all interventions, times)

5. POST-CODE:
   - If ROSC (return of spontaneous circulation):
     * Notify family
     * ICU transfer
     * Therapeutic hypothermia if indicated
   - If death:
     * Pronouncement by MD
     * Notify family (offer presence, chaplain)
     * Prepare body (remove tubes except in coroner cases)
     * Document

CPR QUICK REFERENCE:
- Compressions: 100-120/min, 2 inches deep, full recoil
- Ventilations: 2 breaths after every 30 compressions (if intubated, 10 breaths/min continuous)
- Defibrillation: VFib/pulseless VTach → shock 200J biphasic
- Epinephrine: 1 mg IV q3-5min
- Amiodarone: 300 mg IV bolus (for VFib/VTach)
```

### Rapid Response (Patient Deteriorating)

```markdown
WHEN TO CALL:
- Acute change in mental status
- Respiratory rate >30 or <8
- Oxygen saturation <90% despite O2
- Heart rate >130 or <40
- Systolic BP >180 or <90
- Concerned for patient

SBAR COMMUNICATION:

S - SITUATION:
"This is [Your Name], RN on [Unit]. I'm calling about [Patient Name], Room [X].
I'm concerned because [patient's condition]."

B - BACKGROUND:
"Patient is a [age]-year-old with [diagnoses], admitted [date] for [reason].
Current vital signs are [BP/HR/RR/SpO2/Temp]."

A - ASSESSMENT:
"I think the problem is [suspected cause].
Patient is [stable/unstable]."

R - RECOMMENDATION:
"I recommend [intervention needed].
Do you want to [specific orders]?"

EXAMPLE:
S: "I'm calling about Mr. Smith, Room 215. His oxygen saturation is 85% on 4L nasal cannula."
B: "He's a 65-year-old with COPD, admitted yesterday for pneumonia. Vital signs: BP 130/80, HR 110, RR 28, SpO2 85%, Temp 38.5°C."
A: "I think he's developing respiratory distress. He's using accessory muscles and becoming confused."
R: "I recommend increasing oxygen to non-rebreather mask and getting a chest X-ray. Should I call Respiratory Therapy?"
```

---

## Documentation

### Nursing Notes (DAR Format)

```markdown
D - DATA (Objective assessment):
"Patient reports chest pain 7/10, crushing, radiating to left arm.
Diaphoretic, pale. VS: BP 150/95, HR 110, RR 24, SpO2 96% on RA."

A - ACTION (Interventions):
"Placed patient on cardiac monitor. ECG obtained showing ST elevation in leads II, III, aVF.
MD notified. Aspirin 325mg PO given. IV access established, 18G left forearm.
Morphine 2mg IV given for pain."

R - RESPONSE (Outcome):
"Chest pain decreased to 3/10. Patient appears more comfortable.
Awaiting transport to cath lab. Family notified."

AVOID:
❌ "Patient doing well" (too vague)
❌ Late entries (document in real-time)
❌ Blaming others
✅ Be specific, objective, timely
```

---

## Key Takeaways

1. **Safety first** - Double-check medications, prevent falls, infection control
2. **Assess frequently** - Patients change quickly, catch deterioration early
3. **Communicate clearly** - Use SBAR, involve team
4. **Document thoroughly** - If not documented, it didn't happen
5. **Patient-centered care** - Involve patient/family in decisions

---

## References

- Nursing Drug Handbook (2025)
- AACN Procedure Manual
- CDC Infection Control Guidelines
- AHA BLS/ACLS Guidelines

**Related**: `critical-care-nursing.md`, `pharmacology-for-nurses.md`, `patient-education.md`
