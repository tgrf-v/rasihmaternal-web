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
   - Pemeriksaan medis mendalam dengan **30 Variabel Klinis, Laboratorium & Intrapartum** (Model v2).
   - Terintegrasi dengan model **Machine Learning XGBoost (`xgboost_final_model.json`)** via **FastAPI** untuk memprediksi probabilitas komplikasi maternal spesifik dengan **7 Kelas Diagnosis** (termasuk status *Tanpa Komplikasi / Fisiologis*).
   - Dilengkapi modul **Partograf Digital Terintegrasi** standar WHO/Kemenkes untuk pencatatan dan pemantauan fase aktif persalinan secara real-time.

---

## 2. Definisi Operasional 30 Variabel Klinis (Model v2)

Model Machine Learning v2 memproses 30 variabel input klinis yang ditransformasikan menjadi 42 fitur input numerik:

| No | Nama Variabel | Kategori | Tipe Data | Format / Satuan | Keterangan & Definisi Klinis |
|:---|:---|:---|:---|:---|:---|
| 1 | **`USIA_TAHUN`** | Demografi | Numerik | Tahun (12–55) | Usia reproduksi ibu hamil. |
| 2 | **`PENDIDIKAN`** | Demografi | Kategori | `Dasar`, `Menengah`, `Tinggi` | Tingkat pendidikan formal terakhir. |
| 3 | **`PEKERJAAN`** | Demografi | Kategori | `Bekerja`, `Ibu Rumah Tangga` | Status aktivitas pekerjaan sehari-hari. |
| 4 | **`TINGGI_BADAN_CM`** | Antropometri | Numerik | cm (100–220) | Tinggi badan ibu. Risiko panggul sempit jika $<145\text{ cm}$. |
| 5 | **`BB_KG`** | Antropometri | Numerik | kg (30–200) | Berat badan ibu saat pemeriksaan. |
| 6 | **`IMT`** | Antropometri | Numerik | $\text{kg/m}^2$ | Indeks Massa Tubuh: $\text{BB} / (\text{TB/100})^2$. |
| 7 | **`GRAVIDA`** | Obstetri | Numerik | Jumlah (1–20) | Total riwayat kehamilan (G). |
| 8 | **`PARA`** | Obstetri | Numerik | Jumlah (0–20) | Total riwayat persalinan viable (P). |
| 9 | **`ABORTUS`** | Obstetri | Numerik | Jumlah (0–15) | Total riwayat keguguran (A). |
| 10 | **`UK_MINGGU`** | Usia Hamil | Numerik | Minggu (0–45) | Usia kehamilan dalam minggu. |
| 11 | **`UK_HARI`** | Usia Hamil | Numerik | Hari (0–6) | Tambahan hari usia kehamilan. |
| 12 | **`JUMLAH_JANIN`** | Obstetri | Numerik | Jumlah (1–5) | Kehamilan tunggal atau gemeli/ganda. |
| 13 | **`PRESENTASI_JANIN`** | Obstetri | Kategori | `Kepala`, `Bokong/Sungsang`, `Lintang`, `Oblique` | Posisi bagian terendah janin. |
| 14 | **`EFW_BAYI_GRAM`** | Janin | Numerik | Gram (300–6000) | Taksiran Berat Janin (Estimated Fetal Weight). |
| 15 | **`SBP_MMHG`** | Tanda Vital | Numerik | mmHg (50–260) | Tekanan darah sistolik saat pemeriksaan. |
| 16 | **`DBP_MMHG`** | Tanda Vital | Numerik | mmHg (30–160) | Tekanan darah diastolik saat pemeriksaan. |
| 17 | **`NADI_XMENIT`** | Tanda Vital | Numerik | x/menit (40–180) | Frekuensi denyut nadi ibu. |
| 18 | **`SUHU_C`** | Tanda Vital | Numerik | $^{\circ}\text{C}$ (34–42) | Suhu tubuh ibu (demam jika $\ge 37.8^{\circ}\text{C}$). |
| 19 | **`PROTEINURIA`** | Laboratorium | Kategori | `Negatif`, `Trace`, `1+`, `2+`, `3+`, `4+` | Kadar protein urin kuantitatif/kualitatif. |
| 20 | **`HEMOGLOBIN_GDL`** | Laboratorium | Numerik | g/dL (3–22) | Kadar Hb darah ibu. Anemia jika $<11.0\text{ g/dL}$. |
| 21 | **`STATUS_KETUBAN`** | Intrapartum | Kategori | `Utuh`, `Pecah` | Integritas selaput ketuban. |
| 22 | **`LAMA_KETUBAN_PECAH_JAM`** | Intrapartum | Numerik | Jam (0–120) | Durasi sejak ketuban pecah hingga pemeriksaan. |
| 23 | **`PEMBUKAAN_CM`** | Partograf | Numerik | cm (0–10) | Diameter pembukaan serviks aktif. |
| 24 | **`STATION_KEPALA`** | Partograf | Numerik | Hodge / Station (-3 s.d +3) | Penurunan bagian terendah janin. |
| 25 | **`KONTRAKSI_10MENIT`** | Partograf | Numerik | Kali/10 menit (0–10) | Frekuensi his dalam 10 menit. |
| 26 | **`DURASI_KONTRAKSI_DETIK`** | Partograf | Numerik | Detik (0–120) | Durasi rata-rata per kontraksi. |
| 27 | **`DJJ`** | Janin | Numerik | dpm (60–220) | Denyut Jantung Janin (Normal 120–160 dpm). |
| 28 | **`MAP`** | Calculated | Numerik | mmHg | Mean Arterial Pressure: $(\text{SBP} + 2 \times \text{DBP}) / 3$. |
| 29 | **`PP`** | Calculated | Numerik | mmHg | Pulse Pressure: $\text{SBP} - \text{DBP}$. |
| 30 | **`HB_ANEMIA`** | Calculated | Biner | `0` / `1` | Flag anemia ($1$ jika $\text{Hb} < 11.0$, else $0$). |

