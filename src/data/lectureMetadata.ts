// 강의별 메타데이터 (totalLectures, totalDuration 등)
// TODO for Backend Developer: 이 데이터를 DB에서 동적으로 계산하거나 저장된 값을 가져오도록 변경 필요

export interface LectureMetadata {
  id: string;
  lectureId: string;
  subject: string;
  section: string;
  totalLectures: number;
  totalDuration: string;
}

export const lectureMetadataData: LectureMetadata[] = [
  {
    id: "meta_1",
    lectureId: "1",
    subject: "민법 및 민사특별법",
    section: "핵심개념입문",
    totalLectures: 3,
    totalDuration: "01:57:30"
  },
  {
    id: "meta_2", 
    lectureId: "2",
    subject: "민법 및 민사특별법",
    section: "핵심개념입문",
    totalLectures: 3,
    totalDuration: "01:57:30"
  },
  {
    id: "meta_3",
    lectureId: "3",
    subject: "민법 및 민사특별법", 
    section: "핵심개념입문",
    totalLectures: 3,
    totalDuration: "01:57:30"
  },
  {
    id: "meta_4",
    lectureId: "4",
    subject: "민법 및 민사특별법",
    section: "기본이론",
    totalLectures: 1,
    totalDuration: "00:45:20"
  },
  {
    id: "meta_special1",
    lectureId: "special1",
    subject: "민법 및 민사특별법",
    section: "판례특강", 
    totalLectures: 1,
    totalDuration: "00:28:15"
  }
];

// 강의별 메타데이터를 가져오는 헬퍼 함수
export const getLectureMetadata = (lectureId: string): LectureMetadata | null => {
  return lectureMetadataData.find(meta => meta.lectureId === lectureId) || null;
};

// 기본 메타데이터 (찾을 수 없을 때 사용)
export const getDefaultLectureMetadata = (): Omit<LectureMetadata, 'id' | 'lectureId'> => {
  return {
    subject: "민법 및 민사특별법",
    section: "핵심개념입문",
    totalLectures: 3,
    totalDuration: "01:57:30"
  };
};