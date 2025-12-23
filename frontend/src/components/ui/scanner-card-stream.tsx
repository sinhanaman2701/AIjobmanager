"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { AnimatedJobCard, JobCardProps } from "@/components/ui/animated-card";

// --- Helper function to generate ASCII-like code ---
const ASCII_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";
const generateCode = (width: number, height: number): string => {
    let text = "";
    for (let i = 0; i < width * height; i++) {
        text += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
    }
    let out = "";
    for (let i = 0; i < height; i++) {
        out += text.substring(i * width, (i + 1) * width) + "\n";
    }
    return out;
};

// --- Component Props Type Definition ---
type ScannerCardStreamProps = {
    showControls?: boolean;
    showSpeed?: boolean;
    initialSpeed?: number;
    direction?: -1 | 1;
    jobCards?: JobCardProps[]; // Changed from cardImages to jobCards
    repeat?: number;
    cardGap?: number;
    friction?: number;
    scanEffect?: 'clip' | 'scramble';
};

// --- SVG ICONS FOR DEMO ---
const SlackIcon = () => (
    <svg viewBox="0 0 2447.6 2452.5" className="w-full h-full"><g clipRule="evenodd" fillRule="evenodd"><path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0" /><path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d" /><path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e" /><path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a" /></g></svg>
);

const GoogleIcon = () => (
    <svg viewBox="0 0 256 262" preserveAspectRatio="xMidYMid" className="w-full h-full"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" /><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" /><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" /><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" /></svg>
);

// --- DEFAULT JOB CARDS DATA ---
const defaultJobCards: JobCardProps[] = [
    {
        companyLogo: <SlackIcon />,
        companyName: "Slack",
        jobTitle: "Senior UI Designer",
        salary: "$3,500-5,500 net",
        tags: ["Project Based", "Remote"],
        postedDate: "Posted 2 Day Ago",
        variant: "pink",
    },
    {
        companyLogo: <GoogleIcon />,
        companyName: "Google",
        jobTitle: "Lead UX Designer",
        salary: "$4,000-6,000 net",
        tags: ["Full Time", "B2B"],
        postedDate: "Posted Yesterday",
        variant: "yellow",
    },
    {
        companyLogo: <SlackIcon />,
        companyName: "Slack",
        jobTitle: "Lead Product Designer",
        salary: "$3,500-5,500 net",
        tags: ["Full Time", "Remote"],
        postedDate: "Posted 2 Day Ago",
        variant: "blue",
    },
];

