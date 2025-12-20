"use client";
import React, { useEffect, useState } from "react";
import { renderCanvas, TypeWriter } from "@/components/ui/hero-designali";
import { ShinyButton } from "@/components/ui/shiny-button";
import Link from "next/link";
import { SignupForm } from "@/components/ui/signup-form";
import { PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { GlowingFeatures } from "@/components/ui/glowing-features";
import { ScrollDownArrow } from "@/components/ui/scroll-down-arrow";
import { ScannerCardStream } from "@/components/ui/scanner-card-stream";
import { Timeline } from "@/components/ui/timeline";
import { ScrollIndicator } from "@/components/ui/text-scroll-animation";
import { WordHeroPage } from "@/components/ui/scroll-hero-section";
import MatchSection from "@/components/ui/match-section";
import ApplySection from "@/components/ui/apply-section";



export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Initialize canvas animation
        if (typeof window !== 'undefined') {
            renderCanvas();
        }
    }, []);

    return (
        <div className="relative bg-[#0c0a09] text-[#fafaf9] font-sans selection:bg-red-500/30">

            {/* Top Gradient - Fixed or Absolute to Hero? Let's make it absolute to Hero */}

            {/* HERO SECTION - Full Viewport Height */}
            <section className="relative h-screen w-full overflow-hidden bg-[#0c0a09] flex flex-col items-center justify-center pb-24 md:pb-0 px-4 md:px-6 text-center z-10">
                {/* Canvas - Confined to Hero */}
                <canvas id="canvas" className="absolute inset-0 w-full h-full pointer-events-none z-0" />

                {/* Top Gradient */}
                <img
                    src="https://raw.githubusercontent.com/designali-in/designali/refs/heads/main/apps/www/public/images/gradient-background-top.png"
                    alt=""
                    className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 w-full max-w-[1512px] h-auto pointer-events-none opacity-50"
                />

                <div className="relative mx-auto max-w-4xl w-full rounded-2xl border border-[#262626] bg-[#0c0a09]/80 backdrop-blur-sm px-4 py-8 md:px-12 md:py-20">
                    {/* Plus Icons */}
                    <PlusIcon className="absolute -left-5 -top-5 h-10 w-10 text-red-500" />
                    <PlusIcon className="absolute -left-5 -bottom-5 h-10 w-10 text-red-500" />
                    <PlusIcon className="absolute -right-5 -top-5 h-10 w-10 text-red-500" />
                    <PlusIcon className="absolute -right-5 -bottom-5 h-10 w-10 text-red-500" />

                    <h1 className="flex flex-col text-center text-4xl sm:text-5xl font-semibold leading-none tracking-tight md:text-7xl">
                        <span>Your personal assistant for</span>
                        <span className="text-red-500">smarter job discovery.</span>
                    </h1>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <p className="text-xs text-green-500">Early Access Open</p>
                    </div>
                </div>

                <h2 className="mt-8 text-xl sm:text-2xl md:text-3xl px-2">
                    Meet your AI career companion.
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#a8a29e] px-2 min-h-[4.5rem] flex items-center justify-center">
                    <span>
                        I analyze thousands of job listings to find the perfect match for you.
                        I am an expert in roles like <span className="font-semibold text-blue-500">
                            <TypeWriter strings={["Product Management", "Software Engineering", "Data Science", "Digital Marketing", "UX Design"]} />
                        </span>.
                    </span>
                </p>

                <div className="mt-8 flex flex-col items-center gap-4 w-full sm:w-auto sm:flex-row">
                    <div className="w-auto flex justify-center">
                        <ShinyButton onClick={() => setIsModalOpen(true)} className="w-auto">
                            Join the Waitlist
                        </ShinyButton>
                    </div>
                </div>

                <ScrollIndicator />
            </section>

            {/* TIMELINE SECTION (How it Works) - 2nd Section */}
            <section className="relative z-10 w-full bg-[#0c0a09]">
                <Timeline data={[
                    {
                        title: "1. Discover",
                        content: (
                            <div>
                                <p className="text-neutral-400 text-sm md:text-lg mb-8">
                                    We scan hundreds of relevant roles from across the web based on your preferences. No more manual searching through endless job boards.
                                </p>
                                <div className="mb-4 relative h-[400px] w-full overflow-hidden rounded-xl">
                                    <div className="absolute inset-0">
                                        <ScannerCardStream />
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        title: "2. Match",
                        content: (
                            <div>
                                <p className="text-neutral-400 text-sm md:text-lg mb-8">
                                    Our AI deep-scans your profile and compares it against thousands of job descriptions to find your perfect fit. We highlight key skills and culture alignment details.
                                </p>
                                <div className="mb-4">
                                    <MatchSection />
                                </div>
                            </div>
                        ),
                    },
                    {
                        title: "3. Apply & Track",
                        content: (
                            <div>
                                <p className="text-neutral-400 text-sm md:text-lg mb-8">
                                    Applications are handled for you, and every status is tracked in one place. Never lose track of an opportunity again.
                                </p>
                                <div className="mb-4">
                                    <ApplySection />
                                </div>
                            </div>
                        ),
                    },
                ]} />
            </section>

            {/* FEATURES SECTION - Flows naturally below */}
            <section className="relative z-10 w-full bg-[#0c0a09]">
                <GlowingFeatures />
            </section>

            {/* SCROLL HERO SECTION - 3rd Section */}
            <section className="relative z-10 w-full bg-[#0c0a09]">
                <WordHeroPage onJoinWaitlist={() => setIsModalOpen(true)} />
            </section>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
                        >
                            <SignupForm onClose={() => setIsModalOpen(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
