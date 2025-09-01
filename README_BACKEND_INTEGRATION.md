# Backend Integration Guide - MariaDB

이 문서는 현재 하드코딩된 데이터를 MariaDB와 연동하여 동적 데이터로 변경하기 위한 가이드입니다.

## 하드코딩된 데이터 파일 위치

### 1. 커리큘럼 데이터
- **파일**: `src/data/curriculum.ts`
- **설명**: 과목별 섹션과 강의 목록 데이터
- **인터페이스**: `Subject`, `Section`, `Lecture`
- **대체 필요**: `curriculumData` 배열

### 2. 최근 강의 데이터
- **파일**: `src/data/recentCourses.ts`
- **설명**: 최근 업로드된 강의 목록
- **인터페이스**: `RecentCourse`
- **대체 필요**: `recentCoursesData` 배열

### 3. 기본 강의 데이터
- **파일**: `src/data/defaultLecture.ts`
- **설명**: 페이지 로드시 기본으로 표시되는 강의 정보
- **인터페이스**: `DefaultLectureData`
- **대체 필요**: `defaultLectureData` 객체

### 4. 강사 정보 데이터
- **파일**: `src/data/instructorData.ts`
- **설명**: 강사 프로필 정보
- **인터페이스**: `InstructorData`
- **대체 필요**: `instructorData` 객체

### 5. 강의 콘텐츠 데이터
- **파일**: `src/data/lectureContent.ts`
- **설명**: 강의별 학습전략, 요약, 퀴즈 데이터
- **인터페이스**: `LectureContentData`, `QuizQuestion`
- **대체 필요**: `lectureContentData` 객체

## 백엔드 구현 권장사항

### API 엔드포인트 설계 예시

```
GET /api/curriculum - 전체 커리큘럼 데이터
GET /api/recent-courses - 최근 강의 목록
GET /api/lectures/:id - 특정 강의 상세 정보
GET /api/instructors/:id - 강사 정보
GET /api/lecture-content/:lectureId - 강의별 콘텐츠 (전략, 요약, 퀴즈)
```

### 데이터베이스 테이블 설계 권장

1. **subjects** - 과목 정보
2. **sections** - 섹션 정보
3. **lectures** - 강의 정보
4. **instructors** - 강사 정보
5. **lecture_content** - 강의 콘텐츠 정보
6. **quiz_questions** - 퀴즈 문제 정보

### 프론트엔드 수정 가이드

각 데이터 파일의 하드코딩된 내용을 API 호출로 대체:

1. `useState`와 `useEffect`를 사용하여 API에서 데이터 로드
2. 로딩 상태 관리
3. 에러 처리
4. 캐싱 전략 고려 (React Query 등)

### 예시 구현

```typescript
// Before (hardcoded)
import { curriculumData } from "@/data/curriculum";

// After (dynamic)
const [curriculumData, setCurriculumData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchCurriculumData()
    .then(setCurriculumData)
    .finally(() => setLoading(false));
}, []);
```

## 주의사항

- 모든 데이터 파일에 `TODO` 주석이 포함되어 있어 쉽게 식별 가능
- 인터페이스는 유지하되 데이터 소스만 변경
- 기존 컴포넌트 로직은 최대한 보존
- 에러 처리와 로딩 상태 UI 추가 필요