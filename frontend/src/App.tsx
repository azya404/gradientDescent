import React, { useState, useRef } from 'react';
import CodeEditor from './components/CodeEditor';
import AIAvatar from './components/AIAvatar';
import AudioRecorder from './components/AudioRecorder';
import type { AnimationState } from './types';

const App: React.FC = () => {
  const [code, setCode] = useState<string | undefined>("");
  const [currentStatus, setCurrentStatus] = useState<AnimationState>('idle');
  const [auraScore] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roastText, setRoastText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = async () => {
    if (!code || code.trim().length === 0) {
      setError('No code? Too scared to even try?');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setRoastText(null);
    setCurrentStatus('loading');

    try {
      // Build FormData payload
      const formData = new FormData();
      formData.append('language', 'python'); // Default to python, could be dynamic
      formData.append('code', code);

      if (audioBlob) {
        // Determine file extension from mime type
        const ext = audioBlob.type.includes('webm') ? '.webm'
                  : audioBlob.type.includes('mp4') ? '.mp4'
                  : audioBlob.type.includes('ogg') ? '.ogg'
                  : '.wav';
        formData.append('audio', audioBlob, `explanation${ext}`);
      }

      // Call backend
      const response = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Backend error');
      }

      // Extract roast text from header
      const roastTextFromHeader = response.headers.get('X-Roast-Text');
      if (roastTextFromHeader) {
        setRoastText(decodeURIComponent(roastTextFromHeader));
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(err => {
          console.error('Audio playback error:', err);
        });
      }

      setCurrentStatus('glitch_out');
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setCurrentStatus('idle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAudioEnded = () => {
    setCurrentStatus('judging');
  };

  return (
    <div className="flex h-screen bg-black">
      {/* LEFT: Editor Area */}
      <div className="w-1/2 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Source Code</h2>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 font-bold rounded transition-all transform ${
              isSubmitting
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
            }`}
          >
            {isSubmitting ? 'ROASTING...' : 'SUBMIT FOR REVIEW'}
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <CodeEditor setCode={setCode} onTyping={() => setCurrentStatus('judging')} />
        </div>

        <AudioRecorder onAudioRecorded={setAudioBlob} />

        {/* Status Messages */}
        {error && (
          <div className="bg-red-950 border border-red-800 rounded-lg p-3 text-red-400 font-mono text-sm">
            ❌ {error}
          </div>
        )}

        {roastText && (
          <div className="bg-zinc-900 border border-red-900 rounded-lg p-4 text-red-400 font-mono text-sm italic">
            {roastText}
          </div>
        )}

        {/* Hidden audio player */}
        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      </div>

      {/* RIGHT: AI Avatar area */}
      <div className="w-1/2 border-l border-zinc-900 flex">
        <AIAvatar state={currentStatus} auraScore={auraScore} />
      </div>
    </div>
  );
};

export default App;