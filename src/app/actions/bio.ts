'use server';

import { prisma } from "@/lib/prisma";

export async function getBioPosts() {
  // Auto-seed if empty
  const count = await prisma.bioPost.count();
  if (count === 0) {
    await seedBioPosts();
  }
  
  return await prisma.bioPost.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getBioPost(slug: string) {
  return await prisma.bioPost.findUnique({
    where: { slug }
  });
}

async function seedBioPosts() {
  const seeds = [
    {
      slug: 'bulletproof-coffee',
      title: 'The Ultimate Bulletproof Coffee Protocol',
      category: 'Nutrition',
      content: `
# Bulletproof Coffee Protocol

Start your morning with high-quality fats to fuel your brain.

## Ingredients
- **Coffee**: Mold-free beans, single origin.
- **MCT Oil**: C8 (Caprylic Acid) is essential. 1 tbsp.
- **Ghee/Butter**: Grass-fed only. 1 tbsp.
- **Optional**: Vanilla powder, Cacao butter.

## Benefits
- Suppresses hunger hormones (Ghrelin).
- Provides stable energy without insulin spikes.
- Ketogenic state induction.
      `
    },
    {
      slug: 'focus-stack',
      title: 'Deep Work Nootropic Stack',
      category: 'Supplements',
      content: `
# Neuro-Optimization Stack

Achieve flow state reliably with this combination.

## The Stack
1. **Alpha GPC**: 300mg - Acetylcholine precursor for memory/focus.
2. **L-Tyrosine**: 500mg - Dopamine precursor for motivation.
3. **Magnesium L-Threonate**: Crosses blood-brain barrier.
4. **Creatine Monohydrate**: 5g - ATP for brain cells.

## Timing
Take 30 minutes before your deep work block on an empty stomach.
      `
    },
    {
      slug: 'sleep-hygiene',
      title: 'Sleep Optimization Checklist',
      category: 'Recovery',
      content: `
# Sleep is the Foundation

## Evening Routine
- **Blue Light Blocking**: Glasses on at sunset.
- **Temperature**: Room at 19°C (66°F).
- **Magnesium Glycinate**: 400mg before bed.
- **Tape Mouth**: Promote nasal breathing.

## Morning
- **Sunlight**: View sunlight within 10 mins of waking.
      `
    },
    {
      slug: 'fasting-protocol',
      title: 'Intermittent Fasting 16:8',
      category: 'Nutrition',
      content: `
# 16:8 Protocol

## Why?
Autophagy (cellular cleanup) and insulin sensitivity.

## Schedule
- **Fast**: 8 PM to 12 PM (Next day).
- **Feed**: 12 PM to 8 PM.
- **During Fast**: Water, Black Coffee, Tea ONLY.
      `
    },
    {
      slug: 'cold-thermogenesis',
      title: 'Cold Plunge Benefits',
      category: 'Recovery',
      content: `
# Cold Exposure

## Protocol
- **Temperature**: 10°C - 15°C.
- **Duration**: 2-3 minutes total per week is baseline, try 2 mins daily.

## Effects
- Increases Dopamine by 250% for hours.
- Reduces inflammation.
- Brown fat activation.
      `
    },
    {
      slug: 'protein-first',
      title: 'Protein-Centric Diet',
      category: 'Nutrition',
      content: `
# Protein Threshold

Aim for 1.6g to 2.2g of protein per kg of body weight.

## Sources
- Grass-fed Beef
- Wild Salmon
- Eggs (Pasture-raised)
- Whey Isolate

Prioritize protein in every meal to trigger MPS (Muscle Protein Synthesis).
      `
    },
    {
      slug: 'zone-2-cardio',
      title: 'Zone 2 Training',
      category: 'Exercise',
      content: `
# Mitochondrial Efficiency

Zone 2 is the intensity where you can hold a conversation but it's strained.

## Protocol
- 45-60 minutes.
- 3-4 times per week.
- **Modality**: Cycling, Rucking, Jogging.

Increases mitochondrial density and metabolic flexibility.
      `
    },
    {
      slug: 'digital-detox',
      title: 'Dopamine Detox',
      category: 'Mindset',
      content: `
# Reset Your Receptors

Modern life overstimulates dopamine receptors, leading to low motivation.

## The Rules (24 Hours)
- No Social Media.
- No Video Games.
- No Processed Sugar.
- No Music/Podcasts.

**Allowed**: Writing, Walking, Meditating, Reading (Books).
      `
    }
  ];

  // Sequential execution for SQLite to avoid lock/panic
  for (const seed of seeds) {
    await prisma.bioPost.upsert({
      where: { slug: seed.slug },
      update: {},
      create: seed
    });
  }
}
