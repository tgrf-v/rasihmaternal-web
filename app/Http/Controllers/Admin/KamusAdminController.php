<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KamusItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KamusAdminController extends Controller
{
    /**
     * Tampilkan panel manajemen Kamus & Video untuk Superadmin
     */
    public function index(): Response
    {
        $articles = KamusItem::articles()
            ->orderBy('title', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => $item->type,
                    'letter' => $item->letter ?? strtoupper(substr($item->title, 0, 1)),
                    'title' => $item->title,
                    'category' => $item->category,
                    'content' => $item->content ?? '',
                    'summary' => $item->summary ?? '',
                    'first_aid' => $item->first_aid ?? '',
                    'is_published' => $item->is_published,
                    'created_at' => $item->created_at?->format('d M Y'),
                ];
            });

        $videos = KamusItem::videos()
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => $item->type,
                    'title' => $item->title,
                    'category' => $item->category,
                    'video_badge' => $item->video_badge ?? 'EDUKASI',
                    'instructor' => $item->instructor ?? 'Bidan RASIH Maternal',
                    'youtube_id' => $item->youtube_id ?? '',
                    'duration' => $item->duration ?? '05:00',
                    'description' => $item->description ?? '',
                    'is_published' => $item->is_published,
                    'created_at' => $item->created_at?->format('d M Y'),
                ];
            });

        $stats = [
            'total_articles' => $articles->count(),
            'total_videos' => $videos->count(),
            'total_categories' => KamusItem::distinct('category')->count('category'),
        ];

        return Inertia::render('Admin/Kamus/Index', [
            'articles' => $articles,
            'videos' => $videos,
            'stats' => $stats,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Simpan artikel atau video baru
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:article,video'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'letter' => ['nullable', 'string', 'max:1'],
            'content' => ['nullable', 'string'],
            'summary' => ['nullable', 'string'],
            'first_aid' => ['nullable', 'string'],
            'video_badge' => ['nullable', 'string', 'max:100'],
            'instructor' => ['nullable', 'string', 'max:150'],
            'youtube_id' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        if ($validated['type'] === 'article' && empty($validated['letter'])) {
            $validated['letter'] = strtoupper(substr(trim($validated['title']), 0, 1));
        }

        // Extract YouTube ID if full URL is given
        if (!empty($validated['youtube_id'])) {
            $validated['youtube_id'] = $this->extractYoutubeId($validated['youtube_id']);
        }

        KamusItem::create($validated);

        $label = $validated['type'] === 'article' ? 'Artikel istilah medis' : 'Video terapi komplementer';
        return redirect()->route('admin.kamus.index')->with('success', "{$label} berhasil ditambahkan!");
    }

    /**
     * Update artikel atau video yang ada
     */
    public function update(Request $request, KamusItem $kamus): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'letter' => ['nullable', 'string', 'max:1'],
            'content' => ['nullable', 'string'],
            'summary' => ['nullable', 'string'],
            'first_aid' => ['nullable', 'string'],
            'video_badge' => ['nullable', 'string', 'max:100'],
            'instructor' => ['nullable', 'string', 'max:150'],
            'youtube_id' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        if ($kamus->type === 'article' && empty($validated['letter'])) {
            $validated['letter'] = strtoupper(substr(trim($validated['title']), 0, 1));
        }

        if (!empty($validated['youtube_id'])) {
            $validated['youtube_id'] = $this->extractYoutubeId($validated['youtube_id']);
        }

        $kamus->update($validated);

        $label = $kamus->type === 'article' ? 'Artikel istilah medis' : 'Video terapi komplementer';
        return redirect()->route('admin.kamus.index')->with('success', "{$label} berhasil diperbarui!");
    }

    /**
     * Hapus artikel atau video
     */
    public function destroy(KamusItem $kamus): RedirectResponse
    {
        $label = $kamus->type === 'article' ? 'Artikel istilah medis' : 'Video terapi komplementer';
        $kamus->delete();

        return redirect()->route('admin.kamus.index')->with('success', "{$label} berhasil dihapus!");
    }

    /**
     * Helper to extract clean YouTube ID from URL or raw ID
     */
    private function extractYoutubeId(string $urlOrId): string
    {
        $urlOrId = trim($urlOrId);
        if (preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $urlOrId, $match)) {
            return $match[1];
        }
        return $urlOrId;
    }
}
