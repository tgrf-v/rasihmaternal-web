import React, { useState, useEffect } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import { RasihMaternalLayout } from "@/Layouts/RasihMaternalLayout";
import { ScreeningResult } from "@/types/screening";
import { PageProps } from "@/types";
import { ProfileFormData } from "./types";

import { ProfilMenuUtama } from "./_ProfilMenuUtama";
import { ProfilEditForm } from "./_ProfilEditForm";
import { ProfilRiwayatTable } from "./_ProfilRiwayatTable";
import { ProfilSyaratKetentuan } from "./_ProfilSyaratKetentuan";
import { ProfilKebijakanPrivasi } from "./_ProfilKebijakanPrivasi";
import { ProfilBantuan } from "./_ProfilBantuan";
import { ProfilLogoutModal } from "./_ProfilLogoutModal";

type ProfilPageProps = PageProps<{
  screenings: ScreeningResult[];
}>;

export default function ProfilIndex() {
  const { auth, screenings } = usePage<ProfilPageProps>().props;
  const user = auth.user;

  const [activeView, setActiveView] = useState<
    "menu" | "edit_profil" | "riwayat" | "syarat" | "privasi" | "bantuan"
  >("menu");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const form = useForm<ProfileFormData>({
    name: user.name || "",
    no_telepon: user.no_telepon || "",
    nik: user.nik || "",
    tanggal_lahir: user.tanggal_lahir || "",
    pekerjaan: user.pekerjaan || "",
    pendidikan: user.pendidikan || "",
    foto_profil: null,
    hapus_foto: false,
  });

  useEffect(() => {
    form.setData({
      name: user.name || "",
      no_telepon: user.no_telepon || "",
      nik: user.nik || "",
      tanggal_lahir: user.tanggal_lahir || "",
      pekerjaan: user.pekerjaan || "",
      pendidikan: user.pendidikan || "",
      foto_profil: null,
      hapus_foto: false,
    });
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Gunakan router.post dengan method spoofing _method: 'patch' dan forceFormData agar upload biner gambar didukung
    router.post(
      route("profile.update"),
      {
        ...form.data,
        _method: "patch",
      },
      {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsSaved(true);
          setTimeout(() => {
            setIsSaved(false);
            setActiveView("menu");
          }, 1200);
        },
      }
    );
  };

  const handleLogoutConfirm = () => {
    router.post(route("logout"));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {activeView === "menu" && (
        <ProfilMenuUtama
          user={user}
          onNavigate={(view) => setActiveView(view)}
          onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
        />
      )}

      {activeView === "edit_profil" && (
        <ProfilEditForm
          data={form.data}
          setData={form.setData}
          errors={form.errors}
          processing={form.processing}
          isSaved={isSaved}
          initialPhoto={user.foto_profil}
          onSubmit={handleSaveProfile}
          onBack={() => setActiveView("menu")}
        />
      )}

      {activeView === "riwayat" && (
        <ProfilRiwayatTable
          screenings={screenings}
          onBack={() => setActiveView("menu")}
        />
      )}

      {activeView === "syarat" && (
        <ProfilSyaratKetentuan onBack={() => setActiveView("menu")} />
      )}

      {activeView === "privasi" && (
        <ProfilKebijakanPrivasi onBack={() => setActiveView("menu")} />
      )}

      {activeView === "bantuan" && (
        <ProfilBantuan onBack={() => setActiveView("menu")} />
      )}

      <ProfilLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

ProfilIndex.layout = (page: React.ReactNode) => <RasihMaternalLayout activeNav="profil">{page}</RasihMaternalLayout>;
