// Curriculum Data
const curriculumData = [
  {
    id: "민법 및 민사특별법",
    name: "민법 및 민사특별법",
    sections: [
      {
        id: "핵심개념입문과정",
        name: "핵심개념입문", 
        lectures: [
          {
            id: "1",
            number: 1,
            title: "소유권과 점유권의 기본 개념",
            duration: "36:30",
            progress: 45,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            id: "2", 
            number: 2,
            title: "물권의 효력과 공시원칙",
            duration: "39:00",
            progress: 100,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            id: "3",
            number: 3,
            title: "부동산 등기와 아파트 매매",
            duration: "42:00", 
            progress: 0,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }
        ]
      },
      {
        id: "기본이론과정",
        name: "기본이론",
        lectures: [
          {
            id: "4",
            number: 1,
            title: "민법총칙 - 권리능력과 행위능력",
            duration: "45:20",
            progress: 0,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }
        ]
      },
      {
        id: "예상문제풀이과정", 
        name: "예상문제풀이",
        lectures: []
      },
      {
        id: "모의고사과정",
        name: "모의고사",
        lectures: []
      },
      {
        id: "기출문제풀이과정",
        name: "기출문제풀이",
        lectures: []
      }
    ],
    specialSections: [
      {
        id: "판례특강",
        name: "판례특강",
        lectures: [
          {
            id: "special1",
            number: 1,
            title: "소유권 관련 주요 판례",
            duration: "28:15",
            progress: 0,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }
        ]
      }
    ]
  },
  {
    id: "부동산학개론",
    name: "부동산학개론", 
    sections: [
      {
        id: "핵심개념입문과정_부동산학",
        name: "핵심개념입문",
        lectures: []
      },
      {
        id: "기본이론과정_부동산학",
        name: "기본이론",
        lectures: []
      },
      {
        id: "예상문제풀이과정_부동산학",
        name: "예상문제풀이",
        lectures: []
      },
      {
        id: "모의고사과정_부동산학",
        name: "모의고사",
        lectures: []
      },
      {
        id: "기출문제풀이과정_부동산학",
        name: "기출문제풀이",
        lectures: []
      }
    ],
    specialSections: [
      {
        id: "계산문제특강",
        name: "계산문제특강",
        lectures: []
      }
    ]
  },
  {
    id: "부동산공법",
    name: "부동산공법",
    sections: [
      {
        id: "핵심개념입문과정_공법",
        name: "핵심개념입문",
        lectures: []
      },
      {
        id: "기본이론과정_공법", 
        name: "기본이론",
        lectures: []
      },
      {
        id: "예상문제풀이과정_공법",
        name: "예상문제풀이",
        lectures: []
      },
      {
        id: "모의고사과정_공법",
        name: "모의고사",
        lectures: []
      },
      {
        id: "기출문제풀이과정_공법",
        name: "기출문제풀이",
        lectures: []
      }
    ]
  },
  {
    id: "중개법령 및 실무",
    name: "중개법령 및 실무",
    sections: [
      {
        id: "핵심개념입문과정_중개법령",
        name: "핵심개념입문",
        lectures: []
      },
      {
        id: "기본이론과정_중개법령",
        name: "기본이론",
        lectures: []
      },
      {
        id: "예상문제풀이과정_중개법령", 
        name: "예상문제풀이",
        lectures: []
      },
      {
        id: "모의고사과정_중개법령",
        name: "모의고사",
        lectures: []
      },
      {
        id: "기출문제풀이과정_중개법령",
        name: "기출문제풀이",
        lectures: []
      }
    ]
  },
  {
    id: "부동산세법",
    name: "부동산세법",
    sections: [
      {
        id: "핵심개념입문과정_세법",
        name: "핵심개념입문",
        lectures: []
      },
      {
        id: "기본이론과정_세법",
        name: "기본이론",
        lectures: []
      },
      {
        id: "예상문제풀이과정_세법",
        name: "예상문제풀이",
        lectures: []
      },
      {
        id: "모의고사과정_세법",
        name: "모의고사",
        lectures: []
      },
      {
        id: "기출문제풀이과정_세법",
        name: "기출문제풀이",
        lectures: []
      }
    ]
  },
  {
    id: "부동산 공시법",
    name: "부동산 공시법",
    sections: [
      {
        id: "핵심개념입문과정_공시법",
        name: "핵심개념입문",
        lectures: []
      },
      {
        id: "기본이론과정_공시법",
        name: "기본이론",
        lectures: []
      },
      {
        id: "예상문제풀이과정_공시법",
        name: "예상문제풀이", 
        lectures: []
      },
      {
        id: "모의고사과정_공시법",
        name: "모의고사",
        lectures: []
      },
      {
        id: "기출문제풀이과정_공시법",
        name: "기출문제풀이",
        lectures: []
      }
    ]
  }
];

