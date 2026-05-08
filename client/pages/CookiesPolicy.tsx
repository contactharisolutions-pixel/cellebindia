import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cookie, Shield, Eye, Lock, RefreshCw } from "lucide-react";

export default function CookiesPolicy() {
  const sections = [
    {
      title: "What are Cookies?",
      icon: Cookie,
      content: "Cookies are small text files that are stored on your browser or the hard drive of your computer or other device when you visit our site. This allows the site to recognise you as a user either for the duration of your visit (using a 'session cookie') or for repeat visits (a 'persistent cookie'). They are not harmful and do not contain any information such as your home address, date of birth or credit card details."
    },
    {
      title: "Essential Cookies",
      icon: Lock,
      content: "These are strictly necessary for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website, use a shopping cart or make use of e-billing services. Without these cookies, the services that you have asked for cannot be provided."
    },
    {
      title: "Performance & Analytics",
      icon: Eye,
      content: "They allow us to recognise and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily."
    },
    {
      title: "Managing Your Preferences",
      icon: RefreshCw,
      content: "You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website."
    }
  ];

  return (
    <div className="min-h-screen bg-light-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6 border border-primary/20 shadow-sm">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
            Cookies Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: April 27, 2026
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-20 text-gray-800 leading-relaxed">
          <p>
            At CELLEB, we believe in being clear and open about how we collect and use data related to you. In the spirit of transparency, this policy provides detailed information about how and when we use cookies on our Site. This cookie policy applies to any CELLEB product or service that links to this policy or incorporates it by reference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-light-100 rounded-xl flex items-center justify-center mb-6 border border-black/5 group-hover:bg-primary/10 transition-colors">
                <section.icon className="w-6 h-6 text-black group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{section.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-black text-white p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <h2 className="text-2xl font-bold mb-6 relative z-10">Still have questions?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl relative z-10">
            If you have any questions about our use of cookies or other technologies, please email us at privacy@celleb.com or reach out via our contact page.
          </p>
          <a href="/contact" className="inline-flex items-center justify-center px-8 h-12 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all relative z-10">
            Contact Support
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
