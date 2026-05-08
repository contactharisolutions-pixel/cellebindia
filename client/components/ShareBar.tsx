import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareBarProps {
  url?: string;
  title: string;
  className?: string;
}

const platforms = [
  {
    name: "WhatsApp",
    color: "#25D366",
    hoverColor: "hover:bg-[#25D366]",
    borderColor: "border-[#25D366]",
    textColor: "text-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getShareUrl: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
  },
  {
    name: "Facebook",
    color: "#1877F2",
    hoverColor: "hover:bg-[#1877F2]",
    borderColor: "border-[#1877F2]",
    textColor: "text-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getShareUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X (Twitter)",
    color: "#000000",
    hoverColor: "hover:bg-black",
    borderColor: "border-black",
    textColor: "text-black",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getShareUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "Snapchat",
    color: "#FFFC00",
    hoverColor: "hover:bg-[#FFFC00]",
    borderColor: "border-[#FFFC00]",
    textColor: "text-[#FFFC00]",
    bgOnHover: "group-hover:text-black",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M12.166.006c.12-.008.241-.006.361-.006 1.762 0 3.56.696 4.854 1.944 1.197 1.154 1.896 2.73 1.992 4.374.025.439.02.88.014 1.313l-.004.359c.017.03.072.087.161.14.25.153.64.268 1.133.268.184 0 .369-.02.542-.06.088-.02.177-.03.264-.03.155 0 .294.034.416.097.27.14.44.403.44.69-.002.56-.44 1.032-1.07 1.207-.11.031-.224.056-.343.08-.498.1-1.12.226-1.487.766-.195.286-.231.637-.107 1.052.49 1.67 1.614 2.8 2.82 2.8.142 0 .284-.016.424-.048.124-.028.248-.042.37-.042.537 0 1.008.343 1.15.852.204.74-.385 1.458-1.498 1.756-.247.066-.504.112-.78.158-.517.09-1.104.19-1.621.52-.455.29-.742.668-.95 1.121-.249.545-.467 1.173-.666 1.76-.127.37-.294.617-.538.787-.237.166-.536.245-.883.245-.241 0-.502-.04-.798-.094-.454-.082-.959-.162-1.59-.162-.498 0-1.026.063-1.571.185-.654.148-1.245.22-1.812.22-.567 0-1.157-.072-1.812-.22-.545-.122-1.073-.185-1.571-.185-.631 0-1.136.08-1.591.162-.296.054-.557.094-.797.094-.347 0-.645-.079-.883-.245-.244-.17-.411-.417-.538-.787-.199-.587-.417-1.215-.665-1.76-.21-.453-.496-.83-.95-1.121-.518-.33-1.105-.43-1.622-.52-.276-.046-.532-.092-.78-.158-1.113-.298-1.702-1.016-1.498-1.756.142-.509.613-.852 1.15-.852.122 0 .246.014.37.042.14.032.282.048.424.048 1.206 0 2.33-1.13 2.82-2.8.124-.415.088-.766-.107-1.052-.367-.54-.99-.665-1.487-.766-.119-.024-.234-.049-.343-.08-.63-.175-1.068-.647-1.07-1.207 0-.287.17-.55.44-.69.122-.063.261-.097.416-.097.087 0 .176.01.264.03.173.04.358.06.542.06.498 0 .887-.115 1.134-.268.099-.06.15-.117.163-.145l-.003-.338c-.007-.434-.013-.876.013-1.315.09-1.656.789-3.226 1.984-4.38C8.616.708 10.394.006 12.166.006z" />
      </svg>
    ),
    getShareUrl: (url: string) =>
      `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`,
  },
  {
    name: "Instagram",
    color: "#E1306C",
    hoverColor: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737]",
    borderColor: "border-[#E1306C]",
    textColor: "text-[#E1306C]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    getShareUrl: (url: string) =>
      // Instagram doesn't support web share API, open profile as fallback
      `https://www.instagram.com/`,
    note: "Copy the link and share it on Instagram",
  },
];

export default function ShareBar({ url, title, className }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleShare = (platform: typeof platforms[0]) => {
    const shareLink = platform.getShareUrl(shareUrl, title);
    window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={cn("flex flex-row items-center gap-4 py-2 px-4 bg-white border border-gray-100 rounded-xl", className)}>
      <div className="flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-[0.2em] whitespace-nowrap opacity-80">
        <Share2 className="w-3.5 h-3.5" />
        Share
      </div>

      <div className="h-6 w-[1px] bg-gray-200 mx-1" />

      <div className="flex items-center gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            title={`Share on ${platform.name}${platform.note ? " – " + platform.note : ""}`}
            className={cn(
              "group flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200",
              "bg-white",
              platform.borderColor,
              platform.textColor,
              "hover:text-white hover:border-transparent hover:shadow-lg hover:scale-110 active:scale-90",
            )}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = platform.color;
              (e.currentTarget as HTMLButtonElement).style.borderColor = platform.color;
              (e.currentTarget as HTMLButtonElement).style.color = platform.name === "Snapchat" ? "#000" : "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "";
              (e.currentTarget as HTMLButtonElement).style.color = "";
            }}
          >
            {platform.icon}
          </button>
        ))}

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          title="Copy link"
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200",
            copied
              ? "bg-green-500 border-green-500 text-white scale-110"
              : "bg-white border-gray-400 text-gray-600 hover:bg-gray-100 hover:border-gray-600 hover:scale-110"
          )}
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
