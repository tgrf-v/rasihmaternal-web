import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react";
import { PageProps } from "@/types";
import {
  FormPersalinanStep1,
  PersalinanFormData,
} from "./_FormPersalinanStep1";
import {
  FormPersalinanStep2,
  PENAPISAN_PERSALINAN_LIST,
} from "./_FormPersalinanStep2";
import { HasilPersalinanRingkas } from "./_HasilPersalinanRingkas";
import { HasilPersalinanDetail } from "./_HasilPersalinanDetail";

const calculateAgeFromBirthDate = (birthDateString?: string | null): number => {
  if (!birthDateString) return 27;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 27;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 12 && age <= 60 ? age : 27;
};

export default function PersalinanScreening() {
  const { auth } = usePage<PageProps>().props;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [rightPanelView, setRightPanelView] = useState<"summary" | "detail">("summary");

  // State Form Identitas (Pre-filled dari Profile)
  const [formData, setFormData] = useState<PersalinanFormData>({
    nama_pasien: auth?.user?.name || "",
    nik: auth?.user?.nik || "",
    umur: calculateAgeFromBirthDate(auth?.user?.tanggal_lahir),
    pekerjaan: auth?.user?.pekerjaan || "Ibu Rumah Tangga",
    pendidikan: auth?.user?.pendidikan || "SLTA",
    gravida: 1,
    paritas: 0,
    abortus: 0,
  });

  // State 19 Indikator Penapisan (Default all false / Tidak)
  const [penapisanAnswers, setPenapisanAnswers] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    PENAPISAN_PERSALINAN_LIST.forEach((item) => {
      init[item.id] = false;
    });
    return init;
  });

  const handleTogglePenapisan = (id: string, value: boolean) => {
    setPenapisanAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama_pasien.trim()) newErrors.nama_pasien = "Nama pasien wajib diisi";
    if (!formData.umur || formData.umur < 12 || formData.umur > 60) {
      newErrors.umur = "Umur valid antara 12 - 60 tahun";
    }
    if ((formData.gravida ?? 1) < 1) newErrors.gravida = "Jumlah kehamilan (Gravida) minimal 1";
    if (formData.paritas < 0 || formData.paritas > 20) {
      newErrors.paritas = "Jumlah paritas tidak valid";
    }
    setErrors(newErrors);

    const errKeys = Object.keys(newErrors);
    if (errKeys.length > 0) {
      setTimeout(() => {
        const firstEl = document.getElementById(errKeys[0]);
        if (firstEl) {
          firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
          firstEl.focus();
        }
      }, 50);
      return false;
    }
    return true;
  };

  const handleNext = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      handleNext(e);
      return;
    }
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setHasScreened(true);
    setRightPanelView("summary");
  };

  const handleRescreen = () => {
    setHasScreened(false);
    setCurrentStep(1);
    setRightPanelView("summary");
    const resetInit: Record<string, boolean> = {};
    PENAPISAN_PERSALINAN_LIST.forEach((item) => {
      resetInit[item.id] = false;
    });
    setPenapisanAnswers(resetInit);
  };

  // Kalkulasi Hasil Penapisan
  const positiveFactors = PENAPISAN_PERSALINAN_LIST.filter(
    (item) => penapisanAnswers[item.id] === true
  );
  const isGawatDarurat = positiveFactors.length > 0;

  return (
    <BundaSehatLayout activeNav="persalinan">
      <div className="max-w-[1240px] mx-auto px-0 sm:px-6 lg:px-8 py-0 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-65px)] flex flex-col justify-center">
        {/* Modern Split Card with Image Fade Overlay (2 Kolom) */}
        <div className="w-full mx-auto bg-white rounded-none border-0 sm:border border-slate-200 overflow-hidden h-full lg:h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            {/* Kolom Kiri (Gambar Static - 50%) */}
            <div className="relative lg:col-span-6 h-[240px] lg:h-full overflow-hidden">
              <img
                src="/images/persalinan-screening.webp"
                alt="Penapisan Ibu Bersalin"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white lg:hidden" />
            </div>

            {/* Kolom Kanan (Konten Utama & Form - 50% - Scrollable) */}
            <div className="lg:col-span-6 lg:h-[calc(100vh-65px)] h-auto overflow-y-auto overflow-x-hidden">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-full bg-white relative z-10">
                {/* Header Kolom Kanan */}
                <div className="mb-6 text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5">
                    Penapisan Ibu Bersalin
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                    {hasScreened
                      ? "Hasil evaluasi penapisan gawat darurat & rekomendasi tempat persalinan aman."
                      : "Deteksi kemungkinan komplikasi gawat darurat & penentuan tempat persalinan."}
                  </p>
                </div>

                {/* Dynamic Content Area */}
                {hasScreened ? (
                  rightPanelView === "detail" ? (
                    <HasilPersalinanDetail
                      formData={formData}
                      isGawatDarurat={isGawatDarurat}
                      positiveFactors={positiveFactors}
                      penapisanAnswers={penapisanAnswers}
                      onBackToSummary={() => setRightPanelView("summary")}
                      onRescreen={handleRescreen}
                    />
                  ) : (
                    <HasilPersalinanRingkas
                      formData={formData}
                      isGawatDarurat={isGawatDarurat}
                      positiveFactors={positiveFactors}
                      onViewDetail={() => setRightPanelView("detail")}
                      onRescreen={handleRescreen}
                    />
                  )
                ) : (
                  <div className="space-y-5">
                    {/* Progress Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                        <span className={currentStep >= 1 ? "text-emerald-700 font-bold" : ""}>
                          1. Identitas Pasien
                        </span>
                        <span className={currentStep >= 2 ? "text-emerald-700 font-bold" : ""}>
                          2. 19 Indikator Penapisan
                        </span>
                      </div>
                      <Progress value={(currentStep / 2) * 100} variant="default" className="h-2" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Validation Error Alert */}
                      {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="rounded-2xl animate-shake">
                          <AlertTriangle className="h-4 w-4" />
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <AlertTitle>Mohon lengkapi isian wajib:</AlertTitle>
                            <AlertDescription>
                              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                                {Object.entries(errors).map(([key, err]) => (
                                  <li key={key}>{err}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </div>
                        </Alert>
                      )}

                      {/* STEP 1: IDENTITAS PASIEN */}
                      {currentStep === 1 && (
                        <FormPersalinanStep1
                          formData={formData}
                          setFormData={setFormData}
                          errors={errors}
                        />
                      )}

                      {/* STEP 2: 19 INDIKATOR PENAPISAN IBU BERSALIN */}
                      {currentStep === 2 && (
                        <FormPersalinanStep2
                          penapisanAnswers={penapisanAnswers}
                          onToggle={handleTogglePenapisan}
                        />
                      )}

                      {/* Navigation Buttons */}
                      <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                        {currentStep > 1 ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrev}
                            className="rounded-full text-xs font-bold px-5"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span>Sebelumnya</span>
                          </Button>
                        ) : (
                          <div />
                        )}

                        {currentStep < 2 ? (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 ml-auto"
                          >
                            <span>Lanjut ke Penapisan</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-8 ml-auto shadow-soft-sm"
                          >
                            <span>Selesai &amp; Lihat Hasil</span>
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BundaSehatLayout>
  );
}
