import { ScreeningInput, ScreeningResult, RiskLevel, DetailSkorFactor } from "@/types/screening";

export function calculateGestationalAge(hphtString?: string): {
  weeks: number;
  days: number;
  dueDate?: string;
  formattedAge: string;
} {
  if (!hphtString) return { weeks: 0, days: 0, formattedAge: "0 Minggu" };
  try {
    const hpht = new Date(hphtString);
    if (isNaN(hpht.getTime())) return { weeks: 0, days: 0, formattedAge: "0 Minggu" };
    const today = new Date();
    const diffTime = today.getTime() - hpht.getTime();
    if (diffTime < 0) return { weeks: 0, days: 0, formattedAge: "0 Minggu" };

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    let formattedAge = "";
    if (weeks > 0 && days > 0) {
      formattedAge = `${weeks} Minggu ${days} Hari`;
    } else if (weeks > 0 && days === 0) {
      formattedAge = `${weeks} Minggu`;
    } else if (weeks === 0 && days > 0) {
      formattedAge = `${days} Hari`;
    } else {
      formattedAge = "0 Hari";
    }

    const hpl = new Date(hpht);
    hpl.setDate(hpl.getDate() + 7);
    hpl.setMonth(hpl.getMonth() - 3);
    hpl.setFullYear(hpl.getFullYear() + 1);
    const formattedDate = hpl.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    return { weeks: Math.max(0, weeks), days: Math.max(0, days), dueDate: formattedDate, formattedAge };
  } catch (error) {
    return { weeks: 0, days: 0, formattedAge: "0 Minggu" };
  }
}

export function calculateMAP(sistolik: number, diastolik: number): number {
  if (sistolik <= 0 || diastolik <= 0) return 0;
  return Number(((sistolik + 2 * diastolik) / 3).toFixed(2));
}

/**
 * Hitung Taksiran Berat Janin (TBJ) berdasarkan Rumus Johnson-Toshach.
 * TBJ (gram) = (TFU - N) * 155
 * N = 13 jika station <= -2 (belum masuk PAP)
 * N = 12 jika station -1 s.d 0 (masuk PAP)
 * N = 11 jika station >= +1 (melewati spina / dasar panggul)
 */
export function calculateJohnsonTBJ(tfuCm: number, stationKepala: number = -1): {
  tbjGram: number;
  nConstant: number;
  kategori: string;
} {
  if (!tfuCm || tfuCm <= 0) {
    return { tbjGram: 3000, nConstant: 12, kategori: "Normal" };
  }
  let n = 12;
  if (stationKepala <= -2) {
    n = 13;
  } else if (stationKepala >= 1) {
    n = 11;
  }
  const tbj = Math.max(500, Math.round((tfuCm - n) * 155));
  let kategori = "Normal (2.500 - 4.000 g)";
  if (tbj < 2500) {
    kategori = "Risiko BBLR (< 2.500 g)";
  } else if (tbj > 4000) {
    kategori = "Risiko Makrosomia (> 4.000 g)";
  }
  return { tbjGram: tbj, nConstant: n, kategori };
}

