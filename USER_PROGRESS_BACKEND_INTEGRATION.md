# 사용자 진도 관리 시스템 - 백엔드 연동 가이드

이 문서는 사용자별 강의 진도 관리와 마지막 시청 강의 추적 기능을 MariaDB와 연동하기 위한 가이드입니다.

## 🎯 구현된 기능

### 1. 사용자 진도 추적
- **파일**: `src/hooks/useUserProgress.ts`
- **기능**: 
  - 사용자별 강의 진도율 저장/로드
  - 마지막 시청 강의 추적
  - 로컬스토리지 기반 임시 구현 (백엔드 연동 대기)

### 2. 비디오 진도 자동 업데이트
- **파일**: `src/hooks/useVideoProgress.ts`
- **기능**:
  - 10초마다 자동 진도 업데이트
  - 비디오 일시정지/종료 시 진도 저장
  - 저장된 위치에서 재생 재개

### 3. 통합 비디오 플레이어
- **파일**: `src/components/VideoPlayer.tsx`
- **기능**:
  - 진도 추적 hook과 통합
  - 저장된 진도 위치로 자동 이동
  - 실시간 진도 업데이트

### 4. 마지막 시청 강의 로드
- **파일**: `src/pages/Index.tsx`
- **기능**:
  - 앱 시작 시 마지막 시청 강의 자동 로드
  - 저장된 진도율 표시

## 🗃️ 데이터베이스 설계

### 테이블 구조

```sql
-- 사용자 진도 테이블
CREATE TABLE user_lecture_progress (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL,
    lecture_id VARCHAR(50) NOT NULL,
    progress_percent DECIMAL(5,2) DEFAULT 0.00, -- 0.00 ~ 100.00
    last_watched_time DECIMAL(10,2) DEFAULT 0.00, -- seconds
    total_duration DECIMAL(10,2), -- seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_member_lecture (member_id, lecture_id),
    INDEX idx_member_updated (member_id, updated_at),
    UNIQUE KEY unique_member_lecture (member_id, lecture_id)
);

-- 마지막 시청 강의 테이블
CREATE TABLE user_last_watched (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL UNIQUE,
    lecture_id VARCHAR(50) NOT NULL,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_member_watched (member_id, watched_at)
);

-- 사용자 테이블 (참조용)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔌 필요한 API 엔드포인트

### 1. 진도 관련 API

#### 진도 업데이트
```
POST /api/user-progress
Content-Type: application/json

{
  "memberId": "user_001",
  "lectureId": "lecture_123",
  "progress": 65.5,
  "lastWatchedTime": 1250.3,
  "totalDuration": 1920.0
}

Response: 200 OK
{
  "success": true,
  "message": "Progress updated successfully"
}
```

#### 진도 조회
```
GET /api/user-progress/{memberId}/{lectureId}

