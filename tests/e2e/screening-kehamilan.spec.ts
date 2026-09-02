import { test, expect } from '@playwright/test';

// Helper function untuk login sebagai ibu hamil
async function loginAsIbuHamil(page: any) {
  await page.goto('/login');
  
  // Tunggu form login muncul
  await expect(page.locator('#email_input')).toBeVisible();
  
  await page.fill('#email_input', 'ibuhamil@rasihmaternal.test');
  await page.fill('#password_input', 'password');
  await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
  
  // Tunggu redirect selesai
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
}

test.describe('Form Screening Kehamilan (Poedji Rochjati)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsIbuHamil(page);
  });

  test('Skenario 1: Pengisian Form Screening Kehamilan Normal / Risiko Rendah (KRR)', async ({ page }) => {
    await page.goto('/screening/kehamilan');
    await expect(page).toHaveURL(/.*\/screening\/kehamilan/);

    // ── LANGKAH 1: Identitas & Riwayat Kehamilan ──
    await expect(page.locator('text=Langkah 1: Identitas & Riwayat Kehamilan')).toBeVisible();

    // 1. Data Diri & Kehamilan ke-1
    await page.fill('#nama_pasien', 'Siti Rahmawati');
    await page.fill('#kehamilan_ke', '1');
    await page.fill('#umur', '25');

    // 2. Pilih HPHT via DatePicker
    await page.click('#hpht');
    const firstActiveDay = page.locator('div[class*="grid-cols-7"] button:not([disabled])').first();
    if (await firstActiveDay.isVisible()) {
      await firstActiveDay.click();
    } else {
      await page.locator('text="15"').first().click();
    }

    // 3. Verifikasi Logika Percabangan Hamil Pertama:
    // Opsi lama menikah harus muncul, opsi jarak kehamilan harus tersembunyi
    await expect(page.locator('#menikah-cepat')).toBeVisible();
    await expect(page.locator('#jarak-cepat')).not.toBeVisible();
    await page.click('label[for="menikah-cepat"]');

    // 4. Jumlah anak hidup & Tinggi Badan
    await page.fill('#jumlah_anak_hidup', '0');
    await page.fill('#tinggi_badan', '160');

    // 5. Riwayat Keguguran & SC (Tidak)
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-no"]');

    // Klik tombol Lanjut ke Langkah 2
    await page.click('button:has-text("Lanjut")');

    // ── LANGKAH 2: Kondisi Saat Ini (Kelompok II - AGO) ──
    await expect(page.locator('text=Langkah 2: Kondisi Kehamilan Saat Ini')).toBeVisible();

    // Biarkan penyakit tidak dicentang, semua kondisi diisi "Tidak"
    await page.click('label[for="bengkak_darah_tinggi-no"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');

    // Klik tombol Lanjut ke Langkah 3
    await page.click('button:has-text("Lanjut")');

    // ── LANGKAH 3: Kondisi Gawat Darurat (Kelompok III - GDOB) ──
    await expect(page.locator('text=Langkah 3: Kondisi Gawat / Darurat')).toBeVisible();

    // Semua kondisi gawat darurat "Tidak"
    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-no"]');

    // Submit form
    await page.click('button:has-text("Lihat Hasil Analisis")');

    // ── VALIDASI HASIL SCREENING ──
    // Tunggu hasil evaluasi risiko muncul
    await expect(page.locator('text=Level risiko Ibu Hamil')).toBeVisible({ timeout: 15000 });
    
    // Validasi badge / kategori KRR (Risiko Rendah / Ringan)
    await expect(page.locator('text=Risiko Rendah / Ringan').first()).toBeVisible();

    // Validasi Teks Rekomendasi Faskes
    await expect(page.locator('text=Bidan Praktik Mandiri (BPM)').first()).toBeVisible();

    // Validasi Skor KSPR Awal = 2 Poin
    await expect(page.locator('text=Skor KSPR:').first()).toBeVisible();

    // Validasi tombol Cek Ulang tersedia
    await expect(page.locator('text=Cek Ulang')).toBeVisible();
  });

  test('Skenario 2: Screening Risiko Sangat Tinggi (KRST) dengan Logika Percabangan & Akumulasi Skor', async ({ page }) => {
    await page.goto('/screening/kehamilan');

    // ── LANGKAH 1: Hamil ke-3 (bukan pertama), Usia >35, Ada Riwayat SC ──
    await page.fill('#nama_pasien', 'Ibu Dewi Lestari');
    await page.fill('#kehamilan_ke', '3');
    await page.fill('#umur', '37');

    // Pilih HPHT
    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    // Verifikasi percabangan: Hamil ke-3 -> Jarak kehamilan muncul, lama menikah tidak muncul
    await expect(page.locator('#jarak-cepat')).toBeVisible();
    await expect(page.locator('#menikah-cepat')).not.toBeVisible();
    await page.click('label[for="jarak-cepat"]');

    // Tinggi badan <= 145 cm (Risiko CPD)
    await page.fill('#jumlah_anak_hidup', '2');
    await page.fill('#tinggi_badan', '142');

    // Riwayat keguguran: Ya
    await page.click('label[for="keguguran-yes"]');

    // Riwayat persalinan bermasalah: Pilih tang/vakum
    await page.check('#bermasalah-tang_vakum');

    // Riwayat SC: Ya
    await page.click('label[for="sc-yes"]');

    await page.click('button:has-text("Lanjut")');

    // ── LANGKAH 2: Pilih Penyakit Anemia & Bengkak Darah Tinggi ──
    await expect(page.locator('text=Langkah 2: Kondisi Kehamilan Saat Ini')).toBeVisible();
    
    // Multi-select penyakit: Anemia
    await page.check('#penyakit-anemia');
    
    // Bengkak darah tinggi: Ya
    await page.click('label[for="bengkak_darah_tinggi-yes"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');

    await page.click('button:has-text("Lanjut")');

    // ── LANGKAH 3: Letak Sungsang & Preeklampsia Berat ──
    await expect(page.locator('text=Langkah 3: Kondisi Gawat / Darurat')).toBeVisible();

    await page.click('label[for="letak_sungsang-yes"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-yes"]');

    // Submit
    await page.click('button:has-text("Lihat Hasil Analisis")');

    // ── VALIDASI HASIL KRST (Risiko Sangat Tinggi) ──
    await expect(page.locator('text=Level risiko Ibu Hamil')).toBeVisible({ timeout: 15000 });
    
    // Harus terdeteksi Risiko Sangat Tinggi / Berat
    await expect(page.locator('text=Risiko Sangat Tinggi / Berat').first()).toBeVisible();
    
    // Rekomendasi Rumah Sakit (RS / SpOG)
    await expect(page.locator('text=Dianjurkan bersalin di Rumah Sakit').first()).toBeVisible();

    // Verifikasi fitur Lihat Perhitungan Detail
    await page.click('text=Lihat Perhitungan');
    await expect(page.locator('text=Kembali ke Hasil Ringkas')).toBeVisible();
  });

  test('Skenario 3: Validasi Field Wajib pada Langkah 1', async ({ page }) => {
    await page.goto('/screening/kehamilan');

    // Kosongkan nama pasien
    await page.fill('#nama_pasien', '');

    // Coba langsung klik Lanjut
    await page.click('button:has-text("Lanjut")');

    // Harus muncul pesan error validasi
    await expect(page.locator('text=Nama pasien wajib diisi').first()).toBeVisible();
    
    // Tetap di Langkah 1
    await expect(page.locator('text=Langkah 1: Identitas & Riwayat Kehamilan')).toBeVisible();
  });

});
