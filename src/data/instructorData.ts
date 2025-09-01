// TODO: Replace with dynamic data from MariaDB
// This file contains hardcoded instructor data that should be fetched from the database

export interface InstructorData {
  id: string;
  name: string;
  nameInitial: string;
  description: string;
  experience: string;
  passRate: string;
  specialties: string[];
  profileImage?: string;
}

export const instructorData: InstructorData = {
  id: "instructor-1",
  name: "김민수 강사",
  nameInitial: "김",
  description: "공인중개사 시험 대비 전문 강사",
  experience: "15년 경력",
  passRate: "합격률 95%",
  specialties: ["민법 전문", "부동산학 전문", "판례 분석"],
  profileImage: undefined // TODO: Add profile image URL from database
};