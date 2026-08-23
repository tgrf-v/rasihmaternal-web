import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ArticleItem } from "./types";

interface KamusArticleTabProps {
  articles: ArticleItem[];
  searchQuery: string;
  onSelectArticle: (article: ArticleItem) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function KamusArticleTab({
  articles,
  searchQuery,
  onSelectArticle,
}: KamusArticleTabProps) {
  const [selectedLetter, setSelectedLetter] = useState<string>("semua");

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter =
      selectedLetter === "semua" || art.letter.toUpperCase() === selectedLetter;
    return matchesSearch && matchesLetter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Alphabet Filter Pills */}
      <div className="max-w-4xl mx-auto">
        <div className="p-1.5 bg-white border border-slate-200/80 rounded-full shadow-soft-xs flex items-center justify-between gap-0.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedLetter("semua")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedLetter === "semua"
                ? "bg-emerald-700 text-white shadow-soft-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold"
            }`}
          >
            Semua
          </button>
          {ALPHABET.map((char) => (
            <button
              key={char}
              onClick={() => setSelectedLetter(char)}
              className={`h-7 w-7 rounded-full text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                selectedLetter === char
                  ? "bg-emerald-700 text-white shadow-soft-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold"
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Stacked Row List Layout */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">
            Tidak ada istilah komplikasi ditemukan untuk filter huruf ini.
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:border-slate-200 transition-all cursor-pointer group space-y-2"
            >
              {/* Baris 1 (Atas): Judul Lengkap */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                  {article.title}
                </h3>
              </div>

              {/* Baris 2 (Bawah): Deskripsi ringkas + Panah */}
              <div className="flex items-end justify-between gap-4 pt-0.5">
                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  {article.summary}
                </p>
                <div className="text-slate-400 group-hover:text-rose-600 shrink-0 group-hover:translate-x-1 transition-transform pb-0.5">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
