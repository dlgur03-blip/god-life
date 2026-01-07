# 갓생메이커 — Vibe Coding Prompt Plan (prompt_plan.md)

> 목적: LLM(바이브코딩)으로 **MVP를 빠르게 구현**하기 위한 실행 체크리스트 + 프롬프트 지침서.
> 기준 문서: *갓생메이커 개발자용 기능 명세서 v1.0* (DB DDL/모듈/플로우).

---

## 0) 운영 원칙
- **한 번에 한 단위**만 구현한다: (DB → API 1개 → 화면 1개 → 테스트).
- 모든 작업은 **Definition of Done(DoD)** 를 만족해야 체크한다.
- UI는 “아바타 무드(다크+시안 글로우+골드 포인트)”를 기본 테마로 한다.
- 날짜/주 계산은 **사용자 timezone(기본 Asia/Seoul)** 기준.

---

## 1) 기술 스택(추천)
- FE: Next.js (App Router) + TypeScript + Tailwind
- BE: Next.js Route Handlers(초기) 또는 NestJS(분리) — MVP는 **Next.js 단일 레포** 권장
- DB: Postgres
- ORM: Prisma
- Auth: NextAuth (Email/OAuth)
- Storage: S3 호환 + presigned upload(2차)

---

## 2) 구현 단계 체크리스트 (Milestones)

### M0. 레포/환경 세팅
- [ ] Next.js + TS + Tailwind 프로젝트 생성
- [ ] ESLint/Prettier 설정
- [ ] .env 템플릿 작성(LOCAL/PROD)
- [ ] DB(Postgres) 로컬 도커 구성
- [ ] Prisma 초기화 및 마이그레이션 파이프라인 구축

**DoD**
- `pnpm dev` 실행 시 기본 페이지 렌더
- `pnpm prisma migrate dev` 정상 동작

**LLM Prompt (권장)**
- “Next.js(App Router)+TS+Tailwind+Prisma+Postgres 로컬 도커까지 한 번에 세팅하는 커밋 단위 가이드를 만들어줘. 파일 트리와 명령어 포함.”

---

### M1. DB 스키마 반영(Prisma)
- [ ] users
- [ ] destiny_days
- [ ] destiny_timeblocks
- [ ] destiny_events
- [ ] success_projects
- [ ] success_entries
- [ ] discipline_rules
- [ ] discipline_checks
- [ ] epistle_days
- [ ] bio_posts
- [ ] assets(선택: 2차)

**DoD**
- Prisma schema로 모델 정의 완료
- 마이그레이션 1회로 테이블 생성
- 관계/Unique/enum/check(가능 범위) 반영

**LLM Prompt**
- “아래 Postgres DDL을 Prisma schema로 변환해줘. Unique/FK/enum/check는 Prisma에서 가능한 방식으로 반영하고, 불가능한 check는 DB 레벨 raw migration으로 보완해줘.”

---

### M2. Auth + Home Catalog
- [ ] NextAuth 로그인(Email 또는 Google)
- [ ] 로그인 후 홈(`/`)에서 5개 모듈 카드 노출
  - Destiny / Success / Discipline / Epistle / Bio
- [ ] 각 카드 클릭 시 라우팅
- [ ] 홈 요약 상태 API: 오늘 데이터 상태(미작성/작성 등) 최소 표시

**DoD**
- 로그인/로그아웃 정상
- 홈에서 5카드 보이고 클릭 이동
- 홈 요약 API가 사용자별로 동작

**LLM Prompt**
- “로그인 후 홈에 5개 모듈 카탈로그 카드 UI를 만들고, 각 카드에 오늘 상태 배지(미작성/작성)를 보여줘. Tailwind로 아바타 무드(다크+시안 글로우+골드)를 적용해줘.”

---

### M3. DESTINY NAVIGATOR (핵심) — Day 생성 + 11개 블록 + 실행기록
#### M3-1 Day Upsert
- [ ] `/destiny/day/[date]` 페이지 생성
- [ ] day 데이터 upsert(ultimate/long/month/week/today)
- [ ] day 없으면 자동 생성

#### M3-2 11개 시간블록 init
- [ ] day 최초 생성 시 timeblocks 11개 자동 생성
- [ ] 블록 필드: seq, start/end, location, plan_text, actual_text, score(0..10), feedback_text, status

