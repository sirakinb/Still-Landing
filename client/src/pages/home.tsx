import { motion } from "framer-motion";
import { ArrowRight, Music, Sparkles, Wind, Waves, CloudRain, Zap, Heart, Play, BarChart, Check, Apple, Menu, X } from "lucide-react";
import { useState } from "react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import logoImage from "@assets/STILL-APPP_1766960471016.png";
import heroImage from "@assets/Gold_Black_Crown_x_Crown_Logo_(1024_x_1024_px)_(1290_x_2796_px_1768204792335.png";
import libraryImage from "@assets/Red_and_White_Illustrative_Modern_Seafood_Restaurant_Facebook__1766983077536.png";
import { usePageSEO } from "@/hooks/usePageSEO";

// Animation variants
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

import { toast } from "sonner";

function JoinBetaDialog({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const name = `${firstName} ${lastName}`;
    const email = formData.get("email");

    try {
      posthog.capture("waitlist_signup_submitted", { email });

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (response.ok) {
        setSubmitted(true);
        posthog.capture("waitlist_signup_success", { email });
        toast.success("Thanks for joining! We'll be in touch soon.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) posthog.capture("join_beta_cta_clicked");
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closed so it's ready for next time (or keep it if you want persistence)
      setTimeout(() => setSubmitted(false), 300); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Submission Received</DialogTitle>
              <DialogDescription className="text-center text-base">
                Your request has been successfully submitted.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-4 rounded-full px-8" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Join the Beta</DialogTitle>
              <DialogDescription>
                Enter your details to get early access to Still.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="First Name" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Last Name" required disabled={loading} />
                </div>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="email">Email</Label>
                 <Input id="email" name="email" type="email" placeholder="Enter your email" required disabled={loading} />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  usePageSEO({
    title: "Still - AI-Generated Meditation Music | Personalized Soundscapes",
    description: "Still lets you create personalized AI-generated meditation music. Describe your mood, choose a style, and generate unique soundscapes for your meditation practice. Available on iOS."
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight">
             <img src={logoImage} alt="Still Logo" className="w-10 h-10 object-contain" />
             Still
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-primary transition-colors">Features</button>
            <button onClick={() => scrollToSection('styles')} className="text-sm font-medium hover:text-primary transition-colors">Styles</button>
            <button onClick={() => scrollToSection('faq')} className="text-sm font-medium hover:text-primary transition-colors">FAQ</button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border/40 p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
            <button onClick={() => scrollToSection('features')} className="text-left px-4 py-2 hover:bg-secondary/50 rounded-lg">Features</button>
            <button onClick={() => scrollToSection('styles')} className="text-left px-4 py-2 hover:bg-secondary/50 rounded-lg">Styles</button>
            <a href="https://apps.apple.com/us/app/still-meditation/id6757083149" target="_blank" rel="noopener noreferrer" className="w-full">
              <img src="/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" alt="Download on the App Store" className="h-10 w-auto mx-auto" />
            </a>
          </div>
        )}
      </nav>

      <main>
      {/* Hero Section */}
      <section aria-label="Hero" className="relative pt-40 pb-20 lg:pt-60 lg:pb-32 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10 dark:bg-blue-900/20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl -z-10 dark:bg-orange-900/10"></div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-8 items-start">
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col gap-4 lg:gap-6 lg:mt-12"
            >
              <motion.div variants={fadeIn}>
                <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 bg-primary/5 text-primary">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Now Live
                </Badge>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="font-serif text-5xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-primary">
                Your Meditation. <br/> 
                <span className="italic text-foreground/80">Your Music.</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Still lets you create personalized meditation music. Describe the mood you want, choose a style, and generate a unique soundscape made just for you.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                <a href="https://apps.apple.com/us/app/still-meditation/id6757083149" target="_blank" rel="noopener noreferrer">
                  <img src="/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" alt="Download on the App Store" className="h-14 w-auto" />
                </a>
              </motion.div>
              
              <motion.div variants={fadeIn} className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold text-primary/40 overflow-hidden">
                       <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Loved by early beta users</p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto lg:ml-auto w-full max-w-[500px] lg:max-w-[800px]"
            >
               {/* Backdrop Container */}
               <div className="relative z-10 bg-[hsl(40_50%_96%)]/70 dark:bg-card/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-14 shadow-2xl border border-white/20">
                 {/* Phone Frame Mockup - Image already contains frame */}
                 <div className="relative drop-shadow-xl">
                   <img 
                     src={heroImage}
                     alt="Still App Interface" 
                     className="w-full h-auto"
                   />
                 </div>
               </div>
               
               {/* Decorative Circles behind phone */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse duration-[4000ms]"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Value Proposition Bar */}
      <section aria-label="Value proposition" className="bg-primary/5 py-12 border-y border-primary/5">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary/80"
          >
            "Create meditation music as unique as your practice."
          </motion.h2>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="space-y-6"
            >
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight text-primary">
                Generic Playlists <br />
                <span className="text-muted-foreground">Weren't Made for You</span>
              </h2>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="space-y-6 text-lg text-muted-foreground leading-relaxed"
            >
              <p>
                Every meditation app gives you the same library. The same ocean sounds. The same piano loops. But your practice is personal. Why should your music be generic?
              </p>
              <p className="text-foreground font-medium">
                Still puts you in control. Describe what you need — a calm forest at dawn, the rhythm of gentle rain, a warm ambient hum — and create something completely original, just for this moment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features - How it works */}
      <section id="features" aria-label="How it works" className="py-24 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="font-serif text-4xl lg:text-5xl mb-6 text-primary">Personalized Meditation Music</h2>
            <p className="text-muted-foreground text-lg">
              Still transforms your words into original meditation tracks. No two creations are the same.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               {
                 step: "01",
                 title: "Choose Your Style",
                 desc: "Select from seven handcrafted presets — Ambient, Nature, Piano, Tibetan, Binaural, Lo-fi, Classical — or define your own custom style.",
                 icon: <Music className="w-6 h-6" />
               },
               {
                 step: "02",
                 title: "Describe the Mood",
                 desc: 'Tell Still what you\'re feeling. "A quiet evening by a mountain lake." "Deep breathing with resonant tones." Your words become your music.',
                 icon: <Sparkles className="w-6 h-6" />
               },
               {
                 step: "03",
                 title: "Generate and Meditate",
                 desc: "In about a minute, you'll have a unique, high-quality meditation track ready to use. Save it to your library and return to it whenever you need.",
                 icon: <Play className="w-6 h-6" />
               }
             ].map((feature, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
               >
                 <Card className="h-full border-none shadow-lg bg-background/50 backdrop-blur-sm hover:bg-background transition-colors duration-300">
                   <CardContent className="p-8 space-y-4">
                     <div className="flex items-center justify-between mb-4">
                       <span className="font-serif text-6xl text-primary/10 font-bold">{feature.step}</span>
                       <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                         {feature.icon}
                       </div>
                     </div>
                     <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                     <p className="text-muted-foreground leading-relaxed">
                       {feature.desc}
                     </p>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Styles Grid */}
      <section id="styles" aria-label="Music styles" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="font-serif text-4xl lg:text-5xl mb-4 text-primary">Seven Styles. Infinite Possibilities.</h2>
             <p className="text-muted-foreground text-lg">Or go custom. Define your own style with as much detail as you want.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Ambient", desc: "Atmospheric, ethereal", icon: <Wind /> },
              { name: "Nature", desc: "Organic, peaceful", icon: <Waves /> },
              { name: "Piano", desc: "Soft, melodic", icon: <Music /> },
              { name: "Tibetan", desc: "Singing bowls", icon: <div className="w-6 h-6 rounded-full border-2 border-current" /> },
              { name: "Binaural", desc: "Resonant tones", icon: <Zap /> },
              { name: "Lo-fi", desc: "Warm, relaxed", icon: <div className="w-6 h-6 border-b-2 border-current" /> },
              { name: "Classical", desc: "Serene orchestral", icon: <Music /> },
              { name: "Custom", desc: "Your unique style", icon: <Sparkles /> },
            ].map((style, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group cursor-pointer rounded-2xl p-6 border border-border bg-card hover:shadow-md transition-all"
              >
                <div className="mb-4 w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                  {style.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{style.name}</h3>
                <p className="text-sm text-muted-foreground">{style.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights (Library, Sessions, Progress) */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 space-y-32">
          
          {/* Library */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5 }}
                 className="relative w-full max-w-[500px] lg:max-w-[800px] mx-auto"
               >
                  {/* Backdrop Container - Same style as hero */}
                  <div className="relative z-10 bg-[hsl(40_50%_96%)]/70 dark:bg-card/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-14 shadow-2xl border border-white/20">
                     <div className="relative drop-shadow-xl">
                       <img 
                         src={libraryImage} 
                         alt="Still Library Interface" 
                         className="w-full h-auto"
                       />
                     </div>
                  </div>
                  
                  {/* Decorative Circles behind phone */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse duration-[4000ms]"></div>
               </motion.div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="font-serif text-4xl text-primary">Your Creations. Your Library.</h2>
              <p className="text-lg text-muted-foreground">Every track you generate is saved to your personal library. Preview your creations, use them for timed sessions, and build a collection of soundscapes that are truly yours.</p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Check className="w-4 h-4" /> Curated sessions included
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-6">
              <h2 className="font-serif text-4xl text-primary">Sessions That Fit Your Life</h2>
              <p className="text-lg text-muted-foreground">Choose your duration — 3 minutes between meetings, 10 minutes in the morning, or 30 minutes for a deep practice.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Custom duration timers
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Gentle chimes start & end
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Seamless transitions
                </li>
              </ul>
            </div>
            <div className="relative">
               <div className="aspect-square rounded-full border border-primary/10 flex items-center justify-center relative">
                 <div className="absolute inset-0 border border-primary/5 rounded-full scale-110"></div>
                 <div className="absolute inset-0 border border-primary/5 rounded-full scale-125"></div>
                 <div className="text-center space-y-2">
                   <div className="text-6xl font-serif font-light text-primary tabular-nums">10:00</div>
                   <div className="text-sm uppercase tracking-widest text-muted-foreground">Minutes</div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Progress Section */}
      <section className="py-24 bg-primary text-primary-foreground">
         <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-6">
                  <h2 className="font-serif text-4xl lg:text-5xl text-white">Watch Your Practice Grow</h2>
                  <p className="text-lg text-primary-foreground/70 leading-relaxed">
                    Track your streak, total minutes, and session history. See your last session at a glance and pick up where you left off. No pressure. No gamification. Just simple awareness of your progress.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
                    <div className="text-4xl font-serif font-bold mb-2">12</div>
                    <div className="text-sm opacity-70">Day Streak</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
                    <div className="text-4xl font-serif font-bold mb-2">340</div>
                    <div className="text-sm opacity-70">Total Minutes</div>
                  </div>
                  <div className="col-span-2 bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                           <BarChart className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold">Last Session</div>
                          <div className="text-xs opacity-60">Yesterday, 8:00 PM</div>
                        </div>
                     </div>
                     <div className="text-xl font-serif">15m</div>
                  </div>
               </div>
            </div>
         </div>
      </section>


      {/* FAQ */}
      <section id="faq" aria-label="Frequently asked questions" className="py-24 max-w-3xl mx-auto px-6">
        <h2 className="font-serif text-3xl mb-8 text-center text-primary">Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "How does the AI music generation work?",
              a: "You describe the mood, imagery, or feeling you want. Choose a style (Ambient, Piano, Nature, etc.) and whether you want instrumental or vocals. Still uses AI to generate a completely original meditation track based on your input."
            },
            {
              q: "How long does it take to generate music?",
              a: "Typically 1-2 minutes. You'll see a progress indicator while your track is being created."
            },
            {
              q: "Can I use my generated music in meditation sessions?",
              a: "Absolutely. Save any track to your library and use it as the soundtrack for timed meditation sessions."
            },
            {
              q: "What devices are supported?",
              a: "Still is available for iPhone running iOS 16 or later."
            }
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium text-lg py-4">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section id="download" aria-label="Download the app" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl -z-10 dark:bg-black/20"></div>
        
        <div className="container mx-auto px-6 text-center space-y-8">
           <h2 className="font-serif text-5xl lg:text-7xl text-primary">Create Your First Track</h2>
           <p className="text-xl text-muted-foreground max-w-xl mx-auto">
             Describe what stillness sounds like to you. We'll make it real.
           </p>
           <a href="https://apps.apple.com/us/app/still-meditation/id6757083149" target="_blank" rel="noopener noreferrer" className="inline-block transition-transform hover:scale-105">
             <img src="/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" alt="Download on the App Store" className="h-16 w-auto" />
           </a>
           <p className="text-sm text-muted-foreground">Available on iOS 16 and later.</p>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 text-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex flex-col items-center md:items-start gap-2">
                <div className="font-serif font-bold text-xl flex items-center gap-2">
                  <img src={logoImage} alt="Still Logo" className="w-6 h-6 object-contain" />
                  Still
                </div>
                <p className="text-muted-foreground">Music Made for Your Practice</p>
             </div>
             
             <div className="flex items-center gap-6 text-muted-foreground">
               <a href="#/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
               <a href="#/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
               <a href="#/support" className="hover:text-foreground transition-colors">Support</a>
             </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/30 text-center text-muted-foreground/60">
            © 2026 Pentridge Media LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
