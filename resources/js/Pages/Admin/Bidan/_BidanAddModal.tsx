import React from "react";
import { useForm } from "@inertiajs/react";
import { Dialog } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Plus } from "lucide-react";

interface BidanAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BidanAddModal({ isOpen, onClose }: BidanAddModalProps) {
  const form = useForm({
    name: "",
    email: "",
    password: "",
    no_telepon: "",
    no_str: "",
    puskesmas_wilayah: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(route("admin.bidan.store"), {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        form.reset();
      },
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Akun Bidan Baru"
      description="Registrasikan Nakes Bidan untuk wilayah binaan"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Field 1: Nama Lengkap */}
        <div>
          <Label htmlFor="create_name" className="text-xs font-bold text-slate-700">
            Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="create_name"
            type="text"
            placeholder="Contoh: Bidan Siti Rahayu, S.Tr.Keb"
            value={form.data.name}
            onChange={(e) => form.setData("name", e.target.value)}
            className="mt-1"
            required
          />
          {form.errors.name && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.name}</p>
          )}
        </div>

        {/* Field 2: Email Login */}
        <div>
          <Label htmlFor="create_email" className="text-xs font-bold text-slate-700">
            Alamat Email Akun <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="create_email"
            type="email"
            placeholder="bidan.siti@puskesmas.go.id"
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
            className="mt-1"
            required
          />
          {form.errors.email && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.email}</p>
          )}
        </div>

        {/* Field 3: Password Akun */}
        <div>
          <Label htmlFor="create_password" className="text-xs font-bold text-slate-700">
            Password Login <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="create_password"
            type="password"
            placeholder="Minimal 8 karakter"
            value={form.data.password}
            onChange={(e) => form.setData("password", e.target.value)}
            className="mt-1"
            required
          />
          {form.errors.password && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.password}</p>
          )}
        </div>

        {/* Field 4: No. STR Bidan */}
        <div>
          <Label htmlFor="create_str" className="text-xs font-bold text-slate-700">
            Nomor STR Bidan <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="create_str"
            type="text"
            placeholder="Contoh: STR-BDN-2026-0912"
            value={form.data.no_str}
            onChange={(e) => form.setData("no_str", e.target.value)}
            className="mt-1"
            required
          />
          {form.errors.no_str && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.no_str}</p>
          )}
        </div>

        {/* Field 5: Wilayah Puskesmas */}
        <div>
          <Label htmlFor="create_puskesmas" className="text-xs font-bold text-slate-700">
            Wilayah Penugasan Puskesmas <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="create_puskesmas"
            type="text"
            placeholder="Contoh: Puskesmas Kecamatan Cilandak"
            value={form.data.puskesmas_wilayah}
            onChange={(e) => form.setData("puskesmas_wilayah", e.target.value)}
            className="mt-1"
            required
          />
          {form.errors.puskesmas_wilayah && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">
              {form.errors.puskesmas_wilayah}
            </p>
          )}
        </div>

        {/* Field 6: No. WhatsApp / Telepon */}
        <div>
          <Label htmlFor="create_phone" className="text-xs font-bold text-slate-700">
            Nomor WhatsApp / Kontak
          </Label>
          <Input
            id="create_phone"
            type="tel"
            placeholder="Contoh: 081234567890"
            value={form.data.no_telepon}
            onChange={(e) => form.setData("no_telepon", e.target.value)}
            className="mt-1"
          />
          {form.errors.no_telepon && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">
              {form.errors.no_telepon}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            className="rounded-full font-bold text-xs"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="default"
            size="default"
            isLoading={form.processing}
            disabled={form.processing}
            className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-soft-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Simpan Akun Bidan</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
