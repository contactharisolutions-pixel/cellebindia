import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function Advertise() {
  return (
    <div className="min-h-screen bg-light-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b-2 border-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-4">
            Advertise With Us
          </h1>
          <p className="text-xl text-gray-700">
            Reach entertainment enthusiasts and industry insiders
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Quick Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-black p-8 sticky top-24">
              <h2 className="text-2xl font-serif font-bold text-black mb-6 flex items-center gap-2">
                <Mail size={24} />
                Get In Touch
              </h2>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                Interested in advertising with CELLEB? Contact our advertising team for partnership opportunities.
              </p>
              <a
                href="mailto:advertising@cellebindia.com"
                className="inline-block px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors text-sm w-full text-center"
              >
                advertising@cellebindia.com
              </a>
              <p className="text-xs text-gray-600 italic mt-4">
                Response: Within 2-3 business days
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* About CELLEB */}
            <section className="mb-12 pb-12 border-b-2 border-black">
              <h2 className="text-3xl font-serif font-bold text-black mb-6">
                Why Advertise With CELLEB?
              </h2>
              <div className="space-y-4 text-lg text-gray-800 leading-relaxed">
                <p>
                  <strong>CELLEB – The Sparkling World of Stars</strong> is India's premier digital destination for authentic entertainment news, insightful analysis, and exclusive coverage of Bollywood, Hollywood, streaming platforms, and beyond.
                </p>
                <p>
                  With a growing audience of entertainment enthusiasts, industry professionals, and media decision-makers, CELLEB offers unparalleled reach into a highly engaged, affluent demographic that drives the entertainment industry forward.
                </p>
              </div>
            </section>

            {/* Our Audience */}
            <section className="mb-12 pb-12 border-b-2 border-black">
              <h2 className="text-3xl font-serif font-bold text-black mb-8">
                Our Audience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-light-100 border-l-4 border-primary p-6">
                  <h3 className="text-xl font-bold text-black mb-3">Entertainment Professionals</h3>
                  <p className="text-gray-800">
                    Producers, directors, studios, streaming platforms, and industry executives who rely on CELLEB for the latest news and insights.
                  </p>
                </div>
                <div className="bg-light-100 border-l-4 border-primary p-6">
                  <h3 className="text-xl font-bold text-black mb-3">Engaged Enthusiasts</h3>
                  <p className="text-gray-800">
                    Millions of entertainment fans who follow our coverage of Bollywood releases, Hollywood premieres, streaming launches, and celebrity news.
                  </p>
                </div>
                <div className="bg-light-100 border-l-4 border-primary p-6">
                  <h3 className="text-xl font-bold text-black mb-3">Media & Advertisers</h3>
                  <p className="text-gray-800">
                    Marketing teams, production companies, and brands targeting the entertainment and media-savvy consumer segment.
                  </p>
                </div>
                <div className="bg-light-100 border-l-4 border-primary p-6">
                  <h3 className="text-xl font-bold text-black mb-3">Decision Makers</h3>
                  <p className="text-gray-800">
                    Studio heads, network executives, and streaming platform leaders looking for visibility with industry insiders.
                  </p>
                </div>
              </div>
            </section>

            {/* Advertising Opportunities */}
            <section className="mb-12 pb-12 border-b-2 border-black">
              <h2 className="text-3xl font-serif font-bold text-black mb-8">
                Advertising Opportunities
              </h2>
              <div className="space-y-6">
                <div className="bg-white border-2 border-black p-6">
                  <h3 className="text-xl font-bold text-black mb-2">Display Advertising</h3>
                  <p className="text-gray-800">
                    Premium placements across our homepage, category pages, and article pages to ensure maximum visibility with our audience.
                  </p>
                </div>
                <div className="bg-white border-2 border-black p-6">
                  <h3 className="text-xl font-bold text-black mb-2">Sponsored Content</h3>
                  <p className="text-gray-800">
                    Custom editorial content created in partnership with our award-winning journalists to tell your brand story authentically.
                  </p>
                </div>
                <div className="bg-white border-2 border-black p-6">
                  <h3 className="text-xl font-bold text-black mb-2">Branded Integrations</h3>
                  <p className="text-gray-800">
                    Strategic partnerships that seamlessly integrate your brand with CELLEB's editorial voice and audience engagement.
                  </p>
                </div>
                <div className="bg-white border-2 border-black p-6">
                  <h3 className="text-xl font-bold text-black mb-2">Newsletter Sponsorships</h3>
                  <p className="text-gray-800">
                    Reach our engaged subscriber base through featured placements in our curated newsletters and email campaigns.
                  </p>
                </div>
                <div className="bg-white border-2 border-black p-6">
                  <h3 className="text-xl font-bold text-black mb-2">Social Media Campaigns</h3>
                  <p className="text-gray-800">
                    Amplify your message across CELLEB's Instagram, X, Facebook, and YouTube channels to reach millions of followers.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-black mb-8">
                Ready to Partner?
              </h2>
              <div className="bg-white border-2 border-black p-8">
                <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                  Let's discuss how CELLEB can help you reach your target audience. Contact our advertising team to explore customized packages and opportunities tailored to your brand's objectives.
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Email
                    </p>
                    <a
                      href="mailto:advertising@cellebindia.com"
                      className="text-lg font-mono text-primary hover:underline"
                    >
                      advertising@cellebindia.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Response Time
                    </p>
                    <p className="text-gray-800">
                      We endeavor to respond to all inquiries within <strong>2-3 business days</strong>. Our team will be happy to discuss your advertising goals and create a customized proposal.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-16 pt-16 border-t-2 border-black">
          <div className="bg-white border-2 border-black p-8 text-center">
            <h2 className="text-2xl font-serif font-bold text-black mb-4">
              Join CELLEB's Advertising Family
            </h2>
            <p className="text-lg text-gray-800 mb-6 leading-relaxed max-w-2xl mx-auto">
              Become part of India's most trusted entertainment news platform and reach millions of engaged entertainment enthusiasts.
            </p>
            <a
              href="mailto:advertising@cellebindia.com"
              className="inline-block px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
            >
              Start a Conversation
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
