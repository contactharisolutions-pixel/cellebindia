import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-light-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b-2 border-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-700">
            Get in touch with the CELLEB team
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Methods */}
          <div className="lg:col-span-1">
            {/* General Inquiries Box */}
            <div className="bg-white border-2 border-black p-8 mb-8">
              <h2 className="text-2xl font-serif font-bold text-black mb-4 flex items-center gap-2">
                <Mail size={24} />
                General Inquiries
              </h2>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                We are always open to hearing about your website experience, queries, suggestions, and feedback.
              </p>
              <a
                href="mailto:managingeditor@cellebindia.com"
                className="inline-block px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors text-sm"
              >
                managingeditor@cellebindia.com
              </a>
            </div>

            {/* Grievance Redressal Box */}
            <div className="bg-white border-2 border-black p-8">
              <h2 className="text-2xl font-serif font-bold text-black mb-4 flex items-center gap-2">
                <MapPin size={24} />
                Grievance Redressal
              </h2>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                For complaints, concerns, or grievances related to content, data privacy, or services
              </p>
              <a
                href="mailto:grievance@cellebindia.com?subject=Grievance%20-%20"
                className="inline-block px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors text-sm mb-4"
              >
                grievance@cellebindia.com
              </a>
              <p className="text-xs text-gray-600 italic">
                Response: Within 24 hours acknowledgment, 30 days resolution
              </p>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            {/* General Inquiries Section */}
            <section className="mb-12 pb-12 border-b-2 border-black">
              <h2 className="text-3xl font-serif font-bold text-black mb-6">
                General Inquiries
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed mb-6">
                At CELLEB India, we are always open to hearing about your website experience, queries, suggestions, and feedback.
              </p>
              <div className="bg-light-100 border-l-4 border-primary p-6">
                <p className="text-sm font-mono text-gray-800">
                  <strong>Email:</strong> managingeditor@cellebindia.com
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  We typically respond to general inquiries within 2-3 business days.
                </p>
              </div>
            </section>

            {/* Office Address Section */}
            <section className="mb-12 pb-12 border-b-2 border-black">
              <h2 className="text-3xl font-serif font-bold text-black mb-6">
                Our Office
              </h2>
              <div className="bg-white border-2 border-black p-8">
                <div className="flex items-start gap-4">
                  <MapPin size={32} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                      Address
                    </p>
                    <p className="text-lg text-gray-800 leading-relaxed font-serif">
                      3rd Floor, A-5, Grovy Optiva, Block A,<br />
                      Sector 68, Noida, Basi Bahuddin Nagar,<br />
                      Uttar Pradesh 201316
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Social Media Section */}
            <section className="mb-12 pb-12 border-b-2 border-black">
              <h2 className="text-3xl font-serif font-bold text-black mb-8">
                Social Media
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed mb-8">
                Drop us a quick word on our social media handles. We're active and responsive across all platforms.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/181AT6hef1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-black p-6 hover:bg-light-100 transition-colors text-center"
                >
                  <div className="text-2xl font-serif font-bold text-primary mb-2">f</div>
                  <h3 className="text-lg font-bold text-black mb-2">Facebook</h3>
                  <p className="text-sm text-gray-700">@CellebIndia</p>
                </a>

                {/* Twitter/X */}
                <a
                  href="https://x.com/CellebIndia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-black p-6 hover:bg-light-100 transition-colors text-center"
                >
                  <div className="text-2xl font-serif font-bold text-primary mb-2">𝕏</div>
                  <h3 className="text-lg font-bold text-black mb-2">X (Twitter)</h3>
                  <p className="text-sm text-gray-700">@CellebIndia</p>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/cellebindia?utm_source=qr&igsh=MXhua2JtNmowdnNmeQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-black p-6 hover:bg-light-100 transition-colors text-center"
                >
                  <div className="text-2xl font-serif font-bold text-primary mb-2">📷</div>
                  <h3 className="text-lg font-bold text-black mb-2">Instagram</h3>
                  <p className="text-sm text-gray-700">@CellebIndia</p>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@cellebindia?si=rbyUsBRl6fMTQZ7y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-black p-6 hover:bg-light-100 transition-colors text-center"
                >
                  <div className="text-2xl font-serif font-bold text-primary mb-2">▶️</div>
                  <h3 className="text-lg font-bold text-black mb-2">YouTube</h3>
                  <p className="text-sm text-gray-700">@CellebIndia</p>
                </a>
              </div>
            </section>

            {/* Grievance Redressal Section */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-black mb-8">
                Grievance Redressal
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed mb-8">
                For any complaints, concerns, or grievances related to content, data privacy, or services, please contact our Grievance Officer.
              </p>

              <div className="bg-white border-2 border-black p-8">
                <h3 className="text-xl font-bold text-black mb-6">Grievance Officer Contact</h3>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="pb-6 border-b border-gray-300">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Email
                    </p>
                    <a
                      href="mailto:grievance@cellebindia.com?subject=Grievance%20-%20"
                      className="text-lg font-mono text-primary hover:underline"
                    >
                      grievance@cellebindia.com
                    </a>
                  </div>

                  {/* Subject Line */}
                  <div className="pb-6 border-b border-gray-300">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Subject Line
                    </p>
                    <p className="text-gray-800">
                      Please mention <strong>"Grievance – [Your Issue]"</strong> for faster resolution
                    </p>
                  </div>

                  {/* Response Time */}
                  <div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Response Time
                    </p>
                    <p className="text-gray-800 leading-relaxed">
                      We endeavor to <strong>acknowledge within 24 hours</strong> and <strong>resolve within 30 days</strong>, as per applicable law.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-light-100 border-l-4 border-primary p-6 mt-8">
                <p className="text-sm text-gray-800">
                  <strong>Note:</strong> All grievances will be handled with utmost confidentiality and in accordance with our Privacy Policy and applicable regulations.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-16 pt-16 border-t-2 border-black">
          <div className="bg-white border-2 border-black p-8 text-center">
            <h2 className="text-2xl font-serif font-bold text-black mb-4">
              Need Something Else?
            </h2>
            <p className="text-lg text-gray-800 mb-6 leading-relaxed max-w-2xl mx-auto">
              Browse our latest news, explore different entertainment categories, or learn more about CELLEB India.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
              >
                Back to Home
              </Link>
              <Link
                to="/advertise"
                className="inline-block px-8 py-3 border-2 border-black text-black font-bold hover:bg-light-100 transition-colors"
              >
                Advertise With Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
