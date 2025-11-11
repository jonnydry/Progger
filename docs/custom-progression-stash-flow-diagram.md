# Custom Progression Stash Integration - Flow Diagrams

## Current Flow (With Issues)

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTIONS                                                       │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    [Standard Mode]
          │
    Sets Key: G Major  ◄───── App state: key="G", mode="Major"
    Sets Mode: Major
          │
          ▼
    [Switches to Custom Mode]
          │
          ▼
    [Selects Chords]
     C - F - Am - G      ◄───── customProgression = [{C,major}, {F,major}, ...]
          │
          ▼
    [Clicks "Analyze"]
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  API CALL: analyzeCustomProgression(["C", "F", "Am", "G"])         │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    xAI Grok Analysis
          │
    ┌─────┴─────┐
    │ AI thinks:│
    │ Key: C    │  ◄──── This is computed but NOT returned!
    │ Mode: Maj │
    └───────────┘
          │
          ▼
    Returns: ProgressionResult {
      progression: [...voicings...],
      scales: [...scales...]
    }
          │
          ▼
    Sets progressionResult ✅
    Does NOT update key/mode ❌  ◄───── Still key="G", mode="Major"
          │
          ▼
    [Results Display]
     Correctly shows analyzed progression
          │
          ▼
    [User Opens Stash Sidebar]
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STASH SIDEBAR                                                      │
│                                                                     │
│  currentKey={key}           ◄───── Uses "G" (WRONG!)              │
│  currentMode={mode}         ◄───── Uses "Major" (WRONG!)          │
│  currentProgression={...}   ◄───── Correct progression data       │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    [User Clicks "Save Current"]
          │
          ▼
    Saves to Database:
    {
      name: "My Cool Progression",
      key: "G",           ◄───── ❌ WRONG! Should be "C"
      mode: "Major",      ◄───── ❌ WRONG! (but happens to be correct)
      progressionData: {...}  ◄───── ✅ Correct
    }
          │
          ▼
    [Later: User Loads from Stash]
          │
          ▼
    Shows: "G Major - 4 chords"  ◄───── Misleading metadata!
```

---

## Proposed Flow - Phase 1 (Client-Side Detection)

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTIONS                                                       │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    [Custom Mode Active]
          │
          ▼
    [Selects Chords]
     C - F - Am - G
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  NEW: Auto-Detection on Chord Change                               │
│                                                                     │
│  useEffect(() => {                                                  │
│    const detected = detectKey(customProgression);                   │
│    setCustomKey(detected.key);      // "C"                         │
│    setCustomMode(detected.mode);    // "Major"                     │
│  }, [customProgression]);                                           │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    App state updated:
      customKey = "C" ✅
      customMode = "Major" ✅
          │
          ▼
    [UI Shows Detected Key]
     "Detected: C Major"  ◄───── NEW: Visual feedback
          │
          ▼
    [Clicks "Analyze"]
          │
          ▼
    API Call → Returns ProgressionResult
          │
          ▼
    Sets progressionResult ✅
          │
          ▼
    [User Opens Stash Sidebar]
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STASH SIDEBAR (Updated Logic)                                     │
│                                                                     │
│  currentKey={isCustomMode ? customKey : key}    ◄───── Uses "C" ✅│
│  currentMode={isCustomMode ? customMode : mode} ◄───── Uses "Maj"✅│
│  currentProgression={...}                       ◄───── Correct ✅  │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    [User Clicks "Save Current"]
          │
          ▼
    Saves to Database:
    {
      name: "My Cool Progression",
      key: "C",           ◄───── ✅ CORRECT!
      mode: "Major",      ◄───── ✅ CORRECT!
      progressionData: {...}  ◄───── ✅ CORRECT!
    }
          │
          ▼
    [Later: User Loads from Stash]
          │
          ▼
    Shows: "C Major - 4 chords"  ◄───── ✅ Accurate metadata!
```

---

