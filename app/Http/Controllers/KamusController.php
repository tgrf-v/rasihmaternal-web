<?php

namespace App\Http\Controllers;

use App\Models\KamusItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KamusController extends Controller
{
    /**
     * Tampilkan halaman publik Kamus Kesehatan & Video Terapi
     */
    public function index(): Response
    {
        $articles = KamusItem::articles()
            ->published()
            ->orderBy('title', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => (string) $item->id,
                    'letter' => $item->letter ?? strtoupper(substr($item->title, 0, 1)),
                    'title' => $item->title,
                    'category' => $item->category,
                    'content' => $item->content ?? '',
                    'summary' => $item->summary ?? '',
                    'firstAid' => $item->first_aid ?? '',
                ];
            });

        $videos = KamusItem::videos()
            ->published()
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => (string) $item->id,
                    'title' => $item->title,
                    'badge' => $item->video_badge ?? 'EDUKASI',
                    'category' => $item->category,
                    'instructor' => $item->instructor ?? 'Bidan RASIH Maternal',
                    'youtubeId' => $item->youtube_id ?? 'dQw4w9WgXcQ',
                    'duration' => $item->duration ?? '05:00',
                    'description' => $item->description ?? '',
                ];
            });

        return Inertia::render('Kamus/Index', [
            'articles' => $articles,
            'videos' => $videos,
        ]);
    }
}
