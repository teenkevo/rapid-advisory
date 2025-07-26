"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  Phone,
  Mail,
  Facebook,
  Linkedin,
  MessageCircle,
  Video,
  DollarSign,
  Cog,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import MobileNav from "@/components/mobile-nav";
import { SchedulerDialog } from "./scheduler-dialog";
import { LoanSimulatorDialog } from "./loan-simulator-dialog";

export default function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isLoanSimulatorOpen, setIsLoanSimulatorOpen] = useState(false);
  const scrollThreshold = 50;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > scrollThreshold && !isScrolled) {
      setIsScrolled(true);
      setShowTopBar(false);
    } else if (latest <= scrollThreshold && isScrolled) {
      setIsScrolled(false);
      setShowTopBar(true);
    }
  });

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Contact Bar - Animates out on scroll down */}
      <AnimatePresence>
        {showTopBar && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-slate-900 text-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-2">
              {/* Desktop layout */}
              <div className="hidden sm:flex flex-row justify-between items-center text-sm">
                <div className="text-xs flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Call +256 782/701 820 404 or +256 393 202 348</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                    <span>info@rapidadvisory.com</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href="https://www.facebook.com/RapidAdvisory"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <Facebook className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/rapid-advisory-services-limited/"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                  <Link
                    href="https://twitter.com/RapidAdvisory"
                    className="hover:text-green-300 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>

              {/* Mobile layout */}
              <div className="flex sm:hidden justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  <Link
                    href="tel:+256782820404"
                    className="hover:text-blue-300 transition-colors relative"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 text-xs font-bold">
                      1
                    </span>
                  </Link>
                  <Link
                    href="tel:+256393202348"
                    className="hover:text-blue-300 transition-colors relative"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 text-xs font-bold">
                      2
                    </span>
                  </Link>
                  <Link
                    href="mailto:info@rapidadvisory.com"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-green-300 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Bar - Always white, shadow appears on scroll */}
      <motion.div
        className="w-full bg-white" // Always has a white background
        animate={{
          boxShadow: isScrolled
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 lg:py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/rapid-advisory-logo.svg"
                alt="Rapid Advisory Logo"
                width={150}
                height={32}
                priority
              />
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link
                href="#products"
                className="px-4 py-2 rounded-full text-slate-700 text-sm hover:bg-slate-100 transition-colors font-medium"
              >
                Products
              </Link>
              <Link
                href="#products"
                className="px-4 py-2 rounded-full text-slate-700 text-sm hover:bg-slate-100 transition-colors font-medium"
              >
                Pricing
              </Link>
              <Link
                href="#team"
                className="px-4 py-2 rounded-full text-slate-700 text-sm hover:bg-slate-100 transition-colors font-medium"
              >
                The Team
              </Link>
              <Link
                href="#contact"
                className="px-4 py-2 rounded-full text-slate-700 text-sm hover:bg-slate-100 transition-colors font-medium"
              >
                Contact Us
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsLoanSimulatorOpen(true)}
                className="group rounded-full border  bg-white shadow-xl hover:bg-[#ed2024]  hover:text-white transition-all duration-300"
              >
                <Cog className="w-4 text-[#ed2024] group-hover:text-white h-4 mr-2" />
                Simulate a loan
              </Button>
              {/* Gradient Border Button */}
              <Button
                size="sm"
                onClick={() => setIsSchedulerOpen(true)}
                className="rounded-full border border-[#ed2024] bg-white shadow-xl text-[#ed2024] hover:shadow-xl hover:bg-[#ed2024] hover:text-white transition-all duration-300"
              >
                <Video className="w-4 h-4 mr-2" />
                Book a call
              </Button>
            </nav>

            {/* Mobile Hamburger Menu */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsLoanSimulatorOpen(true)}
                className="md:hidden group rounded-full border  bg-white shadow-xl hover:bg-[#ed2024]  hover:text-white transition-all duration-300"
              >
                <Cog className="w-4 text-[#ed2024] group-hover:text-white h-4 mr-2" />
                Simulate a loan
              </Button>
              <Button
                size="sm"
                onClick={() => setIsSchedulerOpen(true)}
                className="md:hidden rounded-full border border-[#ed2024] shadow-xl bg-white text-[#ed2024] hover:shadow-xl hover:bg-[#ed2024] hover:text-white transition-all duration-300"
              >
                <Video className="w-4 h-4 mr-2" />
                Book a call
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      <SchedulerDialog
        open={isSchedulerOpen}
        onOpenChange={setIsSchedulerOpen}
      />
      <LoanSimulatorDialog
        open={isLoanSimulatorOpen}
        onOpenChange={setIsLoanSimulatorOpen}
      />
    </header>
  );
}
