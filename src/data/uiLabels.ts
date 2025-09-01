// UI 라벨 및 텍스트 데이터
// TODO for Backend Developer: 다국어 지원 시 이 데이터를 DB나 i18n 시스템으로 변경 필요

export interface UILabels {
  // 사이드바 관련
  sidebar: {
    myClassroom: string;
    primarySubjects: string;
    secondarySubjects: string;
    lecturesInPreparation: string;
  };
  
  // 비디오 플레이어 관련
  videoPlayer: {
    playback: {
      standard: string;
      continueWatching: string;
      play: string;
      progress: string;
      continuousWatchingAvailable: string;
    };
  };
  
  // 강의 카드 관련
  courseCard: {
    badges: {
      new: string;
      popular: string;
    };
    duration: {
      total: string;
      students: string;
    };
  };
  
  // 푸터
  footer: {
    placeholder: string;
  };
  
  // 일반적인 액션
  actions: {
    reset: string;
    submit: string;
  };
}

export const uiLabels: UILabels = {
  sidebar: {
    myClassroom: "나의 강의실",
    primarySubjects: "1차 시험과목", 
    secondarySubjects: "2차 시험과목",
    lecturesInPreparation: "강의가 준비 중입니다.",
  },
  
  videoPlayer: {
    playback: {
      standard: "표준",
      continueWatching: "이어보기",
      play: "재생", 
      progress: "진도율",
      continuousWatchingAvailable: "이어보기 가능",
    },
  },
  
  courseCard: {
    badges: {
      new: "신규",
      popular: "인기",
    },
    duration: {
      total: "총",
      students: "명",
    },
  },
  
  footer: {
    placeholder: "Eduland 공인중개사 강의실 - Footer will be inserted here",
  },
  
  actions: {
    reset: "리셋",
    submit: "제출",
  },
};

// 카테고리 매핑 데이터
export const subjectCategories = {
  primary: ["민법 및 민사특별법", "부동산학개론"],
  secondary: ["부동산공법", "중개법령 및 실무", "부동산세법", "부동산공시법"]
};

// 기본값들
export const defaultValues = {
  video: {
    fallbackVideoId: "dQw4w9WgXcQ", // YouTube fallback video ID
  },
  lecture: {
    defaultTotalLectures: 3,
    defaultTotalDuration: "01:57:30",
    defaultSubject: "민법 및 민사특별법",
    defaultSection: "핵심개념입문",
  },
};