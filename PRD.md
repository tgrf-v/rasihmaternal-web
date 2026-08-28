# Product Requirement Document (PRD) — RASIH Maternal Application

**Nama Proyek**: RASIH Maternal (Risk Assessment and Screening for Integrated Maternal Health)  
**Tagline**: *"Kenali Risiko, Lindungi Ibu dan Bayi"*  
**Deskripsi Sistem**: Web Screening & Decision Support System Komplikasi Kehamilan & Persalinan  
**Arsitektur Sistem**: Full-Stack Single Page Application (Laravel 12 + Inertia.js React 19 + TypeScript) + FastAPI Machine Learning Microservice (Python XGBoost)  
**Tema Desain UI**: Emerald Clinical (`#059669` / `emerald-700`) & Halodoc Rose Accent (`#E11D48` / `rose-600`)  
**Lokasi File Proyek**: `c:\laragon\www\rasihmaternal`  
**FastAPI Service Directory**: `ml_service/` (Port `8000`)

---

## 1. Ringkasan Eksekutif & Visi Sistem

**RASIH Maternal** (*Risk Assessment and Screening for Integrated Maternal Health*) adalah platform kesehatan maternal cerdas yang menggabungkan dua pilar analitik:
1. **Decision Support System (DSS) untuk Ibu Hamil**:
   - Skrining mandiri cepat berbasis rumus obstetri standar: **Kartu Skor Poedji Rochjati (KSPR)**, **Mean Arterial Pressure (MAP)**, dan **Rumus Naegele (HPHT & HPL)**.
   - Menyediakan rekomendasi fasilitas kesehatan (Bidan Desa, Puskesmas PONED, RS PONEK) dan panduan terapi komplementer non-obat (pijat oxytocin, yoga prenatal, aromaterapi, dll.).
2. **Expert System (ES) untuk Bidan / Tenaga Kesehatan**:
   - Pemeriksaan medis mendalam dengan **15 Variabel Klinis & Laboratorium** sesuai dataset maternal riil (10.642 data rekam medis).
   - Terintegrasi dengan model **Machine Learning XGBoost (`xgboost_final_best.json`)** via **FastAPI** untuk memprediksi probabilitas komplikasi maternal spesifik dengan 6 kelas diagnosis.
   - Dilengkapi modul **Partograf Digital Terintegrasi** standar WHO/Kemenkes untuk pencatatan dan pemantauan fase aktif persalinan secara real-time.

---

## 2. Definisi Operasional 15 Variabel Klinis (Dataset Maternal)

Berdasarkan dataset `DataMaternal.xlsx` (Sheet *DEFINISI OPRASIONAL*), berikut adalah 15 variabel klinis yang diolah sistem:

