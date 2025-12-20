"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

type CharacterProps = {
    char: string;
    index: number;
    centerIndex: number;
    scrollYProgress: any;
};


const CharacterV1 = ({
    char,
    index,
    centerIndex,
    scrollYProgress,
}: CharacterProps) => {
    const isSpace = char === " ";
    const distanceFromCenter = index - centerIndex;

    const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);

    return (
        <motion.span
            className={cn("inline-block text-[#fafaf9] drop-shadow-lg", isSpace && "w-4")}
            style={{ x, rotateX }}
        >
            {char}
        </motion.span>
    );
};

// ... other variants omitted for brevity as we focus on V1 for the title ...

const Skiper31 = () => {
    // Demo implementation omitted
    return <div>Demo</div>
}

export { CharacterV1, Skiper31 };

// Scroll Indicator Component
export const ScrollIndicator = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-1 md:bottom-2 left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-2 md:gap-4 text-center text-[#fafaf9]"
        >
            <motion.span
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative max-w-[12ch] text-[8px] md:text-[10px] uppercase leading-tight tracking-[0.2em] md:tracking-widest"
            >
                Scroll to see more
            </motion.span>
            <div className="relative h-6 md:h-12 w-[1px] bg-[#27272a] overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent to-[#fafaf9]"
                    initial={{ height: "0%", opacity: 0 }}
                    animate={{ height: "100%", opacity: 1 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        ease: "circIn",
                    }}
                    style={{ height: "100%" }}
                />
            </div>
        </motion.div>
    );
};
