"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { useState } from "react";

interface WaitlistFormProps {
    onClose: () => void;
}

const jobTypes = [
    {
        id: "full-time",
        title: "Full-time",
        description: "Standard 40h/week roles.",
        users: "Most Popular",
    },
    {
        id: "contract",
        title: "Contract",
        description: "Freelance & project-based.",
        users: "Flexible",
    },
    {
        id: "internship",
        title: "Internship",
        description: "Students & fresh grads.",
        users: "Entry Level",
    },
];

export default function WaitlistForm({ onClose }: WaitlistFormProps) {
    const [selectedJobType, setSelectedJobType] = useState(jobTypes[0]);

    return (
        <div className="flex items-center justify-center p-4 sm:p-10 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
            </button>
            <div className="sm:mx-auto sm:max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-foreground">
                    Apply for early access
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Join the waitlist for JobMatcher.ai and be the first to experience AI-powered career curation.
                </p>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = {
                        first_name: formData.get("first-name"),
                        last_name: formData.get("last-name"),
                        email: formData.get("email"),
                        linkedin_profile: formData.get("linkedin"),
                        experience_level: formData.get("experience"),
                        job_type: selectedJobType.id
                    };

                    try {
                        const response = await fetch('/api/waitlist', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });

                        if (response.ok) {
                            alert("Thanks for joining! We'll be in touch.");
                            onClose();
                        } else {
                            const errorData = await response.json();
                            alert(`Failed to join: ${errorData.error || 'Unknown error'}`);
                        }
                    } catch (error) {
                        alert("An error occurred. Please try again.");
                        console.error(error);
                    }
                }} className="mt-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                        <div className="col-span-full sm:col-span-3">
                            <Label htmlFor="first-name" className="font-medium">
                                First name<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="first-name"
                                name="first-name"
                                autoComplete="given-name"
                                required
                                placeholder="Emma"
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <Label htmlFor="last-name" className="font-medium">
                                Last name
                            </Label>
                            <Input
                                type="text"
                                id="last-name"
                                name="last-name"
                                autoComplete="family-name"
                                placeholder="Crown"
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-full">
                            <Label htmlFor="email" className="font-medium">
                                Email address<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                required
                                placeholder="emma@company.com"
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <Label htmlFor="linkedin" className="font-medium">
                                LinkedIn Profile
                            </Label>
                            <Input
                                type="url"
                                id="linkedin"
                                name="linkedin"
                                placeholder="https://linkedin.com/in/..."
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <Label htmlFor="experience" className="font-medium">
                                Experience Level
                            </Label>
                            <Select name="experience">
                                <SelectTrigger id="experience" className="mt-2">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="entry">Entry Level (0-2y)</SelectItem>
                                    <SelectItem value="mid">Mid Level (2-5y)</SelectItem>
                                    <SelectItem value="senior">Senior Level (5-8y)</SelectItem>
                                    <SelectItem value="lead">Lead/Staff (8y+)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator className="col-span-full my-4" />
                        <div className="col-span-full">
                            <Label className="font-semibold text-foreground block mb-4">
                                What kind of roles are you looking for?
                            </Label>

                            <RadioGroup
                                className="grid grid-cols-1 sm:grid-cols-3 gap-5"
                                defaultValue={selectedJobType.id}
                                onValueChange={(value) =>
                                    setSelectedJobType(
                                        jobTypes.find(
                                            (type) => type.id === value
                                        ) || jobTypes[0]
                                    )
                                }
                            >
                                {jobTypes.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border-input has-[[data-state=checked]]:border-ring relative flex flex-col gap-2 rounded-md border p-4 shadow-sm outline-none"
                                    >
                                        <div className="flex justify-between">
                                            <RadioGroupItem
                                                id={item.id}
                                                value={item.id}
                                                className="order-1 after:absolute after:inset-0"
                                            />

                                            <Label
                                                htmlFor={item.id}
                                                className="block text-sm font-medium text-foreground"
                                            >
                                                {item.title}
                                            </Label>
                                        </div>
                                        <div className="flex flex-col h-full justify-between">
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                            <span className="mt-4 block text-sm font-medium text-foreground">
                                                {item.users}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="flex items-center justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="whitespace-nowrap"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white">
                            Apply for Access
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
