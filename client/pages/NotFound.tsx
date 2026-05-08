import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-light-50">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-black mb-4">
              404
            </h1>
            <p className="text-2xl font-serif font-bold text-black mb-2">
              Page Not Found
            </p>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
            >
              Return to Home
            </Link>
            <p className="text-xs text-gray-600">
              Need help? Browse our categories or contact us
            </p>
          </div>

          {/* Quick navigation */}
          <div className="mt-12 pt-8 border-t border-black">
            <p className="text-sm font-bold text-black mb-4">
              Popular sections:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Film",
                "Box Office",
                "Streaming",
                "Features",
                "Music",
              ].map((cat) => (
                <a
                  key={cat}
                  href="/"
                  className="px-3 py-1 text-xs border border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="inline-block mb-3 hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="CELLEB - The Sparkling World of Stars"
              className="h-12 w-auto object-contain mx-auto"
            />
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="block text-xs font-bold text-black hover:text-primary transition-colors mb-3 mx-auto"
          >
            ↑ Back to Top
          </button>
          <p className="text-sm text-gray-600">© 2026 CELLEB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
