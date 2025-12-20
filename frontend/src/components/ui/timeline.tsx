"use client";
import {
    useMotionValueEvent,
    useScroll,
    useTransform,
    motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { CharacterV1 } from "@/components/ui/text-scroll-animation";

interface TimelineEntry {
    title: string;
    content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null); // New ref for title
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!ref.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setHeight(entry.contentRect.height);
            }
        });
        resizeObserver.observe(ref.current);
        return () => resizeObserver.disconnect();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 20%"],
    });

    // Separate scroll progerss for the title to animate immediately upon entry
    const { scrollYProgress: titleScroll } = useScroll({
        target: titleRef,
        offset: ["start 0.9", "start 0.5"], // Starts when top of section hits 90% of viewport height
    });


    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    const titleText = "How JobMatcher Works";
    const titleCenterIndex = Math.floor(titleText.length / 2);
    const words = titleText.split(" ");
    let charIndexCounter = 0;

    return (
        <div
            className="w-full bg-[#0c0a09] font-sans md:px-10"
            ref={containerRef}
        >
            <div
                ref={titleRef}
                className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:px-10 mb-12"
            >
                <div className="flex justify-center mb-8 w-full">
                    <h2 className="w-full text-center text-3xl md:text-5xl font-bold flex flex-wrap justify-center gap-x-3 gap-y-1">
                        {words.map((word, wordIndex) => (
                            <span key={wordIndex} className="inline-flex whitespace-nowrap gap-x-[0.1em]">
                                {word.split("").map((char, charIndex) => {
                                    const globalIndex = charIndexCounter++;
                                    return (
                                        <CharacterV1
                                            key={globalIndex}
                                            char={char}
                                            index={globalIndex}
                                            centerIndex={titleCenterIndex}
                                            scrollYProgress={titleScroll}
                                        />
                                    );
                                })}
                            </span>
                        ))}
                    </h2>
                </div>

                <p className="text-neutral-400 text-sm md:text-base max-w-sm mx-auto text-center">
                    Your personal AI agent for career success, in 3 simple steps.
                </p>
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-start pt-12 md:pt-32 md:gap-10"
                    >
                        <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                            <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-[#0c0a09] flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-neutral-800 border border-neutral-700 p-2" />
                            </div>
                            <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 ">
                                {item.title}
                            </h3>
                        </div>

                        <div className="relative pl-20 pr-4 md:pl-4 w-full">
                            <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500">
                                {item.title}
                            </h3>
                            {item.content}{" "}
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        height: height + "px",
                    }}
                    className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
                >
                    <motion.div
                        style={{
                            scaleY: heightTransform, // Optimized: using scaleY instead of height
                            opacity: opacityTransform,
                            transformOrigin: "top",
                        }}
                        className="absolute inset-x-0 top-0 w-[2px] h-full bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};
