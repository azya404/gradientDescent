// src/App.tsx (Update)
import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import AIAvatar from './components/AIAvatar';
import type { AnimationState } from './types';

const App: React.FC = () => {
  const [code, setCode] = useState<string | undefined>("");
  const [currentStatus, setCurrentStatus] = useState<AnimationState>('idle');
  const [auraScore] = useState(0);

  const handleSubmit = async () => {
    // This is where you call your Node.js backend
    console.log("Sending code to be roasted:", code);
    setCurrentStatus('glitch_out'); // Visual feedback that something is happening
  };

  return (
    <div className="flex h-screen bg-black">
      {/* LEFT: Editor Area */}
      <div className="w-1/2 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Source Code</h2>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-all transform active:scale-95"
          >
            SUBMIT FOR REVIEW
          </button>
        </div>
        <div className="flex-1 min-h-0">
          <CodeEditor setCode={setCode} onTyping={() => setCurrentStatus('judging')} />
        </div>
      </div>

      {/* RIGHT: AI Avatar area */}
      <div className="w-1/2 border-l border-zinc-900 flex">
        <AIAvatar state={currentStatus} auraScore={auraScore} />
      </div>
    </div>
  );
};

export default App;