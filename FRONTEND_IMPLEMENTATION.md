# Frontend Implementation Summary

## 🎯 What Was Built

The frontend has been fully integrated with the backend to create a complete AI code roasting application.

---

## 📁 Files Created/Modified

### ✅ **New Files Created:**

#### 1. `frontend/src/components/AudioRecorder.tsx`
```typescript
import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob | null) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        setRecordedBlob(blob);
        onAudioRecorded(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Could not access microphone. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const clearRecording = () => {
    setRecordedBlob(null);
    onAudioRecorded(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
        Voice Explanation
        <span className="ml-2 text-[10px] bg-zinc-800 px-2 py-1 rounded">Optional</span>
      </label>

      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={recordedBlob ? clearRecording : startRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-all ${
              recordedBlob
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'
                : 'bg-zinc-900 text-red-500 hover:bg-zinc-800 border border-red-900'
            }`}
          >
            <Mic size={16} />
            {recordedBlob ? 'Record Again' : 'Hold to Record'}
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm bg-red-600 text-white hover:bg-red-700 transition-all animate-pulse"
          >
            <Square size={16} />
            Stop Recording
          </button>
        )}

        <span className="text-xs font-mono text-zinc-500">
          {isRecording && '🔴 Recording...'}
          {!isRecording && recordedBlob && `✅ Recorded ${(recordedBlob.size / 1024).toFixed(1)}KB`}
          {!isRecording && !recordedBlob && 'No audio recorded'}
        </span>
      </div>
    </div>
  );
};

export default AudioRecorder;
```

#### 2. `backend/elevenlabs.js`
```javascript
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

/**
 * Convert roast text to speech audio using ElevenLabs REST API directly.
 * @param {string} text - The roast text from Gemini
 * @returns {Promise<Buffer>} MP3 audio buffer
 */
async function textToSpeech(text) {
    if (!ELEVENLABS_API_KEY) {
        throw new Error("ELEVENLABS_API_KEY is not set in .env");
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            model_id: "eleven_flash_v2_5",
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ElevenLabs API error (${response.status}): ${errorBody}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

module.exports = { textToSpeech };
```

---

### ✅ **Modified Files:**

#### 3. `frontend/vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

#### 4. `frontend/src/App.tsx`
```typescript
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
      const formData = new FormData();
      formData.append('language', 'python');
      formData.append('code', code);

      if (audioBlob) {
        const ext = audioBlob.type.includes('webm') ? '.webm'
                  : audioBlob.type.includes('mp4') ? '.mp4'
                  : audioBlob.type.includes('ogg') ? '.ogg'
                  : '.wav';
        formData.append('audio', audioBlob, `explanation${ext}`);
      }

      console.log('📤 Sending request to backend...');

      const response = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Backend error');
      }

      const roastTextFromHeader = response.headers.get('X-Roast-Text');
      if (roastTextFromHeader) {
        setRoastText(decodeURIComponent(roastTextFromHeader));
      }

      const responseAudioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(responseAudioBlob);

      if (audioRef.current && responseAudioBlob.size > 1000) {
        audioRef.current.src = audioUrl;
        console.log('🎵 Playing roast audio...');
        audioRef.current.play().catch(err => {
          console.error('Audio playback error:', err);
          setTimeout(() => setCurrentStatus('idle'), 2000);
        });
        setCurrentStatus('glitch_out');
      } else {
        console.warn('⚠️ Audio blob too small or invalid:', responseAudioBlob.size, 'bytes');
        setCurrentStatus('idle');
      }

      setTimeout(() => {
        if (currentStatus === 'glitch_out') {
          console.log('⏰ Audio timeout - resetting state');
          setCurrentStatus('idle');
        }
      }, 30000);
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

        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      </div>

      <div className="w-1/2 border-l border-zinc-900 flex">
        <AIAvatar state={currentStatus} auraScore={auraScore} />
      </div>
    </div>
  );
};

export default App;
```

#### 5. `frontend/src/components/CodeEditor.tsx`
```typescript
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  onTyping: () => void;
  setCode: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onTyping, setCode }) => {

  const handleEditorChange = (value: string | undefined) => {
    setCode(value);
    onTyping();
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
      <Editor
        height="100%"
        defaultLanguage="python"
        defaultValue=""
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          roundedSelection: true,
          padding: { top: 20 },
          fontFamily: "'JetBrains Mono', monospace",
        }}
      />
    </div>
  );
};

export default CodeEditor;
```

#### 6. `frontend/src/App.css`
```css
/* App.css - Custom styles for Brainrot Interviewer */

/* Remove default Vite styles that interfere with full-screen layout */
```

#### 7. `backend/server.js` (updated imports and endpoint)
```javascript
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const { generateRoast } = require("./gemini");
const { textToSpeech } = require("./elevenlabs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/api/health", (req, res) => {
  res.json({ status: "alive", message: "The interviewer is ready to roast." });
});

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "test.html"));
});

app.post("/api/roast", upload.single("audio"), async (req, res) => {
  const { language, code } = req.body;
  const audioFile = req.file;

  if (!code) {
    return res.status(400).json({ error: "No code submitted. Too scared to even try?" });
  }

  console.log("--- Roast Request Received ---");
  console.log(`Language: ${language || "not specified"}`);
  console.log(`Code length: ${code.length} chars`);
  console.log(`Audio: ${audioFile ? `${audioFile.size} bytes` : "none"}`);

  try {
    const roast = await generateRoast(code, language, audioFile?.buffer, audioFile?.mimetype);
    console.log(`Roast generated (${roast.length} chars): ${roast.substring(0, 100)}...`);

    console.log("Converting roast to speech via ElevenLabs...");
    const audioBuffer = await textToSpeech(roast);
    console.log(`Audio buffer received: ${audioBuffer.length} bytes`);

    if (audioBuffer.length < 1000) {
      console.warn("WARNING: Audio buffer suspiciously small, may not be valid audio");
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
      "X-Roast-Text": encodeURIComponent(roast),
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error("Pipeline error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "The interviewer had a meltdown. Try again.", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Brainrot Interviewer backend running on http://localhost:${PORT}`);
});
```

#### 8. `backend/.env`
```
GEMINI_API_KEY=AIzaSyCmxQGco-KO8ghbAY3xhcBiXbk6JWyj3Ac
ELEVENLABS_API_KEY=sk_45f4af8bb956eab19519e695bf60fe34dcb28956d1fc81d6
PORT=3001
```

---

## 🎯 Key Features Implemented

1. ✅ **Audio Recording** - MediaRecorder API integration
2. ✅ **Backend Integration** - FormData POST to `/api/roast`
3. ✅ **Audio Playback** - Auto-play roast audio
4. ✅ **State Management** - Loading, error, success states
5. ✅ **Vite Proxy** - Routes `/api/*` to port 3001
6. ✅ **ElevenLabs TTS** - Text-to-speech conversion
7. ✅ **Error Handling** - Comprehensive error messages

---

## 🚀 How to Run

**Backend:**
```bash
cd C:\gradientDescent\backend
npm run dev
```

**Frontend:**
```bash
cd C:\gradientDescent\frontend
npm run dev
```

**Visit:** http://localhost:5173

---

## ✨ Complete Flow

1. User types code in Monaco editor
2. (Optional) User records audio explanation
3. User clicks "SUBMIT FOR REVIEW"
4. Frontend sends FormData to `/api/roast`
5. Backend: Gemini generates roast text
6. Backend: ElevenLabs converts to MP3
7. Frontend: Displays roast text
8. Frontend: Plays audio automatically
9. Avatar animates through states

---

**Status: FULLY FUNCTIONAL** ✅
