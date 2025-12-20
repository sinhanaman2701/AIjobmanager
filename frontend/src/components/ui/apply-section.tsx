"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface ApplicationStep {
    title: string;
    description: string;
}

interface ApplySectionProps {
    title?: string;
    subtitle?: string;
    badge?: string;
    applications?: Omit<ApplicationStep, "status" | "date">[];
    ctaText?: string;
}

const StepIcon = ({ status, delay = 0 }: { status: "completed" | "active" | "pending"; delay?: number }) => {
    return (
        <div className="relative flex items-center justify-center w-8 h-8">
            {/* Background Circle */}
            <motion.div
                className={cn(
                    "absolute inset-0 rounded-full border-2",
                    status === "completed" ? "border-transparent" : "border-neutral-800"
                )}
            />

            {/* Active Loading Circle */}
            {status === "active" && (
                <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 32 32">
                    <motion.circle
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, ease: "linear", delay }}
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-primary"
                    />
                </svg>
            )}

            {/* Completed Check Circle */}
            {status === "completed" && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-green-500 rounded-full p-1"
                >
                    <CheckCircle2 className="w-5 h-5 text-neutral-950" />
                </motion.div>
            )}

            {/* Pending Dot */}
            {status === "pending" && (
                <div className="w-2 h-2 rounded-full bg-neutral-800" />
            )}
        </div>
    );
};

const ApplySection: React.FC<ApplySectionProps> = ({
    title = "Apply & Track",
    subtitle = "Applications are handled for you, and every status is tracked in one place. Never lose track of an opportunity again.",
    badge = "Automated Process",
    applications = [
        {
            title: "Application Submitted",
            description: "Your application is automatically sent to the company portal",
        },
        {
            title: "Active Monitoring",
            description: "System continually checks for any updates or changes",
        },
        {
            title: "Response Interpreted",
            description: "AI analyzes incoming emails and portal status changes",
        },
        {
            title: "Status Updated",
            description: "Your dashboard is instantly updated with the latest status",
        },
    ],
}) => {
    const [currentStep, setCurrentStep] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % (applications.length + 1));
        }, 4000);
        return () => clearInterval(interval);
    }, [applications.length]);

    const containerVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const iconVariants: import("framer-motion").Variants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
            }
        },
        hover: {
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
        },
    };

    const lineVariants: import("framer-motion").Variants = {
        hidden: { scaleY: 0 },
        visible: {
            scaleY: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="w-full flex items-center justify-center p-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-4xl"
            >
                <Card className="overflow-hidden border-none shadow-none bg-transparent">
                    <CardContent className="p-6 sm:p-8">
                        <motion.ul
                            className="relative space-y-0"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {applications.map((app, index) => {
                                const isLastStep = index === applications.length - 1;
                                let status: "completed" | "active" | "pending" = "pending";
                                if (index < currentStep) status = "completed";
                                else if (index === currentStep) status = "active";

                                return (
                                    <motion.li
                                        key={index}
                                        className="relative flex items-start gap-4 pb-8 last:pb-0"
                                        variants={itemVariants}
                                        style={{ listStyle: "none" }}
                                    >
                                        {!isLastStep && (
                                            <div className="absolute left-[15px] top-8 bottom-0 w-0.5">
                                                {/* Background Line */}
                                                <div className="absolute inset-0 bg-neutral-800" />

                                                {/* Animated Line Fill */}
                                                <motion.div
                                                    className="w-full bg-primary origin-top absolute top-0"
                                                    initial={{ height: "0%" }}
                                                    animate={{ height: status === "completed" ? "100%" : "0%" }}
                                                    transition={{ duration: 0.5, delay: 0 }}
                                                />
                                            </div>
                                        )}

                                        <div className="relative flex flex-col items-center z-10">
                                            <StepIcon status={status} delay={index === 0 ? 0 : 0.5} />
                                        </div>
                                        <motion.div
                                            className={cn(
                                                "flex-1 pt-1 transition-opacity duration-300",
                                                status === "pending" ? "opacity-40" : "opacity-100"
                                            )}
                                        >
                                            <p className="font-semibold text-foreground mb-1 text-lg">
                                                {app.title}
                                            </p>
                                            <motion.p
                                                className="text-sm text-muted-foreground"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1 + 0.7 }}
                                            >
                                                {app.description}
                                            </motion.p>
                                        </motion.div>
                                    </motion.li>
                                );
                            })}
                        </motion.ul>

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ApplySection;