| No | Nama Variabel | Tipe Data | Skala Data | Format Input / Satuan | Keterangan & Definisi Klinis |
|:---|:---|:---|:---|:---|:---|
| 1 | **`USIA_tahun`** | Numerik | Ordinal / Rasio | Tahun (12 – 55) | `<20 Tahun` (Risiko tinggi), `20–35 Tahun` (Reproduksi sehat), `>35 Tahun` (Primi/Grande tua) |
| 2 | **`PEKERJAAN`** | Kategori | Nominal | `Ibu Rumah Tangga` / `Bekerja` | Bekerja mencakup PNS, Karyawan Swasta, Wiraswasta, Petani, Pelajar/Mahasiswa |
| 3 | **`PENDIDIKAN`** | Kategori | Ordinal | `SD`, `SLTP`, `SLTA`, `DIPLOMA`, `SARJANA`, `MAGISTER` | Pendidikan Dasar (`SD`, `SLTP`), Menengah (`SLTA`), Tinggi (`DIPLOMA`, `SARJANA`, `MAGISTER`) |
| 4 | **`GRAVIDA`** | Numerik | Rasio | Jumlah (1 – 15) | Total riwayat kehamilan (G) |
| 5 | **`PARA`** | Numerik | Rasio | Jumlah (0 – 15) | Total riwayat persalinan/kelahiran (P) |
| 6 | **`ABORTUS`** | Numerik | Rasio | Jumlah (0 – 10) | Total riwayat keguguran (A) |
| 7 | **`IMT`** | Numerik | Kontinu / Ordinal | $\text{kg/m}^2$ (atau input BB & TB) | $\text{BB(kg)} / (\text{TB(m)})^2$. Kategori: Underweight (`<18.5`), Normal (`18.5–24.9`), Overweight (`25.0–29.9`), Obese (`>=30.0`) |
| 8 | **`TEKANAN DARAH: Sistol`** | Numerik | Kontinu | $\text{mmHg}$ (70 – 240) | Tekanan darah sistolik saat pemeriksaan |
| 9 | **`TEKANAN DARAH: Diastol`** | Numerik | Kontinu | $\text{mmHg}$ (40 – 150) | Tekanan darah diastolik saat pemeriksaan |
| 10 | **`LETAK JANIN`** | Kategori | Nominal | `Memanjang`, `Melintang`, `Obliq`, `Gemeli` | Posisi letak janin dalam rahim (USG / Leopold) |
| 11 | **`UMUR KEHAMILAN`** | Kategori | Ordinal | `Preterm`, `Aterm`, `Postterm` | Preterm (`<37 minggu`), Aterm (`37–41 minggu`), Postterm (`>=42 minggu`) |
| 12 | **`JENIS PERSALINAN`** | Kategori | Nominal | `Persalinan Pervaginam`, `Sectio Sesarea` | Rencana/riwayat metode persalinan |
| 13 | **`HEMOGLOBIN (g/dL)`** | Numerik | Rasio | $\text{g/dL}$ (4.0 – 18.0) | Kadar Hb darah. Anemia jika $\text{Hb} < 11.0\text{ g/dL}$ |
| 14 | **`LEOKOSIT (uL)`** | Numerik | Rasio | $/{\mu}\text{L}$ ($1.000$ – $50.000$) | Jumlah sel darah putih (leukosit). Indikasi infeksi jika $>11.000/{\mu}\text{L}$ |
| 15 | **`TROMBOSIT (uL)`** | Numerik | Rasio | $/{\mu}\text{L}$ ($20.000$ – $800.000$) | Jumlah trombosit. Trombositopenia jika $<150.000/{\mu}\text{L}$ |

---

## 3. Target Output Diagnosis Komplikasi (6 Kelas Machine Learning)

Model XGBoost menghasilkan probabilitas klasifikasi pada 6 komplikasi maternal:
1. **`Hipertensi`**: Hipertensi kronik / gestasional dalam kehamilan tanpa proteinuria berat.
2. **`Infeksi`**: Infeksi intrauterin, korioamnionitis, atau infeksi sistemik (leukositosis tinggi).
3. **`Ketuban Pecah Dini (KPD)`**: Selaput ketuban pecah sebelum fase inpartu/waktunya.
4. **`Perdarahan`**: Perdarahan antepartum / postpartum (solusio plasenta, plasenta previa, atonia uteri).
5. **`Persalinan Lama`**: Distosia, partus macet, inersia uteri, atau kala persalinan memanjang.
6. **`Preeklamsia`**: Preeklamsia ringan/berat dengan peningkatan TD, MAP $\ge 90\text{ mmHg}$, dan risiko eklamsia.

---

## 4. Arsitektur Multi-Role & Hak Akses Pengguna

### A. Superadmin (Dosen Kebidanan / Peneliti Utama)
- **Akses**: Panel Master Data Admin (`/admin/...`).
- **Kelola Akun Bidan**: Tambah, edit, dan atur penugasan faskes/wilayah kerja Bidan.
- **Kelola Kamus Kesehatan**: Tambah, edit, dan hapus artikel istilah medis & katalog video terapi non-obat menggunakan Tiptap Rich Text Editor.
- **Analytics & Dataset**: Memantau statistik komplikasi wilayah dan histori dataset ML.

