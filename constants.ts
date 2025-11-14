import { KeyData, ChordCategory } from './types';

export const POSITIONAL_DATA: KeyData[] = [
  { major: 'C', minor: 'Am', dim: 'B°', keySignature: '0' },
  { major: 'G', minor: 'Em', dim: 'F#°', keySignature: '1#' },
  { major: 'D', minor: 'Bm', dim: 'C#°', keySignature: '2#' },
  { major: 'A', minor: 'F#m', dim: 'G#°', keySignature: '3#' },
  { major: 'E', minor: 'C#m', dim: 'D#°', keySignature: '4#' },
  { major: 'B', minor: 'G#m', dim: 'A#°', keySignature: '5#' },
  { major: 'F#', minor: 'D#m', dim: 'E#°', keySignature: '6#' },
  { major: 'Db', minor: 'Bbm', dim: 'C°', keySignature: '5b' },
  { major: 'Ab', minor: 'Fm', dim: 'G°', keySignature: '4b' },
  { major: 'Eb', minor: 'Cm', dim: 'D°', keySignature: '3b' },
  { major: 'Bb', minor: 'Gm', dim: 'A°', keySignature: '2b' },
  { major: 'F', minor: 'Dm', dim: 'E°', keySignature: '1b' },
];

// Data for the static outer ring of modes, including their exact angular position.
export const MODES_DATA = [
    { name: 'Ionian', angle: 0 },
    { name: 'Lydian', angle: 30 },
    { name: 'Mixolydian', angle: -30 },
    { name: 'Dorian', angle: -60 },
    { name: 'Aeolian', angle: -90 },
    { name: 'Phrygian', angle: -120 },
    { name: 'Locrian', angle: -150 },
];

// Colors based on the provided image, matched to the key at that position on the circle.
export const NOTE_COLORS: Record<string, string> = {
  C: '#d93a2b',    // Red
  G: '#e88024',    // Orange
  D: '#f9d518',    // Yellow
  A: '#96c83c',    // Lime Green
  E: '#009e57',    // Green
  B: '#009ca6',    // Cyan
  'F#': '#008e8b',  // Teal
  Db: '#0076c0',   // Blue
  Ab: '#3f479d',   // Indigo
  Eb: '#6d358a',   // Purple
  Bb: '#a52a81',   // Magenta
  F: '#d43555',    // Pinkish Red

  // Enharmonic equivalents mapped to their visual counterparts on the circle
  Gb: '#008e8b',   // Gb is same color as F#
  'C#': '#0076c0', // C# is same color as Db
  'G#': '#3f479d', // G# is same color as Ab
  'D#': '#6d358a', // D# is same color as Eb
  'A#': '#a52a81', // A# is same color as Bb
  'E#': '#d43555', // E# is same color as F
};


export const DIATONIC_CHORDS_FOR_KEY: Record<string, string[]> = {
    'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'],
    'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'],
    'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#°'],
    'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#°'],
    'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#°'],
    'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#°'],
    'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#°'],
    'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'C°'],
    'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'G°'],
    'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'D°'],
    'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'A°'],
    'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'E°'],
};

export const DIATONIC_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