---

## 3. Target Output Diagnosis Komplikasi (7 Kelas Machine Learning v2)

Model XGBoost v2 menghasilkan distribusi probabilitas pada 7 diagnosis maternal:
1. **`Tanpa Komplikasi`**: Kondisi kehamilan/persalinan fisiologis dan normal (KRR - Risiko Rendah).
2. **`Hipertensi`**: Hipertensi kronik atau gestasional tanpa proteinuria berat.
3. **`Infeksi`**: Infeksi intrauterin, korioamnionitis, atau febris maternal.
4. **`Ketuban Pecah Dini (KPD)`**: Selaput ketuban pecah sebelum kemajuan persalinan adekuat.
5. **`Perdarahan`**: Perdarahan antepartum / postpartum (solusio plasenta, plasenta previa, atonia uteri).
6. **`Persalinan Lama`**: Distosia, inersia uteri, atau fase aktif partograf memanjang.
7. **`Preeklamsia`**: Preeklamsia ringan/berat dengan peningkatan tensi, proteinuria positif, dan risiko eklamsia.

---

## 4. Arsitektur Multi-Role & Hak Akses Pengguna

### A. Superadmin (Dosen Kebidanan / Peneliti Utama)
- **Akses**: Panel Master Data Admin (`/admin/...`).
- **Kelola Akun Bidan**: Tambah, edit, dan atur penugasan faskes/wilayah kerja Bidan.
- **Kelola Kamus Kesehatan**: Tambah, edit, dan hapus artikel istilah medis & katalog video terapi non-obat menggunakan Tiptap Rich Text Editor.
- **Analytics & Dataset**: Memantau statistik komplikasi wilayah dan histori dataset ML.

### B. Admin / Bidan (Tenaga Kesehatan Wilayah)
- **Akses**: Panel Monitoring Bidan, Form Expert System (`/screening/...`), dan Partograf Digital (`/partograf/...`).
- **Input Rekam Medis**: Mengisi form 30 variabel klinis & laboratorium pasien.
- **Eksekusi Prediksi ML**: Mengirim data ke microservice FastAPI dan menerima skor probabilitas 7 kelas risiko.
- **Monitoring Pasien**: Melihat riwayat skrining pasien di wilayah binaan, memfilter status KRR/KRT/KRST, dan mencatat rujukan intervensi.
- **Partograf Digital**: Mencatat observasi DJJ, pembukaan serviks, penurunan kepala, kontraksi, dan tanda vital secara interaktif.

### C. Pasien (Ibu Hamil / Pengguna Umum)
- **Akses**: Portal Mandiri (`/` & `/screening/kehamilan`).
- **Skrining Mandiri (DSS)**: Mengisi data dasar kehamilan untuk kalkulasi KSPR instan dan rekomendasi tindakan awal.
- **Kamus Kesehatan & Terapi**: Membaca artikel edukasi kebidanan dan menonton panduan video terapi komplementer mandiri.

---

## 5. Spesifikasi Kontrak API FastAPI Machine Learning (`ml_service/`)

