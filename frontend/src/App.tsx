import React, { useState, useRef, useEffect, useCallback } from 'react';
import CodeEditor from './components/CodeEditor';
import AIAvatar from './components/AIAvatar';
import LiveAudioRecorder from './components/LiveAudioRecorder';
import WebcamPreview from './components/WebcamPreview';
import { useLiveSession } from './hooks/useLiveSession';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { AnimationState } from './types';

const SNARKY_THOUGHTS = [
  "Did I scare you off already?",
  "Cat got your tongue?",
  "Too scared to continue?",
  "Lost your train of thought?",
  "Need me to hold your hand?",
  "Is this too much for you?",
  "Thinking about giving up?",
  "Did you forget how to code?",
  "Running away so soon?",
  "Can't handle the pressure?"
];

const App: React.FC = () => {
  const [code, setCode] = useState<string | undefined>("");
  const [currentStatus, setCurrentStatus] = useState<AnimationState>('idle');
  const [isTyping, setIsTyping] = useState(false);
  const [thoughtBubble, setThoughtBubble] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const thoughtBubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const codeDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio player
  const audioPlayer = useAudioPlayer();

  // Initialize WebSocket live session
  const liveSession = useLiveSession({
    onAudioChunk: (base64PCM) => {
      // Play incoming PCM audio chunk
      audioPlayer.playChunk(base64PCM);
      // AI is speaking, show glitch_out state
      setCurrentStatus('glitch_out');
    },
    onTranscript: (text) => {
      // Display what AI is saying
      setTranscript(text);
      console.log('[AI]:', text);
    },
    onInputTranscript: (text) => {
      // Display what user said (optional)
      console.log('[User]:', text);
    },
    onInterrupted: () => {
      // User interrupted AI, stop playback immediately
      console.log('[Interrupted] User spoke while AI was speaking');
      audioPlayer.stop();
      setCurrentStatus('judging');
    },
    onTurnComplete: () => {
      // AI finished its roast turn — reset state so new code/speech triggers another roast
      console.log('[Turn Complete] AI finished speaking, ready for new input');
      setCurrentStatus('idle');
    },
    onError: (err) => {
      console.error('[Session Error]:', err);
      setError(err.message);
    },
    onConnected: () => {
      console.log('[Session] Connected successfully');
      setIsInterviewActive(true);
      setError(null);
    },
    onDisconnected: () => {
      console.log('[Session] Disconnected');
      setIsInterviewActive(false);
      setCurrentStatus('idle');
    },
  });

  const handleCodeChange = (newCode: string | undefined) => {
    setCode(newCode);

    // Don't interfere with glitch_out state
    if (currentStatus === 'glitch_out') {
      return;
    }

    // Hide thought bubble when user starts typing again
    setThoughtBubble(null);
    if (thoughtBubbleTimeoutRef.current) {
      clearTimeout(thoughtBubbleTimeoutRef.current);
      thoughtBubbleTimeoutRef.current = null;
    }

    // User is actively typing
    if (newCode && newCode.trim().length > 0) {
      setIsTyping(true);
      setCurrentStatus('judging');

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout: if no typing for 2 seconds, switch back to idle
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setCurrentStatus('idle');

        // Show snarky thought bubble after stopping (do NOT clear code)
        const randomThought = SNARKY_THOUGHTS[Math.floor(Math.random() * SNARKY_THOUGHTS.length)];
        setThoughtBubble(randomThought);

        // Auto-hide thought bubble after 5 seconds
        thoughtBubbleTimeoutRef.current = setTimeout(() => {
          setThoughtBubble(null);
        }, 5000);
      }, 2000);

      // Debounce code updates to WebSocket (send every 2 seconds)
      if (isInterviewActive) {
        if (codeDebounceRef.current) {
          clearTimeout(codeDebounceRef.current);
        }

        codeDebounceRef.current = setTimeout(() => {
          liveSession.sendCode(newCode, 'python');
        }, 2000);
      }
    } else {
      // Empty code - go to idle immediately
      setIsTyping(false);
      setCurrentStatus('idle');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const handleStartInterview = useCallback(() => {
    console.log('[Interview] Starting...');
    setError(null);

    // Initialize audio player (required for AudioContext - needs user interaction)
    audioPlayer.init();

    // Connect to WebSocket
    liveSession.connect('python');
  }, [audioPlayer, liveSession]);

  const handleStopInterview = useCallback(() => {
    console.log('[Interview] Stopping...');

    // Disconnect WebSocket
    liveSession.disconnect();

    // Cleanup audio
    audioPlayer.cleanup();

    setIsInterviewActive(false);
    setCurrentStatus('idle');
  }, [audioPlayer, liveSession]);

  const handleClear = () => {
    setCode("");
    setError(null);
    setTranscript('');
    setThoughtBubble(null);
    setCurrentStatus('idle');
    setIsTyping(false);

    // Clear any pending timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (thoughtBubbleTimeoutRef.current) {
      clearTimeout(thoughtBubbleTimeoutRef.current);
      thoughtBubbleTimeoutRef.current = null;
    }
    if (codeDebounceRef.current) {
      clearTimeout(codeDebounceRef.current);
      codeDebounceRef.current = null;
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (thoughtBubbleTimeoutRef.current) {
        clearTimeout(thoughtBubbleTimeoutRef.current);
      }
      if (codeDebounceRef.current) {
        clearTimeout(codeDebounceRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-black">
      {/* LEFT: Editor Area */}
      <div className="w-1/2 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Source Code</h2>
          <div className="flex gap-2">
            {isInterviewActive ? (
              <button
                onClick={handleStopInterview}
                className="px-4 py-2 font-bold rounded transition-all transform bg-zinc-700 hover:bg-zinc-600 text-zinc-300 active:scale-95"
              >
                STOP INTERVIEW
              </button>
            ) : (
              <button
                onClick={handleStartInterview}
                className="px-4 py-2 font-bold rounded transition-all transform bg-green-600 hover:bg-green-700 text-white active:scale-95"
              >
                START INTERVIEW
              </button>
            )}
            <button
              onClick={handleClear}
              disabled={!isInterviewActive && code === ''}
              className={`px-4 py-2 font-bold rounded transition-all transform ${!isInterviewActive && code === ''
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300 active:scale-95'
                }`}
            >
              CLEAR
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          {/* Overlay placeholder when editor is truly empty (no content) */}
          {(!code || code.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center">
                <p className="text-zinc-600 font-mono text-lg mb-2">
                  Start coding here or paste your code
                </p>
                <p className="text-zinc-700 font-mono text-sm">
                  Click anywhere to begin...
                </p>
              </div>
            </div>
          )}
          <CodeEditor
            value={code}
            setCode={handleCodeChange}
            onTyping={() => { }}
          />

          {/* Webcam PiP overlay */}
          <WebcamPreview isActive={isInterviewActive} />
        </div>

        {/* Live Audio Recorder Status */}
        <LiveAudioRecorder
          onAudioChunk={(base64PCM) => {
            liveSession.sendAudio(base64PCM);
          }}
          isRecording={isInterviewActive}
        />

        {/* Status Messages */}
        {error && (
          <div className="bg-red-950 border border-red-800 rounded-lg p-3 text-red-400 font-mono text-sm">
            ❌ {error}
          </div>
        )}

      </div>

      {/* RIGHT: AI Avatar area */}
      <div className="w-1/2 border-l border-zinc-900 flex relative">
        {/* Snarky Thought Bubble */}
        {thoughtBubble && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
            <div className="relative bg-zinc-900 border-2 border-yellow-500 rounded-2xl px-6 py-3 shadow-xl max-w-md">
              <p className="text-yellow-400 text-sm" style={{ fontFamily: 'Electrolize, monospace' }}>
                {thoughtBubble}
              </p>
              {/* Speech bubble tail pointing down */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-yellow-500" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-zinc-900" />
            </div>
          </div>
        )}
        <AIAvatar state={currentStatus} />
      </div>
    </div>
  );
};

export default App;
