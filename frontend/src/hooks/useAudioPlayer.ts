// hooks/useAudioPlayer.ts
import { useRef, useCallback, useEffect } from 'react';
import { processIncomingPCM } from '../utils/audioUtils';

export interface AudioPlayer {
  playChunk: (base64PCM: string) => void;
  stop: () => void;
  init: () => void;
  cleanup: () => void;
}

export function useAudioPlayer(): AudioPlayer {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  const init = useCallback(() => {
    if (isInitializedRef.current) {
      return;
    }

    console.log('[Speaker] Initializing AudioContext...');

    // Create AudioContext for playback (24kHz sample rate to match PCM)
    const audioContext = new AudioContext({ sampleRate: 24000 });
    audioContextRef.current = audioContext;
    nextStartTimeRef.current = audioContext.currentTime;
    isInitializedRef.current = true;

    console.log('[Speaker] AudioContext initialized at', audioContext.sampleRate, 'Hz');
  }, []);

  const playChunk = useCallback((base64PCM: string) => {
    const audioContext = audioContextRef.current;

    if (!audioContext) {
      console.warn('[Speaker] AudioContext not initialized');
      return;
    }

    try {
      // Decode base64 PCM to Float32
      const float32Data = processIncomingPCM(base64PCM);

      // Create an AudioBuffer
      const audioBuffer = audioContext.createBuffer(
        1, // Mono
        float32Data.length,
        24000 // 24kHz sample rate
      );

      // Copy Float32 data to the buffer
      audioBuffer.copyToChannel(float32Data as unknown as Float32Array<ArrayBuffer>, 0);

      // Create a buffer source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      // Calculate when to start playback
      const currentTime = audioContext.currentTime;

      // If we've fallen behind (buffer underrun), reset to current time
      if (nextStartTimeRef.current < currentTime) {
        console.warn('[Speaker] Buffer underrun detected, resetting timeline');
        nextStartTimeRef.current = currentTime;
      }

      // Schedule playback
      source.start(nextStartTimeRef.current);

      // Update next start time (current start + buffer duration)
      const bufferDuration = audioBuffer.duration;
      nextStartTimeRef.current += bufferDuration;

      // console.log('[Speaker] Scheduled chunk:', bufferDuration.toFixed(3), 's');
    } catch (err) {
      console.error('[Speaker] Error playing audio chunk:', err);
    }
  }, []);

  const stop = useCallback(() => {
    console.log('[Speaker] Stopping playback...');

    if (audioContextRef.current) {
      // Reset timeline
      nextStartTimeRef.current = audioContextRef.current.currentTime;
    }
  }, []);

  const cleanup = useCallback(() => {
    console.log('[Speaker] Cleaning up AudioContext...');

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      nextStartTimeRef.current = 0;
      isInitializedRef.current = false;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    playChunk,
    stop,
    init,
    cleanup,
  };
}
