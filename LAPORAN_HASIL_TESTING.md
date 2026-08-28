# 📋 LAPORAN HASIL PENGUJIAN & DOKUMENTASI SISTEM RASIH MATERNAL

**Nama Sistem:** RASIH Maternal (Risk Assessment and Screening for Integrated Maternal Health)  
**Tanggal Pengujian:** 20 Agustus 2026  
**Target Server:** [https://app.novos.co.id/](https://app.novos.co.id/)  
**Status Keseluruhan:** ✅ **100% LULUS UJI (READY FOR PRODUCTION)**

---

## 👥 1. Kredensial Akun Pengujian (Demo Accounts)

| Peran (Role) | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Super Admin (Dosen Kebidanan)** | `superadmin@bundasehat.test` | `password` | Kelola Bidan, Kelola Kamus/Video Terapi, Manajemen Dataset & Full Access |
| **Bidan (Nakes Wilayah)** | `bidan@bundasehat.test` | `password` | Skrining Klinis (14 Variabel) + Prediksi ML XGBoost, Partograf Digital, Riwayat Pasien |
| **Pasien (Ibu Hamil)** | `ibuhamil@bundasehat.test` | `password` | Skrining Mandiri (6 Variabel non-medis), Kamus Kesehatan, Riwayat Pribadi |

---

## 📊 2. Ringkasan Hasil Pengujian Fitur

| No | Modul / Fitur | Status | Detail Hasil Pengujian |
| :---: | :--- | :---: | :--- |
| **1** | **Tampilan Desktop (1280x800)** | ✅ **LULUS** | Navbar, Banner Hero, Card Aksi Cepat, Dropdown Menu, dan Avatar Profil tersusun proporsional tanpa visual glitch. |
| **2** | **Tampilan Mobile (HP 375x812)** | ✅ **LULUS** | Bottom Navigation Bar (5 tombol) responsif. Panel Superadmin & menu Tentang Kami tampil rapi di halaman Profil. |
| **3** | **Otentikasi & Role Permission** | ✅ **LULUS** | Middleware `role:superadmin` aktif. Akses ilegal role non-admin ke `/admin/*` berhasil diblokir dengan kode 403 Forbidden. |
| **4** | **CRUD Kelola Bidan (`/admin/bidan`)** | ✅ **LULUS** | Penambahan akun bidan baru, pencarian nama/faskes, edit data, toggle aktif/nonaktif akun, dan hapus akun berfungsi 100%. |
| **5** | **CRUD Kelola Kamus (`/admin/kamus`)** | ✅ **LULUS** | Tambah istilah medis baru, integrasi embed video YouTube terapi komplementer, edit deskripsi, dan hapus istilah sukses. |
| **6** | **Skrining Mandiri Ibu Hamil (6 Input)** | ✅ **LULUS** | Form 2-langkah (Demografi & Kondisi), Datepicker HPHT kalkulasi usia kehamilan otomatis, dan analisis risiko KSPR instan. |
| **7** | **Halaman Hasil Skrining** | ✅ **LULUS** | Gauge KSPR Tri-Color (Rendah/Sedang/Tinggi), Rincian Poin, Rekomendasi Terapi Non-Obat, dan Tab Detail (MAP & HPL) akurat. |
| **8** | **Riwayat Skrining di Profil** | ✅ **LULUS** | Data skrining yang baru disubmit langsung tercatat real-time di tabel Riwayat Skrining akun pengguna. |

---

## 🚀 3. Arsitektur Infrastruktur Production

- **Web Server:** Nginx (Reverse Proxy & Static Asset Caching).
- **Backend Core:** PHP 8.3-FPM + Laravel 12 + Inertia.js (React 19 + TypeScript).
- **Microservice ML:** Python 3 (FastAPI + XGBoost ML Engine + Uvicorn) berjalan internal di container port `8000`.
- **Process Manager:** `supervisord` mengawasi Nginx, PHP-FPM, dan FastAPI secara paralel dalam 1 container Docker.
- **Database:** MySQL di Dokploy dengan koneksi jaringan internal terisolasi.
- **SSL / HTTPS:** Cloudflare Edge SSL + Dokploy Let's Encrypt auto-renewal.

---

## 📁 4. Berkas Rekaman Video & Screenshot Pengujian

Berkas rekaman pengetesan otomatis tersimpan di folder artefak sistem:
- `test_point1_responsivitas_1787188759826.webp` (Video rekaman navigasi Desktop & Mobile)
- `screening_ml_test_1787048867861.webp` (Video rekaman kalkulasi Machine Learning)
