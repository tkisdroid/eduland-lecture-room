import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { Play, Pause, SkipBack, SkipForward, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  progress: number;
  compact?: boolean;
}

export const VideoPlayer = ({ videoUrl, title, progress, compact = false }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [totalTime, setTotalTime] = useState("00:00");
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const playerRef = useRef<HTMLDivElement | null>(null);
  const plyrRef = useRef<Plyr | null>(null);
  
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'dQw4w9WgXcQ'; // fallback to a working video ID
  };

  const videoId = getVideoId(videoUrl);

  const formatTime = (seconds: number) => {
    const sec = Math.floor(seconds || 0);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  useEffect(() => {
    if (!playerRef.current) return;

    // Destroy previous instance if any (handles re-renders)
    plyrRef.current?.destroy();

    const instance = new Plyr(playerRef.current, {
      controls: [
        'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'
      ],
      ratio: '16:9',
      youtube: {
        noCookie: true,
        rel: 0,
        modestbranding: 1,
        cc_load_policy: 0,
      },
      settings: ['speed', 'quality'],
    });

    plyrRef.current = instance;

    const updateTimes = () => {
      setCurrentTime(formatTime(instance.currentTime || 0));
      setTotalTime(formatTime(instance.duration || 0));
    };

    instance.on('ready', updateTimes);
    instance.on('timeupdate', () => setCurrentTime(formatTime(instance.currentTime || 0)));
    instance.on('loadedmetadata', updateTimes);
    instance.on('loadeddata', updateTimes);
    instance.on('play', () => setIsPlaying(true));
    instance.on('pause', () => setIsPlaying(false));
    instance.on('ratechange', () => setPlaybackRate(instance.speed || 1));

    return () => {
      instance.destroy();
      plyrRef.current = null;
    };
  }, [videoId]);

// Basic control handlers wired to Plyr
const handlePlayPause = () => {
  const p = plyrRef.current;
  if (!p) return;
  p.togglePlay();
};

const handleSkipBack = () => {
  const p = plyrRef.current;
  if (!p) return;
  p.currentTime = Math.max(0, (p.currentTime || 0) - 10);
};

const handleSkipForward = () => {
  const p = plyrRef.current;
  if (!p) return;
  p.currentTime = Math.min(p.duration || 0, (p.currentTime || 0) + 10);
};

const handlePlaybackRateChange = (rate: number) => {
  setPlaybackRate(rate);
  if (plyrRef.current) {
    plyrRef.current.speed = rate;
  }
};

  return (
    <div className="space-y-4">
      {/* Video Player Container */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden" style={{ ["--plyr-color-main" as any]: 'hsl(var(--accent))' }}>
        <div
          ref={playerRef}
          data-plyr-provider="youtube"
          data-plyr-embed-id={videoId}
          className="w-full h-full"
        />
      </div>

      {/* Custom Control Bar - Hide in compact mode */}
      {!compact && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={handleSkipBack}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={handleSkipForward}
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <span className="text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap">
                {currentTime} / {totalTime}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback Rate */}
              <select 
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                className="text-sm bg-muted border border-border rounded px-2 py-1 cursor-pointer"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>표준</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <button className="p-2 hover:bg-muted rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
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