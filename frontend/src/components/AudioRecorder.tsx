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
        // Stop all tracks to turn off mic indicator
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
