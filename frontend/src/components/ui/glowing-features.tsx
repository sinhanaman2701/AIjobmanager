"use client";

import { Box, Lock, Search, Settings, Sparkles, ScanFace, FileUser, Briefcase, Zap, ChartArea } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingFeatures() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-[#fafaf9]">
                Everything you need to <span className="text-neutral-400">land your dream job.</span>
            </h2>
            <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                <GridItem
                    area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                    icon={<ScanFace className="h-4 w-4" />}
                    title="AI-Powered Matching"
                    description="Our algorithms scan thousands of listings to find roles that strictly match your skills."
                />
                <GridItem
                    area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                    icon={<FileUser className="h-4 w-4" />}
                    title="Smart Resume Builder"
                    description="Automatically tailor your resume keywords for each application to pass ATS checks."
                />
                <GridItem
                    area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                    icon={<Lock className="h-4 w-4" />}
                    title="Privacy First"
                    description="Your data is encrypted. We never share your personal details with recruiters without permission."
                />
                <GridItem
                    area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Personalized Insights"
                    description="Get real-time feedback on your profile strength and missing skills."
                />
                <GridItem
                    area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                    icon={<ChartArea className="h-4 w-4" />}
                    title="Application Tracker"
                    description="Track every application status in one dashboard. No more lost emails."
                />
            </ul>
        </div>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={cn("min-h-[14rem] list-none", area)}>
            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-[#262626] p-2 md:rounded-[1.5rem] md:p-3 bg-[#0c0a09]">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-[#262626] bg-[#0c0a09] p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border-[0.75px] border-[#262626] bg-neutral-900 p-2 text-white">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-[#fafaf9]">
                                {title}
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-[#a8a29e]">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
