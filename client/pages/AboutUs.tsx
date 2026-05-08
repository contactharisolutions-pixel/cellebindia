import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, Youtube } from "lucide-react";

const FOUNDER_IMAGE = "https://cdn.builder.io/api/v1/image/assets%2Fad80fa7b05594e329001916c4b9a5f27%2F7c91fae52d0b4f4ca1b1ab9d057c0b71?format=webp&width=800&height=1200";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-light-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b-2 border-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-4">
            About CELLEB
          </h1>
          <p className="text-xl text-gray-700">
            The Sparkling World of Stars - Authentic Entertainment News
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Left Column - Founder Section */}
          <div className="lg:col-span-1 flex flex-col items-center">
            {/* Founder Photo */}
            <div className="w-full mb-8 border-2 border-black overflow-hidden">
              <img
                src={FOUNDER_IMAGE}
                alt="Ashwani Kumar, Founder & Entertainment Editor"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Founder Info */}
            <div className="text-center mb-6 border-b-2 border-black pb-6 w-full">
              <h2 className="text-2xl font-serif font-bold text-black mb-2">
                Ashwani Kumar
              </h2>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
                Founder & Entertainment Editor
              </p>
              <p className="text-xs text-gray-600 italic">
                24+ years of experience in Indian media
              </p>
            </div>

            {/* Experience Timeline */}
            <div className="w-full space-y-4 mb-8">
              <div className="text-sm">
                <p className="font-bold text-black mb-1">Zee News</p>
                <p className="text-xs text-gray-600">Group Entertainment Editor</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <p className="font-bold text-black mb-1">News Nation</p>
                <p className="text-xs text-gray-600">Entertainment Head</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <p className="font-bold text-black mb-1">Sahara Samay</p>
                <p className="text-xs text-gray-600">DOP – Programming and Award Shows</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <p className="font-bold text-black mb-1">News24 / E24</p>
                <p className="text-xs text-gray-600">Entertainment Editor / Editorial Head</p>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="w-full border-t-2 border-black pt-6">
              <p className="text-xs font-bold text-black uppercase tracking-widest mb-4">
                Connect With Us
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://www.instagram.com/borntobeashwani?igsh=MWRqZzluNTdmNWhncQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black text-white hover:bg-primary hover:text-black transition-colors rounded-full"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://x.com/BorntobeAshwani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black text-white hover:bg-primary hover:text-black transition-colors rounded-full"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://youtube.com/@cellebindia?si=tqrgBUlXR4s_4zP5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black text-white hover:bg-primary hover:text-black transition-colors rounded-full"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="mailto:managingeditor@cellebindia.com"
                  className="p-3 bg-black text-white hover:bg-primary hover:text-black transition-colors rounded-full"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - About Content */}
          <div className="lg:col-span-2">
            {/* Welcome Section */}
            <section className="mb-12 pb-8 border-b-2 border-black">
              <h2 className="text-3xl font-serif font-bold text-black mb-6">
                Welcome to CELLEB India
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed mb-4">
                Your trusted destination for authentic entertainment news, curated by the CELLEB Group and led by <strong>Ashwani Kumar</strong>, a veteran Entertainment Editor with <strong>24+ years of experience</strong> at top Indian media houses including:
              </p>
              <ul className="list-none space-y-2 ml-4 mb-4">
                <li className="flex items-center text-gray-800">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Zee News
                </li>
                <li className="flex items-center text-gray-800">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  News Nation
                </li>
                <li className="flex items-center text-gray-800">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Sahara Samay
                </li>
                <li className="flex items-center text-gray-800">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  News24 / E24
                </li>
              </ul>
            </section>

            {/* Core Values Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-black mb-8">
                Our Philosophy
              </h2>

              {/* Value 1 */}
              <div className="mb-8 pb-8 border-b border-gray-300">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-black font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-black mb-2">
                      Authenticity Over Rumors
                    </h3>
                    <p className="text-gray-800 leading-relaxed">
                      We bring you verified stories, straight from the source. No speculation, no hearsay – just the facts that matter in the entertainment world.
                    </p>
                  </div>
                </div>
              </div>

              {/* Value 2 */}
              <div className="mb-8 pb-8 border-b border-gray-300">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-black font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-black mb-2">
                      Inside Stories Over Trollers' Comments
                    </h3>
                    <p className="text-gray-800 leading-relaxed">
                      We dive deep to bring you in-depth insights you won't find elsewhere. Our mission is to provide meaningful content that goes beyond surface-level noise.
                    </p>
                  </div>
                </div>
              </div>

              {/* Value 3 */}
              <div className="pb-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-black font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-black mb-2">
                      Honest Reviews Over Influencer Remarks
                    </h3>
                    <p className="text-gray-800 leading-relaxed">
                      We provide unfiltered, unbiased takes on what matters in entertainment. Our critics and reviewers are seasoned professionals who understand the industry.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white border-2 border-black p-8">
              <h2 className="text-2xl font-serif font-bold text-black mb-4">
                Join the Sparkling World of Stars
              </h2>
              <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                Stay updated with the latest news from Bollywood, Hollywood, and beyond. We're committed to bringing you stories that matter, insights that inspire, and coverage that celebrates the magic of entertainment.
              </p>
              <div className="flex gap-4">
                <a
                  href="/"
                  className="inline-block px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
                >
                  Explore Latest News
                </a>
                <a
                  href="mailto:contact@celleb.com"
                  className="inline-block px-8 py-3 border-2 border-black text-black font-bold hover:bg-light-100 transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
