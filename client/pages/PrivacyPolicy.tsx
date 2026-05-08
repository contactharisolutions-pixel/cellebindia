import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-light-50">
      {/* Header */}
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b-2 border-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700">
            Effective Date: April 19, 2026 | Last Updated: April 19, 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <article className="prose prose-lg max-w-none text-gray-800">
          <p className="text-base leading-relaxed mb-6">
            We at Celleb India ("Company", "We", "Us", or "Our") value the trust you place in us and recognize the importance of information security and privacy. This Privacy Policy describes how we collect, use, share, or otherwise process your ("User", "You", "Your") personal data through the Celleb India website http://www.cellebindia.com and other services including but not limited to delivery of information and content (collectively, the "Services").
          </p>

          <p className="text-base leading-relaxed mb-8">
            By using and accessing our Platform and Services, you agree to this Policy and our Terms of Use, and agree to be governed by Indian laws, including the Digital Personal Data Protection Act, 2023 and all other applicable data protection and privacy laws. If you do not accept and agree with this Privacy Policy, you must stop using our Platform.
          </p>

          {/* Section 1 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">1. Information We Collect</h2>
          <p className="text-base leading-relaxed mb-6">
            We may collect: (i) Information you provide directly such as name, email, contact details when you subscribe, comment, or contact us; (ii) Information collected automatically such as IP address, browser type, device information, pages visited, time spent, and referring URLs; (iii) Information from third-party sources as described below.
          </p>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">2. Cookies and Tracking Technologies</h2>
          <p className="text-base leading-relaxed mb-4">
            We use cookies (small data files) to analyze site traffic, measure promotional effectiveness, enhance security, enable certain platform features, reduce password re-entry frequency, and deliver content targeted to your interests. Most cookies are session cookies, automatically deleted when you close your browser.
          </p>
          <p className="text-base leading-relaxed mb-4">
            You can control cookies at the individual browser level, but disabling cookies may limit your use of certain features or functions on the Services. Third parties, such as Google Analytics, also place cookies on our site for marketing and analytics. We do not control their use.
          </p>
          <ul className="list-disc list-inside text-base leading-relaxed mb-6">
            <li><a href="https://www.google.com/intl/en/policies/privacy/" className="text-primary hover:underline">Learn more about how Google uses your personal information here</a></li>
            <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Opt-out of Google Analytics here</a></li>
            <li>We will seek your consent for non-essential cookies via our cookie banner.</li>
          </ul>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">3. How We Use Your Data</h2>
          <p className="text-base leading-relaxed mb-6">
            We use your personal data to: (i) Operate, maintain, and improve our Platform and Services; (ii) Personalize content and recommendations; (iii) Communicate with you, including newsletters and promotional material where you have consented; (iv) Analyze usage and measure effectiveness of content; (v) Detect, prevent, and address technical issues, fraud, or illegal activity; (vi) Comply with legal obligations.
          </p>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">4. Third-Party Data Collection, Services, and External Links</h2>
          <p className="text-base leading-relaxed mb-4">
            We may collect information concerning Users from third-party sources. This data, often in non-identifiable format, is used to analyze web traffic, measure promotional effectiveness, serve preferential advertisements, and identify areas for platform improvement.
          </p>
          <p className="text-base leading-relaxed mb-4">
            We may combine such third-party data with information you provide directly to us to update, expand, or tailor the services and content we offer. Insights derived from this data may be shared with our group companies, affiliates, related companies, and business partners for promotional, marketing, product development, and other legitimate commercial purposes.
          </p>
          <p className="text-base leading-relaxed mb-6">
            This Privacy Policy applies solely to information collected by us through your use of our Platform. We assume no responsibility for the data collection practices or privacy policies of any third-party websites, applications, or services, including business partners, analytics providers, ad networks, or social media integrations. These third parties operate independently and are governed by their own privacy policies. We strongly encourage you to review the privacy policies of any third party before providing personal data. This Policy does not apply to information collected offline.
          </p>

          {/* Section 5 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">5. Retention of Personal Data</h2>
          <p className="text-base leading-relaxed mb-6">
            We retain your personal data in accordance with applicable laws, for a period no longer than required for the purpose for which it was collected or as required under law. However, we may retain data if we believe it necessary to prevent fraud or future abuse, to enable Celleb India to exercise its legal rights and/or defend against legal claims, or if required by law. We may continue to retain your data in anonymised form for analytical and research purposes.
          </p>

          {/* Section 6 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">6. Sharing and Disclosure of Personal Data</h2>
          <p className="text-base leading-relaxed mb-4">
            We share personal data with third-party service providers, vendors, consultants, and business partners who perform services on our behalf. We may also share data with our group entities, including parent companies, subsidiaries, and affiliates.
          </p>
          <p className="text-base leading-relaxed mb-4">
            Data sharing is limited to what is necessary to: (i) Operate, maintain, and improve our Platform and Services; (ii) Facilitate marketing and advertising activities; (iii) Provide customer support and service recovery functions.
          </p>
          <p className="text-base leading-relaxed mb-6">
            We may disclose your personal data where required by law or in good faith belief that such disclosure is reasonably necessary to comply with legal processes, subpoenas, court orders, or instructions from government authorities. We may also disclose data to law enforcement or third parties to enforce our terms, respond to claims of rights violations, prevent fraud or illegal activities, or protect the rights, property, or safety of our users, the Company, or the public. In the event of a merger, acquisition, reorganization, amalgamation, or restructuring, we may share or transfer your personal data with the other business entity involved. The new entity will be required to adhere to this Privacy Policy with respect to your personal data.
          </p>

          {/* Section 7 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">7. Your Rights as a Data Principal</h2>
          <p className="text-base leading-relaxed mb-4">
            In accordance with the Digital Personal Data Protection Act, 2023, you have the following rights:
          </p>
          <ol className="list-decimal list-inside space-y-3 mb-6">
            <li className="text-base"><strong>Right to Access Information:</strong> Obtain a summary of personal data being processed and identities of all data fiduciaries and processors with whom data has been shared.</li>
            <li className="text-base"><strong>Right to Correction and Erasure:</strong> Correct inaccurate or misleading data, complete incomplete data, update data, and request erasure of data that is no longer necessary for the purpose for which it was processed.</li>
            <li className="text-base"><strong>Right of Grievance Redressal:</strong> Register a grievance with our Grievance Officer regarding any act or omission regarding personal data.</li>
            <li className="text-base"><strong>Right to Nominate:</strong> Nominate another individual to exercise your rights in the event of death or incapacity.</li>
            <li className="text-base"><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time. Withdrawal will not affect lawfulness of processing based on consent before withdrawal.</li>
          </ol>
          <p className="text-base leading-relaxed mb-6">
            To exercise these rights, please email us at <a href="mailto:Grievance@cellebindia.com" className="text-primary hover:underline">Grievance@cellebindia.com</a> with the subject line "DPDP Rights Request". We will respond within timelines prescribed under applicable law.
          </p>

          {/* Section 8 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">8. Data Deletion Request</h2>
          <p className="text-base leading-relaxed mb-6">
            You may request deletion of your personal data from our records by emailing <a href="mailto:Grievance@cellebindia.com" className="text-primary hover:underline">Grievance@cellebindia.com</a> with the subject line "Data Deletion Request". Please include details necessary to identify your account. Upon verification, we will delete your personal data unless retention is required for: (i) Compliance with legal obligations; (ii) Establishment, exercise, or defense of legal claims; (iii) Fraud prevention and security purposes. Data stored in backups will be deleted in the next scheduled backup cycle. Anonymised data may be retained for analytics.
          </p>

          {/* Section 9 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">9. Data Security</h2>
          <p className="text-base leading-relaxed mb-6">
            We implement reasonable technical and organizational security measures designed to protect information under our control from loss, misuse, unauthorized access, disclosure, alteration, and destruction, utilizing secure server infrastructure. However, by using the Platform you acknowledge the inherent security implications of data transmission over the internet. No method of transmission or storage is 100% secure; therefore, you accept that certain risks will always remain.
          </p>

          {/* Section 10 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">10. Children's Information</h2>
          <p className="text-base leading-relaxed mb-6">
            Use of our Platform is available only to persons who can form a legally binding contract under the Indian Contract Act, 1872. We do not knowingly solicit or collect personal data from children under the age of 18 years. If we learn we have collected personal data from a child under 18 without verifiable parental consent, we will delete that information. If you believe we might have any information from or about a child under 18, please contact us at <a href="mailto:Grievance@cellebindia.com" className="text-primary hover:underline">Grievance@cellebindia.com</a>.
          </p>

          {/* Section 11 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">11. Your Consent</h2>
          <p className="text-base leading-relaxed mb-6">
            By using and accessing our Platform and/or Services, or by providing your personal data, you consent to the processing of your personal data in accordance with this Privacy Policy. If you disclose personal data of other people, you represent that you have authority to do so and to permit us to use the data per this Policy.
          </p>

          {/* Section 12 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">12. Changes to this Privacy Policy</h2>
          <p className="text-base leading-relaxed mb-6">
            We reserve the right to amend or update this Privacy Policy at any time to reflect changes in our business practices, service offerings, or applicable legal and regulatory requirements. We will notify users of material changes by posting the revised policy on the Platform with a new "Last Updated" date or through other appropriate communication channels. Your continued access to or use of the Platform after changes take effect constitutes acceptance of the revised Policy. We encourage you to review this Policy periodically.
          </p>

          {/* Section 13 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">13. Contact Us and Grievance Officer</h2>
          <p className="text-base leading-relaxed mb-4">
            Should you have any questions, concerns, requests, or grievances regarding this Privacy Policy or our data practices, please contact our designated Grievance Officer. In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, the contact details are provided below:
          </p>
          <div className="bg-white border-2 border-black p-6 mb-6">
            <p className="font-bold text-black mb-3">Grievance Officer, Celleb India</p>
            <p className="text-base mb-2"><strong>Email:</strong> <a href="mailto:Grievance@cellebindia.com" className="text-primary hover:underline">Grievance@cellebindia.com</a></p>
            <p className="text-base mb-2"><strong>Address:</strong> [Insert Registered Office Address]</p>
            <p className="text-base"><strong>Response Time:</strong> We endeavor to resolve grievances within 30 days or as prescribed by law.</p>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black pt-8 mt-12 text-center">
            <p className="text-base font-semibold text-black">
              Copyright © 2007 – 2026 Celleb India<br />
              All rights reserved.
            </p>
          </div>
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
