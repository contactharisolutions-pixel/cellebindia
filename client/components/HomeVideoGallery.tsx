import { useQuery } from "@tanstack/react-query";
import { fetchVideoGallery } from "@/lib/api-client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Video as VideoIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Helper to get YouTube Video ID and Thumbnail
const getYoutubeInfo = (url: string) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  let videoId: string | null = null;
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }
  
  if (videoId) {
    return {
      videoId,
      // Use hqdefault as it's always available; maxresdefault may 404
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`
    };
  }
  return null;
};

function VideoPopup({ videoUrl, isOpen, onClose }: { videoUrl: string; isOpen: boolean; onClose: () => void }) {
  const ytInfo = getYoutubeInfo(videoUrl);
  const embedUrl = ytInfo ? ytInfo.embedUrl : videoUrl;

  if (!embedUrl) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg p-8 text-center">
          <DialogTitle>Video not available</DialogTitle>
          <p className="text-slate-500 mt-2">No video URL has been set for this video. Please update it in the admin panel.</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl aspect-video p-0 overflow-hidden bg-black border-none rounded-xl shadow-2xl">
        <DialogTitle className="sr-only">Video Playback</DialogTitle>
        <iframe
          src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </DialogContent>
    </Dialog>
  );
}

export default function HomeVideoGallery({ isSidebar = false }: { isSidebar?: boolean }) {
  const { data: gallery, isLoading } = useQuery({
    queryKey: ["video-gallery"],
    queryFn: fetchVideoGallery,
  });

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (!gallery || gallery.videos.length <= (isSidebar ? 1 : 4)) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [gallery, isSidebar]);

  if (isLoading || !gallery || gallery.videos.length === 0) {
    return null;
  }

  // Sort by updatedAt descending
  const sortedVideos = [...gallery.videos].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <section className={cn("mb-20", isSidebar && "mb-12")}>
      <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E30000] rounded flex items-center justify-center shadow-lg shadow-red-500/20">
            <VideoIcon className="text-white w-6 h-6" />
          </div>
          <h2 className={cn("text-3xl font-black text-black uppercase tracking-tighter", isSidebar && "text-xl")}>
            {gallery.title || "Video Gallery"}
          </h2>
        </div>
        {!isSidebar && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 border-black hover:bg-black hover:text-white transition-all shadow-sm"
              onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 border-black hover:bg-black hover:text-white transition-all shadow-sm"
              onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className={cn(
          "flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x pb-4",
          isSidebar && "flex-col overflow-x-visible"
        )}
      >
        {sortedVideos.slice(0, isSidebar ? 4 : undefined).map((video) => {
          const ytInfo = getYoutubeInfo(video.videoUrl);
          const thumb = video.thumbnailUrl || ytInfo?.thumbnail;

          return (
            <button 
              key={video.id}
              className={cn(
                "flex-shrink-0 group cursor-pointer snap-start text-left block border-none p-0 bg-transparent",
                isSidebar ? "w-full" : "w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]"
              )}
              onClick={() => {
                setSelectedVideoUrl(video.videoUrl);
              }}
            >
              <div className="aspect-video relative overflow-hidden rounded-xl shadow-md border border-gray-200 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 bg-slate-100">
                {thumb ? (
                  <img 
                    src={thumb} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={video.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <Play className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                
                {/* Dark overlay only on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center z-10">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center scale-90 group-hover:scale-110 transition-all shadow-xl border-2 border-white/30">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>

                {/* Title gradient always at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
                  <h3 className="text-white text-xs font-black uppercase tracking-tight line-clamp-2">
                    {video.title}
                  </h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedVideoUrl !== null && (
        <VideoPopup 
          videoUrl={selectedVideoUrl} 
          isOpen={true} 
          onClose={() => setSelectedVideoUrl(null)} 
        />
      )}
    </section>
  );
}
