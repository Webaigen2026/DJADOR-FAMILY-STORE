"use client";

import { useEffect, useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);

  const currentImage = images[index];

  function goNext() {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  function goPrev() {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  return (
    <div className="relative">
      <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img
          src={currentImage}
          alt={name}
            className="h-full w-full object-contain p-4"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-bold shadow-lg hover:bg-white"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-bold shadow-lg hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => setIndex(dotIndex)}
              className={`h-2 rounded-full transition-all ${
                index === dotIndex ? "w-8 bg-slate-900" : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-center text-sm text-slate-500">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}