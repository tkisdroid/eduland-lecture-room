import { useEffect, useMemo, useRef, useState } from "react";
import Plyr from "plyr";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  progress: number;
  compact?: boolean;
}

export const VideoPlayer = ({ videoUrl, title, progress, compact = false }: VideoPlayerProps) => {
  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'dQw4w9WgXcQ'; // fallback to a working video ID
  };

  const videoId = useMemo(() => getVideoId(videoUrl), [videoUrl]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!playerRef.current) {
      playerRef.current = new Plyr(containerRef.current, {
        autoplay: false,
        ratio: '16:9',
        // Keep controls simple; Plyr colors are themed via --plyr-color-main
        controls: [
          'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'
        ],
        youtube: { rel: 0, modestbranding: 1, iv_load_policy: 3, playsinline: 1 },
      });

      playerRef.current.on('timeupdate', () => {
        setCurrentSec(playerRef.current?.currentTime || 0);
        setDurationSec(playerRef.current?.duration || 0);
      });
      playerRef.current.on('loadedmetadata', () => {
        setDurationSec(playerRef.current?.duration || 0);
      });
    }

    // Always update source when URL changes
    if (playerRef.current) {
      playerRef.current.source = {
        type: 'video',
        sources: [{ src: videoId, provider: 'youtube' }],
      } as any;
    }

    return () => {
      // keep instance alive for performance; destroyed on unmount of page
    };
  }, [videoId]);

  const formatTime = (s: number) => {
    if (!Number.isFinite(s)) return '00:00';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const pad = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
  };

  return (
    <div className="space-y-4">
      {/* Video Player Container */}
      <div className="player-wrap aspect-video bg-black rounded-lg overflow-hidden">
        <div
          ref={containerRef}
          data-plyr-provider="youtube"
          data-plyr-embed-id={videoId}
          aria-label={title}
        />
      </div>

      {/* Meta & Progress - Hide in compact mode */}
      {!compact && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="player-meta sm:text-sm">
            <span className="text-muted-foreground">{formatTime(currentSec)} / {formatTime(durationSec)}</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-muted-foreground">진도율 {progress}%</span>
              <span className="chip-meta">이어보기 가능</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};