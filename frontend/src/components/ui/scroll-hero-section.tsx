'use client';

import { useEffect, useRef, useState } from 'react';

import { ShinyButton } from "@/components/ui/shiny-button";

type Theme = 'system' | 'light' | 'dark';

export type ShipStickyHeaderProps = {
  /** Words that cycle under “you can …” */
  items?: string[];
  /** Sets CSS var --count automatically from items length */
  showFooter?: boolean;
  /** UI theme (affects color-scheme + switch color) */
  theme?: Theme;
  /** Enable view-timeline animations if supported */
  animate?: boolean;
  /** Accent hue (0–359) */
  hue?: number;
  /** Where the highlight band starts (vh) */
  startVh?: number; // default 50
  /** Space (vh) below the sticky header block */
  spaceVh?: number; // default 50
  /** Debug outline (for dev) */
  debug?: boolean;
  /** Callback for waitlist button */
  onJoinWaitlist?: () => void;
};

function WordHeroPage({
  items = ["Product Management.", "Software Engineering.", "Data Science.", "Digital Marketing.", "UX Design."],
  showFooter = true,
  theme = 'system',
  animate = true,
  hue = 280,
  startVh = 50,
  spaceVh = 50,
  debug = false,
  onJoinWaitlist,
}: ShipStickyHeaderProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.animate = String(animate);
    root.dataset.debug = String(debug);
    root.style.setProperty('--hue', String(hue));
    root.style.setProperty('--start', `${startVh}vh`);
    root.style.setProperty('--space', `${spaceVh}vh`);
  }, [theme, animate, debug, hue, startVh, spaceVh]);

  // Intersection Observer for highlighting
  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-50% 0px -50% 0px', // Trigger exactly at center line
      threshold: 0
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(callback, observerOptions);
    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <div
      className="min-h-screen w-screen"
      style={
        {
          // keep count in sync with CSS sticky offset math
          ['--count' as any]: items.length,
        } as React.CSSProperties
      }
    >
      <header className="content fluid">
        <section className="content">
          <h1 className="sr-only sm:not-sr-only">
            <span aria-hidden="true" className="opacity-50">Want to get a job in&nbsp;</span>
            <span className="sr-only">Want to get a job in various fields.</span>
          </h1>

          {/* Visible cycling words (aria-hidden) */}
          <ul aria-hidden="true">
            {items.map((word, i) => (
              <li
                key={i}
                ref={el => { itemRefs.current[i] = el; }}
                data-index={i}
                data-active={activeIndex === i}
                style={{ ['--i' as any]: i } as React.CSSProperties}
              >
                {word}
              </li>
            ))}
          </ul>
        </section>
      </header>

      <main>
        <section className="flex flex-col gap-6 items-center justify-center p-4">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 text-center">
            Ready to take the leap?
          </h2>
          <p className="fluid text-center font-medium text-neutral-600">
            We&apos;ll help you achieve that.
          </p>
          <div className="flex justify-center w-full pt-4">
            <ShinyButton onClick={onJoinWaitlist} className="w-auto px-8 py-3 text-lg">
              Join the Waitlist
            </ShinyButton>
          </div>
        </section>
      </main>

      {/* Styles ported and condensed; uses CSS custom props like the original */}
      <style jsx global>{`
        @layer base, stick, demo, debug;

        :root {
          --start: 50vh;
          --space: 50vh;
          --hue: 280;
          --accent: light-dark(hsl(var(--hue) 100% 50%), hsl(var(--hue) 90% 75%));
          --switch: canvas;
          --font-size-min: 14;
          --font-size-max: 20;
          --font-ratio-min: 1.1;
          --font-ratio-max: 1.33;
          --font-width-min: 375;
          --font-width-max: 1500;
        }
        [data-theme='dark'] { --switch: #000; color-scheme: dark only; }
        [data-theme='light'] { --switch: #fff; color-scheme: light only; }
        html { color-scheme: light dark; scrollbar-color: var(--accent) #0000; }
        *, *::before, *::after { box-sizing: border-box; }

        body {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica Neue, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji;
          background: light-dark(white, black);
        }

        /* Screen grid background */
        body::before {
          --size: 45px; --line: color-mix(in hsl, canvasText, transparent 80%);
          content: '';
          position: fixed; inset: 0; z-index: -1;
          background:
            linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size))
              calc(var(--size) * 0.36) 50% / var(--size) var(--size),
            linear-gradient(var(--line) 1px, transparent 1px var(--size)) 0%
              calc(var(--size) * 0.32) / var(--size) var(--size);
          mask: linear-gradient(-20deg, transparent 50%, white);
          pointer-events: none;
        }

        /* Utilities */
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
        }
        .fluid {
          --fluid-min: calc(var(--font-size-min) * pow(var(--font-ratio-min), var(--font-level, 0)));
          --fluid-max: calc(var(--font-size-max) * pow(var(--font-ratio-max), var(--font-level, 0)));
          --fluid-preferred: calc((var(--fluid-max) - var(--fluid-min)) / (var(--font-width-max) - var(--font-width-min)));
          --fluid-type: clamp(
            (var(--fluid-min) / 16) * 1rem,
            ((var(--fluid-min) / 16) * 1rem)
              - (((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem)
              + (var(--fluid-preferred) * var(--variable-unit, 100vi)),
            (var(--fluid-max) / 16) * 1rem
          );
          font-size: var(--fluid-type);
        }

        /* Sticky header logic */
        header {
          --font-level: 4;
          --font-size-min: 24;
          position: sticky;
          top: calc((var(--count) - 1) * -1lh);
          line-height: 1.2;
          display: flex;
          align-items: start;
          width: 100%;
          margin-bottom: var(--space);
        }
        header section:first-of-type {
          display: flex; width: 100%;
          flex-direction: column;
          align-items: center; justify-content: center;
          padding-top: calc(var(--start) - 0.5lh);
          text-align: center;
        }
        header section:first-of-type h1 {
          position: sticky; top: calc(var(--start) - 0.5lh);
          margin: 0; font-weight: 600;
        }

        ul {
          font-weight: 600; list-style: none; padding: 0; margin: 0;
        }

        li {
          --dimmed: color-mix(in oklch, canvasText, #0000 80%);
          color: var(--dimmed);
          transition: color 0.1s;
        }
        
        li[data-active='true'] {
            color: var(--accent);
        }

        main {
          width: 100%; height: 100vh; position: relative; z-index: 2; color: canvas;
        }
        main::before {
          content: ''; position: absolute; inset: 0; z-index: -1;
          background: #ffffff; border-radius: 1rem 1rem 0 0;
        }
        main section {
          --font-level: 4; --font-size-min: 20;
          height: 100%; width: 100%; display: flex; place-items: center;
        }
        main section p {
          margin: 0; font-weight: 600; white-space: nowrap;
        }
        main section a:not(.bear-link) {
          color: var(--accent); text-decoration: none; text-underline-offset: 0.1lh;
        }
        main section a:not(.bear-link):is(:hover, :focus-visible) { text-decoration: underline; }

        .bear-link {
          color: canvasText;
          position: fixed; top: 1rem; left: 1rem;
          width: 48px; aspect-ratio: 1;
          display: grid; place-items: center; opacity: 0.8;
        }
        .bear-link:is(:hover, :focus-visible) { opacity: 1; }
        .bear-link svg { width: 75%; }

        footer {
          padding-block: 2rem; font-size: 0.875rem; font-weight: 300;
          color: color-mix(in hsl, canvas, #0000 35%); text-align: center; width: 100%;
          background: light-dark(#000, #fff);
        }

        /* View-timeline progressive enhancement */
        @supports (animation-timeline: view()) {
          [data-animate='true'] main { view-timeline: --section; }
          [data-animate='true'] main::before {
            transform-origin: 50% 100%;
            scale: 0.9;
            animation: grow both ease-in-out;
            animation-timeline: --section;
            animation-range: entry 50%;
          }
          [data-animate='true'] main section p, 
          [data-animate='true'] main section h2,
          [data-animate='true'] main section div {
            animation: reveal both ease-in-out;
            animation-timeline: --section;
            animation-range: entry 50%;
          }
          [data-animate='true'] main .bear-link {
            animation: switch both ease-in-out;
            animation-timeline: --section;
            animation-range: entry 50%;
          }
          @keyframes switch { to { color: var(--switch); } }
          @keyframes reveal { from { opacity: 0; } to { opacity: 1; } }
          @keyframes grow { to { scale: 1; border-radius: 0; } }
        }

        /* Debug */
        [data-debug='true'] li { outline: 0.05em dashed currentColor; }
        [data-debug='true'] :is(h2, li:last-of-type) { outline: 0.05em dashed canvasText; }
      `}</style>
    </div>
  );
}

