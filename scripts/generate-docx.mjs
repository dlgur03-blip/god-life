import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, TableRow, TableCell, Table,
  WidthType, ShadingType, PageOrientation,
} from 'docx';
import fs from 'fs';

// ── Colors ──
const PRIMARY = '1A1A2E';
const ACCENT = 'E94560';
const ACCENT2 = '0F3460';
const GRAY = '666666';
const LIGHT_BG = 'F5F5F5';
const WHITE = 'FFFFFF';

// ── Helpers ──
const heading = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 400 : 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 26 : 22, color: level === HeadingLevel.HEADING_1 ? ACCENT : PRIMARY, font: 'Malgun Gothic' })],
  });

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 100 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [new TextRun({ text, size: opts.size || 20, color: opts.color || '333333', bold: opts.bold || false, italics: opts.italic || false, font: 'Malgun Gothic' })],
  });

const bullet = (text) =>
  new Paragraph({
    spacing: { after: 60 },
    indent: { left: 300 },
    children: [
      new TextRun({ text: '• ', size: 20, color: ACCENT, font: 'Malgun Gothic' }),
      new TextRun({ text, size: 20, color: '333333', font: 'Malgun Gothic' }),
    ],
  });

const quote = (text) =>
  new Paragraph({
    spacing: { before: 150, after: 150 },
    indent: { left: 400, right: 400 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
    children: [new TextRun({ text, size: 20, italics: true, color: ACCENT2, font: 'Malgun Gothic' })],
  });

const spacer = () => new Paragraph({ spacing: { after: 100 }, children: [] });

const tableRow = (cells, isHeader = false) =>
  new TableRow({
    children: cells.map((text) =>
      new TableCell({
        width: { size: Math.floor(9000 / cells.length), type: WidthType.DQ },
        shading: isHeader ? { type: ShadingType.SOLID, color: ACCENT2, fill: ACCENT2 } : { type: ShadingType.SOLID, color: WHITE, fill: WHITE },
        children: [new Paragraph({
          spacing: { before: 40, after: 40 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: String(text), size: 18, bold: isHeader, color: isHeader ? WHITE : '333333', font: 'Malgun Gothic' })],
        })],
      })
    ),
  });

const simpleTable = (headers, rows) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableRow(headers, true),
      ...rows.map((r) => tableRow(r)),
    ],
  });

