"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { observeOnce, prefersReducedMotion, stagger as staggerScale } from "@/lib/motion";
import styles from "./Reveal.module.css";

export type RevealVariant = "fade" | "rise" | "blur" | "clip" | "wipe";

export type RevealDuration = "base" | "slow" | "cinematic" | "epic";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  stagger?: boolean | keyof typeof staggerScale;
  delay?: number;
  y?: number;
  duration?: RevealDuration;
  as?: ElementType;
}

export function Reveal({
  children,
  className,
  variant = "rise",
  stagger = false,
  delay = 0,
  y,
  duration,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const settle = (node: Element) => {
      const targets = [node, ...node.children];
      const seconds = targets.reduce((longest, target) => {
        const style = getComputedStyle(target);
        const total =
          (parseFloat(style.transitionDelay) || 0) + (parseFloat(style.transitionDuration) || 0);
        return Math.max(longest, total);
      }, 0);
      timer = setTimeout(() => node.setAttribute("data-settled", ""), seconds * 1000 + 80);
    };

    if (prefersReducedMotion()) {
      el.setAttribute("data-revealed", "");
      el.setAttribute("data-settled", "");
      return;
    }

    const unobserve = observeOnce(el, (node) => {
      node.setAttribute("data-revealed", "");
      settle(node);
    });

    return () => {
      unobserve?.();
      clearTimeout(timer);
    };
  }, []);

  const step = stagger === true ? staggerScale.base : stagger ? staggerScale[stagger] : null;

  const clipsItself = !stagger && (variant === "clip" || variant === "wipe");

  const style: CSSProperties = {
    ...(delay ? { ["--reveal-delay" as string]: `${delay}ms` } : null),
    ...(y !== undefined ? { ["--reveal-rise" as string]: `${y}px` } : null),
    ...(step !== null ? { ["--reveal-step" as string]: `${step}s` } : null),
    ...(duration ? { ["--reveal-duration" as string]: `var(--dur-${duration})` } : null),
  };

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={[
        styles.reveal,
        stagger ? styles.stagger : clipsItself ? null : styles.solo,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {clipsItself ? <div className={styles.solo}>{children}</div> : children}
    </Tag>
  );
}
