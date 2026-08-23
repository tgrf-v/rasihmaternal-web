import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { AdminVideo, VideoFormData } from "./types";

interface KamusVideoModalProps {
  isOpen: boolean;
  editingVideo: AdminVideo | null;
  onClose: () => void;
}

export function KamusVideoModal({
  isOpen,
  editingVideo,
  onClose,
}: KamusVideoModalProps) {
  const form = useForm<VideoFormData>({
    type: "video",
    title: "",
    category: "",
    video_badge: "TERAPI FISIK",
    instructor: "",
    youtube_id: "",
    duration: "",
    description: "",
    is_published: true,
  });

  useEffect(() => {
    if (editingVideo) {
      form.setData({
        type: "video",
        title: editingVideo.title,
        category: editingVideo.category,
        video_badge: editingVideo.video_badge,
        instructor: editingVideo.instructor,
        youtube_id: editingVideo.youtube_id,
        duration: editingVideo.duration,
        description: editingVideo.description,
        is_published: editingVideo.is_published,
      });
      form.clearErrors();
    } else if (isOpen) {
      form.reset();
      form.setData({
        type: "video",
        title: "",
        category: "",
        video_badge: "TERAPI FISIK",
        instructor: "",
        youtube_id: "",
        duration: "",
        description: "",
        is_published: true,
      });
      form.clearErrors();
    }
  }, [editingVideo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      form.put(`/admin/kamus/${editingVideo.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      form.post("/admin/kamus", {
        preserveScroll: true,
        onSuccess: () => {
          onClose();
          form.reset();
        },
      });
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingVideo ? "Edit Video Terapi" : "Tambah Video Terapi Baru"}
      description="Tambahkan video edukasi terapi non-obat kebidanan"
      className="max-w-xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Field 1: Judul Video */}
        <div>
          <Label htmlFor="vid_title" className="text-xs font-bold text-slate-700">
            Judul Video Edukasi <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="vid_title"
            type="text"
            placeholder="Contoh: Terapi Rendam Air Hangat &amp; Garam Epsom"
            value={form.data.title}
            onChange={(e) => form.setData("title", e.target.value)}
            className="mt-1"
            required
          />
          {form.errors.title && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.title}</p>
          )}
        </div>

        {/* Field 2 & 3: Kategori & Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="vid_cat" className="text-xs font-bold text-slate-700">
              Kategori Terapi <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="vid_cat"
              type="text"
              placeholder="Contoh: Pijat Oksitosin"
              value={form.data.category}
              onChange={(e) => form.setData("category", e.target.value)}
              className="mt-1"
              required
            />
            {form.errors.category && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.category}</p>
            )}
          </div>
          <div>
            <Label htmlFor="vid_badge" className="text-xs font-bold text-slate-700">
              Badge Label <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="vid_badge"
              type="text"
              placeholder="TERAPI FISIK / RELAKSASI"
              value={form.data.video_badge}
              onChange={(e) => form.setData("video_badge", e.target.value)}
              className="mt-1"
              required
            />
            {form.errors.video_badge && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.video_badge}</p>
            )}
          </div>
        </div>

        {/* Field 4 & 5: YouTube ID & Durasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="vid_yt" className="text-xs font-bold text-slate-700">
              YouTube Video ID <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="vid_yt"
              type="text"
              placeholder="Contoh: dQw4w9WgXcQ"
              value={form.data.youtube_id}
              onChange={(e) => form.setData("youtube_id", e.target.value)}
              className="mt-1"
              required
            />
            {form.errors.youtube_id && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.youtube_id}</p>
            )}
          </div>
          <div>
            <Label htmlFor="vid_dur" className="text-xs font-bold text-slate-700">
              Durasi Video <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="vid_dur"
              type="text"
              placeholder="Contoh: 12:45"
              value={form.data.duration}
              onChange={(e) => form.setData("duration", e.target.value)}
              className="mt-1"
              required
            />
            {form.errors.duration && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.duration}</p>
            )}
          </div>
        </div>

        {/* Field 6: Instruktur / Pemateri */}
        <div>
          <Label htmlFor="vid_inst" className="text-xs font-bold text-slate-700">
            Instruktur / Pemateri
          </Label>
          <Input
            id="vid_inst"
            type="text"
            placeholder="Contoh: Bidan Anisa, S.Tr.Keb"
            value={form.data.instructor}
            onChange={(e) => form.setData("instructor", e.target.value)}
            className="mt-1"
          />
          {form.errors.instructor && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.instructor}</p>
          )}
        </div>

        {/* Field 7: Deskripsi Video */}
        <div>
          <Label htmlFor="vid_desc" className="text-xs font-bold text-slate-700">
            Deskripsi &amp; Manfaat Terapi <span className="text-rose-500">*</span>
          </Label>
          <Textarea
            id="vid_desc"
            placeholder="Jelaskan cara mempraktikkan terapi komplementer ini dengan benar..."
            value={form.data.description}
            onChange={(e) => form.setData("description", e.target.value)}
            rows={3}
            className="mt-1"
            required
          />
          {form.errors.description && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.description}</p>
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
            {editingVideo ? (
              <>
                <Pencil className="h-4 w-4" />
                <span>Simpan Perubahan</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Simpan Video</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
