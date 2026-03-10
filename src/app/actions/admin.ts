'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import { ActionResult, success, error } from '@/lib/errors';
import { readFileSync } from 'fs';
import { join } from 'path';

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  if (!isAdmin(session.user.email)) throw new Error('Forbidden');
  return session.user.email;
}

// System Status Types
export type EnvironmentVariable = {
  name: string;
  value: string | null;
  isMasked: boolean;
};

export type DatabaseStatus = {
  connected: boolean;
  responseTimeMs: number | null;
  provider: string;
};

export type SystemInfo = {
  nodeVersion: string;
  nextVersion: string;
  reactVersion: string;
  prismaVersion: string;
  platform: string;
  timezone: string;
  locale: string;
  environment: string;
};

export type SystemStatus = {
  environment: EnvironmentVariable[];
  database: DatabaseStatus;
  systemInfo: SystemInfo;
};

const SENSITIVE_ENV_KEYS = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_SECRET',
  'BLOB_READ_WRITE_TOKEN',
  'AUTH_SECRET'
];

const DISPLAY_ENV_KEYS = [
  'NODE_ENV',
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'ADMIN_EMAILS',
  'BLOB_READ_WRITE_TOKEN'
];

export async function getSystemStatus(): Promise<ActionResult<SystemStatus>> {
  try {
    await verifyAdmin();

    // 1. 환경 변수 수집 (민감 정보 마스킹)
    const environment: EnvironmentVariable[] = DISPLAY_ENV_KEYS.map((key) => {
      const value = process.env[key];
      const isMasked = SENSITIVE_ENV_KEYS.includes(key);
      return {
        name: key,
        value: isMasked && value ? '*****' : (value || null),
        isMasked
      };
    });

    // 2. DB 연결 상태 확인
    let dbStatus: DatabaseStatus;
    try {
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const responseTimeMs = Date.now() - startTime;
      dbStatus = {
        connected: true,
        responseTimeMs,
        provider: 'PostgreSQL'
      };
    } catch {
      dbStatus = {
        connected: false,
        responseTimeMs: null,
        provider: 'PostgreSQL'
      };
    }

    // 3. 시스템 정보 수집 (동적 버전 읽기)
    let nextVersion = 'Unknown';
    let reactVersion = 'Unknown';
    let prismaVersion = 'Unknown';

    try {
      const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
      nextVersion = pkg.dependencies?.next?.replace('^', '') || 'Unknown';
      reactVersion = pkg.dependencies?.react?.replace('^', '') || 'Unknown';
      prismaVersion = pkg.dependencies?.['@prisma/client']?.replace('^', '') || 'Unknown';
    } catch {
      // 파일 읽기 실패 시 기본값 유지
    }

    const systemInfo: SystemInfo = {
      nodeVersion: process.version,
      nextVersion,
      reactVersion,
      prismaVersion,
      platform: process.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      environment: process.env.NODE_ENV || 'development'
    };

    return success({
      environment,
      database: dbStatus,
      systemInfo
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export type AdminDashboardStats = {
  totalUsers: number;
  newUsersThisWeek: number;
  moduleStats: {
    destiny: number;
    success: number;
    discipline: number;
    epistle: number;
    bio: number;
  };
};

export async function getAdminDashboardStats(): Promise<ActionResult<AdminDashboardStats>> {
  try {
    await verifyAdmin();

    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const [totalUsers, newUsersThisWeek, destinyCount, successCount, disciplineCount, epistleCount, bioCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.destinyDay.count(),
      prisma.successProject.count(),
      prisma.disciplineRule.count(),
      prisma.epistleDay.count(),
      prisma.bioPost.count()
    ]);

    return success({
      totalUsers,
      newUsersThisWeek,
      moduleStats: {
        destiny: destinyCount,
        success: successCount,
        discipline: disciplineCount,
        epistle: epistleCount,
        bio: bioCount
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export type UserListItem = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  _count: {
    destinyDays: number;
    successProjects: number;
    disciplineRules: number;
    epistleDays: number;
  };
};

export async function getAdminUserList(
  page: number = 1,
  pageSize: number = 20,
  search?: string
): Promise<ActionResult<{ users: UserListItem[]; total: number; page: number; pageSize: number }>> {
  try {
    await verifyAdmin();

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              destinyDays: true,
              successProjects: true,
              disciplineRules: true,
              epistleDays: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return success({ users, total, page, pageSize });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export async function getAdminBioPostList(
  page: number = 1,
  pageSize: number = 20
): Promise<ActionResult<{ posts: Array<{ id: string; slug: string; category: string; createdAt: Date; translations: Array<{ locale: string; title: string }> }>; total: number; page: number; pageSize: number }>> {
  try {
    await verifyAdmin();

    const [posts, total] = await Promise.all([
      prisma.bioPost.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          translations: {
            select: { locale: true, title: true }
          }
        }
      }),
      prisma.bioPost.count()
    ]);

    return success({ posts, total, page, pageSize });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

// Types for Bio Post CRUD
export type BioPostFormData = {
  slug: string;
  category: string;
  translations: {
    ko?: { title: string; content: string };
    en?: { title: string; content: string };
    ja?: { title: string; content: string };
  };
};

export type BioPostDetail = {
  id: string;
  slug: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  translations: Array<{
    locale: string;
    title: string;
    content: string;
  }>;
};

// Get single bio post for editing
export async function getAdminBioPost(id: string): Promise<ActionResult<BioPostDetail>> {
  try {
    await verifyAdmin();

    const post = await prisma.bioPost.findUnique({
      where: { id },
      include: {
        translations: {
          select: { locale: true, title: true, content: true }
        }
      }
    });

    if (!post) {
      return error('POST_NOT_FOUND');
    }

    return success(post);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

// Create new bio post
export async function createBioPost(data: BioPostFormData): Promise<ActionResult<{ id: string }>> {
  try {
    await verifyAdmin();

    // Validate slug format
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
      return error('INVALID_SLUG_FORMAT');
    }

    // Check slug availability
    const existing = await prisma.bioPost.findUnique({
      where: { slug: data.slug }
    });

    if (existing) {
      return error('SLUG_TAKEN');
    }

    // Build translations array
    const translationsData = Object.entries(data.translations)
      .filter(([, value]) => value && value.title && value.content)
      .map(([locale, value]) => ({
        locale,
        title: value!.title,
        content: value!.content
      }));

    if (translationsData.length === 0) {
      return error('MISSING_FIELDS');
    }

    const post = await prisma.bioPost.create({
      data: {
        slug: data.slug,
        category: data.category,
        translations: {
          create: translationsData
        }
      }
    });

    return success({ id: post.id });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

// Update existing bio post
export async function updateBioPost(id: string, data: BioPostFormData): Promise<ActionResult<void>> {
  try {
    await verifyAdmin();

    // Check if post exists
    const existingPost = await prisma.bioPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return error('POST_NOT_FOUND');
    }

    // Validate slug format
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
      return error('INVALID_SLUG_FORMAT');
    }

    // Check slug availability (exclude current post)
    const slugTaken = await prisma.bioPost.findFirst({
      where: {
        slug: data.slug,
        NOT: { id }
      }
    });

    if (slugTaken) {
      return error('SLUG_TAKEN');
    }

    // Build translations array
    const translationsData = Object.entries(data.translations)
      .filter(([, value]) => value && value.title && value.content)
      .map(([locale, value]) => ({
        locale,
        title: value!.title,
        content: value!.content
      }));

    if (translationsData.length === 0) {
      return error('MISSING_FIELDS');
    }

    // Use transaction to update post and translations
    await prisma.$transaction(async (tx) => {
      // Update post
      await tx.bioPost.update({
        where: { id },
        data: {
          slug: data.slug,
          category: data.category
        }
      });

      // Delete existing translations
      await tx.bioPostTranslation.deleteMany({
        where: { postId: id }
      });

      // Create new translations
      await tx.bioPostTranslation.createMany({
        data: translationsData.map((t) => ({
          postId: id,
          ...t
        }))
      });
    });

    return success(undefined);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

// Delete bio post
export async function deleteBioPost(id: string): Promise<ActionResult<void>> {
  try {
    await verifyAdmin();

    const post = await prisma.bioPost.findUnique({
      where: { id }
    });

    if (!post) {
      return error('POST_NOT_FOUND');
    }

    // Cascade delete will remove translations automatically
    await prisma.bioPost.delete({
      where: { id }
    });

    return success(undefined);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

// Check slug availability
export async function checkSlugAvailability(
  slug: string,
  excludeId?: string
): Promise<ActionResult<{ available: boolean }>> {
  try {
    await verifyAdmin();

    const existing = await prisma.bioPost.findFirst({
      where: excludeId
        ? { slug, NOT: { id: excludeId } }
        : { slug }
    });

    return success({ available: !existing });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

// Detailed Stats Types
export type AdminDetailedStats = {
  // 사용자 통계
  totalUsers: number;
  activeUsersDaily: number;
  activeUsersWeekly: number;
  activeUsersMonthly: number;

  // 일별 활성 사용자 추이 (최근 30일)
  userTrend: Array<{ date: string; count: number }>;

  // 모듈별 통계
  moduleStats: {
    destiny: {
      totalDays: number;
      trend: Array<{ date: string; count: number }>;
    };
    discipline: {
      totalRules: number;
      averageAchievementRate: number;  // 0-100
      trend: Array<{ date: string; rate: number }>;
    };
    success: {
      activeProjects: number;
      completedEntries: number;
      trend: Array<{ date: string; count: number }>;
    };
    epistle: {
      totalLetters: number;
      trend: Array<{ date: string; count: number }>;
    };
  };
};

export type StatsPeriod = 'week' | 'month' | 'quarter';

// Helper: 활성 사용자 수 계산
async function getActiveUserCount(since: Date): Promise<number> {
  const [destinyUsers, epistleUsers, disciplineUsers, successUsers] = await Promise.all([
    prisma.destinyDay.findMany({
      where: { updatedAt: { gte: since } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.epistleDay.findMany({
      where: { updatedAt: { gte: since } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.disciplineCheck.findMany({
      where: { checkedAt: { gte: since } },
      select: { rule: { select: { userId: true } } },
    }),
    prisma.successEntry.findMany({
      where: { updatedAt: { gte: since } },
      select: { project: { select: { userId: true } } },
    }),
  ]);

  const userIds = new Set<string>();
  destinyUsers.forEach((d) => userIds.add(d.userId));
  epistleUsers.forEach((e) => userIds.add(e.userId));
  disciplineUsers.forEach((d) => userIds.add(d.rule.userId));
  successUsers.forEach((s) => userIds.add(s.project.userId));

  return userIds.size;
}

// Helper: 특정 날짜 범위의 활성 사용자 수 계산
async function getActiveUserCountForDay(dayStart: Date, dayEnd: Date): Promise<number> {
  const [destinyUsers, epistleUsers, disciplineUsers, successUsers] = await Promise.all([
    prisma.destinyDay.findMany({
      where: { updatedAt: { gte: dayStart, lt: dayEnd } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.epistleDay.findMany({
      where: { updatedAt: { gte: dayStart, lt: dayEnd } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.disciplineCheck.findMany({
      where: { checkedAt: { gte: dayStart, lt: dayEnd } },
      select: { rule: { select: { userId: true } } },
    }),
    prisma.successEntry.findMany({
      where: { updatedAt: { gte: dayStart, lt: dayEnd } },
      select: { project: { select: { userId: true } } },
    }),
  ]);

  const userIds = new Set<string>();
  destinyUsers.forEach((d) => userIds.add(d.userId));
  epistleUsers.forEach((e) => userIds.add(e.userId));
  disciplineUsers.forEach((d) => userIds.add(d.rule.userId));
  successUsers.forEach((s) => userIds.add(s.project.userId));

  return userIds.size;
}

// Helper: 일별 활성 사용자 추이
async function getUserTrend(days: number): Promise<Array<{ date: string; count: number }>> {
  const result: Array<{ date: string; count: number }> = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayStart = new Date(dateStr);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const count = await getActiveUserCountForDay(dayStart, dayEnd);
    result.push({ date: dateStr, count });
  }

  return result;
}

// Helper: Destiny 통계
async function getDestinyStats(startDateStr: string) {
  const totalDays = await prisma.destinyDay.count();

  const dailyCounts = await prisma.destinyDay.groupBy({
    by: ['date'],
    where: { date: { gte: startDateStr } },
    _count: true,
    orderBy: { date: 'asc' },
  });

  return {
    totalDays,
    trend: dailyCounts.map((d) => ({ date: d.date, count: d._count })),
  };
}

// Helper: Discipline 통계
async function getDisciplineStats(startDateStr: string) {
  const totalRules = await prisma.disciplineRule.count();

  // 평균 달성률 계산: 최근 7일 기준
  const recentDays = 7;
  const recentChecks = await prisma.disciplineCheck.count({
    where: {
      date: { gte: new Date(Date.now() - recentDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    },
  });

  // 총 가능한 체크 수 = 규칙 수 * 일 수
  const possibleChecks = totalRules * recentDays;
  const averageAchievementRate = possibleChecks > 0 ? Math.round((recentChecks / possibleChecks) * 100) : 0;

  const dailyChecks = await prisma.disciplineCheck.groupBy({
    by: ['date'],
    where: { date: { gte: startDateStr } },
    _count: true,
    orderBy: { date: 'asc' },
  });

  // 일별 달성률 계산
  const trend = dailyChecks.map((d) => ({
    date: d.date,
    rate: totalRules > 0 ? Math.round((d._count / totalRules) * 100) : 0,
  }));

  return { totalRules, averageAchievementRate, trend };
}

// Helper: Success 통계
async function getSuccessStats(startDate: Date) {
  const activeProjects = await prisma.successProject.count({
    where: { enabled: true },
  });

  const completedEntries = await prisma.successEntry.count({
    where: { isCompleted: true },
  });

  const dailyEntries = await prisma.successEntry.groupBy({
    by: ['updatedAt'],
    where: { updatedAt: { gte: startDate }, isCompleted: true },
    _count: true,
  });

  // 날짜별로 그룹화
  const dateMap = new Map<string, number>();
  dailyEntries.forEach((e) => {
    const dateStr = e.updatedAt.toISOString().split('T')[0];
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + e._count);
  });

  const trend = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { activeProjects, completedEntries, trend };
}

// Helper: Epistle 통계
async function getEpistleStats(startDateStr: string) {
  const totalLetters = await prisma.epistleDay.count();

  const dailyCounts = await prisma.epistleDay.groupBy({
    by: ['date'],
    where: { date: { gte: startDateStr } },
    _count: true,
    orderBy: { date: 'asc' },
  });

  return {
    totalLetters,
    trend: dailyCounts.map((d) => ({ date: d.date, count: d._count })),
  };
}

export type UserDetail = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    destinyDays: number;
    destinyEvents: number;
    destinyTemplates: number;
    successProjects: number;
    successEntries: number;
    disciplineRules: number;
    disciplineChecks: number;
    epistleDays: number;
    weeklyPlans: number;
  };
};

export async function getAdminUserDetail(userId: string): Promise<ActionResult<UserDetail>> {
  try {
    await verifyAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            destinyDays: true,
            destinyEvents: true,
            destinyTemplates: true,
            successProjects: true,
            disciplineRules: true,
            epistleDays: true,
            weeklyPlans: true,
          }
        }
      }
    });

    if (!user) {
      return error('USER_NOT_FOUND');
    }

    // 추가 통계 조회 (중첩 관계)
    const [successEntries, disciplineChecks] = await Promise.all([
      prisma.successEntry.count({
        where: { project: { userId } }
      }),
      prisma.disciplineCheck.count({
        where: { rule: { userId } }
      })
    ]);

    return success({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stats: {
        destinyDays: user._count.destinyDays,
        destinyEvents: user._count.destinyEvents,
        destinyTemplates: user._count.destinyTemplates,
        successProjects: user._count.successProjects,
        successEntries,
        disciplineRules: user._count.disciplineRules,
        disciplineChecks,
        epistleDays: user._count.epistleDays,
        weeklyPlans: user._count.weeklyPlans,
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export async function deleteAdminUser(userId: string): Promise<ActionResult<void>> {
  try {
    const adminEmail = await verifyAdmin();

    // 삭제할 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return error('USER_NOT_FOUND_FOR_DELETE');
    }

    // 자기 자신 삭제 방지
    if (user.email === adminEmail) {
      return error('SELF_DELETE_NOT_ALLOWED');
    }

    // Cascade 삭제 (관련 데이터 모두 삭제)
    await prisma.user.delete({
      where: { id: userId }
    });

    return success(undefined);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export async function getAdminDetailedStats(
  period: StatsPeriod = 'month'
): Promise<ActionResult<AdminDetailedStats>> {
  try {
    await verifyAdmin();

    const now = new Date();
    const periodDays = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(now.getDate() - periodDays);
    const startDateStr = startDate.toISOString().split('T')[0];

    // 1. 총 사용자 수
    const totalUsers = await prisma.user.count();

    // 2. 활성 사용자 계산 (각 기간별)
    // 활성 사용자: DestinyDay, EpistleDay, DisciplineCheck, SuccessEntry 중 하나라도 생성/수정한 사용자
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 일별 활성 사용자
    const activeDaily = await getActiveUserCount(dayAgo);
    const activeWeekly = await getActiveUserCount(weekAgo);
    const activeMonthly = await getActiveUserCount(monthAgo);

    // 3. 일별 활성 사용자 추이
    const userTrend = await getUserTrend(periodDays);

    // 4. Destiny 모듈 통계
    const destinyStats = await getDestinyStats(startDateStr);

    // 5. Discipline 모듈 통계
    const disciplineStats = await getDisciplineStats(startDateStr);

    // 6. Success 모듈 통계
    const successStats = await getSuccessStats(startDate);

    // 7. Epistle 모듈 통계
    const epistleStats = await getEpistleStats(startDateStr);

    return success({
      totalUsers,
      activeUsersDaily: activeDaily,
      activeUsersWeekly: activeWeekly,
      activeUsersMonthly: activeMonthly,
      userTrend,
      moduleStats: {
        destiny: destinyStats,
        discipline: disciplineStats,
        success: successStats,
        epistle: epistleStats,
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export async function checkDatabaseConnection(): Promise<ActionResult<DatabaseStatus>> {
  try {
    await verifyAdmin();

    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTimeMs = Date.now() - startTime;

    return success({
      connected: true,
      responseTimeMs,
      provider: 'PostgreSQL'
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return success({
      connected: false,
      responseTimeMs: null,
      provider: 'PostgreSQL'
    });
  }
}

// Error Log Types
export type ErrorLogLevel = 'error' | 'warning' | 'info';

export type ErrorLogItem = {
  id: string;
  level: ErrorLogLevel;
  message: string;
  stack: string | null;
  userId: string | null;
  userName: string | null;
  requestUrl: string | null;
  requestMethod: string | null;
  createdAt: Date;
};

export type ErrorLogListResult = {
  logs: ErrorLogItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type ErrorLogSummary = {
  totalErrors: number;
  totalWarnings: number;
  totalInfo: number;
  recentCount24h: number;
};

// Error Log Actions
export async function getErrorLogs(
  page: number = 1,
  pageSize: number = 20,
  level?: ErrorLogLevel
): Promise<ActionResult<ErrorLogListResult>> {
  try {
    await verifyAdmin();

    const where = level ? { level } : {};

    const [logs, total] = await Promise.all([
      prisma.errorLog.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      }),
      prisma.errorLog.count({ where })
    ]);

    const formattedLogs: ErrorLogItem[] = logs.map((log) => ({
      id: log.id,
      level: log.level as ErrorLogLevel,
      message: log.message,
      stack: log.stack,
      userId: log.userId,
      userName: log.user?.name ?? null,
      requestUrl: log.requestUrl,
      requestMethod: log.requestMethod,
      createdAt: log.createdAt
    }));

    return success({ logs: formattedLogs, total, page, pageSize });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export async function getErrorLogDetail(
  id: string
): Promise<ActionResult<ErrorLogItem>> {
  try {
    await verifyAdmin();

    const log = await prisma.errorLog.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    if (!log) {
      return error('ERROR_LOG_NOT_FOUND');
    }

    return success({
      id: log.id,
      level: log.level as ErrorLogLevel,
      message: log.message,
      stack: log.stack,
      userId: log.userId,
      userName: log.user?.name ?? null,
      requestUrl: log.requestUrl,
      requestMethod: log.requestMethod,
      createdAt: log.createdAt
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export async function deleteErrorLog(
  id: string
): Promise<ActionResult<void>> {
  try {
    await verifyAdmin();

    const log = await prisma.errorLog.findUnique({
      where: { id }
    });

    if (!log) {
      return error('ERROR_LOG_NOT_FOUND');
    }

    await prisma.errorLog.delete({
      where: { id }
    });

    return success(undefined);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export async function deleteErrorLogsBefore(
  date: Date
): Promise<ActionResult<{ deletedCount: number }>> {
  try {
    await verifyAdmin();

    if (isNaN(date.getTime())) {
      return error('INVALID_DATE_RANGE');
    }

    const result = await prisma.errorLog.deleteMany({
      where: {
        createdAt: { lt: date }
      }
    });

    return success({ deletedCount: result.count });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}

export async function getErrorLogSummary(): Promise<ActionResult<ErrorLogSummary>> {
  try {
    await verifyAdmin();

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [totalErrors, totalWarnings, totalInfo, recentCount24h] = await Promise.all([
      prisma.errorLog.count({ where: { level: 'error' } }),
      prisma.errorLog.count({ where: { level: 'warning' } }),
      prisma.errorLog.count({ where: { level: 'info' } }),
      prisma.errorLog.count({ where: { createdAt: { gte: dayAgo } } })
    ]);

    return success({
      totalErrors,
      totalWarnings,
      totalInfo,
      recentCount24h
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'Forbidden') return error('FORBIDDEN');
    }
    return error('UNKNOWN');
  }
}
