import React, { useState } from "react";
import { RasihMaternalLayout } from "@/Layouts/RasihMaternalLayout";
import { Tabs } from "@/Components/ui/tabs";
import { FileText, Video } from "lucide-react";
import { ArticleItem, VideoItem } from "./types";
import { KamusArticleTab } from "./_KamusArticleTab";
import { KamusVideoTab } from "./_KamusVideoTab";
import { KamusArticleDrawer } from "./_KamusArticleDrawer";

interface KamusPageProps {
  articles?: ArticleItem[];
  videos?: VideoItem[];
}

export default function KamusIndex({
  articles = [],
  videos = [],
}: KamusPageProps) {
  const [activeTab, setActiveTab] = useState<string>("artikel");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Katalog Medis &amp; Terapi Komplementer
        </h1>
        <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
          Panduan istilah medis kehamilan A-Z &amp; video terapi mandiri.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center">
        <Tabs
          items={[
            {
              id: "artikel",
              label: "Kamus Kesehatan A-Z",
              icon: <FileText className="h-4 w-4" />,
            },
            {
              id: "terapi",
              label: "Video Terapi Komplementer",
              icon: <Video className="h-4 w-4" />,
            },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id)}
        />
      </div>

      {/* TAB 1: ARTIKEL KESEHATAN A-Z */}
      {activeTab === "artikel" && (
        <KamusArticleTab
          articles={articles}
          searchQuery={searchQuery}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {/* TAB 2: VIDEO TERAPI KOMPLEMENTER */}
      {activeTab === "terapi" && (
        <KamusVideoTab videos={videos} searchQuery={searchQuery} />
      )}

      {/* Article Detail Drawer */}
      <KamusArticleDrawer
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}

KamusIndex.layout = (page: React.ReactNode) => <RasihMaternalLayout activeNav="kamus">{page}</RasihMaternalLayout>;
