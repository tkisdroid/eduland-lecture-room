import { useState, useEffect, useCallback } from 'react';

// 임시 타입 정의 (나중에 백엔드 API 타입으로 교체)
interface UserProgress {
  memberId: string;
  lectureId: string;
  progress: number; // 0-100%
  lastWatchedTime: number; // seconds
  updatedAt: string;
}

interface LastWatchedLecture {
  memberId: string;
  lectureId: string;
  watchedAt: string;
}

// 임시 로컬 스토리지 기반 구현 (나중에 백엔드 API로 교체)
const PROGRESS_STORAGE_KEY = 'user_lecture_progress';
const LAST_WATCHED_STORAGE_KEY = 'last_watched_lecture';

export const useUserProgress = (memberId: string) => {
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [lastWatchedLecture, setLastWatchedLecture] = useState<LastWatchedLecture | null>(null);

  // 로컬 스토리지에서 진도 데이터 로드
  useEffect(() => {
    const loadProgressData = () => {
      try {
        const stored = localStorage.getItem(`${PROGRESS_STORAGE_KEY}_${memberId}`);
        if (stored) {
          setProgressData(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load progress data:', error);
      }
    };

    const loadLastWatchedLecture = () => {
      try {
        const stored = localStorage.getItem(`${LAST_WATCHED_STORAGE_KEY}_${memberId}`);
        if (stored) {
          setLastWatchedLecture(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load last watched lecture:', error);
      }
    };

    if (memberId) {
      loadProgressData();
      loadLastWatchedLecture();
    }
  }, [memberId]);

  // 진도율 업데이트 (백엔드 API 호출로 교체 예정)
  const updateProgress = useCallback(async (lectureId: string, progress: number, currentTime: number) => {
    if (!memberId) return;

    const progressEntry: UserProgress = {
      memberId,
      lectureId,
      progress: Math.min(100, Math.max(0, progress)),
      lastWatchedTime: currentTime,
      updatedAt: new Date().toISOString()
    };

    // 로컬 상태 업데이트
    setProgressData(prev => ({
      ...prev,
      [lectureId]: progressEntry
    }));

    // 마지막 시청 강의 업데이트
    const lastWatched: LastWatchedLecture = {
      memberId,
      lectureId,
      watchedAt: new Date().toISOString()
    };
    setLastWatchedLecture(lastWatched);

    try {
      // 로컬 스토리지에 저장 (임시)
      localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${memberId}`, JSON.stringify({
        ...progressData,
        [lectureId]: progressEntry
      }));
      localStorage.setItem(`${LAST_WATCHED_STORAGE_KEY}_${memberId}`, JSON.stringify(lastWatched));

      // TODO: 백엔드 API 호출
      // await fetch('/api/user-progress', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(progressEntry)
      // });
      
      console.log('Progress updated:', progressEntry);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }, [memberId, progressData]);

  // 특정 강의의 진도율 가져오기
  const getLectureProgress = useCallback((lectureId: string): UserProgress | null => {
    return progressData[lectureId] || null;
  }, [progressData]);

  // 마지막 시청 강의 ID 가져오기
  const getLastWatchedLectureId = useCallback((): string | null => {
    return lastWatchedLecture?.lectureId || null;
  }, [lastWatchedLecture]);

  // 모든 진도 데이터 가져오기 (대시보드용)
  const getAllProgress = useCallback((): UserProgress[] => {
    return Object.values(progressData);
  }, [progressData]);

  return {
    updateProgress,
    getLectureProgress,
    getLastWatchedLectureId,
    getAllProgress,
    progressData,
    lastWatchedLecture
  };
};