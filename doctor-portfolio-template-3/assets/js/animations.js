// Small scroll-triggered animation helper using IntersectionObserver
(function () {
    'use strict';

    const PAGE_TRANSITION_MS = 320;

    // Page transition: fade-in on load and fade-out on internal link click
    function setupPageTransitions() {
        const body = document.body;

        // If body has the hidden class (set in HTML), fade it in
        function fadeIn() {
            // Trigger a paint then add ready class to animate opacity
            requestAnimationFrame(() => {
                body.classList.add('page-transition-ready');
                body.classList.remove('page-transition-hidden');
            });
        }

        // Intercept link clicks for internal navigation to play exit animation
        function onDocumentClick(e) {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            // ignore external links, anchors, mailto/tel, downloads, or links with target
            if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;
            try {
                const url = new URL(href, location.href);
                if (url.origin !== location.origin) return; // external
            } catch (err) {
                return; // malformed
            }
            if (a.target && a.target !== '' && a.target !== '_self') return;

            // internal navigation: animate out then navigate
            e.preventDefault();
            body.classList.add('page-transition-exit');
            setTimeout(() => {
                window.location.href = a.href;
            }, PAGE_TRANSITION_MS);
        }

        document.addEventListener('click', onDocumentClick);

        // run fadeIn on DOMContentLoaded (if DOM already loaded, run immediately)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fadeIn);
        } else {
            fadeIn();
        }
    }

    function onIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('anim-in-view');
                observer.unobserve(entry.target);
            }
        });
    }

    function initAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: simply add class after a short delay
            document.querySelectorAll('.anim-on-scroll').forEach(el => el.classList.add('anim-in-view'));
            return;
        }

        const observer = new IntersectionObserver(onIntersect, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.15
        });

        document.querySelectorAll('.anim-on-scroll').forEach(el => {
            // ensure start state
            if (!el.classList.contains('anim-hidden')) el.classList.add('anim-hidden');
            observer.observe(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { initAnimations(); setupPageTransitions(); });
    } else {
        initAnimations(); setupPageTransitions();
    }
})();
