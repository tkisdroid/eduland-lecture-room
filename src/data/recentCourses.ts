export interface RecentCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  totalDuration: string;
  studentCount: number;
  rating?: number;
  isNew?: boolean;
  isPopular?: boolean;
  progress?: number;
}

export const recentCoursesData: RecentCourse[] = [
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