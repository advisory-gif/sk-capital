import { useEffect } from 'react';

/** Scroll parallax and the Grow / Fix / Stop crossfade. No-ops when motion is reduced or unsupported. */
export function useHomeMotion() {
  useEffect(() => {
    if (!window.matchMedia || !window.requestAnimationFrame) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;

    const root = document.documentElement;
    const story = document.querySelector<HTMLElement>('#review');
    const slides = story ? [...story.querySelectorAll<HTMLElement>('.story-slide')] : [];
    const panels = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
    root.classList.add('motion-on');
    story?.classList.add('story-ready');

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewHeight = window.innerHeight || 1;
      panels.forEach(panel => {
        const image = panel.querySelector<HTMLElement>('.panel-photo');
        if (!image) return;
        const rect = panel.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > viewHeight + 80) return;
        const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
        const shift = (progress - 0.5) * -36;
        image.style.transform = `translate3d(0, ${shift}px, 0)`;
      });
      if (!story || slides.length < 2) return;
      const rect = story.getBoundingClientRect();
      const span = Math.max(rect.height - viewHeight, 1);
      // Finish the last slide before the next panel covers this one.
      const progress = Math.min(1, Math.max(0, (-rect.top / span) / 0.82));
      story.style.setProperty('--story', progress.toFixed(4));
      const local = progress * (slides.length - 1);
      slides.forEach((slide, index) => {
        const opacity = Math.max(0, Math.min(1, 1 - Math.abs(local - index)));
        slide.style.opacity = opacity.toFixed(3);
        const active = opacity > 0.45;
        slide.style.pointerEvents = active ? 'auto' : 'none';
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const stop = () => {
      if (!preference.matches) return;
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove('motion-on');
      story?.classList.remove('story-ready');
      story?.style.removeProperty('--story');
      slides.forEach(slide => {
        slide.style.opacity = '';
        slide.style.pointerEvents = '';
        slide.removeAttribute('aria-hidden');
      });
      panels.forEach(panel => {
        const image = panel.querySelector<HTMLElement>('.panel-photo');
        if (image) image.style.transform = '';
      });
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    preference.addEventListener('change', stop);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      preference.removeEventListener('change', stop);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove('motion-on');
      story?.classList.remove('story-ready');
    };
  }, []);
}
