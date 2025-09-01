import { useState, useEffect, useRef } from "react";
import { Play, Pause, Rewind, FastForward, Settings } from "lucide-react";
import { uiLabels, defaultValues } from "@/data/uiLabels";
import { useVideoProgress } from "@/hooks/useVideoProgress";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  progress: number;
  compact?: boolean;
  memberId?: string;
  lectureId?: string;
}

// YouTube Player interface
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoPlayer = ({ videoUrl, title, progress, compact = false, memberId, lectureId }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [isMinimized, setIsMinimized] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 진도 추적 훅 (memberId와 lectureId가 있을 때만 사용)
  const progressTracker = useVideoProgress({
    memberId: memberId || "",
    lectureId: lectureId || "",
    videoDuration
  });
  
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : defaultValues.video.fallbackVideoId;
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
  }, [videoId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (memberId && lectureId) {
        progressTracker.stopProgressTracking();
      }
    };
  }, [memberId, lectureId, progressTracker]);

  // Keyboard controls (spacebar for play/pause)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  // Touch and mouse controls
  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    if (!videoContainer) return;

    const handleTouch = (event: TouchEvent) => {
      event.preventDefault();
      handlePlayPause();
    };

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      handlePlayPause();
    };

    videoContainer.addEventListener('touchstart', handleTouch);
    videoContainer.addEventListener('click', handleClick);
    
    return () => {
      videoContainer.removeEventListener('touchstart', handleTouch);
      videoContainer.removeEventListener('click', handleClick);
    };
  }, [isPlaying]);

  // Intersection Observer for mobile scroll minimization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Only enable on mobile devices
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const videoContainer = videoContainerRef.current;
    if (!videoContainer) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When video is less than 30% visible, minimize it
          if (entry.intersectionRatio < 0.3) {
            setIsMinimized(true);
          } else {
            setIsMinimized(false);
          }
        });
      },
      {
        threshold: [0, 0.3, 0.5, 1]
      }
    );

    observerRef.current.observe(videoContainer);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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
          setVideoDuration(duration);
          
          // 저장된 진도가 있으면 해당 위치로 이동
          if (memberId && lectureId) {
            const savedProgress = progressTracker.getSavedProgress();
            if (savedProgress.lastWatchedTime > 0) {
              event.target.seekTo(savedProgress.lastWatchedTime);
              console.log(`Resumed at ${savedProgress.lastWatchedTime}s (${savedProgress.progress}%)`);
            }
          }
          
          // Start time update interval
          intervalRef.current = setInterval(() => {
            if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
              const current = playerRef.current.getCurrentTime();
              const total = playerRef.current.getDuration();
              setCurrentTime(formatTime(current));
              const progressPercent = Math.round((current / total) * 100);
              setCurrentProgress(progressPercent);
            }
          }, 1000);

          // 진도 추적 시작
          if (memberId && lectureId) {
            progressTracker.startProgressTracking(() => {
              return playerRef.current?.getCurrentTime() || 0;
            });
          }
        },
        onStateChange: (event: any) => {
          const wasPlaying = isPlaying;
          const nowPlaying = event.data === window.YT.PlayerState.PLAYING;
          
          setIsPlaying(nowPlaying);
          
          // 일시정지 시 진도 저장
          if (wasPlaying && !nowPlaying && memberId && lectureId) {
            const currentTime = playerRef.current?.getCurrentTime() || 0;
            progressTracker.onVideoPause(currentTime);
          }
          
          // 비디오 종료 시 처리
          if (event.data === window.YT.PlayerState.ENDED && memberId && lectureId) {
            const finalTime = playerRef.current?.getDuration() || 0;
            progressTracker.onVideoEnd(finalTime);
          }
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

  // Skip backward 10 seconds
  const handleSkipBack = () => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(Math.max(0, currentTime - 10));
  };

  // Skip forward 10 seconds  
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
    
    // Ensure click position is within bounds
    const clampedX = Math.max(0, Math.min(clickX, progressBarWidth));
    const clickPercent = (clampedX / progressBarWidth) * 100;
    
    const duration = playerRef.current.getDuration();
    if (duration && duration > 0) {
      const seekTime = (clickPercent / 100) * duration;
      playerRef.current.seekTo(seekTime, true); // true for allowSeekAhead
      setCurrentProgress(Math.round(clickPercent)); // Round to remove decimals
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Player Container */}
      <div 
        ref={videoContainerRef}
        className={`yt-wrapper bg-black rounded-lg overflow-hidden cursor-pointer select-none transition-all duration-300 ease-in-out ${
          isMinimized 
            ? 'fixed top-4 right-4 w-48 h-28 z-50 shadow-2xl md:relative md:w-full md:h-auto md:shadow-none md:top-auto md:right-auto'
            : 'relative w-full'
        }`}
      >
        <div className="yt-frame-container">
          <div id="youtube-player"></div>
        </div>
        
        {/* Minimize/Maximize button - only visible when minimized on mobile */}
        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="absolute top-1 left-1 bg-black/50 text-white rounded p-1 hover:bg-black/70 transition-colors md:hidden"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Custom Control Bar - Hide in compact mode or when minimized */}
      {!compact && !isMinimized && (
        <div className="bg-card border border-border rounded-lg p-2 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
              <button 
                className="p-1.5 sm:p-2 hover:bg-accent/10 text-accent-secondary rounded-lg transition-colors"
                onClick={handleSkipBack}
              >
                <Rewind className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <option value={1}>{uiLabels.videoPlayer.playback.standard}</option>
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
              <span className="text-xs text-muted-foreground">{uiLabels.videoPlayer.playback.progress} {currentProgress}%</span>
              <span className="chip-meta">{uiLabels.videoPlayer.playback.continuousWatchingAvailable}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};