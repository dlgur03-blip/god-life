import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bioPostsData = [
  {
    slug: 'morning-sunlight-protocol',
    category: 'Recovery',
    translations: [
      {
        locale: 'ko',
        title: '아침 햇빛 프로토콜',
        content: `## 개요
아침에 자연광을 30분 이상 받으면 수면-각성 리듬이 최적화됩니다.

## 프로토콜
1. 기상 후 30분 이내 외출
2. 직접 햇빛 노출 (선글라스 없이)
3. 최소 10-30분 유지
4. 흐린 날도 효과적

## 효과
- 코르티솔 각성 반응 정상화
- 멜라토닌 분비 타이밍 조절
- 에너지 수준 향상
- 기분 개선

## 참고 연구
Andrew Huberman Lab Podcast - Using Light to Optimize Health`
      },
      {
        locale: 'en',
        title: 'Morning Sunlight Protocol',
        content: `## Overview
Getting 30+ minutes of natural light in the morning optimizes your sleep-wake rhythm.

## Protocol
1. Go outside within 30 minutes of waking
2. Direct sunlight exposure (no sunglasses)
3. Maintain for at least 10-30 minutes
4. Effective even on cloudy days

## Benefits
- Normalizes cortisol awakening response
- Regulates melatonin timing
- Improves energy levels
- Enhances mood

## Reference
Andrew Huberman Lab Podcast - Using Light to Optimize Health`
      },
      {
        locale: 'ja',
        title: '朝の日光プロトコル',
        content: `## 概要
朝に30分以上の自然光を浴びると、睡眠-覚醒リズムが最適化されます。

## プロトコル
1. 起床後30分以内に外出
2. 直接日光を浴びる（サングラスなし）
3. 最低10-30分維持
4. 曇りの日も効果的

## 効果
- コルチゾール覚醒反応の正常化
- メラトニン分泌タイミング調整
- エネルギーレベル向上
- 気分改善

## 参考研究
Andrew Huberman Lab Podcast - Using Light to Optimize Health`
      }
    ]
  },
  {
    slug: 'cold-exposure-basics',
    category: 'Recovery',
    translations: [
      {
        locale: 'ko',
        title: '냉수 노출 기초',
        content: `## 개요
냉수 노출은 도파민을 250% 증가시키고 에너지를 높입니다.

## 프로토콜
1. 11분/주 총 냉수 노출 (2-4회 분할)
2. 불편하지만 안전한 온도 (약 10-15°C)
3. 목까지 담그기
4. 차가운 샤워로 시작 가능

## 효과
- 도파민 250% 증가 (수 시간 지속)
- 노르에피네프린 증가
- 면역 기능 향상
- 지방 연소 촉진

## 주의사항
심장 질환자, 고혈압 환자는 의사 상담 필요`
      },
      {
        locale: 'en',
        title: 'Cold Exposure Basics',
        content: `## Overview
Cold exposure increases dopamine by 250% and boosts energy.

## Protocol
1. 11 minutes/week total (split into 2-4 sessions)
2. Uncomfortable but safe temperature (about 10-15°C)
3. Submerge up to neck
4. Can start with cold showers

## Benefits
- 250% dopamine increase (lasts hours)
- Norepinephrine boost
- Enhanced immune function
- Promotes fat burning

## Caution
Those with heart conditions or high blood pressure should consult a doctor`
      },
      {
        locale: 'ja',
        title: '冷水曝露の基礎',
        content: `## 概要
冷水曝露はドーパミンを250%増加させ、エネルギーを高めます。

## プロトコル
1. 週11分の合計（2-4回に分割）
2. 不快だが安全な温度（約10-15°C）
3. 首まで浸かる
4. 冷水シャワーから開始可能

## 効果
- ドーパミン250%増加（数時間持続）
- ノルエピネフリン増加
- 免疫機能向上
- 脂肪燃焼促進

## 注意事項
心臓疾患、高血圧の方は医師に相談が必要`
      }
    ]
  },
  {
    slug: 'sleep-optimization',
    category: 'Recovery',
    translations: [
      {
        locale: 'ko',
        title: '수면 최적화 가이드',
        content: `## 개요
수면은 모든 회복과 성능의 기초입니다.

## 핵심 원칙
1. **일관된 수면 시간**: 매일 같은 시간에 취침/기상
2. **온도**: 침실 18-19°C 유지
3. **빛**: 취침 2시간 전부터 밝은 빛 차단
4. **카페인**: 오후 2시 이후 금지

## 수면 스택
- 마그네슘 글리시네이트 300-400mg
- L-테아닌 100-200mg
- 아피게닌 50mg (옵션)

## 측정
- 수면 추적기 사용
- REM/깊은 수면 비율 확인
- 목표: 7-9시간`
      },
      {
        locale: 'en',
        title: 'Sleep Optimization Guide',
        content: `## Overview
Sleep is the foundation of all recovery and performance.

## Core Principles
1. **Consistent Schedule**: Same sleep/wake times daily
2. **Temperature**: Keep bedroom at 18-19°C
3. **Light**: Block bright lights 2 hours before bed
4. **Caffeine**: No caffeine after 2 PM

## Sleep Stack
- Magnesium Glycinate 300-400mg
- L-Theanine 100-200mg
- Apigenin 50mg (optional)

## Tracking
- Use sleep tracker
- Monitor REM/deep sleep ratios
- Target: 7-9 hours`
      },
      {
        locale: 'ja',
        title: '睡眠最適化ガイド',
        content: `## 概要
睡眠はすべての回復とパフォーマンスの基礎です。

## 核心原則
1. **一貫した睡眠時間**: 毎日同じ時間に就寝/起床
2. **温度**: 寝室を18-19°Cに維持
3. **光**: 就寝2時間前から明るい光を遮断
4. **カフェイン**: 午後2時以降禁止

## 睡眠スタック
- マグネシウムグリシネート 300-400mg
- L-テアニン 100-200mg
- アピゲニン 50mg（オプション）

## 測定
- 睡眠トラッカー使用
- REM/深い睡眠の比率確認
- 目標: 7-9時間`
      }
    ]
  },
  {
    slug: 'creatine-guide',
    category: 'Supplements',
    translations: [
      {
        locale: 'ko',
        title: '크레아틴 완벽 가이드',
        content: `## 개요
크레아틴은 가장 연구가 많이 된 안전한 보충제입니다.

## 용량
- 일일 3-5g (로딩 불필요)
- 언제든 복용 가능
- 음식과 함께 또는 별도로

## 효과
- 근력 및 파워 향상
- 인지 기능 개선
- 뇌 에너지 증가
- 회복 촉진

## 형태
- 크레아틴 모노하이드레이트 권장
- 다른 형태는 장점 없음

## 주의사항
- 충분한 수분 섭취
- 신장 질환자는 의사 상담`
      },
      {
        locale: 'en',
        title: 'Complete Creatine Guide',
        content: `## Overview
Creatine is the most researched and safest supplement available.

## Dosage
- 3-5g daily (no loading needed)
- Take anytime
- With or without food

## Benefits
- Strength and power improvement
- Cognitive enhancement
- Brain energy increase
- Recovery support

## Form
- Creatine monohydrate recommended
- Other forms have no advantage

## Caution
- Stay well hydrated
- Those with kidney issues should consult doctor`
      },
      {
        locale: 'ja',
        title: 'クレアチン完全ガイド',
        content: `## 概要
クレアチンは最も研究された安全なサプリメントです。

## 用量
- 毎日3-5g（ローディング不要）
- いつでも摂取可能
- 食事と一緒でも別でも

## 効果
- 筋力とパワー向上
- 認知機能改善
- 脳エネルギー増加
- 回復促進

## 形態
- クレアチンモノハイドレート推奨
- 他の形態に利点なし

## 注意事項
- 十分な水分摂取
- 腎臓疾患のある方は医師に相談`
      }
    ]
  },
  {
    slug: 'zone-2-cardio',
    category: 'Exercise',
    translations: [
      {
        locale: 'ko',
        title: 'Zone 2 유산소 프로토콜',
        content: `## 개요
Zone 2 훈련은 미토콘드리아 건강의 핵심입니다.

## Zone 2란?
- 최대 심박수의 60-70%
- 대화 가능한 강도
- "편안하게 힘든" 느낌

## 프로토콜
- 주 3-4회
- 회당 45-60분
- 걷기, 자전거, 수영 등

## 효과
- 미토콘드리아 밀도 증가
- 지방 연소 능력 향상
- 심혈관 건강 개선
- 장수와 직결

## 측정
심박수 모니터 또는 대화 테스트 활용`
      },
      {
        locale: 'en',
        title: 'Zone 2 Cardio Protocol',
        content: `## Overview
Zone 2 training is key to mitochondrial health.

## What is Zone 2?
- 60-70% of max heart rate
- Can hold conversation
- "Comfortably hard" feeling

## Protocol
- 3-4 times per week
- 45-60 minutes per session
- Walking, cycling, swimming, etc.

## Benefits
- Increased mitochondrial density
- Improved fat burning capacity
- Better cardiovascular health
- Directly linked to longevity

## Measurement
Use heart rate monitor or conversation test`
      },
      {
        locale: 'ja',
        title: 'Zone 2 有酸素プロトコル',
        content: `## 概要
Zone 2トレーニングはミトコンドリア健康の鍵です。

## Zone 2とは？
- 最大心拍数の60-70%
- 会話可能な強度
- 「快適にきつい」感覚

## プロトコル
- 週3-4回
- 1回45-60分
- ウォーキング、サイクリング、水泳など

## 効果
- ミトコンドリア密度増加
- 脂肪燃焼能力向上
- 心血管健康改善
- 長寿に直結

## 測定
心拍数モニターまたは会話テスト活用`
      }
    ]
  }
];

async function main() {
  console.log('Seeding bio posts...');

  for (const postData of bioPostsData) {
    const existingPost = await prisma.bioPost.findUnique({
      where: { slug: postData.slug }
    });

    if (existingPost) {
      console.log(`Post "${postData.slug}" already exists, skipping...`);
      continue;
    }

    const post = await prisma.bioPost.create({
      data: {
        slug: postData.slug,
        category: postData.category,
        translations: {
          create: postData.translations
        }
      }
    });

    console.log(`Created post: ${post.slug}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
