import { VIDEOS } from '@/lib/videos';
import VideoGrid from '@/components/videos/VideoGrid';
import { Play } from 'lucide-react';

export const metadata = {
  title: 'FOX학개론 | ONE LOVE EDU',
};

export default function VideosPage() {
  return (
    <main className="min-h-screen px-4 py-6 md:p-8 flex flex-col items-center gap-6">
      <div className="w-full max-w-6xl">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2.5 rounded-lg"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary) 15%, transparent)' }}
            >
              <Play className="w-6 h-6 text-[var(--color-secondary)]" />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              FOX학개론
            </h1>
          </div>
          <p className="text-[var(--foreground-muted)] text-sm ml-14">
            ONE LOVE EDU | 영상 {VIDEOS.length}개
          </p>
        </div>

        <VideoGrid videos={VIDEOS} />
      </div>
    </main>
  );
}
