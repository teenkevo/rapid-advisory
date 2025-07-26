"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import {
  CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  Check,
  Building2,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { format, isAfter, startOfDay } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PhoneInput } from "./ui/phone-input";
import { E164Number } from "libphonenumber-js";
import { useMediaQuery } from "../hooks/use-media-query";

interface SchedulerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const services = [
  {
    id: "working-capital",
    name: "Working Capital Financing",
    description: "Short-term funding for business operations",
    icon: Building2,
  },
  {
    id: "personal-loans",
    name: "Personal Loans",
    description: "Flexible financing for personal needs",
    icon: CreditCard,
  },
  {
    id: "asset-management",
    name: "Asset Management",
    description: "Professional investment portfolio management",
    icon: TrendingUp,
  },
];

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
];

const formSchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Required"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function SchedulerDialog({ open, onOpenChange }: SchedulerDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [step, setStep] = useState<
    "service" | "date" | "time" | "details" | "confirmation"
  >("service");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateField = (field: keyof FormData, value: string) => {
    try {
      if (field === "name") {
        formSchema.shape.name.parse(value);
      } else if (field === "email") {
        formSchema.shape.email.parse(value);
      } else if (field === "phone") {
        formSchema.shape.phone.parse(value);
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === field);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        }
      }
    }
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    validateField("name", value);
  };

  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
    validateField("email", value);
  };

  const handlePhoneChange = (phone: E164Number | undefined) => {
    const value = phone || "";
    setFormData((prev) => ({ ...prev, phone: value }));
    validateField("phone", value);
  };

  const handleServiceSelect = (service: string) => {
    if (service) {
      setSelectedService(service);
      setStep("date");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setStep("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = formSchema.parse(formData);
      setErrors({});
      setStep("confirmation");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<FormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleClose = () => {
    setStep("service");
    setSelectedService("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    onOpenChange(false);
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const dayOfWeek = date.getDay();
    // Disable weekends (0 = Sunday, 6 = Saturday) and past dates
    return dayOfWeek === 0 || dayOfWeek === 6 || !isAfter(date, today);
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const content = (
    <>
      {step === "service" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-4">Select a Service</h3>
            <ToggleGroup
              type="single"
              value={selectedService}
              onValueChange={handleServiceSelect}
              className="flex flex-col gap-3"
            >
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <ToggleGroupItem
                    key={service.id}
                    value={service.id}
                    className="w-full h-auto p-4 border-2 border-slate-200 hover:border-[#ed2024] data-[state=on]:border-[#ed2024] data-[state=on]:bg-red-50 data-[state=on]:text-[#ed2024] rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 text-left w-full">
                      <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-data-[state=on]:bg-red-100">
                        <Icon className="h-6 w-6  group-data-[state=on]:text-black" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">
                          {service.name}
                        </h4>
                        <p className="text-sm text-slate-600 group-data-[state=on]:text-red-700">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
          <p className="text-sm text-slate-600">
            Choose the service you're interested in discussing during your
            consultation.
          </p>
        </div>
      )}

      {step === "date" && (
        <div className="space-y-4">
          {selectedServiceData && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Service Details</h3>
              </div>
              <Card className="border-red-500 border-2 ">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-sm font-medium text-black">
                        {selectedServiceData.name}
                      </span>
                      <p className="text-xs text-gray-500">
                        {selectedServiceData.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep("service")}
                    >
                      Change Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Select a Date</h3>
          </div>

          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
              className="rounded-md border"
            />
          </div>
          <p className="text-sm text-slate-600">
            Available Monday through Friday. Weekend appointments available upon
            request.
          </p>
        </div>
      )}

      {step === "time" && selectedDate && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Select a Time</h3>
            <Button variant="ghost" size="sm" onClick={() => setStep("date")}>
              Change Date
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-4 w-4 text-[#ed2024]" />
                <span className="text-sm">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="justify-start font-light text-sm hover:bg-red-50 hover:border-[#ed2024] bg-transparent"
                    onClick={() => handleTimeSelect(time)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === "details" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Your Information</h3>
            <Button variant="outline" size="sm" onClick={() => setStep("time")}>
              Change Time
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-1">
              {selectedServiceData && (
                <div className="flex items-center gap-2 mb-2">
                  <selectedServiceData.icon className="h-4 w-4 text-[#ed2024]" />
                  <span className="text-sm">{selectedServiceData.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-[#ed2024]" />
                <span className="text-sm">
                  {format(selectedDate!, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#ed2024]" />
                <span className="text-sm">{selectedTime}</span>
                <Badge variant="secondary">30 minutes</Badge>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <PhoneInput
                  id="phone"
                  defaultCountry="UG"
                  placeholder="Enter a phone number e.g. +256 792 445002"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                What would you like to discuss? (Optional)
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Brief description of your financial goals or questions..."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ed2024] hover:bg-[#d11d21]"
            >
              Confirm Appointment
            </Button>
          </form>
        </div>
      )}

      {step === "confirmation" && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-[#ed2024]" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Appointment Confirmed!</h3>
            <div className=" space-y-3 text-sm text-gray-500 font-light leading-5">
              A confirmation email has been sent to{" "}
              <span className="font-medium">{formData.email}</span>. We'll call
              you at <span className="font-medium">{formData.phone}</span> at
              the scheduled time.
            </div>
          </div>

          <Card>
            <CardContent className="grid grid-cols-2 gap-2 p-4 space-y-1">
              {selectedServiceData && (
                <div className="flex items-center gap-3">
                  <selectedServiceData.icon className="h-4 w-4 text-black" />
                  <span className="text-sm font-light">
                    {selectedServiceData.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-black" />
                <span className="text-sm font-light">{formData.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-4 w-4 text-black" />
                <span className="text-sm font-light">
                  {format(selectedDate!, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-black" />
                <span className="text-sm font-light">
                  {selectedTime} (30 minutes)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-black" />
                <span className="text-sm font-light">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-black" />
                <span className="text-sm font-light">{formData.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-[#ed2024]" />
              Schedule Your Consultation
            </SheetTitle>
            <SheetDescription>
              Book a free 30-minute consultation with our financial experts
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#ed2024]" />
            Schedule Your Consultation
          </DialogTitle>
          <DialogDescription>
            Book a free 30-minute consultation with our financial experts
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
