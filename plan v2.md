# God Life Maker - 개발 기획서 v2

## 문서 정보
- **작성일**: 2026-01-08
- **버전**: v2.0
- **상태**: 개발팀 전달 대기
- **Production URL**: https://god-life-six.vercel.app
- **GitHub**: https://github.com/dlgur03-blip/god-life

---

# 모듈별 수정/개발 요구사항

---

## 1. DESTINY NAVIGATOR (운명 내비게이터)

### 1.1 타임블록 시스템 전면 개편

#### 현재 상태
- 6시~16시 고정 (11개 블록)
- 1시간 단위 고정
- 시간 수정 불가

#### 요구사항

##### 1.1.1 24시간 타임블록
- [x] 00:00 ~ 23:59 전체 시간대 지원
- [x] 기본값: 1시간 단위 블록 24개
- [x] 사용자가 블록 시작/종료 시간 직접 수정 가능
- [x] **5분 단위**로 시간 설정 가능 (예: 06:00 ~ 06:45)

##### 1.1.2 블록 관리 기능
- [x] 블록 추가/삭제 기능
- [x] 블록 시간 범위 드래그로 조절 (선택사항)
- [x] 블록 순서 변경

##### 1.1.3 템플릿 저장 기능
- [x] 현재 타임블록 구조를 "템플릿"으로 저장
- [x] 템플릿 이름 지정 (예: "평일 루틴", "주말 루틴")
- [x] 저장된 템플릿 불러오기
- [x] 템플릿 삭제

