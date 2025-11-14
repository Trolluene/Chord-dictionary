import { ChordType, ChordDefinition } from '../types';
import { CHORD_LIBRARY, POSITIONAL_DATA } from '../constants';

const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ALL_NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// --- NEW ROBUST PITCH CLASS SYSTEM ---
// This function converts any note name (including double accidentals) into a numerical pitch class (0-11).
// This is the core of the new, more accurate music theory engine.
export const noteToPitchClass = (note: string): number => {
    const noteName = note.charAt(0).toUpperCase();
    const accidentals = note.slice(1);

    const baseValues: Record<string, number> = {
        'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11,
    };

    let pitchClass = baseValues[noteName];
    if (pitchClass === undefined) return -1; // Invalid note

    for (const char of accidentals) {
        if (char === '#' || char === '♯') {
            pitchClass++;
        } else if (char === 'b' || char === '♭') {
            pitchClass--;
        }
    }
    
    // Ensure the result is always a positive integer between 0 and 11.
    return ((pitchClass % 12) + 12) % 12;
};


const getRootNote = (chordName: string): string => {
  if (chordName.length > 1 && (chordName[1] === '#' || chordName[1] === 'b')) {
    return chordName.substring(0, 2);
  }
  return chordName.substring(0, 1);
};

export const getChordNotes = (chordName: string): string[] => {
  let chordType: ChordType;
  if (chordName.endsWith('°')) {
    chordType = 'dim';
  } else if (chordName.endsWith('m')) {
    chordType = 'minor';
  } else {
    chordType = 'major';
  }

  const root = getRootNote(chordName);
  const rootIndex = noteToPitchClass(root);

  if (rootIndex === -1) {
    return [];
  }

  const intervals = {
    major: [0, 4, 7, 11], // R, M3, P5, M7
    minor: [0, 3, 7, 10], // R, m3, P5, m7
    dim: [0, 3, 6, 9],   // R, m3, d5, d7 (diminished 7th)
  };

  return intervals[chordType].map(interval => ALL_NOTES[(rootIndex + interval) % 12]);
};

// --- NEW UTILITIES FOR CHORD DICTIONARY & SEARCH ---

const CHORD_INTERVALS: Record<string, number[]> = {
  // Triads & Powerchords
  '': [0, 4, 7], 'm': [0, 3, 7], 'aug': [0, 4, 8], '°': [0, 3, 6],
  'b5': [0, 4, 6], 'm#5': [0, 3, 8], '5': [0, 7],
  // Suspended Chords
  'sus2': [0, 2, 7], 'sus4': [0, 5, 7], 'sus2b5': [0, 2, 6], 'sus24': [0, 2, 5, 7],
  // Sixth & Added Note Chords
  'add9': [0, 4, 7, 14], 'm(add9)': [0, 3, 7, 14], 'add#11': [0, 4, 7, 18],
  '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9], '6/9': [0, 4, 7, 9, 14],
  // Basic Seventh Chords
  'maj7': [0, 4, 7, 11], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'm7b5': [0, 3, 6, 10],
  '°7': [0, 3, 6, 9], 'm(maj7)': [0, 3, 7, 11], '7(no3)': [0, 7, 10],
  // Altered Major & Minor Sevenths
  'maj7b5': [0, 4, 6, 11], 'maj7#5': [0, 4, 8, 11], 'm(maj7)b5': [0, 3, 6, 11],
  'maj7b9': [0, 4, 7, 11, 13], 'maj7#9': [0, 4, 7, 11, 15], 'm7b9': [0, 3, 7, 10, 13],
  'm7#9': [0, 3, 7, 10, 15], 'm(maj7)b9': [0, 3, 7, 11, 13], 'maj7#5(b9)': [0, 4, 8, 11, 13], 'maj7#5(#9)': [0, 4, 8, 11, 15],
  // Altered Dominant Sevenths
  '7b5': [0, 4, 6, 10], '7#5': [0, 4, 8, 10], '7b9': [0, 4, 7, 10, 13], '7#9': [0, 4, 7, 10, 15],
  '7b5b9': [0, 4, 6, 10, 13], '7#5b9': [0, 4, 8, 10, 13], '7#5#9': [0, 4, 8, 10, 15], '7add6': [0, 4, 7, 9, 10],
  // Suspended Seventh Chords
  '7sus2': [0, 2, 7, 10], '7sus4': [0, 5, 7, 10], 'maj7sus2': [0, 2, 7, 11],
  'maj7sus4': [0, 5, 7, 11], '7sus24': [0, 2, 5, 7, 10], 'maj7sus24': [0, 2, 5, 7, 11],
  '7sus2add6': [0, 2, 7, 9, 10], '7sus4add6': [0, 5, 7, 9, 10],
  // Extended Ninth Chords
  'maj9': [0, 4, 7, 11, 14], '9': [0, 4, 7, 10, 14], 'm9': [0, 3, 7, 10, 14],
  'm(maj9)': [0, 3, 7, 11, 14], 'maj9#5': [0, 4, 8, 11, 14], '9#5': [0, 4, 8, 10, 14],
  '9(b5)': [0, 4, 6, 10, 14], 'm9b5': [0, 3, 6, 10, 14], 'm7b5(b9)': [0, 3, 6, 10, 13],
  '°9': [0, 3, 6, 9, 14], '°7(b9)': [0, 3, 6, 9, 13],
  // Extended Eleventh Chords
  '11': [0, 4, 7, 10, 14, 17], 'm11': [0, 3, 7, 10, 14, 17], 'maj11': [0, 4, 7, 11, 14, 17],
  'm(maj11)': [0, 3, 7, 11, 14, 17], 'maj9#11': [0, 4, 7, 11, 14, 18], '7#11': [0, 4, 7, 10, 18],
  'maj7#11': [0, 4, 7, 11, 18], 'm7#11': [0, 3, 7, 10, 18], '7#9#11': [0, 4, 7, 10, 15, 18],
  'm11(b9)': [0, 3, 7, 10, 13, 17], 'm11b5b9': [0, 3, 6, 10, 13, 17],
  // Extended Thirteenth Chords
  '13': [0, 4, 7, 10, 14, 21], 'm13': [0, 3, 7, 10, 14, 21], 'maj13': [0, 4, 7, 11, 14, 21],
  'm(maj13)': [0, 3, 7, 11, 14, 21], '13(b9)': [0, 4, 7, 10, 13, 21], '13(#11)': [0, 4, 7, 10, 14, 18, 21],
  '7b13': [0, 4, 7, 10, 20], '13(no9)': [0, 4, 7, 10, 17, 21], '7sus4(b13)': [0, 5, 7, 10, 20],
};

