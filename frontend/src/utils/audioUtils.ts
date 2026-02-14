// utils/audioUtils.ts
// Audio conversion utilities for 16kHz PCM16 Mono format

/**
 * Downsample Float32Array audio data from source sample rate to 16kHz
 */
export function downsampleTo16kHz(buffer: Float32Array, sourceSampleRate: number): Float32Array {
  if (sourceSampleRate === 16000) {
    return buffer;
  }

  const ratio = sourceSampleRate / 16000;
  const outputLength = Math.floor(buffer.length / ratio);
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i++) {
    const sourceIndex = Math.floor(i * ratio);
    output[i] = buffer[sourceIndex];
  }

  return output;
}

/**
 * Convert Float32 audio samples (-1.0 to 1.0) to Int16 PCM (-32768 to 32767)
 */
export function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);

  for (let i = 0; i < float32Array.length; i++) {
    // Clamp value between -1 and 1
    const clamped = Math.max(-1, Math.min(1, float32Array[i]));
    // Convert to 16-bit integer range
    int16Array[i] = clamped < 0 ? clamped * 32768 : clamped * 32767;
  }

  return int16Array;
}

/**
 * Convert Int16Array to base64 string
 */
export function int16ToBase64(int16Array: Int16Array): string {
  const bytes = new Uint8Array(int16Array.buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Int16Array
 */
export function base64ToInt16(base64: string): Int16Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer);
}

/**
 * Convert Int16 PCM to Float32 for AudioContext playback
 */
export function int16ToFloat32(int16Array: Int16Array): Float32Array {
  const float32Array = new Float32Array(int16Array.length);

  for (let i = 0; i < int16Array.length; i++) {
    // Convert from 16-bit integer range to -1.0 to 1.0
    float32Array[i] = int16Array[i] < 0
      ? int16Array[i] / 32768
      : int16Array[i] / 32767;
  }

  return float32Array;
}

/**
 * Process raw microphone audio: downsample to 16kHz, convert to Int16, and base64 encode
 */
export function processMicrophoneChunk(
  float32Data: Float32Array,
  sourceSampleRate: number
): string {
  // Step 1: Downsample to 16kHz
  const downsampled = downsampleTo16kHz(float32Data, sourceSampleRate);

  // Step 2: Convert Float32 to Int16
  const int16PCM = float32ToInt16(downsampled);

  // Step 3: Encode to base64
  return int16ToBase64(int16PCM);
}

/**
 * Process incoming PCM audio for playback: decode base64, convert to Float32
 */
export function processIncomingPCM(base64PCM: string): Float32Array {
  // Step 1: Decode base64 to Int16
  const int16PCM = base64ToInt16(base64PCM);

  // Step 2: Convert Int16 to Float32
  return int16ToFloat32(int16PCM);
}
