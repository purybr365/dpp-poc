"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface PhotoLightboxProps {
  photos: string[];
}

export function PhotoLightbox({ photos }: PhotoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const close = useCallback(() => setOpen(false), []);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1));
  }, [photos.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1));
  }, [photos.length]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, close, prev, next]);

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {photos.map((photo, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setCurrent(i);
              setOpen(true);
            }}
            className="aspect-square rounded-lg overflow-hidden bg-slate-100 relative cursor-pointer
                       ring-0 hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src={photo}
              alt={`Foto ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={close}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light z-10 cursor-pointer"
            aria-label="Fechar"
          >
            ✕
          </button>

          {/* Counter */}
          <span className="absolute top-4 left-4 text-white/70 text-sm">
            {current + 1} / {photos.length}
          </span>

          {/* Prev Arrow */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl font-light cursor-pointer z-10"
              aria-label="Foto anterior"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-[90vw] h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[current]}
              alt={`Foto ${current + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next Arrow */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl font-light cursor-pointer z-10"
              aria-label="Próxima foto"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