## Proposed Flow - Phase 3 (Server-Side Detection)

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTIONS                                                       │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    [Custom Mode]
          │
          ▼
    [Selects & Analyzes Chords]
     C - F - Am - G
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  API CALL: analyzeCustomProgression(["C", "F", "Am", "G"])         │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    xAI Grok Analysis
          │
    ┌─────────────────┐
    │ AI Analysis:    │
    │ Key: C Major    │  ◄──── NOW EXPOSED IN RESPONSE!
    │ Mode: Major     │
    │ Confidence: 95% │
    └─────────────────┘
          │
          ▼
    Returns: ProgressionResult {
      progression: [...],
      scales: [...],
      detectedKey: "C",        ◄───── NEW FIELD
      detectedMode: "Major",   ◄───── NEW FIELD
      confidence: 0.95         ◄───── NEW FIELD (optional)
    }
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  CLIENT: handleAnalyzeCustom()                                      │
│                                                                     │
│  const result = await analyzeCustomProgression(...);                │
│  setProgressionResult(result);                                      │
│                                                                     │
│  // NEW: Auto-update key/mode from AI detection                    │
│  if (result.detectedKey) {                                          │
│    setKey(result.detectedKey);       // "C"                        │
│    setMode(result.detectedMode);     // "Major"                    │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
    App state:
      key = "C" ✅
      mode = "Major" ✅
          │
          ▼
    [Stash Save Uses Correct Metadata]
      ✅ Most accurate detection (AI + music theory)
      ✅ Seamless UX (no manual input needed)
      ✅ Confidence scoring for validation
```

---

## Component Interaction Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│  App.tsx (State Management)                                       │
│                                                                    │
│  Standard Mode State:                                             │
│  ├─ key: "G"                  ◄── From standard controls          │
│  ├─ mode: "Major"             ◄── From standard controls          │
│  └─ progressionResult: {...}  ◄── From AI generation API          │
│                                                                    │
│  Custom Mode State (NEW):                                         │
│  ├─ customKey: "C"            ◄── From detectKey() or AI         │
│  ├─ customMode: "Major"       ◄── From detectKey() or AI         │
│  ├─ customProgression: [...]  ◄── From chord input cards          │
│  └─ progressionResult: {...}  ◄── From custom analysis API        │
└────────────────────────────────────────────────────────────────────┘
              │                               │
              │ Props                         │ Props
              ▼                               ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│  Controls.tsx           │   │  StashSidebar.tsx            │
│                         │   │                              │
│  [Standard Mode]        │   │  Props (Updated):            │
│  • Key selector         │   │  currentKey={               │
│  • Mode selector        │   │    isCustomMode ?           │
│  • Progression type     │   │      customKey : key        │
│                         │   │  }                          │
│  [Custom Mode]          │   │  currentMode={              │
│  • Chord input cards    │   │    isCustomMode ?           │
│  • Category tabs        │   │      customMode : mode      │
│  • Live preview         │   │  }                          │
│                         │   │  currentProgression={...}    │
│  NEW (Optional):        │   │                              │
│  • Detected key display │   │  [Save Current Button]       │
│    "Detected: C Major"  │   │    │                         │
│  • Manual override      │   │    └─► Saves with correct   │
│    (future)             │   │         key/mode metadata    │
└─────────────────────────┘   └──────────────────────────────┘
              │
              │ Chord changes
              ▼
┌──────────────────────────────────────────────┐
│  smartChordSuggestions.ts                    │
│                                              │
│  detectKey(chords):                          │
│  1. Analyze chord roots & qualities          │
│  2. Score against major/minor scale patterns │
│  3. Return best-fit key & mode               │
│                                              │
│  Example:                                    │
│  Input:  [C major, F major, Am, G major]    │
│  Output: { key: "C", mode: "Major" }        │
└──────────────────────────────────────────────┘
```

---

## Data Flow Comparison

### AI-Generated Progression (Works Correctly)

```
User Input → Standard Controls → handleGenerate()
                                        │
                                        ▼
                           API: generateChordProgression(
                                 key="G",        ◄── Explicit from UI
                                 mode="Major",   ◄── Explicit from UI
                                 ...
                               )
                                        │
                                        ▼
                              ProgressionResult
                                        │
                                        ▼
                         StashSidebar (receives):
                           key="G"        ✅ Matches generation params
                           mode="Major"   ✅ Matches generation params
```

### Custom Progression (Current - Broken)

```
User Input → Custom Chord Selection → handleAnalyzeCustom()
                                              │
                                              ▼
                                 API: analyzeCustomProgression(
                                        chords=["C", "F", "Am", "G"]
                                        ╳ No key parameter
                                        ╳ No mode parameter
                                      )
                                              │
                                              ▼
                                    ProgressionResult
                                              │
                                              ▼
                               StashSidebar (receives):
                                 key="G"       ❌ Stale from standard mode
                                 mode="Major"  ❌ Stale from standard mode
```

### Custom Progression (Phase 1 - Fixed)

```
User Input → Custom Chord Selection → Auto-Detection
                                              │
                                              ▼
                                    detectKey(chords)
                                              │
                                              ▼
                                  customKey="C", customMode="Major"
                                              │
                                              ▼
                               handleAnalyzeCustom() + State Update
                                              │
                                              ▼
                               StashSidebar (receives):
                                 key="C"       ✅ Detected correctly
                                 mode="Major"  ✅ Detected correctly
```

---

## Implementation Checklist

### Phase 1: Client-Side Detection

- [ ] Add `customKey` and `customMode` state variables to App.tsx
- [ ] Add `useEffect` hook to auto-detect key on chord changes
- [ ] Update StashSidebar props to use custom key/mode when in custom mode
- [ ] Display detected key in CustomProgressionInput UI (optional)
- [ ] Test save/load cycle for custom progressions
- [ ] Verify no regression for AI-generated progressions

### Phase 2: UX Enhancements (Optional)

- [ ] Add manual key/mode override controls to custom mode
- [ ] Add "source" indicator in StashSidebar ("AI" vs "Custom" badge)
- [ ] Add `source` column to stash database schema
- [ ] Implement filter/sort by source in stash list
- [ ] Add confidence indicator for key detection

### Phase 3: Server-Side Detection (Future)

- [ ] Update `ProgressionResultFromAPI` type with `detectedKey`, `detectedMode`
- [ ] Modify AI prompt to explicitly return key detection in structured format
- [ ] Parse key/mode from AI response in `analyzeCustomProgression()`
- [ ] Update client to use server-detected key/mode
- [ ] Add validation comparing client vs server detection
- [ ] Implement enharmonic normalization (Db → C#)
- [ ] Add confidence scoring

---

**Document Version:** 1.0
**Last Updated:** 2025-11-11
**Visual diagrams for implementation planning**
