import { getSignalReport, getReportDates } from '@/app/actions/signal';
import ReportPageClient from './ReportPageClient';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string; mode?: string }>;
};

export default async function ReportPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { date, mode = 'standard' } = await searchParams;

  const [report, reportDates] = await Promise.all([
    getSignalReport(mode, date),
    getReportDates(mode, 14),
  ]);

  const serializedReport = report
    ? {
        date: report.date,
        mode: report.mode,
        step: report.step,
        columnTitle: report.columnTitle,
        column: report.column,
      }
    : null;

  const serializedDates = reportDates.map(({ date, columnTitle, step }) => ({
    date,
    columnTitle,
    step,
  }));

  return (
    <ReportPageClient
      report={serializedReport}
      reportDates={serializedDates}
      currentDate={date ?? serializedDates[0]?.date ?? ''}
      currentMode={mode}
      locale={locale}
    />
  );
}
