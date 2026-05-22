import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useFadeInUp(
  selector: string,
  options?: { stagger?: number; duration?: number; delay?: number }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(elements, {
        y: 30,
        opacity: 0,
        duration: options?.duration ?? 0.7,
        stagger: options?.stagger ?? 0.1,
        delay: options?.delay ?? 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [selector, options?.stagger, options?.duration, options?.delay]);

  return ref;
}

export function useScrollReveal(
  selector: string,
  options?: {
    x?: number;
    y?: number;
    scale?: number;
    stagger?: number;
    duration?: number;
    start?: string;
    end?: string;
  }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(elements, {
        x: options?.x ?? 0,
        y: options?.y ?? 40,
        scale: options?.scale ?? 1,
        opacity: 0,
        duration: options?.duration ?? 0.8,
        stagger: options?.stagger ?? 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: options?.start ?? 'top 80%',
          end: options?.end ?? 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}
