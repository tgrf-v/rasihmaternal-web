import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { RichTextEditor } from "@/Components/ui/rich-text-editor";
import { Plus, Pencil } from "lucide-react";
import { AdminArticle, ArticleFormData } from "./types";

interface KamusArticleModalProps {
  isOpen: boolean;
  editingArticle: AdminArticle | null;
  onClose: () => void;
}

export function KamusArticleModal({
  isOpen,
  editingArticle,
  onClose,
}: KamusArticleModalProps) {
  const form = useForm<ArticleFormData>({
    type: "article",
    title: "",
    category: "",
    letter: "",
    content: "",
    summary: "",
    first_aid: "",
    is_published: true,
  });

  useEffect(() => {
    if (editingArticle) {
      let initialContent = editingArticle.content || "";
      if (!initialContent && (editingArticle.summary || editingArticle.first_aid)) {
        initialContent = `<h2>Pengertian &amp; Gejala Medis</h2><p>${editingArticle.summary || ""}</p><h2>Pertolongan Pertama Mandiri</h2><p>${editingArticle.first_aid || ""}</p>`;
      }

      form.setData({
        type: "article",
        title: editingArticle.title,
        category: editingArticle.category,
        letter: editingArticle.letter || editingArticle.title.trim().charAt(0).toUpperCase(),
        content: initialContent,
        summary: editingArticle.summary || "",
        first_aid: editingArticle.first_aid || "",
        is_published: editingArticle.is_published,
      });
      form.clearErrors();
    } else if (isOpen) {
      form.reset();
      form.setData({
        type: "article",
        title: "",
        category: "",
        letter: "",
        content: "",
        summary: "",
        first_aid: "",
        is_published: true,
      });
      form.clearErrors();
    }
  }, [editingArticle, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const computedLetter = form.data.title.trim().charAt(0).toUpperCase() || "A";
    form.transform((data) => ({
      ...data,
      letter: computedLetter,
    }));

    if (editingArticle) {
      form.put(`/admin/kamus/${editingArticle.id}`, {
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
      title={editingArticle ? "Edit Artikel Kamus" : "Tambah Artikel Kamus Baru"}
      description="Kelola istilah kebidanan, gejala klinis, dan pertolongan pertama"
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Field 1: Judul Istilah */}
        <div>
          <Label htmlFor="art_title" className="text-xs font-bold text-slate-700">
            Nama Istilah / Komplikasi <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="art_title"
            type="text"
            placeholder="Contoh: Preeklamsia Berat"
            value={form.data.title}
            onChange={(e) => form.setData("title", e.target.value)}
            className="mt-1"
            required
          />
          {form.errors.title && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.title}</p>
          )}
        </div>

        {/* Field 2: Kategori Medis */}
        <div>
          <Label htmlFor="art_category" className="text-xs font-bold text-slate-700">
            Kategori Medis <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="art_category"
            type="text"
            placeholder="Contoh: Komplikasi Kehamilan / Persalinan"
            value={form.data.category}
            onChange={(e) => form.setData("category", e.target.value)}
            className="mt-1"
            required
          />
          {form.errors.category && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.category}</p>
          )}
        </div>

        {/* Field 3: Isi Konten Artikel */}
        <div>
          <Label className="text-xs font-bold text-slate-700 block mb-1">
            Isi Lengkap Artikel &amp; Panduan Medis <span className="text-rose-500">*</span>
          </Label>
          <RichTextEditor
            content={form.data.content}
            onChange={(html) => form.setData("content", html)}
            placeholder="Tuliskan penjelasan medis, penyebab, tanda bahaya, serta tindakan pertolongan pertama di sini..."
          />
          {form.errors.content && (
            <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.content}</p>
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
            {editingArticle ? (
              <>
                <Pencil className="h-4 w-4" />
                <span>Simpan Perubahan</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Simpan Artikel</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
