import { useState, useEffect, useRef } from "react";
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
  const [currentTime, setCurrentTime] = useState("15:30");
  const [totalTime, setTotalTime] = useState("36:30");
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'dQw4w9WgXcQ'; // fallback to a working video ID
  };

  const videoId = getVideoId(videoUrl);

  useEffect(() => {
    if (videoRef.current) {
      // Initialize Plyr with custom colors
      playerRef.current = new Plyr(videoRef.current, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'fullscreen'],
        settings: ['quality', 'speed'],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        youtube: { noCookie: false, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
        ratio: '16:9'
      });

      // Apply custom styling
      const style = document.createElement('style');
      style.textContent = `
        .plyr--video {
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .plyr__control--overlaid,
        .plyr__control[data-plyr="play"],
        .plyr__control[data-plyr="pause"] {
          background: #F59B1B !important;
        }
        .plyr__control:hover {
          background: #e08914 !important;
        }
        .plyr__progress__played {
          background-color: #F59B1B !important;
        }
        .plyr__volume--display {
          background: #F59B1B !important;
        }
        .plyr__menu__container .plyr__control[role="menuitemradio"][aria-checked="true"]::before {
          background: #F59B1B !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
        document.head.removeChild(style);
      };
    }
  }, [videoId]);

  // Basic control handlers (for display purposes)
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    console.log("Skip back 10 seconds");
  };

  const handleSkipForward = () => {
    console.log("Skip forward 10 seconds");
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    console.log("Playback rate changed to:", rate);
  };

  return (
    <div className="space-y-4">
      {/* Video Player Container */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <div
          ref={videoRef}
          data-plyr-provider="youtube"
          data-plyr-embed-id={videoId}
          className="w-full h-full"
        />
      </div>

      {/* Custom Control Bar - Hide in compact mode */}
      {!compact && (
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={handleSkipBack}
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={handleSkipForward}
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                {currentTime} / {totalTime}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Playback Rate */}
              <select 
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                className="text-xs sm:text-sm bg-muted border border-border rounded px-1.5 py-0.5 sm:px-2 sm:py-1 cursor-pointer"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>표준</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <button className="p-2 hover:bg-muted rounded-lg">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
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