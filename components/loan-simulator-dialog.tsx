"use client";

import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Building2,
  CreditCard,
  User,
  Phone,
  Check,
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
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "../hooks/use-media-query";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "./ui/phone-input";
import { Textarea } from "./ui/textarea";

interface LoanSimulatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const loanTypes = [
  {
    id: "working-capital",
    name: "Working Capital Financing",
    description: "Short-term business funding",
    icon: Building2,
    minAmount: 500000,
    maxAmount: 50000000,
    minTerm: 3,
    maxTerm: 24,
  },
  {
    id: "personal-loans",
    name: "Personal Loans",
    description: "Personal financing needs",
    icon: CreditCard,
    minAmount: 100000,
    maxAmount: 20000000,
    minTerm: 6,
    maxTerm: 60,
  },
];

const riskFactors = [
  { id: "excellent", label: "Excellent (750+ credit score)", premium: 0 },
  { id: "good", label: "Good (650-749 credit score)", premium: 1 },
  { id: "fair", label: "Fair (550-649 credit score)", premium: 2 },
  { id: "poor", label: "Poor (below 550 credit score)", premium: 4 },
];

const contactFormSchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().refine((value) => isValidPhoneNumber(value || ""), {
    message: "Enter a valid phone number",
  }),
  company: z.string().optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function LoanSimulatorDialog({
  open,
  onOpenChange,
}: LoanSimulatorDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [step, setStep] = useState<"simulator" | "contact" | "confirmation">(
    "simulator"
  );
  const [selectedLoanType, setSelectedLoanType] =
    useState<string>("working-capital");
  const [loanAmount, setLoanAmount] = useState<number[]>([1000000]);
  const [loanTerm, setLoanTerm] = useState<number[]>([12]);
  const [riskProfile, setRiskProfile] = useState<string>("good");

  // Refs for scrollable containers
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  // Calculation states
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
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

  const selectedLoan = loanTypes.find((loan) => loan.id === selectedLoanType);
  const selectedRisk = riskFactors.find((risk) => risk.id === riskProfile);

  // Calculate loan details
  useEffect(() => {
    if (!selectedLoan || !selectedRisk) return;

    const principal = loanAmount[0];
    const termMonths = loanTerm[0];
    const baseRate = 4; // 4% base rate
    const riskPremium = selectedRisk.premium;
    const annualRate = (baseRate + riskPremium) / 100;
    const monthlyRate = annualRate / 12;

    if (monthlyRate === 0) {
      setMonthlyPayment(principal / termMonths);
      setTotalInterest(0);
      setTotalAmount(principal);
    } else {
      const monthlyPaymentCalc =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
      const totalAmountCalc = monthlyPaymentCalc * termMonths;
      const totalInterestCalc = totalAmountCalc - principal;

      setMonthlyPayment(monthlyPaymentCalc);
      setTotalInterest(totalInterestCalc);
      setTotalAmount(totalAmountCalc);
    }

    setEffectiveRate(baseRate + riskPremium);
  }, [loanAmount, loanTerm, riskProfile, selectedLoan]);

  const handleLoanTypeChange = (type: string) => {
    if (type) {
      setSelectedLoanType(type);
      const loan = loanTypes.find((l) => l.id === type);
      if (loan) {
        setLoanAmount([Math.min(loanAmount[0], loan.maxAmount)]);
        setLoanTerm([Math.min(loanTerm[0], loan.maxTerm)]);
      }
    }
  };

  const onContactSubmit = (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    setStep("confirmation");
  };

  const handleClose = () => {
    setStep("simulator");
    reset();
    onOpenChange(false);
  };

  // Scroll to top when step changes - FIXED VERSION
  useEffect(() => {
    const scrollToTop = () => {
      const scrollableElement = isMobile
        ? sheetContentRef.current
        : dialogContentRef.current;

      if (scrollableElement) {
        scrollableElement.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      scrollToTop();
    });
  }, [step, isMobile]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const content = (
    <>
      {step === "simulator" && (
        <div className="space-y-6">
          {/* Loan Type Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold">1. Select Loan Type</h3>
            <ToggleGroup
              type="single"
              value={selectedLoanType}
              onValueChange={handleLoanTypeChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {loanTypes.map((loan) => {
                const Icon = loan.icon;
                return (
                  <ToggleGroupItem
                    key={loan.id}
                    value={loan.id}
                    className="h-auto p-4 border-2 border-slate-200 hover:border-[#ed2024] data-[state=on]:border-[#ed2024] data-[state=on]:bg-red-50 data-[state=on]:text-[#ed2024] rounded-lg transition-all duration-200"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Icon className="h-8 w-8 group-data-[state=on]:text-black" />
                      <div>
                        <h4 className="font-semibold text-sm">{loan.name}</h4>
                        <p className="text-xs text-slate-600 group-data-[state=on]:text-red-700">
                          {loan.description}
                        </p>
                      </div>
                    </div>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>

          {selectedLoan && (
            <>
              {/* Loan Amount */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">2. Loan Amount</h3>
                  <Badge
                    variant="outline"
                    className="text-[#ed2024] border-[#ed2024]"
                  >
                    {formatCurrency(loanAmount[0])}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={loanAmount}
                    onValueChange={setLoanAmount}
                    max={selectedLoan.maxAmount}
                    min={selectedLoan.minAmount}
                    step={50000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatCurrency(selectedLoan.minAmount)}</span>
                    <span>{formatCurrency(selectedLoan.maxAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Loan Term */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">3. Loan Term</h3>
                  <Badge
                    variant="outline"
                    className="text-[#ed2024] border-[#ed2024]"
                  >
                    {loanTerm[0]} months
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={loanTerm}
                    onValueChange={setLoanTerm}
                    max={selectedLoan.maxTerm}
                    min={selectedLoan.minTerm}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{selectedLoan.minTerm} months</span>
                    <span>{selectedLoan.maxTerm} months</span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="space-y-4">
                <h3 className="font-semibold">4. Credit Profile</h3>
                <Select value={riskProfile} onValueChange={setRiskProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your credit profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskFactors.map((risk) => (
                      <SelectItem key={risk.id} value={risk.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{risk.label}</span>
                          <Badge variant="secondary" className="ml-2">
                            +{risk.premium}%
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-semibold">5. Loan Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-[#ed2024] border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-[#ed2024]" />
                        <span className="text-sm font-medium">
                          Monthly Payment
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#ed2024]">
                        {formatCurrency(monthlyPayment)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          Interest Rate
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        {effectiveRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        4% base + {selectedRisk?.premium}% risk premium
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Principal</p>
                        <p className="font-semibold">
                          {formatCurrency(loanAmount[0])}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Interest</p>
                        <p className="font-semibold text-orange-600">
                          {formatCurrency(totalInterest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Repayment</p>
                        <p className="font-semibold text-[#ed2024]">
                          {formatCurrency(totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Principal</span>
                        <span>
                          {((loanAmount[0] / totalAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={(loanAmount[0] / totalAmount) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>Interest</span>
                        <span>
                          {((totalInterest / totalAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep("contact")}
                    className="flex-1 bg-[#ed2024] hover:bg-[#d11d21]"
                  >
                    Apply for This Loan
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-shrink-0 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      )}

      {step === "contact" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Apply for Your Loan</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep("simulator")}
            >
              Back to Simulator
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                {selectedLoan && (
                  <selectedLoan.icon className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm font-light">{selectedLoan?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-light">
                  {formatCurrency(loanAmount[0])}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-light">{loanTerm[0]} months</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-light">
                  {effectiveRate.toFixed(1)}% interest rate
                </span>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-4">
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
              className="w-full bg-[#ed2024] hover:bg-[#d11d21]"
            >
              Submit Loan Application
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
            <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
            <div className="space-y-3 text-sm text-gray-500 font-light leading-5">
              Your loan application has been submitted successfully. A
              confirmation email has been sent to{" "}
              <span className="font-medium">{form.getValues("email")}</span>.
              Our team will contact you at{" "}
              <span className="font-medium">{form.getValues("phone")}</span>{" "}
              within 24 hours.
            </div>
          </div>

          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 space-y-1">
              {selectedLoan && (
                <div className="flex items-center gap-3">
                  <selectedLoan.icon className="h-4 w-4 text-black" />
                  <span className="text-sm font-light">
                    {selectedLoan.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-black" />
                <span className="text-sm font-light">
                  {formatCurrency(loanAmount[0])}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-black" />
                <span className="text-sm font-light">{loanTerm[0]} months</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-black" />
                <span className="text-sm font-light">
                  {effectiveRate.toFixed(1)}% rate
                </span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-black" />
                <span className="text-sm font-light">
                  {form.getValues("name")}
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
        <SheetContent
          ref={sheetContentRef}
          side="bottom"
          className="h-[90vh] overflow-y-auto"
        >
          <SheetHeader>
            {step !== "confirmation" && (
              <>
                <SheetTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#ed2024]" />
                  Loan Calculator
                </SheetTitle>
                <SheetDescription className="text-start">
                  Calculate your loan payments and apply instantly
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
      <DialogContent
        ref={dialogContentRef}
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0"
      >
        <div className="p-6">
          {step !== "confirmation" && (
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#ed2024]" />
                Loan Calculator
              </DialogTitle>
              <DialogDescription>
                Calculate your loan payments and apply instantly
              </DialogDescription>
            </DialogHeader>
          )}
          <div className="mt-6">{content}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
