import React, { useState, useCallback } from 'react';
import { CircleOfFifths } from './components/CircleOfFifths';
import { InfoPanel } from './components/InfoPanel';
import { POSITIONAL_DATA } from './constants';
import { findChordAndKeyFromNotes } from './utils/musicTheory';
import { SearchResult } from './types';

const App: React.FC = () => {
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number>(0); // Default to C Major
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const handlePrevious = useCallback(() => {
    setSelectedKeyIndex((prevIndex) => (prevIndex - 1 + POSITIONAL_DATA.length) % POSITIONAL_DATA.length);
  }, []);

  const handleNext = useCallback(() => {
    setSelectedKeyIndex((prevIndex) => (prevIndex + 1) % POSITIONAL_DATA.length);
  }, []);
  
  const handleSearch = useCallback((notesInput: string) => {
    if (!notesInput.trim()) {
      setSearchResult(null);
      return;
    }
    const result = findChordAndKeyFromNotes(notesInput);
    
    if (result) {
      setSelectedKeyIndex(result.keyIndex); // This highlights either the key or the chord's root
      if (result.key) {
        // Case 1: Chord and Key found
        setSearchResult({
          message: 'Found chord in the key of',
          chord: {
            root: result.root,
            definition: result.definition,
          },
          key: result.key,
        });
      } else {
        // Case 2: Chord found, but no diatonic key
        setSearchResult({
          message: 'Found a non-diatonic chord',
          chord: {
            root: result.root,
            definition: result.definition,
          },
        });
      }
    } else {
      // Case 3: No chord found at all
      setSearchResult({ message: 'No matching chord found for the entered notes.' });
    }
  }, []);

  return (
    <main className="min-h-screen w-full bg-white font-sans flex flex-col items-center justify-center p-5 lg:p-10">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-14">
        {/* Left Side: Circle and Controls */}
        <div className="flex flex-col items-center gap-7">
          <CircleOfFifths
            selectedKeyIndex={selectedKeyIndex}
            setSelectedKeyIndex={setSelectedKeyIndex}
          />
          <div className="flex items-center gap-7">
            <button
              onClick={handlePrevious}
              className="w-16 h-16 bg-gray-100 border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex justify-center items-center"
              aria-label="Previous Key (Counter-Clockwise)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-16 h-16 bg-gray-100 border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex justify-center items-center"
              aria-label="Next Key (Clockwise)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Right Side: Info Panel */}
        <div className="w-full lg:w-auto lg:max-w-md flex-shrink-0">
          <InfoPanel 
            selectedKeyIndex={selectedKeyIndex} 
            searchResult={searchResult}
            onSearch={handleSearch}
          />
        </div>
      </div>
    </main>
  );
};

export default App;