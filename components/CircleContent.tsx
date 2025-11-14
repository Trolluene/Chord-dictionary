import React, { useMemo } from 'react';
import { POSITIONAL_DATA, DIATONIC_CHORDS_FOR_KEY, NOTE_COLORS, DIATONIC_NUMERALS } from '../constants';
import { getChordNotes, noteToPitchClass } from '../utils/musicTheory';
import { KeyData, ChordType } from '../types';

interface CircleContentProps {
  radius: number;
  data: KeyData[];
  type: ChordType;
  selectedKeyIndex: number;
  setSelectedKeyIndex?: (index: number) => void;
}

const getChordRoot = (chordName: string): string => {
    if (chordName.length > 1 && (chordName[1] === 'b' || chordName[1] === '#')) {
        return chordName.substring(0, 2);
    }
    return chordName[0];
};

const parseRootNote = (rootNote: string) => {
    const noteLetter = rootNote.length > 1 ? rootNote[0] : rootNote;
    const accidental = rootNote.length > 1 ? rootNote[1] : null;
    const accidentalDisplay = accidental === '#' ? '♯' : accidental === 'b' ? '♭' : null;
    return { noteLetter, accidental: accidentalDisplay };
}

export const CircleContent: React.FC<CircleContentProps> = ({
  radius,
  data,
  type,
  selectedKeyIndex,
  setSelectedKeyIndex
}) => {
    const diatonicChordMap = useMemo(() => {
        const currentKey = POSITIONAL_DATA[selectedKeyIndex].major;
        const chordsInKey = DIATONIC_CHORDS_FOR_KEY[currentKey] || [];
        
        const map = new Map<string, string>(); // Key: 'pitchClass-quality', Value: 'numeral'

        chordsInKey.forEach((chordName, index) => {
            const root = getChordRoot(chordName);
            const pitchClass = noteToPitchClass(root);
            
            let quality: ChordType;
            if (chordName.endsWith('°')) {
                quality = 'dim';
            } else if (chordName.endsWith('m')) {
                quality = 'minor';
            } else {
                quality = 'major';
            }
            
            const mapKey = `${pitchClass}-${quality}`;
            map.set(mapKey, DIATONIC_NUMERALS[index]);
        });

        return map;
    }, [selectedKeyIndex]);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {data.map((item, i) => {
                const angle = i * 30;

                const segmentContainerStyle: React.CSSProperties = {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '80px',
                    height: '104px',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                };
                
                const contentContainerStyle: React.CSSProperties = {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                };
                
                const handleSegmentClick = (e: React.MouseEvent) => {
                    if (type === 'major' && setSelectedKeyIndex) {
                        e.stopPropagation();
                        setSelectedKeyIndex(i);
                    }
                };
                
                const chordName = item[type];
                const notes = getChordNotes(chordName);

                // --- NEW Enharmonic-aware logic ---
                const rootNoteForCheck = getChordRoot(chordName);
                const pitchClass = noteToPitchClass(rootNoteForCheck);
                const mapKey = `${pitchClass}-${type}`;
                
                const numeral = diatonicChordMap.get(mapKey) || '';
                const isDiatonic = numeral !== '';
                // --- END of new logic ---

                const isTonic = type === 'major' && i === selectedKeyIndex;
                
                const rootNote = getChordRoot(chordName);
                const { noteLetter, accidental } = parseRootNote(rootNote);
                const chordQuality = chordName.replace(rootNote, '');
                
                const segmentClasses = `
                    w-full h-full transition-opacity duration-300
                    ${isDiatonic ? 'opacity-100' : 'opacity-40'}
                    ${type === 'major' ? 'cursor-pointer pointer-events-auto' : ''}
                `;

                const getShapeClasses = () => {
                    switch (type) {
                        case 'dim': return 'rounded-full w-11 h-11';
                        case 'minor': return 'rounded-md w-11 h-11';
                        case 'major': return 'rounded-md w-14 h-10';
                        default: return 'rounded-md w-11 h-11';
                    }
                };

                const chordBoxBaseClasses = `text-white font-bold text-center border flex items-center justify-center transition-all duration-300 shrink-0`;
                const chordBoxShapeClasses = getShapeClasses();
                const tonicClasses = isTonic ? 'border-blue-500 shadow-lg shadow-blue-500/60' : 'border-black/50';

                const NumeralComponent = (
                    <div className="text-base font-bold w-7 h-5 flex items-center justify-center text-gray-700 shrink-0">{numeral}</div>
                );

                const ChordBoxComponent = (
                    <div
                        className={`${chordBoxBaseClasses} ${chordBoxShapeClasses} ${tonicClasses}`}
                        style={{ backgroundColor: NOTE_COLORS[rootNote] || '#374151' }}>
                        <div className="flex items-baseline leading-none">
                            <span className="text-2xl font-semibold">{noteLetter}</span>
                            {accidental && <span className="text-base font-normal -ml-0.5">{accidental}</span>}
                            <span className="text-xl font-normal">{chordQuality}</span>
                        </div>
                    </div>
                );

                const DotsComponent = (
                    <div className="flex flex-row gap-1 shrink-0">
                        {notes.map((note, noteIndex) => (
                            <div key={noteIndex} className="w-[7px] h-[7px] rounded-full" style={{ backgroundColor: NOTE_COLORS[note] }}></div>
                        ))}
                    </div>
                );

                return (
                    <div key={`${type}-${i}`} style={segmentContainerStyle}>
                        <div className={segmentClasses} onClick={handleSegmentClick}>
                             <div style={contentContainerStyle}>
                                <div className="flex flex-col items-center gap-1.5">
                                    {NumeralComponent}
                                    {ChordBoxComponent}
                                    {DotsComponent}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};