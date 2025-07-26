"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  Mail,
  Phone,
  Check,
  Building2,
  CreditCard,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PhoneInput } from "./ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useMediaQuery } from "../hooks/use-media-query";

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: "working-capital" | "personal-loans" | "asset-management";
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

const workingCapitalOptions = [
  {
    id: "purchase-order",
    name: "Purchase Order Financing",
    description: "Funding to fulfill customer orders",
  },
  {
    id: "contract",
    name: "Contract Financing",
    description: "Advance funding based on contracts",
  },
  {
    id: "invoice-discounting",
    name: "Invoice Discounting",
    description: "Immediate cash for outstanding invoices",
  },
  {
    id: "seasonal",
    name: "Seasonal Financing",
    description: "Funding for seasonal business needs",
  },
  {
    id: "supply-chain",
    name: "Supply Chain Financing",
    description: "Optimize cash flow in supply chain",
  },
];

const personalLoanAmounts = [
  {
    id: "less-1m",
    name: "Less than 1M UGX",
    description: "Small personal loans",
  },
  {
    id: "1m-10m",
    name: "1M - 10M UGX",
    description: "Medium personal loans",
  },
  {
    id: "10m-plus",
    name: "10M+ UGX",
    description: "Large personal loans",
  },
];

const assetPortfolioSizes = [
  {
    id: "less-10m",
    name: "Less than 10M UGX",
    description: "Small portfolio management",
  },
  {
    id: "10m-50m",
    name: "10M - 50M UGX",
    description: "Medium portfolio management",
  },
  {
    id: "100m-plus",
    name: "100M+ UGX",
    description: "Large portfolio management",
  },
];

const formSchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().refine((value) => isValidPhoneNumber(value || ""), {
    message: "Enter a valid phone number",
  }),
  company: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ApplicationDialog({
  open,
  onOpenChange,
  defaultService,
}: ApplicationDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [step, setStep] = useState<
    "service" | "options" | "details" | "confirmation"
  >("service");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [initialDefaultServiceSet, setInitialDefaultServiceSet] =
    useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
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

  useEffect(() => {
    if (open) {
      // Only initialize state if it's the first time the dialog is opened in this session
      if (!initialDefaultServiceSet) {
        reset(); // Reset form on initial open
        setSelectedOption(""); // Reset selected option on initial open

        if (defaultService) {
          setSelectedService(defaultService);
          setStep("options");
        } else {
          setSelectedService("");
          setStep("service");
        }
        setInitialDefaultServiceSet(true);
      }
      // If dialog is already open (initialDefaultServiceSet is true), do nothing here
      // to prevent external defaultService changes from affecting current interaction.
    } else {
      // Dialog is closing
      setInitialDefaultServiceSet(false); // Reset for next opening
      setSelectedService(""); // Reset service on close
      setSelectedOption(""); // Reset option on close
      setStep("service"); // Reset step on close
      reset(); // Reset form on close
    }
  }, [open, defaultService, reset, initialDefaultServiceSet]);

  const handleServiceSelect = (service: string) => {
    if (service) {
      setSelectedService(service);
      setSelectedOption(""); // Reset selected option when service changes
      setStep("options");
    }
  };

  const handleOptionSelect = (option: string) => {
    if (option) {
      setSelectedOption(option);
      setStep("details");
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Application submitted:", {
      ...data,
      service: selectedService,
      option: selectedOption,
    });
    setStep("confirmation");
  };

  const handleClose = () => {
    // Reset all state when closing
    setStep("service");
    setSelectedService("");
    setSelectedOption("");
    reset();
    setInitialDefaultServiceSet(false); // Ensure this is reset on close
    onOpenChange(false);
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const getOptionsForService = () => {
    switch (selectedService) {
      case "working-capital":
        return workingCapitalOptions;
      case "personal-loans":
        return personalLoanAmounts;
      case "asset-management":
        return assetPortfolioSizes;
      default:
        return [];
    }
  };

  const getSelectedOptionData = () => {
    const options = getOptionsForService();
    return options.find((o) => o.id === selectedOption);
  };

  const getOptionsTitle = () => {
    switch (selectedService) {
      case "working-capital":
        return "2. Select Financing Type";
      case "personal-loans":
        return "2. Select Loan Amount";
      case "asset-management":
        return "2. Select Portfolio Size";
      default:
        return "2. Select Option";
    }
  };

  const content = (
    <>
      {step === "service" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-4">1. Select a Service</h3>
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
                        <Icon className="h-6 w-6 group-data-[state=on]:text-black" />
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
            Choose the service you would like to apply for.
          </p>
        </div>
      )}
      {step === "options" && (
        <div className="space-y-4">
          {selectedServiceData && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">1. Service Details</h3>
              </div>
              <Card className="border-gray-200 border-2">
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
            <h3 className="font-semibold">{getOptionsTitle()}</h3>
          </div>
          <div>
            <ToggleGroup
              type="single"
              value={selectedOption}
              onValueChange={handleOptionSelect}
              className="items-stretch flex-col gap-3 w-full"
            >
              {getOptionsForService().map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <ToggleGroupItem
                    value={option.id}
                    className="w-full h-auto p-4 border-2 border-slate-200 hover:border-[#039744] data-[state=on]:border-[#039744] data-[state=on]:bg-[#039744]/10 data-[state=on]:text-[#039744] rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 text-left w-full">
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-data-[state=on]:bg-[#039744]/10">
                        <DollarSign className="h-5 w-5 text-slate-600 group-data-[state=on]:text-[#039744]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">
                          {option.name}
                        </h4>
                        <p className="text-sm text-slate-600 group-data-[state=on]:text-[#039744]">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </ToggleGroupItem>
                </motion.div>
              ))}
            </ToggleGroup>
          </div>
        </div>
      )}
      {step === "details" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">3. Application Details</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep("options")}
            >
              Change Option
            </Button>
          </div>
          <Card className="border-gray-200 border-2">
            <CardContent className="p-4 space-y-1">
              {selectedServiceData && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-black">
                    {selectedServiceData.name}
                  </span>
                </div>
              )}
              {getSelectedOptionData() && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <p className="text-xs text-gray-500">
                    {getSelectedOptionData()?.name}
                  </p>
                </div>
              )}
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
              <Label htmlFor="company">Company/Organization</Label>
              <Input
                id="company"
                {...register("company")}
                placeholder="Your Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Information (Optional)</Label>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Tell us more about your requirements, timeline, or any specific needs..."
                rows={4}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#039744]/90 hover:bg-[#039744]"
            >
              Submit Application
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
            <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
            <div className="space-y-3 text-sm text-gray-500 font-light leading-5">
              A confirmation email has been sent to{" "}
              <span className="font-medium">{form.getValues("email")}</span>.
              Our team will contact you at{" "}
              <span className="font-medium">{form.getValues("phone")}</span>{" "}
              within 24-48 hours to let you know what's next.
            </div>
          </div>
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 p-4 space-y-1">
              {selectedServiceData && (
                <div className="flex items-center gap-3">
                  <selectedServiceData.icon className="h-4 w-4 text-black" />
                  <span className="text-sm font-light">
                    {selectedServiceData.name}
                  </span>
                </div>
              )}
              {getSelectedOptionData() && (
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-black" />
                  <span className="text-sm font-light">
                    {getSelectedOptionData()?.name}
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
              {form.getValues("company") && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-black" />
                  <span className="text-sm font-light">
                    {form.getValues("company")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="space-y-3 text-sm text-gray-500 font-light">
            <p>Please prepare any required documents for faster processing</p>
          </div>
          <Button
            onClick={handleClose}
            className="w-full bg-[#039744]/90 hover:bg-[#039744]"
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
                  <FileText className="h-5 w-5 text-[#039744]" /> Apply for
                  Financial Services
                </SheetTitle>
                <SheetDescription className="text-start">
                  Submit your application for our financial services
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          {step !== "confirmation" && (
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#039744]" /> Apply for
                Financial Services
              </DialogTitle>
              <DialogDescription>
                Submit your application for our financial services
              </DialogDescription>
            </DialogHeader>
          )}
          <div className="mt-6">{content}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
