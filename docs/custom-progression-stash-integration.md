# Custom Progression Stash Integration - Investigation & Design

## Executive Summary

Investigation into integrating custom chord progressions with the stash feature. The good news: **Custom progressions can already be saved!** However, there are UX issues and metadata accuracy concerns that need addressing.

---

## Current State Analysis

### Stash Feature Architecture

**Data Model** (`shared/schema.ts:30-40`):
```typescript
stash = {
  id: varchar (UUID)
  userId: varchar (FK to users)
  name: varchar (user-defined name)
  key: varchar (e.g., "C", "G", "F#")
  mode: varchar (e.g., "Major", "Minor", "Dorian")
  progressionData: jsonb (ProgressionResult)
  createdAt: timestamp
}
```

**ProgressionResult Type** (`client/types.ts:90-93`):
```typescript
interface ProgressionResult {
  progression: ChordInProgression[];  // Chords with voicings and analysis
  scales: ScaleInfo[];                 // Suggested scales for improv
}
```

**Save Flow** (`client/hooks/useStash.ts:26-56`):
1. User clicks "Save Current" in StashSidebar
2. Enters a name for the progression
3. POST /api/stash with: `{ name, key, mode, progressionData }`
4. Server validates and stores in PostgreSQL
5. Stash list refreshes automatically

---

## Custom Progression Flow

### Analysis Pipeline

**1. User Input** (`client/components/ChordInputCard.tsx`):
- User selects root notes (C, D, E, etc.) from wheel pickers
- User selects chord qualities (major, minor, 7, etc.) from categorized tabs
- Live fretboard preview shows voicing in real-time

**2. Analyze Trigger** (`client/App.tsx:152-185`):
```typescript
handleAnalyzeCustom():
  1. Formats chords from { root, quality } to "Cmaj7" string format
  2. Validates chord qualities are supported
  3. Calls analyzeCustomProgression API
  4. Sets progressionResult state (same as AI-generated)
  5. Does NOT update key/mode state ❌
```

**3. API Processing** (`server/xaiService.ts:182-250`):
- Receives array of chord names: `["Cmaj7", "Am7", "Dm7", "G7"]`
- Sends to xAI Grok with prompt requesting key detection
- AI analyzes: key, mode, Roman numerals, voicings, scales
- Returns ProgressionResult (same format as AI-generated)
- **Key/mode detection result is NOT exposed in API response** ❌

---

## The Problem

### Issue #1: Key/Mode Metadata Mismatch

**Scenario:**
1. User sets controls to "Key: G Major"
2. User switches to Custom mode
3. User inputs progression: `C - F - Am - G`
4. User clicks "Analyze Progression"
5. Results display correctly
6. User clicks "Save Current"
7. **Stash saves with Key: G, Mode: Major** ❌ (should be C Major)

**Root Cause:**
- `App.tsx` state variables `key` and `mode` are not updated when analyzing custom progressions
- StashSidebar receives `currentKey={key}` and `currentMode={mode}` from App state
- These values reflect the last standard mode settings, not the analyzed progression

### Issue #2: AI Key Detection Not Utilized

**Observation:**
- AI prompt explicitly requests: *"Determine the most likely key and mode"*
- AI provides this analysis internally
- API response only includes `progression` and `scales` arrays
- **Key/mode detection is computed but discarded** ❌

**Opportunity:**
- Could expose detected key/mode in API response
- Would enable automatic metadata for custom progressions

### Issue #3: UX Confusion

**Current Behavior:**
- "Save Current" button appears in StashSidebar
- No indication whether custom vs AI-generated progression
- User might not realize key/mode metadata is incorrect
- No way to manually specify key/mode when saving

---

## Solution Design

### Option A: Automatic Key Detection (Recommended)

**Approach:** Expose AI-detected key/mode in API response and auto-update state.

**Implementation:**

**1. Update API Response Type:**
```typescript
// server/xaiService.ts
interface ProgressionResultFromAPI {
  progression: SimpleChord[];
  scales: SimpleScale[];
  detectedKey?: string;      // NEW: AI-detected key
  detectedMode?: string;     // NEW: AI-detected mode
}
```

**2. Modify AI Response Parsing:**
```typescript
// server/xaiService.ts - analyzeCustomProgression()
// Parse AI response and extract detected key/mode from analysis
const result = {
  progression: [...],
  scales: [...],
  detectedKey: extractedKey || chords[0].root,  // Fallback to first chord root
  detectedMode: extractedMode || 'Major',        // Fallback to Major
};
```

