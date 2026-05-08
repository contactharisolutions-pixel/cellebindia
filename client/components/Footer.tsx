import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-light-100 border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo Column */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="mb-4 hover:opacity-80 transition-opacity">
              <img
                src="/logo.png"
                alt="CELLEB - The Sparkling World of Stars"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs font-bold text-black hover:text-primary transition-colors mt-4"
            >
              ↑ Back to Top
            </button>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-bold text-black mb-4 text-sm">About</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/advertise" onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-primary transition-colors text-sm">
                  Advertise
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-bold text-black mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-service" onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies-policy" onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-primary transition-colors text-sm">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="font-bold text-black mb-4 text-sm">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.instagram.com/cellebindia" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://x.com/CellebIndia" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@cellebindia" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-8 text-center">
          <p className="text-xs text-gray-600">
            © 2026 CELLEB - The Sparkling World of Stars. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
