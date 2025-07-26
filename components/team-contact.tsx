"use client";

import type React from "react";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, Mail, Twitter, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchedulerDialog } from "./scheduler-dialog";

const teamMembers = [
  {
    id: 1,
    name: "Leonard K Mutesasira",
    role: "Executive Director",
    image: "https://www.rapidadvisory.com/team/ST-L.jpg",
  },
  {
    id: 2,
    name: "Grace N. Sasira",
    role: "Managing Director",
    image: "https://www.rapidadvisory.com/team/md.png",
  },
  {
    id: 3,
    name: "Sarah N. Muganzi",
    role: "Chief Operations Officer",
    image: "https://www.rapidadvisory.com/team/ST-22e.jpg",
  },
  {
    id: 4,
    name: "Yunia N. Ssengooba",
    role: "Chief Technical Advisor",
    image: "https://www.rapidadvisory.com/team/yuni.jpg",
  },
];

export default function TeamContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="py-10 px-4 bg-gray-50" ref={ref}>
      <div className="container mx-auto">
        {/* Team Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            The team that makes things happen
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            Get help 24/7, with our award-winning support network of payments
            experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setIsSchedulerOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-3 bg-transparent"
            >
              <Video className="w-6 h-6 mr-1" />
              Book a call
            </Button>
            <Link href="#contact">
              <Button
                size="sm"
                className="bg-[#ed2024] hover:bg-[#c41a1d] text-white rounded-full px-4 py-2"
              >
                Get in touch
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              className="group cursor-pointer"
              variants={itemVariants}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-200 aspect-[4/5] hover:shadow-lg transition-all duration-300">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Glass overlay with name and title */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                  <h3 className="text-xs md:text-base font-semibold text-slate-800 mb-1 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600">
                    {member.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Photo Section */}
        <motion.div
          className="relative overflow-hidden rounded-2xl mb-16 h-[300px] md:h-[650px]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <Image
            src="https://www.rapidadvisory.com/team.jpg"
            alt="The Rapid Advisory Team"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
            sizes="100vw"
          />
        </motion.div>
      </div>
      <SchedulerDialog
        open={isSchedulerOpen}
        onOpenChange={setIsSchedulerOpen}
      />
    </section>
  );
}