// ── Document ──
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Malgun Gothic', size: 20 } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 600, bottom: 600, left: 500, right: 500 },
          size: { width: 12240, height: 15840 },
        },
      },
      children: [
        // ─── COVER ───
        spacer(), spacer(), spacer(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: '🏆', size: 60, font: 'Segoe UI Emoji' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 50 }, children: [new TextRun({ text: 'GOD LIFE MAKER', size: 44, bold: true, color: PRIMARY, font: 'Malgun Gothic' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 50 }, children: [new TextRun({ text: '갓생메이커', size: 32, color: ACCENT, font: 'Malgun Gothic' })] }),
        spacer(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'AI 자기계발 코칭 플랫폼 사업 기획서', size: 24, color: GRAY, font: 'Malgun Gothic' })] }),
        spacer(),
        body('버전: v2.0', { center: true, color: GRAY, size: 18 }),
        body('작성일: 2026-03-03', { center: true, color: GRAY, size: 18 }),
        spacer(), spacer(), spacer(),
        quote('"매일 아침, AI 코치와 5분의 대화로 당신의 갓생이 시작됩니다."'),

        // ─── 1. 사업 개요 ───
        heading('1. 사업 개요'),
        heading('서비스명', HeadingLevel.HEADING_3),
        body('GOD LIFE MAKER (갓생메이커)', { bold: true, size: 22 }),
        spacer(),
        heading('한 줄 요약', HeadingLevel.HEADING_3),
        quote('AI가 매일의 대화를 통해 목표 설정부터 실행까지 모든 것을 함께 채워주는, 과학 기반 올인원 자기계발 플랫폼'),
        spacer(),
        heading('미션', HeadingLevel.HEADING_3),
        body('사용자가 흩어진 목표, 습관, 재무, 건강, 감정을 하나의 시스템에서 관리하고, AI 코치와 대화를 통해 자연스럽게 모든 모듈을 채워나가며 실행력을 극대화합니다.'),
        spacer(),
        heading('핵심 가치', HeadingLevel.HEADING_3),
        simpleTable(
          ['가치', '설명'],
          [
            ['AI 코칭', '대화를 통해 목표·계획·기록을 자동으로 채워주는 AI 파트너'],
            ['과학 기반', '심리학·뇌과학 연구로 검증된 방법론 기반 모듈'],
            ['올인원', '목표·습관·일지·재무·건강·동기분석을 하나의 플랫폼에'],
            ['바이럴 설계', '비로그인 심리검사(MET)로 자연스러운 사용자 유입'],
            ['글로벌', '한국어·영어·일본어·중국어·힌디어 5개 언어'],
          ]
        ),

        // ─── 2. 시장 분석 ───
        heading('2. 시장 분석'),
        heading('시장 규모', HeadingLevel.HEADING_3),
        simpleTable(
          ['시장', '규모'],
          [
            ['글로벌 자기계발', '$56.7B (2025) → $81.6B (2030)'],
            ['생산성 앱', '$92.4B (2025)'],
            ['디지털 헬스 & 웰니스', '$385B (2025)'],
            ['AI 코칭', '$4.5B → $20B+ (2030)'],
          ]
        ),
        spacer(),
        heading('타겟 고객', HeadingLevel.HEADING_3),
        bullet('1차: MZ세대 자기계발러 (20~35세) — "갓생" 문화 공감, SNS 공유 활발'),
        bullet('2차: 직장인/프리랜서 (25~45세) — 체계적 목표 관리, 시간관리 고민'),
        bullet('3차: 자기계발 초보자 — AI 가이드가 필수, 무엇부터 시작할지 모름'),
        bullet('4차: 글로벌 셀프헬프 사용자 — 영어/일본어/중국어/힌디어권'),
        spacer(),
        heading('경쟁 분석', HeadingLevel.HEADING_3),
        simpleTable(
          ['경쟁사', '약점', '갓생메이커 차별화'],
          [
            ['Notion', '빈 캔버스, AI 약함', 'AI가 대화로 채워줌'],
            ['Habitica', '습관만 추적', '목표→실행→회고 풀사이클'],
            ['ChatGPT', '데이터 지속 없음', '구조화 모듈 + AI 통합'],
            ['Coach.me', '영어 전용, 비쌈', 'AI 자동 코칭, 다국어, 무료'],
          ]
        ),

        // ─── 3. 제품 구조 ───
        heading('3. 제품 구조'),
        heading('현재 모듈 (v1.0 — 구축 완료)', HeadingLevel.HEADING_2),
        simpleTable(
          ['#', '모듈명', '핵심 기능', '과학적 근거'],
          [
            ['1', '운명 네비게이터', '10단계 목표 + 24시간 타임블록', 'Cal Newport, 코비 7습관'],
            ['2', '성공 코드', '100일 일관성 챌린지', 'James Clear 아토믹 해빗'],
            ['3', '규율 마스터리', '13개 규율 규칙 + 달성률', 'Huberman aMCC, Goggins'],
            ['4', '셀프 서신', '감사·사건·반성 구조 일지', 'Emmons 감사연구, Pennebaker'],
            ['5', '바이오 해킹', '수면·영양·운동 과학콘텐츠', 'Huberman, Matthew Walker'],
            ['6', '머니 플로우', '수입/지출 기록 + 월간 요약', '돈의 속성, 돈의 심리학'],
            ['7', 'MET 동기검사', '30문항 AI 분석 + SNS 공유', 'SDT, McClelland, Higgins'],
          ]
        ),
        spacer(),
        heading('v2.0 비전: AI 코칭 시스템', HeadingLevel.HEADING_2),
        quote('"AI가 대화를 통해 모든 모듈을 자연스럽게 채워주는 자기계발 코치"'),
        spacer(),
        heading('AI 자동 채움 시스템', HeadingLevel.HEADING_3),
        simpleTable(
          ['대화 내용', '연결 모듈', '동작'],
          [
            ['"오늘 짜증나는 일 있었어"', '셀프 서신', '분노 항목 자동 기입'],
            ['"이번 주 운동 3번 하고 싶어"', '규율 마스터리', '규칙 자동 생성'],
            ['"3개월 안에 토익 900"', '운명 네비게이터', '목표 자동 분해'],
            ['"커피 5천원, 점심 1.2만원"', '머니 플로우', '지출 자동 기록'],
            ['"100일 독서 챌린지"', '성공 코드', '프로젝트 자동 생성'],
          ]
        ),
        spacer(),
        heading('AI 프로액티브 유도', HeadingLevel.HEADING_3),
        bullet('"셀프 서신을 아직 안 쓰셨네요! 오늘 하루 이야기해볼까요?"'),
        bullet('"규율 체크가 3일째 비어있어요. 잠깐 확인해볼까요?"'),
        bullet('"이번 달 지출이 23% 늘었어요. 함께 점검해볼까요?"'),
        bullet('"100일 챌린지 Day 47! 오늘의 기록을 남겨볼까요?"'),
        spacer(),
        heading('실행력 레벨 시스템', HeadingLevel.HEADING_3),
        simpleTable(
          ['레벨', '이름', '기준', 'AI 행동'],
          [
            ['Lv.1', '씨앗', '가입 직후', 'AI가 거의 모든 걸 대화로 채움'],
            ['Lv.2', '새싹', '7일 연속 접속', 'AI 2개 모듈 유도'],
            ['Lv.3', '나무', '30일 활동', '리마인더 + 분석 중심'],
            ['Lv.4', '숲', '100일 활동', '인사이트 + 패턴 분석'],
            ['Lv.5', '갓생', '전 모듈 활성', '전략 자문가로 전환'],
          ]
        ),
        spacer(),
        heading('초기 온보딩 플로우', HeadingLevel.HEADING_3),
        bullet('① MET 동기원형검사 수행 (이미 구축)'),
        bullet('② 실행력 자가진단 설문 (시간, 경험, 관심 영역)'),
        bullet('③ AI 진단 대화 (맞춤 모듈 우선순위 추천)'),
        bullet('④ 개인화된 대시보드 생성'),

        // ─── 4. 비즈니스 모델 ───
        heading('4. 비즈니스 모델'),
        heading('수익 전략: 후원 기반 운영', HeadingLevel.HEADING_2),
        body('초기에는 유료 구독 대신 후원/기부 모델로 운영합니다. 사용자가 가치를 느끼면 자발적으로 후원하는 구조입니다.'),
        spacer(),
        simpleTable(
          ['단계', '시기', '전략'],
          [
            ['Phase 1: 성장', '현재~2026 Q3', '완전 무료 + 후원 버튼 + MET 바이럴'],
            ['Phase 2: 확장', '2026 Q4~', '후원 + 프리미엄 옵션 추가 검토'],
            ['Phase 3: 스케일', '2027~', 'B2B 기업 코칭 라이센스'],
          ]
        ),
        spacer(),
        heading('후원 모델 구조', HeadingLevel.HEADING_3),
        bullet('커피 한 잔 (₩3,000) — "갓생메이커를 응원합니다"'),
        bullet('점심 한 끼 (₩10,000) — "더 좋은 기능 개발에 기여"'),
        bullet('갓생 후원자 (₩30,000) — "갓생 후원자 배지 + 감사 목록"'),
        bullet('자유 금액 후원 — 사용자가 원하는 만큼'),
        spacer(),
        heading('운영비 구조 (극도로 린)', HeadingLevel.HEADING_3),
        simpleTable(
          ['항목', '월 비용', '비고'],
          [
            ['Vercel 호스팅', '$0~20', 'Hobby/Pro 플랜'],
            ['Neon DB', '$0~19', 'Free/Launch 플랜'],
            ['Gemini AI API', '~$5', 'Flash Lite 모델 (초저가)'],
            ['도메인', '~$1.3', 'godlife.kr 연간 $15'],
            ['합계', '~$30~50/월', '극도로 린한 구조'],
          ]
        ),

        // ─── 5. 기술 스택 ───
        heading('5. 기술 스택'),
        simpleTable(
          ['계층', '기술'],
          [
            ['프론트엔드', 'Next.js 16 + React 19 + TypeScript + Tailwind CSS 4'],
            ['백엔드', 'Next.js Server Actions + API Routes (Serverless)'],
            ['데이터베이스', 'PostgreSQL (Neon Cloud) + Prisma ORM'],
            ['인증', 'NextAuth.js (Google OAuth)'],
            ['AI', 'Google Gemini 2.5 Flash Lite'],
            ['배포', 'Vercel (자동 CI/CD, Edge Network)'],
            ['i18n', 'next-intl (5개 언어)'],
          ]
        ),

        // ─── 6. 성장 전략 ───
        heading('6. 성장 전략'),
        heading('사용자 획득 퍼널', HeadingLevel.HEADING_3),
        bullet('① MET 동기검사 (비로그인, 무료) → SNS 공유'),
        bullet('② 결과 페이지 OG 카드 → 친구 피드 노출'),
        bullet('③ "나도 갓생 시작하기" CTA → 회원가입 (1클릭)'),
        bullet('④ AI 온보딩 대화 → 첫 모듈 세팅'),
        bullet('⑤ AI 리마인더 → 일일 활성 유저 유지'),
        spacer(),
        heading('채널별 비중', HeadingLevel.HEADING_3),
        simpleTable(
          ['채널', '전략', '비중'],
          [
            ['MET 바이럴', '"내 동기유형은 ○○!" SNS 공유', '40%'],
            ['콘텐츠 마케팅', '"갓생" 키워드 SEO, 블로그', '25%'],
            ['커뮤니티', '에브리타임, 블라인드, 레딧', '20%'],
            ['인플루언서', '자기계발 유튜버 협업', '10%'],
            ['유료 광고', 'Phase 2 이후', '5%'],
          ]
        ),
        spacer(),
        heading('성장 마일스톤', HeadingLevel.HEADING_3),
        simpleTable(
          ['시기', '목표', '핵심 액션'],
          [
            ['2026 Q1 ✅', 'MVP 출시 (7개 모듈)', '완료'],
            ['2026 Q2', 'AI 코칭 v2.0', '채팅 UI + 자동채움 + 온보딩'],
            ['2026 Q3', 'MAU 10,000', 'MET 바이럴 + 콘텐츠'],
            ['2026 Q4', '후원 수익화', '후원 시스템 고도화'],
            ['2027 Q1', '모바일 앱', 'PWA → 네이티브'],
            ['2027 Q2', 'MAU 50,000', '일본/영어권 확장'],
          ]
        ),

        // ─── 7. 경쟁 우위 ───
        heading('7. 경쟁 우위'),
        bullet('AI가 채워주는 구조 — 빈 캔버스가 아닌, 대화만으로 모든 모듈 자동 채움'),
        bullet('과학 기반 모듈 — 각 모듈에 구체적 연구 논문과 베스트셀러 근거 내장'),
        bullet('"갓생" 문화 코드 — 한국 MZ세대 자기계발 문화를 정확히 반영'),
        bullet('바이럴 내장 설계 — MET 심리검사가 비로그인 유입 채널'),
        bullet('풀사이클 커버 — 목표→실행→기록→회고→건강→재무'),
        bullet('실행력 레벨 시스템 — AI가 사용자 수준에 맞춰 코칭 강도 자동 조절'),
        spacer(),
        heading('참고 베스트셀러', HeadingLevel.HEADING_3),
        simpleTable(
          ['영역', '주요 참고'],
          [
            ['습관', 'Atomic Habits, Tiny Habits'],
            ['시간', 'Deep Work, 7 Habits'],
            ['의지력', 'Willpower, Can\'t Hurt Me'],
            ['뇌과학', 'Huberman, Why We Sleep'],
            ['감정', 'Emmons 감사연구, Pennebaker'],
            ['재무', '돈의 속성, 돈의 심리학'],
            ['동기', 'SDT, McClelland, Higgins'],
          ]
        ),

        // ─── 8. 리스크 대응 ───
        heading('8. 리스크 & 대응'),
        simpleTable(
          ['리스크', '대응'],
          [
            ['AI API 비용 급등', '멀티 프로바이더 교체 가능 설계'],
            ['리텐션 저하', 'AI 프로액티브 알림 + 게이미피케이션'],
            ['경쟁사 유사 서비스', '"갓생" 브랜딩 + 한국 문화 최적화'],
            ['개인정보 이슈', 'IP 해시만 저장, 로그인 선택'],
            ['AI 환각', 'JSON 스키마 강제 + 폴백 로직'],
          ]
        ),

        // ─── 9. KPI ───
        heading('9. 핵심 지표 (KPIs)'),
        simpleTable(
          ['카테고리', '지표', '6개월 목표'],
          [
            ['성장', 'MAU', '10,000'],
            ['성장', 'MET 검사 완료', '30,000'],
            ['성장', 'SNS 공유율', '40%+'],
            ['리텐션', 'D7 리텐션', '30%'],
            ['리텐션', 'D30 리텐션', '15%'],
            ['참여', 'AI 대화수/일', '5회+'],
            ['참여', '규율 달성률', '70%+'],
            ['후원', '후원 전환율', '3%+'],
          ]
        ),

        // ─── CLOSING ───
        spacer(), spacer(),
        heading('요약'),
        body('갓생메이커는 "갓생"이라는 한국 MZ세대의 강력한 문화코드를 기반으로, AI가 대화를 통해 자기계발의 모든 영역을 자동으로 채워주는 올인원 플랫폼입니다.', { bold: true }),
        spacer(),
        body('✅ 7개 핵심 모듈 구축 완료'),
        body('✅ AI 동기분석(MET) 바이럴 엔진 가동'),
        body('✅ 5개 언어 글로벌 지원'),
        body('✅ 월 $30~50의 극도로 린한 운영'),
        spacer(),
        body('🚀 AI 코칭 채팅 시스템 (v2.0) 구현 중'),
        body('🚀 실행력 레벨 시스템 개발 예정'),
        body('🚀 후원 기반 수익 모델 운영'),
        spacer(), spacer(),
        quote('"매일 아침, AI 코치와 5분의 대화로 당신의 갓생이 시작됩니다."'),
        spacer(),
        body('문의: dlgur03@gmail.com', { center: true, color: GRAY, size: 18 }),
        body('godlife.kr', { center: true, color: ACCENT, size: 18, bold: true }),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync('docs/갓생메이커_사업기획서.docx', buffer);
console.log('✅ Word 문서 생성 완료: docs/갓생메이커_사업기획서.docx');
