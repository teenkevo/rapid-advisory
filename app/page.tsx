"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Shield,
  TrendingUp,
  CheckCircle,
  Award,
  Facebook,
  Linkedin,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroCarousel from "@/components/hero-carousel";
import Header from "@/components/header";
import ServicesCards from "@/components/services-cards";
import TeamContactSection from "@/components/team-contact";
import ContactUsSection from "@/components/contact";
import { ApplicationDialog } from "@/components/application-dialog";
import Footer from "@/components/footer";

const dynamicWords = [
  "you",
  "your business",
  "your goals",
  "your future",
  "your lifestyle",
  "your success",
  "your journey",
  "your vision",
  "your growth",
  "your wealth",
  "your freedom",
];

export default function Component() {
  const [index, setIndex] = useState(0);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % dynamicWords.length);
    }, 3000); // Change text every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // The brand red from the logo is a deep red, let's use a very light shade for the hero.
  const heroBackgroundColor = "bg-white"; // Very light shade of red

  return (
    <div className="min-h-screen">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className={`pt-48 pb-10 px-4 ${heroBackgroundColor}`}>
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Stats and Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-[2rem] md:text-5xl font-extrabold text-black mb-6 leading-tight">
                  <span className="block">Financial flexibility for</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={dynamicWords[index]}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="inline-block border-2 border-[#ed2024] text-slate-800 px-3 py-1 rounded-md mt-2"
                    >
                      {dynamicWords[index]}
                    </motion.span>
                  </AnimatePresence>
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Lack of money and good advice keep hundreds of people from
                  achieving their dreams.
                </p>
              </div>

              {/* Stats - In a row, smaller */}
              <div className="flex flex-row gap-6 sm:gap-8 items-center justify-start">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    Businesses Funded
                  </div>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">
                    $50M+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    Funding Deployed
                  </div>
                </div>
                <div className="w-12 sm:w-auto">
                  <Image
                    src="https://www.rapidadvisory.com/ifa.png"
                    alt="International Factoring Association Member"
                    width={54}
                    height={64}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex">
                <Button
                  onClick={() => setApplicationDialogOpen(true)}
                  size="lg"
                  className="bg-[#ed2024] hover:bg-[#c41a1d] text-white px-8 py-3 rounded-full"
                >
                  Apply Now
                </Button>
              </div>
            </div>

            {/* Right Side - Hero Carousel */}
            <div className="relative">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div id="products" className="scroll-mt-24">
        <ServicesCards />
      </div>

      {/* Team Contact Section */}
      <div id="about-us" className="scroll-mt-24">
        <TeamContactSection />
      </div>

      {/* Footer */}
      <div id="contact" className="scroll-mt-16">
        <Footer />
      </div>

      <ApplicationDialog
        open={applicationDialogOpen}
        onOpenChange={() => setApplicationDialogOpen(false)}
      />
    </div>
  );
}
