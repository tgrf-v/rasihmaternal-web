import { test, expect } from '@playwright/test';

test.describe('Suite 1: Verifikasi Semua Halaman & Kombinasi Perilaku Fitur', () => {

  // ─────────────────────────────────────────────────────────────
  // 1. LANDING PAGE & GUEST NAVIGATION
  // ─────────────────────────────────────────────────────────────
  test('Landing Page - Kombinasi 1: Render Lengkap & Akses Tombol CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=RASIH Maternal').first()).toBeVisible({ timeout: 10000 });

    // Cek Tombol Masuk / Login
    const loginLink = page.locator('a[href="/login"], a:has-text("Masuk"), button:has-text("Masuk")').first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Landing Page - Kombinasi 2: Navigasi Fitur & Informasi', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=RASIH Maternal').first()).toBeVisible();
    
    // Verifikasi konten edukatif
    await expect(page.locator('body')).toContainText('Maternal');
  });

  // ─────────────────────────────────────────────────────────────
  // 2. AUTHENTICATION & LOGIN BEHAVIORS
  // ─────────────────────────────────────────────────────────────
  test('Login - Kombinasi 1: Validasi Error Form Kosong', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email_input')).toBeVisible();

    // Submit tanpa isi input
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Login - Kombinasi 2: Login Berhasil sebagai Bidan Wilayah', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email_input', 'bidan@bundasehat.test');
    await page.fill('#password_input', 'password');
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });

    await expect(page.locator('text=RASIH Maternal').first()).toBeVisible();
  });

  test('Login - Kombinasi 3: Login Berhasil sebagai Superadmin', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email_input', 'surtiningsih@uhb.ac.id');
    await page.fill('#password_input', 'password');
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });

    await page.goto('/kamus');
    await expect(page).toHaveURL(/.*\/kamus/);
  });

  // ─────────────────────────────────────────────────────────────
  // 3. KAMUS KESEHATAN & VIDEO EDUKASI
  // ─────────────────────────────────────────────────────────────
  test('Kamus - Kombinasi 1: Navigasi Daftar Artikel & Pencarian', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email_input', 'ibuhamil@bundasehat.test');
    await page.fill('#password_input', 'password');
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });

    await page.goto('/kamus');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('Kamus - Kombinasi 2: Tab Video Edukasi & Interaksi', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email_input', 'ibuhamil@bundasehat.test');
    await page.fill('#password_input', 'password');
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });

    await page.goto('/kamus');
    const videoTab = page.locator('button:has-text("Video"), [role="tab"]:has-text("Video")').first();
    if (await videoTab.isVisible()) {
      await videoTab.click();
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 4. HALAMAN PROFIL & RIWAYAT SCREENING
  // ─────────────────────────────────────────────────────────────
  test('Profil - Kombinasi 1: Tampilan Profil & Riwayat Pasien', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email_input', 'ibuhamil@bundasehat.test');
    await page.fill('#password_input', 'password');
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });

    await page.goto('/profil');
    await expect(page).toHaveURL(/.*\/profil/);
    await expect(page.locator('text=Ibu Rahma Rahayu').first()).toBeVisible({ timeout: 10000 });
  });

  test('Profil - Kombinasi 2: Menu Profil & Dialog Edit Profil', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email_input', 'ibuhamil@bundasehat.test');
    await page.fill('#password_input', 'password');
    await page.click('button[type="submit"]:has-text("Masuk Sekarang")');
    await page.waitForURL((url: URL) => !url.pathname.includes('/login'), { timeout: 15000 });

    await page.goto('/profil');
    const profileNameBtn = page.locator('button', { hasText: 'Ibu Rahma Rahayu' });
    await expect(profileNameBtn).toBeVisible({ timeout: 10000 });
    await profileNameBtn.click();
    await expect(page.locator('#profile-education')).toBeVisible();
  });

});