- **Base URL**: `http://127.0.0.1:8000`
- **Model Files (v2 Active)**:
  - `ml_service/models_v2/xgboost_final_model.json` (Model XGBoost Booster 42 Fitur)
  - `ml_service/models_v2/label_encoder.pkl` (7 Kelas Komplikasi)
  - `ml_service/models_v2/feature_columns.pkl` (30 Nama Kolom Fitur)
  - `ml_service/models_v2/preprocessor.pkl` (ColumnTransformer)
- **Legacy Backup (v1)**:
  - `ml_service/models/xgboost_final_best.json` (Model 6 Kelas Legacy)
  - `ml_service/main_v1_backup.py`

### A. Endpoint Health Check
- **Endpoint**: `GET /health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "RASIH Maternal FastAPI ML Microservice",
  "model_loaded_v2": true,
  "classes_v2": [
    "Hipertensi",
    "Infeksi",
    "Ketuban Pecah Dini",
    "Perdarahan",
    "Persalinan Lama",
    "Preeklamsia",
    "Tanpa Komplikasi"
  ],
  "classes_count_v2": 7,
  "features_count_v2": 42,
  "version": "2.0.0"
}
```

### B. Endpoint Prediksi Komplikasi (Model v2)
- **Endpoint**: `POST /predict`
- **Request Headers**: `Content-Type: application/json`

#### Request Payload JSON:
```json
{
  "usia_tahun": 28,
  "pendidikan": "Menengah",
  "pekerjaan": "Ibu Rumah Tangga",
  "tinggi_badan_cm": 155.0,
  "bb_kg": 60.0,
  "gravida": 1,
  "para": 0,
  "abortus": 0,
  "uk_minggu": 38,
  "uk_hari": 0,
  "jumlah_janin": 1,
  "presentasi_janin": "Kepala",
  "efw_bayi_gram": 3000.0,
  "sbp_mmhg": 120,
  "dbp_mmhg": 80,
  "nadi_xmenit": 82.0,
  "suhu_c": 36.7,
  "proteinuria": "Negatif",
  "hemoglobin_gdl": 12.0,
  "status_ketuban": "Utuh",
  "lama_ketuban_pecah_jam": 0.0,
  "pembukaan_cm": 4.0,
  "station_kepala": -1.0,
  "kontraksi_10menit": 3.0,
  "durasi_kontraksi_detik": 35.0,
  "djj": 140.0
}
```

#### Response Payload JSON:
```json
{
  "status": "success",
  "version": "2.0.0",
  "primary_diagnosis": "Tanpa Komplikasi",
  "risk_category": "KRR",
  "confidence_score": 0.7979,
  "probabilities": {
    "Hipertensi": 0.0296,
    "Infeksi": 0.0001,
    "Ketuban Pecah Dini": 0.0001,
    "Perdarahan": 0.0024,
    "Persalinan Lama": 0.1695,
    "Preeklamsia": 0.0005,
    "Tanpa Komplikasi": 0.7979
  },
  "clinical_indicators": {
    "map": 93.3,
    "pulse_pressure": 40,
    "is_hypertension": false,
    "is_anemia": false,
    "is_preeclampsia_suspect": false
  },
  "recommendations": {
    "level": "Rendah",
    "faskes": "Bidan Praktik Mandiri (BPM) / Poskesdes / Puskesmas",
    "intervensi": "Kondisi kehamilan terpantau fisiologis dan sehat. Lanjutkan pemeriksaan antenatal rutin (ANC) teratur, nutrisi seimbang, serta konsumsi tablet tambah darah."
  }
}
```

---

## 6. Status Eksekusi Proyek Saat Ini

- [x] **Setup Modern UI/UX**: Laravel 12 + Inertia React 19 + Tailwind CSS + Lucide Icons + Shadcn UI.
- [x] **Branding RASIH Maternal**: Logo, nama brand, tagline, dan color styling diselaraskan.
- [x] **Kamus Publik & Side Drawer**: Non-modal side drawer standar Shadcn (`520px`) dengan spring physics animation.
- [x] **Admin Kamus & Tiptap Rich Text Editor**: Single large writing surface untuk penyusunan konten istilah medis lengkap.
- [x] **Partograf Digital Frontend**: Halaman interaktif Partograf aktif dengan curve plotting dan form input parameter.
- [x] **Integrasi Model ML v2 (7 Kelas & 30 Fitur)**: Model XGBoost v2 berhasil diintegrasikan ke FastAPI microservice (`ml_service/`) dan Controller Laravel dengan backup berkas v1 aman.
