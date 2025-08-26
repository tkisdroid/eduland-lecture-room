import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  progress: number;
  compact?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export const VideoPlayer = ({ videoUrl, title, progress, compact = false, onFullscreenChange }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("15:30");
  const [totalTime, setTotalTime] = useState("36:30");
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'dQw4w9WgXcQ'; // fallback to a working video ID
  };

  const videoId = getVideoId(videoUrl);
  
  // Convert YouTube URL to embed format
  const getEmbedUrl = () => {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1&autoplay=1&cc_load_policy=0&fs=1&hl=ko`;
  };
  
  useEffect(() => {
    const handleFsChange = () => {
      const doc: any = document as any;
      const fsEl =
        doc.fullscreenElement ||
        (doc as any).webkitFullscreenElement ||
        (doc as any).mozFullScreenElement ||
        (doc as any).msFullscreenElement;
      const isFs = fsEl === iframeRef.current;
      onFullscreenChange?.(!!isFs);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange as any);
    document.addEventListener('mozfullscreenchange', handleFsChange as any);
    document.addEventListener('MSFullscreenChange', handleFsChange as any);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange as any);
      document.removeEventListener('mozfullscreenchange', handleFsChange as any);
      document.removeEventListener('MSFullscreenChange', handleFsChange as any);
      onFullscreenChange?.(false);
    };
  }, [onFullscreenChange]);

  // Basic control handlers (for display purposes)
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    // Skip functionality would require YouTube API integration
    console.log("Skip back 10 seconds");
  };

  const handleSkipForward = () => {
    // Skip functionality would require YouTube API integration
    console.log("Skip forward 10 seconds");
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    // Playback rate change would require YouTube API integration
    console.log("Playback rate changed to:", rate);
  };

  return (
    <div className="space-y-4">
      {/* Video Player Container */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          key={videoId} // Force re-render when video changes
          ref={iframeRef}
          src={getEmbedUrl()}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
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
      )}
    </div>
  );
};