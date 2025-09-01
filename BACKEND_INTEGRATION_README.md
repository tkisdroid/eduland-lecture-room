# Backend Integration Guide - MariaDB 연동 가이드

이 문서는 현재 하드코딩된 데이터를 MariaDB와 연동하여 동적으로 처리하기 위한 가이드입니다.

## 🗂️ 현재 하드코딩된 데이터 파일 위치

### 1. 강의 커리큘럼 데이터
- **파일**: `src/data/curriculum.ts`
- **인터페이스**: `Lecture`, `Section`, `Subject`
- **데이터**: `curriculumData`
- **설명**: 전체 강의 과목, 섹션, 개별 강의 정보

### 2. 최근 강의 데이터  
- **파일**: `src/data/recentCourses.ts`
- **인터페이스**: `RecentCourse`
- **데이터**: `recentCoursesData`
- **설명**: 메인 페이지에 표시되는 추천/최근 강의 목록

### 3. 강의별 학습 콘텐츠
- **파일**: `src/data/lectureContent.ts`
- **인터페이스**: `LectureStrategy`, `LectureSummary`, `LectureQuiz`, `QuizQuestion`
- **데이터**: `lectureStrategiesData`, `lectureSummariesData`, `lectureQuizzesData`
- **설명**: 각 강의별 AI 학습전략, 요약, OX퀴즈 데이터

### 4. 강사 정보 데이터
- **파일**: `src/data/instructors.ts` 
- **인터페이스**: `Instructor`
- **데이터**: `instructorsData`
- **설명**: 강사 프로필, 전문분야, 경력 정보

          # 추가 데이터 분리 작업

## 🎯 모든 하드코딩된 데이터 완전 분리 완료!

새로 생성된 데이터 파일들:

### 5. 강의별 메타데이터
- **파일**: `src/data/lectureMetadata.ts`
- **인터페이스**: `LectureMetadata`
- **데이터**: `lectureMetadataData`  
- **설명**: 각 강의의 과목, 섹션, 총 강의 수, 총 시간 메타정보

### 6. UI 라벨 및 텍스트
- **파일**: `src/data/uiLabels.ts`
- **인터페이스**: `UILabels`
- **데이터**: `uiLabels`, `subjectCategories`, `defaultValues`
- **설명**: 모든 UI 텍스트, 카테고리 분류, 기본값들

### Phase 1: 데이터베이스 설계
```sql
-- 강사 테이블
CREATE TABLE instructors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(150),
    description TEXT,
    experience VARCHAR(20),
    success_rate VARCHAR(10),
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 과목 테이블  
CREATE TABLE subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 섹션 테이블
CREATE TABLE sections (
    id VARCHAR(50) PRIMARY KEY,
    subject_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    is_special BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 강의 테이블
CREATE TABLE lectures (
    id VARCHAR(50) PRIMARY KEY,
    section_id VARCHAR(50),
    number INT,
    title VARCHAR(200) NOT NULL,
    duration VARCHAR(10),
    video_url VARCHAR(500),
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- 강의별 학습 전략
CREATE TABLE lecture_strategies (
    id VARCHAR(50) PRIMARY KEY,
    lecture_id VARCHAR(50),
    strategy_text TEXT,
    order_index INT,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);

-- 강의별 요약
CREATE TABLE lecture_summaries (
    id VARCHAR(50) PRIMARY KEY,
    lecture_id VARCHAR(50),
    content TEXT,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);

-- 퀴즈 문제
CREATE TABLE quiz_questions (
    id VARCHAR(50) PRIMARY KEY,
    lecture_id VARCHAR(50),
    question TEXT NOT NULL,
    answer BOOLEAN NOT NULL,
    explanation TEXT,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);

-- 강의 메타데이터 테이블
CREATE TABLE lecture_metadata (
    id VARCHAR(50) PRIMARY KEY,
    lecture_id VARCHAR(50),
    subject VARCHAR(100),
    section VARCHAR(100), 
    total_lectures INT,
    total_duration VARCHAR(20),
    FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);

-- UI 라벨 테이블 (다국어 지원용)
CREATE TABLE ui_labels (
    id VARCHAR(50) PRIMARY KEY,
    label_key VARCHAR(100) UNIQUE,
    korean_text TEXT,
    english_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본값 설정 테이블
CREATE TABLE system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    description TEXT
);
CREATE TABLE recent_courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    instructor VARCHAR(100),
    thumbnail VARCHAR(500),
    total_duration VARCHAR(20),
    student_count INT DEFAULT 0,
    rating DECIMAL(2,1),
    is_new BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE
);
```

