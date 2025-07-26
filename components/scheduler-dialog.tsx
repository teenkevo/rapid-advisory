"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { isValidPhoneNumber } from "react-phone-number-input";
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
  email: z.string().email("Enter a valid email address"),
  phone: z.string().refine((value) => isValidPhoneNumber(value || ""), {
    message: "Enter a valid phone number",
  }),
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  const handleServiceSelect = (service: string) => {
    if (service) {
      setSelectedService(service);
      setStep("date");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // On mobile, go to time step; on desktop, stay on date step
      if (isMobile) {
        setStep("time");
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setStep("confirmation");
  };

  const handleClose = () => {
    setStep("service");
    setSelectedService("");
    setSelectedDate(undefined);
    setSelectedTime("");
    reset();
    onOpenChange(false);
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const dayOfWeek = date.getDay();
    // Disable weekends (0 = Sunday, 6 = Saturday) and past dates
    return dayOfWeek === 0 || dayOfWeek === 6 || !isAfter(date, today);
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  // Calculate dialog width based on whether date is selected
  const getDialogWidth = () => {
    if (isMobile) return "100%"; // Mobile uses sheet, so this doesn't matter
    if (step === "date" && selectedDate) {
      return "580px"; // Expanded width for calendar + time slots
    }
    return "500px"; // Default width for just calendar
  };

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
                    className="w-full h-auto p-4 border-2 border-slate-200 hover:border-[#039744] data-[state=on]:border-[#039744] data-[state=on]:bg-[#039744]/10 data-[state=on]:text-[#039744] rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 text-left w-full">
                      <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-data-[state=on]:bg-[#039744]/10">
                        <Icon className="h-6 w-6  group-data-[state=on]:text-black" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">
                          {service.name}
                        </h4>
                        <p className="text-sm text-slate-600 group-data-[state=on]:text-[#039744]">
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
                <h3 className="font-semibold">1. Service Details</h3>
              </div>
              <Card className="border-gray-200 border-2 ">
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
            <h3 className="font-semibold">
              {isMobile ? "2. Select a Date" : "3. Select Date & Time"}
            </h3>
          </div>
          {isMobile ? (
            // Mobile: Full width calendar only
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                initialFocus
                className="w-full"
              />
            </div>
          ) : (
            // Desktop: Side-by-side layout with animation
            <motion.div
              className="flex gap-4"
              layout
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Calendar */}
              <div className="flex-shrink-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  initialFocus
                  className="rounded-md border"
                />
              </div>
              {/* Time slots column - animated entry */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "192px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="w-48">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4 text-[#039744]" />
                          <span className="text-sm font-medium">
                            {format(selectedDate, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                        {timeSlots.map((time, index) => (
                          <motion.div
                            key={time}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              duration: 0.2,
                              delay: index * 0.03,
                              ease: "easeOut",
                            }}
                          >
                            <Button
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className={`w-full justify-start font-light text-sm ${
                                selectedTime === time
                                  ? "bg-[#039744] hover:bg-[#039744] text-white"
                                  : "hover:bg-[#039744]/10 hover:border-[#039744] bg-transparent"
                              }`}
                              onClick={() => handleTimeSelect(time)}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              {time}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {step === "time" && selectedDate && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">3. Select a Time</h3>
            <Button variant="outline" size="sm" onClick={() => setStep("date")}>
              Change Date
            </Button>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-4 w-4 text-[#039744]" />
                <span className="text-sm">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="justify-start font-light text-sm hover:bg-red-50 hover:border-[#039744] bg-transparent"
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
            <h3 className="font-semibold">4. Your Information</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(isMobile ? "time" : "date")}
            >
              Change {isMobile ? "Time" : "Date/Time"}
            </Button>
          </div>
          <Card>
            <CardContent className="p-4 space-y-1">
              {selectedServiceData && (
                <div className="flex items-center gap-2 mb-2">
                  <selectedServiceData.icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-light">
                    {selectedServiceData.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-light">
                  {format(selectedDate!, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-light">{selectedTime}</span>
                <Badge variant="outline" className="bg-white border-[#039744]">
                  30 minutes
                </Badge>
              </div>
            </CardContent>
          </Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" {...register("name")} placeholder="John Doe" />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      id="phone"
                      defaultCountry="UG"
                      placeholder="Enter a phone number e.g. +256 792 445002"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">
                What would you like to discuss? (Optional)
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Brief description of your financial goals or questions..."
                rows={3}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#039744] hover:bg-[#039744]"
            >
              Confirm Appointment
            </Button>
          </form>
        </div>
      )}

      {step === "confirmation" && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-[#039744]/20 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-[#039744]" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Appointment Confirmed!</h3>
            <div className=" space-y-3 text-sm text-gray-500 font-light leading-5">
              A confirmation email has been sent to{" "}
              <span className="font-medium">{form.getValues("email")}</span>.
              We'll call you at{" "}
              <span className="font-medium">{form.getValues("phone")}</span> at
              the scheduled time.
            </div>
          </div>
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 space-y-1">
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
                <span className="text-sm font-light">
                  {form.getValues("name")}
                </span>
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
                <span className="text-sm font-light truncate">
                  {form.getValues("email")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-black" />
                <span className="text-sm font-light">
                  {form.getValues("phone")}
                </span>
              </div>
            </CardContent>
          </Card>
          <Button
            onClick={handleClose}
            className="bg-[#039744] hover:bg-[#039744] w-full"
          >
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
            {step !== "confirmation" && (
              <>
                <SheetTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-[#039744]" />
                  Schedule Your Consultation
                </SheetTitle>
                <SheetDescription className="text-start">
                  Book a free 30-minute consultation with our financial experts
                </SheetDescription>
              </>
            )}
          </SheetHeader>
          <div className="mt-6">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <motion.div
        animate={{ width: getDialogWidth() }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mx-auto"
      >
        <DialogContent
          className="max-h-[90vh] overflow-y-auto p-0"
          style={{ width: "100%", maxWidth: getDialogWidth() }}
        >
          <div className="p-6">
            {step !== "confirmation" && (
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-[#039744]" />
                  Schedule Your Consultation
                </DialogTitle>
                <DialogDescription>
                  Book a free 30-minute consultation with our financial experts
                </DialogDescription>
              </DialogHeader>
            )}
            <div className="mt-6">{content}</div>
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
