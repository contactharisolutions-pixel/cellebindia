import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { SubscribeDialog } from "@/components/SubscribeDialog";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api-client";

const LOGO_URL = "/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: dbCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Map DB categories to navigation format
  const dynamicCategories = dbCategories?.map(cat => ({
    label: cat.name,
    href: cat.slug === 'latest' ? '/' : `/category/${cat.slug}`
  })) || [];

  // Default fallback if no categories are loaded yet
  const defaultCategories = [
    { label: "Latest", href: "/latest" },
    { label: "Bollywood", href: "/category/bollywood" },
    { label: "PAN India", href: "/category/pan-india" },
    { label: "Streaming", href: "/category/streaming" },
    { label: "Box Office", href: "/category/box-office" },
    { label: "Hollywood", href: "/category/hollywood" },
    { label: "Movie Review", href: "/category/movie-review" },
    { label: "Trailer Review", href: "/category/trailer-review" },
    { label: "TV Serial", href: "/category/tv-serial" },
  ];

  const displayOrder = [
    "Latest",
    "Bollywood",
    "PAN India",
    "Streaming",
    "Box Office",
    "Hollywood",
    "Movie Review",
    "Trailer Review",
    "TV Serial"
  ];

  const categories = dynamicCategories.length > 0 
    ? displayOrder
        .map(label => {
          if (label === "Latest") return { label: "Latest", href: "/latest" };
          return dynamicCategories.find(c => c.label.toLowerCase() === label.toLowerCase());
        })
        .filter(Boolean) as { label: string; href: string }[]
    : defaultCategories;

  return (
    <>
      {/* Top Category Menu */}
      <nav className="hidden lg:block bg-white border-b border-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex justify-center gap-12 py-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <li key={cat.label} className="whitespace-nowrap">
                <Link
                  to={cat.href}
                  className="text-xs font-bold text-black hover:text-primary transition-colors tracking-wide"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-24 md:h-32">
            {/* Left Section - Mobile Menu & Search */}
            <div className="flex items-center gap-4 w-1/4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-primary transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Center Section - Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex items-center h-full hover:opacity-80 transition-opacity">
                <img
                  src={LOGO_URL}
                  alt="CELLEB - The Sparkling World of Stars"
                  className="h-20 md:h-24 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right Section - Subscribe */}
            <div className="flex items-center justify-end w-1/4">
              <SubscribeDialog />
            </div>
          </div>

          {/* Search Box */}
          {isSearchOpen && (
            <div className="border-t border-white py-4 px-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-1 bg-white border border-white px-4 py-2 text-sm focus:outline-none"
                />
                <button className="bg-primary text-black px-6 py-2 text-sm font-bold hover:bg-yellow-400 transition-colors">
                  Go
                </button>
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden border-t border-white py-4">
              <ul className="space-y-3">
                {categories.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="block text-sm text-white hover:text-primary transition-colors px-6 py-2 font-bold"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

