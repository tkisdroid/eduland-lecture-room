// 강사 정보 데이터
// TODO for Backend Developer: 이 데이터를 MariaDB에서 동적으로 가져오도록 변경 필요

export interface Instructor {
  id: string;
  name: string;
  title: string;
  description: string;
  specialties: string[];
  experience: string;
  successRate: string;
  profileImage?: string;
  courses?: string[];
}

export const instructorsData: Instructor[] = [
  {
    id: "instructor_1",
    name: "김민수",
    title: "김민수 강사",
    description: "공인중개사 시험 대비 전문 강사 · 15년 경력 · 합격률 95%",
    specialties: ["민법 전문", "부동산학 전문", "판례 분석"],
    experience: "15년",
    successRate: "95%",
    courses: ["민법 및 민사특별법", "부동산공법"]
  },
  {
    id: "instructor_2", 
    name: "박영희",
    title: "박영희 강사",
    description: "부동산학개론 및 공인중개사 실무 전문 강사 · 12년 경력 · 합격률 92%",
    specialties: ["부동산학개론", "중개실무", "기출문제 분석"],
    experience: "12년",
    successRate: "92%",
    courses: ["부동산학개론", "중개법령 및 실무"]
  },
  {
    id: "instructor_3",
    name: "이정우", 
    title: "이정우 강사",
    description: "중개실무 및 부동산세법 전문 강사 · 10년 경력 · 합격률 89%",
    specialties: ["중개실무", "부동산세법", "실전 문제풀이"],
    experience: "10년",
    successRate: "89%",
    courses: ["중개법령 및 실무", "부동산세법"]
  },
  {
    id: "instructor_4",
    name: "최수정",
    title: "최수정 강사", 
    description: "부동산세법 및 공법 전문 강사 · 8년 경력 · 합격률 91%",
    specialties: ["부동산세법", "세무 실무", "계산문제"],
    experience: "8년", 
    successRate: "91%",
    courses: ["부동산세법", "부동산공법"]
  },
  {
    id: "instructor_5",
    name: "정형준",
    title: "정형준 강사",
    description: "부동산공시법 및 판례 전문 강사 · 7년 경력 · 합격률 88%", 
    specialties: ["부동산공시법", "판례 해석", "법령 분석"],
    experience: "7년",
    successRate: "88%",
    courses: ["부동산공시법"]
  }
];

// 강사 정보를 가져오는 헬퍼 함수
export const getInstructorById = (instructorId: string): Instructor | null => {
  return instructorsData.find(instructor => instructor.id === instructorId) || null;
};

export const getInstructorByName = (name: string): Instructor | null => {
  return instructorsData.find(instructor => instructor.name === name) || null;
};

// 기본 강사 정보 (현재 하드코딩된 값)
export const getDefaultInstructor = (): Instructor => {
  return instructorsData[0]; // 김민수 강사를 기본값으로 사용
};