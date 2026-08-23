import React from "react";
import { Button } from "@/Components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/Components/ui/drawer";
import { FileText } from "lucide-react";
import { ArticleItem } from "./types";

interface KamusArticleDrawerProps {
  article: ArticleItem | null;
  onClose: () => void;
}

export function KamusArticleDrawer({
  article,
  onClose,
}: KamusArticleDrawerProps) {
  return (
    <Drawer
      open={Boolean(article)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      modal={false}
      disablePointerDismissal
      swipeDirection="right"
    >
      <DrawerContent>
        {article && (
          <div className="flex flex-col h-full">
            {/* Header Drawer */}
            <DrawerHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {article.category}
                </span>
              </div>
              <DrawerTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-2">
                {article.title}
              </DrawerTitle>
            </DrawerHeader>

            {/* Body Drawer */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {article.content && article.content.trim() !== "" ? (
                <div
                  className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-3.5 [&_h2]:mb-1.5 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-2.5 [&_h3]:mb-1 [&_p]:my-1.5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-slate-600 [&_hr]:my-3 [&_hr]:border-slate-200"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Konten artikel belum ditambahkan.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Drawer */}
            <DrawerFooter className="pt-2 border-t border-slate-100 flex-row justify-end">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={onClose}
                className="rounded-full font-bold text-xs px-5"
              >
                Tutup
              </Button>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
