'use server';

import { prisma } from "@/lib/prisma";
import type { Locale, BioPostWithTranslation } from '@/types/bio';

const FALLBACK_ORDER: Locale[] = ['en', 'ko', 'ja'];

/**
 * Resolves the best available translation for a post
 * Fallback order: requested locale → en → ko → ja
 */
function resolveTranslation(
  translations: { locale: string; title: string; content: string }[],
  requestedLocale: Locale
): { locale: Locale; title: string; content: string } | null {
  // Try requested locale first
  const requested = translations.find(t => t.locale === requestedLocale);
  if (requested) return { ...requested, locale: requestedLocale };

  // Fallback order
  for (const fallbackLocale of FALLBACK_ORDER) {
    const fallback = translations.find(t => t.locale === fallbackLocale);
    if (fallback) return { ...fallback, locale: fallbackLocale };
  }

  return null;
}

export async function getBioPosts(locale: Locale = 'en'): Promise<BioPostWithTranslation[]> {
  // Auto-seed if empty
  const count = await prisma.bioPost.count();
  if (count === 0) {
    await seedBioPosts();
  }

  const posts = await prisma.bioPost.findMany({
    include: {
      translations: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return posts
    .map(post => {
      const translation = resolveTranslation(post.translations, locale);
      if (!translation) return null;

      return {
        id: post.id,
        slug: post.slug,
        category: post.category,
        title: translation.title,
        content: translation.content,
        locale: translation.locale,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      };
    })
    .filter((post): post is BioPostWithTranslation => post !== null);
}

export async function getBioPostsByCategory(
  category: string,
  locale: Locale = 'en'
): Promise<BioPostWithTranslation[]> {
  const posts = await prisma.bioPost.findMany({
    where: { category },
    include: {
      translations: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return posts
    .map(post => {
      const translation = resolveTranslation(post.translations, locale);
      if (!translation) return null;

      return {
        id: post.id,
        slug: post.slug,
        category: post.category,
        title: translation.title,
        content: translation.content,
        locale: translation.locale,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      };
    })
    .filter((post): post is BioPostWithTranslation => post !== null);
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const result = await prisma.bioPost.groupBy({
    by: ['category'],
    _count: {
      _all: true
    }
  });

  return result.reduce((acc, item) => {
    acc[item.category] = item._count._all;
    return acc;
  }, {} as Record<string, number>);
}

export async function getBioPost(slug: string, locale: Locale = 'en'): Promise<BioPostWithTranslation | null> {
  const post = await prisma.bioPost.findUnique({
    where: { slug },
    include: {
      translations: true
    }
  });

  if (!post) return null;

  const translation = resolveTranslation(post.translations, locale);
  if (!translation) return null;

  return {
    id: post.id,
    slug: post.slug,
    category: post.category,
    title: translation.title,
    content: translation.content,
    locale: translation.locale,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
}

async function seedBioPosts() {
  const seeds = [
    {
      slug: 'bulletproof-coffee',
      category: 'Nutrition',
      translations: {
        en: {
          title: 'The Ultimate Bulletproof Coffee Protocol',
          content: `# Bulletproof Coffee Protocol

Start your morning with high-quality fats to fuel your brain.

## Ingredients
- **Coffee**: Mold-free beans, single origin.
- **MCT Oil**: C8 (Caprylic Acid) is essential. 1 tbsp.
- **Ghee/Butter**: Grass-fed only. 1 tbsp.
- **Optional**: Vanilla powder, Cacao butter.

## Benefits
- Suppresses hunger hormones (Ghrelin).
- Provides stable energy without insulin spikes.
- Ketogenic state induction.`
        },
        ko: {
          title: '궁극의 방탄커피 프로토콜',
          content: `# 방탄커피 프로토콜

고품질 지방으로 뇌에 연료를 공급하며 아침을 시작하세요.

## 재료
- **커피**: 곰팡이 없는 원두, 싱글 오리진.
- **MCT 오일**: C8 (카프릴산) 필수. 1 tbsp.
- **기버터**: 목초 사육만. 1 tbsp.
- **옵션**: 바닐라 파우더, 카카오 버터.

## 효과
- 공복 호르몬(그렐린) 억제.
- 인슐린 스파이크 없는 안정적 에너지.
- 케토시스 상태 유도.`
        },
        ja: {
          title: '究極のブレットプルーフコーヒープロトコル',
          content: `# ブレットプルーフコーヒープロトコル

高品質な脂肪で脳に燃料を供給し、朝をスタートしましょう。

## 材料
- **コーヒー**: カビのない豆、シングルオリジン。
- **MCTオイル**: C8（カプリル酸）必須。大さじ1。
- **ギー/バター**: グラスフェッドのみ。大さじ1。
- **オプション**: バニラパウダー、カカオバター。

## 効果
- 空腹ホルモン（グレリン）を抑制。
- インスリンスパイクなしの安定したエネルギー。
- ケトジェニック状態の誘導。`
        }
      }
    },
    {
      slug: 'focus-stack',
      category: 'Supplements',
      translations: {
        en: {
          title: 'Deep Work Nootropic Stack',
          content: `# Neuro-Optimization Stack

Achieve flow state reliably with this combination.

## The Stack
1. **Alpha GPC**: 300mg - Acetylcholine precursor for memory/focus.
2. **L-Tyrosine**: 500mg - Dopamine precursor for motivation.
3. **Magnesium L-Threonate**: Crosses blood-brain barrier.
4. **Creatine Monohydrate**: 5g - ATP for brain cells.

## Timing
Take 30 minutes before your deep work block on an empty stomach.`
        },
        ko: {
          title: '딥워크 누트로픽 스택',
          content: `# 뇌 최적화 스택

이 조합으로 플로우 상태를 안정적으로 달성하세요.

## 스택 구성
1. **알파 GPC**: 300mg - 기억력/집중력을 위한 아세틸콜린 전구체.
2. **L-티로신**: 500mg - 동기부여를 위한 도파민 전구체.
3. **마그네슘 L-트레오네이트**: 혈뇌장벽 통과.
4. **크레아틴 모노하이드레이트**: 5g - 뇌세포를 위한 ATP.

## 복용 시간
딥워크 블록 30분 전, 공복에 복용.`
        },
        ja: {
          title: 'ディープワーク・ヌートロピックスタック',
          content: `# 脳最適化スタック

この組み合わせで確実にフロー状態を達成しましょう。

## スタック構成
1. **アルファGPC**: 300mg - 記憶/集中のためのアセチルコリン前駆体。
2. **L-チロシン**: 500mg - モチベーションのためのドーパミン前駆体。
3. **マグネシウムL-スレオニン**: 血液脳関門を通過。
4. **クレアチンモノハイドレート**: 5g - 脳細胞のためのATP。

## 摂取タイミング
ディープワークブロックの30分前、空腹時に摂取。`
        }
      }
    },
    {
      slug: 'sleep-hygiene',
      category: 'Recovery',
      translations: {
        en: {
          title: 'Sleep Optimization Checklist',
          content: `# Sleep is the Foundation

## Evening Routine
- **Blue Light Blocking**: Glasses on at sunset.
- **Temperature**: Room at 19°C (66°F).
- **Magnesium Glycinate**: 400mg before bed.
- **Tape Mouth**: Promote nasal breathing.

## Morning
- **Sunlight**: View sunlight within 10 mins of waking.`
        },
        ko: {
          title: '수면 최적화 체크리스트',
          content: `# 수면은 기초입니다

## 저녁 루틴
- **블루라이트 차단**: 일몰 시 안경 착용.
- **온도**: 방 온도 19°C.
- **마그네슘 글리시네이트**: 취침 전 400mg.
- **입테이프**: 코 호흡 촉진.

## 아침
- **햇빛**: 기상 후 10분 이내에 햇빛 보기.`
        },
        ja: {
          title: '睡眠最適化チェックリスト',
          content: `# 睡眠は基盤です

## 夜のルーティン
- **ブルーライトカット**: 日没時にメガネ着用。
- **温度**: 室温19°C。
- **マグネシウムグリシネート**: 就寝前に400mg。
- **口テープ**: 鼻呼吸を促進。

## 朝
- **日光**: 起床後10分以内に日光を浴びる。`
        }
      }
    },
    {
      slug: 'fasting-protocol',
      category: 'Nutrition',
      translations: {
        en: {
          title: 'Intermittent Fasting 16:8',
          content: `# 16:8 Protocol

## Why?
Autophagy (cellular cleanup) and insulin sensitivity.

## Schedule
- **Fast**: 8 PM to 12 PM (Next day).
- **Feed**: 12 PM to 8 PM.
- **During Fast**: Water, Black Coffee, Tea ONLY.`
        },
        ko: {
          title: '간헐적 단식 16:8',
          content: `# 16:8 프로토콜

## 왜?
오토파지(세포 정화)와 인슐린 민감성.

## 일정
- **단식**: 오후 8시부터 다음날 오후 12시까지.
- **식사**: 오후 12시부터 오후 8시까지.
- **단식 중**: 물, 블랙커피, 차만 가능.`
        },
        ja: {
          title: '間欠的断食 16:8',
          content: `# 16:8 プロトコル

## なぜ？
オートファジー（細胞浄化）とインスリン感受性。

## スケジュール
- **断食**: 午後8時から翌日午後12時まで。
- **食事**: 午後12時から午後8時まで。
- **断食中**: 水、ブラックコーヒー、お茶のみ。`
        }
      }
    },
    {
      slug: 'cold-thermogenesis',
      category: 'Recovery',
      translations: {
        en: {
          title: 'Cold Plunge Benefits',
          content: `# Cold Exposure

## Protocol
- **Temperature**: 10°C - 15°C.
- **Duration**: 2-3 minutes total per week is baseline, try 2 mins daily.

## Effects
- Increases Dopamine by 250% for hours.
- Reduces inflammation.
- Brown fat activation.`
        },
        ko: {
          title: '냉수 노출의 이점',
          content: `# 냉수 노출

## 프로토콜
- **온도**: 10°C - 15°C.
- **시간**: 주당 총 2-3분이 기본, 매일 2분 시도.

## 효과
- 도파민 250% 증가, 수 시간 지속.
- 염증 감소.
- 갈색 지방 활성화.`
        },
        ja: {
          title: '冷水浴の効果',
          content: `# 冷水暴露

## プロトコル
- **温度**: 10°C - 15°C。
- **時間**: 週あたり合計2-3分が基準、毎日2分を試みる。

## 効果
- ドーパミンが250%増加、数時間持続。
- 炎症を軽減。
- 褐色脂肪の活性化。`
        }
      }
    },
    {
      slug: 'protein-first',
      category: 'Nutrition',
      translations: {
        en: {
          title: 'Protein-Centric Diet',
          content: `# Protein Threshold

Aim for 1.6g to 2.2g of protein per kg of body weight.

## Sources
- Grass-fed Beef
- Wild Salmon
- Eggs (Pasture-raised)
- Whey Isolate

Prioritize protein in every meal to trigger MPS (Muscle Protein Synthesis).`
        },
        ko: {
          title: '단백질 중심 식단',
          content: `# 단백질 기준

체중 kg당 1.6g에서 2.2g의 단백질을 목표로.

## 단백질 원천
- 목초 사육 소고기
- 자연산 연어
- 방목 계란
- 유청 분리 단백질

매 식사에서 단백질을 우선시하여 MPS(근육 단백질 합성)를 촉발.`
        },
        ja: {
          title: 'タンパク質中心の食事',
          content: `# タンパク質の基準

体重1kgあたり1.6gから2.2gのタンパク質を目標に。

## タンパク質源
- グラスフェッドビーフ
- 天然サーモン
- 放し飼い卵
- ホエイアイソレート

毎食でタンパク質を優先し、MPS（筋タンパク質合成）を促進。`
        }
      }
    },
    {
      slug: 'zone-2-cardio',
      category: 'Exercise',
      translations: {
        en: {
          title: 'Zone 2 Training',
          content: `# Mitochondrial Efficiency

Zone 2 is the intensity where you can hold a conversation but it's strained.

## Protocol
- 45-60 minutes.
- 3-4 times per week.
- **Modality**: Cycling, Rucking, Jogging.

Increases mitochondrial density and metabolic flexibility.`
        },
        ko: {
          title: '존 2 훈련',
          content: `# 미토콘드리아 효율

존 2는 대화가 가능하지만 약간 힘든 강도입니다.

## 프로토콜
- 45-60분.
- 주 3-4회.
- **방식**: 자전거, 럭킹, 조깅.

미토콘드리아 밀도와 대사 유연성 증가.`
        },
        ja: {
          title: 'ゾーン2トレーニング',
          content: `# ミトコンドリア効率

ゾーン2は会話ができるが少し辛い強度です。

## プロトコル
- 45-60分。
- 週3-4回。
- **方法**: サイクリング、ラッキング、ジョギング。

ミトコンドリア密度と代謝柔軟性を向上。`
        }
      }
    },
    {
      slug: 'digital-detox',
      category: 'Mindset',
      translations: {
        en: {
          title: 'Dopamine Detox',
          content: `# Reset Your Receptors

Modern life overstimulates dopamine receptors, leading to low motivation.

## The Rules (24 Hours)
- No Social Media.
- No Video Games.
- No Processed Sugar.
- No Music/Podcasts.

**Allowed**: Writing, Walking, Meditating, Reading (Books).`
        },
        ko: {
          title: '도파민 디톡스',
          content: `# 수용체 리셋

현대 생활은 도파민 수용체를 과도하게 자극하여 동기 저하를 유발합니다.

## 규칙 (24시간)
- 소셜 미디어 금지.
- 비디오 게임 금지.
- 가공 설탕 금지.
- 음악/팟캐스트 금지.

**허용**: 글쓰기, 걷기, 명상, 독서(책).`
        },
        ja: {
          title: 'ドーパミンデトックス',
          content: `# 受容体をリセット

現代生活はドーパミン受容体を過剰に刺激し、モチベーション低下を引き起こします。

## ルール（24時間）
- ソーシャルメディア禁止。
- ビデオゲーム禁止。
- 加工糖禁止。
- 音楽/ポッドキャスト禁止。

**許可**: 執筆、散歩、瞑想、読書（本）。`
        }
      }
    },
    {
      slug: 'nudge-theory-biohacking',
      category: 'Mindset',
      translations: {
        ko: {
          title: '넛지 이론으로 해킹하는 습관 설계 — 의지력 없이 갓생 사는 법',
          content: `# 넛지 이론으로 해킹하는 습관 설계

> "사람은 의지력으로 바뀌지 않는다. 환경이 바뀌면 행동이 바뀐다."
> — 리처드 탈러 (노벨경제학상 수상자)

## 넛지(Nudge)란 무엇인가?

넛지는 **강제하지 않고 자연스럽게 더 나은 선택을 유도하는 설계**를 말합니다. 2008년 리처드 탈러와 캐스 선스타인이 제안한 이 개념은 행동경제학의 핵심입니다.

핵심 원리는 간단합니다: **인간은 합리적이지 않다.** 우리는 피곤할 때 나쁜 선택을 하고, 눈앞에 있는 것을 먹고, 기본값(default)을 따릅니다. 넛지는 이 비합리성을 역이용합니다.

## 바이오해킹 × 넛지: 5가지 핵심 전략

### 1. 디폴트 효과 (Default Effect)
**원리**: 사람은 기본 설정을 거의 바꾸지 않는다.

**적용법**:
- 알람을 끄면 자동으로 "아침 루틴" 체크리스트가 뜨게 설정
- 급여일에 자동으로 저축 이체 (opt-out 방식)
- 갓생AI가 매일 아침 AI 코치를 자동으로 열어주는 것도 디폴트 효과

**과학적 근거**: 장기기증 동의율 — opt-in 국가(독일 12%) vs opt-out 국가(오스트리아 99.98%). 기본값의 힘은 압도적입니다.

### 2. 선택 설계 (Choice Architecture)
**원리**: 선택지를 어떻게 배치하느냐가 결과를 결정한다.

**적용법**:
- 냉장고 눈높이에 건강한 음식, 정크푸드는 높은 선반에
- 운동복을 전날 밤 침대 옆에 놓기 (마찰 제거)
- 핸드폰 첫 화면에 SNS 대신 독서/명상 앱 배치
- 물컵을 책상 위에 항상 채워두기

**갓생 팁**: 갓생AI의 모듈 순서도 선택 설계입니다. 셀프 서신 → 규율 마스터리 → 운명 네비게이터 순서로 "감정 → 행동 → 목표"의 자연스러운 흐름을 만듭니다.

### 3. 사회적 증거 (Social Proof)
**원리**: 다른 사람들이 하고 있으면 나도 하고 싶어진다.

**적용법**:
- "오늘 1,247명이 아침 루틴을 완료했습니다" 같은 메시지
- 습관 달성률을 친구와 비교
- 커뮤니티에서 갓생 인증 공유

**신경과학**: 거울 뉴런(Mirror Neuron)이 타인의 행동을 관찰할 때 활성화되어 모방 행동을 촉진합니다. fMRI 연구에서 사회적 증거를 볼 때 보상 회로(복측 선조체)가 활성화됨을 확인했습니다.

### 4. 즉각적 피드백 (Immediate Feedback)
**원리**: 먼 미래의 보상보다 즉각적 반응이 행동을 강화한다.

**적용법**:
- 습관 완료 시 즉각적인 시각적/청각적 피드백 (✅ 체크, 효과음)
- 연속 달성 스트릭(streak) 카운터
- AI 코치의 실시간 칭찬과 리액션
- 규율 체크 후 바로 달성률 % 변화 표시

**도파민 역학**: 보상 예측 오차(Reward Prediction Error)가 클수록 도파민이 더 많이 분비됩니다. 예상보다 빠른 피드백은 습관 강화 루프를 만듭니다. 이것이 게이미피케이션의 과학적 기반입니다.

### 5. 프레이밍 효과 (Framing Effect)
**원리**: 같은 정보도 어떻게 표현하느냐에 따라 행동이 달라진다.

**적용법**:
- ❌ "운동 안 하면 건강이 나빠져요" → ✅ "10분 걷기로 수명 7년 연장"
- ❌ "아직 3개 안 했어요" → ✅ "벌써 4개나 완료했어요!"
- ❌ "절약해야 해요" → ✅ "미래의 나에게 선물하기"

**갓생AI의 프레이밍**: AI 코치는 "안 했다"고 지적하지 않습니다. "오늘 뭐 했어?"라고 자연스럽게 물어보고, 대화 속에서 기록이 자동으로 채워집니다. 이것이 넛지입니다.

## 넛지 vs 의지력: 왜 환경이 이기는가

| 의지력 접근 | 넛지 접근 |
|------------|----------|
| "매일 아침 5시에 일어나야지" | 알람 옆에 운동복 + 물 배치 |
| "SNS 그만 봐야지" | 핸드폰 첫 화면에서 SNS 앱 삭제 |
| "건강하게 먹어야지" | 정크푸드를 안 사서 집에 안 두기 |
| "매일 일기 써야지" | AI 코치가 대화로 자동 기록 |
| 성공률: ~8% (새해 결심) | 성공률: ~65% (환경 설계) |

2019년 유럽 사회심리학 저널의 메타분석에 따르면, **넛지 기반 개입의 효과 크기(d=0.43)는 교육 기반 개입(d=0.15)의 약 3배**입니다.

## 실전 넛지 프로토콜: 오늘부터 시작하기

### Morning Nudge Stack
1. **알람 → 자동 체크리스트** (디폴트 효과)
2. **물컵을 침대 옆에** (마찰 제거)
3. **커튼을 반만 열고 자기** (자연광 = 코르티솔 각성)
4. **갓생AI 열기** (AI 코치가 "좋은 아침!" 인사)

### Evening Nudge Stack
1. **9시에 자동 야간 모드** (블루라이트 차단)
2. **핸드폰 거실에 두기** (침실 = 수면 전용)
3. **내일 옷 미리 꺼놓기** (아침 결정 피로 제거)
4. **AI 코치와 하루 정리** (반성이 아닌, 대화로 기록)

## 갓생AI가 넛지인 이유

갓생AI 자체가 하나의 거대한 넛지 시스템입니다:

- **AI 코치 자동 팝업** = 디폴트 효과 (대화를 시작하게 만듦)
- **대화형 기록** = 마찰 제거 (양식 작성이 아닌, 수다)
- **모듈 자동 채움** = 선택 설계 (기록의 장벽을 없앰)
- **시간대별 인사** = 프레이밍 (아침엔 활기, 밤엔 차분)
- **MET 검사 공유** = 사회적 증거 (친구도 하게 만듦)

> **핵심**: 의지력에 의존하지 마세요. 환경을 설계하세요. 당신이 해야 할 일은 딱 하나 — **갓생AI를 여는 것**. 나머지는 넛지가 합니다.

---

*참고문헌*
- Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness.*
- Kahneman, D. (2011). *Thinking, Fast and Slow.*
- Johnson, E. J., & Goldstein, D. (2003). Do Defaults Save Lives? *Science*, 302(5649).
- Hummel, D., & Maedche, A. (2019). How effective is nudging? *European Journal of Social Psychology*.`
        },
        en: {
          title: 'Nudge Theory × Biohacking — Living Your Best Life Without Willpower',
          content: `# Nudge Theory × Biohacking: Designing Habits Without Willpower

> "People don't change through willpower. Change the environment, and behavior follows."
> — Richard Thaler (Nobel Prize in Economics)

## What is a Nudge?

A nudge is **a design that naturally guides better choices without forcing them.** Proposed by Richard Thaler and Cass Sunstein in 2008, this concept is the cornerstone of behavioral economics.

The core principle is simple: **Humans are not rational.** We make bad choices when tired, eat what's in front of us, and follow defaults. Nudge theory reverse-engineers this irrationality.

## Biohacking × Nudge: 5 Core Strategies

### 1. Default Effect
**Principle**: People rarely change default settings.

**Application**:
- Set morning routine checklists to appear automatically when you dismiss your alarm
- Auto-transfer savings on payday (opt-out model)
- God Life AI auto-opening the AI coach each morning is a default effect

**Evidence**: Organ donation consent rates — opt-in countries (Germany 12%) vs opt-out countries (Austria 99.98%). The power of defaults is overwhelming.

### 2. Choice Architecture
**Principle**: How you arrange choices determines outcomes.

**Application**:
- Healthy food at eye level in the fridge; junk food on high shelves
- Lay out workout clothes next to your bed the night before (friction removal)
- Replace social media with reading/meditation apps on your home screen
- Keep a full water glass on your desk at all times

### 3. Social Proof
**Principle**: If others are doing it, I want to do it too.

**Application**:
- Messages like "1,247 people completed their morning routine today"
- Compare habit achievement rates with friends
- Share your progress in community spaces

**Neuroscience**: Mirror neurons activate when observing others' behavior, promoting imitation. fMRI studies confirm reward circuit (ventral striatum) activation when viewing social proof.

### 4. Immediate Feedback
**Principle**: Instant responses reinforce behavior more than distant rewards.

**Application**:
- Visual/audio feedback on habit completion (✅ check, sound effects)
- Streak counters for consecutive achievements
- Real-time praise from AI coach
- Instant percentage changes after discipline checks

**Dopamine dynamics**: Greater Reward Prediction Error = more dopamine release. Faster-than-expected feedback creates habit reinforcement loops.

### 5. Framing Effect
**Principle**: Same information, different presentation = different behavior.

**Application**:
- ❌ "You'll get unhealthy if you don't exercise" → ✅ "10 minutes of walking adds 7 years to your life"
- ❌ "You still have 3 left" → ✅ "You've already completed 4!"
- ❌ "You need to save money" → ✅ "Gift your future self"

## Nudge vs Willpower: Why Environment Wins

| Willpower Approach | Nudge Approach |
|-------------------|----------------|
| "I'll wake up at 5am every day" | Place workout clothes + water next to alarm |
| "I'll stop scrolling social media" | Remove social media from home screen |
| "I'll eat healthy" | Don't buy junk food so it's not at home |
| "I'll journal every day" | AI coach records through conversation |
| Success rate: ~8% (New Year's) | Success rate: ~65% (environmental design) |

A 2019 meta-analysis in the European Journal of Social Psychology found that **nudge-based interventions (d=0.43) are approximately 3x more effective than education-based interventions (d=0.15).**

## Practical Nudge Protocol: Start Today

### Morning Nudge Stack
1. **Alarm → Auto checklist** (Default Effect)
2. **Water glass by the bed** (Friction removal)
3. **Sleep with curtains half-open** (Natural light = cortisol awakening)
4. **Open God Life AI** (AI coach says "Good morning!")

### Evening Nudge Stack
1. **Auto night mode at 9pm** (Blue light blocking)
2. **Phone stays in living room** (Bedroom = sleep only)
3. **Prepare tomorrow's outfit** (Remove morning decision fatigue)
4. **Chat with AI coach to review the day** (Not reflection, conversation)

> **Key takeaway**: Don't rely on willpower. Design your environment. You only need to do one thing — **open God Life AI**. Nudge does the rest.

---

*References*
- Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness.*
- Kahneman, D. (2011). *Thinking, Fast and Slow.*
- Johnson, E. J., & Goldstein, D. (2003). Do Defaults Save Lives? *Science*, 302(5649).
- Hummel, D., & Maedche, A. (2019). How effective is nudging? *European Journal of Social Psychology*.`
        },
        ja: {
          title: 'ナッジ理論×バイオハッキング — 意志力なしで最高の生活を送る方法',
          content: `# ナッジ理論×バイオハッキング：意志力なしで習慣を設計する

> 「人は意志力では変わらない。環境が変われば行動が変わる。」
> — リチャード・セイラー（ノーベル経済学賞受賞者）

## ナッジ（Nudge）とは？

ナッジとは、**強制せずに自然とより良い選択に導く設計**のことです。2008年にリチャード・セイラーとキャス・サンスティーンが提唱したこの概念は、行動経済学の核心です。

核心原理はシンプルです：**人間は合理的ではない。** 疲れているときに悪い選択をし、目の前にあるものを食べ、デフォルト設定に従います。ナッジ理論はこの非合理性を逆利用します。

## バイオハッキング × ナッジ：5つの核心戦略

### 1. デフォルト効果
**原理**：人はデフォルト設定をほとんど変えない。

**応用**：
- アラームを消すと自動的に朝のルーティンチェックリストを表示
- 給料日に自動貯蓄振替（オプトアウト方式）
- God Life AIが毎朝AIコーチを自動で開くのもデフォルト効果

**科学的根拠**：臓器提供同意率 — オプトイン国（ドイツ12%）vsオプトアウト国（オーストリア99.98%）。デフォルトの力は圧倒的です。

### 2. 選択設計（チョイス・アーキテクチャ）
**原理**：選択肢をどう配置するかが結果を決める。

**応用**：
- 冷蔵庫の目の高さに健康的な食品、ジャンクフードは高い棚に
- 前夜にベッドの横に運動着を準備（摩擦の除去）
- スマホのホーム画面にSNSではなく読書・瞑想アプリ
- デスクに常に水を満たしたコップを置く

### 3. 社会的証明
**原理**：他の人がやっていると、自分もやりたくなる。

**応用**：
- 「今日1,247人が朝のルーティンを完了しました」のようなメッセージ
- 習慣達成率を友人と比較
- コミュニティで進捗を共有

### 4. 即時フィードバック
**原理**：遠い未来の報酬より即時の反応が行動を強化する。

**応用**：
- 習慣完了時の視覚的・聴覚的フィードバック（✅チェック、効果音）
- 連続達成ストリークカウンター
- AIコーチのリアルタイムの褒め言葉
- 規律チェック後すぐに達成率%変化を表示

### 5. フレーミング効果
**原理**：同じ情報でも表現方法で行動が変わる。

**応用**：
- ❌ 「運動しないと不健康になります」→ ✅ 「10分の散歩で寿命が7年延びます」
- ❌ 「まだ3つ残っています」→ ✅ 「もう4つも完了しました！」

## ナッジ vs 意志力：環境が勝つ理由

| 意志力アプローチ | ナッジアプローチ |
|----------------|---------------|
| 「毎朝5時に起きよう」 | アラームの横に運動着+水を配置 |
| 「SNSを見るのをやめよう」 | ホーム画面からSNSアプリを削除 |
| 「健康的に食べよう」 | ジャンクフードを買わない=家にない |
| 「毎日日記を書こう」 | AIコーチが会話で自動記録 |
| 成功率: ~8%（新年の決意） | 成功率: ~65%（環境設計） |

> **キーポイント**：意志力に頼らないでください。環境を設計しましょう。やるべきことはたった一つ — **God Life AIを開くこと。** あとはナッジがやります。

---

*参考文献*
- Thaler, R. H., & Sunstein, C. R. (2008). *Nudge*
- Kahneman, D. (2011). *Thinking, Fast and Slow.*
- Hummel, D., & Maedche, A. (2019). How effective is nudging? *European Journal of Social Psychology*.`
        }
      }
    }
  ];

  // Sequential execution for SQLite to avoid lock/panic
  for (const seed of seeds) {
    const post = await prisma.bioPost.upsert({
      where: { slug: seed.slug },
      update: {},
      create: {
        slug: seed.slug,
        category: seed.category
      }
    });

    // Create translations for each locale
    for (const [locale, translation] of Object.entries(seed.translations)) {
      await prisma.bioPostTranslation.upsert({
        where: {
          postId_locale: {
            postId: post.id,
            locale: locale
          }
        },
        update: {
          title: translation.title,
          content: translation.content
        },
        create: {
          postId: post.id,
          locale: locale,
          title: translation.title,
          content: translation.content
        }
      });
    }
  }
}
