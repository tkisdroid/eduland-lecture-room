export interface Lecture {
  id: string;
  number: number;
  title: string;
  duration: string;
  progress: number;
  videoUrl: string;
}

export interface Section {
  id: string;
  name: string;
  lectures: Lecture[];
}

export interface Subject {
  id: string;
  name: string;
  sections: Section[];
  specialSections?: Section[];
}

export const curriculumData: Subject[] = [
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
            videoUrl: "https://www.youtube.com/embed/c0gFbdrBLX0"
          },
          {
            id: "2", 
            number: 2,
            title: "물권의 효력과 공시원칙",
            duration: "39:00",
            progress: 100,
            videoUrl: "https://www.youtube.com/embed/c0gFbdrBLX0"
          },
          {
            id: "3",
            number: 3,
            title: "부동산 등기와 아파트 매매",
            duration: "42:00", 
            progress: 0,
            videoUrl: "https://www.youtube.com/embed/c0gFbdrBLX0"
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
            videoUrl: "https://www.youtube.com/embed/c0gFbdrBLX0"
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
            videoUrl: "https://www.youtube.com/embed/c0gFbdrBLX0"
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
    id: "부동산공시법",
    name: "부동산공시법",
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