// --- The Main Component ---
const ScannerCardStream = ({
    showControls = false,
    showSpeed = false,
    initialSpeed = 100,
    direction = -1,
    jobCards = defaultJobCards,
    repeat = 4,
    cardGap = 40,
    friction = 0.95,
    scanEffect = 'scramble',
}: ScannerCardStreamProps) => {

    const [speed, setSpeed] = useState(initialSpeed);
    const [isPaused, setIsPaused] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [width, setWidth] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const cardLineRef = useRef<HTMLDivElement>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement>(null);
    const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
    const originalAscii = useRef(new Map<number, string>());

    const cards = useMemo(() => {
        const totalCards = jobCards.length * repeat;
        return Array.from({ length: totalCards }, (_, i) => ({
            id: i,
            data: jobCards[i % jobCards.length],
            ascii: isMounted ? generateCode(Math.floor(384 / 7), Math.floor(220 / 14)) : "",
        }))
    }, [jobCards, repeat, isMounted]);

    const CARD_WIDTH = 350;

    const cardStreamState = useRef({
        position: 0, velocity: initialSpeed, direction: direction, isDragging: false,
        lastMouseX: 0, lastTime: performance.now(), cardLineWidth: (CARD_WIDTH + cardGap) * cards.length,
        friction: friction, minVelocity: 30,
    });

    const scannerState = useRef({ isScanning: false });

    const toggleAnimation = useCallback(() => setIsPaused(prev => !prev), []);
    const changeDirection = useCallback(() => { cardStreamState.current.direction *= -1; }, []);

    // Handle Resize
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (width === 0) return; // Wait for width measurements

        const cardLine = cardLineRef.current;
        const particleCanvas = particleCanvasRef.current;
        const scannerCanvas = scannerCanvasRef.current;

        if (!cardLine || !particleCanvas || !scannerCanvas) return;

        cards.forEach(card => originalAscii.current.set(card.id, card.ascii));
        let animationFrameId: number;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-width / 2, width / 2, 125, -125, 1, 1000);
        camera.position.z = 100;
        const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
        renderer.setSize(width, 250);
        renderer.setClearColor(0x000000, 0);

        // Scale particle count based on width
        const particleCount = Math.floor(width / 3);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);
        const alphas = new Float32Array(particleCount);
        const texCanvas = document.createElement("canvas");
        texCanvas.width = 100; texCanvas.height = 100;
        const texCtx = texCanvas.getContext("2d")!;
        const half = 50;
        const gradient = texCtx.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0.025, "#fff");
        gradient.addColorStop(0.1, `hsl(217, 61%, 33%)`);
        gradient.addColorStop(0.25, `hsl(217, 64%, 6%)`);
        gradient.addColorStop(1, "transparent");
        texCtx.fillStyle = gradient;
        texCtx.arc(half, half, half, 0, Math.PI * 2);
        texCtx.fill();
        const texture = new THREE.CanvasTexture(texCanvas);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * width * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
            velocities[i] = Math.random() * 60 + 30;
            alphas[i] = (Math.random() * 8 + 2) / 10;
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
        const material = new THREE.ShaderMaterial({
            uniforms: { pointTexture: { value: texture } },
            vertexShader: `attribute float alpha; varying float vAlpha; void main() { vAlpha = alpha; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = 15.0; gl_Position = projectionMatrix * mvPosition; }`,
            fragmentShader: `uniform sampler2D pointTexture; varying float vAlpha; void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha) * texture2D(pointTexture, gl_PointCoord); }`,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: false,
        });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const ctx = scannerCanvas.getContext('2d')!;
        scannerCanvas.width = width;
        scannerCanvas.height = 300;
        let scannerParticles: any[] = [];
        const baseMaxParticles = Math.floor(width * 0.8); // Scale particles
        let currentMaxParticles = baseMaxParticles;
        const scanTargetMaxParticles = Math.floor(width * 2.5);

        const createScannerParticle = () => ({
            x: (width / 2 - 60) + (Math.random() - 0.5) * 3, y: Math.random() * 300, vx: Math.random() * 0.8 + 0.2, vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 0.6 + 0.4, alpha: Math.random() * 0.4 + 0.6, life: 1.0, decay: Math.random() * 0.02 + 0.005,
        });
        for (let i = 0; i < baseMaxParticles; i++) scannerParticles.push(createScannerParticle());

        const runScrambleEffect = (element: HTMLElement, cardId: number) => {
            if (element.dataset.scrambling === 'true') return;
            element.dataset.scrambling = 'true';
            const originalText = originalAscii.current.get(cardId) || '';
            let scrambleCount = 0;
            const maxScrambles = 10;
            const interval = setInterval(() => {
                element.textContent = generateCode(Math.floor(384 / 7), Math.floor(220 / 14));
                scrambleCount++;
                if (scrambleCount >= maxScrambles) {
                    clearInterval(interval);
                    element.textContent = originalText;
                    delete element.dataset.scrambling;
                }
            }, 30);
        };

        const updateCardEffects = () => {
            const scannerX = width / 2 - 60;
            const scannerWidth = 4;
            const scannerLeft = scannerX - scannerWidth / 2;
            const scannerRight = scannerX + scannerWidth / 2;
            let anyCardIsScanning = false;

            if (!cardLineRef.current) return;
            const children = cardLineRef.current.children;
            const currentPos = cardStreamState.current.position;
            const totalCardWidth = CARD_WIDTH + cardGap;

            for (let i = 0; i < children.length; i++) {
                // Math-based position calculation
                // Card's accumulated left position in the strip + current translation
                // We handle the infinite wrapping logic approximately or assume linear for collision
                // For a perfect loop, we really just need the X relative to the viewport.
                // Since the DOM element itself is transformed, we can start with the base math:

                // The infinite loop logic in 'animate' resets 'position' when it goes out of bounds.
                // So 'currentPos' is the translateX of the whole container.
                // The relative pixel position of card i is: i * totalCardWidth + currentPos

                let relativeLeft = (i * totalCardWidth) + currentPos;

                // We need to account for the loop reset logic to match visual position
                // Logic from animate loop:
                // if (position < -cardLineWidth) position = containerW;

                // Actually, since we read the visual state, let's stick to the reliable math relative to the parent container
                // But we must correct for the wrap-around which might put a card visually "elsewhere" if we just used i * width
                // However, the current component implements the loop by just resetting the whole strip. 
                // It does NOT rearrange individual items. So (i * totalWidth + pos) IS the correct screen coordinate relative to container left.

                const relativeRight = relativeLeft + CARD_WIDTH;

                // Optimization: Skip cards completely off screen (optional but good)
                // if (relativeRight < 0 || relativeLeft > width) continue;

                if (relativeLeft < scannerRight && relativeRight > scannerLeft) {
                    anyCardIsScanning = true;
                    const wrapper = children[i] as HTMLElement;

                    if (wrapper.dataset.scanned !== 'true') {
                        const asciiContent = wrapper.querySelector<HTMLElement>(".ascii-content");
                        if (asciiContent && scanEffect === 'scramble') runScrambleEffect(asciiContent, i);
                        wrapper.dataset.scanned = 'true';
                    }

                    const intersectLeft = Math.max(scannerLeft - relativeLeft, 0);
                    // const intersectRight = Math.min(scannerRight - relativeLeft, CARD_WIDTH); 
                    // Note: original logic had rect.width which is CARD_WIDTH

                    const normalCard = wrapper.children[0] as HTMLElement;
                    const asciiCard = wrapper.children[1] as HTMLElement;

                    // Use percentages for performant updates
                    normalCard.style.setProperty("--clip-right", `${(intersectLeft / CARD_WIDTH) * 100}%`);
                    asciiCard.style.setProperty("--clip-left", `${(intersectLeft / CARD_WIDTH) * 100}%`);
                    // Note: original logic used intersectRight for second prop? 
                    // Original: normal --clip-right = (intersectLeft / w) * 100
                    // Original: ascii --clip-left = (intersectRight / w) * 100
                    // intersectRight IS the point where the scanner ends inside the card.
                    // Actually, let's stick to the overlap logic.
                    // If scanner is passing L -> R over card:
                    // Left of beam is normal, Right of beam is ASCII (or vice versa depending on effect)
                    // The masking logic implies: 
                    // Normal card clipped from right side by (100% - percentage)
                    // Let's preserve original math intent but with cached values:

                    const intersectRight = Math.min(scannerRight - relativeLeft, CARD_WIDTH);
                    asciiCard.style.setProperty("--clip-left", `${(intersectRight / CARD_WIDTH) * 100}%`);

                } else {
                    // Only update if we think we might be in a dirty state (optimization)
                    // We can check dataset or just do it. Given the reduced read cost, direct write is okay if batched,
                    // but we can't easily batch per-element styles without overhead.
                    // We'll rely on the checked flag to avoid thrashing styles on non-intersecting items too much?
                    // Actually the previous logic applied styles on every frame for non-intersecting too.

                    const wrapper = children[i] as HTMLElement;

                    // Optimization: check current values before writing? 
                    // Or just write. Browser style recalc usually optimizes redundant sets.

                    if (wrapper.dataset.scanned === 'true') {
                        delete wrapper.dataset.scanned;
                    }

                    const normalCard = wrapper.children[0] as HTMLElement;
                    const asciiCard = wrapper.children[1] as HTMLElement;

                    if (relativeRight < scannerLeft) {
                        // Card is to the left of scanner
                        normalCard.style.setProperty("--clip-right", "100%");
                        asciiCard.style.setProperty("--clip-left", "100%");
                    } else {
                        // Card is to the right of scanner
                        normalCard.style.setProperty("--clip-right", "0%");
                        asciiCard.style.setProperty("--clip-left", "0%");
                    }
                }
            }
            if (scannerState.current.isScanning !== anyCardIsScanning) {
                setIsScanning(anyCardIsScanning);
                scannerState.current.isScanning = anyCardIsScanning;
            }
        };

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            cardStreamState.current.isDragging = true;
            const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
            cardStreamState.current.lastMouseX = pageX;
        };
        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!cardStreamState.current.isDragging) return;
            const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
            const delta = pageX - cardStreamState.current.lastMouseX;
            cardStreamState.current.lastMouseX = pageX;
            cardStreamState.current.position += delta;
            cardStreamState.current.velocity = delta * 50;
        };
        const handleMouseUp = () => { cardStreamState.current.isDragging = false; };

        cardLine.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        cardLine.addEventListener("touchstart", handleMouseDown, { passive: true });
        window.addEventListener("touchmove", handleMouseMove, { passive: true });
        window.addEventListener("touchend", handleMouseUp);

        const animate = (currentTime: number) => {
            const deltaTime = (currentTime - cardStreamState.current.lastTime) / 1000;
            cardStreamState.current.lastTime = currentTime;

            if (!isPaused && !cardStreamState.current.isDragging) {
                if (Math.abs(cardStreamState.current.velocity) > Math.abs(initialSpeed)) {
                    cardStreamState.current.velocity *= cardStreamState.current.friction;
                } else {
                    cardStreamState.current.velocity = initialSpeed * cardStreamState.current.direction;
                }
                cardStreamState.current.position += cardStreamState.current.velocity * deltaTime;
                if (showSpeed) setSpeed(Math.round(cardStreamState.current.velocity));
            }

            const { position, cardLineWidth } = cardStreamState.current;

            // Infinite Loop Logic using container width
            const containerW = width;
            if (position < -cardLineWidth) cardStreamState.current.position = containerW;
            else if (position > containerW) cardStreamState.current.position = -cardLineWidth;

            cardLine.style.transform = `translateX(${cardStreamState.current.position}px)`;
            updateCardEffects();

            const time = currentTime * 0.001;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += velocities[i] * 0.016;
                if (positions[i * 3] > width / 2 + 100) positions[i * 3] = -width / 2 - 100;
                positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;
                alphas[i] = Math.max(0.1, Math.min(1, alphas[i] + (Math.random() - 0.5) * 0.05));
            }
            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.alpha.needsUpdate = true;
            renderer.render(scene, camera);

            ctx.clearRect(0, 0, width, 300);
            const targetCount = scannerState.current.isScanning ? scanTargetMaxParticles : baseMaxParticles;
            currentMaxParticles += (targetCount - currentMaxParticles) * 0.05;
            while (scannerParticles.length < currentMaxParticles) scannerParticles.push(createScannerParticle());
            while (scannerParticles.length > currentMaxParticles) scannerParticles.pop();
            scannerParticles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.life -= p.decay;
                if (p.life <= 0 || p.x > width) Object.assign(p, createScannerParticle());
                ctx.globalAlpha = p.alpha * p.life; ctx.fillStyle = "white";
                ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            cardLine.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            cardLine.removeEventListener("touchstart", handleMouseDown);
            window.removeEventListener("touchmove", handleMouseMove);
            window.removeEventListener("touchend", handleMouseUp);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [isPaused, cards, cardGap, friction, scanEffect, initialSpeed, direction, width]);

    return (
        <div ref={containerRef} className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-transparent">
            <style jsx global>{`
        @keyframes glitch { 0%, 16%, 50%, 100% { opacity: 1; } 15%, 99% { opacity: 0.9; } 49% { opacity: 0.8; } }
        .animate-glitch { animation: glitch 0.1s infinite linear alternate-reverse; }
        
        @keyframes scanPulse {
          0% { opacity: 0.75; transform: scaleY(1); }
          100% { opacity: 1; transform: scaleY(1.03); }
        }
        .animate-scan-pulse {
          animation: scanPulse 1.5s infinite alternate ease-in-out;
        }
      `}</style>

            {width > 0 && (
                <>
                    <canvas ref={particleCanvasRef} className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[250px] z-0 pointer-events-none" />
                    <canvas ref={scannerCanvasRef} className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] z-10 pointer-events-none" />
                </>
            )}

            {/* Scanner Beam */}
            <div
                className={`
          scanner-line absolute top-1/2 left-[calc(50%-60px)] h-[280px] w-0.5 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-b from-transparent via-violet-500 to-transparent rounded-full
          transition-opacity duration-300 z-20 pointer-events-none animate-scan-pulse
          ${isScanning ? 'opacity-100' : 'opacity-0'}
        `}
                style={{
                    boxShadow: `
            0 0 10px #a78bfa, 0 0 20px #a78bfa, 
            0 0 30px #8b5cf6, 0 0 50px #6366f1`
                }}
            />

            <div className="absolute w-full h-[250px] flex items-center">
                <div ref={cardLineRef} className="flex items-center whitespace-nowrap cursor-grab select-none will-change-transform" style={{ gap: `${cardGap}px` }}>
                    {/* Same Map Render Loop */}
                    {cards.map(card => (
                        <div key={card.id} className="card-wrapper relative w-[350px] h-[220px] shrink-0 transform-gpu">
                            {/* Normal Card Layer */}
                            <div
                                className="card-normal card absolute top-0 left-0 w-full h-full rounded-[15px] overflow-visible z-[2] transition-transform duration-200"
                                style={{
                                    clipPath: "inset(0 0 0 var(--clip-right, 0%))"
                                }}
                            >
                                <div className="w-full h-full transform scale-90 md:scale-100 origin-center transition-transform">
                                    <AnimatedJobCard {...card.data} />
                                </div>
                            </div>

                            {/* ASCII/Glitch Card Layer */}
                            <div
                                className="card-ascii card absolute top-0 left-0 w-full h-full rounded-[15px] overflow-hidden bg-black/80 z-[3] pointer-events-none"
                                style={{
                                    clipPath: "inset(0 calc(100% - var(--clip-left, 0%)) 0 0)"
                                }}
                            >
                                <pre className="ascii-content absolute top-0 left-0 w-full h-full text-[rgba(220,210,255,0.6)] font-mono text-[10px] leading-[10px] overflow-hidden whitespace-pre m-0 p-4 text-left align-top box-border animate-glitch">
                                    {card.ascii}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { ScannerCardStream };
