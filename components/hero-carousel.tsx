"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Shield, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ApplicationDialog } from "./application-dialog";

const cards = [
  {
    id: 1,
    title: "Working Capital",
    description:
      "Purchase Order Financing, Contract Financing, Invoice Discounting & Supply Chain Solutions",
    image: "/images/business-finance.jpg",
    gradient: "from-black/90 from-10% via-black/60 via-40% to-transparent",
    tags: ["Quick Approval", "Flexible Terms"],
    tagBgColor: "bg-white",
    tagTextColor: "text-slate-800",
    icon: DollarSign,
    activeColor: "text-slate-800",
    progressColor: "bg-slate-800",
    hoverTextColor: "group-hover:text-slate-800",
    serviceKey: "working-capital" as const,
  },
  {
    id: 2,
    title: "Personal Loans",
    description:
      "Ideal for persons with occasional cash flow shortages and emergencies. Quick access to funds.",
    image:
      "https://images.unsplash.com/photo-1647942678221-94be1784f107?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    gradient:
      "from-[#15549a]/90 from-10% via-[#15549a]/60 via-40% to-transparent",
    tags: ["Emergency Funding", "Same Day"],
    tagBgColor: "bg-white",
    tagTextColor: "text-slate-800",
    icon: Shield,
    activeColor: "text-[#15549a]",
    progressColor: "bg-[#15549a]",
    hoverTextColor: "group-hover:text-[#15549a]",
    serviceKey: "personal-loans" as const,
  },
  {
    id: 3,
    title: "Asset Management",
    description:
      "Professional investment management for individuals and companies to increase portfolio value.",
    image:
      "https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?q=80&w=3268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    gradient: "from-black/90 from-10% via-black/60 via-40% to-transparent",
    tags: ["Expert Management", "Growth Focused"],
    tagBgColor: "bg-white",
    tagTextColor: "text-slate-800",
    icon: TrendingUp,
    activeColor: "text-slate-800",
    progressColor: "bg-slate-800",
    hoverTextColor: "group-hover:text-slate-800",
    serviceKey: "asset-management" as const,
  },
];

type ServiceKey = (typeof cards)[number]["serviceKey"];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0); // Key to force progress bar restart
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % cards.length;
        setKey((prev) => prev + 1);
        return nextIndex;
      });
    }, 6000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleCardSelect = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setKey((prev) => prev + 1);
      startTimer();
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="space-y-6">
      {/* Main Carousel Card */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl h-96">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentCard.id}`}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={currentCard.image || "/placeholder.svg"}
              alt={currentCard.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`gradient-${currentCard.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-t ${currentCard.gradient}`}
          />
        </AnimatePresence>

        {/* Content with slide animation */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentCard.id}`}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold mb-2">{currentCard.title}</h3>
              <p className="text-white/90 mb-4 text-sm leading-relaxed max-w-md">
                {currentCard.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <Button
                  onClick={() => setApplicationDialogOpen(true)}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white text-[#ed2024] border-2 border-[#ed2024] transition-all duration-300 ease-in-out hover:bg-red-50 hover:pl-5 hover:pr-3"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </Button>
                <div className="flex items-center space-x-2 text-sm">
                  {currentCard.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`${currentCard.tagBgColor} ${currentCard.tagTextColor} px-3 py-1 rounded-full text-xs font-medium`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Components */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isActive = index === currentIndex;
          return (
            <button
              key={card.id}
              onClick={() => handleCardSelect(index)}
              className="group relative bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="h-0.5 bg-slate-200 relative">
                {isActive && (
                  <motion.div
                    key={`progress-${index}-${key}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className={`h-full ${card.progressColor}`}
                  />
                )}
              </div>
              <div className="p-2 flex items-center space-x-1 md:space-x-2">
                <Icon
                  className={`w-3 h-3 md:w-6 md:h-6 transition-colors duration-300 ${
                    isActive
                      ? card.activeColor
                      : `text-slate-400 ${card.hoverTextColor}`
                  }`}
                />
                <span
                  className={`font-medium text-[9px] md:text-xs transition-colors duration-300 ${
                    isActive
                      ? card.activeColor
                      : `text-slate-400 ${card.hoverTextColor}`
                  }`}
                >
                  {card.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <ApplicationDialog
        defaultService={currentCard.serviceKey}
        open={applicationDialogOpen}
        onOpenChange={() => setApplicationDialogOpen(false)}
      />
    </div>
  );
}