### B. Admin / Bidan (Tenaga Kesehatan Wilayah)
- **Akses**: Panel Monitoring Bidan & Form Expert System (`/screening/...`) serta Partograf Digital (`/partograf/...`).
- **Input Rekam Medis**: Mengisi form 15 variabel klinis & laboratorium pasien.
- **Eksekusi Prediksi ML**: Mengirim data ke microservice FastAPI dan menerima skor probabilitas risiko.
- **Monitoring Pasien**: Melihat riwayat skrining pasien di wilayah binaan, memfilter status KRR/KRT/KRST, dan mencatat rujukan intervensi.
- **Partograf Digital**: Mencatat observasi DJJ, pembukaan serviks, penurunan kepala, kontraksi, dan tanda vital.

### C. Pasien (Ibu Hamil / Pengguna Umum)
- **Akses**: Portal Mandiri (`/` & `/screening/kehamilan`).
- **Skrining Mandiri (DSS)**: Mengisi 4–5 data dasar (HPHT, usia, paritas, tekanan darah, keluhan) untuk kalkulasi KSPR instan dan rekomendasi tindakan awal.
- **Kamus Kesehatan & Terapi**: Membaca artikel edukasi kebidanan dan menonton panduan video terapi komplementer mandiri.

---

## 5. Spesifikasi Kontrak API FastAPI Machine Learning (`ml_service/`)

- **Base URL**: `http://127.0.0.1:8000`
- **Model Files**:
  - `xgboost_final_best.json` (Model XGBoost Booster)
  - `label_encoder.joblib` (6 Kelas Komplikasi)
  - `feature_names.joblib` (40 Nama Fitur One-Hot / Engineered)