### Phase 2: API 엔드포인트 구현 필요

#### 강의 관련 API
- `GET /api/subjects` - 전체 과목 목록
- `GET /api/subjects/:id/sections` - 과목별 섹션 목록  
- `GET /api/sections/:id/lectures` - 섹션별 강의 목록
- `GET /api/lectures/:id` - 개별 강의 상세 정보

#### 강의 콘텐츠 API
- `GET /api/lectures/:id/strategy` - 강의별 학습전략
- `GET /api/lectures/:id/summary` - 강의별 요약
- `GET /api/lectures/:id/quiz` - 강의별 퀴즈

#### 기타 API
- `GET /api/instructors` - 강사 목록
- `GET /api/instructors/:id` - 강사 상세 정보
- `GET /api/recent-courses` - 최근/추천 강의

### Phase 3: 프론트엔드 수정 작업

#### 수정 필요한 컴포넌트들
1. **`src/pages/Index.tsx`**
   - `curriculumData` 대신 API 호출로 변경
   - `findLectureById` 함수를 API 호출로 대체

2. **`src/components/LectureSidebar.tsx`**
   - 강의 목록을 API에서 받아오도록 수정

3. **`src/components/LectureTabs.tsx`** 
   - `getLectureStrategy`, `getLectureSummary`, `getLectureQuiz` 함수를 API 호출로 변경

4. **`src/components/RecentCourses.tsx`**
   - `recentCoursesData` 대신 API 호출로 변경

5. **`src/components/InstructorInfo.tsx`**
   - 강사 정보를 API에서 받아오도록 수정

#### 새로 만들 필요한 커스텀 훅들
```typescript
// src/hooks/useSubjects.ts
export const useSubjects = () => {
  // 전체 과목 목록 fetch
}

// src/hooks/useLecture.ts  
export const useLecture = (lectureId: string) => {
  // 개별 강의 정보 fetch
}

// src/hooks/useLectureContent.ts
export const useLectureContent = (lectureId: string) => {
  // 강의별 학습전략, 요약, 퀴즈 fetch
}

// src/hooks/useInstructors.ts
export const useInstructors = () => {
  // 강사 정보 fetch
}
```

## 📋 작업 우선순위

### 1. High Priority (핵심 기능)
- [ ] 강의 커리큘럼 데이터 API 연동
- [ ] 개별 강의 정보 로딩
- [ ] 강의별 학습 콘텐츠 (전략, 요약, 퀴즈) API 연동

### 2. Medium Priority  
- [ ] 강사 정보 API 연동
- [ ] 최근 강의 목록 API 연동

### 3. Low Priority (추가 기능)
- [ ] 사용자별 진도 관리
- [ ] 강의 평가 시스템
- [ ] 검색 기능

## 🔧 개발 시 주의사항

1. **타입 안정성**: 기존 TypeScript 인터페이스와 호환되도록 API 응답 구조 설계
2. **에러 처리**: API 호출 실패 시 기본값(fallback) 제공
3. **로딩 상태**: 데이터 로딩 중 스켈레톤 UI 표시
4. **캐싱**: React Query 등을 사용한 적절한 데이터 캐싱 전략
5. **SEO**: 주요 콘텐츠는 SSR 고려

## 📝 마이그레이션 체크리스트

- [ ] MariaDB 테이블 생성 및 초기 데이터 입력
- [ ] API 엔드포인트 구현 및 테스트
- [ ] 프론트엔드 컴포넌트 API 연동
- [ ] 에러 처리 및 로딩 상태 구현
- [ ] 전체 기능 테스트
- [ ] 성능 최적화
- [ ] 프로덕션 배포

---

**연락처**: 추가 질문이나 명세 변경이 필요한 경우 프론트엔드 개발팀에 문의해주세요.