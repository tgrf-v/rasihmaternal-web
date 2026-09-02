import { test, expect } from '@playwright/test';

async function loginAsBidan(page: any) {
  await page.goto('/login');
  await expect(page.locator('#email_input')).toBeVisible({ timeout: 10000 });
  await page.fill('#email_input', 'bidan@rasihmaternal.test');
  await page.fill('#password_input', 'password');
  await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
}

test.describe('Suite 3: Pengujian Komprehensif Partograf Digital WHO & Observasi Persalinan', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsBidan(page);
  });

  test('Partograf - Siklus Lengkap Observasi & Interaksi Antarmuka', async ({ page }) => {
    // 1. Buka Halaman Index Partograf
    await page.goto('/partograf');
    await expect(page.locator('h1:has-text("Partograf Digital")')).toBeVisible({ timeout: 10000 });

    // 2. Verifikasi Filter Status
    const filterAll = page.locator('button:has-text("Semua")').first();
    if (await filterAll.isVisible()) {
      await filterAll.click();
    }

    // 3. Buka Sesi Partograf Pertama yang ada di list
    const sessionCard = page.locator('a[href*="/partograf/"]').first();
    if (await sessionCard.isVisible()) {
      await sessionCard.click();
      await page.waitForURL(/.*\/partograf\/\d+/, { timeout: 15000 });

      // Verifikasi Tombol Aksi & Mode Tampilan
      const addEntryBtn = page.locator('button:has-text("Tambah Observasi")').first();
      await expect(addEntryBtn).toBeVisible({ timeout: 10000 });

      // 4. Uji Pengalih Tampilan (Toggle View Mode: Tabel Data <-> Grafik Partograf)
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

      // 5. Uji Buka Dialog Tambah Observasi
      await addEntryBtn.click();
      await expect(page.locator('h2:has-text("Catat Observasi"), text=Observasi 30 Menit').first()).toBeVisible({ timeout: 5000 });

      // Tutup dialog
      const closeBtn = page.locator('button:has-text("Batal"), button[type="button"]:has-text("Batal")').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });

});
