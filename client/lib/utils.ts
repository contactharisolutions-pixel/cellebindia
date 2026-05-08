import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(amount: number | string) {
  return new Intl.NumberFormat('en-IN').format(Number(amount));
}

export function formatCurrency(amount: number | string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatDate(date: string | Date | number) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatTime(date: string | Date | number) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function formatDateTime(date: string | Date | number) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function parseEmbeds(html: string | undefined): string {
  if (!html) return "";
  let processed = html;

  // 1. YouTube
  const ytRegex = /(?:<p>)?[\s\n]*(?:<a[^>]*>)?[\s\n]*(?<!["'=])(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?][^\s<"']*)?[\s\n]*(?:<\/a>)?[\s\n]*(?:<\/p>)?/gi;
  processed = processed.replace(ytRegex, '<div class="my-6 aspect-video w-full"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');

  // 2. Instagram
  const igRegex = /(?:<p>)?[\s\n]*(?:<a[^>]*>)?[\s\n]*(?<!["'=])(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|stories\/[^\/]+)\/([a-zA-Z0-9_-]+)\/?(?:[&?][^\s<"']*)?[\s\n]*(?:<\/a>)?[\s\n]*(?:<\/p>)?/gi;
  processed = processed.replace(igRegex, '<div class="my-6 flex justify-center w-full"><iframe src="https://www.instagram.com/p/$1/embed" width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>');

  // 3. Direct Images
  const imgRegex = /(?:<p>)?[\s\n]*(?:<a[^>]*>)?[\s\n]*(?<!["'=])(https?:\/\/[^\s<"']+?\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s<"']*)?)[\s\n]*(?:<\/a>)?[\s\n]*(?:<\/p>)?/gi;
  processed = processed.replace(imgRegex, '<figure class="my-6"><img src="$1" class="w-full h-auto object-cover border border-gray-200 rounded-lg shadow-sm" alt="Embedded Image" /></figure>');

  return processed;
}
