import { useEffect, useRef, useCallback } from 'react';
import { useUserProgress } from './useUserProgress';

interface UseVideoProgressProps {
  memberId: string;
  lectureId: string;
  videoDuration?: number;
}

export const useVideoProgress = ({ memberId, lectureId, videoDuration = 0 }: UseVideoProgressProps) => {
  const { updateProgress, getLectureProgress } = useUserProgress(memberId);
  const lastUpdateTime = useRef<number>(0);
  const updateInterval = useRef<NodeJS.Timeout | null>(null);

  // 10초마다 진도율 업데이트
  const startProgressTracking = useCallback((getCurrentTime: () => number) => {
    // 기존 인터벌 정리
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }

    updateInterval.current = setInterval(() => {
      const currentTime = getCurrentTime();
      const progress = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;
      
      // 최소 5초 이상 시청했을 때만 업데이트 (너무 빈번한 업데이트 방지)
      if (currentTime > lastUpdateTime.current + 5) {
        updateProgress(lectureId, progress, currentTime);
        lastUpdateTime.current = currentTime;
        console.log(`Progress updated: ${progress.toFixed(1)}% at ${currentTime}s`);
      }
    }, 10000); // 10초마다 실행
  }, [lectureId, videoDuration, updateProgress]);

  const stopProgressTracking = useCallback(() => {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
  }, []);

  // 비디오 종료 시 최종 진도율 업데이트
  const onVideoEnd = useCallback((finalTime: number) => {
    const progress = videoDuration > 0 ? (finalTime / videoDuration) * 100 : 100;
    updateProgress(lectureId, Math.min(100, progress), finalTime);
    stopProgressTracking();
  }, [lectureId, videoDuration, updateProgress, stopProgressTracking]);

  // 비디오 일시정지 시 현재 진도율 저장
  const onVideoPause = useCallback((currentTime: number) => {
    const progress = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;
    updateProgress(lectureId, progress, currentTime);
  }, [lectureId, videoDuration, updateProgress]);

  // 저장된 진도 위치 가져오기
  const getSavedProgress = useCallback(() => {
    const savedProgress = getLectureProgress(lectureId);
    return {
      progress: savedProgress?.progress || 0,
      lastWatchedTime: savedProgress?.lastWatchedTime || 0
    };
  }, [lectureId, getLectureProgress]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopProgressTracking();
    };
  }, [stopProgressTracking]);

  return {
    startProgressTracking,
    stopProgressTracking,
    onVideoEnd,
    onVideoPause,
    getSavedProgress
  };
};