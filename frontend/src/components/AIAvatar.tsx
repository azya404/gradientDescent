// components/AIAvatar.tsx
import React from 'react';
import type { AnimationState } from '../types';

interface AvatarProps {
  state: AnimationState;
  auraScore: number;
}

const AIAvatar: React.FC<AvatarProps> = ({ state, auraScore }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      {/* The Aura Meter HUD */}
      <div className="absolute top-10 right-10 flex flex-col items-end">
        <div className="text-[10px] text-red-500 font-mono mb-1 uppercase tracking-tighter">Aura Levels</div>
        <div className="h-64 w-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
          <div 
            className="w-full bg-red-600 transition-all duration-1000 ease-out" 
            style={{ height: `${(auraScore / 1000) * 100}%` }}
          />
        </div>
        <div className="mt-2 font-mono font-bold text-2xl text-red-600">{auraScore}</div>
      </div>

      {/* The Character Visual */}
      <div className="w-80 h-80 rounded-full bg-zinc-800 border-4 border-zinc-700 overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.2)]">
        {/* For the hackathon, you can swap between different videos based on 'state' */}
        <video 
          key={state}
          autoPlay 
          loop 
          muted 
          className="w-full h-full object-cover grayscale contrast-125"
        >
          <source src={`/videos/ai_${state}.mp4`} type="video/mp4" />
        </video>
      </div>
      
      <div className="mt-6 text-zinc-500 font-mono text-sm uppercase animate-pulse">
        Interviewer is {state}...
      </div>
    </div>
  );
};

export default AIAvatar;