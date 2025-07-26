"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { ApplicationDialog } from "./application-dialog";

const services = [
  {
    title: "Working Capital",
    description:
      "We offer a diverse range of working capital solutions, including Purchase Order Financing, Contract Financing, Invoice Discounting, and Seasonal Financing to ensure your operations run smoothly.",
    borderColor: "border-t-8 border-red-600",
    logos: ["300+ Clients"],
    price: "Interest rate is 4% + risk premium",
  },
  {
    title: "Personal Loans",
    description:
      "Our personal loans are ideal for individuals experiencing occasional cash flow shortages or facing unexpected emergencies, providing quick and reliable access to funds when you need them most.",
    borderColor: "border-t-8 border-red-600",
    logos: ["100+ Clients"],
    price: "Interest rate is 4% + risk premium",
  },
  {
    title: "Asset Management",
    description:
      "Rapid manages commercial investments for individuals and companies to increase their value, and helps raise capital through private placement while managing the private shareholder register.",
    borderColor: "border-t-8 border-red-600",
    logos: ["20+ Companies"],
    price: "Competitive Management Fees",
  },
];

export default function ServicesCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<
    "working-capital" | "personal-loans" | "asset-management" | undefined
  >(undefined);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="py-10 px-4 bg-white" ref={ref}>
      <div className="container mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <motion.div
            className="flex justify-between items-end mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Our financial solutions
              </h2>
              <p className="text-lg text-slate-600">
                Comprehensive financial services designed to help you achieve
                your goals, from personal needs to business growth.
              </p>
            </div>
            <div className="hidden space-x-2 md:flex">
              <CarouselPrevious className="relative top-0 left-0 right-0 translate-x-0 translate-y-0" />
              <CarouselNext className="relative top-0 left-0 right-0 translate-x-0 translate-y-0" />
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <CarouselContent>
              {services.map((service, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 flex"
                >
                  <motion.div className="w-full" variants={cardVariants}>
                    <Card
                      className={`h-full w-full duration-300 ${service.borderColor}`}
                    >
                      <CardContent className="p-8 flex flex-col h-full">
                        {/* This div grows to push the footer down, ensuring consistent layout */}
                        <div className="flex-grow">
                          <h4 className="text-2xl font-bold text-slate-800 mb-3">
                            {service.title}
                          </h4>
                          <p className="text-slate-600 mb-6 leading-relaxed">
                            {service.description}
                          </p>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setApplicationDialogOpen(true);
                              setDefaultService(
                                service.title
                                  .toLowerCase()
                                  .replace(" ", "-") as
                                  | "working-capital"
                                  | "personal-loans"
                                  | "asset-management"
                              );
                            }}
                            className="group rounded-full inline-flex items-center text-sm font-semibold text-red-600/90 hover:text-red-600"
                          >
                            Apply Now
                            <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                          <p className="text-xs text-slate-600 mt-3 uppercase font-light tracking-wider">
                            {service.price}
                          </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-200">
                          <p className="text-xs text-black mb-3 uppercase font-semibold tracking-wider">
                            Trusted By
                          </p>
                          <div className="flex items-center gap-6 text-slate-500 font-medium">
                            {service.logos.map((logo) => (
                              <div key={logo}>{logo}</div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </motion.div>
          <div className="md:hidden flex justify-center space-x-2 mt-6">
            <CarouselPrevious className="relative top-0 left-0 right-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative top-0 left-0 right-0 translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
      <ApplicationDialog
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
        defaultService={defaultService}
      />
    </section>
  );
}
