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
