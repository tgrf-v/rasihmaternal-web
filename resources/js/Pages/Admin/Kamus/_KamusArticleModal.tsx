import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/Components/ui/drawer";
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

    if (!form.data.content || form.data.content.trim() === "" || form.data.content === "<p></p>") {
      form.setError("content", "Isi lengkap artikel medis wajib diisi");
      return;
    }

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
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      swipeDirection="right"
    >
      <DrawerContent>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header Drawer */}
          <DrawerHeader className="pb-3 border-b border-slate-100">
            <DrawerTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {editingArticle ? "Edit Artikel Istilah Medis" : "Tambah Artikel Istilah Medis"}
            </DrawerTitle>
            <DrawerDescription className="text-xs text-slate-500 mt-0.5">
              Lengkapi metadata dan susun konten artikel komplikasi klinis
            </DrawerDescription>
          </DrawerHeader>

          {/* Body Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Baris Metadata: Judul Istilah & Kategori Medis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="article_title" className="text-xs font-bold text-slate-700">
                  Judul Istilah / Komplikasi <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="article_title"
                  type="text"
                  placeholder="Contoh: Preeklamsia Berat"
                  value={form.data.title}
                  onChange={(e) => form.setData("title", e.target.value)}
                  className="mt-1"
                  required
                />
                {form.errors.title && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{form.errors.title}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="article_category" className="text-xs font-bold text-slate-700">
                  Kategori Medis <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="article_category"
                  type="text"
                  placeholder="Contoh: Komplikasi Kehamilan / Persalinan"
                  value={form.data.category}
                  onChange={(e) => form.setData("category", e.target.value)}
                  className="mt-1"
                  required
                />
                {form.errors.category && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{form.errors.category}</p>
                )}
              </div>
            </div>

            {/* Editor RichText */}
            <div className="space-y-1.5 flex flex-col flex-1">
              <Label className="text-xs font-bold text-slate-700">
                Isi Lengkap Artikel Medis <span className="text-rose-500">*</span>
              </Label>
              <RichTextEditor
                content={form.data.content}
                onChange={(html) => form.setData("content", html)}
                placeholder="Tuliskan penjelasan medis, tanda bahaya, serta tindakan pertolongan pertama di sini..."
                className="flex-1 min-h-[320px]"
              />
              {form.errors.content && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{form.errors.content}</p>
              )}
            </div>
          </div>

          {/* Footer Drawer */}
          <DrawerFooter className="pt-3 border-t border-slate-100 flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onClose}
              className="rounded-full text-xs font-bold px-5"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              size="default"
              isLoading={form.processing}
              className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 gap-1.5 shadow-soft-sm"
            >
              {editingArticle ? (
                <>
                  <Pencil className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Tambahkan Artikel</span>
                </>
              )}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
