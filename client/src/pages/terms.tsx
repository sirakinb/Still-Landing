import { motion } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import logoImage from "@assets/STILL-APPP_1766960471016.png";
import { usePageSEO } from "@/hooks/usePageSEO";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Terms() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  usePageSEO({
    title: "Terms of Service | Still - Meditation Music App",
    description: "Terms of Service for Still, the AI-powered meditation music app by Pentridge Media LLC. Review our terms for using the Still app and services."
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img src={logoImage} alt="Still Logo" className="w-10 h-10 rounded-xl" />
                <span className="font-serif text-xl font-semibold text-stone-800">Still</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#/support" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Support</a>
              <a href="#/privacy" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Privacy</a>
            </nav>

            <button
              className="md:hidden p-2 text-stone-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-stone-200"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#/support" className="block text-stone-600 hover:text-stone-900">Support</a>
              <a href="#/privacy" className="block text-stone-600 hover:text-stone-900">Privacy</a>
            </div>
          </motion.div>
        )}
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <a href="/" className="inline-flex items-center text-stone-500 hover:text-stone-700 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </a>
            
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-stone-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-stone-500 mb-12">Last Updated: January 16, 2026</p>

            <div className="prose prose-stone prose-lg max-w-none">
              <p className="text-stone-600 mb-8">
                <strong>Operated by:</strong> Pentridge Media LLC (Pennsylvania, United States)<br />
                <strong>Contact:</strong> info@pentridgemedia.com
              </p>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">1. Overview</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Still (the "App") is a meditation and mindfulness application that helps you find stillness through guided sessions, AI-generated music, and progress tracking.</li>
                  <li>The App is provided by Pentridge Media LLC ("Still," "we," "us," or "our").</li>
                  <li>By downloading or using the App, you agree to these Terms.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">2. Eligibility</h2>
                <p className="text-stone-600">
                  The App is rated 4+ globally (with regional variations: 9+ in 173 countries/regions, 10+ in Brazil, ALL in Korea). Children under the applicable age rating in their region should use the App under parental supervision. By using the App, you confirm you meet the age requirements for your region or have parental consent.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">3. Accounts & Security</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>You may sign in with Apple or use the App as a guest. You are responsible for safeguarding your account credentials.</li>
                  <li>You agree that your account information is accurate and you won't impersonate others or use the App for unlawful purposes.</li>
                  <li>We may suspend or terminate accounts that violate these Terms.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">4. Features & Services</h2>
                <p className="text-stone-600 mb-4">The App offers:</p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Curated meditation sessions and soundscapes</li>
                  <li>AI-powered music generation (created via third-party services)</li>
                  <li>Timed meditation sessions with flexible durations</li>
                  <li>Progress tracking (streaks, total minutes, session history)</li>
                  <li>Personal library for saved music tracks</li>
                </ul>
                <p className="text-stone-600 mt-4">We may add, modify, or remove features with notice where practical.</p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">5. Subscriptions, Billing & Refunds</h2>
                <p className="text-stone-600 mb-4">Still offers paid subscriptions to access all features:</p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>Monthly: $7.99/month</li>
                  <li>Annual: $69.99/year</li>
                </ul>
                
                <h3 className="font-semibold text-stone-800 mb-2">Subscription Terms:</h3>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Payments are processed through Apple In-App Purchase (IAP).</li>
                  <li>Your Apple ID will be charged at confirmation.</li>
                  <li>Subscriptions auto-renew unless canceled at least 24 hours before the end of the current period.</li>
                  <li>Renewal charges occur within 24 hours before the current period ends.</li>
                  <li>Manage or cancel subscriptions under: Settings → [your name] → Subscriptions on your device.</li>
                  <li>Refunds for Apple IAP are governed by Apple's policies and must be requested directly from Apple.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">6. Acceptable Use</h2>
                <p className="text-stone-600 mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Use the App for any unlawful purpose or in violation of applicable laws.</li>
                  <li>Attempt to reverse-engineer, decompile, or extract the App's source code.</li>
                  <li>Interfere with or disrupt the App's services or servers.</li>
                  <li>Use AI music generation features to create content that infringes on intellectual property rights, is illegal, harmful, or violates any laws.</li>
                  <li>Attempt to abuse or exploit the AI music generation service or any other features.</li>
                </ul>
                <p className="text-stone-600 mt-4">We may remove content or restrict accounts that violate these rules.</p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">7. Your Content & License</h2>
                <h3 className="font-semibold text-stone-800 mb-2">Ownership:</h3>
                <p className="text-stone-600 mb-4">
                  You retain ownership of content you create or generate using the App, including AI-generated music tracks, session notes, and preferences ("User Content").
                </p>
                <h3 className="font-semibold text-stone-800 mb-2">License to Us:</h3>
                <p className="text-stone-600 mb-4">
                  You grant us a non-exclusive, worldwide license to host, store, reproduce, and display your User Content solely to provide and improve the App.
                </p>
                <p className="text-stone-600">
                  You represent that you have the rights to your content and that it doesn't violate third-party rights.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">8. AI-Generated Music</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>The App uses third-party AI services (including Suno API) to generate music based on your prompts.</li>
                  <li>AI-generated content is provided "as is" without warranty. Results may vary and may contain similarities to existing compositions.</li>
                  <li>We do not guarantee the uniqueness, quality, or suitability of AI-generated content for your intended use.</li>
                  <li>You are responsible for ensuring your prompts and generated content comply with all applicable laws.</li>
                  <li>We reserve the right to remove or restrict access to content that violates these Terms or applicable law.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">9. Our Intellectual Property</h2>
                <p className="text-stone-600">
                  The App, including its software, features, branding, logos, and other materials, is owned by Pentridge Media LLC and protected by law. Except for your User Content and rights expressly granted, no licenses are granted.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">10. Third-Party Services</h2>
                <p className="text-stone-600 mb-4">We integrate services such as:</p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Apple Services (Sign in with Apple, iCloud)</li>
                  <li>Google Firebase (authentication, data storage)</li>
                  <li>Suno API (AI music generation)</li>
                </ul>
                <p className="text-stone-600 mt-4">Your use of those services may be subject to their own terms and privacy policies.</p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">11. Wellness & Medical Disclaimer</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 font-medium">
                    THE APP IS PROVIDED FOR GENERAL WELLNESS AND RELAXATION PURPOSES ONLY. IT IS NOT INTENDED FOR USE IN THE DIAGNOSIS, TREATMENT, CURE, OR PREVENTION OF ANY DISEASE OR MEDICAL CONDITION.
                  </p>
                </div>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>If you have a medical or mental health condition, please consult with a qualified healthcare provider before using the App.</li>
                  <li>Do not use the App as a substitute for professional medical advice, diagnosis, or treatment.</li>
                  <li>The App is not a medical device and does not provide medical services.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">12. Beta & AI Features</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Some features (including AI music generation) may be labeled as beta and could change, be rate-limited, or discontinued.</li>
                  <li>Results from AI features may be imperfect; use discretion.</li>
                  <li>We may modify, suspend, or discontinue features with notice where practical.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">13. Availability; Changes</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>We may modify, suspend, or discontinue features or services with notice where practical.</li>
                  <li>We are not liable for outages, data loss, or changes to the App.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">14. Disclaimer; Limitation of Liability</h2>
                <p className="text-stone-600 mb-4">
                  The App is provided "as is" and "as available." To the fullest extent permitted by law, we disclaim all warranties and limit our total liability to the greater of:
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>(a) $50, or</li>
                  <li>(b) the amount you paid to us for the App in the 12 months before the claim.</li>
                </ul>
                <p className="text-stone-600 mt-4">
                  Some jurisdictions do not allow certain limitations; in those cases, the limits apply to the maximum extent permitted.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">15. Indemnity</h2>
                <p className="text-stone-600">
                  You agree to defend, indemnify, and hold harmless Pentridge Media LLC from any claims, damages, or expenses arising from your misuse of the App or violation of these Terms.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">16. Governing Law; Venue</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>These Terms are governed by the laws of the Commonwealth of Pennsylvania, USA, without regard to conflict of law principles.</li>
                  <li>Where permitted, exclusive venue for disputes is in the courts located in Philadelphia, Pennsylvania, United States.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">17. Changes to Terms</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>We may update these Terms at any time.</li>
                  <li>Material changes will be posted in the App or on our website.</li>
                  <li>Continued use means you accept the updated Terms.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">18. Contact</h2>
                <p className="text-stone-600 mb-4">Questions about these Terms:</p>
                <ul className="list-none text-stone-600 space-y-2">
                  <li><strong>Email:</strong> info@pentridgemedia.com</li>
                  <li><strong>Address:</strong> 1034 S. 53rd Street, Philadelphia, PA 19143</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">19. Apple App Store Additional Terms (EULA)</h2>
                <p className="text-stone-600 mb-6">
                  If you download or access Still through the Apple App Store, the following additional terms apply:
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Acknowledgment</h3>
                <p className="text-stone-600 mb-4">
                  You and Pentridge Media LLC acknowledge that this agreement is between you and Pentridge Media LLC only, not with Apple. Pentridge Media LLC, not Apple, is solely responsible for the Still App and its content.
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Scope of License</h3>
                <p className="text-stone-600 mb-4">
                  The license granted to you for Still is a limited, non-transferable license to use the App on any Apple-branded device you own or control and as permitted by the Usage Rules in the Apple Media Services Terms and Conditions. The App may also be accessed and used by other accounts associated with you via Family Sharing or volume purchasing.
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Maintenance and Support</h3>
                <p className="text-stone-600 mb-4">
                  Pentridge Media LLC is solely responsible for providing maintenance and support for the App, as specified in these Terms or as required by applicable law. Apple has no obligation whatsoever to furnish any maintenance or support services for the App.
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Warranty</h3>
                <p className="text-stone-600 mb-4">
                  To the maximum extent permitted by law, the App is provided "as is." If the App fails to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price (if any). To the extent permitted by law, Apple has no other warranty obligation, and any other claims, losses, liabilities, or expenses attributable to any failure to conform are the sole responsibility of Pentridge Media LLC.
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Product Claims</h3>
                <p className="text-stone-600 mb-4">
                  You acknowledge that Pentridge Media LLC, not Apple, is responsible for addressing any claims by you or a third party relating to the App or your possession or use of the App, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>(i) product liability claims;</li>
                  <li>(ii) any claim that the App fails to conform to legal or regulatory requirements; and</li>
                  <li>(iii) claims arising under consumer protection or similar laws.</li>
                </ul>

                <h3 className="font-semibold text-stone-800 mb-2">Intellectual Property Rights</h3>
                <p className="text-stone-600 mb-4">
                  In the event of any third-party claim that the App or your use of it infringes that third party's intellectual property rights, Pentridge Media LLC will be solely responsible for the investigation, defense, settlement, and discharge of such claim.
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Legal Compliance</h3>
                <p className="text-stone-600 mb-4">
                  You represent and warrant that (i) you are not located in a country that is subject to a U.S. Government embargo or designated as a "terrorist supporting" country; and (ii) you are not listed on any U.S. Government list of prohibited or restricted parties.
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Developer Contact Information</h3>
                <p className="text-stone-600 mb-4">
                  Pentridge Media LLC<br />
                  1034 S. 53rd Street<br />
                  Philadelphia, PA 19143<br />
                  Email: info@pentridgemedia.com<br />
                  Phone: (267) 463-6527
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Third-Party Terms</h3>
                <p className="text-stone-600 mb-4">
                  You must comply with applicable third-party terms when using the App (for example, your wireless data service agreement).
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Third-Party Beneficiary</h3>
                <p className="text-stone-600">
                  You and Pentridge Media LLC acknowledge and agree that Apple and its subsidiaries are third-party beneficiaries of these Terms, and that, upon your acceptance of the Terms, Apple will have the right (and be deemed to have accepted the right) to enforce these Terms against you as a third-party beneficiary.
                </p>
              </section>

              <div className="border-t border-stone-200 pt-8 mt-12">
                <p className="text-stone-500 text-sm">Last Updated: January 16, 2026</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img src={logoImage} alt="Still Logo" className="w-8 h-8 rounded-lg" />
              <span className="font-serif text-lg font-semibold">Still</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-stone-400">
              <a href="#/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#/support" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
            © 2026 Pentridge Media LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
