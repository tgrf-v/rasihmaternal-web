<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Favicon Logo RASIH Maternal (PNG) -->
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <link rel="shortcut icon" href="/images/logo.png" />

        <title inertia>{{ config('app.name', 'RASIH Maternal - Sistem Prediksi Risiko Komplikasi Kehamilan dan Persalinan') }}</title>

        <!-- Primary Meta Tags -->
        <meta name="description" content="RASIH Maternal - Sistem deteksi dini dan skrining risiko komplikasi kehamilan dan persalinan, serta pemantauan partograf digital terpadu.">

        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:site_name" content="RASIH Maternal">
        <meta property="og:title" content="RASIH Maternal - Deteksi Dini Risiko Kehamilan & Persalinan">
        <meta property="og:description" content="Sistem skrining terpadu untuk mengenali risiko komplikasi kehamilan dan persalinan secara dini, serta pemantauan kesehatan ibu dan janin.">
        <meta property="og:image" content="{{ asset('images/logo.png') }}">
        <meta property="og:image:secure_url" content="{{ asset('images/logo.png') }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="336">
        <meta property="og:image:height" content="332">
        <meta property="og:image:alt" content="Logo RASIH Maternal">

        <!-- Twitter / X -->
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="RASIH Maternal - Deteksi Dini Risiko Kehamilan & Persalinan">
        <meta name="twitter:description" content="Sistem skrining terpadu untuk mengenali risiko komplikasi kehamilan dan persalinan secara dini.">
        <meta name="twitter:image" content="{{ asset('images/logo.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
