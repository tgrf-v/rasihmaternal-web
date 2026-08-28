import { test, expect } from '@playwright/test';

async function loginAsIbuHamil(page: any) {
  await page.goto('/login');
  await expect(page.locator('#email_input')).toBeVisible({ timeout: 10000 });
  await page.fill('#email_input', 'ibuhamil@bundasehat.test');
  await page.fill('#password_input', 'password');
  await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
}

async function loginAsBidan(page: any) {
  await page.goto('/login');
  await expect(page.locator('#email_input')).toBeVisible({ timeout: 10000 });
  await page.fill('#email_input', 'bidan@bundasehat.test');
  await page.fill('#password_input', 'password');
  await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
}

test.describe('RASIH Maternal - Real E2E Playwright Test Suite', () => {

  // ═══════════════════════════════════════════════════════════════
  // 1. FITUR UMUM & HALAMAN UTAMA
  // ═══════════════════════════════════════════════════════════════
  test('01. Landing Page: Render & Navigasi CTA Masuk', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=RASIH Maternal').first()).toBeVisible();
    const loginLink = page.locator('a[href="/login"], a:has-text("Masuk"), button:has-text("Masuk")').first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('02. Autentikasi: Validasi Form Login Kosong & Login Sukses', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await expect(page).toHaveURL(/.*\/login/);

    await page.fill('#email_input', 'ibuhamil@bundasehat.test');
    await page.fill('#password_input', 'password');
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
    await expect(page.locator('text=RASIH Maternal').first()).toBeVisible();
  });

  test('03. Kamus Kesehatan: Navigasi & Tab Video Edukasi', async ({ page }) => {
    await loginAsIbuHamil(page);
    await page.goto('/kamus');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    const videoTab = page.locator('button:has-text("Video"), [role="tab"]:has-text("Video")').first();
    if (await videoTab.isVisible()) {
      await videoTab.click();
    }
  });

  test('04. Profil Pasien: Tampilan Data Diri & Dialog Edit Profil', async ({ page }) => {
    await loginAsIbuHamil(page);
    await page.goto('/profil');
    await expect(page).toHaveURL(/.*\/profil/);
    const profileBtn = page.locator('button:has-text("Ibu Rahma Rahayu")').first();
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();
    await expect(page.locator('#profile-education')).toBeVisible();
  });

  // ═══════════════════════════════════════════════════════════════
  // 2. FITUR UTAMA SCREENING KEHAMILAN (4 KONDISI KLINIS)
  // ═══════════════════════════════════════════════════════════════
  test('05. Screening Kehamilan - Kondisi 1: Primigravida Normal (KRR Skor 2)', async ({ page }) => {
    await loginAsIbuHamil(page);
    await page.goto('/screening/kehamilan');

    const newBtn = page.locator('button:has-text("Screening Baru"), button:has-text("Mulai")').first();
    if (await newBtn.isVisible()) await newBtn.click();

    await page.fill('#nama_pasien', 'Ny. Aisyah Normal');
    await page.fill('#kehamilan_ke', '1');
    await page.fill('#umur', '25');

    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    await page.click('label[for="menikah-cepat"]');
    await page.fill('#jumlah_anak_hidup', '0');
    await page.fill('#tinggi_badan', '160');
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-no"]');
    await page.click('button:has-text("Lanjutkan")');

    await page.click('label[for="bengkak_darah_tinggi-no"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjutkan")');

    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-no"]');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    await expect(page.locator('text=Risiko Rendah / Ringan').first()).toBeVisible({ timeout: 15000 });
  });

  test('06. Screening Kehamilan - Kondisi 2: Primigravida Usia Muda <16 Tahun (KRT Skor 6)', async ({ page }) => {
    await loginAsIbuHamil(page);
    await page.goto('/screening/kehamilan');

    const newBtn = page.locator('button:has-text("Screening Baru"), button:has-text("Mulai")').first();
    if (await newBtn.isVisible()) await newBtn.click();

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
    await page.click('button:has-text("Lanjutkan")');

    await page.click('label[for="bengkak_darah_tinggi-no"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjutkan")');

    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-no"]');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    await expect(page.locator('text=Risiko Tinggi / Sedang').first()).toBeVisible({ timeout: 15000 });
  });

  test('07. Screening Kehamilan - Kondisi 3: Riwayat Bekas Operasi Sesar (KRT Skor 10)', async ({ page }) => {
    await loginAsIbuHamil(page);
    await page.goto('/screening/kehamilan');

    const newBtn = page.locator('button:has-text("Screening Baru"), button:has-text("Mulai")').first();
    if (await newBtn.isVisible()) await newBtn.click();

    await page.fill('#nama_pasien', 'Ny. Dewi (Bekas SC)');
    await page.fill('#kehamilan_ke', '2');
    await page.fill('#umur', '29');

    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    await page.click('label[for="jarak-normal"]');
    await page.fill('#jumlah_anak_hidup', '1');
    await page.fill('#tinggi_badan', '158');
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-yes"]'); // SC = YA (Skor 10)
    await page.click('button:has-text("Lanjutkan")');

    await page.click('label[for="bengkak_darah_tinggi-no"]');
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjutkan")');

    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-no"]');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    await expect(page.locator('text=Risiko Tinggi / Sedang').first()).toBeVisible({ timeout: 15000 });
  });

  test('08. Screening Kehamilan - Kondisi 4: Preeklamsia Berat / Eklamsia (KRST Skor >= 12)', async ({ page }) => {
    await loginAsIbuHamil(page);
    await page.goto('/screening/kehamilan');

    const newBtn = page.locator('button:has-text("Screening Baru"), button:has-text("Mulai")').first();
    if (await newBtn.isVisible()) await newBtn.click();

    await page.fill('#nama_pasien', 'Ny. Endah (PEB Berat)');
    await page.fill('#kehamilan_ke', '1');
    await page.fill('#umur', '30');

    await page.click('#hpht');
    await page.locator('div[class*="grid-cols-7"] button:not([disabled])').first().click();

    await page.click('label[for="menikah-cepat"]');
    await page.fill('#jumlah_anak_hidup', '0');
    await page.fill('#tinggi_badan', '155');
    await page.click('label[for="keguguran-no"]');
    await page.click('label[for="sc-no"]');
    await page.click('button:has-text("Lanjutkan")');

    await page.click('label[for="bengkak_darah_tinggi-yes"]'); // Bengkak Ya
    await page.click('label[for="hamil_kembar-no"]');
    await page.click('label[for="hydramnion-no"]');
    await page.click('label[for="riwayat_bayi_mati-no"]');
    await page.click('label[for="serotinus-no"]');
    await page.click('button:has-text("Lanjutkan")');

    await page.click('label[for="letak_sungsang-no"]');
    await page.click('label[for="letak_lintang-no"]');
    await page.click('label[for="pendarahan_kehamilan-no"]');
    await page.click('label[for="preeklampsia_berat-yes"]'); // PEB Ya
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    await expect(page.locator('text=Risiko Sangat Tinggi / Berat').first()).toBeVisible({ timeout: 15000 });
  });

  // ═══════════════════════════════════════════════════════════════
  // 3. FITUR UTAMA SCREENING PERSALINAN (2 KONDISI KLINIS)
  // ═══════════════════════════════════════════════════════════════
  test('09. Screening Persalinan - Kondisi 5: Persalinan Fisiologis Normal (KRR)', async ({ page }) => {
    await loginAsIbuHamil(page);
    await page.goto('/screening/persalinan');

    await page.fill('#nama_pasien', 'Ny. Fitri Normal');
    await page.fill('#umur', '26');
    await page.click('button:has-text("Lanjut")');

    // Step 2: 19 Indikator
    await expect(page.locator('text=Indikator Penapisan Gawat Darurat')).toBeVisible();
    await page.click('button:has-text("Lanjut")');

    // Step 3: Parameter Klinis
    await page.fill('#sistolik', '115');
    await page.fill('#diastolik', '75');
    await page.fill('#hb', '12.5');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    await expect(page.locator('h2:has-text("Persalinan Fisiologis (Normal)")')).toBeVisible({ timeout: 15000 });
  });

  test('10. Screening Persalinan - Kondisi 6: Preeklamsia Berat dalam Persalinan (KRST)', async ({ page }) => {
    await loginAsIbuHamil(page);
    await page.goto('/screening/persalinan');

    await page.fill('#nama_pasien', 'Ny. Hani (PEB)');
    await page.fill('#umur', '34');
    await page.click('button:has-text("Lanjut")');

    await expect(page.locator('text=Indikator Penapisan Gawat Darurat')).toBeVisible();
    await page.click('#penapisan_ya_preeklamsi_berat');
    await page.click('button:has-text("Lanjut")');

    await page.fill('#sistolik', '165');
    await page.fill('#diastolik', '110');
    await page.fill('#hb', '12.0');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    await expect(page.locator('h2:has-text("Komplikasi Gawat Darurat")')).toBeVisible({ timeout: 15000 });
  });

  // ═══════════════════════════════════════════════════════════════
  // 4. FITUR UTAMA PARTOGRAF DIGITAL WHO
  // ═══════════════════════════════════════════════════════════════
  test('11. Partograf Digital: Akses Lembar, Toggle View Mode & Dialog Observasi', async ({ page }) => {
    await loginAsBidan(page);
    await page.goto('/partograf');
    await expect(page.locator('h1:has-text("Partograf Digital")')).toBeVisible({ timeout: 10000 });

    const sessionCard = page.locator('a[href*="/partograf/"]').first();
    await expect(sessionCard).toBeVisible({ timeout: 10000 });
    await sessionCard.click();
    await page.waitForURL(/.*\/partograf\/\d+/, { timeout: 15000 });

    const addEntryBtn = page.locator('button:has-text("Tambah Observasi")').first();
    await expect(addEntryBtn).toBeVisible();

    // Toggle Tabel Data <-> Grafik
    const tabelToggle = page.locator('button:has-text("Tabel"), button:has-text("Tabel Data")').first();
    if (await tabelToggle.isVisible()) {
      await tabelToggle.click();
      await page.waitForTimeout(500);

      const grafikToggle = page.locator('button:has-text("Grafik"), button:has-text("Grafik Partograf")').first();
      if (await grafikToggle.isVisible()) {
        await grafikToggle.click();
        await page.waitForTimeout(500);
      }
    }

    await addEntryBtn.click();
    await expect(page.locator('text=Observasi').first()).toBeVisible({ timeout: 5000 });
  });

});
