import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { ScreeningResult, ScreeningInput } from "@/types/screening";
import { PageProps } from "@/types";
import { HasilRingkas } from "./_HasilRingkas";
import { HasilDetail } from "./_HasilDetail";
import { calculateGestationalAge } from "@/lib/scoringEngine";

type HasilPageProps = PageProps<{
  screening: ScreeningResult;
}>;

export default function HasilScreening() {
  const { screening: result } = usePage<HasilPageProps>().props;
  const [rightPanelView, setRightPanelView] = useState<"summary" | "detail">("summary");

  if (!result) return null;

  const formData: ScreeningInput = result.input_summary || {
    nama_pasien: result.nama_pasien || "",
    umur: 27,
    paritas: 0,
    sistolik: 120,
    diastolik: 80,
    edema_level: "none",
    keluhan_spesifik: [],
    sudah_dapat_treatment: false,
    tipe_screening: "kehamilan",
  };

  const gestationalInfo = calculateGestationalAge(result.input_summary?.hpht);
  if (result.taksiran_hpl && !gestationalInfo.dueDate) {
    gestationalInfo.dueDate = result.taksiran_hpl;
  }

  const handleRescreen = () => {
    router.visit(route("screening.kehamilan"));
  };

  return (
    <BundaSehatLayout activeNav="kehamilan">
      <div className="max-w-[1240px] mx-auto px-0 sm:px-6 lg:px-8 py-0 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-65px)] flex flex-col justify-center">

        {/* Modern Split Card with Image Fade Overlay (2 Kolom) */}
        <div className="w-full mx-auto bg-white rounded-none border-0 sm:border border-slate-200 overflow-hidden h-full lg:h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">

            {/* Kolom Kiri (Gambar Static - 50%) */}
            <div className="relative lg:col-span-6 h-[240px] lg:h-full overflow-hidden">
              <img
                src="/images/pregnancy-screening.webp"
                alt="Screening Kehamilan"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white lg:hidden" />
            </div>

            {/* Kolom Kanan (Konten Utama & Hasil Screening - 50% - Scrollable) */}
            <div className="lg:col-span-6 lg:h-[calc(100vh-65px)] h-auto overflow-y-auto overflow-x-hidden">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-full bg-white relative z-10 space-y-6">

                {/* Header Kolom Kanan */}
                <div className="mb-2 text-center shrink-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                    Screening Kehamilan
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Hasil analisis risiko kehamilan & panduan terapi Bunda.
                  </p>
                </div>

                {/* Area Hasil Screening (Ringkas / Detail Toggle) */}
                <div className="flex-1 flex flex-col justify-between">
                  {rightPanelView === "detail" ? (
                    <HasilDetail
                      screeningResult={result}
                      formData={formData}
                      gestationalInfo={gestationalInfo}
                      setRightPanelView={setRightPanelView}
                      handleRescreen={handleRescreen}
                    />
                  ) : (
                    <HasilRingkas
                      screeningResult={result}
                      formData={formData}
                      gestationalInfo={gestationalInfo}
                      setRightPanelView={setRightPanelView}
                      handleRescreen={handleRescreen}
                    />
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </BundaSehatLayout>
  );
}
