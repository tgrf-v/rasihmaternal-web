import React, { useState } from "react";
import { Card } from "@/Components/ui/card";
import { Video, X } from "lucide-react";
import { VideoItem } from "./types";

interface KamusVideoTabProps {
  videos: VideoItem[];
  searchQuery: string;
}

export function KamusVideoTab({ videos, searchQuery }: KamusVideoTabProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const filteredVideos = videos.filter((vid) => {
    return (
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8">
          <Video className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">
            Tidak ada video ditemukan
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Coba kata kunci pencarian terapi lainnya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <Card
              key={vid.id}
              className="rounded-3xl border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all bg-white group cursor-pointer flex flex-col justify-between"
              onClick={() => setSelectedVideo(vid)}
            >
              <div className="flex flex-col h-full">
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top-Left Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                    {vid.badge}
                  </span>

                  {/* White Circle Play Button */}
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-white text-rose-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Bottom-Right Duration */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold">
                    {vid.duration}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wide">
                      {vid.category}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-rose-600 transition-colors">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-0.5">
                      {vid.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs">
                    <span className="font-bold text-rose-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Tonton &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Video Modal Player Pop-up */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/80 flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedVideo(null);
          }}
        >
          <div className="max-w-3xl w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl space-y-0 text-white animate-scaleUp">
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-900">
              <div className="space-y-0.5 min-w-0 pr-4">
                <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  {selectedVideo.category} · {selectedVideo.badge}
                </div>
                <h3 className="font-bold text-white text-base sm:text-lg truncate">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors shrink-0"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Description */}
            <div className="p-4 sm:p-5 bg-slate-900 space-y-2 border-t border-slate-800">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
