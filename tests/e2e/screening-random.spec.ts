import { test, expect } from '@playwright/test';

// Helper function login
async function loginAsIbuHamil(page: any) {
  await page.goto('/login');
  await expect(page.locator('#email_input')).toBeVisible();
  await page.fill('#email_input', 'ibuhamil@rasihmaternal.test');
  await page.fill('#password_input', 'password');
  await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
}

test('Playwright Random Pregnancy Screening Test', async ({ page }) => {
  await loginAsIbuHamil(page);
  await page.goto('/screening/kehamilan');
  await expect(page.locator('text=Langkah 1: Identitas & Riwayat Kehamilan')).toBeVisible();

  // Helper random
  const randBool = () => Math.random() < 0.5;
  const randPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Generate Random Input Data
  const nama = 'Ibu Rahayu Testing';
  const kehamilanKe = randPick([1, 2, 3, 4, 5]);
  const isHamilPertama = kehamilanKe === 1;
  const umur = randPick([16, 24, 30, 36, 40]);
  const lamaMenikah = isHamilPertama ? randPick(['<4', '>=4']) : undefined;
  const jarakKehamilan = !isHamilPertama ? randPick(['<2', '2-10', '>10']) : undefined;
  const jumlahAnakHidup = isHamilPertama ? 0 : randPick([0, 1, 2, 4, 5]);
  const tinggiBadan = randPick([140, 144, 150, 158, 165]);
  const riwayatKeguguran = randBool();
  
  // Riwayat persalinan bermasalah
  const pilihanBermasalah = ['tang_vakum', 'plasenta_manual', 'infus_transfusi'];
  const riwayatBermasalah = !isHamilPertama 
    ? pilihanBermasalah.filter(() => randBool())
    : [];

  const riwayatSC = randBool();

  // Step 2: Penyakit & Kondisi
  const daftarPenyakit = ['anemia', 'malaria', 'tbc', 'jantung', 'diabetes', 'pms'];
  const penyakitTerpilih = daftarPenyakit.filter(() => randBool());
  const bengkakDarahTinggi = randBool();
  const hamilKembar = randBool();
  const hydramnion = randBool();
  const riwayatBayiMati = randBool();
  const serotinus = randBool();

  // Step 3: GDOB
  const letakSungsang = randBool();
  const letakLintang = randBool();
  const pendarahanKehamilan = randBool();
  const preeklampsiaBerat = randBool();

  // ── ISI STEP 1 ──
  await page.fill('#nama_pasien', nama);
  await page.fill('#kehamilan_ke', String(kehamilanKe));
  await page.fill('#umur', String(umur));

  // DatePicker
  await page.click('#hpht');
  const activeDay = page.locator('div[class*="grid-cols-7"] button:not([disabled])').first();
  if (await activeDay.isVisible()) {
    await activeDay.click();
  } else {
    await page.locator('text="15"').first().click();
  }

  if (isHamilPertama) {
    if (lamaMenikah === '<4') {
      await page.click('label[for="menikah-cepat"]');
    } else {
      await page.click('label[for="menikah-lama"]');
    }
  } else {
    if (jarakKehamilan === '<2') {
      await page.click('label[for="jarak-cepat"]');
    } else if (jarakKehamilan === '2-10') {
      await page.click('label[for="jarak-normal"]');
    } else {
      await page.click('label[for="jarak-lama"]');
    }
  }

  await page.fill('#jumlah_anak_hidup', String(jumlahAnakHidup));
  await page.fill('#tinggi_badan', String(tinggiBadan));

  if (riwayatKeguguran) {
    await page.click('label[for="keguguran-yes"]');
  } else {
    await page.click('label[for="keguguran-no"]');
  }

  if (!isHamilPertama && riwayatBermasalah.length > 0) {
    for (const item of riwayatBermasalah) {
      await page.check(`#bermasalah-${item}`);
    }
  }

  if (riwayatSC) {
    await page.click('label[for="sc-yes"]');
  } else {
    await page.click('label[for="sc-no"]');
  }

  // Next to Step 2
  await page.click('button:has-text("Lanjut")');

  // ── ISI STEP 2 ──
  await expect(page.locator('text=Langkah 2: Kondisi Kehamilan Saat Ini')).toBeVisible();

  for (const p of penyakitTerpilih) {
    await page.check(`#penyakit-${p}`);
  }

  await page.click(`label[for="bengkak_darah_tinggi-${bengkakDarahTinggi ? 'yes' : 'no'}"]`);
  await page.click(`label[for="hamil_kembar-${hamilKembar ? 'yes' : 'no'}"]`);
  await page.click(`label[for="hydramnion-${hydramnion ? 'yes' : 'no'}"]`);
  await page.click(`label[for="riwayat_bayi_mati-${riwayatBayiMati ? 'yes' : 'no'}"]`);
  await page.click(`label[for="serotinus-${serotinus ? 'yes' : 'no'}"]`);

  // Next to Step 3
  await page.click('button:has-text("Lanjut")');

  // ── ISI STEP 3 ──
  await expect(page.locator('text=Langkah 3: Kondisi Gawat / Darurat')).toBeVisible();

  await page.click(`label[for="letak_sungsang-${letakSungsang ? 'yes' : 'no'}"]`);
  await page.click(`label[for="letak_lintang-${letakLintang ? 'yes' : 'no'}"]`);
  await page.click(`label[for="pendarahan_kehamilan-${pendarahanKehamilan ? 'yes' : 'no'}"]`);
  await page.click(`label[for="preeklampsia_berat-${preeklampsiaBerat ? 'yes' : 'no'}"]`);

  // Submit
  await page.click('button:has-text("Lihat Hasil Analisis")');

  // Tunggu hasil
  await expect(page.locator('text=Level risiko Ibu Hamil')).toBeVisible({ timeout: 15000 });

  // Ambil data skor dari UI
  const skorText = await page.locator('text=/Skor KSPR:/').textContent();
  const riskTitle = await page.locator('h2').first().textContent();

  console.log('=== HASIL PENGETESAN SCREENING RANDOM ===');
  console.log(JSON.stringify({
    inputData: {
      kehamilanKe,
      umur,
      lamaMenikah,
      jarakKehamilan,
      jumlahAnakHidup,
      tinggiBadan,
      riwayatKeguguran,
      riwayatBermasalah,
      riwayatSC,
      penyakitTerpilih,
      bengkakDarahTinggi,
      hamilKembar,
      hydramnion,
      riwayatBayiMati,
      serotinus,
      letakSungsang,
      letakLintang,
      pendarahanKehamilan,
      preeklampsiaBerat,
    },
    uiResult: {
      skorText,
      riskTitle,
    }
  }, null, 2));
  console.log('==========================================');
});
