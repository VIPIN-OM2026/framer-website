/**
 * main.js — Application entry point
 *
 * Execution order:
 *  1. ThemeManager.init()         — apply theme before paint
 *  2. Store scroll tracking       — passive, always on
 *  3. Component init              — each component queries its own scope
 *  4. Orchestrator.init()         — lazy-loads GSAP, builds all timelines
 *  5. Post-load refresh           — ScrollTrigger recalc after fonts/images
 *
 * This module imports components and orchestrates them.
 * It does NOT contain any business logic.
 */

import './styles/main.css'

import ThemeManager from './theme.js'
import store from './store.js'
import orchestrator from './animation/orchestrator.js'

import Nav from './components/Nav.js'
import Hero from './components/Hero.js'
import Marquee from './components/Marquee.js'
import WorkGrid from './components/WorkGrid.js'
import About from './components/About.js'
import CTA from './components/CTA.js'
import Footer from './components/Footer.js'

import { qs } from './utils/dom.js'
import { debounce } from './utils/events.js'
import { prefersReducedMotion } from './utils/media.js'

// ─── 1. Theme — must run first, synchronously ────────────────────────────────
ThemeManager.init()

// ─── 2. Store — detect reduced motion once ───────────────────────────────────
store.set('reducedMotion', prefersReducedMotion())

// ─── 3. Bootstrap after DOM is ready ─────────────────────────────────────────
const bootstrap = async () => {
    // ── Component instances ──────────────────────────────────────────────────

    const navEl = qs('#nav')
    const heroEl = qs('#hero')
    const marqueeEl = qs('#marquee')
    const workEl = qs('#work')
    const aboutEl = qs('#about')
    const ctaEl = qs('#cta')
    const footerEl = qs('#footer')

    // Guard — elements may not exist on every page
    const nav = navEl ? Nav(navEl) : null
    const hero = heroEl ? Hero(heroEl) : null
    const marquee = marqueeEl ? Marquee(marqueeEl, { speed: 0.6 }) : null
    const work = workEl ? WorkGrid(workEl) : null
    const about = aboutEl ? About(aboutEl) : null
    const cta = ctaEl ? CTA(ctaEl) : null
    const footer = footerEl ? Footer(footerEl) : null

    // Init all components
    nav?.init()
    hero?.init()
    marquee?.init()
    work?.init()
    about?.init()
    cta?.init()
    footer?.init()

    // ── 4. Animation orchestrator — lazy loads GSAP internally ───────────────

    // Collect section elements from components that expose them
    const sectionElements = {
        hero: hero?.elements ?? null,
        marquee: { section: marqueeEl },
        work: work?.elements ?? null,
        about: about?.elements ?? null,
        cta: cta?.elements ?? null,
    }

    await orchestrator.init(sectionElements)

    // ── 5. Post-load refresh ─────────────────────────────────────────────────

    // Refresh ScrollTrigger after fonts are loaded
    document.fonts.ready.then(() => {
        orchestrator.refresh()
    })

    // Refresh on image load (for accurate section heights)
    window.addEventListener('load', () => {
        orchestrator.refresh()
    }, { once: true })

    // Debounced resize handler
    const onResize = debounce(() => {
        orchestrator.refresh()
    }, 200)

    window.addEventListener('resize', onResize, { passive: true })

    // ── Debug mode — enabled via ?debug in URL ───────────────────────────────
    if (import.meta.env.DEV || new URLSearchParams(location.search).has('debug')) {
        window.__app = { store, orchestrator, nav, hero, marquee, work, about, cta, footer }
    }
}

// Wait for DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap)
} else {
    bootstrap()
}