#### M3-3 블록 편집 UI
- [ ] 계획 입력: 장소/계획
- [ ] 실행 입력: 실제/점수/피드백 템플릿
- [ ] 상태: planned/active/completed/skipped

**DoD**
- date로 페이지 접근 시 day + timeblocks가 항상 존재
- timeblock 저장/수정 후 새로고침해도 유지
- score 0..10 유효성

**LLM Prompt**
- “DESTINY 하루 페이지를 구현해줘. 상단 목표 5칸 + 아래 11개 타임블록 카드. 각 카드에서 계획 입력(장소/계획)과 실행 기록(실제/점수/피드백)을 토글로 전환. 저장은 서버 액션 또는 route handler로 upsert. 상태 뱃지(planned/active/completed/skipped) 포함.”

---

### M4. DESTINY 사건 기록(수시 입력)
- [ ] 플로팅 버튼(+)로 사건 기록 모달
- [ ] 저장 시 destiny_events 추가
- [ ] 하루 페이지 하단 타임라인 렌더

**DoD**
- 언제든 이벤트 추가 가능
- 이벤트 목록이 시간순으로 표시

**LLM Prompt**
- “DESTINY day 페이지에 플로팅 버튼으로 사건 기록 모달을 추가하고, 저장하면 events 테이블에 insert, 하단에 타임라인으로 렌더해줘.”

---

### M5. SUCCESS CODE — 프로젝트 + 100일 엔트리(텍스트)
#### M5-1 프로젝트 CRUD
- [ ] `/success` 프로젝트 리스트
- [ ] `/success/projects/new` 생성
- [ ] 프로젝트: title, start_date, reminder_time, enabled

#### M5-2 100일 엔트리 생성 로직
- [ ] 프로젝트 생성 시 success_entries 1..100 프리생성(권장)
- [ ] 프로젝트 상세에서 오늘 dayIndex 계산
- [ ] dayIndex 엔트리에 텍스트 입력 저장
- [ ] 실패 허용: dayIndex 미기록이면 언제든 기록 가능(해당 인덱스만)

#### M5-3 히스토리
- [ ] 캘린더 또는 리스트로 완료/미완료 표시

**DoD**
- 프로젝트 생성 후 100칸 엔트리 보임
- 오늘 dayIndex가 정확히 계산됨(timezone)
- 텍스트 저장/조회 정상

**LLM Prompt**
- “SUCCESS CODE 모듈 구현: 프로젝트 생성(title/start_date/reminder). 생성 시 100개 엔트리(dayIndex 1..100) 프리생성. 프로젝트 상세에서 오늘 dayIndex 계산해서 입력 UI 제공(채팅형 1문장). 캘린더/리스트로 완료/미완료 표시.”

---

### M6. SUCCESS CODE — 이미지 업로드(2차)
- [ ] presigned 업로드 엔드포인트
- [ ] 업로드 완료 후 assets 생성
- [ ] 엔트리에 image_asset_id 연결
- [ ] 상세에서 이미지 보기

**DoD**
- 모바일에서 촬영/업로드 가능
- 저장 후 재접속해도 이미지 표시

**LLM Prompt**
- “S3 presigned 업로드 플로우를 구현해줘: presign → PUT 업로드 → confirm로 assets row 생성 → success entry에 asset 연결.”

---

### M7. DISCIPLINE MASTERY — 규율 13개 + 일일 체크
- [ ] `/discipline/rules` 룰 CRUD + 정렬
- [ ] `/discipline/day/[date]` 체크리스트
- [ ] 체크 토글 저장(checked/checked_at)
- [ ] `/discipline/insights` 7일/30일 룰별 체크율

**DoD**
- 룰 생성/정렬 유지
- 오늘 체크 상태가 저장/복원
- 인사이트에서 룰별 체크율 계산

**LLM Prompt**
- “프랭클린식 DISCIPLINE 모듈 구현: 규율 룰 관리(최대 13개 권장), 오늘 체크리스트, 최근 7일/30일 룰별 체크율 인사이트.”

---

### M8. SELF EPISTLE — 날짜별 편지
- [ ] `/epistle/day/[date]` 입력 폼
  - to_yesterday / to_tomorrow / mood(optional)
- [ ] `/epistle/timeline` 리스트
- [ ] ZIP 템플릿은 UI 문항/레이아웃 참고로 폼 구성(2차: 템플릿 JSON화)

