<?php

namespace App\Http\Controllers;

use App\Models\PartografEntry;
use App\Models\PartografSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PartografController extends Controller
{
    /**
     * Tampilkan daftar sesi pemantauan partograf.
     */
    public function index(Request $request): Response
    {
        $query = PartografSession::query()->withCount('entries');

        // Filter berdasarkan pencarian nama / no register
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_ibu', 'like', "%{$search}%")
                  ->orWhere('no_register', 'like', "%{$search}%")
                  ->orWhere('no_puskesmas', 'like', "%{$search}%");
            });
        }

        // Filter status (aktif, selesai, dirujuk)
        if ($request->filled('status') && in_array($request->input('status'), ['aktif', 'selesai', 'dirujuk'])) {
            $query->where('status', $request->input('status'));
        }

        $sessions = $query->latest()->get()->map(function ($session) {
            return [
                'id' => (string) $session->id,
                'no_register' => $session->no_register,
                'no_puskesmas' => $session->no_puskesmas ?? '-',
                'nama_ibu' => $session->nama_ibu,
                'umur_ibu' => $session->umur_ibu,
                'gravida' => $session->gravida,
                'para' => $session->para,
                'abortus' => $session->abortus,
                'tanggal' => $session->tanggal ? Carbon::parse($session->tanggal)->translatedFormat('d F Y') : '-',
                'tanggal_raw' => $session->tanggal ? Carbon::parse($session->tanggal)->format('Y-m-d') : '',
                'jam_masuk' => $session->jam_masuk,
                'ketuban_pecah_sejak' => $session->ketuban_pecah_sejak,
                'mules_sejak' => $session->mules_sejak,
                'status' => $session->status,
                'catatan' => $session->catatan,
                'nama_bidan' => $session->nama_bidan ?? ($session->user?->name ?? 'Bidan Wilayah'),
                'entries_count' => $session->entries_count,
                'created_at' => $session->created_at->toISOString(),
            ];
        });

        return Inertia::render('Partograf/Index', [
            'sessions' => $sessions,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
            ],
        ]);
    }

    /**
     * Buat sesi partograf baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_register' => ['nullable', 'string', 'max:50'],
            'no_puskesmas' => ['nullable', 'string', 'max:50'],
            'nama_ibu' => ['required', 'string', 'max:100'],
            'umur_ibu' => ['required', 'integer', 'min:12', 'max:65'],
            'gravida' => ['required', 'integer', 'min:1', 'max:20'],
            'para' => ['required', 'integer', 'min:0', 'max:20'],
            'abortus' => ['required', 'integer', 'min:0', 'max:20'],
            'tanggal' => ['required', 'string'],
            'jam_masuk' => ['required', 'string'],
            'ketuban_pecah_sejak' => ['nullable', 'string'],
            'mules_sejak' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:aktif,selesai,dirujuk'],
            'catatan' => ['nullable', 'string'],
            'nama_bidan' => ['nullable', 'string', 'max:100'],
        ]);

        if (empty($validated['no_register'])) {
            $validated['no_register'] = 'REG-' . date('Ymd') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        }

        if (empty($validated['no_puskesmas'])) {
            $validated['no_puskesmas'] = auth()->user()?->bidanProfile?->wilayah_puskesmas ?? 'PKM-SEHAT-01';
        }

        if (empty($validated['nama_bidan'])) {
            $validated['nama_bidan'] = auth()->user()?->name ?? 'Bidan Wilayah';
        }

        // Format tanggal ke Y-m-d
        try {
            $validated['tanggal'] = Carbon::parse($validated['tanggal'])->format('Y-m-d');
        } catch (\Exception $e) {
            $validated['tanggal'] = now()->format('Y-m-d');
        }

        $session = PartografSession::create([
            ...$validated,
            'user_id' => auth()->id(),
            'status' => $validated['status'] ?? 'aktif',
        ]);

        return redirect()->route('partograf.show', $session->id)
            ->with('success', 'Lembar Partograf Digital berhasil dibuat.');
    }

    /**
     * Tampilkan detail lembar partograf dan grafik SVG.
     */
    public function show(string $id): Response
    {
        $session = PartografSession::with(['entries', 'user'])->findOrFail($id);

        $formattedSession = [
            'id' => (string) $session->id,
            'no_register' => $session->no_register,
            'no_puskesmas' => $session->no_puskesmas ?? '-',
            'nama_ibu' => $session->nama_ibu,
            'umur_ibu' => $session->umur_ibu,
            'gravida' => $session->gravida,
            'para' => $session->para,
            'abortus' => $session->abortus,
            'tanggal' => $session->tanggal ? Carbon::parse($session->tanggal)->translatedFormat('d F Y') : '-',
            'tanggal_raw' => $session->tanggal ? Carbon::parse($session->tanggal)->format('Y-m-d') : '',
            'jam_masuk' => $session->jam_masuk,
            'ketuban_pecah_sejak' => $session->ketuban_pecah_sejak,
            'mules_sejak' => $session->mules_sejak,
            'status' => $session->status,
            'catatan' => $session->catatan,
            'nama_bidan' => $session->nama_bidan ?? ($session->user?->name ?? 'Bidan Wilayah'),
        ];

        $formattedEntries = $session->entries->map(function ($entry) {
            return [
                'id' => (string) $entry->id,
                'partograf_session_id' => (string) $entry->partograf_session_id,
                'waktu_observasi' => $entry->waktu_observasi,
                'jam_ke' => (int) $entry->jam_ke,
                'kolom_idx' => (int) $entry->kolom_idx,
                'djj' => $entry->djj !== null ? (int) $entry->djj : null,
                'air_ketuban' => $entry->air_ketuban,
                'penyusupan' => $entry->penyusupan,
                'pembukaan_serviks' => $entry->pembukaan_serviks !== null ? (float) $entry->pembukaan_serviks : null,
                'penurunan_kepala' => $entry->penurunan_kepala !== null ? (int) $entry->penurunan_kepala : null,
                'kontraksi_jumlah' => $entry->kontraksi_jumlah !== null ? (int) $entry->kontraksi_jumlah : null,
                'kontraksi_durasi' => $entry->kontraksi_durasi,
                'oksitosin_unit' => $entry->oksitosin_unit,
                'oksitosin_tetes' => $entry->oksitosin_tetes !== null ? (int) $entry->oksitosin_tetes : null,
                'obat_cairan_iv' => $entry->obat_cairan_iv,
                'nadi' => $entry->nadi !== null ? (int) $entry->nadi : null,
                'sistol' => $entry->sistol !== null ? (int) $entry->sistol : null,
                'diastol' => $entry->diastol !== null ? (int) $entry->diastol : null,
                'suhu' => $entry->suhu !== null ? (float) $entry->suhu : null,
                'urin_protein' => $entry->urin_protein,
                'urin_aseton' => $entry->urin_aseton,
                'urin_volume' => $entry->urin_volume !== null ? (int) $entry->urin_volume : null,
            ];
        })->values()->all();

        return Inertia::render('Partograf/Show', [
            'id' => (string) $session->id,
            'session' => $formattedSession,
            'entries' => $formattedEntries,
        ]);
    }

    /**
     * Simpan atau update entri observasi pada partograf.
     */
    public function storeEntry(string $id, Request $request)
    {
        $session = PartografSession::findOrFail($id);

        $validated = $request->validate([
            'waktu_observasi' => ['required', 'string'],
            'jam_ke' => ['required', 'integer', 'min:1', 'max:16'],
            'kolom_idx' => ['required', 'integer', 'min:0', 'max:31'],
            'djj' => ['nullable', 'integer', 'min:60', 'max:220'],
            'air_ketuban' => ['nullable', 'string', 'in:U,J,M,D,K,u,j,m,d,k'],
            'penyusupan' => ['nullable', 'string', 'in:0,1,2,3'],
            'pembukaan_serviks' => ['nullable', 'numeric', 'min:0', 'max:10'],
            'penurunan_kepala' => ['nullable', 'integer', 'min:0', 'max:5'],
            'kontraksi_jumlah' => ['nullable', 'integer', 'min:1', 'max:5'],
            'kontraksi_durasi' => ['nullable', 'string', 'in:<20,20-40,>40'],
            'oksitosin_unit' => ['nullable', 'string'],
            'oksitosin_tetes' => ['nullable', 'integer', 'min:0', 'max:100'],
            'obat_cairan_iv' => ['nullable', 'string'],
            'nadi' => ['nullable', 'integer', 'min:40', 'max:200'],
            'sistol' => ['nullable', 'integer', 'min:50', 'max:250'],
            'diastol' => ['nullable', 'integer', 'min:30', 'max:160'],
            'suhu' => ['nullable', 'numeric', 'min:30', 'max:45'],
            'urin_protein' => ['nullable', 'string'],
            'urin_aseton' => ['nullable', 'string'],
            'urin_volume' => ['nullable', 'integer', 'min:0', 'max:2000'],
        ]);

        if (!empty($validated['air_ketuban'])) {
            $validated['air_ketuban'] = strtoupper($validated['air_ketuban']);
        }

        PartografEntry::updateOrCreate(
            [
                'partograf_session_id' => $session->id,
                'kolom_idx' => $validated['kolom_idx'],
            ],
            $validated
        );

        return redirect()->route('partograf.show', $session->id)
            ->with('success', "Observasi kolom {$validated['kolom_idx']} berhasil dicatat.");
    }

    /**
     * Update status pemantauan (aktif, selesai, dirujuk) dan catatan.
     */
    public function updateStatus(string $id, Request $request)
    {
        $session = PartografSession::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:aktif,selesai,dirujuk'],
            'catatan' => ['nullable', 'string'],
        ]);

        $session->update($validated);

        return redirect()->route('partograf.show', $session->id)
            ->with('success', 'Status pemantauan partograf berhasil diperbarui.');
    }

    /**
     * Hapus sesi partograf.
     */
    public function destroy(string $id)
    {
        $session = PartografSession::findOrFail($id);
        $session->delete();

        return redirect()->route('partograf.index')
            ->with('success', 'Lembar partograf berhasil dihapus.');
    }

    /**
     * Hapus satu entri observasi.
     */
    public function destroyEntry(string $sessionId, string $entryId)
    {
        $entry = PartografEntry::where('partograf_session_id', $sessionId)
            ->where('id', $entryId)
            ->firstOrFail();

        $entry->delete();

        return redirect()->route('partograf.show', $sessionId)
            ->with('success', 'Entri observasi berhasil dihapus.');
    }
}
