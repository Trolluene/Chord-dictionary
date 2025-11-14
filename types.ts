export interface KeyData {
  major: string;
  minor: string;
  dim: string;
  keySignature: string;
}

export type ChordType = 'major' | 'minor' | 'dim';

// New types for the Chord Dictionary
export interface ChordDefinition {
  symbol: string;
  name: string;
  degrees: string[];
}

export interface ChordCategory {
  name: string;
  chords: ChordDefinition[];
}

export interface SearchResult {
  message: string;
  chord?: {
    root: string;
    definition: ChordDefinition;
  };
  key?: string;
}
