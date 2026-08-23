import React from "react";
import { router } from "@inertiajs/react";
import { Dialog } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { AlertTriangle } from "lucide-react";
import { BidanItem } from "./types";

interface BidanDeleteDialogProps {
  bidan: BidanItem | null;
  onClose: () => void;
}

export function BidanDeleteDialog({ bidan, onClose }: BidanDeleteDialogProps) {
  const handleDeleteConfirm = () => {
    if (!bidan) return;

    router.delete(route("admin.bidan.destroy", { bidan: bidan.id }), {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog
      isOpen={Boolean(bidan)}
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
            Hapus Akun Bidan?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin menghapus akun Bidan{" "}
            <strong className="text-slate-800 font-bold">
              {bidan?.name}
            </strong>{" "}
            ({bidan?.email})? Akun ini tidak akan dapat login lagi.
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
            Ya, Hapus Akun
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
