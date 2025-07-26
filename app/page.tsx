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
                <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
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
      <div id="products" className="scroll-mt-16">
        <ServicesCards />
      </div>

      {/* Team Contact Section */}
      <div id="team" className="scroll-mt-16">
        <TeamContactSection />
      </div>

      {/* Contact Us Section */}
      <div id="contact" className="scroll-mt-16">
        <ContactUsSection />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-white p-2 rounded-lg">
                <div className="text-red-600 font-bold text-xl">RA</div>
              </div>
              <div>
                <h4 className="text-xl font-bold">Rapid Advisory</h4>
                <p className="text-sm text-slate-400">FLEXIBLE FINANCE</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-6">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">A Member of INTERNATIONAL</span>
            </div>

            <div className="flex justify-center space-x-6 mb-6">
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-slate-400 text-sm">
              © 2024 Rapid Advisory. All rights reserved. | Flexible Finance
              Solutions
            </p>
          </div>
        </div>
      </footer>

      <ApplicationDialog
        open={applicationDialogOpen}
        onOpenChange={() => setApplicationDialogOpen(false)}
      />
    </div>
  );
}
