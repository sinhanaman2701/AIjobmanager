"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollDownArrowProps {
    className?: string;
    onClick?: () => void;
    variant?: "default" | "bounce" | "pulse" | "fade";
    size?: "sm" | "md" | "lg" | "xl";
    position?: "center" | "left" | "right";
    showText?: boolean;
    text?: string;
    color?: string;
    hideOnScroll?: boolean;
}

const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
};

const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
};

const positionClasses = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-8",
    right: "right-8",
};

export function ScrollDownArrow({
    className,
    onClick,
    variant = "bounce",
    size = "md",
    position = "center",
    showText = true,
    text = "Scroll Down",
    color,
    hideOnScroll = true
}: ScrollDownArrowProps) {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        if (!hideOnScroll) return;

        const handleScroll = () => {
            // Hide if user has scrolled down more than 50px
            // Once hidden, it remains hidden (no else block)
            if (window.scrollY > 50) {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hideOnScroll]);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
            });
        }
    };

    const getAnimation = () => {
        switch (variant) {
            case "bounce":
                return {
                    y: [0, 10, 0],
                    transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                    },
                };
            case "pulse":
                return {
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1],
                    transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                    },
                };
            case "fade":
                return {
                    opacity: [1, 0.3, 1],
                    transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                    },
                };
            default:
                return {
                    y: [0, 8, 0],
                    transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                    },
                };
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }} // Subtle disappearance
                    className={cn(
                        "absolute bottom-8 z-50 flex flex-col items-center gap-2 cursor-pointer",
                        positionClasses[position],
                        className
                    )}
                    animate={getAnimation()}
                    onClick={handleClick}
                >
                    {showText && (
                        <span
                            className={cn(
                                "text-sm font-medium text-white/70 hover:text-white transition-colors",
                                color
                            )}
                        >
                            {text}
                        </span>
                    )}
                    <div
                        className={cn(
                            "rounded-full bg-neutral-900/50 border border-neutral-700 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110",
                            sizeClasses[size],
                            color
                        )}
                    >
                        <ChevronDown
                            size={iconSizes[size]}
                            className={cn("text-white", color)}
                            strokeWidth={2.5}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
