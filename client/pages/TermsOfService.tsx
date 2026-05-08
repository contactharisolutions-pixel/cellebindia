import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-light-50">
      {/* Header */}
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b-2 border-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-700">
            Effective Date: April 19, 2026 | Last Updated: April 19, 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <article className="prose prose-lg max-w-none text-gray-800">
          {/* Section 1 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">1. Your Acceptance</h2>
          <p className="text-base leading-relaxed mb-6">
            BY USING AND/OR VISITING THIS WEBSITE (collectively, including all content available through the http://cellebindia.com domain name, online forums, online communities and/or any online platforms owned or operated by Celleb India), YOU SIGNIFY YOUR ASSENT TO THESE "TERMS OF SERVICE", WHICH INCLUDE THESE TERMS AND CONDITIONS, OUR COOKIES POLICY, PRIVACY POLICY, AND DISCLAIMER, ALL OF WHICH ARE INCORPORATED HEREIN BY REFERENCE.
          </p>
          <p className="text-base leading-relaxed mb-4">
            If you do not agree to any part of these Terms of Service, then please do not use the Celleb India Platforms.
          </p>
          <p className="text-base leading-relaxed mb-6">
            By clicking 'I Agree' or continuing to use the Celleb India Platforms, you also provide your explicit, informed, and unambiguous consent for the processing of your personal data as described in our Privacy Policy, in compliance with the Digital Personal Data Protection Act, 2023.
          </p>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">2. Applicability</h2>
          <p className="text-base leading-relaxed mb-6">
            These Terms of Service apply to all users of the Celleb India Platforms, including users who are also contributors of videos, clips, sounds, images, photographs, content, information, and any other materials or services on the Website.
          </p>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">3. Third-Party Links</h2>
          <p className="text-base leading-relaxed mb-6">
            The Celleb India Platforms may contain links to third-party websites that are not owned or controlled by Celleb India. Celleb India has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites. By using the Celleb India Platforms, you expressly relieve Celleb India from any and all liability arising from your use of any third-party website.
          </p>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">4. Mandatory Disclosures</h2>
          <ul className="list-disc list-inside text-base leading-relaxed mb-6">
            <li><strong>Legal Name:</strong> Celleb India</li>
            <li><strong>Customer Care &amp; Grievance Contact:</strong> Email: <a href="mailto:grievance@cellebindia.com" className="text-primary hover:underline">grievance@cellebindia.com</a></li>
          </ul>

          {/* Section 5 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">5. Intellectual Property Rights</h2>
          <p className="text-base leading-relaxed mb-4">
            The content on the Celleb India Platforms, including without limitation, the text, software, scripts, graphics, photos, sounds, music, videos, interactive features and the like ("Content") and the trademarks, service marks and logos contained therein ("Marks"), are owned by or licensed to Celleb India, and are subject to copyright and other intellectual property rights under applicable Indian and international laws.
          </p>
          <p className="text-base leading-relaxed mb-4">
            Content on the Celleb India Platforms is provided to you "AS IS" for your information and personal, non-commercial use only.
          </p>
          <p className="text-base leading-relaxed mb-6">
            You agree not to use, copy, reproduce, distribute, transmit, broadcast, display, sell, license, or otherwise exploit any Content for any purpose without the prior written consent of Celleb India or the respective licensors. If you download or print a copy of the Content for personal use, you must retain all copyright and other proprietary notices contained therein. You agree not to circumvent, disable, or otherwise interfere with security-related features of the Celleb India Platforms.
          </p>

          {/* Section 6 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">6. User-Generated Content</h2>
          <p className="text-base leading-relaxed mb-6">
            If you submit content to Celleb India, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform that content in connection with the Services. You represent and warrant that you own or have the necessary rights to the content you submit and that it does not violate these Terms, applicable law, or the rights of any third party.
          </p>

          {/* Section 7 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">7. Copyright Infringement Notice – DMCA/IT Act Compliance</h2>
          <p className="text-base leading-relaxed mb-4">
            <strong>A.</strong> If you are a copyright owner or an agent thereof and believe that any content on the Celleb India Platforms infringes upon your copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ("DMCA") and/or the Information Technology Act, 2000 by providing our designated Copyright Agent with the information in writing.
          </p>
          <p className="text-base leading-relaxed mb-4">
            <strong>B. Notification Requirements:</strong> To be effective, your notification must include:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li className="text-base">Identification of the copyrighted work claimed to have been infringed;</li>
            <li className="text-base">Identification of the alleged infringing material, including information reasonably sufficient to locate the material on our Platform (e.g., URL);</li>
            <li className="text-base">Your contact information reasonably sufficient to permit our Copyright Agent to contact you, such as an address, telephone number, and email;</li>
            <li className="text-base">A statement that you have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law;</li>
            <li className="text-base">A statement, under penalty of perjury, that the information in the notification is accurate and that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed; and</li>
            <li className="text-base">A physical or electronic signature of the copyright owner or a person authorized to act on the owner's behalf.</li>
          </ol>
          <p className="text-base leading-relaxed mb-6">
            <strong>C. Copyright Agent Contact:</strong>
          </p>
          <div className="bg-white border-2 border-black p-4 mb-6">
            <p className="text-base mb-2"><strong>Email:</strong> <a href="mailto:managingeditor@cellebindia.com" className="text-primary hover:underline">managingeditor@cellebindia.com</a></p>
            <p className="text-base"><strong>Subject Line:</strong> "Copyright Infringement Notice"</p>
          </div>
          <p className="text-base leading-relaxed mb-6">
            Upon receipt of a valid notice, we will take appropriate action, which may include removing or disabling access to the allegedly infringing material. We may also terminate repeat infringers' accounts.
          </p>

          {/* Section 8 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">8. Prohibited Conduct</h2>
          <p className="text-base leading-relaxed mb-6">
            You agree not to: (i) Violate any applicable law; (ii) Post false, defamatory, obscene, or infringing content; (iii) Impersonate any person or entity; (iv) Use the Platform for illegal or unauthorized purposes; (v) Interfere with or disrupt the Platform or servers.
          </p>

          {/* Section 9 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">9. Disclaimer of Warranties</h2>
          <p className="text-base leading-relaxed mb-6">
            The Celleb India Platforms and all Content are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>

          {/* Section 10 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">10. Limitation of Liability</h2>
          <p className="text-base leading-relaxed mb-6">
            To the maximum extent permitted by law, Celleb India, its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of or related to your use of the Platforms.
          </p>

          {/* Section 11 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">11. Governing Law and Jurisdiction</h2>
          <p className="text-base leading-relaxed mb-6">
            These Terms of Service shall be governed by and construed in accordance with the laws of India. You agree that any dispute, claim, or controversy arising out of or in connection with these Terms of Service shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
          </p>

          {/* Section 12 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">12. Changes to Services and Terms</h2>
          <p className="text-base leading-relaxed mb-4">
            We reserve the right to discontinue, modify, or change any service or feature on the Celleb India Platforms at any time and without prior notice.
          </p>
          <p className="text-base leading-relaxed mb-6">
            We may change these Terms of Service at any time. We will post the updated Terms on this page with a new "Last Updated" date. If you continue to use the Celleb India Platforms after we post changes, you are signifying your acceptance of the updated Terms. We encourage you to review these Terms periodically.
          </p>

          {/* Section 13 */}
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">13. General</h2>
          <p className="text-base leading-relaxed mb-6">
            If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect. Our failure to enforce any right or provision will not be deemed a waiver of such right or provision.
          </p>

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
