<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScreeningRequest;
use App\Models\Screening;
use App\Services\ScoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ScreeningController extends Controller
{
    public function __construct(
        private readonly ScoringService $scoringService,
    ) {}

    /**
     * Simpan screening baru (DSS — Ibu Hamil).
     * Menerima data form → hitung skor KSPR & MAP → simpan ke DB → redirect ke hasil.
     */
    public function store(ScreeningRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = Auth::user();

        if ($user === null) {
            return redirect()->route('login');
        }

        // Untuk persalinan: merge keluhan tambahan berdasarkan kondisi persalinan
        $keluhanSpesifik = $validated['keluhan_spesifik'] ?? [];

        if (($validated['tipe_screening'] ?? '') === 'persalinan') {
            if (!empty($validated['ada_riwayat_sc']) && !in_array('riwayat_sc', $keluhanSpesifik, true)) {
                $keluhanSpesifik[] = 'riwayat_sc';
            }
            if (isset($validated['posisi_janin']) && $validated['posisi_janin'] !== 'kepala_bawah' && !in_array('letak_sungsang_lintang', $keluhanSpesifik, true)) {
                $keluhanSpesifik[] = 'letak_sungsang_lintang';
            }
            if (isset($validated['kondisi_ketuban']) && $validated['kondisi_ketuban'] === 'pecah' && !in_array('ketuban_pecah_dini', $keluhanSpesifik, true)) {
                $keluhanSpesifik[] = 'ketuban_pecah_dini';
            }
        }

        $validated['keluhan_spesifik'] = $keluhanSpesifik;

        // Hitung skor via ScoringService
        $scoringResult = $this->scoringService->evaluateScreening($validated);

        // Map tipe_screening ke format DB
        $tipeDb = $validated['tipe_screening'] === 'kehamilan' ? 'dss' : 'dss';

        // Prepare 15 Maternal Parameters for FastAPI ML
        $tb = (float) ($validated['tinggi_badan'] ?? 155);
        $bb = (float) ($validated['berat_badan'] ?? 55);
        $calculatedImt = (float) ($validated['imt'] ?? ($tb > 0 ? round($bb / (($tb / 100) ** 2), 1) : 22.0));

        $pekerjaan = $validated['pekerjaan'] ?? $user->pekerjaan ?? 'Ibu Rumah Tangga';
        $pendidikan = $validated['pendidikan'] ?? $user->pendidikan ?? 'SLTA';
        $gravida = (int) ($validated['gravida'] ?? ($validated['kehamilan_ke'] ?? (($validated['paritas'] ?? 0) + ($validated['abortus'] ?? 0) + 1)));
        $para = (int) ($validated['paritas'] ?? $validated['jumlah_anak_hidup'] ?? 0);
        $abortus = (int) ($validated['abortus'] ?? 0);
        $sistolik = (int) ($validated['sistolik'] ?? 120);
        $diastolik = (int) ($validated['diastolik'] ?? 80);
        $letakJanin = $validated['letak_janin'] ?? (isset($validated['posisi_janin']) && $validated['posisi_janin'] === 'sungsang' ? 'Sungsang' : (isset($validated['posisi_janin']) && $validated['posisi_janin'] === 'lintang' ? 'Melintang' : 'Memanjang'));
        $umurKehamilan = $validated['umur_kehamilan'] ?? 'Aterm';
        $jenisPersalinan = $validated['jenis_persalinan'] ?? (!empty($validated['ada_riwayat_sc']) ? 'Sectio Sesarea' : 'Persalinan Pervaginam');
        $hb = (float) ($validated['hb'] ?? 12.0);
        $leokosit = (int) ($validated['leokosit'] ?? 9000);
        $trombosit = (int) ($validated['trombosit'] ?? 250000);

        // Call FastAPI Microservice (XGBoost)
        $diagnosaMl = null;
        $kategoriMl = null;
        $skorRisikoMl = null;
        $probabilitasMl = null;

        try {
            $mlResponse = \Illuminate\Support\Facades\Http::timeout(3)->post('http://127.0.0.1:8000/predict', [
                'usia' => (int) $validated['umur'],
                'pekerjaan' => $pekerjaan,
                'pendidikan' => $pendidikan,
                'gravida' => $gravida,
                'para' => $para,
                'abortus' => $abortus,
                'imt' => $calculatedImt,
                'sistolik' => $sistolik,
                'diastolik' => $diastolik,
                'letak_janin' => $letakJanin,
                'umur_kehamilan' => $umurKehamilan,
                'jenis_persalinan' => $jenisPersalinan,
                'hemoglobin' => $hb,
                'leukosit' => $leokosit,
                'trombosit' => $trombosit,
            ]);

            if ($mlResponse->successful()) {
                $mlData = $mlResponse->json();
                $diagnosaMl = $mlData['primary_diagnosis'] ?? null;
                $kategoriMl = $mlData['risk_category'] ?? null;
                $skorRisikoMl = $mlData['confidence_score'] ?? null;
                $probabilitasMl = $mlData['probabilities'] ?? null;
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('FastAPI ML Service connection notice: ' . $e->getMessage());
        }

        // Simpan ke database
        $screening = Screening::create([
            'ibu_hamil_id' => $user->id,
            'bidan_id' => null,
            'tipe_screening' => $tipeDb,

            // Input data (15 variabel dataset maternal)
            'nama_pasien' => $validated['nama_pasien'],
            'nik' => $validated['nik'] ?? null,
            'pekerjaan' => $pekerjaan,
            'pendidikan' => $pendidikan,
            'umur' => $validated['umur'],
            'gravida' => $gravida,
            'paritas' => $para,
            'abortus' => $abortus,
            'imt' => $calculatedImt,
            'hpht' => $validated['hpht'] ?? null,
            'sistolik' => $sistolik,
            'diastolik' => $diastolik,
            'letak_janin' => $letakJanin,
            'umur_kehamilan' => $umurKehamilan,
            'jenis_persalinan' => $jenisPersalinan,
            'hb' => $hb,
            'leokosit' => $leokosit,
            'trombosit' => $trombosit,
            'edema_level' => $validated['edema_level'] ?? 'none',
            'keluhan_spesifik' => $keluhanSpesifik,
            'sudah_dapat_treatment' => $validated['sudah_dapat_treatment'] ?? false,
            'detail_treatment' => $validated['detail_treatment'] ?? null,
            'wilayah_puskesmas' => $validated['wilayah_puskesmas'] ?? null,

            // Persalinan-specific
            'posisi_janin' => $validated['posisi_janin'] ?? null,
            'ada_riwayat_sc' => $validated['ada_riwayat_sc'] ?? false,
            'kondisi_ketuban' => $validated['kondisi_ketuban'] ?? null,

            // Output kalkulasi
            'kode_screening' => $scoringResult['kode_screening'],
            'skor_kspr' => $scoringResult['skor_kspr'],
            'map_value' => $scoringResult['map_value'],
            'tingkat_risiko' => $scoringResult['tingkat_risiko'],
            'kategori_risiko' => $scoringResult['kategori_risiko'],
            'status_label' => $scoringResult['status_label'],
            'diagnosa_komplikasi' => $scoringResult['diagnosa_komplikasi'],
            'rekomendasi_faskes' => $scoringResult['rekomendasi_faskes'],
            'rekomendasi_tempat' => $scoringResult['rekomendasi_tempat'],
            'penolong_persalinan' => $scoringResult['penolong_persalinan'],
            'saran_terapi' => $scoringResult['saran_terapi'],
            'detail_skor' => $scoringResult['detail_skor'],
            'taksiran_hpl' => $scoringResult['taksiran_hpl'],

            // Output Machine Learning
            'diagnosa_ml' => $diagnosaMl,
            'kategori_ml' => $kategoriMl,
            'skor_risiko_ml' => $skorRisikoMl,
            'probabilitas_ml' => $probabilitasMl,
        ]);

        return redirect()->route('screening.show', ['screening' => $screening->id]);
    }

    /**
     * Tampilkan detail 1 screening (halaman Hasil).
     */
    public function show(Screening $screening): Response
    {
        $user = Auth::user();

        // Pastikan user hanya bisa lihat screening miliknya sendiri
        if ($user === null || ($screening->ibu_hamil_id !== $user->id && $screening->bidan_id !== $user->id)) {
            abort(403, 'Anda tidak memiliki akses ke screening ini.');
        }

        return Inertia::render('Screening/Hasil', [
            'screening' => $this->formatScreeningResult($screening),
        ]);
    }

    /**
     * Ambil riwayat screening user yang login.
     */
    public function history(Request $request): Response
    {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $screenings = Screening::where('ibu_hamil_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (Screening $s) => $this->formatScreeningResult($s));

        return Inertia::render('Profil/Index', [
            'screenings' => $screenings,
        ]);
    }

    /**
     * Format Screening model ke format yang dibutuhkan frontend (ScreeningResult type).
     *
     * @return array<string, mixed>
     */
    public static function formatScreeningResult(Screening $screening): array
    {
        return [
            'id' => $screening->id,
            'kode_screening' => $screening->kode_screening,
            'skor_poedji_rochjati' => $screening->skor_kspr,
            'total_skor' => $screening->skor_kspr,
            'tingkat_risiko' => $screening->tingkat_risiko,
            'kategori_risiko' => $screening->kategori_risiko,
            'status_label' => $screening->status_label,
            'map_value' => (float) $screening->map_value,
            'potensi_komplikasi' => $screening->diagnosa_komplikasi ?? [],
            'rekomendasi_faskes' => $screening->rekomendasi_faskes,
            'rekomendasi_tempat' => $screening->rekomendasi_tempat,
            'penolong_persalinan' => $screening->penolong_persalinan,
            'taksiran_hpl' => $screening->taksiran_hpl,
            'saran_terapi_ids' => $screening->tingkat_risiko === 'Berat' ? [3, 4] : ($screening->tingkat_risiko === 'Sedang' ? [1, 2] : [2]),
            'saran_terapi' => $screening->saran_terapi ?? [],
            'detail_skor' => $screening->detail_skor ?? [],
            'diagnosa_ml' => $screening->diagnosa_ml,
            'kategori_ml' => $screening->kategori_ml,
            'skor_risiko_ml' => $screening->skor_risiko_ml ? (float) $screening->skor_risiko_ml : null,
            'probabilitas_ml' => $screening->probabilitas_ml ?? [],
            'input_summary' => [
                'nama_pasien' => $screening->nama_pasien,
                'nik' => $screening->nik,
                'pekerjaan' => $screening->pekerjaan,
                'pendidikan' => $screening->pendidikan,
                'umur' => $screening->umur,
                'gravida' => $screening->gravida,
                'paritas' => $screening->paritas,
                'abortus' => $screening->abortus,
                'imt' => (float) $screening->imt,
                'hpht' => $screening->hpht,
                'sistolik' => $screening->sistolik,
                'diastolik' => $screening->diastolik,
                'letak_janin' => $screening->letak_janin,
                'umur_kehamilan' => $screening->umur_kehamilan,
                'jenis_persalinan' => $screening->jenis_persalinan,
                'hb' => (float) $screening->hb,
                'leokosit' => $screening->leokosit,
                'trombosit' => $screening->trombosit,
                'edema_level' => $screening->edema_level,
                'keluhan_spesifik' => $screening->keluhan_spesifik ?? [],
                'sudah_dapat_treatment' => $screening->sudah_dapat_treatment,
                'detail_treatment' => $screening->detail_treatment,
                'tipe_screening' => $screening->tipe_screening === 'dss' ? 'kehamilan' : $screening->tipe_screening,
                'wilayah_puskesmas' => $screening->wilayah_puskesmas,
            ],
            'nama_pasien' => $screening->nama_pasien,
            'created_at' => $screening->created_at?->translatedFormat('j F Y, H:i') . ' WIB',
        ];
    }
}
