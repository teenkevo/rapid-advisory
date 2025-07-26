import Link from "next/link";
import darkModeLogo from "/public/logo-on-dark.png";
import lightModeLogo from "/public/logo-on-light.png";
import {
  Github,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  ArrowRightIcon,
  MessageCircle,
  LinkedinIcon,
  FacebookIcon,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ApplicationDialog } from "./application-dialog";

export default function Footer() {
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  return (
    <footer className="bg-gradient-to-b md:bg-gradient-to-r from-black via-black/80 to-black/70 rounded-t-3xl text-[#8B949E] px-5 md:px-20 py-16 mx-2 md:mx-2">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo */}
          <div className="md:col-span-2">
            <Link href="/" className="text-white">
              <Image
                src="/images/rapid-advisory-logo.svg"
                width="150"
                height="120"
                alt="GETLAB logo light mode"
                className=" block dark:hidden"
                priority={true}
              />
            </Link>

            <h2 className="text-2xl md:text-3xl font-bold text-white mt-5">
              We are always here to help
            </h2>

            <div className="space-y-4">
              <ul className="space-y-3 mb-10 text-sm">
                <li className="mt-10 text-lg text-white transition-colors">
                  Rapid Advisory Services Limited
                </li>
                <li className=" transition-colors">
                  Ground Floor, Rwenzori Courts, 1 Lumumba Avenue, Nakasero
                  Hill, Kampala, Uganda, East Africa.
                </li>
                <li className=" transition-colors">
                  +256 782/701 820 404 or +256 393 202 348
                </li>
                <li className=" transition-colors">
                  info@rapidadvisory.com | www.rapidadvisory.com
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <div className="flex">
                  <Button
                    onClick={() => setApplicationDialogOpen(true)}
                    size="sm"
                    className="bg-[#ed2024] hover:bg-[#c41a1d] text-white px-8 py-3 rounded-full"
                  >
                    Apply Now
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsSchedulerOpen(true)}
                    className="rounded-full border border-[#ed2024] bg-white shadow-xl text-[#ed2024] hover:shadow-xl hover:text-black hover:bg-white transition-all duration-300"
                  >
                    <Video className="w-4 h-4" />
                    Book a call
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Column */}

            {/* Ready to get started section */}
            <div className="space-y-4 col-span-4 lg:col-span-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7571612136244!2d32.576005774688284!3d0.31724316402515057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbbed59c0ad71%3A0x77b4ffa372793d51!2sRapid%20Advisory!5e0!3m2!1sen!2sbe!4v1753511393113!5m2!1sen!2sbe"
                width="100%"
                height="400"
                style={{
                  border: "2px solid #ed2024",
                  borderRadius: "10px",
                }}
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap text-white items-center gap-4 text-xs">
            <span>
              RAPID ADVISORY SERVICES LIMITED © {new Date().getFullYear()}
            </span>

            <Link
              href="/privacy-policy"
              className="text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://twitter.com/RapidAdvisory"
              className="text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://www.facebook.com/RapidAdvisory"
              className="text-white transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://www.linkedin.com/company/rapid-advisory-services-limited/"
              className="text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
      <ApplicationDialog
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
      />
    </footer>
  );
}