### A. Endpoint Health Check
- **Endpoint**: `GET /health`
- **Response**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes": ["Hipertensi", "Infeksi", "Ketuban Pecah Dini", "Perdarahan", "Persalinan Lama", "Preeklamsia"],
  "version": "1.0.0"
}
```

### B. Endpoint Prediksi Komplikasi
- **Endpoint**: `POST /predict`
- **Request Headers**: `Content-Type: application/json`

#### Request Payload JSON:
```json
{
  "usia": 31,
  "pekerjaan": "Ibu Rumah Tangga",
  "pendidikan": "SLTA",
  "gravida": 2,
  "para": 1,
  "abortus": 0,
  "imt": 26.5,
  "sistolik": 140,
  "diastolik": 95,
  "letak_janin": "Memanjang",
  "umur_kehamilan": "Aterm",
  "jenis_persalinan": "Persalinan Pervaginam",
  "hemoglobin": 10.2,
  "leukosit": 12500,
  "trombosit": 180000
}
```

#### Logika Feature Engineering di FastAPI (40 Fitur):
1. `MAP` = `(sistolik + 2 * diastolik) / 3`
2. `PP` (Pulse Pressure) = `sistolik - diastolik`
3. `LEU_TROMBO_RATIO` = `leukosit / trombosit`
4. `HB_TROMBO_RATIO` = `hemoglobin / trombosit`
5. `HB_ANEMIA` = `1 if hemoglobin < 11.0 else 0`
6. `LEU_FLAG` = `1 if leukosit > 11000 else 0`
7. `TROMBO_FLAG` = `1 if trombosit < 150000 else 0`
8. `KEHAMILAN_ORD` = `0 if Preterm else (1 if Aterm else 2)`
9. `PENDIDIKAN_LEV` = `1 (SD), 2 (SLTP), 3 (SLTA), 4 (DIPLOMA), 5 (SARJANA), 6 (MAGISTER)`
10. One-Hot Encodings untuk `PEKERJAAN`, `LETAK JANIN`, `JENIS PERSALINAN`, dan `IMT_CAT`.

#### Response Payload JSON:
```json
{
  "status": "success",
  "primary_diagnosis": "Preeklamsia",
  "risk_category": "KRST",
  "confidence_score": 0.742,
  "probabilities": {
    "Preeklamsia": 0.742,
    "Hipertensi": 0.185,
    "Ketuban Pecah Dini": 0.038,
    "Infeksi": 0.021,
    "Perdarahan": 0.010,
    "Persalinan Lama": 0.004
  },
  "clinical_indicators": {
    "map": 110.0,
    "is_hypertension": true,
    "is_anemia": true,
    "is_leukocytosis": true
  },
  "recommendations": {
    "level": "Tinggi",
    "faskes": "Rumah Sakit PONEK / SpOG",
    "intervensi": "Observasi tekanan darah ketat, cek protein urin kuantitatif, dan persiapan rujukan emergensi."
  }
}
```

---

## 6. Struktur Database Backend (Laravel & MySQL)

### 6.1 Tabel `users`
- `id` (PK), `name`, `email`, `password`, `role` (`superadmin`, `bidan`, `pasien`), `no_telepon`, `puskesmas_wilayah`.

### 6.2 Tabel `kamus_items` (Artikel Istilah Medis)
- `id` (PK), `title`, `letter`, `category`, `content` (LongText HTML dari Tiptap Rich Text Editor), `summary` (Legacy/Fallback), `first_aid` (Legacy/Fallback), `is_published`.

### 6.3 Tabel `kamus_videos` (Video Terapi Komplementer)
- `id` (PK), `title`, `badge`, `category`, `instructor`, `youtube_id`, `duration`, `description`, `is_published`.

### 6.4 Tabel `screenings` (Rekam Medis & Hasil Prediksi)
- `id` (PK), `user_id` (FK), `bidan_id` (FK Nullable), `tipe_screening` (`dss` / `es`), `nama_pasien`, `nik`, `umur`, `pekerjaan`, `pendidikan`, `gravida`, `paritas`, `abortus`, `imt`, `sistolik`, `diastolik`, `letak_janin`, `umur_kehamilan`, `jenis_persalinan`, `hemoglobin`, `leukosit`, `trombosit`, `skor_kspr`, `map_value`, `kategori_risiko` (`KRR` / `KRT` / `KRST`), `hasil_prediksi_ml` (JSON), `catatan_bidan` (Text).

### 6.5 Tabel `partograf_records` (Data Partograf Digital)
- `id` (PK), `screening_id` (FK Nullable), `bidan_id` (FK), `nama_pasien`, `gravida_paritas_abortus`, `tanggal_pembukaan_lengkap`, `djj_history` (JSON), `pembukaan_history` (JSON), `tanda_vital_history` (JSON), `status` (`aktif` / `selesai` / `dirujuk`).

---

## 7. Status Eksekusi Proyek Saat Ini

- [x] **Setup Modern UI/UX**: Laravel 12 + Inertia React 19 + Tailwind CSS + Lucide Icons + Shadcn UI.
- [x] **Branding RASIH Maternal**: Logo, nama brand, tagline, dan color styling diselaraskan.
- [x] **Kamus Publik & Side Drawer**: Non-modal side drawer standar Shadcn (`520px`) dengan spring physics animation.
- [x] **Admin Kamus & Tiptap Rich Text Editor**: Single large writing surface untuk penyusunan konten istilah medis lengkap.
- [x] **Partograf Digital Frontend**: Halaman interaktif Partograf aktif dengan curve plotting dan form input parameter.
- [x] **Dataset & Model ML Analysis**: Inspeksi tuntas terhadap `DataMaternal.xlsx` (10.642 baris) & model XGBoost 40 fitur.
- [ ] **FastAPI Microservice (`ml_service/`)**: Pembuatan service FastAPI Python untuk serving prediksi XGBoost.
- [ ] **Expert System Bidan Form**: Implementasi form 15 variabel lengkap di frontend untuk peran Bidan.
