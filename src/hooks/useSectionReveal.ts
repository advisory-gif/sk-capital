import { useEffect } from 'react';

/** Progressive enhancement: nothing is hidden while waiting for an observer. */
export function useSectionReveal() {
  useEffect(() => {
    if (!window.matchMedia || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!preference.matches) entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    elements.forEach(element => observer.observe(element));
    const stopMotion = () => {
      if (!preference.matches) return;
      observer.disconnect();
      elements.forEach(element => element.classList.remove('is-revealed'));
    };
    preference.addEventListener('change', stopMotion);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', stopMotion);
      elements.forEach(element => element.classList.remove('is-revealed'));
    };
  }, []);
}