// Recent Courses Data
const recentCoursesData = [
  {
    id: "rc1",
    title: "2025년 공인중개사 1차 민법 완전정복",
    instructor: "김민수 강사",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
    totalDuration: "15:30:00",
    studentCount: 1247,
    rating: 4.8,
    isNew: true,
    progress: 23
  },
  {
    id: "rc2", 
    title: "부동산학개론 핵심 개념 마스터",
    instructor: "박영희 강사",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop",
    totalDuration: "12:45:00", 
    studentCount: 892,
    rating: 4.9,
    isPopular: true
  },
  {
    id: "rc3",
    title: "공인중개사 2차 중개실무 완벽대비",
    instructor: "이정우 강사", 
    thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=225&fit=crop",
    totalDuration: "18:20:00",
    studentCount: 673,
    rating: 4.7,
    isNew: true
  },
  {
    id: "rc4",
    title: "부동산세법 핵심 요약 특강",
    instructor: "최수정 강사",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop",
    totalDuration: "8:30:00",
    studentCount: 445,
    rating: 4.6
  },
  {
    id: "rc5",
    title: "부동산공법 기본이론 완성",
    instructor: "김민수 강사", 
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=225&fit=crop",
    totalDuration: "14:15:00",
    studentCount: 789,
    rating: 4.8,
    isPopular: true,
    progress: 67
  },
  {
    id: "rc6",
    title: "부동산 공시법 판례 분석",
    instructor: "정형준 강사",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop",
    totalDuration: "6:45:00",
    studentCount: 321,
    rating: 4.5
  },
  {
    id: "rc7",
    title: "공인중개사 기출문제 총정리",
    instructor: "박영희 강사",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop",
    totalDuration: "22:10:00",
    studentCount: 1156,
    rating: 4.9,
    isPopular: true
  },
  {
    id: "rc8",
    title: "민법 판례 특강 - 실전 대비",
    instructor: "이정우 강사", 
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=225&fit=crop",
    totalDuration: "9:20:00",
    studentCount: 567,
    rating: 4.7,
    isNew: true,
    progress: 45
  }
];

// Quiz Data
const quizQuestions = [
  {
    question: "소유권은 물건을 자유롭게 사용, 수익, 처분할 수 있는 권리이다.",
    answer: "O",
    explanation: "소유권은 민법 제211조에 의해 물건을 전면적으로 지배하는 물권으로, 사용권, 수익권, 처분권을 포함합니다."
  },
  {
    question: "점유권은 물건에 대한 사실상의 지배만으로는 성립하지 않는다.",
    answer: "X", 
    explanation: "점유권은 물건에 대한 사실상의 지배상태만으로도 성립하며, 점유의 의사와 사실이 있으면 됩니다."
  },
  {
    question: "부동산의 소유권 이전은 반드시 등기를 해야만 효력이 발생한다.",
    answer: "X",
    explanation: "부동산의 소유권 이전은 당사자 간에는 계약만으로도 효력이 있으나, 제3자에 대한 대항력을 위해서는 등기가 필요합니다."
  }
];