##### DB 스키마 추가 필요
```prisma
model DestinyTemplate {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  name      String
  blocks    Json     // [{seq, startTime, endTime, planText, planLocation}]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### 1.2 핵심목표 구조 변경

#### 현재 상태
- Ultimate, Long-term, Month, Week, Today (5단계)
- 편집 불가 (읽기 전용)

#### 변경 요구사항

##### 1.2.1 목표 구조 단순화
**기존 (삭제):**
- ~~Ultimate 목표~~
- ~~Long-term 목표~~
- ~~Month 목표~~

**신규 구조:**
```
┌─────────────────────────────────────────┐
│  이번 주 목표 (Week Goal)               │
│  [편집 가능한 입력창]                    │
├─────────────────────────────────────────┤
│  주간 계획 (Weekly Plan)                │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  │ 오늘 │ +1일 │ +2일 │ +3일 │ +4일 │ +5일 │ +6일 │
│  │ 1/8 │ 1/9 │ 1/10│ 1/11│ 1/12│ 1/13│ 1/14│
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  │[입력]│[입력]│[입력]│[입력]│[입력]│[입력]│[입력]│
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘
├─────────────────────────────────────────┤
│  오늘의 목표 (Today's Goal)             │
│  [편집 가능한 입력창]                    │
└─────────────────────────────────────────┘
```

##### 1.2.2 핵심목표 편집 기능
- [x] 클릭 시 인라인 편집 모드
- [x] 자동 저장 (debounce 500ms)
- [x] `updateDestinyGoals` 액션 연결

##### DB 스키마 수정
```prisma
model DestinyDay {
  // 기존 필드 유지하되 사용 변경
  goalWeek     String?   // 이번 주 목표
  goalToday    String?   // 오늘 목표

  // 삭제 또는 미사용 처리
  // goalUltimate, goalLong, goalMonth
}

// 주간 계획용 새 모델
model WeeklyPlan {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      String   // YYYY-MM-DD (해당 날짜)
  mainGoal  String?  // 그 날의 메인 목표
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, date])
}
```

---

### 1.3 대시보드 복귀 네비게이션

#### 현재 상태
- 각 모듈에서 메인 대시보드로 돌아가는 버튼 없음

#### 요구사항
- [x] HeaderWrapper에 홈 버튼 추가
- [x] 로고 클릭 시 대시보드(`/`)로 이동
- [x] 또는 좌측 상단에 항상 홈 아이콘 표시

---

## 2. SUCCESS CODE (성공 코드)

### 2.1 프로젝트 삭제 기능

#### 현재 상태
- 프로젝트 생성만 가능
- 삭제 기능 없음

#### 요구사항
- [x] 프로젝트 상세 페이지에 "삭제" 버튼 추가
- [x] 삭제 확인 다이얼로그 표시
- [x] 관련 100개 Entry도 함께 삭제 (CASCADE)

##### 추가 액션
```typescript
// src/app/actions/success.ts
export async function deleteSuccessProject(projectId: string) {
  // 소유권 검증 후 삭제
}
```

---

### 2.2 100번 쓰기 노트 기능 (사진 업로드)

#### 기능 설명
- 100일 동안 매일 같은 문장을 100번 손으로 작성
- 작성한 노트를 사진으로 촬영하여 업로드
- 메모와 함께 기록

#### 요구사항

##### 2.2.1 Entry 기록 UI 변경
```
┌─────────────────────────────────────────┐
│  Day 15 기록하기                        │
├─────────────────────────────────────────┤
│  [사진 업로드 영역]                      │
│  ┌─────────────────────────────────┐   │
│  │  📷 사진을 업로드하세요          │   │
│  │  (클릭 또는 드래그)              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  메모:                                  │
│  ┌─────────────────────────────────┐   │
│  │ 오늘의 소감이나 메모를 적어주세요 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [확인] 버튼                            │
└─────────────────────────────────────────┘
```

##### 2.2.2 이미지 업로드 구현
- [x] 클라이언트에서 이미지 선택/촬영
- [x] 이미지 리사이징 (최대 1920px)
- [x] 클라우드 스토리지 업로드 (Vercel Blob 또는 Cloudinary)
- [x] URL을 DB에 저장

##### 2.2.3 업로드된 이미지 표시
- [x] 그리드에서 완료된 날짜 클릭 시 이미지 미리보기
- [x] 이미지 확대 모달

##### 기술 선택
- **Option A**: Vercel Blob Storage (추천 - Vercel 통합)
- **Option B**: Cloudinary (무료 티어 있음)
- **Option C**: Supabase Storage

##### DB 스키마 (기존 활용)
```prisma
model SuccessEntry {
  // 기존 필드
  content     String?   // 메모
  imageUrl    String?   // 이미지 URL (이미 존재)
  isCompleted Boolean
  completedAt DateTime?
}
```

---

## 3. DISCIPLINE MASTERY (규율 마스터리)

### 3.1 날짜 제한 규칙

#### 현재 상태
- 모든 날짜에서 규칙 체크 가능
- 과거 날짜도 수정 가능

#### 요구사항

##### 3.1.1 체크 가능 날짜 제한
- [x] **오늘만** 체크 가능
- [x] 과거 날짜: 읽기 전용 (체크 불가, 기록만 표시)
- [x] 미래 날짜: 체크 불가 (잠금 표시)

##### 3.1.2 날짜 네비게이션
- [x] 오늘 이전 날짜: 볼 수는 있지만 수정 불가
- [x] 내일 이후 날짜: 접근은 가능하나 "아직 체크할 수 없습니다" 메시지

##### 구현 로직
```typescript
// src/components/discipline/DisciplineList.tsx
const today = getTodayStr();
const isToday = date === today;
const isPast = date < today;
const isFuture = date > today;

