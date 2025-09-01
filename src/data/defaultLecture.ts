// TODO: Replace with dynamic data from MariaDB
// This file contains hardcoded default lecture data that should be fetched from the database

export interface DefaultLectureData {
  id: string;
  title: string;
  subject: string;
  section: string;
  lectureNumber: number;
  duration: string;
  videoUrl: string;
  progress: number;
  totalLectures: number;
  totalDuration: string;
}

export const defaultLectureData: DefaultLectureData = {
  id: "1",
  title: "소유권과 점유권의 기본 개념",
  subject: "민법 및 민사특별법",
  section: "핵심개념입문", 
  lectureNumber: 1,
  duration: "36:30",
  videoUrl: "https://www.youtube.com/embed/c0gFbdrBLX0",
  progress: 45,
  totalLectures: 3,
  totalDuration: "01:57:30"
};