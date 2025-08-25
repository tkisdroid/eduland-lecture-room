import { useState } from "react";
import { Play, SkipBack, SkipForward, Settings } from "lucide-react";

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
  
  // Custom video controls
  const handlePlayPause = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      // Send postMessage to control YouTube player
      iframe.contentWindow?.postMessage(
        '{"event":"command","func":"' + (isPlaying ? 'pauseVideo' : 'playVideo') + '","args":""}',
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipBack = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        '{"event":"command","func":"seekTo","args":[' + Math.max(0, 15 * 30 - 10) + ', true]}',
        '*'
      );
    }
  };

  const handleSkipForward = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        '{"event":"command","func":"seekTo","args":[' + (15 * 30 + 10) + ', true]}',
        '*'
      );
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        '{"event":"command","func":"setPlaybackRate","args":[' + rate + ']}',
        '*'
      );
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
        <iframe 
          src={getEmbedUrl(videoUrl)}
          title={title}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        
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
              <Play className="w-5 h-5" />
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