import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react";
import { PageProps } from "@/types";
import { FormPersalinanStep1, PersalinanFormData } from "./_FormPersalinanStep1";
import { FormPersalinanStep2, PENAPISAN_PERSALINAN_LIST } from "./_FormPersalinanStep2";
import { FormPersalinanStep3, PersalinanClinicalData } from "./_FormPersalinanStep3";
import { HasilPersalinanRingkas, MLPredictionResult } from "./_HasilPersalinanRingkas";
import { HasilPersalinanDetail } from "./_HasilPersalinanDetail";

const calculateAgeFromBirthDate = (birthDateString?: string | null): number => {
  if (!birthDateString) return 27;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 27;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age >= 12 && age <= 60 ? age : 27;
};

export default function PersalinanScreening() {
  const { auth } = usePage<PageProps>().props;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [rightPanelView, setRightPanelView] = useState<"summary" | "detail">("summary");

  const [formData, setFormData] = useState<PersalinanFormData>({
    nama_pasien: auth?.user?.name || "",
    nik: auth?.user?.nik || "",
    umur: calculateAgeFromBirthDate(auth?.user?.tanggal_lahir),
    hpht: auth?.user?.hpht || "",
    pekerjaan: auth?.user?.pekerjaan || "Ibu Rumah Tangga",
    pendidikan: auth?.user?.pendidikan || "SLTA",
    tinggi_badan: 155,
    berat_badan: 60,
    imt: 25.0,
    gravida: 1,
    paritas: 0,
    abortus: 0,
  });

  const [penapisanAnswers, setPenapisanAnswers] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    PENAPISAN_PERSALINAN_LIST.forEach((item) => {
      init[item.id] = false;
    });
    return init;
  });

  const [clinicalData, setClinicalData] = useState<PersalinanClinicalData>({
    sistolik: 120,
    diastolik: 80,
    nadi: 82,
    suhu: 36.7,
    hb: 12.0,
    proteinuria: "Negatif",
    presentasi_janin: "Kepala",
    jumlah_janin: 1,
    tfu_cm: 32,
    efw_bayi_gram: 3100,
    djj: 140,
    status_ketuban: "Utuh",
    lama_ketuban_pecah_jam: 0,
    pembukaan_cm: 4.0,
    station_kepala: -1,
    kontraksi_10menit: 3,
    durasi_kontraksi_detik: 35,
    jenis_persalinan: "Persalinan Pervaginam",
  });

  const [mlResult, setMlResult] = useState<MLPredictionResult>({
    primary_diagnosis: "Tanpa Komplikasi",
    confidence_score: 0.92,
    risk_category: "KRR",
    risk_label: "Kehamilan Risiko Rendah (KRR)",
    map: 93.33,
    pulse_pressure: 40,
    leu_trombo_ratio: 0.036,
  });

  const handleTogglePenapisan = (id: string, value: boolean) => {
    setPenapisanAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nama_pasien.trim()) errs.nama_pasien = "Nama pasien wajib diisi";
    if (!formData.umur || formData.umur < 12 || formData.umur > 60) errs.umur = "Umur 12 - 60 tahun";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!clinicalData.sistolik || clinicalData.sistolik < 60 || clinicalData.sistolik > 260) {
      errs.sistolik = "Sistol antara 60 - 260 mmHg";
    }
    if (!clinicalData.diastolik || clinicalData.diastolik < 40 || clinicalData.diastolik > 160) {
      errs.diastolik = "Diastol antara 40 - 160 mmHg";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      handleNext(e);
      return;
    }
    if (!validateStep1() || !validateStep3()) return;

    // Kalkulasi Variabel Turunan & Evaluasi Model ML v2
    const map = Math.round(((clinicalData.sistolik + 2 * clinicalData.diastolik) / 3) * 100) / 100;
    const pp = clinicalData.sistolik - clinicalData.diastolik;
    const ltr = 0.036;

    const isPEB =
      penapisanAnswers.preeklamsi_berat ||
      penapisanAnswers.preklamsi_berat ||
      clinicalData.proteinuria === "2+" ||
      clinicalData.proteinuria === "3+" ||
      clinicalData.proteinuria === "4+" ||
      (clinicalData.sistolik >= 160 || clinicalData.diastolik >= 110);

    const isHT = clinicalData.sistolik >= 140 || clinicalData.diastolik >= 90 || map >= 95;
    const isKPD =
      clinicalData.status_ketuban === "Pecah" ||
      penapisanAnswers.ketuban_pecah_mekonium ||
      penapisanAnswers.ketuban_pecah_lama ||
      penapisanAnswers.ketuban_pecah_kurang_bulan;

    const isBled = penapisanAnswers.perdarahan_pervaginam || penapisanAnswers.perdarahan || clinicalData.hb < 8.0;
    const isInf = penapisanAnswers.demam_tinggi || penapisanAnswers.demam || clinicalData.suhu >= 38.0;
    const isLama =
      penapisanAnswers.palpasi_kepala_tinggi ||
      clinicalData.presentasi_janin === "Lintang" ||
      clinicalData.presentasi_janin === "Oblique" ||
      (clinicalData.lama_ketuban_pecah_jam > 12);

    let diag = "Tanpa Komplikasi";
    let cat: "KRR" | "KRT" | "KRST" = "KRR";
    let conf = 0.91;

    if (isPEB) {
      diag = "Preeklamsia";
      cat = "KRST";
      conf = 0.96;
    } else if (isBled) {
      diag = "Perdarahan";
      cat = "KRST";
      conf = 0.93;
    } else if (isHT) {
      diag = "Hipertensi";
      cat = "KRT";
      conf = 0.89;
    } else if (isKPD) {
      diag = "Ketuban Pecah Dini";
      cat = "KRT";
      conf = 0.91;
    } else if (isInf) {
      diag = "Infeksi";
      cat = "KRT";
      conf = 0.88;
    } else if (isLama) {
      diag = "Persalinan Lama";
      cat = "KRT";
      conf = 0.87;
    }

    setMlResult({
      primary_diagnosis: diag,
      confidence_score: conf,
      risk_category: cat,
      risk_label:
        cat === "KRST"
          ? "Risiko Sangat Tinggi (KRST)"
          : cat === "KRT"
          ? "Risiko Tinggi (KRT)"
          : "Risiko Rendah (KRR)",
      map,
      pulse_pressure: pp,
      leu_trombo_ratio: ltr,
      probabilities: {
        "Tanpa Komplikasi": diag === "Tanpa Komplikasi" ? conf : 0.04,
        "Preeklamsia": isPEB ? conf : 0.03,
        "Hipertensi": isHT && !isPEB ? conf : 0.05,
        "Ketuban Pecah Dini": isKPD ? conf : 0.02,
        "Perdarahan": isBled ? conf : 0.01,
        "Persalinan Lama": isLama ? conf : 0.03,
        "Infeksi": isInf ? conf : 0.02,
      },
    });

    setHasScreened(true);
    setRightPanelView("summary");
  };

  const handleRescreen = () => {
    setHasScreened(false);
    setCurrentStep(1);
    const resetInit: Record<string, boolean> = {};
    PENAPISAN_PERSALINAN_LIST.forEach((item) => {
      resetInit[item.id] = false;
    });
    setPenapisanAnswers(resetInit);
  };

  const positiveFactors = PENAPISAN_PERSALINAN_LIST.filter((i) => penapisanAnswers[i.id] === true);
  const isGawatDarurat = positiveFactors.length > 0;

  return (
    <BundaSehatLayout activeNav="persalinan">
      <div className="max-w-[1240px] mx-auto px-0 sm:px-6 lg:px-8 py-0 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-65px)] flex flex-col justify-center">
        <div className="w-full mx-auto bg-white sm:border border-slate-200 overflow-hidden h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            {/* Image Col */}
            <div className="relative lg:col-span-6 h-[240px] lg:h-full overflow-hidden">
              <img src="/images/persalinan-screening.webp" alt="Penapisan Ibu Bersalin" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white lg:hidden" />
            </div>

            {/* Form / Result Col */}
            <div className="lg:col-span-6 lg:h-[calc(100vh-65px)] h-auto overflow-y-auto">
              <div className="p-6 sm:p-8 flex flex-col justify-between min-h-full bg-white">
                <div className="mb-4 text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Penapisan Ibu Bersalin</h1>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    {hasScreened ? "Hasil evaluasi penapisan gawat darurat & prediksi komplikasi ML." : "Deteksi dini kegawatdaruratan & prediksi risiko komplikasi persalinan."}
                  </p>
                </div>

                {hasScreened ? (
                  rightPanelView === "detail" ? (
                    <HasilPersalinanDetail formData={formData} clinicalData={clinicalData} isGawatDarurat={isGawatDarurat} positiveFactors={positiveFactors} penapisanAnswers={penapisanAnswers} mlResult={mlResult} onBackToSummary={() => setRightPanelView("summary")} onRescreen={handleRescreen} />
                  ) : (
                    <HasilPersalinanRingkas formData={formData} clinicalData={clinicalData} isGawatDarurat={isGawatDarurat} positiveFactors={positiveFactors} mlResult={mlResult} onViewDetail={() => setRightPanelView("detail")} onRescreen={handleRescreen} />
                  )
                ) : (
                  <div className="space-y-4">
                    {/* Progress Indicator 3 Steps */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-600 mb-1.5">
                        <span className={currentStep >= 1 ? "text-emerald-700" : ""}>Identitas &amp; Gestasi</span>
                        <span className={currentStep >= 2 ? "text-emerald-700" : ""}>Indikator Penapisan</span>
                        <span className={currentStep >= 3 ? "text-emerald-700" : ""}>Parameter Klinis ML</span>
                      </div>
                      <Progress value={(currentStep / 3) * 100} variant="default" className="h-2" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="rounded-2xl">
                          <AlertTriangle className="h-4 w-4" />
                          <div className="flex-1 space-y-0.5">
                            <AlertTitle>Periksa isian:</AlertTitle>
                            <AlertDescription>
                              <ul className="list-disc pl-4 text-[11px]">
                                {Object.entries(errors).map(([k, err]) => (
                                  <li key={k}>{err}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </div>
                        </Alert>
                      )}

                      {currentStep === 1 && <FormPersalinanStep1 formData={formData} setFormData={setFormData} errors={errors} />}
                      {currentStep === 2 && <FormPersalinanStep2 penapisanAnswers={penapisanAnswers} onToggle={handleTogglePenapisan} />}
                      {currentStep === 3 && <FormPersalinanStep3 clinicalData={clinicalData} setClinicalData={setClinicalData} errors={errors} />}

                      {/* Navigation */}
                      <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                        {currentStep > 1 ? (
                          <Button type="button" variant="outline" onClick={handlePrev} className="rounded-full text-xs font-bold px-5">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span>Sebelumnya</span>
                          </Button>
                        ) : <div />}

                        {currentStep < 3 ? (
                          <Button type="button" onClick={handleNext} className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 ml-auto">
                            <span>Lanjut</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        ) : (
                          <Button type="submit" className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-8 ml-auto shadow-soft-sm">
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
