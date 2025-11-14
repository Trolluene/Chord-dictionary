import React, { useState, useMemo, useEffect, useRef } from 'react';
import { POSITIONAL_DATA, DIATONIC_CHORDS_FOR_KEY, DIATONIC_NUMERALS, NOTE_COLORS, CHORD_LIBRARY } from '../constants';
import { getChordNotes, getNotesForChordDefinition } from '../utils/musicTheory';
import { SearchResult } from '../types';

interface InfoPanelProps {
  selectedKeyIndex: number;
  searchResult: SearchResult | null;
  onSearch: (notesInput: string) => void;
}

type ViewType = 'diatonic' | 'dictionary';

const getRootNote = (chordName: string): string => {
    if (chordName.length > 1 && (chordName[1] === 'b' || chordName[1] === '#')) {
        return chordName.substring(0, 2);
    }
    return chordName[0];
};

const SearchSection: React.FC<{ onSearch: (notes: string) => void; result: SearchResult | null }> = ({ onSearch, result }) => {
    const [input, setInput] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(input);
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., C E G or C Eb Gb Bbb D"
                    className="w-full px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-5 py-2.5 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Search
                </button>
            </form>
            {result && (
                <div className="mt-5 p-4 bg-slate-50 border border-gray-200 rounded-lg text-base">
                    <p className="font-semibold text-gray-700">{result.message}</p>
                    {result.chord && (
                        <div className="mt-1.5">
                            <span className="font-bold text-blue-600">{result.chord.root}{result.chord.definition.symbol}</span> ({result.chord.definition.name})
                            {result.key ? (
                                <span> in the key of <span className="font-bold">{result.key} Major</span>.</span>
                            ) : (
                                <span>. The circle is highlighting the chord's root note.</span>
                            )}
                            <p className="mt-1.5 font-mono text-sm text-gray-500">{result.chord.definition.degrees.join(' · ')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ViewToggle: React.FC<{ view: ViewType, setView: (view: ViewType) => void }> = ({ view, setView }) => {
    const baseClasses = "w-1/2 py-3 text-base font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200";
    const activeClasses = "bg-gray-800 text-white shadow";
    const inactiveClasses = "bg-white text-gray-700 hover:bg-gray-100";
    
    return (
        <div className="flex w-full p-1.5 bg-gray-200 rounded-xl">
            <button onClick={() => setView('diatonic')} className={`${baseClasses} ${view === 'diatonic' ? activeClasses : inactiveClasses}`}>
                Diatonic Chords
            </button>
            <button onClick={() => setView('dictionary')} className={`${baseClasses} ${view === 'dictionary' ? activeClasses : inactiveClasses}`}>
                Chord Dictionary
            </button>
        </div>
    );
};

const DiatonicChordsView: React.FC<{ majorKey: string, onChordSelect: (chordName: string) => void }> = ({ majorKey, onChordSelect }) => {
    const diatonicChords = useMemo(() => {
        const chords = DIATONIC_CHORDS_FOR_KEY[majorKey] || [];
        return chords.map((chord, index) => ({
          numeral: DIATONIC_NUMERALS[index],
          name: chord,
          notes: getChordNotes(chord),
        }));
    }, [majorKey]);

    return (
        <div className="space-y-3">
          {diatonicChords.map(({ numeral, name, notes }) => {
            const rootNote = getRootNote(name);
            const color = NOTE_COLORS[rootNote] || '#a1a1aa';
            
            return (
                <div 
                    key={name} 
                    className="p-4 bg-slate-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-slate-100 hover:border-gray-300 transition-colors"
                    onClick={() => onChordSelect(name)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-12 rounded-full" style={{backgroundColor: color}}></div>
                            <div>
                                <div className="font-bold text-gray-800 text-xl">{name}</div>
                            </div>
                        </div>
                        <div className="w-14 text-center">
                            <span className="text-xl font-serif font-bold text-gray-600">{numeral}</span>
                        </div>
                    </div>
                    <div className="mt-2.5 pl-[21px] text-base text-gray-600 font-mono">
                      {notes.join(' - ')}
                    </div>
                </div>
            )
          })}
        </div>
    );
};

const ChordDictionaryView: React.FC<{ rootNote: string, highlightedSymbol: string | null }> = ({ rootNote, highlightedSymbol }) => {
    const highlightedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (highlightedRef.current) {
            highlightedRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [highlightedSymbol, rootNote]); // Rerun when highlight changes or rootNote changes

    return (
        <div className="space-y-5 max-h-[520px] overflow-y-auto pr-2 -mr-2">
            {CHORD_LIBRARY.map(category => (
                <div key={category.name}>
                    <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.chords.map(chord => {
                            const isHighlighted = highlightedSymbol === chord.symbol;
                            const fullChordName = `${rootNote}${chord.symbol}`;
                            const notes = getNotesForChordDefinition(rootNote, chord.symbol);
                            const color = NOTE_COLORS[rootNote] || '#a1a1aa';

                            const cardClasses = `
                                p-4 rounded-lg flex flex-col justify-between transition-all duration-300
                                ${isHighlighted 
                                    ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-400' 
                                    : 'bg-slate-50 border border-gray-200'
                                }
                            `;

                            return (
                                <div 
                                    key={chord.symbol} 
                                    ref={isHighlighted ? highlightedRef : null}
                                    className={cardClasses}
                                >
                                    <div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-1.5 self-stretch rounded-full" style={{backgroundColor: color}}></div>
                                            <div>
                                                <div className="font-bold text-gray-800">{fullChordName}</div>
                                                <div className="text-sm text-gray-500">{chord.name}</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-sm text-gray-500 font-mono pl-[16px]">
                                            {chord.degrees.join(' · ')}
                                        </div>
                                    </div>
                                    <div className="mt-2.5 text-base text-gray-800 font-mono pl-[16px]">
                                        {notes.join(' - ')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};


export const InfoPanel: React.FC<InfoPanelProps> = ({ selectedKeyIndex, searchResult, onSearch }) => {
  const [view, setView] = useState<ViewType>('diatonic');
  const [highlightedChordSymbol, setHighlightedChordSymbol] = useState<string | null>(null);
  const { major, minor, keySignature } = POSITIONAL_DATA[selectedKeyIndex];
  
  // When the selected key changes, reset the highlight
  useEffect(() => {
    setHighlightedChordSymbol(null);
  }, [selectedKeyIndex]);

  const handleDiatonicChordSelect = (chordName: string) => {
    const rootOfClickedChord = getRootNote(chordName);

    // We only want to switch views if the clicked chord's root is the same as the selected key.
    // e.g., in Key of C, clicking 'C' works, but clicking 'Dm' does not switch views.
    if (rootOfClickedChord === major) {
        // The simple diatonic name 'C' corresponds to the major triad symbol '' in the dictionary.
        const qualitySymbol = chordName.replace(rootOfClickedChord, '') || '';
        setHighlightedChordSymbol(qualitySymbol);
        setView('dictionary');
    }
  };

  const renderKeySignature = (sig: string) => {
    if (sig === '0') return <span className="text-gray-500 text-2xl">None</span>;
    const count = sig.slice(0, -1);
    const type = sig.slice(-1) === '#' ? '♯' : '♭';
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-6xl font-bold text-gray-800">{count}</span>
        <span className="text-6xl text-gray-500 font-light">{type}</span>
      </div>
    );
  };
  
  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-lg shadow-slate-200/70 p-7 flex flex-col gap-7">
      <SearchSection onSearch={onSearch} result={searchResult} />

      <div>
        <h1 className="text-5xl font-extrabold text-gray-800">Key of {major}</h1>
        <p className="text-2xl text-gray-500 mt-1">Relative Minor: {minor}</p>
      </div>
      
      <div className="p-5 bg-slate-50 border border-gray-200 rounded-xl">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Key Signature</h2>
        {renderKeySignature(keySignature)}
      </div>
      
      <div>
        <ViewToggle view={view} setView={setView} />
      </div>

      <div className="mt-0">
        {view === 'diatonic' 
          ? <DiatonicChordsView majorKey={major} onChordSelect={handleDiatonicChordSelect} /> 
          : <ChordDictionaryView rootNote={major} highlightedSymbol={highlightedChordSymbol} />
        }
      </div>
    </div>
  );
};