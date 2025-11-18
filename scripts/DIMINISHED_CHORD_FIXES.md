# Diminished Chord Voicing Fixes

## Problem Analysis

The pattern `['x', 'x', 1, 2, 1, 2]` is a movable diminished 7th shape. At different frets, it produces different dim7 chords:

- **Fret 1, 4, 7, 10**: Produces Adim7 (A, C, D#, F#) = Cdim7 (C, D#, F#, A)
- **Fret 2, 5, 8, 11**: Produces A#dim7 (A#, C#, E, G) = C#dim7 (C#, E, G, A#)
- **Fret 3, 6, 9, 12**: Produces Bdim7 (B, D, F, G#) = Ddim7 (D, F, G#, B)

## Current Issues

1. **Cdim7** voicings use frets 2, 8, 11 → These produce A#dim7 (wrong!)
2. **Cdim** voicings use dim7 pattern → Should use triad pattern (3 notes, not 4)

## Correct Fret Mappings

### Diminished 7th Chords (dim7)

| Root | Correct Frets | Notes Produced |
|------|---------------|----------------|
| C, D#, F#, A | 1, 4, 7, 10 | C, D#, F#, A |
| C#, E, G, A# | 2, 5, 8, 11 | C#, E, G, A# |
| D, F, G#, B | 3, 6, 9, 12 | D, F, G#, B |

**Pattern:** `['x', 'x', 1, 2, 1, 2]` with `firstFret` set to the correct fret.

### Diminished Triads (dim)

Diminished triads need only 3 notes (root, minor 3rd, diminished 5th). The dim7 pattern has 4 notes, so we need different patterns:

**Option 1:** Use dim7 pattern but accept the extra note (common in practice)
**Option 2:** Use a 3-note pattern like `['x', 'x', 1, 2, 1, 'x']` (remove high E string)

## Recommended Fixes

### For Cdim7:
```typescript
'C_dim7': [
  { frets: ['x', 3, 1, 2, 1, 2], position: 'Open' }, // Keep open position
  { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },  // Changed from 2
  { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },  // Changed from 8
  { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },  // Changed from 11
],
```

### For Cdim (triad):
```typescript
'C_dim': [
  { frets: ['x', 3, 1, 2, 1, 'x'], position: 'Partial' }, // Keep partial (3 notes)
  { frets: ['x', 'x', 1, 2, 1, 'x'], firstFret: 1, position: 'Dim 1st' },  // 3-note pattern
  { frets: ['x', 'x', 1, 2, 1, 'x'], firstFret: 4, position: 'Dim 4th' },
  { frets: ['x', 'x', 1, 2, 1, 'x'], firstFret: 7, position: 'Dim 7th' },
],
```

## Complete Fret Mapping

### Group 1 (Frets 1, 4, 7, 10) - Produces: Cdim7, D#dim7, F#dim7, Adim7
- Cdim7, D#dim7, F#dim7, Adim7

### Group 2 (Frets 2, 5, 8, 11) - Produces: C#dim7, Edim7, Gdim7, A#dim7  
- C#dim7, Edim7, Gdim7, A#dim7

### Group 3 (Frets 3, 6, 9, 12) - Produces: Ddim7, Fdim7, G#dim7, Bdim7
- Ddim7, Fdim7, G#dim7, Bdim7

## Implementation Notes

1. All dim7 chords can use the same pattern `['x', 'x', 1, 2, 1, 2]`
2. The `firstFret` determines which dim7 chord is produced
3. Diminished triads should use a 3-note pattern or accept the extra note from dim7 pattern
4. The pattern repeats every 3 frets (due to symmetry)

## Next Steps

1. Update all dim7 voicings to use correct fret positions
2. Update dim triad voicings to use 3-note patterns
3. Re-run validation to verify fixes
4. Update min7b5 (half-diminished) voicings similarly

