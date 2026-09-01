import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Tabs } from "@/Components/ui/tabs";
import { Plus, CheckCircle2, FileText, Video } from "lucide-react";
import { SortingState } from "@tanstack/react-table";
import { PageProps } from "@/types";
import { AdminArticle, AdminVideo, StatsData } from "./types";
import { KamusArticleTable } from "./_KamusArticleTable";
import { KamusVideoTable } from "./_KamusVideoTable";
import { KamusArticleModal } from "./_KamusArticleModal";
import { KamusVideoModal } from "./_KamusVideoModal";
import { KamusArticleDrawer } from "./_KamusArticleDrawer";
import { KamusDeleteDialog } from "./_KamusDeleteDialog";

type AdminKamusPageProps = PageProps<{
  articles: AdminArticle[];
  videos: AdminVideo[];
  stats: StatsData;
}>;

export default function AdminKamusIndex() {
  const {
    articles = [],
    videos = [],
    flash,
  } = usePage<AdminKamusPageProps>().props;

  const [activeTab, setActiveTab] = useState<string>("articles");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [articleSorting, setArticleSorting] = useState<SortingState>([]);
  const [videoSorting, setVideoSorting] = useState<SortingState>([]);

  // Modals state
  const [viewingArticle, setViewingArticle] = useState<AdminArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideo | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
    type: "article" | "video";
  } | null>(null);

  return (
    <>
      <Head title="Kelola Kamus Kesehatan & Edukasi - RASIH Maternal" />

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fadeIn">
        {/* Flash Notification */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn shadow-soft-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Kelola Kamus Kesehatan
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === "articles" ? (
              <Button
                type="button"
                variant="default"
                size="default"
                onClick={() => {
                  setEditingArticle(null);
                  setIsArticleModalOpen(true);
                }}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-soft-sm shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Artikel</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                size="default"
                onClick={() => {
                  setEditingVideo(null);
                  setIsVideoModalOpen(true);
                }}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-soft-sm shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Video</span>
              </Button>
            )}
          </div>
        </div>

        {/* Tabs & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs
            items={[
              {
                id: "articles",
                label: `Artikel Kamus (${articles.length})`,
                icon: <FileText className="h-4 w-4" />,
              },
              {
                id: "videos",
                label: `Video Edukasi (${videos.length})`,
                icon: <Video className="h-4 w-4" />,
              },
            ]}
            activeTab={activeTab}
            onChange={(id) => {
              setActiveTab(id);
              setGlobalFilter("");
            }}
          />

          <Input
            placeholder={
              activeTab === "articles"
                ? "Filter artikel..."
                : "Filter video..."
            }
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-64 h-9 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400"
          />
        </div>

        {/* TAB CONTENT */}
        {activeTab === "articles" ? (
          <KamusArticleTable
            data={articles}
            globalFilter={globalFilter}
            sorting={articleSorting}
            onSortingChange={setArticleSorting}
            onView={(art) => setViewingArticle(art)}
            onEdit={(art) => {
              setEditingArticle(art);
              setIsArticleModalOpen(true);
            }}
            onDelete={(target) => setDeleteTarget(target)}
          />
        ) : (
          <KamusVideoTable
            data={videos}
            globalFilter={globalFilter}
            sorting={videoSorting}
            onSortingChange={setVideoSorting}
            onEdit={(vid) => {
              setEditingVideo(vid);
              setIsVideoModalOpen(true);
            }}
            onDelete={(target) => setDeleteTarget(target)}
          />
        )}
      </div>

      {/* ARTICLE DRAWER */}
      <KamusArticleDrawer
        article={viewingArticle}
        onClose={() => setViewingArticle(null)}
      />

      {/* ARTICLE MODAL */}
      <KamusArticleModal
        isOpen={isArticleModalOpen}
        editingArticle={editingArticle}
        onClose={() => {
          setIsArticleModalOpen(false);
          setEditingArticle(null);
        }}
      />

      {/* VIDEO MODAL */}
      <KamusVideoModal
        isOpen={isVideoModalOpen}
        editingVideo={editingVideo}
        onClose={() => {
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        }}
      />

      {/* DELETE DIALOG */}
      <KamusDeleteDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}

AdminKamusIndex.layout = (page: React.ReactNode) => <BundaSehatLayout activeNav="admin-kamus">{page}</BundaSehatLayout>;
