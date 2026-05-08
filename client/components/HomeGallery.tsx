import { useQuery } from "@tanstack/react-query";
import { fetchGalleries } from "@/lib/api-client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, X, Maximize2 } from "lucide-react";
import { Gallery, GalleryImage } from "@shared/api";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function AutoCarousel({ images }: { images: GalleryImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Auto-scroll every 4 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100 group/carousel">
      {images.map((image, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <img
            src={image.url}
            alt={image.caption || ""}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Manual Controls */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 bg-black/30 hover:bg-black/60 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 bg-black/30 hover:bg-black/60 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-1 h-1 rounded-full transition-all",
              idx === currentIndex ? "bg-white w-3" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryPopup({ gallery, isOpen, onClose }: { gallery: Gallery; isOpen: boolean; onClose: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl h-[85vh] p-0 overflow-hidden bg-black border-none rounded-2xl shadow-2xl flex flex-col">
        <div className="relative flex-1 bg-black/40 flex items-center justify-center p-4">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Large Image View */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={gallery.images[activeIndex]?.url} 
              className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-500"
              alt={gallery.images[activeIndex]?.caption || ""}
            />
            
            {/* Caption Overlay */}
            {gallery.images[activeIndex]?.caption && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white text-sm font-medium shadow-2xl">
                {gallery.images[activeIndex].caption}
              </div>
            )}

            {/* Navigation */}
            {gallery.images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveIndex(prev => prev === 0 ? gallery.images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-primary hover:text-black rounded-full text-white transition-all backdrop-blur-md border border-white/10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setActiveIndex(prev => (prev + 1) % gallery.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-primary hover:text-black rounded-full text-white transition-all backdrop-blur-md border border-white/10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnails Strip */}
        <div className="h-24 md:h-32 bg-white/5 border-t border-white/10 p-4 flex gap-3 overflow-x-auto scrollbar-hide">
          {gallery.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-full aspect-video rounded-lg overflow-hidden border-2 transition-all shrink-0",
                idx === activeIndex ? "border-primary scale-105 shadow-lg shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"
              )}
            >
              <img src={img.url} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HomeGallery({ isSidebar = false }: { isSidebar?: boolean }) {
  const { data: galleries, isLoading } = useQuery({
    queryKey: ["galleries"],
    queryFn: fetchGalleries,
  });

  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);

  if (isLoading || !galleries) {
    return null;
  }

  const activeGalleries = galleries.filter(g => g.active);

  if (activeGalleries.length === 0) return null;

  return (
    <section className={cn("mb-20", isSidebar && "mb-12")}>
      <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E30000] rounded flex items-center justify-center shadow-lg shadow-red-500/20">
            <ImageIcon className="text-white w-6 h-6" />
          </div>
          <h2 className={cn("text-3xl font-black text-black uppercase tracking-tighter", isSidebar && "text-xl")}>
            Photo Gallary
          </h2>
        </div>
      </div>

      <div className={cn(
        "grid gap-6",
        isSidebar ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
      )}>
        {activeGalleries.slice(0, isSidebar ? 3 : 8).map((gallery) => (
          <div 
            key={gallery.id}
            onClick={() => setSelectedGallery(gallery)}
            className="group cursor-pointer"
          >
            <div className="aspect-video relative overflow-hidden rounded-xl shadow-md border border-gray-100 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
              <AutoCarousel images={gallery.images} />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 transition-opacity flex flex-col justify-end p-4 z-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-sm font-black uppercase tracking-tight line-clamp-1">
                    {gallery.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-white/60 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  {gallery.images.length} Photos
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGallery && (
        <GalleryPopup 
          gallery={selectedGallery} 
          isOpen={!!selectedGallery} 
          onClose={() => setSelectedGallery(null)} 
        />
      )}
    </section>
  );
}
