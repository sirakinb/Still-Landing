import { motion } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import logoImage from "@assets/STILL-APPP_1766960471016.png";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Privacy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Link href="/support" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Support</Link>
              <Link href="/terms" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Terms</Link>
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
              <Link href="/support" className="block text-stone-600 hover:text-stone-900">Support</Link>
              <Link href="/terms" className="block text-stone-600 hover:text-stone-900">Terms</Link>
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
            <Link href="/" className="inline-flex items-center text-stone-500 hover:text-stone-700 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-stone-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-stone-500 mb-12">Last updated: January 11, 2026</p>

            <div className="prose prose-stone prose-lg max-w-none">
              <p className="text-stone-600 mb-8">
                <strong>Operated by:</strong> Pentridge Media LLC (Pennsylvania, United States)<br />
                <strong>Contact:</strong> info@pentridgemedia.com
              </p>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">1. Scope</h2>
                <p className="text-stone-600">
                  This Policy explains what we collect, how we use it, and your choices when you use Still, our website, and related services.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">2. What We Collect</h2>
                
                <h3 className="font-semibold text-stone-800 mb-2">Account Data:</h3>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>If you sign in with Apple: We receive your Apple ID (an anonymized identifier), email address (if you choose to share it), and display name (if provided).</li>
                  <li>If you use the App as a guest: We create a local, anonymous identifier for your device. No account data is collected.</li>
                  <li>Email address (optional, only if provided through Apple Sign In)</li>
                </ul>

                <h3 className="font-semibold text-stone-800 mb-2">Usage Data:</h3>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>Session history (duration, start time, completion status)</li>
                  <li>Progress metrics (streak count, total meditation minutes)</li>
                  <li>App usage statistics (features used, interaction events)</li>
                  <li>Device/app version information</li>
                  <li>Basic diagnostics and error logs</li>
                </ul>

                <h3 className="font-semibold text-stone-800 mb-2">Content You Create:</h3>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>AI-generated music tracks (stored locally on your device; metadata may be processed through third-party services)</li>
                  <li>Saved music library preferences</li>
                  <li>Session preferences and settings</li>
                  <li>Custom session configurations</li>
                </ul>

                <h3 className="font-semibold text-stone-800 mb-2">AI Music Generation:</h3>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>Music generation prompts you submit</li>
                  <li>Style preferences and settings</li>
                  <li>Generated track metadata (title, style, creation date)</li>
                </ul>

                <h3 className="font-semibold text-stone-800 mb-2">Payments:</h3>
                <p className="text-stone-600 mb-4">
                  If we offer subscriptions in the future, payments will be processed through Apple In-App Purchase (IAP). Apple processes your payment; we receive subscription status, not full payment details.
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-emerald-800 font-medium">We do not sell your personal information.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">3. Why We Use Your Data</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Provide, operate, and improve the App and its features.</li>
                  <li>Generate AI music tracks based on your requests.</li>
                  <li>Track and display your meditation progress and statistics.</li>
                  <li>Secure the service, prevent abuse, and troubleshoot issues.</li>
                  <li>Communicate with you about updates, features, and support (if you provide contact information).</li>
                  <li>Improve AI music generation quality and service features.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">4. Legal Bases (EEA/UK only)</h2>
                <p className="text-stone-600">
                  Where applicable, our legal bases include contract (to provide the App), legitimate interests (improve and secure the App), and consent (where required by law).
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">5. Sharing & Disclosure</h2>
                <p className="text-stone-600 mb-4">We share data only with service providers that help us run Still:</p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>Apple (Sign in with Apple, iCloud sync if enabled, subscription status if applicable)</li>
                  <li>Google Firebase (authentication, data storage, analytics)</li>
                  <li>Suno API (AI music generation - your prompts and preferences are sent to generate music tracks)</li>
                </ul>
                <p className="text-stone-600">
                  We don't rent or sell your personal data. We may disclose if required by law or to protect rights, safety, and security.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">6. Data Storage & Location</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Most of your data (session history, saved music, preferences) is stored locally on your device.</li>
                  <li>If you sign in with Apple, some data may be synced across your devices via iCloud (if enabled).</li>
                  <li>Account information and sync data are stored securely via Firebase in the United States.</li>
                  <li>AI music generation requests are processed by third-party services and may be stored temporarily on their servers.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">7. Data Retention</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Local data (sessions, saved music): Stored on your device and retained until you delete the App or clear app data.</li>
                  <li>Account data: Retained for as long as your account is active or as needed to provide the service.</li>
                  <li>If you delete your account, we'll delete or anonymize personal data within a reasonable period (typically 30 days), subject to legal/backup constraints (backups may persist up to 90 days).</li>
                  <li>AI generation prompts and metadata: May be retained by third-party services per their policies.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">8. Security</h2>
                <p className="text-stone-600 mb-4">
                  We use administrative, technical, and organizational measures to protect your data, including:
                </p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>Encrypted data transmission (HTTPS)</li>
                  <li>Secure storage via Firebase and Apple iCloud</li>
                  <li>Local device encryption for on-device data</li>
                  <li>Authentication via Apple's secure sign-in system</li>
                </ul>
                <p className="text-stone-600">
                  No system is 100% secure. You are responsible for maintaining the security of your device and account credentials.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">9. International Transfers</h2>
                <p className="text-stone-600">
                  We may process and store information in the United States and other countries. Where required, we use appropriate safeguards for cross-border transfers (including standard contractual clauses where applicable).
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">10. Your Rights & Choices</h2>
                
                <h3 className="font-semibold text-stone-800 mb-2">Access / Update / Delete:</h3>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>To access, correct, export, or delete your data, email info@pentridgemedia.com.</li>
                  <li>You can delete your account through the App settings (if signed in).</li>
                  <li>Local data can be deleted by uninstalling the App or clearing app data in your device settings.</li>
                </ul>

                <h3 className="font-semibold text-stone-800 mb-2">Data Portability:</h3>
                <p className="text-stone-600 mb-4">
                  Session history and saved music metadata can be exported (contact us for assistance).
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">EEA/UK:</h3>
                <p className="text-stone-600 mb-4">
                  You may have rights to object/restrict processing and to lodge a complaint with your local authority (e.g., ICO in the UK).
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">California (CCPA/CPRA):</h3>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>You have rights to know, delete, and correct personal information.</li>
                  <li>We do not "sell" personal information as defined by CCPA.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">11. Children's Privacy</h2>
                <p className="text-stone-600">
                  The App is not intended for children under 13. If we learn we collected data from a child without proper consent, we will delete it.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">12. App Permissions (iOS examples)</h2>
                
                <h3 className="font-semibold text-stone-800 mb-2">Camera (Optional):</h3>
                <p className="text-stone-600 mb-4">
                  Not currently used. If added in the future, would be for profile photos or related features.
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Photos (Optional):</h3>
                <p className="text-stone-600 mb-4">
                  Not currently used. If added in the future, would be for saving or sharing content.
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Notifications (Optional):</h3>
                <p className="text-stone-600 mb-4">
                  For reminders, session updates, or feature announcements. You can disable notifications in device settings (some features may not work without them).
                </p>

                <h3 className="font-semibold text-stone-800 mb-2">Microphone (Not Used):</h3>
                <p className="text-stone-600">
                  Still does not access your microphone.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">13. Third-Party Services</h2>
                <p className="text-stone-600 mb-4">The App integrates with:</p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-4">
                  <li>Apple Services (Sign in with Apple, iCloud, App Store, In-App Purchases)</li>
                  <li>Google Firebase (authentication, cloud storage, analytics)</li>
                  <li>Suno API (AI music generation)</li>
                </ul>
                <p className="text-stone-600 mb-4">Your use of these services is subject to their respective privacy policies:</p>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>Apple: <a href="https://www.apple.com/privacy/" className="text-stone-800 underline hover:text-stone-600">https://www.apple.com/privacy/</a></li>
                  <li>Google: <a href="https://policies.google.com/privacy" className="text-stone-800 underline hover:text-stone-600">https://policies.google.com/privacy</a></li>
                  <li>Suno: Please review Suno's privacy policy at their website</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">14. AI Music Generation</h2>
                <ul className="list-disc pl-6 text-stone-600 space-y-2">
                  <li>When you request AI-generated music, your prompts and preferences are sent to third-party AI services (Suno API) to generate music tracks.</li>
                  <li>These services may store your prompts temporarily for processing.</li>
                  <li>Generated music tracks are stored locally on your device.</li>
                  <li>We may use anonymized usage data to improve the music generation experience.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">15. Changes to this Policy</h2>
                <p className="text-stone-600">
                  We may update this Policy. Material changes will be posted in-app or on our website with an updated "Last updated" date.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">16. Contact</h2>
                <p className="text-stone-600 mb-4">Privacy questions or requests:</p>
                <ul className="list-none text-stone-600 space-y-2">
                  <li><strong>Email:</strong> info@pentridgemedia.com</li>
                  <li><strong>Address:</strong> 1034 S. 53rd Street, Philadelphia, PA 19143</li>
                </ul>
              </section>

              <div className="border-t border-stone-200 pt-8 mt-12">
                <p className="text-stone-500 text-sm">Last updated: January 11, 2026</p>
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
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
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
