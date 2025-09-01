// TODO: Replace with dynamic data from MariaDB
// This file contains hardcoded lecture content data that should be fetched from the database

export interface QuizQuestion {
  id: string;
  question: string;
  answer: boolean;
  explanation: string;
}

export interface LectureContentData {
  lectureId: string;
  strategyContent: string[];
  summaryContent: string;
  quizQuestions: QuizQuestion[];
}

// TODO: This should be fetched dynamically based on the current lecture ID
export const lectureContentData: LectureContentData = {
  lectureId: "1", // Should match the current lecture ID
  strategyContent: [
    "소유권의 개념을 명확히 이해하고 점유권과의 차이점을 구분하세요",
    "민법 제185조~제259조의 소유권 관련 조문을 반복 학습하세요", 
    "판례를 통해 실제 적용 사례를 익히고 문제 해결 능력을 키우세요",
    "기출문제를 풀며 출제 경향을 파악하고 약점을 보완하세요"
  ],
  summaryContent: `소유권은 물건을 직접 지배하여 사용·수익·처분할 수 있는 완전한 물권으로, 물권 중 가장 완전하고 포괄적인 권리입니다.

소유권의 4가지 특성:
1. 완전성 - 물건에 대한 가장 완전한 지배권
2. 탄력성 - 제한물권이 소멸하면 완전한 내용을 회복
3. 영속성 - 시효로 인해 소멸되지 않음
4. 관념성 - 물건의 존재를 전제로 하는 권리

점유권과의 차이점:
소유권은 법률상의 완전한 본권인 반면, 점유권은 사실상의 지배를 기초로 한 권리로서 성격이 다릅니다. 소유권자는 물건을 직접 지배하지 않아도 권리를 행사할 수 있지만, 점유권은 현실적 지배가 전제되어야 합니다.`,
  quizQuestions: [
    {
      id: "q1",
      question: "소유권은 물건에 대한 가장 완전한 권리이다.",
      answer: true,
      explanation: "소유권은 물건을 직접 지배하여 사용·수익·처분할 수 있는 완전한 물권으로, 물권 중 가장 완전한 권리입니다."
    },
    {
      id: "q2", 
      question: "점유권은 소유권과 동일한 성격의 권리이다.",
      answer: false,
      explanation: "점유권은 사실상의 지배를 기초로 한 권리이고, 소유권은 법률상 완전한 지배권이므로 성격이 다릅니다."
    },
    {
      id: "q3",
      question: "소유권의 탄력성은 제한물권이 소멸하면 완전한 내용을 회복한다는 의미이다.", 
      answer: true,
      explanation: "탄력성은 소유권에 제한이 가해져도 그 제한이 없어지면 완전한 내용을 회복한다는 특성입니다."
    }
  ]
};