import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CircleContent } from './CircleContent';
import { POSITIONAL_DATA, MODES_DATA } from '../constants';

interface CircleOfFifthsProps {
  selectedKeyIndex: number;
  setSelectedKeyIndex: (index: number) => void;
}

const CIRCLE_SIZE = 690;

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({ selectedKeyIndex, setSelectedKeyIndex }) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const isDraggingRef = useRef(false);

  // Derive highlight rotation directly from the selected key index.
  // The selection is always centered on the selected key.
  const highlightRotation = selectedKeyIndex * 30;

  const handleInteractionEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsInteracting(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleInteractionEnd);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleInteractionEnd);
  }, []);

  const updateSelectionFromCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!circleRef.current) return;

    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle, normalize to 0-360 with 12 o'clock as 0 degrees.
    const angle = (Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90 + 360) % 360;
    
    // Convert angle to the nearest key index
    const nearestKeyIndex = Math.round(angle / 30) % 12;
    
    setSelectedKeyIndex(nearestKeyIndex);
  }, [setSelectedKeyIndex]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDraggingRef.current) return;
    event.preventDefault();
    updateSelectionFromCoordinates(event.clientX, event.clientY);
  }, [updateSelectionFromCoordinates]);
  
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isDraggingRef.current) return;
    event.preventDefault();
    const touch = event.touches[0];
    updateSelectionFromCoordinates(touch.clientX, touch.clientY);
  }, [updateSelectionFromCoordinates]);

  const handleInteractionStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!circleRef.current) return;

    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));
    
    const innerRadius = 64;
    const outerRadius = (CIRCLE_SIZE * 0.87) / 2;

    if (distance < innerRadius || distance > outerRadius) return;
    
    event.preventDefault();

    isDraggingRef.current = true;
    setIsInteracting(true);
    updateSelectionFromCoordinates(clientX, clientY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleInteractionEnd);
  }, [handleMouseMove, handleInteractionEnd, handleTouchMove, updateSelectionFromCoordinates]);


  return (
    <div
      ref={circleRef}
      className="relative rounded-full select-none shadow-xl shadow-slate-400/60 touch-none"
      style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
    >
      {/* Static Dark Outer Ring */}
      <div className="absolute inset-0 bg-[#3a3a3a] rounded-full flex items-center justify-center pointer-events-none">
        {MODES_DATA.map(({name, angle}) => (
           <div key={name} className="absolute w-full h-full" style={{transform: `rotate(${angle}deg)`}}>
              <span className="absolute top-[12px] left-1/2 -translate-x-1/2 text-white font-bold tracking-wider uppercase text-lg">{name}</span>
           </div>
        ))}
      </div>
      
      <div 
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{ width: '87%', height: '87%', transform: 'translate(-50%, -50%)'}}
      >
        {/* 1. Static Background Layer */}
        <div
            className="absolute inset-0 rounded-full"
            style={{
                background: 'white',
                mask: 'radial-gradient(transparent 63px, black 64px)',
                WebkitMask: 'radial-gradient(transparent 63px, black 64px)',
            }}
        />

        {/* 2. Highlight Layer - Rotates based on selectedKeyIndex */}
        <div
            className="absolute inset-0 rounded-full"
            style={{ 
                transform: `rotate(${highlightRotation}deg)`,
                transition: isInteracting ? 'none' : 'transform 0.5s',
            }}
        >
            <div
                className="absolute w-full h-full"
                style={{
                    background: 'conic-gradient(from -45deg at center, #f0f9ff 90deg, transparent 0)',
                    mask: 'radial-gradient(transparent 63px, black 64px, black 230px, transparent 231px)',
                    WebkitMask: 'radial-gradient(transparent 63px, black 64px, black 230px, transparent 231px)',
                }}
            />
            <div
                className="absolute w-full h-full"
                style={{
                    background: 'conic-gradient(from -15deg at center, #f0f9ff 30deg, transparent 0)',
                    mask: 'radial-gradient(transparent 230px, black 231px)',
                    WebkitMask: 'radial-gradient(transparent 230px, black 231px)',
                }}
            />
            {/* Boundary Markers for Highlight Zone */}
            <div
                className="absolute top-0 left-1/2 w-px h-full bg-blue-300"
                style={{
                    transform: 'translateX(-50%) rotate(-45deg)',
                    mask: 'radial-gradient(transparent 63px, black 64px)',
                    WebkitMask: 'radial-gradient(transparent 63px, black 64px)',
                }}
            />
            <div
                className="absolute top-0 left-1/2 w-px h-full bg-blue-300"
                style={{
                    transform: 'translateX(-50%) rotate(45deg)',
                    mask: 'radial-gradient(transparent 63px, black 64px)',
                    WebkitMask: 'radial-gradient(transparent 63px, black 64px)',
                }}
            />
        </div>

        {/* 3. STATIC Content Layer - NO ROTATION */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={`line-${i}`}
                className="absolute top-0 left-1/2 w-[1px] h-full bg-gray-200"
                style={{ 
                    transform: `translateX(-50%) rotate(${i * 30}deg)`,
                    mask: 'radial-gradient(transparent 63px, black 64px)',
                    WebkitMask: 'radial-gradient(transparent 63px, black 64px)',
                }}
              />
          ))}
          <CircleContent type="dim" data={POSITIONAL_DATA} radius={265} selectedKeyIndex={selectedKeyIndex} />
          <CircleContent type="minor" data={POSITIONAL_DATA} radius={190} selectedKeyIndex={selectedKeyIndex} />
          <CircleContent type="major" data={POSITIONAL_DATA} radius={115} selectedKeyIndex={selectedKeyIndex} setSelectedKeyIndex={setSelectedKeyIndex} />
        </div>
      </div>
      
      {/* Center Pin */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[126px] h-[126px] bg-gray-800 rounded-full shadow-inner pointer-events-none border-[6px] border-gray-400/50"
        style={{
          background: 'radial-gradient(circle, #5a5a5a 0%, #2a2a2a 100%)',
        }}
      >
         <div 
            className="absolute top-1/2 left-1/2 w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2 bg-gray-500 border-2 border-gray-400"
            style={{background: 'radial-gradient(circle, #d4d4d4 0%, #8a8a8a 100%)'}}
        />
      </div>
    </div>
  );
};