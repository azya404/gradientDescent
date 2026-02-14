// hooks/useLiveSession.ts
import { useRef, useCallback, useEffect } from 'react';

export interface LiveSessionCallbacks {
  onAudioChunk: (base64PCM: string) => void;
  onTranscript: (text: string) => void;
  onInputTranscript?: (text: string) => void;
  onInterrupted?: () => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export interface LiveSession {
  connect: (language: string) => void;
  disconnect: () => void;
  sendAudio: (base64PCM: string) => void;
  sendCode: (content: string, language: string) => void;
  isConnected: boolean;
}

export function useLiveSession(callbacks: LiveSessionCallbacks): LiveSession {
  const wsRef = useRef<WebSocket | null>(null);
  const isConnectedRef = useRef(false);

  const connect = useCallback((language: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.warn('[WS] Already connected');
      return;
    }

    // Determine WebSocket URL (use relative path for Vite proxy, or absolute for direct connection)
    const wsUrl = window.location.protocol === 'https:'
      ? `wss://${window.location.host}`
      : 'ws://localhost:3001';

    console.log('[WS] Connecting to:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[WS] Connected');
      isConnectedRef.current = true;

      // Send start message
      ws.send(JSON.stringify({ type: 'start', language }));
      console.log('[WS] Sent start message with language:', language);

      callbacks.onConnected?.();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'audio':
            callbacks.onAudioChunk(msg.data);
            break;

          case 'transcript':
            callbacks.onTranscript(msg.text);
            break;

          case 'input_transcript':
            callbacks.onInputTranscript?.(msg.text);
            break;

          case 'interrupted':
            callbacks.onInterrupted?.();
            break;

          case 'error':
            console.error('[WS] Server error:', msg.message);
            callbacks.onError?.(new Error(msg.message));
            break;

          default:
            console.warn('[WS] Unknown message type:', msg.type);
        }
      } catch (err) {
        console.error('[WS] Failed to parse message:', err);
        callbacks.onError?.(err as Error);
      }
    };

    ws.onerror = (event) => {
      console.error('[WS] Error:', event);
      callbacks.onError?.(new Error('WebSocket connection error'));
    };

    ws.onclose = (event) => {
      console.log('[WS] Disconnected:', event.code, event.reason);
      isConnectedRef.current = false;
      callbacks.onDisconnected?.();
    };
  }, [callbacks]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      console.log('[WS] Sending stop message');
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'stop' }));
      }
      wsRef.current.close();
      wsRef.current = null;
      isConnectedRef.current = false;
    }
  }, []);

  const sendAudio = useCallback((base64PCM: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'audio', data: base64PCM }));
    } else {
      console.warn('[WS] Cannot send audio: not connected');
    }
  }, []);

  const sendCode = useCallback((content: string, language: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'code', content, language }));
      console.log('[WS] Sent code update:', content.length, 'chars');
    } else {
      console.warn('[WS] Cannot send code: not connected');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendAudio,
    sendCode,
    isConnected: isConnectedRef.current,
  };
}
