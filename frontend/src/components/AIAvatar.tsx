// components/AIAvatar.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnimationState } from '../types';

interface AvatarProps {
  state: AnimationState;
}

const AVATAR_CONFIG: Record<
  AnimationState,
  {
    seed: string;
    shapeColor: string;
    glowColor: string;
    videoScale: number;      // Overall size (150% = 1.5)
    videoZoom: number;       // Additional crop zoom (1.2 = 20% zoom in)
    videoPosition: string;   // CSS object-position (e.g., "center top")
  }
> = {
  idle: {
    seed: 'idle',
    shapeColor: 'a855f7',
    glowColor: 'rgba(168,85,247,0.35)',
    videoScale: 1.5,         // 150% size
    videoZoom: 1.2,          // 20% zoom in
    videoPosition: 'center center'
  },
  judging: {
    seed: 'judging',
    shapeColor: 'eab308',
    glowColor: 'rgba(234,179,8,0.35)',
    videoScale: 1.5,
    videoZoom: 1.2,
    videoPosition: 'center center'
  },
  glitch_out: {
    seed: 'roast',
    shapeColor: 'ef4444',
    glowColor: 'rgba(239,68,68,0.5)',
    videoScale: 1.5,
    videoZoom: 1.3,          // 30% zoom for more intense crop
    videoPosition: 'center center'
  },
};

const AVATAR_ANIMATIONS: Record<AnimationState, React.ComponentProps<typeof motion.div>['animate']> = {
  idle: {
    opacity: 1,
  },
  judging: {
    opacity: 1,
  },
  glitch_out: {
    opacity: 1,
  },
};

const STATE_TRANSITION = { type: 'tween' as const, duration: 0.35, ease: 'easeInOut' as const };

const AIAvatar: React.FC<AvatarProps> = ({ state }) => {
  const config = AVATAR_CONFIG[state];
  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${config.seed}&size=320&backgroundColor=1a1a1a&shapeColor=${config.shapeColor}&flip=true`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative p-8" style={{ perspective: '1200px' }}>
      {/* Laptop Screen Container */}
      <motion.div
        className="relative"
        style={{
          width: '640px',
          height: '400px',
          maxWidth: '90%',
          maxHeight: '60vh',
          aspectRatio: '16/10',
          transform: 'rotateX(5deg)',
          transformStyle: 'preserve-3d',
        }}
        animate={AVATAR_ANIMATIONS[state]}
        transition={STATE_TRANSITION}
      >
        {/* Laptop Screen Frame */}
        <div
          className="absolute inset-0 rounded-xl border-8 border-zinc-800 overflow-hidden"
          style={{
            boxShadow: `0 0 60px ${config.glowColor}, inset 0 0 40px rgba(0,0,0,0.6)`,
            background: '#000',
            borderBottomWidth: '12px',
          }}
        >
          {/* Video Content */}
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <AnimatePresence mode="wait" initial={false}>
              <motion.video
                key={state}
                autoPlay
                loop
                muted
                playsInline
                className="pointer-events-none"
                style={{
                  width: '150%',
                  height: '150%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <source src={`/videos/ai_${state}.mp4`} type="video/mp4" />
                <source src={`/videos/ai_${state}.webm`} type="video/webm" />
              </motion.video>
            </AnimatePresence>
          </div>

          {/* Screen Glare Effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
            }}
          />
        </div>

        {/* Laptop Hinge */}
        <div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-64 h-1.5 bg-zinc-700 rounded-sm z-10"
          style={{
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
          }}
        />
      </motion.div>

      {/* Laptop Keyboard Deck - 3D Perspective */}
      <div
        className="absolute left-1/2 rounded-b-2xl overflow-hidden"
        style={{
          width: '700px',
          height: '180px',
          maxWidth: '95%',
          top: 'calc(50% + 200px)',
          transform: 'translateX(-50%) rotateX(65deg)',
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(to bottom, #27272a 0%, #18181b 50%, #0a0a0a 100%)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 2px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Keyboard Backlight Glow */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background:
              state === 'judging'
                ? 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(234,179,8,0.5) 0%, transparent 60%)'
                : 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(168,85,247,0.4) 0%, transparent 60%)',
            backgroundSize: '100% 100%',
            animation:
              state === 'judging'
                ? 'typingPulse 0.5s ease-in-out infinite'
                : 'none',
            opacity: 0.8,
          }}
        />

        {/* Keyboard Keys Grid */}
        <div className="absolute inset-0 p-4 grid grid-cols-15 gap-1" style={{ paddingTop: '16px' }}>
          {/* Top Row - Numbers & Function Keys */}
          <div className="col-span-15 flex gap-1 mb-1">
            {[...Array(15)].map((_, i) => (
              <div
                key={`top-${i}`}
                className="flex-1 h-4 rounded-sm bg-zinc-800/60"
                style={{
                  boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05)',
                }}
              />
            ))}
          </div>

          {/* Middle Row - QWERTY */}
          <div className="col-span-15 flex gap-1 mb-1">
            {[...Array(14)].map((_, i) => (
              <div
                key={`mid-${i}`}
                className="flex-1 h-5 rounded-sm bg-zinc-800/70"
                style={{
                  boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05)',
                }}
              />
            ))}
          </div>

          {/* Bottom Row - Space Bar Area */}
          <div className="col-span-15 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={`left-${i}`}
                className="flex-1 h-5 rounded-sm bg-zinc-800/70"
                style={{
                  boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05)',
                }}
              />
            ))}
            <div
              className="flex-[6] h-5 rounded-sm bg-zinc-800/70"
              style={{
                boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05)',
              }}
            />
            {[...Array(3)].map((_, i) => (
              <div
                key={`right-${i}`}
                className="flex-1 h-5 rounded-sm bg-zinc-800/70"
                style={{
                  boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Trackpad */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-20 rounded-lg bg-zinc-900/80"
          style={{
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.02)',
          }}
        />
      </div>

      <div className="mt-6 text-zinc-500 font-mono text-sm uppercase">
        Interviewer is {state}...
      </div>
    </div>
  );
};

export default AIAvatar;