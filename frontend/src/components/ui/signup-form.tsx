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

const countries = [
    { label: "United States", value: "+1", flag: "🇺🇸" },
    { label: "United Kingdom", value: "+44", flag: "🇬🇧" },
    { label: "India", value: "+91", flag: "🇮🇳" },
    { label: "Australia", value: "+61", flag: "🇦🇺" },
    { label: "Japan", value: "+81", flag: "🇯🇵" },
    { label: "Germany", value: "+49", flag: "🇩🇪" },
    { label: "Canada", value: "+1", flag: "🇨🇦" },
    { label: "France", value: "+33", flag: "🇫🇷" },
    { label: "Brazil", value: "+55", flag: "🇧🇷" },
    { label: "China", value: "+86", flag: "🇨🇳" },
    { label: "Russia", value: "+7", flag: "🇷🇺" },
    { label: "Italy", value: "+39", flag: "🇮🇹" },
    { label: "Spain", value: "+34", flag: "🇪🇸" },
    { label: "Netherlands", value: "+31", flag: "🇳🇱" },
    { label: "South Korea", value: "+82", flag: "🇰🇷" },
    { label: "Singapore", value: "+65", flag: "🇸🇬" },
    { label: "Sweden", value: "+46", flag: "🇸🇪" },
    { label: "Switzerland", value: "+41", flag: "🇨🇭" },
    { label: "UAE", value: "+971", flag: "🇦🇪" },
    { label: "Saudi Arabia", value: "+966", flag: "🇸🇦" },
    { label: "Mexico", value: "+52", flag: "🇲🇽" },
    { label: "South Africa", value: "+27", flag: "🇿🇦" },
    { label: "Turkey", value: "+90", flag: "🇹🇷" },
    { label: "Indonesia", value: "+62", flag: "🇮🇩" },
    { label: "Thailand", value: "+66", flag: "🇹🇭" },
    { label: "Vietnam", value: "+84", flag: "🇻🇳" },
    { label: "Philippines", value: "+63", flag: "🇵🇭" },
    { label: "Malaysia", value: "+60", flag: "🇲🇾" },
    { label: "Poland", value: "+48", flag: "🇵🇱" },
    { label: "Argentina", value: "+54", flag: "🇦🇷" },
].sort((a, b) => a.label.localeCompare(b.label));

export function SignupForm({ onClose }: { onClose?: () => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [open, setOpen] = useState(false);
    const [countryCode, setCountryCode] = useState("+1");

    const handleSave = async () => {
        if (formRef.current && formRef.current.reportValidity()) {
            try {
                const formData = new FormData(formRef.current);
                const data: any = Object.fromEntries(formData.entries());
                data.country_code = countryCode;

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
                    <div className="flex gap-2">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[120px] justify-between bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800 hover:text-white"
                                >
                                    {countryCode ? (
                                        <span className="flex items-center gap-1 truncate">
                                            <span>{countries.find((country) => country.value === countryCode)?.flag}</span>
                                            <span>{countryCode}</span>
                                        </span>
                                    ) : (
                                        "Code"
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search country..." />
                                    <CommandList>
                                        <CommandEmpty>No country found.</CommandEmpty>
                                        <CommandGroup>
                                            {countries.map((country) => (
                                                <CommandItem
                                                    key={country.label}
                                                    value={country.label}
                                                    onSelect={() => {
                                                        setCountryCode(country.value === countryCode ? "" : country.value);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            countryCode === country.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <span className="mr-2">{country.flag}</span>
                                                    {country.label} ({country.value})
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="123 456 7890"
                            type="tel"
                            className="flex-1 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20"
                        />
                    </div>
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
