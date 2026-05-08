import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Gallery } from "@shared/api";

interface CellebClicksProps {
  gallery: Gallery;
}

export default function CellebClicks({ gallery }: CellebClicksProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = gallery.images;

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="border-t-2 border-black pt-6 border-b-2 pb-6">
      <h3 className="text-lg font-bold text-black mb-1 uppercase tracking-widest">
        CELLEB CLICKS
      </h3>
      <p className="text-xs text-gray-600 mb-4 italic">
        {gallery.title} - {gallery.description || "Slide for more"}
      </p>

      {/* Gallery Slider */}
      <div className="relative">
        {/* Main Image */}
        <div className="mb-4 overflow-hidden bg-gray-200">
          <img
            src={galleryImages[currentImageIndex]?.url}
            alt={galleryImages[currentImageIndex]?.caption || "Celebrity Gallery"}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            className="p-2 bg-black text-white hover:bg-gray-800 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Indicators */}
          <div className="flex gap-2">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentImageIndex ? "bg-black" : "bg-gray-400"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 bg-black text-white hover:bg-gray-800 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Image Counter */}
        <div className="text-center text-xs text-gray-600">
          {currentImageIndex + 1} of {galleryImages.length}
        </div>
      </div>
    </div>
  );
}
