// Movimento progressivo: todo o conteúdo permanece acessível sem JavaScript.
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if ('IntersectionObserver' in window && !reducedMotion.matches) {
        const elements = document.querySelectorAll(
            '.section-heading, .benefit-card, .feature-copy, .feature-visual, ' +
            '.screenshots-grid > .phone-frame, .contact-section > *, .company-showcase, .section-block.reveal'
        );
        const observer = new IntersectionObserver((entries, currentObserver) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                }
            }
        }, { threshold: 0.01, rootMargin: '0px 0px -35px 0px' });

        elements.forEach(element => {
            element.classList.add('reveal');
            observer.observe(element);
        });
        document.documentElement.classList.add('motion-ready');
    }

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const movingVisuals = [
        ['.hero-company', '.company-showcase', 11],
        ['.hero-product .hero-visual', '.phone-hero', 12],
        ['.feature-visual', '.phone-feature', 8]
    ];

    for (const [areaSelector, visualSelector, distance] of movingVisuals) {
        const area = document.querySelector(areaSelector);
        const visual = area?.querySelector(visualSelector);
        if (!visual) continue;

        let frame = 0;
        let x = 0;
        let y = 0;

        area.addEventListener('pointermove', event => {
            if (reducedMotion.matches) return;
            const bounds = area.getBoundingClientRect();
            x = (event.clientX - bounds.left) / bounds.width - 0.5;
            y = (event.clientY - bounds.top) / bounds.height - 0.5;

            if (frame) return;
            frame = requestAnimationFrame(() => {
                visual.style.transform = `translate3d(${x * distance}px, ${y * distance}px, 0) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
                frame = 0;
            });
        }, { passive: true });

        const reset = () => {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
            visual.style.transform = '';
        };

        area.addEventListener('pointerleave', reset);
        reducedMotion.addEventListener('change', event => {
            if (event.matches) reset();
        });
    }
})();
