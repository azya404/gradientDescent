// components/WebcamPreview.tsx
import React, { useRef, useEffect, useState } from 'react';

interface WebcamPreviewProps {
    isActive: boolean;
}

const WebcamPreview: React.FC<WebcamPreviewProps> = ({ isActive }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [hasVideo, setHasVideo] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (isActive) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [isActive]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 320 },
                    height: { ideal: 240 },
                    facingMode: 'user',
                },
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setHasVideo(true);
        } catch (err) {
            console.error('[Camera] Error accessing webcam:', err);
            setHasVideo(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setHasVideo(false);
    };

    if (!isActive) return null;

    return (
        <div
            className="absolute bottom-6 left-6 z-40"
            style={{ transition: 'all 0.3s ease' }}
        >
            {/* Minimize / Restore toggle */}
            <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="absolute -top-2 -right-2 z-50 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-400 text-xs flex items-center justify-center hover:bg-zinc-700 hover:text-white transition-all"
                title={isMinimized ? 'Show camera' : 'Hide camera'}
            >
                {isMinimized ? '◻' : '−'}
            </button>

            <div
                className="rounded-xl overflow-hidden border-2 border-purple-500/40 shadow-lg"
                style={{
                    width: isMinimized ? '48px' : '200px',
                    height: isMinimized ? '48px' : '150px',
                    transition: 'width 0.3s ease, height 0.3s ease',
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.15), 0 4px 12px rgba(0,0,0,0.5)',
                    background: '#000',
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                        transform: 'scaleX(-1)', // Mirror for natural feel
                        display: hasVideo ? 'block' : 'none',
                    }}
                />

                {/* Fallback when no video */}
                {!hasVideo && (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-zinc-600 text-xs font-mono">
                            {isMinimized ? '📷' : 'No camera'}
                        </span>
                    </div>
                )}

                {/* Live indicator dot */}
                {hasVideo && !isMinimized && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">
                            Live
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebcamPreview;
