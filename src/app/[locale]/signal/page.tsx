import { getSignalsByDate, getSignalDates } from '@/app/actions/signal';
import { checkAdminAccess } from '@/lib/auth';
import SignalPageClient from './SignalPageClient';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string }>;
};

export default async function SignalPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { date } = await searchParams;

  const [rawSignals, availableDates, { isAdmin }] = await Promise.all([
    getSignalsByDate(date),
    getSignalDates(14),
    checkAdminAccess(),
  ]);

  // Serialize for client (strip Date objects)
  const signals = rawSignals.map(({ createdAt, ...rest }) => rest);

  return (
    <SignalPageClient
      signals={signals}
      availableDates={availableDates}
      currentDate={date ?? availableDates[0] ?? ''}
      locale={locale}
      isAdmin={isAdmin}
    />
  );
}
