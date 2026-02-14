// components/LiveAudioRecorder.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { processMicrophoneChunk } from '../utils/audioUtils';

interface LiveAudioRecorderProps {
  onAudioChunk: (base64PCM: string) => void;
  isRecording: boolean;
}

const LiveAudioRecorder: React.FC<LiveAudioRecorderProps> = ({ onAudioChunk, isRecording }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const startRecording = useCallback(async () => {
    try {
      console.log('[Mic] Requesting microphone access...');

      // Request microphone with echo cancellation
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000, // Browser default, we'll downsample
        },
      });

      streamRef.current = stream;
      setHasPermission(true);
      setError(null);

      // Create AudioContext
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Use ScriptProcessorNode for audio processing
      // Buffer size: 4096 samples = ~85ms at 48kHz (good balance)
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0); // Mono channel
        const sampleRate = audioContext.sampleRate;

        // Process: downsample to 16kHz, convert to Int16, encode to base64
        const base64PCM = processMicrophoneChunk(inputData, sampleRate);

        // Send to WebSocket
        onAudioChunk(base64PCM);
      };

      // Connect: source → processor → destination
      source.connect(processor);
      processor.connect(audioContext.destination);

      console.log('[Mic] Recording started at', audioContext.sampleRate, 'Hz');
    } catch (err) {
      console.error('[Mic] Error accessing microphone:', err);
      setError('Microphone access denied. Please allow microphone permissions.');
      setHasPermission(false);
    }
  }, [onAudioChunk]);

  const stopRecording = useCallback(() => {
    console.log('[Mic] Stopping recording...');

    // Disconnect and cleanup
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    console.log('[Mic] Recording stopped');
  }, []);

  // Effect to handle isRecording changes
  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    // Cleanup on unmount
    return () => {
      stopRecording();
    };
  }, [isRecording, startRecording, stopRecording]);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full transition-all ${
          isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'
        }`}
      />
      <span className="text-zinc-400 font-mono text-sm">
        {isRecording ? 'Recording...' : hasPermission ? 'Ready' : 'Microphone Inactive'}
      </span>
      {error && (
        <span className="text-red-500 font-mono text-xs ml-2">{error}</span>
      )}
    </div>
  );
};

export default LiveAudioRecorder;