export const CHORD_LIBRARY: ChordCategory[] = [
  {
    name: 'Triads & Powerchords',
    chords: [
      { symbol: '', name: 'Major Triad', degrees: ['1', '3', '5'] },
      { symbol: 'm', name: 'Minor Triad', degrees: ['1', '♭3', '5'] },
      { symbol: 'aug', name: 'Augmented Triad', degrees: ['1', '3', '♯5'] },
      { symbol: '°', name: 'Diminished Triad', degrees: ['1', '♭3', '♭5'] },
      { symbol: 'b5', name: 'Major Flat 5', degrees: ['1', '3', '♭5'] },
      { symbol: 'm#5', name: 'Minor Sharp 5', degrees: ['1', '♭3', '♯5'] },
      { symbol: '5', name: 'Power Chord (5th)', degrees: ['1', '5'] },
    ],
  },
  {
    name: 'Suspended Chords',
    chords: [
      { symbol: 'sus2', name: 'Suspended 2nd', degrees: ['1', '2', '5'] },
      { symbol: 'sus4', name: 'Suspended 4th', degrees: ['1', '4', '5'] },
      { symbol: 'sus2b5', name: 'Suspended 2nd Flat 5', degrees: ['1', '2', '♭5'] },
      { symbol: 'sus24', name: 'Suspended 2nd & 4th', degrees: ['1', '2', '4', '5'] },
    ],
  },
  {
    name: 'Sixth & Added Note Chords',
    chords: [
      { symbol: 'add9', name: 'Add 9', degrees: ['1', '3', '5', '9'] },
      { symbol: 'm(add9)', name: 'Minor Add 9', degrees: ['1', '♭3', '5', '9'] },
      { symbol: 'add#11', name: 'Add Sharp 11', degrees: ['1', '3', '5', '♯11'] },
      { symbol: '6', name: 'Major 6th', degrees: ['1', '3', '5', '6'] },
      { symbol: 'm6', name: 'Minor 6th', degrees: ['1', '♭3', '5', '6'] },
      { symbol: '6/9', name: 'Six Add Nine', degrees: ['1', '3', '5', '6', '9'] },
    ]
  },
  {
    name: 'Basic Seventh Chords',
    chords: [
      { symbol: 'maj7', name: 'Major 7th', degrees: ['1', '3', '5', '7'] },
      { symbol: '7', name: 'Dominant 7th', degrees: ['1', '3', '5', '♭7'] },
      { symbol: 'm7', name: 'Minor 7th', degrees: ['1', '♭3', '5', '♭7'] },
      { symbol: 'm7b5', name: 'Half-Diminished 7th', degrees: ['1', '♭3', '♭5', '♭7'] },
      { symbol: '°7', name: 'Diminished 7th', degrees: ['1', '♭3', '♭5', '♭♭7'] },
      { symbol: 'm(maj7)', name: 'Minor-Major 7th', degrees: ['1', '♭3', '5', '7'] },
      { symbol: '7(no3)', name: '7th (No 3rd)', degrees: ['1', '5', '♭7'] },
    ],
  },
  {
    name: 'Altered Major & Minor Sevenths',
    chords: [
      { symbol: 'maj7b5', name: 'Major 7th ♭5', degrees: ['1', '3', '♭5', '7'] },
      { symbol: 'maj7#5', name: 'Augmented Major 7th', degrees: ['1', '3', '♯5', '7'] },
      { symbol: 'm(maj7)b5', name: 'Minor-Major 7th ♭5', degrees: ['1', '♭3', '♭5', '7'] },
      { symbol: 'maj7b9', name: 'Major 7th ♭9', degrees: ['1', '3', '5', '7', '♭9'] },
      { symbol: 'maj7#9', name: 'Major 7th ♯9', degrees: ['1', '3', '5', '7', '♯9'] },
      { symbol: 'm7b9', name: 'Minor 7th ♭9', degrees: ['1', '♭3', '5', '♭7', '♭9'] },
      { symbol: 'm7#9', name: 'Minor 7th ♯9', degrees: ['1', '♭3', '5', '♭7', '♯9'] },
      { symbol: 'm(maj7)b9', name: 'Minor-Major 7th ♭9', degrees: ['1', '♭3', '5', '7', '♭9'] },
      { symbol: 'maj7#5(b9)', name: 'Augmented Major 7th ♭9', degrees: ['1', '3', '♯5', '7', '♭9'] },
      { symbol: 'maj7#5(#9)', name: 'Augmented Major 7th ♯9', degrees: ['1', '3', '♯5', '7', '♯9'] },
    ]
  },
  {
    name: 'Altered Dominant Sevenths',
    chords: [
      { symbol: '7b5', name: 'Dominant 7th ♭5', degrees: ['1', '3', '♭5', '♭7'] },
      { symbol: '7#5', name: 'Dominant 7th ♯5', degrees: ['1', '3', '♯5', '♭7'] },
      { symbol: '7b9', name: 'Dominant 7th ♭9', degrees: ['1', '3', '5', '♭7', '♭9'] },
      { symbol: '7#9', name: 'Dominant 7th ♯9', degrees: ['1', '3', '5', '♭7', '♯9'] },
      { symbol: '7b5b9', name: 'Dominant 7th ♭5 ♭9', degrees: ['1', '3', '♭5', '♭7', '♭9'] },
      { symbol: '7#5b9', name: 'Dominant 7th ♯5 ♭9', degrees: ['1', '3', '♯5', '♭7', '♭9'] },
      { symbol: '7#5#9', name: 'Dominant 7th ♯5 ♯9', degrees: ['1', '3', '♯5', '♭7', '♯9'] },
      { symbol: '7add6', name: 'Dominant 7th Add 6', degrees: ['1', '3', '5', '6', '♭7'] },
    ]
  },
  {
    name: 'Suspended Seventh Chords',
    chords: [
      { symbol: '7sus2', name: '7th Suspended 2nd', degrees: ['1', '2', '5', '♭7'] },
      { symbol: '7sus4', name: '7th Suspended 4th', degrees: ['1', '4', '5', '♭7'] },
      { symbol: 'maj7sus2', name: 'Major 7th Sus 2', degrees: ['1', '2', '5', '7'] },
      { symbol: 'maj7sus4', name: 'Major 7th Sus 4', degrees: ['1', '4', '5', '7'] },
      { symbol: '7sus24', name: '7th Sus 2nd & 4th', degrees: ['1', '2', '4', '5', '♭7'] },
      { symbol: 'maj7sus24', name: 'Major 7th Sus 2 & 4', degrees: ['1', '2', '4', '5', '7'] },
      { symbol: '7sus2add6', name: '7th Sus 2 Add 6', degrees: ['1', '2', '5', '6', '♭7'] },
      { symbol: '7sus4add6', name: '7th Sus 4 Add 6', degrees: ['1', '4', '5', '6', '♭7'] },
    ]
  },
  {
    name: 'Extended Ninth Chords',
    chords: [
      { symbol: 'maj9', name: 'Major 9th', degrees: ['1', '3', '5', '7', '9'] },
      { symbol: '9', name: 'Dominant 9th', degrees: ['1', '3', '5', '♭7', '9'] },
      { symbol: 'm9', name: 'Minor 9th', degrees: ['1', '♭3', '5', '♭7', '9'] },
      { symbol: 'm(maj9)', name: 'Minor-Major 9th', degrees: ['1', '♭3', '5', '7', '9'] },
      { symbol: 'maj9#5', name: 'Augmented Major 9th', degrees: ['1', '3', '♯5', '7', '9'] },
      { symbol: '9#5', name: 'Dominant 9th ♯5', degrees: ['1', '3', '♯5', '♭7', '9'] },
      { symbol: '9(b5)', name: 'Dominant 9th ♭5', degrees: ['1', '3', '♭5', '♭7', '9'] },
      { symbol: 'm9b5', name: 'Half-Diminished 9th', degrees: ['1', '♭3', '♭5', '♭7', '9'] },
      { symbol: 'm7b5(b9)', name: 'Half-Diminished ♭9', degrees: ['1', '♭3', '♭5', '♭7', '♭9'] },
      { symbol: '°9', name: 'Diminished 9th', degrees: ['1', '♭3', '♭5', '♭♭7', '9'] },
      { symbol: '°7(b9)', name: 'Diminished ♭9', degrees: ['1', '♭3', '♭5', '♭♭7', '♭9'] },
    ],
  },
  {
    name: 'Extended Eleventh Chords',
    chords: [
      { symbol: '11', name: 'Dominant 11th', degrees: ['1', '(3)', '5', '♭7', '9', '11'] },
      { symbol: 'm11', name: 'Minor 11th', degrees: ['1', '♭3', '5', '♭7', '9', '11'] },
      { symbol: 'maj11', name: 'Major 11th', degrees: ['1', '(3)', '5', '7', '9', '11'] },
      { symbol: 'm(maj11)', name: 'Minor-Major 11th', degrees: ['1', '♭3', '5', '7', '9', '11'] },
      { symbol: 'maj9#11', name: 'Major 9th ♯11', degrees: ['1', '3', '5', '7', '9', '♯11'] },
      { symbol: '7#11', name: 'Dominant 7th ♯11', degrees: ['1', '3', '5', '♭7', '♯11'] },
      { symbol: 'maj7#11', name: 'Major 7th ♯11', degrees: ['1', '3', '5', '7', '♯11'] },
      { symbol: 'm7#11', name: 'Minor 7th ♯11', degrees: ['1', '♭3', '5', '♭7', '♯11'] },
      { symbol: '7#9#11', name: 'Dominant 7th ♯9 ♯11', degrees: ['1', '3', '5', '♭7', '♯9', '♯11'] },
      { symbol: 'm11(b9)', name: 'Minor 11th ♭9', degrees: ['1', '♭3', '5', '♭7', '♭9', '11'] },
      { symbol: 'm11b5b9', name: 'Minor 11th ♭5 ♭9', degrees: ['1', '♭3', '♭5', '♭7', '♭9', '11'] },
    ],
  },
  {
    name: 'Extended Thirteenth Chords',
    chords: [
      { symbol: '13', name: 'Dominant 13th', degrees: ['1', '3', '5', '♭7', '9', '(11)', '13'] },
      { symbol: 'm13', name: 'Minor 13th', degrees: ['1', '♭3', '5', '♭7', '9', '11', '13'] },
      { symbol: 'maj13', name: 'Major 13th', degrees: ['1', '3', '5', '7', '9', '(11)', '13'] },
      { symbol: 'm(maj13)', name: 'Minor-Major 13th', degrees: ['1', '♭3', '5', '7', '9', '11', '13'] },
      { symbol: '13(b9)', name: 'Dominant 13th ♭9', degrees: ['1', '3', '5', '♭7', '♭9', '13'] },
      { symbol: '13(#11)', name: 'Dominant 13th ♯11', degrees: ['1', '3', '5', '♭7', '9', '♯11', '13'] },
      { symbol: '7b13', name: 'Dominant 7th ♭13', degrees: ['1', '3', '5', '♭7', '♭13'] },
      { symbol: '13(no9)', name: 'Dominant 13th (no 9)', degrees: ['1', '3', '5', '♭7', '13'] },
      { symbol: '7sus4(b13)', name: '7th Sus 4 ♭13', degrees: ['1', '4', '5', '♭7', '♭13'] },
    ],
  },
];