**3. Update App State on Custom Analysis:**
```typescript
// client/App.tsx - handleAnalyzeCustom()
const result = await analyzeCustomProgression(formattedChords);
setProgressionResult(result);

// NEW: Update key/mode if detected
if (result.detectedKey) setKey(result.detectedKey);
if (result.detectedMode) setMode(result.detectedMode);
```

**Benefits:**
✅ Automatic - no user action required
✅ Accurate - uses AI analysis
✅ Seamless - works with existing stash flow
✅ Consistent - same save UX for both modes

**Drawbacks:**
❌ Requires backend changes to expose detection
❌ AI might incorrectly detect key (modal interchange, chromatic progressions)

---

### Option B: Manual Key/Mode Input

**Approach:** Add key/mode selectors to custom mode UI.

**Implementation:**

**1. Add Key/Mode Controls to Custom Mode:**
```typescript
// client/components/CustomProgressionInput.tsx
<div className="grid grid-cols-2 gap-4">
  <CustomSelect
    label="Detected Key"
    value={detectedKey}
    onChange={onKeyChange}
    options={KEYS}
  />
  <ModeSelect
    label="Detected Mode"
    value={detectedMode}
    onChange={onModeChange}
  />
</div>
```

**2. Smart Default Detection:**
- Use client-side `detectKey()` from smart chord suggestions
- Auto-populate selectors based on chord analysis
- Allow user to override if incorrect

**3. Update App State:**
```typescript
// client/App.tsx
const [customKey, setCustomKey] = useState('C');
const [customMode, setCustomMode] = useState('Major');

// When analyzing custom progression:
setKey(customKey);
setMode(customMode);
```

**Benefits:**
✅ No backend changes required
✅ User control over metadata
✅ Reuses existing key detection logic
✅ Educational - shows detected key

**Drawbacks:**
❌ Additional UI complexity
❌ Extra step for users
❌ Takes up screen space

---

### Option C: Save Dialog with Metadata Confirmation

**Approach:** Show confirmation dialog when saving custom progressions.

**Implementation:**

**1. Enhanced Save Dialog:**
```typescript
// client/components/StashSidebar.tsx
{showSaveForm && isCustomProgression && (
  <div className="space-y-3">
    <input type="text" placeholder="Name..." />

    {/* NEW: Key/Mode confirmation */}
    <div className="bg-surface/30 p-3 rounded border border-border/30">
      <div className="text-xs text-text/60 mb-2">Detected Metadata:</div>
      <div className="grid grid-cols-2 gap-2">
        <CustomSelect value={saveKey} onChange={setSaveKey} options={KEYS} />
        <ModeSelect value={saveMode} onChange={setSaveMode} />
      </div>
    </div>

    <button onClick={handleSave}>Save</button>
  </div>
)}
```

**2. Detection on Save:**
- When user clicks "Save Current"
- Run client-side `detectKey(customProgression)`
- Pre-populate selectors with detected values
- Allow editing before save

**Benefits:**
✅ Minimal changes - only touches save flow
✅ User confirmation prevents errors
✅ Works with existing architecture

**Drawbacks:**
❌ Extra friction in save flow
❌ Interrupts UX with additional step

---

## Recommended Implementation Plan

### Phase 1: Quick Win (Option B - Client-Side Detection)

**Immediate improvements without backend changes:**

**1. Add Key/Mode State for Custom Progressions:**
```typescript
// client/App.tsx
const [customKey, setCustomKey] = useState('C');
const [customMode, setCustomMode] = useState('Major');
```

**2. Auto-Detect on Chord Changes:**
```typescript
useEffect(() => {
  if (isCustomMode && customProgression.length > 0) {
    const detected = detectKey(customProgression);
    if (detected) {
      setCustomKey(detected.key);
      setCustomMode(detected.mode);
    }
  }
}, [customProgression, isCustomMode]);
```

**3. Update Stash Save to Use Custom Key/Mode:**
```typescript
// client/App.tsx - StashSidebar props
<StashSidebar
  currentKey={isCustomMode ? customKey : key}
  currentMode={isCustomMode ? customMode : mode}
  // ... other props
/>
```

**4. Display Detected Key in Custom Mode UI:**
```typescript
// client/components/CustomProgressionInput.tsx
<div className="text-sm text-text/60 text-center py-2">
  Detected: <span className="text-primary font-semibold">{detectedKey} {detectedMode}</span>
</div>
```

**Effort:** ~2-3 hours
**Impact:** Fixes metadata accuracy immediately
**Risk:** Low - uses existing `detectKey()` function

---