export function evaluateScreening(input: ScreeningInput): ScreeningResult {
  let score = 2;
  const komplikasi: string[] = [];
  const detailSkorList: DetailSkorFactor[] = [{ deskripsi: "Skor Awal Ibu Hamil (KSPR)", skor: 2 }];

  const kehamilanKe = input.kehamilan_ke ?? (input.gravida ?? 1);
  const isHamilPertama = kehamilanKe === 1;
  const umur = input.umur ?? 0;

  // KELOMPOK I — APGO
  if (isHamilPertama && umur <= 16) {
    score += 4; komplikasi.push("Terlalu Muda Hamil I"); detailSkorList.push({ deskripsi: "Terlalu Muda Hamil I (<=16 Tahun)", skor: 4 });
  } else if (isHamilPertama && umur >= 35) {
    score += 4; komplikasi.push("Terlalu Tua Hamil I (>=35 Tahun)"); detailSkorList.push({ deskripsi: "Terlalu Tua Hamil I (>=35 Tahun)", skor: 4 });
  } else if (!isHamilPertama && umur >= 35) {
    score += 4; komplikasi.push("Usia Terlalu Tua (>=35 Tahun)"); detailSkorList.push({ deskripsi: "Usia Terlalu Tua (>=35 Tahun)", skor: 4 });
  }

  if (isHamilPertama && input.lama_menikah === ">=4") {
    score += 4; komplikasi.push("Terlalu Lambat Hamil I (Menikah >=4 Tahun)"); detailSkorList.push({ deskripsi: "Terlalu Lambat Hamil I (Menikah >=4 Tahun)", skor: 4 });
  }

  if (!isHamilPertama) {
    if (input.jarak_kehamilan === "<2") {
      score += 4; komplikasi.push("Jarak Kehamilan Terlalu Cepat (<2 Tahun)"); detailSkorList.push({ deskripsi: "Jarak Kehamilan Terlalu Cepat (<2 Tahun)", skor: 4 });
    } else if (input.jarak_kehamilan === ">10") {
      score += 4; komplikasi.push("Jarak Kehamilan Terlalu Lama (>10 Tahun)"); detailSkorList.push({ deskripsi: "Jarak Kehamilan Terlalu Lama (>10 Tahun)", skor: 4 });
    }
  }

  const jumlahAnakHidup = input.jumlah_anak_hidup ?? input.paritas ?? 0;
  if (jumlahAnakHidup >= 4) {
    score += 4; komplikasi.push("Terlalu Banyak Anak (>=4 Anak Hidup)"); detailSkorList.push({ deskripsi: "Terlalu Banyak Anak (>=4 Anak Hidup)", skor: 4 });
  }

  if (input.tinggi_badan && input.tinggi_badan <= 145) {
    score += 4; komplikasi.push("Tinggi Badan <=145 cm (Risiko CPD)"); detailSkorList.push({ deskripsi: "Tinggi Badan <=145 cm (Risiko CPD)", skor: 4 });
  }

  if (input.riwayat_keguguran === true) {
    score += 4; komplikasi.push("Riwayat Keguguran / Gagal Kehamilan"); detailSkorList.push({ deskripsi: "Riwayat Keguguran / Gagal Kehamilan", skor: 4 });
  }

  const riwayatBermasalah = input.riwayat_persalinan_bermasalah ?? [];
  if (!isHamilPertama) {
    if (riwayatBermasalah.includes("tang_vakum")) { score += 4; komplikasi.push("Riwayat Persalinan Ditarik Tang / Vakum"); detailSkorList.push({ deskripsi: "Riwayat Persalinan Ditarik Tang / Vakum", skor: 4 }); }
    if (riwayatBermasalah.includes("plasenta_manual")) { score += 4; komplikasi.push("Riwayat Plasenta Manual / Uri Dirogoh"); detailSkorList.push({ deskripsi: "Riwayat Plasenta Manual / Uri Dirogoh", skor: 4 }); }
    if (riwayatBermasalah.includes("infus_transfusi")) { score += 4; komplikasi.push("Riwayat Diberi Infus / Transfusi (Perdarahan)"); detailSkorList.push({ deskripsi: "Riwayat Diberi Infus / Transfusi (Perdarahan)", skor: 4 }); }
  }

  if (input.riwayat_sc_kehamilan === true || input.ada_riwayat_sc === true) {
    score += 8; komplikasi.push("Riwayat Operasi Sesar (SC)"); detailSkorList.push({ deskripsi: "Riwayat Operasi Sesar (SC)", skor: 8 });
  }

  // KELOMPOK II — AGO
  const penyakitList = input.penyakit_saat_ini ?? [];
  const penyakitMap: Record<string, string> = {
    anemia: "Kurang Darah / Anemia dalam Kehamilan",
    malaria: "Malaria dalam Kehamilan",
    tbc: "TBC Paru dalam Kehamilan",
    jantung: "Payah Jantung dalam Kehamilan",
    diabetes: "Kencing Manis (Diabetes) dalam Kehamilan",
    pms: "Penyakit Menular Seksual dalam Kehamilan",
  };
  for (const key of Object.keys(penyakitMap)) {
    if (penyakitList.includes(key)) { score += 4; komplikasi.push(penyakitMap[key]); detailSkorList.push({ deskripsi: penyakitMap[key], skor: 4 }); }
  }

  if (input.bengkak_darah_tinggi === true) {
    score += 4; komplikasi.push("Bengkak Wajah / Tungkai Disertai Tekanan Darah Tinggi"); detailSkorList.push({ deskripsi: "Bengkak Wajah / Tungkai Disertai Tekanan Darah Tinggi", skor: 4 });
  }
  if (input.hamil_kembar === true) {
    score += 4; komplikasi.push("Hamil Kembar (Gemelli)"); detailSkorList.push({ deskripsi: "Hamil Kembar (Gemelli)", skor: 4 });
  }
  if (input.hydramnion === true) {
    score += 4; komplikasi.push("Hydramnion (Cairan Ketuban Berlebih)"); detailSkorList.push({ deskripsi: "Hydramnion (Cairan Ketuban Berlebih)", skor: 4 });
  }
  if (input.riwayat_bayi_mati === true) {
    score += 4; komplikasi.push("Riwayat Bayi Mati Dalam Kandungan"); detailSkorList.push({ deskripsi: "Riwayat Bayi Mati Dalam Kandungan", skor: 4 });
  }
  if (input.serotinus === true) {
    score += 4; komplikasi.push("Kehamilan Lebih Bulan / Serotinus (>42 Minggu)"); detailSkorList.push({ deskripsi: "Kehamilan Lebih Bulan / Serotinus (>42 Minggu)", skor: 4 });
  }

  // KELOMPOK III — GDOB
  if (input.letak_sungsang === true) {
    score += 8; komplikasi.push("Letak Bayi Sungsang"); detailSkorList.push({ deskripsi: "Letak Bayi Sungsang", skor: 8 });
  }
  if (input.letak_lintang === true) {
    score += 8; komplikasi.push("Letak Bayi Lintang"); detailSkorList.push({ deskripsi: "Letak Bayi Lintang", skor: 8 });
  }
  if (input.pendarahan_kehamilan === true) {
    score += 8; komplikasi.push("Perdarahan Dalam Kehamilan"); detailSkorList.push({ deskripsi: "Perdarahan Dalam Kehamilan", skor: 8 });
  }
  if (input.preeklampsia_berat === true) {
    score += 8; komplikasi.push("Preeklampsia Berat / Kejang-Kejang (Eklampsia)"); detailSkorList.push({ deskripsi: "Preeklampsia Berat / Kejang-Kejang (Eklampsia)", skor: 8 });
  }

  const mapVal = calculateMAP(input.sistolik ?? 120, input.diastolik ?? 80);

  let riskLevel: RiskLevel = "Ringan";
  let katRisiko: "KRR" | "KRT" | "KRST" = "KRR";
  let statusLabel = "Risiko Ringan / Rendah";

  if (score >= 12) { riskLevel = "Berat"; katRisiko = "KRST"; statusLabel = "Risiko Sangat Tinggi / Berat"; }
  else if (score >= 6) { riskLevel = "Sedang"; katRisiko = "KRT"; statusLabel = "Risiko Tinggi / Sedang"; }

  let faskes = "";
  let tempat = "";
  let penolong = "";

  if (riskLevel === "Berat") {
    tempat = "Rumah Sakit Rujukan";
    penolong = "Dokter Spesialis Kandungan";
    faskes = "Dianjurkan bersalin di Rumah Sakit bersama Dokter Kandungan dan tim medis lengkap. Skor >=12 wajib dirujuk segera.";
  } else if (riskLevel === "Sedang") {
    tempat = "Puskesmas / Klinik";
    penolong = "Bidan & Dokter";
    faskes = "Dianjurkan bersalin dengan tenaga kesehatan (Bidan / Dokter) di Puskesmas atau Rumah Sakit terdekat.";
  } else {
    tempat = "Klinik Bidan / Puskesmas";
    penolong = "Bidan";
    faskes = "Dapat bersalin secara normal di Klinik Bidan atau Puskesmas dengan pendampingan Bidan.";
  }

  const saranTerapiList: string[] = [];
  if (input.bengkak_darah_tinggi || input.preeklampsia_berat) {
    saranTerapiList.push("Kompres Warm Compress pada leher & pundak");
    saranTerapiList.push("Teknik Pernapasan Deep Breathing Relaksasi");
    saranTerapiList.push("Aromaterapi Lavender Meredakan Kecemasan");
  } else if (penyakitList.includes("anemia")) {
    saranTerapiList.push("Konsumsi Makanan Tinggi Zat Besi (Bayam, Hati Ayam, Kacang Merah)");
    saranTerapiList.push("Minum Tablet Tambah Darah (TTD) Sesuai Anjuran Bidan");
    saranTerapiList.push("Hindari Minum Teh / Kopi Bersamaan dengan Makan");
  } else {
    saranTerapiList.push("Pijat Oxytocin Tulang Belakang (Bantuan Suami)");
    saranTerapiList.push("Senam Pelenturan Panggul Trimester 3");
    saranTerapiList.push("Minum Air Putih Cukup (8-10 Gelas/Hari)");
  }

  const gestational = calculateGestationalAge(input.hpht);
  const randomCode = `SCR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    kode_screening: randomCode,
    skor_poedji_rochjati: score,
    total_skor: score,
    tingkat_risiko: riskLevel,
    kategori_risiko: katRisiko,
    status_label: statusLabel,
    map_value: mapVal,
    potensi_komplikasi: Array.from(new Set(komplikasi)),
    rekomendasi_faskes: faskes,
    rekomendasi_tempat: tempat,
    penolong_persalinan: penolong,
    taksiran_hpl: gestational.dueDate,
    saran_terapi_ids: riskLevel === "Berat" ? [3, 4] : riskLevel === "Sedang" ? [1, 2] : [2],
    saran_terapi: saranTerapiList,
    detail_skor: detailSkorList,
    input_summary: input,
    nama_pasien: input.nama_pasien,
    created_at: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  };
}
