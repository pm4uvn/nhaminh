"use client";

import { Fragment } from "react";
import { splitWithGlossary } from "@/lib/glossary";
import { useGlossaryUi } from "@/lib/glossary-store";

/**
 * Hiển thị một đoạn văn bản, tự động gạch chân những từ chuyên ngành xây dựng
 * có trong từ điển — chạm vào để xem giải nghĩa.
 */
export function TermText({ text }: { text: string }) {
  const openTerm = useGlossaryUi((s) => s.openTerm);
  const segments = splitWithGlossary(text);

  return (
    <>
      {segments.map((seg, i) =>
        seg.termId ? (
          <span
            key={i}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              openTerm(seg.termId!);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                e.preventDefault();
                openTerm(seg.termId!);
              }
            }}
            className="underline decoration-dotted decoration-primary/50 underline-offset-2 text-primary-dark cursor-help"
          >
            {seg.text}
          </span>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        )
      )}
    </>
  );
}