// 체크 버튼 disabled 조건
const canCheck = isToday; // 오늘만 체크 가능
```

---

## 4. SELF EPISTLE (셀프 서신)

### 4.1 날짜 제한 규칙

#### 현재 상태
- 모든 날짜에 작성 가능

#### 요구사항
- [x] 과거 날짜: 작성 불가 (읽기 전용)
- [x] 오늘: 작성 가능
- [x] 내일: 작성 가능 (미래의 나에게 미리 쓰기)
- [x] 모레 이후: 접근 불가

---

### 4.2 오늘 페이지 구조 변경

#### 현재 상태
```
┌─────────────────┬─────────────────┐
│ 어제에게 쓰기   │ 내일에게 쓰기   │
└─────────────────┴─────────────────┘
```

#### 신규 구조
```
┌─────────────────────────────────────────┐
│  📬 받은 서신 (읽기 전용)               │
├─────────────────────────────────────────┤
│  어제의 내가 오늘의 나에게 쓴 편지:     │
│  ┌─────────────────────────────────┐   │
│  │ "오늘은 꼭 운동을 해라..."       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  (만약 있다면) 오늘 나에게 쓴 편지:     │
│  ┌─────────────────────────────────┐   │
│  │ "..."                           │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  ✍️ 서신 작성                          │
├─────────────────────────────────────────┤
│  어제의 나에게 (회고):                  │
│  ┌─────────────────────────────────┐   │
│  │ [텍스트 입력]                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  내일의 나에게 (다짐):                  │
│  ┌─────────────────────────────────┐   │
│  │ [텍스트 입력]                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [봉인하기] 버튼                        │
└─────────────────────────────────────────┘
```

#### 구현 요구사항
- [x] 오늘 페이지 진입 시 어제의 `toTomorrow` 데이터 조회하여 상단에 표시
- [x] 무드 이모지로 어제 감정 상태 함께 표시
- [x] 받은 서신 영역은 읽기 전용 (수정 불가)
- [x] 작성 영역은 현재와 동일하게 유지

##### 데이터 흐름
```
1. 1월 7일 (어제)
   - toYesterday: "1월 6일에게 쓴 편지"
   - toTomorrow: "1월 8일(오늘)의 나에게 쓴 편지" ← 이게 오늘 상단에 표시됨

2. 1월 8일 (오늘)
   - 상단: 1월 7일의 toTomorrow 표시 (읽기 전용)
   - 작성: toYesterday (1월 7일에게), toTomorrow (1월 9일에게)
```

---

## 5. BIO HACKING (바이오 해킹)

### 5.1 다국어 지원

#### 현재 상태
- 모든 칼럼이 영어로만 작성됨
- DB에 하드코딩된 seed 데이터

#### 요구사항

##### 5.1.1 다국어 콘텐츠 구조
- [x] 각 칼럼별 ko, en, ja 버전 지원
- [x] 사용자 locale에 따라 해당 언어 콘텐츠 표시
- [x] 번역이 없는 경우 fallback (en → ko → ja)

##### DB 스키마 변경
```prisma
model BioPost {
  id        String   @id @default(cuid())
  slug      String   @unique
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 다국어 콘텐츠
  translations BioPostTranslation[]
}

