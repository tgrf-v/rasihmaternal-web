import { test, expect } from '@playwright/test';

async function loginAsIbuHamil(page: any) {
  await page.goto('/login');
  await expect(page.locator('#email_input')).toBeVisible({ timeout: 10000 });
  await page.fill('#email_input', 'ibuhamil@bundasehat.test');
  await page.fill('#password_input', 'password');
  await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
}

test.describe('Form Screening Persalinan & Prediksi Machine Learning (5 Skenario Klinis)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsIbuHamil(page);
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 1: Persalinan Fisiologis / Normal (KRR)
  // ─────────────────────────────────────────────────────────────
  test('Skenario 1: Pasien Normal / Fisiologis (Risiko Rendah / KRR)', async ({ page }) => {
    await page.goto('/screening/persalinan');
    await expect(page.locator('h1:has-text("Penapisan Ibu Bersalin")')).toBeVisible();

    // STEP 1: Identitas Pasien
    await page.fill('#nama_pasien', 'Ibu Rahma Rahayu');
    await page.fill('#umur', '26');
    await page.click('button:has-text("Lanjut")');

    // STEP 2: 19 Indikator Penapisan (Semua default TIDAK)
    await expect(page.locator('text=Langkah 2: 19 Indikator')).toBeVisible();
    await page.click('button:has-text("Lanjut")');

    // STEP 3: Parameter Klinis & Prediksi ML (Nilai Normal)
    await expect(page.locator('#sistolik')).toBeVisible();
    await page.fill('#sistolik', '115');
    await page.fill('#diastolik', '75');
    await page.fill('#hb', '12.5');
    await page.fill('#leokosit', '8000');
    await page.fill('#trombosit', '260000');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    // VERIFIKASI HASIL: Normal & KRR
    await expect(page.locator('h2:has-text("Persalinan Fisiologis (Normal)")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=KRR').first()).toBeVisible();
    await expect(page.locator('text=0 dari 19 Parameter')).toBeVisible();
    await expect(page.locator('p:has-text("Normal (Fisiologis)")').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 2: Komplikasi Preeklamsia Berat (KRST)
  // ─────────────────────────────────────────────────────────────
  test('Skenario 2: Komplikasi Preeklamsia Berat / Hipertensi Urgensi (KRST)', async ({ page }) => {
    await page.goto('/screening/persalinan');

    // STEP 1
    await page.fill('#nama_pasien', 'Ny. Fitri Handayani');
    await page.fill('#umur', '34');
    await page.click('button:has-text("Lanjut")');

    // STEP 2: Toggle Ya pada Preklamsi berat (#penapisan_ya_preeklamsi_berat)
    await expect(page.locator('text=Langkah 2: 19 Indikator')).toBeVisible();
    await page.click('#penapisan_ya_preeklamsi_berat');
    await page.click('button:has-text("Lanjut")');

    // STEP 3: Parameter Klinis (Tensi Tinggi: 165/110 mmHg)
    await expect(page.locator('#sistolik')).toBeVisible();
    await page.fill('#sistolik', '165');
    await page.fill('#diastolik', '110');
    await page.fill('#hb', '12.0');
    await page.fill('#leokosit', '9500');
    await page.fill('#trombosit', '170000');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    // VERIFIKASI HASIL: Komplikasi Gawat Darurat + Prediksi ML Preeklamsia (KRST)
    await expect(page.locator('h2:has-text("Komplikasi Gawat Darurat")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=KRST').first()).toBeVisible();
    await expect(page.locator('p:has-text("Preeklamsia")').first()).toBeVisible();
    await expect(page.locator('text=Wajib Rujuk').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 3: Komplikasi Perdarahan Pervaginam (KRST)
  // ─────────────────────────────────────────────────────────────
  test('Skenario 3: Komplikasi Perdarahan Pervaginam & Anemia Berat (KRST)', async ({ page }) => {
    await page.goto('/screening/persalinan');

    // STEP 1
    await page.fill('#nama_pasien', 'Ny. Dewi Sartika');
    await page.fill('#umur', '29');
    await page.click('button:has-text("Lanjut")');

    // STEP 2: Toggle Ya pada Perdarahan Pervaginam (#penapisan_ya_perdarahan_pervaginam)
    await expect(page.locator('text=Langkah 2: 19 Indikator')).toBeVisible();
    await page.click('#penapisan_ya_perdarahan_pervaginam');
    await page.click('button:has-text("Lanjut")');

    // STEP 3: Parameter Klinis (Hb rendah: 7.2 g/dL)
    await expect(page.locator('#sistolik')).toBeVisible();
    await page.fill('#sistolik', '100');
    await page.fill('#diastolik', '65');
    await page.fill('#hb', '7.2');
    await page.fill('#leokosit', '10500');
    await page.fill('#trombosit', '155000');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    // VERIFIKASI HASIL: Komplikasi Gawat Darurat + Prediksi ML Perdarahan (KRST)
    await expect(page.locator('h2:has-text("Komplikasi Gawat Darurat")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=KRST').first()).toBeVisible();
    await expect(page.locator('p:has-text("Perdarahan")').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 4: Komplikasi Ketuban Pecah Dini (KRT / KRST)
  // ─────────────────────────────────────────────────────────────
  test('Skenario 4: Komplikasi Ketuban Pecah Dini (KPD / Mekonium) (KRT/KRST)', async ({ page }) => {
    await page.goto('/screening/persalinan');

    // STEP 1
    await page.fill('#nama_pasien', 'Ny. Anisa Lestari');
    await page.fill('#umur', '24');
    await page.click('button:has-text("Lanjut")');

    // STEP 2: Toggle Ya pada Ketuban pecah dengan mekonium kental (#penapisan_ya_ketuban_pecah_mekonium)
    await expect(page.locator('text=Langkah 2: 19 Indikator')).toBeVisible();
    await page.click('#penapisan_ya_ketuban_pecah_mekonium');
    await page.click('button:has-text("Lanjut")');

    // STEP 3: Parameter Klinis
    await expect(page.locator('#sistolik')).toBeVisible();
    await page.fill('#sistolik', '120');
    await page.fill('#diastolik', '80');
    await page.fill('#hb', '11.8');
    await page.fill('#leokosit', '11500');
    await page.fill('#trombosit', '230000');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    // VERIFIKASI HASIL: Komplikasi Gawat Darurat + Prediksi ML Ketuban Pecah Dini
    await expect(page.locator('h2:has-text("Komplikasi Gawat Darurat")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('p:has-text("Ketuban Pecah Dini")').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // SKENARIO 5: Komplikasi Infeksi Maternal & Detail Analisis ML
  // ─────────────────────────────────────────────────────────────
  test('Skenario 5: Komplikasi Infeksi Maternal, Detail Rincian Klinis & Variabel Turunan ML', async ({ page }) => {
    await page.goto('/screening/persalinan');

    // STEP 1
    await page.fill('#nama_pasien', 'Ny. Megawati');
    await page.fill('#umur', '27');
    await page.click('button:has-text("Lanjut")');

    // STEP 2: Toggle Ya pada Demam (> 38 °C) (#penapisan_ya_demam_tinggi)
    await expect(page.locator('text=Langkah 2: 19 Indikator')).toBeVisible();
    await page.click('#penapisan_ya_demam_tinggi');
    await page.click('button:has-text("Lanjut")');

    // STEP 3: Parameter Klinis (Leukosit tinggi: 18500 /uL)
    await expect(page.locator('#sistolik')).toBeVisible();
    await page.fill('#sistolik', '120');
    await page.fill('#diastolik', '80');
    await page.fill('#hb', '11.0');
    await page.fill('#leokosit', '18500');
    await page.fill('#trombosit', '240000');
    await page.click('button:has-text("Selesai & Lihat Hasil")');

    // VERIFIKASI HASIL: Komplikasi Gawat Darurat + Prediksi ML Infeksi (KRT)
    await expect(page.locator('h2:has-text("Komplikasi Gawat Darurat")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('p:has-text("Infeksi")').first()).toBeVisible();
    await expect(page.locator('text=KRT').first()).toBeVisible();

    // Cek tombol rincian detail ML
    await page.click('button:has-text("Lihat Rincian & Analisis ML")');

    // VERIFIKASI DETAIL: Variabel Terhitung Otomatis
    await expect(page.locator('text=Variabel Klinis Hasil Kalkulasi Otomatis')).toBeVisible();
    await expect(page.locator('text=MAP (Mean Arterial Pressure)')).toBeVisible();
    await expect(page.locator('text=93.33')).toBeVisible();
    await expect(page.locator('text=Pulse Pressure (Tekanan Nadi)')).toBeVisible();
    await expect(page.locator('text=40 mmHg')).toBeVisible();
    await expect(page.locator('text=Rasio Leu / Trombo (LTR)')).toBeVisible();
    await expect(page.locator('text=0.0771')).toBeVisible();

    // VERIFIKASI DETAIL: Isian Parameter Form Persalinan
    await expect(page.locator('text=Isian Parameter Form Persalinan & Fitur Maternal ML')).toBeVisible();
    await expect(page.locator('text=120 / 80 mmHg')).toBeVisible();
    await expect(page.locator('text=11 g/dL')).toBeVisible();
    await expect(page.locator('text=18,500 /µL').or(page.locator('text=18.500 /µL'))).toBeVisible();

    // VERIFIKASI DETAIL: Probabilitas ML
    await expect(page.locator('text=Probabilitas Prediksi Komplikasi (Machine Learning)')).toBeVisible();
    await expect(page.locator('span:has-text("Infeksi (Prediksi Utama)")')).toBeVisible();
  });

});
