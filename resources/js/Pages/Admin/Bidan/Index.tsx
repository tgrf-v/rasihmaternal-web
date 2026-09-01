import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { Plus, CheckCircle2 } from "lucide-react";
import { PageProps } from "@/types";
import { BidanItem } from "./types";
import { BidanTable } from "./_BidanTable";
import { BidanDetailDialog } from "./_BidanDetailDialog";
import { BidanAddModal } from "./_BidanAddModal";
import { BidanEditModal } from "./_BidanEditModal";
import { BidanDeleteDialog } from "./_BidanDeleteDialog";

type AdminBidanPageProps = PageProps<{
  bidanList: BidanItem[];
}>;

export default function AdminBidanIndex() {
  const { bidanList = [], flash } = usePage<AdminBidanPageProps>().props;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [viewingBidan, setViewingBidan] = useState<BidanItem | null>(null);
  const [editingBidan, setEditingBidan] = useState<BidanItem | null>(null);
  const [deletingBidan, setDeletingBidan] = useState<BidanItem | null>(null);

  const handleToggleStatus = (bidan: BidanItem) => {
    router.patch(
      route("admin.bidan.toggle-status", { bidan: bidan.id }),
      {},
      { preserveScroll: true }
    );
  };

  return (
    <>
      <Head title="Kelola Akun Bidan - RASIH Maternal" />

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fadeIn">
        {/* FLASH NOTIFICATION */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn shadow-soft-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Kelola Akun Bidan
            </h1>
          </div>

          <Button
            type="button"
            variant="default"
            size="default"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-soft-sm shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah</span>
          </Button>
        </div>

        {/* DATA TABLE */}
        <BidanTable
          data={bidanList}
          onView={(b) => setViewingBidan(b)}
          onEdit={(b) => setEditingBidan(b)}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* DETAIL DIALOG */}
      <BidanDetailDialog
        bidan={viewingBidan}
        onClose={() => setViewingBidan(null)}
      />

      {/* CREATE MODAL */}
      <BidanAddModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* EDIT MODAL */}
      <BidanEditModal
        bidan={editingBidan}
        onClose={() => setEditingBidan(null)}
      />

      {/* DELETE DIALOG */}
      <BidanDeleteDialog
        bidan={deletingBidan}
        onClose={() => setDeletingBidan(null)}
      />
    </>
  );
}

AdminBidanIndex.layout = (page: React.ReactNode) => <BundaSehatLayout activeNav="admin-bidan">{page}</BundaSehatLayout>;
