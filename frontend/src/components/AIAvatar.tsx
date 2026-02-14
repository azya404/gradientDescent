// components/AIAvatar.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnimationState } from '../types';

interface AvatarProps {
  state: AnimationState;
  auraScore: number;
}

const AVATAR_CONFIG: Record<
  AnimationState,
  { seed: string; shapeColor: string; glowColor: string }
> = {
  idle: { seed: 'idle', shapeColor: 'f88c49', glowColor: 'rgba(248,140,73,0.25)' },
  judging: { seed: 'judging', shapeColor: 'eab308', glowColor: 'rgba(234,179,8,0.35)' },
  glitch_out: { seed: 'roast', shapeColor: 'ef4444', glowColor: 'rgba(239,68,68,0.5)' },
  loading: { seed: 'loading', shapeColor: 'a855f7', glowColor: 'rgba(168,85,247,0.35)' },
};

const AVATAR_ANIMATIONS: Record<AnimationState, React.ComponentProps<typeof motion.div>['animate']> = {
  idle: {
    scale: [1, 1.03, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  judging: {
    rotate: [0, -3, 3, 0],
    scale: [1, 1.02, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
  glitch_out: {
    x: [0, -4, 4, -2, 2, 0],
    rotate: [0, 2, -2, 0],
    scale: [1, 1.05, 1],
    transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
  },
  loading: {
    scale: [1, 1.06, 1],
    opacity: [1, 0.85, 1],
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
  },
};

const STATE_TRANSITION = { type: 'tween' as const, duration: 0.35, ease: 'easeInOut' as const };

const AIAvatar: React.FC<AvatarProps> = ({ state, auraScore }) => {
  const config = AVATAR_CONFIG[state];
  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${config.seed}&size=320&backgroundColor=1a1a1a&shapeColor=${config.shapeColor}&flip=true`;

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

<<<<<<< Updated upstream
      {/* The Character Visual — DiceBear thumbs, fit in circle with state transition */}
      <motion.div
        className="w-80 h-80 rounded-full bg-zinc-800 border-4 border-zinc-700 overflow-hidden flex items-center justify-center relative"
        style={{ boxShadow: `0 0 50px ${config.glowColor}` }}
        animate={AVATAR_ANIMATIONS[state]}
        transition={STATE_TRANSITION}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={state}
            src={avatarUrl}
            alt="Interviewer avatar"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </AnimatePresence>
      </motion.div>
=======
      {/* The Character Visual */}
      <div className="w-80 h-80 rounded-full bg-zinc-800 border-4 border-zinc-700 overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.2)] flex items-center justify-center relative">
        {/* Animated background effect */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          state === 'glitch_out' ? 'animate-pulse bg-red-900/30' :
          state === 'loading' ? 'animate-spin bg-red-500/10' :
          state === 'judging' ? 'bg-red-800/10' :
          'bg-zinc-900'
        }`} />

        {/* Central eye/icon */}
        <div className={`relative z-10 w-32 h-32 rounded-full border-4 transition-all duration-300 ${
          state === 'glitch_out' ? 'border-red-500 bg-red-950 animate-pulse' :
          state === 'loading' ? 'border-red-600 bg-red-900 animate-spin' :
          state === 'judging' ? 'border-red-700 bg-zinc-900' :
          'border-zinc-600 bg-zinc-800'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full transition-all duration-300 ${
              state === 'glitch_out' ? 'bg-red-500 animate-ping' :
              state === 'loading' ? 'bg-red-600' :
              state === 'judging' ? 'bg-red-700' :
              'bg-zinc-600'
            }`} />
          </div>
        </div>
      </div>
>>>>>>> Stashed changes
      
      <div className="mt-6 text-zinc-500 font-mono text-sm uppercase animate-pulse">
        Interviewer is {state}...
      </div>
    </div>
  );
};

export default AIAvatar;