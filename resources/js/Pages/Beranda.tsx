import React from "react";
import { usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { ScreeningResult } from "@/types/screening";
import { PageProps } from "@/types";
import { BerandaLayananSection } from "./_BerandaLayananSection";
import { BerandaScreeningBanner } from "./_BerandaScreeningBanner";

type BerandaPageProps = PageProps<{
  latestScreening: ScreeningResult | null;
}>;

export default function Beranda() {
  const { latestScreening } = usePage<BerandaPageProps>().props;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* SECTION 1: LAYANAN UTAMA (HALODOC SIDE-BY-SIDE STYLE) */}
      <BerandaLayananSection />

      {/* SECTION 2: DATA PROGRESS ATAU HASIL SCREENING TERAKHIR */}
      <BerandaScreeningBanner screeningResult={latestScreening} />
    </div>
  );
}

Beranda.layout = (page: React.ReactNode) => <BundaSehatLayout activeNav="beranda">{page}</BundaSehatLayout>;