**DoD**
- 날짜별 저장/수정(upsert)
- 타임라인 열람

**LLM Prompt**
- “SELF EPISTLE 구현: 날짜별 편지(어제/내일) 입력 폼과 타임라인 리스트. 저장은 upsert, 날짜 이동은 캘린더로.”

---

### M9. BIO HACKING — 읽는 칼럼
- [ ] `/bio` 카테고리 카드 목록
- [ ] `/bio/[slug]` 칼럼 상세(Markdown 렌더)
- [ ] 시드 데이터 삽입
  - 방탄커피: C8 MCT + 기버터 + 녹차분말
  - 집중 스택: 알파 GPC, L-티로신, 마그네슘 L-트레온산, 크레아틴
  - 산책/물, 단백질 위주 식사

**DoD**
- 목록/상세 렌더
- 마크다운 안전 렌더링

**LLM Prompt**
- “BIO HACKING: 카테고리 목록과 slug 상세(마크다운) 페이지를 만들고, 요청된 스택/가이드를 포함한 시드 포스트 8개를 만들어 DB에 삽입하는 스크립트를 작성해줘.”

---

### M10. 알림(푸시) — SUCCESS CODE 우선
- [ ] 프로젝트별 reminder_time/enable 저장
- [ ] 스케줄러(cron)로 매일 발송
- [ ] 오늘 dayIndex 미기록이면만 발송

**DoD**
- 특정 유저에게 테스트 푸시 가능
- 미기록일 때만 발송

**LLM Prompt**
- “사용자 timezone 기준으로 success project reminder_time에 맞춰, 오늘 dayIndex 미기록이면만 푸시를 발송하는 cron job을 구현해줘.”

---

## 3) 화면/UX 공통 체크리스트
- [ ] Loading skeleton 적용
- [ ] Empty state 문구 + CTA
- [ ] Error state(재시도 버튼)
- [ ] 모바일 1열 우선 레이아웃
- [ ] 다크+시안 글로우+골드 포인트 일관성

---

## 4) 데이터/검증 체크리스트
- [ ] destiny_timeblocks.score: 0..10
- [ ] destiny_timeblocks.seq: 1..11 unique
- [ ] success_entries.day_index: 1..100 unique
- [ ] discipline_checks unique(user, rule, date)
- [ ] 모든 API는 user_id 스코프 확인
- [ ] timezone 기반 dayIndex/오늘 날짜 계산

---

## 5) 테스트 시나리오(최소)

### DESTINY
- [ ] `/destiny/day/today` 접속 → day+11블록 자동 생성
- [ ] 블록 계획 저장 → 새로고침 유지
- [ ] 블록 실행 기록 저장(점수 포함) → 유지
- [ ] 사건 기록 추가 → 타임라인 표시

### SUCCESS
- [ ] 프로젝트 생성 → 100엔트리 생성
- [ ] 오늘 dayIndex 정확
- [ ] 텍스트 기록 저장
- [ ] 캘린더/리스트 완료 표시

### DISCIPLINE
- [ ] 룰 생성/정렬
- [ ] 오늘 체크 토글 저장
- [ ] 7일 인사이트 계산

### EPISTLE
- [ ] 날짜별 편지 저장/수정
- [ ] 타임라인 열람

### BIO
- [ ] 목록/상세 렌더
- [ ] 마크다운 렌더 안전

---

## 6) 커밋/브랜치 규칙(권장)
- 브랜치: `feat/<module>-<scope>`
- 커밋: 작은 단위(한 화면/한 API)
- PR 템플릿: 목적/스크린샷/테스트 체크

---

## 7) LLM에 던질 때의 “정답 프롬프트 패턴”
아래 형식을 유지하면 바이브코딩 품질이 안정된다.

**프롬프트 템플릿**
1) 목표(한 문장)
2) 범위(무엇/무엇 제외)
3) 파일/라우트/컴포넌트 목록
4) DB 모델(관련 테이블)
5) API 계약(Request/Response)
6) DoD(체크 기준)

---

## 8) MVP 컷라인(권장)
- 반드시 포함: Home, Destiny(11블록+점수/피드백+이벤트), Success(프로젝트+텍스트+100일), Discipline(룰+체크), Epistle(텍스트), Bio(읽기)
- 2차로 미룸: Success 이미지 업로드, 푸시 알림, 내보내기, 고급 통계

---

끝.