model BioPostTranslation {
  id        String   @id @default(cuid())
  postId    String
  post      BioPost  @relation(fields: [postId], references: [id], onDelete: Cascade)
  locale    String   // 'ko', 'en', 'ja'
  title     String
  content   String   // Markdown

  @@unique([postId, locale])
}
```

---

### 5.2 관리자 칼럼 추가 기능

#### 요구사항
- [x] 관리자 페이지에서 새 칼럼 작성
- [x] 마크다운 에디터 제공
- [x] 각 언어별 콘텐츠 입력
- [x] 미리보기 기능
- [x] 카테고리 선택 (Nutrition, Supplements, Recovery, Exercise, Mindset 등)

---

## 6. 관리자 페이지 (Admin Dashboard)

### 6.1 접근 제어

#### 요구사항
- [x] 특정 이메일 주소만 관리자로 지정 (환경변수 또는 DB)
- [x] 관리자 아닌 사용자 접근 시 403 에러
- [x] URL: `/admin` 또는 `/[locale]/admin`

##### 관리자 설정
```env
ADMIN_EMAILS="admin@example.com,dlgur03@gmail.com"
```

---

### 6.2 관리자 기능 목록

#### 6.2.1 사용자 관리
- [x] 전체 사용자 목록 조회
- [x] 사용자 검색 (이메일, 이름)
- [x] 사용자 상세 정보 보기
- [x] 사용자 삭제 (주의: 관련 데이터 모두 삭제)

#### 6.2.2 콘텐츠 관리 (Bio Hacking)
- [x] 칼럼 목록 조회
- [x] 새 칼럼 작성 (다국어)
- [x] 기존 칼럼 수정
- [x] 칼럼 삭제
- [x] 카테고리 관리

#### 6.2.3 통계 대시보드
- [x] 총 사용자 수
- [x] 일별/주별/월별 활성 사용자
- [x] 모듈별 사용 통계
  - Destiny: 일일 기록 수
  - Discipline: 평균 달성률
  - Success: 진행 중인 프로젝트 수
  - Epistle: 작성된 편지 수
- [x] 차트/그래프 시각화

#### 6.2.4 시스템 관리
- [x] 환경 변수 확인 (민감 정보 제외)
- [x] DB 연결 상태 확인
- [x] 에러 로그 조회 (선택사항)

---

### 6.3 관리자 UI 구조

```
/admin
├── /admin                    # 대시보드 (통계 요약)
├── /admin/users              # 사용자 관리
├── /admin/bio                # Bio Hacking 칼럼 관리
│   ├── /admin/bio/new        # 새 칼럼 작성
│   └── /admin/bio/[id]/edit  # 칼럼 수정
└── /admin/stats              # 상세 통계
```

---

## 개발 우선순위 및 일정

| 순위 | 항목 | 예상 복잡도 | 의존성 |
|------|------|-------------|--------|
| 1 | Destiny 핵심목표 편집 | 낮음 | - |
| 2 | 대시보드 복귀 네비게이션 | 낮음 | - |
| 3 | Discipline 날짜 제한 | 낮음 | - |
| 4 | Epistle 구조 변경 | 중간 | - |
| 5 | Success 삭제 기능 | 낮음 | - |
| 6 | Destiny 타임블록 개편 | 높음 | - |
| 7 | Destiny 템플릿 기능 | 중간 | #6 |
| 8 | Destiny 주간 계획 | 중간 | #1 |
| 9 | Success 이미지 업로드 | 높음 | 스토리지 설정 |
| 10 | Bio 다국어 지원 | 중간 | 스키마 변경 |
| 11 | 관리자 페이지 기본 | 중간 | - |
| 12 | 관리자 콘텐츠 관리 | 중간 | #10, #11 |
| 13 | 관리자 통계 | 높음 | #11 |

---

## 기술 스택 참고

- **Frontend**: Next.js 16.1.1, React 19, Tailwind CSS
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Auth**: NextAuth.js (Google OAuth)
- **i18n**: next-intl (ko, en, ja)
- **Image Storage**: Vercel Blob (권장) 또는 Cloudinary

---

## 참고 파일 위치

| 기능 | 파일 경로 |
|------|-----------|
| Destiny 페이지 | `src/app/[locale]/destiny/day/[date]/page.tsx` |
| Destiny 액션 | `src/app/actions/destiny.ts` |
| Success 페이지 | `src/app/[locale]/success/` |
| Success 액션 | `src/app/actions/success.ts` |
| Discipline 페이지 | `src/app/[locale]/discipline/day/[date]/page.tsx` |
| Discipline 액션 | `src/app/actions/discipline.ts` |
| Epistle 페이지 | `src/app/[locale]/epistle/day/[date]/page.tsx` |
| Epistle 액션 | `src/app/actions/epistle.ts` |
| Bio 페이지 | `src/app/[locale]/bio/` |
| Bio 액션 | `src/app/actions/bio.ts` |
| 헤더 | `src/components/HeaderWrapper.tsx` |
| DB 스키마 | `prisma/schema.prisma` |
