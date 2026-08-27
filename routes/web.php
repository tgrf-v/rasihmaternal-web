<?php

use App\Http\Controllers\Admin\BidanController;
use App\Http\Controllers\Admin\KamusAdminController;
use App\Http\Controllers\KamusController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScreeningController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ──────────────────────────────────────────────
// Login Route (Guest Only — belum login)
// ──────────────────────────────────────────────
// Halaman login di-handle oleh auth.php (Breeze),
// tapi kita tetap definisikan fallback redirect di sini.

// Redirect /beranda → / (alias)
Route::get('/beranda', function () {
    return redirect('/');
});

// ──────────────────────────────────────────────
// Protected Routes — Semua halaman butuh AUTH
// ──────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Beranda
    Route::get('/', function () {
        $user = auth()->user();
        $latestScreening = null;

        if ($user !== null) {
            $latest = $user->screenings()->latest()->first();
            if ($latest !== null) {
                $latestScreening = ScreeningController::formatScreeningResult($latest);
            }
        }

        return Inertia::render('Beranda', [
            'latestScreening' => $latestScreening,
        ]);
    })->name('beranda');

    // Tentang Kami
    Route::get('/tentang-kami', function () {
        return Inertia::render('TentangKami');
    })->name('tentang-kami');

    // Screening Kehamilan (GET — tampilkan form)
    Route::get('/screening/kehamilan', function () {
        $user = auth()->user();
        $recentScreenings = [];
        $latestScreening = null;

        if ($user !== null) {
            $recent = $user->screenings()
                ->latest()
                ->take(2)
                ->get();

            if ($recent->isNotEmpty()) {
                $recentScreenings = $recent->map(fn ($s) => ScreeningController::formatScreeningResult($s))->values()->all();
                $latestScreening = $recentScreenings[0] ?? null;
            }
        }

        return Inertia::render('Screening/Kehamilan', [
            'recentScreenings' => $recentScreenings,
            'latestScreening' => $latestScreening,
        ]);
    })->name('screening.kehamilan');

    // Screening Persalinan (GET — tampilkan form)
    Route::get('/screening/persalinan', function () {
        return Inertia::render('Screening/Persalinan');
    })->name('screening.persalinan');

    // Screening POST — simpan & hitung skor
    Route::post('/screening', [ScreeningController::class, 'store'])->name('screening.store');

    // Screening Hasil (detail 1 screening)
    Route::get('/screening/{screening}', [ScreeningController::class, 'show'])->name('screening.show');

    // Kamus Kesehatan & Terapi Komplementer (Publik)
    Route::get('/kamus', [KamusController::class, 'index'])->name('kamus.index');

    // Partograf Digital (Fitur Pemantauan Persalinan Mandiri)
    Route::get('/partograf', function () {
        return Inertia::render('Partograf/Index');
    })->name('partograf.index');

    Route::get('/partograf/{id}', function ($id) {
        return Inertia::render('Partograf/Show', [
            'id' => $id,
        ]);
    })->name('partograf.show');

    // Global Search Endpoint
    Route::get('/api/search', [SearchController::class, 'search'])->name('api.search');

    // Profil & Riwayat Screening
    Route::get('/profil', [ScreeningController::class, 'history'])->name('profil.index');
    Route::patch('/profil', [ProfileController::class, 'updateProfile'])->name('profile.update');

    // Design System Showcase (dev only)
    Route::get('/design-system', function () {
        return Inertia::render('DesignSystem');
    })->name('design-system');

    // Table Design Preview Showcase
    Route::get('/table-preview', function () {
        return Inertia::render('TablePreview');
    })->name('table-preview');
});

// ──────────────────────────────────────────────
// Superadmin Routes — Kelola Akun Bidan & Kamus
// ──────────────────────────────────────────────
Route::middleware(['auth', 'role:superadmin'])->prefix('admin')->group(function () {
    // Kelola Bidan
    Route::get('/bidan', [BidanController::class, 'index'])->name('admin.bidan.index');
    Route::post('/bidan', [BidanController::class, 'store'])->name('admin.bidan.store');
    Route::put('/bidan/{bidan}', [BidanController::class, 'update'])->name('admin.bidan.update');
    Route::patch('/bidan/{bidan}/toggle-status', [BidanController::class, 'toggleStatus'])->name('admin.bidan.toggle-status');
    Route::delete('/bidan/{bidan}', [BidanController::class, 'destroy'])->name('admin.bidan.destroy');

    // Kelola Kamus & Video Terapi
    Route::get('/kamus', [KamusAdminController::class, 'index'])->name('admin.kamus.index');
    Route::post('/kamus', [KamusAdminController::class, 'store'])->name('admin.kamus.store');
    Route::put('/kamus/{kamus}', [KamusAdminController::class, 'update'])->name('admin.kamus.update');
    Route::delete('/kamus/{kamus}', [KamusAdminController::class, 'destroy'])->name('admin.kamus.destroy');
});

require __DIR__.'/auth.php';
