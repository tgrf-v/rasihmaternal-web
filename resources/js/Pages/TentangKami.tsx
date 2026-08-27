import React from "react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function TentangKami() {
  return (
    <BundaSehatLayout activeNav="tentang-kami">
      <div className="w-full">

        {/* HERO HEADER DENGAN BACKGROUND GAMBAR (KOTAK RATA) */}
        <section className="w-full relative overflow-hidden text-white pt-16 pb-12 sm:pt-20 sm:pb-16 bg-emerald-950 shadow-soft-sm">
          {/* Background Image */}
          <img
            src="/images/about-hero-bg.jpg"
            alt="Tentang BundaSehat"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Overlay Gradient Emerald untuk Kontras Teks yang Jelas */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/80 to-emerald-950/85 backdrop-blur-[0.5px]" />

          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-2.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
              Tentang RASIH Maternal
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-emerald-100 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Risk Assessment and Screening for Integrated Maternal Health • Sistem Prediksi Risiko Komplikasi Kehamilan dan Persalinan.
            </p>
          </div>
        </section>

        {/* SECTION 1: PROFIL & TUJUAN PLATFORM (BACKGROUND PUTIH) */}
        <section id="tentang" className="w-full bg-white py-8 sm:py-10 md:py-12 border-b border-slate-100/80">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">

              {/* Left Image Box */}
              <div className="md:col-span-5 flex justify-center">
                <div className="w-full h-56 sm:h-72 rounded-3xl bg-slate-100/80 p-6 sm:p-8 flex flex-col items-center justify-center border border-slate-200 shadow-soft-sm">
                  <ApplicationLogo className="h-20 sm:h-24 w-20 sm:w-24 mb-2" />
                  <span className="font-bold text-lg sm:text-xl text-slate-800 tracking-wide">
                    RASIH Maternal
                  </span>
                  <span className="text-xs text-slate-500 italic mt-0.5">
                    &ldquo;Kenali Risiko, Lindungi Ibu dan Bayi&rdquo;
                  </span>
                </div>
              </div>

              {/* Right Text Content */}
              <div className="md:col-span-7 space-y-3.5 text-slate-700">
                <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                  <strong>RASIH Maternal</strong> (<em>Risk Assessment and Screening for Integrated Maternal Health</em>) dikembangkan khusus untuk mendukung pendampingan ibu hamil dalam melakukan deteksi dini faktor risiko tinggi (<em className="text-coral-600 font-semibold">Resti</em>) dan pemantauan kesiapan persalinan sehat tanpa komplikasi.
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                  Platform ini mengintegrasikan instrumen skrining klinis kebidanan, partograf digital standar WHO/Kemenkes, pemantauan usia kehamilan &amp; HPL, serta rekomendasi penolong dan tempat persalinan yang aman.
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                  Kami berkomitmen menjadi platform rujukan digital terpercaya bagi ibu hamil dan bidan wilayah dalam mempercepat deteksi dini serta menekan angka komplikasi maternal-neonatal.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: MENGAPA RASIH MATERNAL DIKEMBANGKAN? (BACKGROUND ABU-ABU SANGAT LEMBUT) */}
        <section className="w-full bg-slate-50/90 py-8 sm:py-10 md:py-12 border-b border-slate-200/60">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Mengapa RASIH Maternal Dikembangkan?
              </h2>

              <div className="space-y-3.5 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium text-center">
                <p>
                  Kehamilan membutuhkan pemantauan yang berkelanjutan dan penuh kehati-hatian. Setiap tahapan dan perubahan kondisi fisik ibu maupun perkembangan janin memerlukan perhatian dini untuk memastikan proses persalinan dapat berjalan lancar dan aman.
                </p>

                <p>
                  Namun pada kenyataannya, tidak semua ibu memiliki akses informasi kesehatan kebidanan yang mudah dipahami, akurat, dan bebas dari kebingungan mitos yang beredar luas di masyarakat.
                </p>

                <p>
                  <strong>RASIH Maternal</strong> hadir sebagai pendamping digital yang menjembatani ibu hamil dengan standar klinis kebidanan terpercaya. Kami hadir untuk membantu mengenali tanda bahaya sedini mungkin, memberikan edukasi perawatan mandiri yang aman, dan mendukung pengambilan keputusan rujukan persalinan yang tepat waktu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: LANDASAN & KEAHLIAN (BACKGROUND PUTIH) */}
        <section className="w-full bg-white py-8 sm:py-10 md:py-12">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">

              {/* Left Text Content */}
              <div className="md:col-span-7 space-y-3.5 text-slate-700 order-2 md:order-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Landasan &amp; Keahlian
                </h2>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                  <strong className="font-bold text-slate-900">Kepakaran Kebidanan Bu Asih &amp; Nakes Wilayah</strong> menjadi fondasi utama dalam penyusunan rekomendasi medis, edukasi kamus kesehatan A-Z, dan panduan terapi komplementer non-obat yang dihadirkan di dalam platform.
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                  Visi kami adalah berkontribusi aktif dalam percepatan transformasi digital di bidang kesehatan ibu dan anak, dengan menghadirkan solusi teknologi yang menjawab permasalahan krusial kebidanan secara tepat dan berbasis bukti medis.
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                  Moto kami yakni <em className="font-bold text-emerald-700">Inovasi Medis &amp; Kemanusiaan</em>. Kami meyakini bahwa inovasi digital hanya akan memberikan nilai dampak nyata jika mengedepankan keselamatan dan kenyamanan ibu hamil serta janinnya.
                </p>
              </div>

              {/* Right Image Box */}
              <div className="md:col-span-5 flex justify-center order-1 md:order-2">
                <div className="w-full h-56 sm:h-72 rounded-3xl bg-slate-100/80 p-6 sm:p-8 flex flex-col items-center justify-center border border-slate-200 shadow-soft-sm">
                  <ApplicationLogo className="h-16 sm:h-20 w-16 sm:w-20 mb-2" />
                  <span className="font-bold text-lg sm:text-xl text-slate-800 tracking-wide">
                    Logo
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </BundaSehatLayout>
  );
}
