import { motion } from "framer-motion";
import { ArrowLeft, Menu, X, Mail, User, Music, Clock, BarChart, Wrench, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import logoImage from "@assets/STILL-APPP_1766960471016.png";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const supportTopics = [
  {
    icon: User,
    title: "Account & Sign In",
    description: "Questions about signing in with Apple, guest accounts, or account management."
  },
  {
    icon: Music,
    title: "Music Generation",
    description: "Help with creating music tracks, understanding styles, saving to your library, or troubleshooting generation issues."
  },
  {
    icon: Clock,
    title: "Meditation Sessions",
    description: "Assistance with starting sessions, customizing durations, selecting soundscapes, or tracking your progress."
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description: "Questions about streaks, session history, total minutes, or how your data is stored and synced."
  },
  {
    icon: Wrench,
    title: "Technical Issues",
    description: "Troubleshooting app crashes, sync problems, audio playback issues, or performance problems."
  },
  {
    icon: HelpCircle,
    title: "Features & Usage",
    description: "Help with using Still's features, navigating the app, or understanding how features work."
  }
];

export default function Support() {
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
              <a href="#/terms" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Terms</a>
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
              <a href="#/terms" className="block text-stone-600 hover:text-stone-900">Terms</a>
              <a href="#/privacy" className="block text-stone-600 hover:text-stone-900">Privacy</a>
            </div>
          </motion.div>
        )}
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Help & Support
            </h1>
            <p className="text-xl text-stone-600 mb-12">
              Need assistance with Still? We're here to help.
            </p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-8 mb-12 text-white"
            >
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-2">Email Support</h2>
                  <p className="text-stone-300 mb-4">
                    For any questions, technical issues, or account-related concerns, please reach out to our support team:
                  </p>
                  <a 
                    href="mailto:info@pentridgemedia.com" 
                    className="inline-block text-lg font-medium text-white hover:text-stone-200 transition-colors"
                    data-testid="link-support-email"
                  >
                    info@pentridgemedia.com
                  </a>
                  <p className="text-stone-400 text-sm mt-2">
                    We typically respond within 24-48 hours
                  </p>
                </div>
              </div>
            </motion.div>

            <section className="mb-12">
              <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-6">Common Topics</h2>
              
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-4"
              >
                {supportTopics.map((topic, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card className="h-full border-stone-200 hover:border-stone-300 transition-colors" data-testid={`card-support-topic-${index}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <topic.icon className="w-5 h-5 text-stone-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-stone-900 mb-1">{topic.title}</h3>
                            <p className="text-sm text-stone-600">{topic.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-6">Quick Links</h2>
              <div className="flex items-center space-x-4 text-stone-600">
                <a href="#/terms" className="hover:text-stone-900 transition-colors underline" data-testid="link-terms">
                  Terms of Service
                </a>
                <span className="text-stone-300">•</span>
                <a href="#/privacy" className="hover:text-stone-900 transition-colors underline" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </div>
            </section>
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
