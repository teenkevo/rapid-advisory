"use client";

import type React from "react";

import { useState } from "react";
import { Phone, MessageCircle, Mail, Twitter, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";

export default function ContactUsSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section className="py-10 px-4 bg-white">
      <div className="container mx-auto">
        {/* Contact Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                We are always{" "}
                <span className="text-[#ed2024]">here to help</span>
              </h2>
              <p className="text-gray-500 mb-4 mt-5">
                Call our team Mon-Fri from 8am to 5pm.
              </p>
              <div className="flex items-center space-x-2 text-black">
                <Phone className="w-5 h-5" />
                <span className="font-semibold">+256 782/701 820 404</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Chat with us
              </h3>
              <p className="text-gray-500 mb-4">
                Speak to our friendly team via live chat.
              </p>
              <div className="space-y-3">
                <button className="flex items-center space-x-2 text-black hover:text-[#ed2024] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">Start a live chat</span>
                </button>
                <button className="flex items-center space-x-2 text-black hover:text-[#ed2024] transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">Shoot us an email</span>
                </button>
                <button className="flex items-center space-x-2 text-black hover:text-[#ed2024] transition-colors">
                  <Twitter className="w-5 h-5" />
                  <span className="font-semibold">Message us on Twitter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    First name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="border-slate-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Last name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="border-slate-300 "
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-slate-300"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Phone number
                </label>

                <PhoneInput
                  defaultCountry="UG"
                  placeholder="Enter a phone number e.g. +256 792 445002"
                  value={formData.phone}
                  onChange={(value) => handleInputChange("phone", value || "")}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Leave us a message..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="border-slate-300"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className=" text-white py-3 rounded-full bg-[#ed2024] hover:bg-[#c41a1d]"
              >
                Send message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
