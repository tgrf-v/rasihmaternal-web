import React from "react";
import { router } from "@inertiajs/react";
import { Dialog } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { AlertTriangle } from "lucide-react";

interface KamusDeleteDialogProps {
  target: { id: number; title: string; type: "article" | "video" } | null;
  onClose: () => void;
}

export function KamusDeleteDialog({
  target,
  onClose,
}: KamusDeleteDialogProps) {
  const handleDeleteConfirm = () => {
    if (!target) return;
    router.delete(`/admin/kamus/${target.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog
      isOpen={Boolean(target)}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md text-center p-6 sm:p-7"
    >
      <div className="space-y-5">
        <div className="h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">
            Hapus {target?.type === "article" ? "Artikel" : "Video"}?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin menghapus{" "}
            {target?.type === "article" ? "artikel" : "video"}{" "}
            <strong className="text-slate-800 font-bold">
              {target?.title}
            </strong>
            ? Data yang dihapus tidak dapat dipulihkan.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            className="rounded-full font-bold text-xs px-5"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="default"
            onClick={handleDeleteConfirm}
            className="rounded-full font-bold text-xs px-5"
          >
            Ya, Hapus
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
