export type UserRole = 'pasien' | 'admin' | 'super_admin';

export interface PasienData {
  nama: string;
  nik?: string;
  umur: number;
  paritas: number;
  hpht?: string;
  usiaKehamilanMinggu: number;
  hpl?: string;
  wilayahPuskesmas?: string;
}

export type EdemaLevel = 'none' | 'ringan_kaki' | 'sedang_tungkai' | 'berat_wajah_tangan' | 'bengkak_muka_tangan';

export interface ScreeningInput {
  nama_pasien: string;
  nik?: string;
  pekerjaan?: string;
  pendidikan?: string;
  umur: number;
  gravida?: number;
  paritas: number;
  abortus?: number;
  tinggi_badan?: number;
  berat_badan?: number;
  imt?: number;
  hpht?: string;
  sistolik: number;
  diastolik: number;
  letak_janin?: string;
  umur_kehamilan?: string;
  jenis_persalinan?: string;
  hb?: number;
  leokosit?: number;
  trombosit?: number;
  edema_level: EdemaLevel;
  keluhan_spesifik: string[];
  sudah_dapat_treatment: boolean;
  detail_treatment?: string;
  tipe_screening: 'kehamilan' | 'persalinan';
  wilayah_puskesmas?: string;
  posisi_janin?: string;
  ada_riwayat_sc?: boolean;
  kondisi_ketuban?: string;

  // ── Field Klinis & Partograf Model v2 ──
  nadi?: number;
  suhu?: number;
  proteinuria?: string;
  status_ketuban?: string;
  lama_ketuban_pecah_jam?: number;
  pembukaan_cm?: number;
  station_kepala?: number;
  kontraksi_10menit?: number;
  durasi_kontraksi_detik?: number;
  djj?: number;
  jumlah_janin?: number;
  presentasi_janin?: string;
  tfu_cm?: number;
  efw_bayi_gram?: number;
  uk_minggu?: number;
  uk_hari?: number;

  // ── Field Poedji Rochjati (Screening Kehamilan) ──
  kehamilan_ke?: number;
  lama_menikah?: '<4' | '>=4';
  jarak_kehamilan?: '<2' | '2-10' | '>10';
  jumlah_anak_hidup?: number;
  riwayat_keguguran?: boolean;
  riwayat_persalinan_bermasalah?: string[];
  riwayat_sc_kehamilan?: boolean;
  penyakit_saat_ini?: string[];
  bengkak_darah_tinggi?: boolean;
  hamil_kembar?: boolean;
  hydramnion?: boolean;
  riwayat_bayi_mati?: boolean;
  serotinus?: boolean;
  letak_sungsang?: boolean;
  letak_lintang?: boolean;
  pendarahan_kehamilan?: boolean;
  preeklampsia_berat?: boolean;
}

export type RiskLevel = 'Ringan' | 'Sedang' | 'Berat';

export interface DetailSkorFactor {
  deskripsi: string;
  skor: number;
}

export interface ScreeningResult {
  id?: number;
  kode_screening: string;
  skor_poedji_rochjati: number;
  total_skor: number;
  tingkat_risiko: RiskLevel;
  kategori_risiko: 'KRR' | 'KRT' | 'KRST';
  status_label: string;
  map_value: number;
  potensi_komplikasi: string[];
  rekomendasi_faskes: string;
  rekomendasi_tempat: string;
  penolong_persalinan: string;
  taksiran_hpl?: string;
  saran_terapi_ids: number[];
  saran_terapi: string[];
  detail_skor: DetailSkorFactor[];
  diagnosa_ml?: string;
  kategori_ml?: 'KRR' | 'KRT' | 'KRST';
  skor_risiko_ml?: number;
  probabilitas_ml?: Record<string, number>;
  input_summary: ScreeningInput;
  nama_pasien?: string;
  created_at: string;
}

export interface KamusItem {
  id: number;
  judul: string;
  slug: string;
  kategori: 'edukasi' | 'terapi_komplementer' | 'pertolongan_pertama';
  ringkasan: string;
  konten: string;
  tingkat_risiko_target: 'Semua' | 'Ringan' | 'Sedang' | 'Berat';
  panduan_langkah?: string[];
  sumber_referensi?: string;
  is_active: boolean;
}

export interface DatasetMlMetric {
  id: number;
  nama_dataset: string;
  jumlah_sampel: number;
  akurasi: number;
  precision_score: number;
  recall_score: number;
  is_active: boolean;
  created_at: string;
}