### Phase 2: Enhanced UX (Optional)

**1. Manual Key/Mode Override:**
- Add optional key/mode selectors to custom mode
- Defaults to auto-detected values
- User can override if detection is wrong

**2. Visual Indicator in Stash Sidebar:**
```typescript
{item.source === 'custom' && (
  <span className="text-xs bg-accent/20 px-2 py-0.5 rounded">
    Custom
  </span>
)}
```

**3. Stash Metadata Enhancement:**
- Add `source: 'ai' | 'custom'` field to stash schema
- Track creation method for analytics
- Filter/sort by source in sidebar

**Effort:** ~4-6 hours
**Impact:** Better UX, clearer organization
**Risk:** Low - additive changes

---

### Phase 3: Server-Side Detection (Future Enhancement)

**Long-term improvement for accuracy:**

**1. Expose AI Key Detection:**
- Update `ProgressionResultFromAPI` type
- Parse key/mode from AI response
- Return in API response

**2. Validation & Fallback:**
- Compare AI detection vs client-side detection
- Use confidence scoring
- Fallback to client detection if AI uncertain

**3. Enharmonic Handling:**
- AI might return "Db Major" vs "C# Major"
- Normalize to standard key signatures
- Use `displayNote()` from musicTheory utils

**Effort:** ~6-8 hours (requires AI prompt engineering)
**Impact:** Most accurate detection
**Risk:** Medium - depends on AI consistency

---

## Testing Strategy

### Test Cases

**1. Basic Custom Progression:**
```
Input: C - F - G - C
Expected Key: C Major
Expected Save: ✅ Correct metadata
```

**2. Minor Progression:**
```
Input: Am - Dm - E7 - Am
Expected Key: A Minor
Expected Save: ✅ Correct metadata
```

**3. Modal Progression:**
```
Input: D - Em - A - D (Dorian feel)
Expected Key: D Dorian or D Major
Expected Save: ✅ Reasonable metadata
```

**4. Chromatic/Jazz Progression:**
```
Input: Cmaj7 - Abmaj7 - Dbmaj7 - Gbmaj7
Expected Key: Ambiguous (chromatic)
Expected Save: ✅ Fallback to C Major
```

**5. Save & Load:**
```
1. Analyze custom progression
2. Save with detected metadata
3. Load from stash
4. Verify progression displays correctly
Expected: ✅ Identical to original analysis
```

---

## Database Considerations

### Current Schema is Compatible

```sql
-- No schema changes required!
CREATE TABLE stash (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  key VARCHAR NOT NULL,          -- Works for both AI & custom
  mode VARCHAR NOT NULL,          -- Works for both AI & custom
  progression_data JSONB NOT NULL, -- ProgressionResult format
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Optional Schema Enhancement (Phase 2)

```sql
ALTER TABLE stash ADD COLUMN source VARCHAR DEFAULT 'ai';
-- Values: 'ai' | 'custom'
-- Allows filtering and analytics

ALTER TABLE stash ADD COLUMN detected_key_confidence DECIMAL;
-- Optional: track detection confidence for future improvements
```

---

## Migration Strategy

### Backward Compatibility

✅ **No breaking changes** - all options work with existing code
✅ **Existing stash items unaffected** - only new saves use improved metadata
✅ **Progressive enhancement** - each phase adds features without disrupting existing

### Deployment Steps

1. **Deploy Phase 1 (client-side detection)**
   - Update App.tsx state management
   - Add auto-detection useEffect
   - Update StashSidebar props
   - Test save/load cycle

2. **Monitor & Validate**
   - Check stash items for correct key/mode
   - Gather user feedback
   - Measure detection accuracy

3. **Deploy Phase 2/3** (if needed)
   - Add UI enhancements
   - Implement server-side detection
   - A/B test detection methods

---

## Conclusion

### Current Status
✅ **Custom progressions CAN be saved** - functionality exists
❌ **Metadata accuracy issue** - key/mode not updated for custom progressions
❌ **AI detection unutilized** - computed but not exposed

### Recommended Action
**Implement Phase 1** (client-side detection) immediately:
- Low effort (~2-3 hours)
- High impact (fixes metadata accuracy)
- No backend changes required
- Leverages existing `detectKey()` function

### Success Metrics
- [ ] Custom progressions save with accurate key/mode
- [ ] Loaded progressions display correctly
- [ ] User can distinguish AI vs custom in stash
- [ ] No regressions in AI-generated progression saves

---

**Document Version:** 1.0
**Last Updated:** 2025-11-11
**Status:** Investigation Complete, Ready for Implementation
