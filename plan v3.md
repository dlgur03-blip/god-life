# Plan v3 - God Life App 개선 계획

## 목차
1. [데스티니 네비게이터 - 목표 계층 시스템](#1-데스티니-네비게이터---목표-계층-시스템)
2. [주간 계획 - 적응형 주간 뷰](#2-주간-계획---적응형-주간-뷰)
3. [타임블록 시간 확장](#3-타임블록-시간-확장)
4. [타임블록 시간 수정 버그 수정](#4-타임블록-시간-수정-버그-수정)
5. [성공코드 이미지 업로드 수정](#5-성공코드-이미지-업로드-수정)
6. [바이오해킹 칼럼 오류 수정](#6-바이오해킹-칼럼-오류-수정)
7. [셀프서신 날짜 제한 및 UI 개선](#7-셀프서신-날짜-제한-및-ui-개선)
8. [관리자 대시보드 분리](#8-관리자-대시보드-분리)
9. [피드백 푸터 추가](#9-피드백-푸터-추가)
10. [다국어 지원 개선](#10-다국어-지원-개선)

---

## 1. 데스티니 네비게이터 - 목표 계층 시스템

### 1.1 개요
사용자가 장기 목표부터 단기 목표까지 체계적으로 관리할 수 있는 목표 계층 시스템 구현

### 1.2 목표 계층 구조
```
궁극의 목표 (Ultimate Goal)
    └── 10년 목표 (10 Year Goal)
        └── 5년 목표 (5 Year Goal)
            └── 1년 목표 (1 Year Goal)
                └── 6개월 목표 (6 Month Goal)
                    └── 3개월 목표 (3 Month Goal)
                        └── 1개월 목표 (1 Month Goal)
                            └── 1주 목표 (1 Week Goal)
```

### 1.3 데이터베이스 스키마 변경

```prisma
model Goal {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        GoalType
  title       String
  description String?  @db.Text

  // 계층 관계
  parentId    String?
  parent      Goal?    @relation("GoalHierarchy", fields: [parentId], references: [id])
  children    Goal[]   @relation("GoalHierarchy")

  // 메타데이터
  startDate   DateTime?
  targetDate  DateTime?
  progress    Int      @default(0)  // 0-100
  status      GoalStatus @default(ACTIVE)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId, type])
}

enum GoalType {
  ULTIMATE      // 궁극의 목표
  TEN_YEAR      // 10년 목표
  FIVE_YEAR     // 5년 목표
  ONE_YEAR      // 1년 목표
  SIX_MONTH     // 6개월 목표
  THREE_MONTH   // 3개월 목표
  ONE_MONTH     // 1개월 목표
  ONE_WEEK      // 1주 목표
}

enum GoalStatus {
  ACTIVE
  COMPLETED
  PAUSED
  CANCELLED
}
```

### 1.4 UI 컴포넌트 구조

```
src/components/destiny/goals/
├── GoalHierarchyView.tsx       # 전체 계층 뷰
├── GoalCard.tsx                # 개별 목표 카드
├── GoalEditor.tsx              # 목표 생성/수정 모달
├── GoalProgressBar.tsx         # 진행률 표시
├── GoalTypeSelector.tsx        # 목표 유형 선택
├── GoalConnectionLine.tsx      # 계층 연결선
└── GoalEmptyState.tsx          # 빈 상태 UI
```

### 1.5 페이지 구조

```
src/app/[locale]/destiny/
├── goals/
│   ├── page.tsx                # 목표 계층 전체 보기
│   └── [type]/
│       └── page.tsx            # 특정 유형 목표 목록
```

### 1.6 Server Actions

```typescript
// src/app/actions/goals.ts

// 목표 CRUD
createGoal(data: CreateGoalInput): Promise<Goal>
updateGoal(id: string, data: UpdateGoalInput): Promise<Goal>
deleteGoal(id: string): Promise<void>

// 목표 조회
getGoalsByType(type: GoalType): Promise<Goal[]>
getGoalHierarchy(): Promise<GoalHierarchy>
getGoalWithChildren(id: string): Promise<Goal>

// 진행률 업데이트
updateGoalProgress(id: string, progress: number): Promise<Goal>
```

### 1.7 UI/UX 상세

- **계층 시각화**: 트리 뷰 또는 아코디언 형태로 표시
- **색상 구분**: 각 목표 유형별 다른 색상 사용
  - 궁극의 목표: Gold (#FFD700)
  - 10년: Purple (#8B5CF6)
  - 5년: Blue (#3B82F6)
  - 1년: Green (#10B981)
  - 6개월: Teal (#14B8A6)
  - 3개월: Orange (#F97316)
  - 1개월: Pink (#EC4899)
  - 1주: Gray (#6B7280)
- **드래그앤드롭**: 하위 목표를 상위 목표에 연결
- **진행률 자동 계산**: 하위 목표 완료 시 상위 목표 진행률 자동 업데이트

### 1.8 다국어 메시지

```json
// messages/ko.json
{
  "goals": {
    "title": "목표 관리",
    "types": {
      "ultimate": "궁극의 목표",
      "tenYear": "10년 목표",
      "fiveYear": "5년 목표",
      "oneYear": "1년 목표",
      "sixMonth": "6개월 목표",
      "threeMonth": "3개월 목표",
      "oneMonth": "1개월 목표",
      "oneWeek": "1주 목표"
    },
    "addGoal": "목표 추가",
    "editGoal": "목표 수정",
    "deleteGoal": "목표 삭제",
    "progress": "진행률",
    "noGoals": "아직 설정된 목표가 없습니다",
    "createFirst": "첫 번째 목표를 만들어보세요"
  }
}

// messages/en.json
{
  "goals": {
    "title": "Goal Management",
    "types": {
      "ultimate": "Ultimate Goal",
      "tenYear": "10 Year Goal",
      "fiveYear": "5 Year Goal",
      "oneYear": "1 Year Goal",
      "sixMonth": "6 Month Goal",
      "threeMonth": "3 Month Goal",
      "oneMonth": "1 Month Goal",
      "oneWeek": "1 Week Goal"
    },
    "addGoal": "Add Goal",
    "editGoal": "Edit Goal",
    "deleteGoal": "Delete Goal",
    "progress": "Progress",
    "noGoals": "No goals set yet",
    "createFirst": "Create your first goal"
  }
}

// messages/ja.json
{
  "goals": {
    "title": "目標管理",
    "types": {
      "ultimate": "究極の目標",
      "tenYear": "10年目標",
      "fiveYear": "5年目標",
      "oneYear": "1年目標",
      "sixMonth": "6ヶ月目標",
      "threeMonth": "3ヶ月目標",
      "oneMonth": "1ヶ月目標",
      "oneWeek": "1週間目標"
    },
    "addGoal": "目標を追加",
    "editGoal": "目標を編集",
    "deleteGoal": "目標を削除",
    "progress": "進捗",
    "noGoals": "まだ目標が設定されていません",
    "createFirst": "最初の目標を作成しましょう"
  }
}
```

---

## 2. 주간 계획 - 적응형 주간 뷰

### 2.1 개요
현재 요일을 기준으로 7일간의 주간 계획을 표시하는 적응형 주간 뷰 구현

### 2.2 로직 설명

```
예시:
- 오늘이 목요일 → 목요일 ~ 수요일 (7일)
- 오늘이 월요일 → 월요일 ~ 일요일 (7일)
- 오늘이 토요일 → 토요일 ~ 금요일 (7일)
```

### 2.3 유틸리티 함수

```typescript
// src/lib/date-utils.ts

/**
 * 적응형 주간 날짜 범위 계산
 * @param today 기준 날짜 (기본값: 오늘)
 * @returns 7일간의 날짜 배열
 */
export function getAdaptiveWeekDates(today: Date = new Date()): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
}

/**
 * 주간 범위 라벨 생성
 * @param startDate 시작 날짜
 * @param locale 로케일
 * @returns "1/8 (목) ~ 1/14 (수)" 형식
 */
export function getWeekRangeLabel(startDate: Date, locale: string): string {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  };

  const start = startDate.toLocaleDateString(locale, formatOptions);
  const end = endDate.toLocaleDateString(locale, formatOptions);

  return `${start} ~ ${end}`;
}
```

### 2.4 컴포넌트 수정

```typescript
// src/components/destiny/WeeklyPlanGrid.tsx

interface WeeklyPlanGridProps {
  // 기존 props
}

export function WeeklyPlanGrid({ ... }: WeeklyPlanGridProps) {
  const weekDates = useMemo(() => getAdaptiveWeekDates(), []);

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((date, index) => (
        <DayColumn
          key={date.toISOString()}
          date={date}
          isToday={index === 0}
        />
      ))}
    </div>
  );
}
```

### 2.5 UI 표시

```
┌─────────────────────────────────────────────────────────────────┐
│  주간 계획: 1/9 (목) ~ 1/15 (수)                    [< 이전] [다음 >] │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│  목 1/9  │  금 1/10 │  토 1/11 │  일 1/12 │  월 1/13 │  화 1/14 │  수 1/15 │
│ (오늘)   │         │         │         │         │         │         │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ 타임블록 │ 타임블록 │ 타임블록 │ 타임블록 │ 타임블록 │ 타임블록 │ 타임블록 │
│   ...   │   ...   │   ...   │   ...   │   ...   │   ...   │   ...   │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

### 2.6 다국어 메시지

```json
// messages/ko.json
{
  "weeklyPlan": {
    "title": "주간 계획",
    "today": "오늘",
    "previous": "이전 주",
    "next": "다음 주"
  }
}

// messages/en.json
{
  "weeklyPlan": {
    "title": "Weekly Plan",
    "today": "Today",
    "previous": "Previous Week",
    "next": "Next Week"
  }
}

// messages/ja.json
{
  "weeklyPlan": {
    "title": "週間計画",
    "today": "今日",
    "previous": "前の週",
    "next": "次の週"
  }
}
```

---

## 3. 타임블록 시간 확장

### 3.1 개요
현재 16:00까지인 타임블록 기본 범위를 23:00까지 확장

### 3.2 변경 사항

```typescript
// src/lib/time-utils.ts

// 변경 전
export const DEFAULT_END_HOUR = 16;

// 변경 후
export const DEFAULT_END_HOUR = 23;

// 시간 범위 상수
export const TIME_CONFIG = {
  MIN_HOUR: 0,      // 00:00
  MAX_HOUR: 23,     // 23:00
  DEFAULT_START: 6, // 기본 시작 시간
  DEFAULT_END: 23,  // 기본 종료 시간
  INTERVAL: 30,     // 30분 단위
};
```

### 3.3 타임블록 생성 시 기본값

```typescript
// 새 타임블록 생성 시 기본값
const defaultTimeblock = {
  startTime: '09:00',
  endTime: '10:00',
  // ...
};
```

### 3.4 UI 조정

- 시간 선택 드롭다운: 00:00 ~ 23:30 (30분 단위)
- 타임라인 뷰: 스크롤 가능하게 전체 시간 표시
- 모바일: 현재 시간 근처로 자동 스크롤

---

## 4. 타임블록 시간 수정 버그 수정

### 4.1 문제 상황
```
An error occurred in the Server Components render.
The specific message is omitted in production builds to avoid leaking sensitive details.
```

### 4.2 원인 분석 필요 파일

```
src/app/[locale]/destiny/day/[date]/page.tsx
src/app/actions/destiny.ts
src/components/destiny/TimeRangeEditor.tsx
src/components/destiny/TimePicker.tsx
```

### 4.3 예상 원인 및 해결책

#### 4.3.1 Server/Client 경계 문제
```typescript
// 문제: Server Component에서 Client 전용 로직 사용
// 해결: 'use client' 지시어 추가 또는 컴포넌트 분리

// TimeRangeEditor.tsx
'use client';

import { useState } from 'react';
// ...
```

#### 4.3.2 Date 직렬화 문제
```typescript
// 문제: Date 객체가 서버에서 클라이언트로 전달될 때 직렬화 오류
// 해결: ISO 문자열로 변환

// 변경 전
return { date: new Date() }

// 변경 후
return { date: new Date().toISOString() }
```

#### 4.3.3 Prisma 쿼리 오류
```typescript
// 해결: 에러 핸들링 추가
export async function updateTimeblock(id: string, data: UpdateTimeblockInput) {
  try {
    const timeblock = await prisma.timeblock.update({
      where: { id },
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        // ...
      },
    });
    return { success: true, data: timeblock };
  } catch (error) {
    console.error('Timeblock update error:', error);
    return { success: false, error: 'Failed to update timeblock' };
  }
}
```

### 4.4 디버깅 단계

1. 로컬 개발 환경에서 에러 메시지 확인
2. Server Action에 try-catch 추가하여 에러 로깅
3. 데이터 유효성 검사 추가
4. Client/Server 컴포넌트 경계 확인

---

## 5. 성공코드 이미지 업로드 수정

### 5.1 문제 상황
이미지 업로드 기능이 실패함

### 5.2 확인 필요 파일

```
src/app/api/upload/route.ts
src/components/success/ImageUpload.tsx
src/lib/image-utils.ts
```

### 5.3 예상 원인 및 해결책

#### 5.3.1 파일 크기 제한
```typescript
// next.config.js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
```

#### 5.3.2 업로드 경로 문제
```typescript
// src/app/api/upload/route.ts
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // 파일 유효성 검사
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return Response.json({ error: 'File too large' }, { status: 400 });
    }

    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return Response.json({
      success: true,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

#### 5.3.3 Vercel 환경 (서버리스)
```typescript
// Vercel에서는 파일 시스템 사용 불가
// 외부 스토리지 서비스 사용 필요

// 옵션 1: Vercel Blob Storage
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const blob = await put(file.name, file, {
    access: 'public',
  });

  return Response.json({ url: blob.url });
}

// 옵션 2: Cloudinary
// 옵션 3: AWS S3
// 옵션 4: Supabase Storage
```

### 5.4 클라이언트 컴포넌트 수정

```typescript
// src/components/success/ImageUpload.tsx
'use client';

import { useState } from 'react';

export function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>업로드 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

---

## 6. 바이오해킹 칼럼 오류 수정

### 6.1 문제 상황
- 칼럼이 보이지 않음
- "최적화 칼럼 및 데이터베이스" → "최적화 칼럼"으로 변경 필요
- 카테고리 추가 기능 필요

### 6.2 확인 필요 파일

```
src/app/[locale]/bio/page.tsx
src/app/[locale]/bio/[slug]/page.tsx
src/app/actions/bio.ts
prisma/schema.prisma
```

### 6.3 데이터베이스 스키마 확인 및 수정

```prisma
// prisma/schema.prisma

model BioCategory {
  id        String    @id @default(cuid())
  slug      String    @unique
  name      String
  nameEn    String?
  nameJa    String?
  order     Int       @default(0)
  posts     BioPost[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model BioPost {
  id          String       @id @default(cuid())
  slug        String       @unique
  categoryId  String
  category    BioCategory  @relation(fields: [categoryId], references: [id])

  // 다국어 콘텐츠
  titleKo     String
  titleEn     String?
  titleJa     String?
  contentKo   String       @db.Text
  contentEn   String?      @db.Text
  contentJa   String?      @db.Text

  published   Boolean      @default(false)
  order       Int          @default(0)

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([categoryId])
}
```

### 6.4 Server Actions 수정

```typescript
// src/app/actions/bio.ts

// 카테고리 CRUD
export async function getCategories() {
  return prisma.bioCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { posts: true } }
    }
  });
}

export async function createCategory(data: {
  slug: string;
  name: string;
  nameEn?: string;
  nameJa?: string;
}) {
  return prisma.bioCategory.create({ data });
}

export async function updateCategory(id: string, data: Partial<BioCategory>) {
  return prisma.bioCategory.update({
    where: { id },
    data
  });
}

export async function deleteCategory(id: string) {
  // 카테고리 내 포스트 존재 여부 확인
  const postsCount = await prisma.bioPost.count({
    where: { categoryId: id }
  });

  if (postsCount > 0) {
    throw new Error('Cannot delete category with posts');
  }

  return prisma.bioCategory.delete({ where: { id } });
}

// 포스트 조회 수정
export async function getPosts(categorySlug?: string) {
  return prisma.bioPost.findMany({
    where: {
      published: true,
      ...(categorySlug && {
        category: { slug: categorySlug }
      })
    },
    include: { category: true },
    orderBy: { order: 'asc' }
  });
}
```

### 6.5 UI 컴포넌트

```typescript
// src/components/bio/CategoryList.tsx
'use client';

import { useLocale } from 'next-intl';

interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  nameJa?: string;
  _count: { posts: number };
}

export function CategoryList({
  categories,
  selectedSlug
}: {
  categories: Category[];
  selectedSlug?: string;
}) {
  const locale = useLocale();

  const getLocalizedName = (cat: Category) => {
    if (locale === 'en' && cat.nameEn) return cat.nameEn;
    if (locale === 'ja' && cat.nameJa) return cat.nameJa;
    return cat.name;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <CategoryButton
        href="/bio"
        active={!selectedSlug}
        label="전체"
      />
      {categories.map(cat => (
        <CategoryButton
          key={cat.id}
          href={`/bio?category=${cat.slug}`}
          active={selectedSlug === cat.slug}
          label={getLocalizedName(cat)}
          count={cat._count.posts}
        />
      ))}
    </div>
  );
}
```

### 6.6 다국어 메시지 수정

```json
// messages/ko.json
{
  "bio": {
    "title": "바이오해킹",
    "subtitle": "최적화 칼럼",
    "categories": "카테고리",
    "allPosts": "전체 글",
    "noPosts": "아직 작성된 글이 없습니다",
    "addCategory": "카테고리 추가",
    "editCategory": "카테고리 수정",
    "deleteCategory": "카테고리 삭제"
  }
}

// messages/en.json
{
  "bio": {
    "title": "Biohacking",
    "subtitle": "Optimization Column",
    "categories": "Categories",
    "allPosts": "All Posts",
    "noPosts": "No posts yet",
    "addCategory": "Add Category",
    "editCategory": "Edit Category",
    "deleteCategory": "Delete Category"
  }
}

// messages/ja.json
{
  "bio": {
    "title": "バイオハッキング",
    "subtitle": "最適化コラム",
    "categories": "カテゴリー",
    "allPosts": "すべての記事",
    "noPosts": "まだ記事がありません",
    "addCategory": "カテゴリーを追加",
    "editCategory": "カテゴリーを編集",
    "deleteCategory": "カテゴリーを削除"
  }
}
```

---

## 7. 셀프서신 날짜 제한 및 UI 개선

### 7.1 개요
- 오늘 날짜만 작성 가능하도록 제한
- 미래 날짜는 잠금 처리
- UI 텍스트 변경: "어제/내일" → "어제의 나/내일의 나"

### 7.2 날짜 제한 로직

```typescript
// src/lib/date-utils.ts

export function isDateAccessible(targetDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  // 오늘만 접근 가능
  return target.getTime() === today.getTime();
}

export function getDateAccessStatus(targetDate: Date): 'past' | 'today' | 'future' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() < today.getTime()) return 'past';
  if (target.getTime() > today.getTime()) return 'future';
  return 'today';
}
```

### 7.3 Server Action 수정

```typescript
// src/app/actions/epistle.ts

export async function createEpistle(data: CreateEpistleInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  // 날짜 검증
  const targetDate = new Date(data.date);
  if (!isDateAccessible(targetDate)) {
    throw new Error('Can only write epistle for today');
  }

  // ... 기존 로직
}

export async function updateEpistle(id: string, data: UpdateEpistleInput) {
  // 기존 편지 조회
  const epistle = await prisma.epistle.findUnique({
    where: { id }
  });

  if (!epistle) {
    throw new Error('Epistle not found');
  }

  // 날짜 검증
  if (!isDateAccessible(epistle.date)) {
    throw new Error('Can only edit today\'s epistle');
  }

  // ... 기존 로직
}
```

### 7.4 잠금 UI 컴포넌트

```typescript
// src/components/epistle/DateAccessGuard.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Lock } from 'lucide-react';

interface DateAccessGuardProps {
  date: Date;
  children: React.ReactNode;
}

export function DateAccessGuard({ date, children }: DateAccessGuardProps) {
  const t = useTranslations('epistle');
  const status = getDateAccessStatus(date);

  if (status === 'future') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Lock className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-300 mb-2">
          {t('futureLocked')}
        </h2>
        <p className="text-gray-500">
          {t('futureLockedDescription')}
        </p>
      </div>
    );
  }

  if (status === 'past') {
    // 과거 날짜는 읽기 전용으로 표시
    return (
      <div className="relative">
        <div className="absolute top-2 right-2 bg-gray-700 px-2 py-1 rounded text-sm">
          {t('readOnly')}
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
```

### 7.5 UI 텍스트 변경

```json
// messages/ko.json
{
  "epistle": {
    "title": "셀프서신",
    "toYesterdayMe": "어제의 나에게",
    "toTomorrowMe": "내일의 나에게",
    "fromYesterdayMe": "어제의 나로부터",
    "fromTomorrowMe": "내일의 나로부터",
    "writeToYesterday": "어제의 나에게 편지 쓰기",
    "writeToTomorrow": "내일의 나에게 편지 쓰기",
    "futureLocked": "아직 열리지 않은 날입니다",
    "futureLockedDescription": "오늘의 편지만 작성할 수 있습니다",
    "readOnly": "읽기 전용",
    "today": "오늘"
  }
}

// messages/en.json
{
  "epistle": {
    "title": "Self Epistle",
    "toYesterdayMe": "To Yesterday's Me",
    "toTomorrowMe": "To Tomorrow's Me",
    "fromYesterdayMe": "From Yesterday's Me",
    "fromTomorrowMe": "From Tomorrow's Me",
    "writeToYesterday": "Write to Yesterday's Me",
    "writeToTomorrow": "Write to Tomorrow's Me",
    "futureLocked": "This day is not yet available",
    "futureLockedDescription": "You can only write today's epistle",
    "readOnly": "Read Only",
    "today": "Today"
  }
}

// messages/ja.json
{
  "epistle": {
    "title": "セルフレター",
    "toYesterdayMe": "昨日の私へ",
    "toTomorrowMe": "明日の私へ",
    "fromYesterdayMe": "昨日の私から",
    "fromTomorrowMe": "明日の私から",
    "writeToYesterday": "昨日の私へ手紙を書く",
    "writeToTomorrow": "明日の私へ手紙を書く",
    "futureLocked": "まだ開かれていない日です",
    "futureLockedDescription": "今日の手紙のみ作成できます",
    "readOnly": "読み取り専用",
    "today": "今日"
  }
}
```

---

## 8. 관리자 대시보드 분리

### 8.1 개요
- 바이오해킹 페이지에서 관리자 대시보드 링크 제거
- 관리자는 직접 URL로 접근 (`/[locale]/admin`)
- 바이오해킹은 순수 콘텐츠만 표시

### 8.2 변경 사항

#### 8.2.1 HeaderWrapper에서 Admin 링크 제거

```typescript
// src/components/HeaderWrapper.tsx

// 변경 전: 관리자에게 Admin 버튼 표시
// 변경 후: Admin 버튼 완전 제거

export function HeaderWrapper() {
  // Admin 관련 링크 제거
  // 네비게이션은 일반 메뉴만 표시
  return (
    <header>
      <nav>
        {/* Destiny, Discipline, Success, Epistle, Bio 링크만 */}
      </nav>
    </header>
  );
}
```

#### 8.2.2 바이오해킹 페이지 단순화

```typescript
// src/app/[locale]/bio/page.tsx

export default async function BioPage() {
  const categories = await getCategories();
  const posts = await getPosts();

  return (
    <div>
      <h1>{t('bio.title')}</h1>
      <p>{t('bio.subtitle')}</p>

      <CategoryList categories={categories} />
      <PostList posts={posts} />
    </div>
  );
}
```

### 8.3 관리자 접근 방법

```
관리자 URL (직접 입력):
- /ko/admin       - 대시보드
- /ko/admin/bio   - Bio 글 관리
- /ko/admin/users - 사용자 관리
- /ko/admin/stats - 통계
- /ko/admin/system - 시스템

환경변수로 관리자 이메일 설정:
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

---

## 9. 피드백 푸터 추가

### 9.1 개요
모든 페이지 하단에 피드백 이메일 링크 추가

### 9.2 공통 Footer 컴포넌트

```typescript
// src/components/FeedbackFooter.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';

export function FeedbackFooter() {
  const t = useTranslations('common');

  return (
    <footer className="mt-auto py-6 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{t('feedback')}: </span>
          <a
            href="mailto:dlgur03@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            dlgur03@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
```

### 9.3 레이아웃에 적용

```typescript
// src/app/[locale]/layout.tsx

import { FeedbackFooter } from '@/components/FeedbackFooter';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <FeedbackFooter />
    </div>
  );
}
```

### 9.4 다국어 메시지

```json
// messages/ko.json
{
  "common": {
    "feedback": "피드백 및 문의"
  }
}

// messages/en.json
{
  "common": {
    "feedback": "Feedback & Inquiries"
  }
}

// messages/ja.json
{
  "common": {
    "feedback": "フィードバック・お問い合わせ"
  }
}
```

---

## 10. 다국어 지원 개선

### 10.1 개요
- 모든 수정사항 3개 언어 (한/영/일) 적용
- 기기 설정 언어 자동 감지
- "Language" 버튼으로 언어 전환

### 10.2 언어 자동 감지 설정

```typescript
// src/middleware.ts

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true, // 브라우저 언어 자동 감지
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

```typescript
// src/i18n/config.ts

export const locales = ['ko', 'en', 'ja'] as const;
export const defaultLocale = 'ko' as const;

export type Locale = (typeof locales)[number];
```

### 10.3 Language 버튼 컴포넌트

```typescript
// src/components/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // 현재 경로에서 로케일 부분만 교체
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const currentLang = languages.find(l => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">Language</span>
          <span className="sm:hidden">{currentLang?.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            className={locale === lang.code ? 'bg-gray-800' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 10.4 Header에 Language 버튼 추가

```typescript
// src/components/HeaderWrapper.tsx

import { LanguageSwitcher } from './LanguageSwitcher';

export function HeaderWrapper() {
  return (
    <header className="...">
      <nav className="flex items-center justify-between">
        {/* 로고 */}
        <Logo />

        {/* 네비게이션 메뉴 */}
        <NavMenu />

        {/* 우측: Language + User */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
```

### 10.5 모바일 대응

```typescript
// 모바일에서는 아이콘만 표시
<button className="...">
  <Globe className="w-4 h-4" />
  <span className="hidden sm:inline">Language</span>
</button>
```

---

## 구현 우선순위

### Phase 1 - 버그 수정 (긴급)
1. 타임블록 시간 수정 버그 (#4)
2. 성공코드 이미지 업로드 (#5)
3. 바이오해킹 칼럼 오류 (#6)

### Phase 2 - 기능 개선
4. 타임블록 시간 확장 (#3)
5. 셀프서신 날짜 제한 (#7)
6. 관리자 대시보드 분리 (#8)

### Phase 3 - 새 기능
7. 주간 계획 적응형 (#2)
8. 목표 계층 시스템 (#1)

### Phase 4 - UX 개선
9. 피드백 푸터 (#9)
10. 다국어 지원 개선 (#10)

---

## 체크리스트

- [x] 1. 목표 계층 시스템 구현
- [x] 2. 적응형 주간 뷰 구현
- [x] 3. 타임블록 23시 확장
- [x] 4. 타임블록 수정 버그 해결
- [x] 5. 이미지 업로드 수정
- [x] 6. 바이오해킹 칼럼 수정
- [x] 7. 셀프서신 날짜 제한
- [x] 8. 관리자 대시보드 분리
- [x] 9. 피드백 푸터 추가
- [x] 10. Language 버튼 추가

---

## 참고 사항

- 모든 변경사항은 한국어, 영어, 일본어 3개 언어에 동시 적용
- 반응형 디자인 (모바일/데스크톱) 고려
- 기존 디자인 시스템 (Tailwind + shadcn/ui) 유지
- Server Actions 활용하여 API 엔드포인트 최소화
