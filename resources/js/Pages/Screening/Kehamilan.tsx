import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { RasihMaternalLayout } from "@/Layouts/RasihMaternalLayout";
import { Button } from "@/Components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { AlertTriangle, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { ScreeningInput, ScreeningResult } from "@/types/screening";
import { calculateGestationalAge } from "@/lib/scoringEngine";
import { PageProps } from "@/types";

import { InitialScreeningState } from "./_InitialScreeningState";
import { ScreeningStepIndicator } from "./_ScreeningStepIndicator";
import { FormStep1Identitas } from "./_FormStep1Identitas";
import { FormStep2Kondisi } from "./_FormStep2Kondisi";
import { FormStep3Gawat } from "./_FormStep3Gawat";

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

export default function KehamilanScreening() {
  const {
    auth,
    latestScreening: serverLatestScreening,
    recentScreenings: serverRecentScreenings,
  } = usePage<PageProps<{
    latestScreening?: ScreeningResult;
    recentScreenings?: ScreeningResult[];
  }>>().props;

  const TOTAL_STEPS = 3;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormActive, setIsFormActive] = useState<boolean>(false);

  const [formData, setFormData] = useState<ScreeningInput>({
    nama_pasien: auth?.user?.name || "",
    nik: auth?.user?.nik || "",
    umur: calculateAgeFromBirthDate(auth?.user?.tanggal_lahir),
    pekerjaan: auth?.user?.pekerjaan || "Ibu Rumah Tangga",
    pendidikan: auth?.user?.pendidikan || "SLTA",
    gravida: 1,
    paritas: 0,
    abortus: 0,
    hpht: auth?.user?.hpht || "",
    sistolik: 120,
    diastolik: 80,
    edema_level: "none",
    keluhan_spesifik: [],
    sudah_dapat_treatment: false,
    detail_treatment: "",
    tipe_screening: "kehamilan",
    wilayah_puskesmas: auth?.user?.puskesmas || "",
    kehamilan_ke: 1,
    lama_menikah: undefined,
    jarak_kehamilan: undefined,
    jumlah_anak_hidup: 0,
    tinggi_badan: undefined,
    riwayat_keguguran: false,
    riwayat_persalinan_bermasalah: [],
    riwayat_sc_kehamilan: false,
    penyakit_saat_ini: [],
    bengkak_darah_tinggi: false,
    hamil_kembar: false,
    hydramnion: false,
    riwayat_bayi_mati: false,
    serotinus: false,
    letak_sungsang: false,
    letak_lintang: false,
    pendarahan_kehamilan: false,
    preeklampsia_berat: false,
  });

  const [gestationalInfo, setGestationalInfo] = useState<{ weeks: number; days: number; dueDate?: string; formattedAge: string }>({ weeks: 0, days: 0, formattedAge: "" });

  const isHamilPertama = (formData.kehamilan_ke ?? 1) === 1;

  useEffect(() => {
    if (formData.hpht) {
      setGestationalInfo(calculateGestationalAge(formData.hpht));
    }
  }, [formData.hpht]);

  const toggleCheckbox = (field: keyof ScreeningInput, value: string) => {
    const current = (formData[field] as string[]) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nama_pasien.trim()) errs.nama_pasien = "Nama pasien wajib diisi";
    if (!formData.umur || formData.umur < 12 || formData.umur > 60) errs.umur = "Isi umur dengan benar (12-60 tahun)";
    if (!formData.hpht) errs.hpht = "Tanggal HPHT wajib dipilih";
    if ((formData.kehamilan_ke ?? 1) < 1) errs.kehamilan_ke = "Kehamilan ke- minimal 1";
    setErrors(errs);

    const errKeys = Object.keys(errs);
    if (errKeys.length > 0) {
      setTimeout(() => {
        const firstElement = document.getElementById(errKeys[0]);
        if (firstElement) {
          firstElement.scrollIntoView({ behavior: "smooth", block: "center" });
          firstElement.focus();
        }
      }, 50);
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => { setErrors({}); return true; };
  const validateStep3 = (): boolean => { setErrors({}); return true; };

  const handleNextStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
  };

  const handlePrevStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < TOTAL_STEPS) { handleNextStep(e); return; }
    if (!validateStep1() || !validateStep3()) return;

    setIsLoading(true);

    const payload = {
      ...formData,
      gravida: formData.kehamilan_ke ?? 1,
      jenis_persalinan: formData.riwayat_sc_kehamilan ? "Sectio Sesarea" : "Persalinan Pervaginam",
      keluhan_spesifik: [],
    };

    router.post(route("screening.store"), payload as any, {
      preserveScroll: true,
      onError: (serverErrors) => {
        setIsLoading(false);
        setErrors(serverErrors as Record<string, string>);
      },
    });
  };

  const handleStartScreening = () => {
    setIsFormActive(true);
    setCurrentStep(1);
    setErrors({});
  };

  const handleViewDetailFromInitial = (selectedScreening?: ScreeningResult) => {
    const target = selectedScreening || serverLatestScreening;
    if (target?.id) {
      router.visit(route("screening.show", { screening: target.id }));
    }
  };

  const handleBackToInitial = () => {
    setIsFormActive(false);
    setCurrentStep(1);
  };

  return (
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

            {/* Kolom Kanan (Konten Utama & Form Screening - 50% - Scrollable) */}
            <div className="lg:col-span-6 lg:h-[calc(100vh-65px)] h-auto overflow-y-auto overflow-x-hidden">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-full bg-white relative z-10 space-y-6">

                {/* Header Kolom Kanan */}
                <div className="mb-2 text-center shrink-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                    Screening Kehamilan
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {isFormActive
                      ? "Isi pertanyaan berikut untuk mendeteksi risiko komplikasi kehamilan."
                      : "Skrining awal mandiri Ibu Hamil untuk mendeteksi risiko komplikasi."}
                  </p>
                </div>

                {/* Dynamic Area: 1) Initial Landing State, 2) Form Input Steps */}
                <div className="flex-1 flex flex-col justify-between">
                  {!isFormActive ? (
                    <InitialScreeningState
                      recentScreenings={serverRecentScreenings || (serverLatestScreening ? [serverLatestScreening] : [])}
                      latestScreening={serverLatestScreening || null}
                      onStartScreening={handleStartScreening}
                      onViewDetail={handleViewDetailFromInitial}
                    />
                  ) : (
                    <div className="space-y-5">
                      {/* Header bar to go back to initial preview */}
                      <div className="flex items-center justify-between pb-1">
                        <button
                          type="button"
                          onClick={handleBackToInitial}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          <span>Kembali</span>
                        </button>
                      </div>

                      <ScreeningStepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

                      {/* Global Validation Error Banner */}
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

                      {/* Multi-Step Form */}
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {currentStep === 1 && (
                          <FormStep1Identitas
                            formData={formData}
                            setFormData={setFormData}
                            gestationalInfo={gestationalInfo}
                            errors={errors}
                            isHamilPertama={isHamilPertama}
                            toggleCheckbox={toggleCheckbox}
                          />
                        )}

                        {currentStep === 2 && (
                          <FormStep2Kondisi
                            formData={formData}
                            setFormData={setFormData}
                            toggleCheckbox={toggleCheckbox}
                          />
                        )}

                        {currentStep === 3 && (
                          <FormStep3Gawat
                            formData={formData}
                            setFormData={setFormData}
                          />
                        )}

                        {/* Navigation Buttons (Prev / Next / Submit) */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          {currentStep > 1 ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePrevStep}
                              className="rounded-full px-5 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs h-10 gap-1.5"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span>Sebelumnya</span>
                            </Button>
                          ) : (
                            <div />
                          )}

                          {currentStep < TOTAL_STEPS ? (
                            <Button
                              type="button"
                              onClick={handleNextStep}
                              className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 h-10 shadow-soft-sm gap-1.5 ml-auto"
                            >
                              <span>Lanjutkan</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-8 h-10 shadow-soft-sm gap-2 ml-auto"
                            >
                              {isLoading ? (
                                <span>Menganalisis...</span>
                              ) : (
                                <span>Selesai & Lihat Hasil</span>
                              )}
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

      </div>
  );
}

KehamilanScreening.layout = (page: React.ReactNode) => <RasihMaternalLayout activeNav="kehamilan">{page}</RasihMaternalLayout>;