Response: 200 OK
{
  "memberId": "user_001",
  "lectureId": "lecture_123", 
  "progress": 65.5,
  "lastWatchedTime": 1250.3,
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### 사용자 전체 진도 조회
```
GET /api/user-progress/{memberId}

Response: 200 OK
{
  "progress": [
    {
      "lectureId": "lecture_123",
      "progress": 65.5,
      "lastWatchedTime": 1250.3,
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. 마지막 시청 강의 API

#### 마지막 시청 강의 업데이트
```
POST /api/last-watched
Content-Type: application/json

{
  "memberId": "user_001",
  "lectureId": "lecture_123"
}

Response: 200 OK
{
  "success": true,
  "message": "Last watched lecture updated"
}
```

#### 마지막 시청 강의 조회
```
GET /api/last-watched/{memberId}

Response: 200 OK
{
  "memberId": "user_001",
  "lectureId": "lecture_123",
  "watchedAt": "2024-01-15T10:30:00Z"
}
```

## 📝 프론트엔드 수정 가이드

### 1. useUserProgress Hook 수정

`src/hooks/useUserProgress.ts`에서 다음 함수들을 API 호출로 변경:

```typescript
// 현재 (로컬스토리지)
const updateProgress = useCallback(async (lectureId: string, progress: number, currentTime: number) => {
  // TODO: 백엔드 API 호출로 교체
  // localStorage 코드 제거
  
  try {
    const response = await fetch('/api/user-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId,
        lectureId,
        progress,
        lastWatchedTime: currentTime
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
    
    // 로컬 상태 업데이트
    setProgressData(prev => ({
      ...prev,
      [lectureId]: { memberId, lectureId, progress, lastWatchedTime: currentTime, updatedAt: new Date().toISOString() }
    }));
    
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
}, [memberId]);
```

### 2. 데이터 로딩 로직 추가

```typescript
// 컴포넌트 마운트 시 서버에서 데이터 로드
useEffect(() => {
  const loadUserData = async () => {
    if (!memberId) return;
    
    try {
      // 전체 진도 데이터 로드
      const progressResponse = await fetch(`/api/user-progress/${memberId}`);
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        // 상태 업데이트
      }
      
      // 마지막 시청 강의 로드
      const lastWatchedResponse = await fetch(`/api/last-watched/${memberId}`);
      if (lastWatchedResponse.ok) {
        const lastWatchedData = await lastWatchedResponse.json();
        // 상태 업데이트
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };
  
  loadUserData();
}, [memberId]);
```

### 3. 에러 처리 및 오프라인 지원

```typescript
// 오프라인 상황을 위한 큐 시스템
const [pendingUpdates, setPendingUpdates] = useState<ProgressUpdate[]>([]);

const updateProgressWithQueue = async (update: ProgressUpdate) => {
  try {
    await updateProgress(update);
    // 성공 시 큐에서 제거
  } catch (error) {
    // 실패 시 큐에 추가
    setPendingUpdates(prev => [...prev, update]);
  }
};

// 네트워크 재연결 시 큐 처리
useEffect(() => {
  const processPendingUpdates = async () => {
    if (navigator.onLine && pendingUpdates.length > 0) {
      for (const update of pendingUpdates) {
        try {
          await updateProgress(update);
          setPendingUpdates(prev => prev.filter(u => u !== update));
        } catch (error) {
          break; // 실패 시 중단
        }
      }
    }
  };

  window.addEventListener('online', processPendingUpdates);
  return () => window.removeEventListener('online', processPendingUpdates);
}, [pendingUpdates]);
```

## 🔒 보안 고려사항

### 1. 인증 및 권한
```typescript
// API 요청에 JWT 토큰 포함
const updateProgress = async (data) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/api/user-progress', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
};
```

### 2. 데이터 검증
```sql
-- 서버사이드 검증 예시
DELIMITER //
CREATE TRIGGER validate_progress_before_insert 
BEFORE INSERT ON user_lecture_progress
FOR EACH ROW 
BEGIN
    -- 진도율 범위 검증
    IF NEW.progress_percent < 0 OR NEW.progress_percent > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Progress must be between 0 and 100';
    END IF;
    
    -- 시청 시간 검증
    IF NEW.last_watched_time < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Watch time cannot be negative';
    END IF;
END //
DELIMITER ;
```

## 📊 성능 최적화

### 1. 배치 업데이트
```typescript
// 여러 진도 업데이트를 배치로 처리
const batchUpdateProgress = async (updates: ProgressUpdate[]) => {
  await fetch('/api/user-progress/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates })
  });
};
```

### 2. 캐싱 전략
```typescript
// React Query를 사용한 캐싱
const { data: userProgress, mutate } = useQuery(
  ['userProgress', memberId],
  () => fetchUserProgress(memberId),
  { 
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000 // 10분
  }
);
```

## 🧪 테스트 시나리오

### 1. 진도 업데이트 테스트
- [ ] 10초마다 자동 업데이트 확인
- [ ] 네트워크 오류 시 재시도 로직 테스트
- [ ] 동시 업데이트 요청 처리 테스트

### 2. 마지막 시청 강의 테스트
- [ ] 앱 재시작 시 마지막 강의 로드 확인
- [ ] 여러 디바이스 간 동기화 테스트

### 3. 성능 테스트
- [ ] 대용량 진도 데이터 로딩 테스트
- [ ] 동시 사용자 진도 업데이트 테스트

## 📋 마이그레이션 체크리스트

- [ ] 데이터베이스 테이블 생성
- [ ] API 엔드포인트 구현 및 테스트
- [ ] 프론트엔드 Hook 수정 (localStorage → API)
- [ ] 인증 시스템과 통합
- [ ] 에러 처리 및 오프라인 지원 구현
- [ ] 성능 최적화 (캐싱, 배치 업데이트)
- [ ] 전체 시스템 통합 테스트
- [ ] 프로덕션 배포

## 🔧 개발 우선순위

### Phase 1: 핵심 기능
1. 사용자 인증 시스템 구축
2. 진도 업데이트 API 구현
3. 마지막 시청 강의 API 구현

### Phase 2: 안정성
4. 에러 처리 및 재시도 로직
5. 오프라인 지원 (큐 시스템)
6. 데이터 검증 및 보안

### Phase 3: 최적화
7. 성능 최적화 (배치 업데이트)
8. 캐싱 전략 구현
9. 모니터링 및 분석

---

**연락처**: 진도 관리 시스템 관련 질문이나 명세 변경이 필요한 경우 프론트엔드 개발팀에 문의해주세요.