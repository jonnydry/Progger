

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  surface: string;
  border: string;
}

export interface ThemeOption {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const THEMES: ThemeOption[] = [
  {
    name: 'Rosewood & Ivory',
    light: {
      primary: '15 55% 42%',      // Muted Rosewood (Darker for contrast)
      secondary: '30 20% 40%',   // Taupe (Darker for contrast)
      accent: '25 60% 52%',      // Rust Accent (Adjusted for new primary)
      text: '30 10% 25%',         // Dark Brown
      background: '40 30% 97%',   // Ivory White
      surface: '40 25% 94%',      // Off-White
      border: '30 10% 25% / 0.1',
    },
    dark: {
      primary: '15 45% 55%',      // Brighter Muted Rosewood
      secondary: '30 15% 45%',   // Dark Taupe
      accent: '25 55% 65%',      // Brighter Rust Accent
      text: '35 25% 88%',         // Ivory
      background: '20 10% 15%',   // Darkest Brown
      surface: '20 10% 20%',      // Dark Brown
      border: '35 25% 88% / 0.15',
    },
  },
  {
    name: 'Oceanic Slate',
    light: {
      primary: '210 30% 40%',   // Desaturated Slate Blue (Darker for contrast)
      secondary: '180 25% 42%', // Muted Teal (Darker for contrast)
      accent: '190 40% 50%',      // Soft Cyan (Adjusted for new primary)
      text: '215 25% 25%',         // Dark Slate Blue
      background: '210 20% 98%',   // Whitish Blue
      surface: '210 20% 94%',      // Light Slate Gray
      border: '215 25% 25% / 0.1',
    },
    dark: {
      primary: '210 35% 60%',   // Brighter Slate Blue
      secondary: '180 30% 55%', // Brighter Muted Teal
      accent: '190 45% 70%',      // Brighter Soft Cyan
      text: '210 20% 85%',         // Light Slate Gray
      background: '220 25% 12%',   // Deep Navy-Slate
      surface: '220 25% 18%',      // Darker Slate
      border: '210 20% 85% / 0.15',
    },
  },
  {
    name: 'Forest Whisper',
    light: {
      primary: '80 20% 40%',    // Muted Sage Green (Darker for contrast)
      secondary: '30 25% 42%',  // Warm Brown (Darker for contrast)
      accent: '90 30% 50%',     // Soft Lime (Adjusted for new primary)
      text: '80 10% 20%',       // Dark Forest Green
      background: '80 15% 97%', // Off-white with green tint
      surface: '80 15% 94%',    // Slightly darker off-white
      border: '80 10% 20% / 0.1',
    },
    dark: {
      primary: '80 25% 55%',    // Brighter Sage Green
      secondary: '30 20% 35%',  // Darker Warm Brown
      accent: '90 35% 65%',     // Brighter Soft Lime
      text: '80 10% 88%',       // Light off-white
      background: '80 10% 15%', // Very dark green/brown
      surface: '80 10% 20%',    // Darker surface
      border: '80 10% 88% / 0.15',
    }
  },
  {
    name: 'Midnight Indigo',
    light: {
      primary: '250 25% 42%',    // Desaturated Indigo (Darker for contrast)
      secondary: '220 15% 40%', // Muted Slate Gray (Darker for contrast)
      accent: '250 35% 52%',     // Soft Lavender (Adjusted for new primary)
      text: '250 20% 25%',       // Dark Indigo
      background: '250 20% 98%', // Very light lavender/gray
      surface: '250 20% 95%',    // Light lavender/gray
      border: '250 20% 25% / 0.1',
    },
    dark: {
      primary: '250 30% 65%',    // Brighter Indigo
      secondary: '220 20% 40%', // Dark Slate Gray
      accent: '250 40% 75%',     // Brighter Lavender
      text: '250 15% 85%',       // Light gray/lavender
      background: '250 20% 12%', // Very dark indigo/navy
      surface: '250 20% 18%',    // Darker indigo/navy
      border: '250 15% 85% / 0.15',
    }
  },
  {
    name: 'Golden Hour',
    light: {
      primary: '35 60% 40%',    // Golden Yellow (Darker for contrast)
      secondary: '25 40% 40%',  // Soft Orange (Darker for contrast)
      accent: '40 70% 50%',     // Brighter Gold (Adjusted for new primary)
      text: '25 20% 20%',       // Dark Brown
      background: '45 40% 96%', // Very Light Cream
      surface: '45 35% 92%',    // Light Cream
      border: '25 20% 20% / 0.1',
    },
    dark: {
      primary: '35 55% 60%',    // Brighter Golden Yellow
      secondary: '25 30% 50%',  // Muted Orange/Brown
      accent: '40 65% 65%',     // Brighter Gold
      text: '45 30% 88%',       // Pale Yellow/White
      background: '30 15% 14%', // Very Dark Brown
      surface: '30 15% 19%',    // Dark Brown
      border: '45 30% 88% / 0.15',
    }
  },
  {
    name: 'Crimson Noir',
    light: {
      primary: '0 50% 45%',     // Muted Crimson (Darker for contrast)
      secondary: '0 10% 40%',   // Cool Gray (Darker for contrast)
      accent: '0 60% 55%',      // Brighter Crimson (Adjusted for new primary)
      text: '0 5% 20%',         // Charcoal
      background: '0 0% 97%',   // Almost White
      surface: '0 0% 94%',      // Light Gray
      border: '0 5% 20% / 0.1',
    },
    dark: {
      primary: '0 55% 60%',     // Brighter Crimson
      secondary: '0 5% 40%',    // Medium Charcoal
      accent: '0 65% 65%',      // Vibrant Crimson
      text: '0 0% 88%',         // Light Gray
      background: '0 0% 12%',   // Near Black
      surface: '0 0% 18%',      // Dark Charcoal
      border: '0 0% 88% / 0.15',
    }
  },
  {
    name: 'Mojave Dusk',
    light: {
      primary: '340 30% 42%',   // Dusty Rose (Darker for contrast)
      secondary: '20 35% 40%',  // Terracotta (Darker for contrast)
      accent: '345 40% 52%',    // Brighter Rose (Adjusted for new primary)
      text: '25 15% 25%',       // Dark Dusty Brown
      background: '30 25% 97%', // Sandy White
      surface: '30 20% 94%',    // Light Sand
      border: '25 15% 25% / 0.1',
    },
    dark: {
      primary: '340 35% 65%',   // Brighter Dusty Rose
      secondary: '20 25% 45%',  // Dark Terracotta
      accent: '345 45% 70%',    // Vibrant Rose
      text: '30 20% 88%',       // Pale Sand
      background: '280 10% 15%',// Deep Dusty Purple/Brown
      surface: '280 10% 20%',   // Darker Dusty Purple/Brown
      border: '30 20% 88% / 0.15',
    }
  }
];


export const KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const MODES = ['Major', 'Minor'];

export const CHORD_COUNTS = [3, 4, 5, 6];

export const COMMON_PROGRESSIONS = [
  { name: 'AI Generated', value: 'auto' },
  // --- Major Key / Pop / Rock ---
  { name: 'I-IV-V (Blues/Rock)', value: 'I-IV-V' },
  { name: 'I-V-vi-IV (Pop)', value: 'I-V-vi-IV' },
  { name: 'I-vi-IV-V (50s)', value: 'I-vi-IV-V' },
  { name: 'vi-IV-I-V (Sensitive)', value: 'vi-IV-I-V' },
  { name: 'I-V-vi-iii (Canon)', value: 'I-V-vi-iii' },
  { name: 'IV-V-iii-vi (Royal Road)', value: 'IV-V-iii-vi' },
  { name: 'I-bVII-IV-I (Mixolydian)', value: 'I-bVII-IV-I' },

  // --- Minor Key ---
  { name: 'i-iv-v (Minor Blues)', value: 'i-iv-v' },
  { name: 'i-VI-III-VII (Andalusian)', value: 'i-VI-III-VII' },
  { name: 'i-VII-VI-V (Minor Descent)', value: 'i-VII-VI-V' },

  // --- Jazz ---
  { name: 'ii-V-I (Jazz)', value: 'ii-V-I' },
  { name: 'I-vi-ii-V (Rhythm)', value: 'I-vi-ii-V' },
  { name: 'ii°-V-i (Minor Jazz)', value: 'ii°-V-i' },

  // --- Chromatic / Other ---
  { name: 'I-III-IV-iv (Chromatic Pop)', value: 'I-III-IV-iv' },
];