export const getNotesForChordDefinition = (rootNote: string, quality: string): string[] => {
  const rootIndex = noteToPitchClass(rootNote);
  if (rootIndex === -1) return [];
  
  const intervals = CHORD_INTERVALS[quality];
  if (!intervals) return [];

  // Prefer flats for display, but use sharps internally for consistency
  const noteNames = rootNote.includes('b') ? ALL_NOTES_FLAT : ALL_NOTES;

  return intervals.map(interval => noteNames[(rootIndex + interval) % 12]);
}

const getNoteSignature = (notes: string[]): string => {
    const pitchClasses = notes.map(noteToPitchClass).filter(pc => pc !== -1);
    const uniquePitchClasses = [...new Set(pitchClasses)];
    return uniquePitchClasses.sort((a, b) => a - b).join(',');
};

const getDiatonicPitchClasses = (key: string): Set<number> => {
    const rootPitchClass = noteToPitchClass(key);
    if (rootPitchClass === -1) return new Set();
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
    const pitchClasses = majorScaleIntervals.map(i => (rootPitchClass + i) % 12);
    return new Set(pitchClasses);
};

export const findChordAndKeyFromNotes = (noteInput: string): { root: string, definition: ChordDefinition, key?: string, keyIndex: number } | null => {
    const noteRegex = /[A-G][#b♯♭]*/g;
    const inputNotes = noteInput.match(noteRegex);

    if (!inputNotes || inputNotes.length === 0) {
        return null;
    }
    
    const inputSignature = getNoteSignature(inputNotes);

    // 1. Find the chord
    let foundChord: { root: string, definition: ChordDefinition, notes: string[] } | null = null;
    for (const root of ALL_NOTES) {
        for (const category of CHORD_LIBRARY) {
            for (const definition of category.chords) {
                const chordNotes = getNotesForChordDefinition(root, definition.symbol);
                if (getNoteSignature(chordNotes) === inputSignature) {
                    foundChord = { root, definition, notes: chordNotes };
                    break;
                }
            }
            if (foundChord) break;
        }
        if (foundChord) break;
    }

    if (!foundChord) return null;

    // 2. Try to find the first key (clockwise from C) that contains this chord
    for (let i = 0; i < POSITIONAL_DATA.length; i++) {
        const keyData = POSITIONAL_DATA[i];
        const diatonicPitchClasses = getDiatonicPitchClasses(keyData.major);
        
        const foundChordPitchClasses = foundChord.notes.map(noteToPitchClass);
        const chordIsInKey = foundChordPitchClasses.every(pc => diatonicPitchClasses.has(pc));
        
        if (chordIsInKey) {
            return {
                root: foundChord.root,
                definition: foundChord.definition,
                key: keyData.major,
                keyIndex: i,
            };
        }
    }
    
    // 3. If no key is found, fallback to returning the chord and its root's index on the circle.
    const rootPitchClass = noteToPitchClass(foundChord.root);
    const rootNoteIndexOnCircle = POSITIONAL_DATA.findIndex(data => noteToPitchClass(data.major) === rootPitchClass);

    if (rootNoteIndexOnCircle !== -1) {
        return {
            root: foundChord.root,
            definition: foundChord.definition,
            key: undefined, // Explicitly no key
            keyIndex: rootNoteIndexOnCircle,
        };
    }

    return null; // Final fallback if root note cannot be mapped to the circle.
};