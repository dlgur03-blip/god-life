'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';
import type { VideoItem } from '@/lib/videos';

export default function VideoGrid({ videos }: { videos: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      {/* Modal Player */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-white hover:text-[var(--color-secondary)] transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, i) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video.id)}
            className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] hover:border-[var(--color-secondary)] transition-all duration-300 text-left animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/90 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                </div>
              </div>
            </div>
            {/* Title */}
            <div className="p-3">
              <p className="text-sm font-medium text-[var(--foreground)] line-clamp-2 leading-snug">
                {video.title}
              </p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
