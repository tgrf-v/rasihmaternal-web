# Aturan Penggunaan Skill & Filosofi Ponytail (Workspace BundaSehat)

Aturan ini mewajibkan AI untuk **sebisa mungkin selalu menerapkan skill dan pola pikir Ponytail** pada setiap tugas koding di workspace ini.

---

## 🪜 The Ponytail Ladder (Urutan Pengambilan Keputusan)

Sebelum menulis atau merekayasa kode baru, selalu lewati tangga evaluasi berikut dan berhenti di anak tangga pertama yang valid:

1. **YAGNI (You Aren't Gonna Need It)**:
   - Apakah fitur/abstraksi/kode ini benar-benar dibutuhkan sekarang? Jika bersifat spekulatif ("siapa tahu nanti butuh"), jangan dibuat.
2. **Reuse Existing Codebase**:
   - Selalu periksa utilitas, helper, tipe TypeScript, dan komponen UI yang sudah ada di codebase BundaSehat sebelum membuat yang baru. Gunakan kembali yang sudah ada.
3. **Platform & Stdlib Native First**:
   - Gunakan fitur native browser, HTML5, CSS, dan library standar framework (Laravel / React) sebelum mempertimbangkan paket/dependensi baru.
4. **Already Installed Dependencies**:
   - Manfaatkan dependensi yang sudah terpasang (Shadcn UI, Lucide icons, Tailwind, Inertia). Dilarang menambah library baru jika fitur bisa diselesaikan dengan dependensi yang ada.
5. **Minimal Working Diff**:
   - Tulis kode dengan perubahan sesingkat, sejelas, dan se-efisien mungkin. Hindari over-engineering, boilerplate yang tidak diperlukan, atau layer abstraksi berlebih (seperti interface tunggal, factory untuk 1 objek, dsb).

---

## 🛡️ Batasan Penting (Non-Negotiable Guardrails)

Prinsip Ponytail **DILARANG MENGORBANKAN**:
1. **Defensive Coding & Keamanan**: Input validation, error handling (try-catch), perhitungan skor medis (HPHT, MAP), dan pencegahan data loss tidak boleh dipangkas.
2. **No Truncated Code**: Kode yang dihasilkan wajib lengkap, tidak boleh dipotong dengan komentar seperti `// ... rest of code`.
3. **TypeScript Strictness**: Tipe data eksplisit tetap wajib, dilarang menggunakan `any` demi alasan mempersingkat kode.
4. **Design System BundaSehat**: Aturan desain (Shadcn UI, Tailwind, `rounded-full`, max `font-bold`, tanpa emoji unicode) tetap berlaku penuh.