function BearSVG() {
  return (
    <svg className="w-9" viewBox="0 0 969 955" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="161.191" cy="320.191" r="133.191" stroke="currentColor" strokeWidth="20" />
      <circle cx="806.809" cy="320.191" r="133.191" stroke="currentColor" strokeWidth="20" />
      <circle cx="695.019" cy="587.733" r="31.4016" fill="currentColor" />
      <circle cx="272.981" cy="587.733" r="31.4016" fill="currentColor" />
      <path d="M564.388 712.083C564.388 743.994 526.035 779.911 483.372 779.911C440.709 779.911 402.356 743.994 402.356 712.083C402.356 680.173 440.709 664.353 483.372 664.353C526.035 664.353 564.388 680.173 564.388 712.083Z" fill="currentColor" />
      <rect x="310.42" y="448.31" width="343.468" height="51.4986" fill="#FF1E1E" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M745.643 288.24C815.368 344.185 854.539 432.623 854.539 511.741H614.938V454.652C614.938 433.113 597.477 415.652 575.938 415.652H388.37C366.831 415.652 349.37 433.113 349.37 454.652V511.741L110.949 511.741C110.949 432.623 150.12 344.185 219.845 288.24C289.57 232.295 384.138 200.865 482.744 200.865C581.35 200.865 675.918 232.295 745.643 288.24Z"
        fill="currentColor"
      />
    </svg>
  );
}

export { WordHeroPage };
