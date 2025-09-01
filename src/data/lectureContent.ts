// 강의별 학습 콘텐츠 데이터
// TODO for Backend Developer: 이 데이터를 MariaDB에서 동적으로 가져오도록 변경 필요

export interface LectureStrategy {
  id: string;
  lectureId: string;
  strategies: string[];
}

export interface LectureSummary {
  id: string;
  lectureId: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answer: boolean;
  explanation: string;
}

export interface LectureQuiz {
  id: string;
  lectureId: string;
  questions: QuizQuestion[];
}

// AI 학습전략 데이터
export const lectureStrategiesData: LectureStrategy[] = [
  {
    id: "strategy_1",
    lectureId: "1",
    strategies: [
      "소유권의 개념을 명확히 이해하고 점유권과의 차이점을 구분하세요",
      "민법 제185조~제259조의 소유권 관련 조문을 반복 학습하세요", 
      "판례를 통해 실제 적용 사례를 익히고 문제 해결 능력을 키우세요",
      "기출문제를 풀며 출제 경향을 파악하고 약점을 보완하세요"
    ]
  },
  {
    id: "strategy_2",
    lectureId: "2",
    strategies: [
      "물권의 효력과 공시원칙의 상관관계를 체계적으로 학습하세요",
      "등기부등본 읽는 방법을 숙지하고 실습해보세요",
      "선의취득의 요건과 효과를 정확히 암기하세요",
      "관련 판례를 통해 실무 적용 사례를 익히세요"
    ]
  }
];

// AI 학습요약 데이터
export const lectureSummariesData: LectureSummary[] = [
  {
    id: "summary_1",
    lectureId: "1",
    content: `소유권은 물건을 직접 지배하여 사용·수익·처분할 수 있는 완전한 물권으로, 물권 중 가장 완전하고 포괄적인 권리입니다.

소유권의 4가지 특성:
1. 완전성 - 물건에 대한 가장 완전한 지배권
2. 탄력성 - 제한물권이 소멸하면 완전한 내용을 회복
3. 영속성 - 시효로 인해 소멸되지 않음
4. 관념성 - 물건의 존재를 전제로 하는 권리

점유권과의 차이점:
소유권은 법률상의 완전한 본권인 반면, 점유권은 사실상의 지배를 기초로 한 권리로서 성격이 다릅니다. 소유권자는 물건을 직접 지배하지 않아도 권리를 행사할 수 있지만, 점유권은 현실적 지배가 전제되어야 합니다.`
  },
  {
    id: "summary_2",
    lectureId: "2",
    content: `물권의 효력은 물건에 대한 직접적이고 배타적인 지배력을 의미하며, 공시원칙은 물권변동을 제3자에게 알리는 제도입니다.

물권의 효력:
1. 우선적 효력 - 먼저 성립한 물권이 나중에 성립한 물권보다 우선
2. 추급적 효력 - 물건이 누구의 손에 있더라도 권리를 주장할 수 있음
3. 배타적 효력 - 동일한 물건 위에 양립할 수 없는 물권의 공존 불가

공시원칙:
부동산은 등기, 동산은 점유를 통해 물권변동을 공시합니다. 이는 거래안전과 제3자 보호를 위한 핵심 원칙입니다.`
  }
];

// OX 퀴즈 데이터
export const lectureQuizzesData: LectureQuiz[] = [
  {
    id: "quiz_1",
    lectureId: "1",
    questions: [
      {
        id: "q1_1",
        question: "소유권은 물건에 대한 가장 완전한 권리이다.",
        answer: true,
        explanation: "소유권은 물건을 직접 지배하여 사용·수익·처분할 수 있는 완전한 물권으로, 물권 중 가장 완전한 권리입니다."
      },
      {
        id: "q1_2", 
        question: "점유권은 소유권과 동일한 성격의 권리이다.",
        answer: false,
        explanation: "점유권은 사실상의 지배를 기초로 한 권리이고, 소유권은 법률상 완전한 지배권이므로 성격이 다릅니다."
      },
      {
        id: "q1_3",
        question: "소유권의 탄력성은 제한물권이 소멸하면 완전한 내용을 회복한다는 의미이다.", 
        answer: true,
        explanation: "탄력성은 소유권에 제한이 가해져도 그 제한이 없어지면 완전한 내용을 회복한다는 특성입니다."
      }
    ]
  },
  {
    id: "quiz_2",
    lectureId: "2",
    questions: [
      {
        id: "q2_1",
        question: "부동산 물권변동의 공시방법은 등기이다.",
        answer: true,
        explanation: "부동산의 경우 등기를 통해 물권변동을 공시하며, 이는 거래안전을 위한 핵심 제도입니다."
      },
      {
        id: "q2_2",
        question: "동산의 공시방법은 등기이다.",
        answer: false,
        explanation: "동산의 공시방법은 점유입니다. 등기는 부동산의 공시방법입니다."
      },
      {
        id: "q2_3",
        question: "물권의 우선적 효력은 시간상 먼저 성립한 물권이 우선한다는 의미이다.",
        answer: true,
        explanation: "물권의 우선적 효력에 의해 먼저 성립한 물권이 나중에 성립한 물권보다 우선합니다."
      }
    ]
  }
];

// 강의별 콘텐츠를 가져오는 헬퍼 함수들
export const getLectureStrategy = (lectureId: string): string[] => {
  const strategy = lectureStrategiesData.find(s => s.lectureId === lectureId);
  return strategy?.strategies || [
    "해당 강의의 학습전략을 준비 중입니다.",
    "곧 업데이트될 예정입니다."
  ];
};

export const getLectureSummary = (lectureId: string): string => {
  const summary = lectureSummariesData.find(s => s.lectureId === lectureId);
  return summary?.content || "해당 강의의 요약 내용을 준비 중입니다.";
};

export const getLectureQuiz = (lectureId: string): QuizQuestion[] => {
  const quiz = lectureQuizzesData.find(q => q.lectureId === lectureId);
  return quiz?.questions || [
    {
      id: "default_q1",
      question: "해당 강의의 퀴즈를 준비 중입니다.",
      answer: true,
      explanation: "곧 업데이트될 예정입니다."
    }
  ];
};