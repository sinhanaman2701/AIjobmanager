"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
    { id: "personal", title: "Personal Info" },
    { id: "professional", title: "Professional" },
    { id: "preferences", title: "Job Preferences" },
    { id: "additional", title: "Additional" },
];

interface FormData {
    name: string;
    email: string;
    linkedin: string;
    role: string;
    experience: string;
    jobType: string;
    location: string;
    industries: string[];
    additionalInfo: string;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

interface MultiStepFormProps {
    onClose: () => void;
}

const MultiStepForm = ({ onClose }: MultiStepFormProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        linkedin: "",
        role: "",
        experience: "",
        jobType: "",
        location: "",
        industries: [],
        additionalInfo: "",
    });

    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleIndustry = (industry: string) => {
        setFormData((prev) => {
            const industries = [...prev.industries];
            if (industries.includes(industry)) {
                return { ...prev, industries: industries.filter((i) => i !== industry) };
            } else {
                return { ...prev, industries: [...industries, industry] };
            }
        });
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Joined waitlist successfully!");
            setIsSubmitting(false);
            onClose();
        }, 1500);
    };

    // Check if step is valid for next button
    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return formData.name.trim() !== "" && formData.email.trim() !== "";
            case 1:
                return formData.role.trim() !== "" && formData.experience !== "";
            case 2:
                return formData.jobType !== "";
            default:
                return true;
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto py-8 relative">
            <button onClick={onClose} className="absolute -top-2 -right-2 z-10 text-neutral-400 hover:text-white p-2 bg-neutral-900/50 rounded-full backdrop-blur-sm border border-neutral-800 transition-colors">
                <X className="h-5 w-5" />
            </button>

            {/* Progress indicator */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between mb-2 px-2">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center"
                            whileHover={{ scale: 1.1 }}
                        >
                            <motion.div
                                className={cn(
                                    "w-4 h-4 rounded-full cursor-pointer transition-colors duration-300",
                                    index < currentStep
                                        ? "bg-red-600"
                                        : index === currentStep
                                            ? "bg-red-600 ring-4 ring-red-600/20"
                                            : "bg-neutral-800",
                                )}
                                onClick={() => {
                                    // Only allow going back or to completed steps
                                    if (index <= currentStep) {
                                        setCurrentStep(index);
                                    }
                                }}
                                whileTap={{ scale: 0.95 }}
                            />
                            <motion.span
                                className={cn(
                                    "text-xs mt-1.5 hidden sm:block",
                                    index === currentStep
                                        ? "text-red-500 font-medium"
                                        : "text-neutral-500",
                                )}
                            >
                                {step.title}
                            </motion.span>
                        </motion.div>
                    ))}
                </div>
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden mt-2 border border-neutral-800">
                    <motion.div
                        className="h-full bg-red-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </motion.div>

            {/* Form card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="border border-neutral-800 shadow-2xl rounded-3xl overflow-hidden bg-neutral-950/90 backdrop-blur-xl">
                    <div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                            >
                                {/* Step 1: Personal Info */}
                                {currentStep === 0 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="text-white">Tell us about yourself</CardTitle>
                                            <CardDescription className="text-neutral-400">
                                                Let&apos;s start with some basic information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label htmlFor="name" className="text-neutral-200">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        updateFormData("name", e.target.value)
                                                    }
                                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                                                />
                                            </motion.div>
                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label htmlFor="email" className="text-neutral-200">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        updateFormData("email", e.target.value)
                                                    }
                                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                                                />
                                            </motion.div>
                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label htmlFor="linkedin" className="text-neutral-200">
                                                    LinkedIn Profile URL
                                                </Label>
                                                <Input
                                                    id="linkedin"
                                                    placeholder="https://linkedin.com/in/..."
                                                    value={formData.linkedin}
                                                    onChange={(e) =>
                                                        updateFormData("linkedin", e.target.value)
                                                    }
                                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                                                />
                                            </motion.div>
                                        </CardContent>
                                    </>
                                )}

                                {/* Step 2: Professional Background */}
                                {currentStep === 1 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="text-white">Professional Background</CardTitle>
                                            <CardDescription className="text-neutral-400">
                                                Tell us about your professional experience
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label htmlFor="profession" className="text-neutral-200">
                                                    What&apos;s your profession?
                                                </Label>
                                                <Input
                                                    id="profession"
                                                    placeholder="e.g. Designer, Developer, Marketer"
                                                    value={formData.role}
                                                    onChange={(e) =>
                                                        updateFormData("role", e.target.value)
                                                    }
                                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                                                />
                                            </motion.div>

                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label htmlFor="experience" className="text-neutral-200">
                                                    Years of Experience
                                                </Label>
                                                <Select
                                                    value={formData.experience}
                                                    onValueChange={(value) =>
                                                        updateFormData("experience", value)
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id="experience"
                                                        className="bg-neutral-900 border-neutral-800 text-white focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                                                    >
                                                        <SelectValue placeholder="Select experience level" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                                        <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                                                        <SelectItem value="senior">Senior Level (5-8 years)</SelectItem>
                                                        <SelectItem value="lead">Lead/Staff (8+ years)</SelectItem>
                                                        <SelectItem value="executive">Executive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </motion.div>
                                        </CardContent>
                                    </>
                                )}

                                {/* Step 3: Job Preferences */}
                                {currentStep === 2 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="text-white">Job Preferences</CardTitle>
                                            <CardDescription className="text-neutral-400">
                                                What kind of opportunities are you looking for?
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label className="text-neutral-200">
                                                    Preferred Job Type
                                                </Label>
                                                <RadioGroup
                                                    value={formData.jobType}
                                                    onValueChange={(value) =>
                                                        updateFormData("jobType", value)
                                                    }
                                                    className="space-y-2"
                                                >
                                                    {[
                                                        { value: "full-time", label: "Full-time" },
                                                        { value: "contract", label: "Contract / Freelance" },
                                                        { value: "internship", label: "Internship" },
                                                    ].map((type, index) => (
                                                        <motion.div
                                                            key={type.value}
                                                            className={cn(
                                                                "flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-all duration-200",
                                                                formData.jobType === type.value
                                                                    ? "bg-red-500/10 border-red-500/50"
                                                                    : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
                                                            )}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            transition={{ duration: 0.2 }}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                                transition: {
                                                                    delay: 0.1 * index,
                                                                    duration: 0.3,
                                                                },
                                                            }}
                                                        >
                                                            <RadioGroupItem
                                                                value={type.value}
                                                                id={`type-${index + 1}`}
                                                                className="border-neutral-500 text-red-500"
                                                            />
                                                            <Label
                                                                htmlFor={`type-${index + 1}`}
                                                                className="cursor-pointer w-full text-neutral-200"
                                                            >
                                                                {type.label}
                                                            </Label>
                                                        </motion.div>
                                                    ))}
                                                </RadioGroup>
                                            </motion.div>
                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label htmlFor="location" className="text-neutral-200">
                                                    Preferred Location
                                                </Label>
                                                <Input
                                                    id="location"
                                                    placeholder="e.g. Remote, San Francisco, London"
                                                    value={formData.location}
                                                    onChange={(e) =>
                                                        updateFormData("location", e.target.value)
                                                    }
                                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                                                />
                                            </motion.div>
                                        </CardContent>
                                    </>
                                )}

                                {/* Step 4: Additional Info */}
                                {currentStep === 3 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="text-white">Additional Information</CardTitle>
                                            <CardDescription className="text-neutral-400">
                                                Any specific industries or requirements?
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label className="text-neutral-200">Interested Industries</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {[
                                                        "Technology",
                                                        "Finance",
                                                        "Healthcare",
                                                        "Education",
                                                        "E-commerce",
                                                        "Media",
                                                        "Clean Tech",
                                                        "Web3",
                                                    ].map((industry, index) => (
                                                        <motion.div
                                                            key={industry}
                                                            className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent transition-colors"
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            transition={{ duration: 0.2 }}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                                transition: {
                                                                    delay: 0.05 * index,
                                                                    duration: 0.3,
                                                                },
                                                            }}
                                                            onClick={() =>
                                                                toggleIndustry(industry.toLowerCase())
                                                            }
                                                        >
                                                            <Checkbox
                                                                id={`industry-${industry}`}
                                                                checked={formData.industries.includes(
                                                                    industry.toLowerCase(),
                                                                )}
                                                                onCheckedChange={() =>
                                                                    toggleIndustry(industry.toLowerCase())
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor={`industry-${industry}`}
                                                                className="cursor-pointer w-full"
                                                            >
                                                                {industry}
                                                            </Label>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                            <motion.div variants={fadeInUp} className="space-y-2">
                                                <Label htmlFor="additionalInfo">
                                                    Anything else we should know?
                                                </Label>
                                                <Textarea
                                                    id="additionalInfo"
                                                    placeholder="Tell us more about your ideal role..."
                                                    value={formData.additionalInfo}
                                                    onChange={(e) =>
                                                        updateFormData("additionalInfo", e.target.value)
                                                    }
                                                    className="min-h-[80px] transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                />
                                            </motion.div>
                                        </CardContent>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <CardFooter className="flex justify-between pt-6 pb-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className="flex items-center gap-1 transition-all duration-300 rounded-2xl"
                                >
                                    <ChevronLeft className="h-4 w-4" /> Back
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    type="button"
                                    onClick={
                                        currentStep === steps.length - 1 ? handleSubmit : nextStep
                                    }
                                    disabled={!isStepValid() || isSubmitting}
                                    className={cn(
                                        "flex items-center gap-1 transition-all duration-300 rounded-2xl",
                                        currentStep === steps.length - 1 ? "" : "",
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        <>
                                            {currentStep === steps.length - 1 ? "Submit" : "Next"}
                                            {currentStep === steps.length - 1 ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </CardFooter>
                    </div>
                </Card>
            </motion.div>

            {/* Step indicator */}
            <motion.div
                className="mt-4 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </motion.div>
        </div>
    );
};

export default MultiStepForm;
