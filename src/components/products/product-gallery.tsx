"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);

  const safeImages =
    images.length > 0 ? images : ["/images/product-placeholder.png"];

  const currentImage = safeImages[index];

  function goNext() {
    setIndex((prev) =>
      prev === safeImages.length - 1 ? 0 : prev + 1
    );
  }

  function goPrev() {
    setIndex((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    );
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [safeImages.length]);

  return (
    <section className="h-fit rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="relative flex h-[340px] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-slate-50 via-white to-slate-100 sm:h-[440px] lg:h-[520px]">
        <img
          src={currentImage}
          alt={`${name} image ${index + 1}`}
          className="h-full w-full object-contain p-6 transition duration-300 sm:p-8"
        />

        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="View previous product image"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-800 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white sm:left-5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="View next product image"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-800 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white sm:right-5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {safeImages.length > 1 ? (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((image, imageIndex) => (
            <button
              key={`${image}-${imageIndex}`}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`View product image ${imageIndex + 1}`}
              className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 transition ${
                index === imageIndex
                  ? "border-slate-950 ring-2 ring-slate-950/10"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img
                src={image}
                alt={`${name} thumbnail ${imageIndex + 1}`}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
        <span>
          {safeImages.length === 1
            ? "Product image"
            : `${safeImages.length} product images`}
        </span>

        <span>
          {index + 1} / {safeImages.length}
        </span>
      </div>
    </section>
  );
}