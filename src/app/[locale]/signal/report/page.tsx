import { getSignalReport, getReportDates } from '@/app/actions/signal';
import ReportPageClient from './ReportPageClient';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string }>;
};

export default async function ReportPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { date } = await searchParams;

  const [report, reportDates] = await Promise.all([
    getSignalReport(date),
    getReportDates(14),
  ]);

  // Serialize for client
  const serializedReport = report
    ? {
        date: report.date,
        step: report.step,
        columnTitle: report.columnTitle,
        column: report.column,
        newsData: report.newsData as unknown,
        indicators: report.indicators as unknown,
        analysis: report.analysis as unknown,
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
      locale={locale}
    />
  );
}
