<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Update user's extended profile data (Data Diri).
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'no_telepon' => ['nullable', 'string', 'max:20'],
            'nik' => ['nullable', 'string', 'max:20'],
            'tanggal_lahir' => ['nullable', 'date'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'pendidikan' => ['nullable', 'string', 'max:50'],
            'foto_profil' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'hapus_foto' => ['nullable', 'boolean'],
        ]);

        $user = $request->user();

        if ($request->hasFile('foto_profil')) {
            // Hapus foto lama jika ada
            if ($user->foto_profil && str_starts_with($user->foto_profil, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $user->foto_profil);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $savedPath = $this->processAndStoreAvatar($request->file('foto_profil'));
            $validated['foto_profil'] = '/storage/' . $savedPath;
        } elseif ($request->boolean('hapus_foto')) {
            if ($user->foto_profil && str_starts_with($user->foto_profil, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $user->foto_profil);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $validated['foto_profil'] = null;
        } else {
            // Jangan timpa foto_profil jika tidak diupload / tidak dihapus
            unset($validated['foto_profil']);
        }

        unset($validated['hapus_foto']);

        $user->update($validated);

        return Redirect::back()->with('success', 'Data profil berhasil diperbarui.');
    }

    /**
     * Resize, crop center, and compress avatar to WebP format.
     */
    private function processAndStoreAvatar(\Illuminate\Http\UploadedFile $file): string
    {
        $rawContent = file_get_contents($file->getRealPath());
        $image = @imagecreatefromstring($rawContent);

        if (!$image) {
            // Fallback to standard storage if GD fails
            return $file->store('avatars', 'public');
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $targetSize = 400;

        // Crop square from center
        $minDim = min($width, $height);
        $srcX = (int) round(($width - $minDim) / 2);
        $srcY = (int) round(($height - $minDim) / 2);

        $resized = imagecreatetruecolor($targetSize, $targetSize);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);

        imagecopyresampled(
            $resized,
            $image,
            0,
            0,
            $srcX,
            $srcY,
            $targetSize,
            $targetSize,
            $minDim,
            $minDim
        );

        // Save as WebP to temporary file
        $tempFile = tempnam(sys_get_temp_dir(), 'avatar_');
        imagewebp($resized, $tempFile, 82);

        imagedestroy($image);
        imagedestroy($resized);

        $filename = 'avatars/' . uniqid('avatar_', true) . '.webp';
        Storage::disk('public')->put($filename, file_get_contents($tempFile));
        @unlink($tempFile);

        return $filename;
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
