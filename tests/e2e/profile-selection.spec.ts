import { test, expect } from '@playwright/test';

async function loginAsIbuHamil(page: any) {
  await page.goto('/login');
  await expect(page.locator('#email_input')).toBeVisible({ timeout: 10000 });
  await page.fill('#email_input', 'ibuhamil@rasihmaternal.test');
  await page.fill('#password_input', 'password');
  await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });
}

test.describe('Verifikasi Sinkronisasi Pilihan Pendidikan & Pekerjaan Profil dan Screening', () => {

  test('Uji Pilih Pendidikan & Pekerjaan di Profil, Simpan, dan Cek Auto-Select di Form Screening', async ({ page }) => {
    await loginAsIbuHamil(page);

    // 1. Kunjungi halaman /profil
    await page.goto('/profil');
    const profileNameBtn = page.locator('button', { hasText: 'Ibu Rahma Rahayu' });
    await expect(profileNameBtn).toBeVisible({ timeout: 10000 });

    // 2. Buka form edit profil
    await profileNameBtn.click();
    await expect(page.locator('#profile-education')).toBeVisible();

    // 3. Pilih Pendidikan: Sarjana (S1)
    await page.click('#profile-education');
    await page.locator('div:has-text("Sarjana (S1)")').last().click();

    // 4. Pilih Pekerjaan: Tenaga Kesehatan
    await page.click('#profile-job');
    await page.locator('div:has-text("Tenaga Kesehatan (Dokter / Bidan / Perawat)")').last().click();

    // 5. Simpan Perubahan
    await page.click('button[type="submit"]:has-text("Simpan Perubahan")');

    // 6. Tunggu pesan sukses / kembali ke menu
    await expect(page.locator('button', { hasText: 'Ibu Rahma Rahayu' })).toBeVisible({ timeout: 10000 });

    // 7. Buka kembali form edit profil untuk verifikasi nilai tetap terpilih (BUKAN "Pilih...")
    await page.locator('button', { hasText: 'Ibu Rahma Rahayu' }).click();
    await expect(page.locator('#profile-education')).toContainText('Sarjana (S1)');
    await expect(page.locator('#profile-job')).toContainText('Tenaga Kesehatan');

    // 8. Kunjungi form screening persalinan dan verifikasi auto-select
    await page.goto('/screening/persalinan');
    await expect(page.locator('#pendidikan')).toContainText('Sarjana (S1)');
    await expect(page.locator('#pekerjaan')).toContainText('Tenaga Kesehatan');
  });

});
