import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  progress: number;
}

export const VideoPlayer = ({ videoUrl, title, progress }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("15:30");
  const [totalTime, setTotalTime] = useState("36:30");
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef<any>(null);
  
  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      const videoId = videoUrl.split('/').pop() || videoUrl.split('v=')[1]?.split('&')[0];
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        videoId: videoId,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    };
  }, [videoUrl]);

  const onPlayerReady = (event: any) => {
    // Player is ready
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === (window as any).YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };
  
  // Custom video controls
  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleSkipBack = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(0, currentTime - 10), true);
    }
  };

  const handleSkipForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10, true);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
    }
  };
  
  // Convert YouTube URL to embed format with branding hidden
  const getEmbedUrl = (url: string) => {
    const videoId = url.split('/').pop() || url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1&autoplay=0&cc_load_policy=0&fs=1&hl=ko&end&loop=0&enablejsapi=1`;
  };

  return (
    <div className="space-y-4">
      {/* Video Player Container */}
      <div className="player-wrap aspect-video bg-black rounded-lg">
        <div id="youtube-player" className="w-full h-full rounded-lg"></div>
        
        {/* YouTube branding masks - completely opaque */}
        <div className="yt-mask top" aria-hidden="true"></div>
        <div className="yt-mask bottom" aria-hidden="true"></div>
      </div>

      {/* Custom Control Bar */}
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
            <span className="text-sm text-muted-foreground">
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
    </div>
  );
};