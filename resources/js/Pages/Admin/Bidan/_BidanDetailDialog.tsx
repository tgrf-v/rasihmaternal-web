import React from "react";
import { Dialog } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { User } from "lucide-react";
import { BidanItem } from "./types";

interface BidanDetailDialogProps {
  bidan: BidanItem | null;
  onClose: () => void;
}

export function BidanDetailDialog({ bidan, onClose }: BidanDetailDialogProps) {
  return (
    <Dialog
      isOpen={Boolean(bidan)}
      onClose={onClose}
      title="Detail Akun Bidan"
      description="Informasi profil dan penugasan Bidan Wilayah"
    >
      {bidan && (
        <div className="space-y-4 pt-2">
          {/* Header Profil Rata Tengah */}
          <div className="flex flex-col items-center text-center py-2 space-y-2">
            <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shadow-soft-xs">
              <User className="h-8 w-8 text-slate-600" />
            </div>
            <div className="space-y-0.5 max-w-sm">
              <h3 className="text-base font-bold text-slate-900 break-words">
                {bidan.name}
              </h3>
              <p className="text-xs text-slate-500 break-words">{bidan.email}</p>
            </div>
          </div>

          {/* Grid Informasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">
                Nomor STR
              </span>
              <p className="font-mono font-semibold text-slate-800">
                {bidan.no_str || "-"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">
                Status Akun
              </span>
              <div>
                {bidan.is_active !== false ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>Aktif</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <span>Nonaktif</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">
                Nomor WhatsApp
              </span>
              <p className="font-medium text-slate-800">
                {bidan.no_telepon || "-"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">
                Wilayah Puskesmas
              </span>
              <p className="font-medium text-slate-800">
                {bidan.puskesmas_wilayah || "-"}
              </p>
            </div>
          </div>

          {/* Footer Dialog */}
          <div className="flex items-center justify-end pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onClose}
              className="rounded-full font-bold text-xs px-5"
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
