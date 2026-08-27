import React from "react";
import { Dialog } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

interface ProfilLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProfilLogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: ProfilLogoutModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Keluar"
      description="Apakah Anda yakin ingin keluar dari akun RASIH Maternal?"
      className="max-w-md"
    >
      <div className="pt-2 space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Anda harus masuk kembali menggunakan email dan kata sandi Anda untuk mengakses rekam medis dan data skrining.
        </p>
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            className="rounded-full text-xs font-bold px-5"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="default"
            onClick={onConfirm}
            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6"
          >
            Ya, Keluar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
