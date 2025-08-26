import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  progress: number;
  compact?: boolean;
}

// YouTube Player interface
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoPlayer = ({ videoUrl, title, progress, compact = false }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'dQw4w9WgXcQ'; // fallback to a working video ID
  };

  const videoId = getVideoId(videoUrl);

  // Format time from seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        color: 'white',
        controls: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        enablejsapi: 1,
        playlist: videoId,
        iv_load_policy: 3,
        cc_load_policy: 0,
        fs: 1,
        disablekb: 1
      },
      events: {
        onReady: (event: any) => {
          const duration = event.target.getDuration();
          setTotalTime(formatTime(duration));
          
          // Start time update interval
          intervalRef.current = setInterval(() => {
            if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
              const current = playerRef.current.getCurrentTime();
              const total = playerRef.current.getDuration();
              setCurrentTime(formatTime(current));
              setCurrentProgress(Math.round((current / total) * 100));
            }
          }, 1000);
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        }
      }
    });
  };

  // Control handlers with YouTube API integration
  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSkipBack = () => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    const duration = playerRef.current.getDuration();
    playerRef.current.seekTo(Math.min(duration, currentTime + 10));
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
    }
  };

  // Progress bar click handler
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickPercent = (clickX / progressBarWidth) * 100;
    
    const duration = playerRef.current.getDuration();
    const seekTime = (clickPercent / 100) * duration;
    
    playerRef.current.seekTo(seekTime);
  };

  return (
    <div className="space-y-4">
      {/* Video Player Container */}
      <div className="yt-wrapper bg-black rounded-lg overflow-hidden">
        <div className="yt-frame-container">
          <div id="youtube-player"></div>
        </div>
      </div>

      {/* Custom Control Bar - Hide in compact mode */}
      {!compact && (
        <div className="bg-card border border-border rounded-lg p-2 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
              <button 
                className="p-1.5 sm:p-2 hover:bg-accent/10 text-accent-secondary rounded-lg transition-colors"
                onClick={handleSkipBack}
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                className="p-1.5 sm:p-2 hover:bg-accent/10 text-accent rounded-lg transition-colors"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button 
                className="p-1.5 sm:p-2 hover:bg-accent/10 text-accent-secondary rounded-lg transition-colors"
                onClick={handleSkipForward}
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                {currentTime} / {totalTime}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              {/* Playback Rate */}
              <select 
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                className="text-xs sm:text-sm bg-muted border border-border rounded px-1.5 sm:px-2 py-1 cursor-pointer"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>표준</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <button className="p-1.5 sm:p-2 hover:bg-accent/10 text-accent-secondary rounded-lg transition-colors">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div 
              className="progress-bar cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={handleProgressClick}
            >
              <div 
                className="progress-fill" 
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-muted-foreground">진도율 {currentProgress}%</span>
              <span className="chip-meta">이어보기 가능</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};