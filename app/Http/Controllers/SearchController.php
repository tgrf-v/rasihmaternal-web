<?php

namespace App\Http\Controllers;

use App\Models\KamusItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search endpoint for Global Search (Articles, Videos, Navigation, and Features)
     */
    public function search(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if ($q === '') {
            return response()->json(['results' => []]);
        }

        $results = [];
        $lowerQ = strtolower($q);

        // 1. Navigation & Features Index
        $navigationItems = [
            [
                'id' => 'nav-beranda',
                'title' => 'Beranda Utama',
                'category' => 'Fitur Navigasi',
                'description' => 'Ringkasan skrining dan akses cepat modul kesehatan',
                'url' => '/',
            ],
            [
                'id' => 'nav-kehamilan',
                'title' => 'Screening Kehamilan',
                'category' => 'Fitur Navigasi',
                'description' => 'Evaluasi risiko kehamilan, tensi darah (MAP), dan komplikasi kebidanan',
                'url' => '/screening/kehamilan',
            ],
            [
                'id' => 'nav-persalinan',
                'title' => 'Screening Persalinan',
                'category' => 'Fitur Navigasi',
                'description' => 'Kesiapan tempat bersalin, deteksi letak janin, dan rujukan PONED / RS',
                'url' => '/screening/persalinan',
            ],
            [
                'id' => 'nav-kamus',
                'title' => 'Kamus Kesehatan Kebidanan & Terapi',
                'category' => 'Fitur Navigasi',
                'description' => 'Katalog istilah medis A-Z dan video terapi komplementer non-obat',
                'url' => '/kamus',
            ],
            [
                'id' => 'nav-profil',
                'title' => 'Profil Saya & Riwayat Skrining',
                'category' => 'Fitur Navigasi',
                'description' => 'Data diri, HPHT, Puskesmas domisili, dan riwayat pemeriksaan',
                'url' => '/profil',
            ],
            [
                'id' => 'nav-tentang',
                'title' => 'Tentang Kami',
                'category' => 'Fitur Navigasi',
                'description' => 'Informasi platform RASIH Maternal dan tim pengembang kebidanan',
                'url' => '/tentang-kami',
            ],
            [
                'id' => 'faskes-poned',
                'title' => 'Puskesmas PONED (Pelayanan Obstetri Neonatal Emergency)',
                'category' => 'Rujukan Faskes',
                'description' => 'Fasilitas penanganan kegawatdaruratan kebidanan tingkat dasar',
                'url' => '/screening/persalinan',
            ],
            [
                'id' => 'faskes-rs',
                'title' => 'Rumah Sakit Rujukan Sp.OG / PONEK 24 Jam',
                'category' => 'Rujukan Faskes',
                'description' => 'Fasilitas rujukan lanjutan persalinan emergensi & Seksio Sesarea',
                'url' => '/screening/persalinan',
            ],
        ];

        // Admin Navigation if superadmin
        if (auth()->check() && auth()->user()->role === 'superadmin') {
            $navigationItems[] = [
                'id' => 'admin-bidan',
                'title' => 'Kelola Bidan & Nakes Wilayah',
                'category' => 'Fitur Navigasi',
                'description' => 'Manajemen akun Bidan faskes dan wilayah penugasan',
                'url' => '/admin/bidan',
            ];
            $navigationItems[] = [
                'id' => 'admin-kamus',
                'title' => 'Kelola Kamus Istilah & Video Terapi',
                'category' => 'Fitur Navigasi',
                'description' => 'Tambah, edit, dan susun konten artikel medis dengan Rich Text Editor',
                'url' => '/admin/kamus',
            ];
        }

        foreach ($navigationItems as $item) {
            if (
                str_contains(strtolower($item['title']), $lowerQ) ||
                str_contains(strtolower($item['description']), $lowerQ) ||
                str_contains(strtolower($item['category']), $lowerQ)
            ) {
                $results[] = $item;
            }
        }

        // 2. Database Kamus Items (Articles & Videos)
        $dbItems = KamusItem::published()
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('category', 'like', "%{$q}%")
                    ->orWhere('summary', 'like', "%{$q}%")
                    ->orWhere('content', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            })
            ->limit(10)
            ->get();

        foreach ($dbItems as $dbItem) {
            if ($dbItem->type === 'video') {
                $results[] = [
                    'id' => 'vid-' . $dbItem->id,
                    'title' => $dbItem->title,
                    'category' => 'Video Terapi',
                    'description' => $dbItem->description ?: 'Panduan video terapi komplementer mandiri',
                    'url' => '/kamus?tab=terapi&id=' . $dbItem->id,
                ];
            } else {
                $results[] = [
                    'id' => 'art-' . $dbItem->id,
                    'title' => $dbItem->title,
                    'category' => 'Edukasi Kebidanan',
                    'description' => $dbItem->summary ?: strip_tags(substr($dbItem->content ?? '', 0, 120)),
                    'url' => '/kamus?article=' . $dbItem->id,
                ];
            }
        }

        return response()->json(['results' => $results]);
    }
}
