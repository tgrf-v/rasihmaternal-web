import { test, expect } from '@playwright/test';

async function loginAsIbuHamil(page: any) {
  await page.goto('/login');
  await expect(page.locator('#email_input')).toBeVisible({ timeout: 10000 });
  await page.fill('#email_input', 'ibuhamil@rasihmaternal.test');
  await page.fill('#password_input', 'password');
  await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
}

test.describe('Suite 2: Pengujian Komprehensif Screening (8 Kondisi Klinis Utama)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsIbuHamil(page);
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 1: Primigravida Normal Fisiologis (KRR / Skor 2)
  // ─────────────────────────────────────────────────────────────
  test('Kondisi 01: Kehamilan Fisiologis Normal (KRR Skor 2)', async ({ page }) => {
    await page.goto('/screening/kehamilan');
    await page.fill('#nama_pasien', 'Ny. Aisyah Normal');
    await page.fill('#kehamilan_ke', '1');
    await page.fill('#umur', '25');

    // HPHT
    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    await page.click('label[for="menikah-cepat"]');
    await page.fill('#jumlah_anak_hidup', '0');
    await page.fill('#tinggi_badan', '160');
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-no"]');
    await page.click('button:has-text("Lanjut")');

    // Step 2
    await page.click('label[for="bengkak_darah_tinggi-no"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjut")');

    // Step 3
    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-no"]');
    await page.click('button:has-text("Lihat Hasil Analisis")');

    // Verifikasi
    await expect(page.locator('text=Level risiko Ibu Hamil')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Risiko Rendah / Ringan').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 2: Primigravida Usia Muda <16 Tahun (KRT Skor 6)
  // ─────────────────────────────────────────────────────────────
  test('Kondisi 02: Primigravida Usia Muda <16 Tahun (KRT Skor 6)', async ({ page }) => {
    await page.goto('/screening/kehamilan');
    await page.fill('#nama_pasien', 'Ny. Bella (15 th)');
    await page.fill('#kehamilan_ke', '1');
    await page.fill('#umur', '15');

    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    await page.click('label[for="menikah-cepat"]');
    await page.fill('#jumlah_anak_hidup', '0');
    await page.fill('#tinggi_badan', '152');
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-no"]');
    await page.click('button:has-text("Lanjut")');

    await page.click('label[for="bengkak_darah_tinggi-no"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjut")');

    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-no"]');
    await page.click('button:has-text("Lihat Hasil Analisis")');

    await expect(page.locator('text=Level risiko Ibu Hamil')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Risiko Tinggi').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 3: Primigravida Usia Tua >=35 Tahun (KRT Skor 6)
  // ─────────────────────────────────────────────────────────────
  test('Kondisi 03: Primigravida Usia Tua >=35 Tahun (KRT Skor 6)', async ({ page }) => {
    await page.goto('/screening/kehamilan');
    await page.fill('#nama_pasien', 'Ny. Citra (37 th)');
    await page.fill('#kehamilan_ke', '1');
    await page.fill('#umur', '37');

    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    await page.click('label[for="menikah-cepat"]');
    await page.fill('#jumlah_anak_hidup', '0');
    await page.fill('#tinggi_badan', '155');
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-no"]');
    await page.click('button:has-text("Lanjut")');

    await page.click('label[for="bengkak_darah_tinggi-no"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjut")');

    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-no"]');
    await page.click('button:has-text("Lihat Hasil Analisis")');

    await expect(page.locator('text=Level risiko Ibu Hamil')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Risiko Tinggi').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 4: Riwayat Bekas Operasi Sesar (KRT Skor 10)
  // ─────────────────────────────────────────────────────────────
  test('Kondisi 04: Riwayat Operasi Sesar Sebelumnya (KRT Skor 10)', async ({ page }) => {
    await page.goto('/screening/kehamilan');
    await page.fill('#nama_pasien', 'Ny. Dewi (Riwayat SC)');
    await page.fill('#kehamilan_ke', '2');
    await page.fill('#umur', '29');

    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    await page.click('label[for="jarak-normal"]');
    await page.fill('#jumlah_anak_hidup', '1');
    await page.fill('#tinggi_badan', '158');
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-yes"]'); // SC = YA
    await page.click('button:has-text("Lanjut")');

    await page.click('label[for="bengkak_darah_tinggi-no"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjut")');

    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-no"]');
    await page.click('button:has-text("Lihat Hasil Analisis")');

    await expect(page.locator('text=Level risiko Ibu Hamil')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Risiko Tinggi').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 5: Preeklamsia Berat / GDOB (KRST Skor >= 12)
  // ─────────────────────────────────────────────────────────────
  test('Kondisi 05: Gawat Darurat Preeklamsia Berat (KRST Skor >=12)', async ({ page }) => {
    await page.goto('/screening/kehamilan');
    await page.fill('#nama_pasien', 'Ny. Endah (PEB)');
    await page.fill('#kehamilan_ke', '1');
    await page.fill('#umur', '30');

    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    await page.click('label[for="menikah-cepat"]');
    await page.fill('#jumlah_anak_hidup', '0');
    await page.fill('#tinggi_badan', '155');
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-no"]');
    await page.click('button:has-text("Lanjut")');

    await page.click('label[for="bengkak_darah_tinggi-yes"]'); // Bengkak Ya
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjut")');

    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-yes"]'); // PEB Ya
    await page.click('button:has-text("Lihat Hasil Analisis")');

    await expect(page.locator('text=Level risiko Ibu Hamil')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Risiko Sangat Tinggi').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 6: Screening Persalinan Normal (KRR)
  // ─────────────────────────────────────────────────────────────
  test('Kondisi 06: Persalinan Fisiologis Normal (KRR)', async ({ page }) => {
    await page.goto('/screening/persalinan');
    await page.fill('#nama_pasien', 'Ny. Fitri (Inpartu Normal)');
    await page.fill('#umur', '27');
    await page.click('button:has-text("Lanjut")');

    await page.click('button:has-text("Lanjut")');

    await page.fill('#sistolik', '118');
    await page.fill('#diastolik', '76');
    await page.fill('#hb', '12.0');
    await page.fill('#leokosit', '8500');
    await page.fill('#trombosit', '240000');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    await expect(page.locator('h2:has-text("Persalinan Fisiologis (Normal)")')).toBeVisible({ timeout: 15000 });
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 7: Persalinan dengan Preeklamsia Berat (KRST)
  // ─────────────────────────────────────────────────────────────
  test('Kondisi 07: Persalinan dengan Hipertensi Berat (KRST)', async ({ page }) => {
    await page.goto('/screening/persalinan');
    await page.fill('#nama_pasien', 'Ny. Hani (PEB Inpartu)');
    await page.fill('#umur', '35');
    await page.click('button:has-text("Lanjut")');

    await page.click('button:has-text("Lanjut")');

    await page.fill('#sistolik', '170');
    await page.fill('#diastolik', '115');
    await page.fill('#hb', '10.2');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    await expect(page.locator('text=Tinggi, text=Berat, text=KRST, h2').first()).toBeVisible({ timeout: 15000 });
  });

});
