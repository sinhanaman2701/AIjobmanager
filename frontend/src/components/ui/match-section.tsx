"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Target, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// --- Match Component Logic ---

interface MatchFeature {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    bgColor: string;
}

const matchFeatures: MatchFeature[] = [
    {
        icon: <Target className="w-6 h-6" />,
        title: "Profile Analysis",
        description: "Deep analysis of your skills, experience, and career goals",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
        icon: <Sparkles className="w-6 h-6" />,
        title: "AI Matching",
        description: "Advanced algorithms compare role requirements with your profile",
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
        icon: <CheckCircle2 className="w-6 h-6" />,
        title: "Culture Fit",
        description: "Evaluates company culture alignment and team dynamics",
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
];

const MatchSection = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % matchFeatures.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto p-0">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left Column: Interactive Cards List */}
                <div className="space-y-4">
                    {matchFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => setActiveFeature(index)}
                            className="cursor-pointer"
                        >
                            <Card
                                className={cn(
                                    "p-4 transition-all duration-300 border bg-transparent hover:bg-white/5",
                                    activeFeature === index
                                        ? "border-primary/50 shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)]"
                                        : "border-neutral-800/50 hover:border-primary/30"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(
                                            "p-3 rounded-lg transition-colors",
                                            feature.bgColor,
                                            feature.color
                                        )}
                                    >
                                        {feature.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-foreground mb-1 text-base">
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Right Column: Visualization Card */}
                <div className="relative mt-8 lg:mt-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <Card className="p-8 bg-transparent border-neutral-800/50 shadow-none relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-foreground">
                                        Match Score
                                    </h3>
                                    <motion.div
                                        key={activeFeature}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-3xl font-bold text-primary"
                                    >
                                        {[92, 88, 95][activeFeature]}%
                                    </motion.div>
                                </div>

                                <div className="space-y-4">
                                    {["Skills Match", "Experience Level", "Culture Fit"].map(
                                        (label, index) => (
                                            <div key={label} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{label}</span>
                                                    <span className="text-foreground font-medium">
                                                        {[85, 90, 95][index]}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${[85, 90, 95][index]}%` }}
                                                        transition={{ duration: 1, delay: index * 0.2 }}
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            index === 0 && "bg-blue-500",
                                                            index === 1 && "bg-purple-500",
                                                            index === 2 && "bg-emerald-500"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="pt-4 border-t border-neutral-800">
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-medium text-sm">
                                            Strong match for this position
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Background Glow Effects */}
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl -z-10"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MatchSection;
