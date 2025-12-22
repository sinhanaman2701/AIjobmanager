"use client";
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { SaveButton } from "@/components/ui/save-button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";


export function SignupForm({ onClose }: { onClose?: () => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [open, setOpen] = useState(false);
    // const [countryCode, setCountryCode] = useState("+1"); // Removed

    const handleSave = async () => {
        if (formRef.current && formRef.current.reportValidity()) {
            try {
                const formData = new FormData(formRef.current);
                const data: any = Object.fromEntries(formData.entries());
                // data.country_code = countryCode; // Removed

                const response = await fetch('/api/waitlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    console.log("Form submitted");
                    toast.success("Joined waitlist successfully!");
                    // Close after a short delay
                    setTimeout(() => {
                        if (onClose) onClose();
                    }, 1000);
                    return true;
                } else {
                    const error = await response.json();
                    toast.error(error.error || "Failed to join");
                    return false;
                }
            } catch (e) {
                console.error(e);
                toast.error("An error occurred");
                return false;
            }
        } else {
            toast.error("Please fill in all required fields");
            return false;
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black border border-neutral-800 relative">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1"
                >
                    <X className="h-5 w-5" />
                </button>
            )}

            <h2 className="font-bold text-xl text-neutral-200">
                Join the Waitlist
            </h2>
            <p className="text-neutral-400 text-sm max-w-sm mt-2">
                Get early access to JobMatcher.ai and supercharge your career search.
            </p>

            <form ref={formRef} className="my-8" onSubmit={(e) => e.preventDefault()}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="name" className="text-neutral-200">Full Name</Label>
                    <Input
                        id="name"
                        name="first_name"
                        placeholder="Tyler Durden"
                        type="text"
                        required
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20"
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email" className="text-neutral-200">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="projectmayhem@fc.com"
                        type="email"
                        required
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20"
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="phone" className="text-neutral-200">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="123 456 7890"
                        type="tel"
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20"
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-8">
                    <Label htmlFor="reason" className="text-neutral-200">Why do you want to use Job Assistant?</Label>
                    <Select name="reason">
                        <SelectTrigger id="reason" className="bg-neutral-900 border-neutral-800 text-white shadow-input h-10 focus:ring-red-500/20 focus:border-red-500">
                            <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                            <SelectItem value="job-search">Active Job Search</SelectItem>
                            <SelectItem value="career-change">Planning Career Change</SelectItem>
                            <SelectItem value="market-research">Market Research</SelectItem>
                            <SelectItem value="recruiting">Recruiting/Hiring</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </LabelInputContainer>

                <div className="flex justify-center mt-8">
                    <SaveButton
                        text={{
                            idle: "Join Waitlist",
                            saving: "Joining...",
                            saved: "Joined!"
                        }}
                        onSave={handleSave}
                        className="w-full h-10"
                    />
                </div>

                <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
