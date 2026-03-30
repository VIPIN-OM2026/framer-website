/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{html,js}',
        './src/partials/**/*.html',
    ],

    // Dark mode is handled via data-theme attribute, not Tailwind's class strategy
    darkMode: ['selector', '[data-theme="dark"]'],

    theme: {
        extend: {
            // ── Colors — all reference CSS custom properties ───────────────────
            colors: {
                bg: {
                    primary: 'var(--color-bg-primary)',
                    secondary: 'var(--color-bg-secondary)',
                    tertiary: 'var(--color-bg-tertiary)',
                    inverse: 'var(--color-bg-inverse)',
                    surface: 'var(--color-bg-surface)',
                    elevated: 'var(--color-bg-elevated)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    tertiary: 'var(--color-text-tertiary)',
                    inverse: 'var(--color-text-inverse)',
                    accent: 'var(--color-text-accent)',
                },
                border: {
                    subtle: 'var(--color-border-subtle)',
                    default: 'var(--color-border-default)',
                    strong: 'var(--color-border-strong)',
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    hover: 'var(--color-accent-hover)',
                    muted: 'var(--color-accent-muted)',
                },
            },

            // ── Typography ─────────────────────────────────────────────────────
            fontFamily: {
                display: ['var(--font-display)'],
                body: ['var(--font-body)'],
                mono: ['var(--font-mono)'],
            },

            fontSize: {
                'hero': ['var(--text-hero)', { lineHeight: 'var(--leading-tight)' }],
                '5xl-f': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
                '4xl-f': ['var(--text-4xl)', { lineHeight: 'var(--leading-snug)' }],
                '3xl-f': ['var(--text-3xl)', { lineHeight: 'var(--leading-snug)' }],
                '2xl-f': ['var(--text-2xl)', { lineHeight: 'var(--leading-snug)' }],
                'xl-f': ['var(--text-xl)', { lineHeight: 'var(--leading-normal)' }],
                'lg-f': ['var(--text-lg)', { lineHeight: 'var(--leading-relaxed)' }],
                'base-f': ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
                'sm-f': ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
                'xs-f': ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
            },

            // ── Spacing ────────────────────────────────────────────────────────
            spacing: {
                'section': 'var(--section-gap)',
                'container-pad': 'var(--container-pad)',
            },

            maxWidth: {
                container: 'var(--container-max)',
            },

            // ── Transitions ────────────────────────────────────────────────────
            transitionDuration: {
                fast: 'var(--duration-fast)',
                base: 'var(--duration-base)',
                moderate: 'var(--duration-moderate)',
                slow: 'var(--duration-slow)',
            },

            transitionTimingFunction: {
                'out-expo': 'var(--ease-out-expo)',
                'out-quart': 'var(--ease-out-quart)',
                'spring': 'var(--ease-spring)',
                'in-out': 'var(--ease-in-out)',
            },

            // ── Z-index ────────────────────────────────────────────────────────
            zIndex: {
                below: 'var(--z-below)',
                raised: 'var(--z-raised)',
                float: 'var(--z-float)',
                dropdown: 'var(--z-dropdown)',
                sticky: 'var(--z-sticky)',
                overlay: 'var(--z-overlay)',
                modal: 'var(--z-modal)',
                cursor: 'var(--z-cursor)',
            },

            // ── Border radius ──────────────────────────────────────────────────
            borderRadius: {
                DEFAULT: 'var(--border-radius)',
                md: 'var(--border-radius-md)',
                lg: 'var(--border-radius-lg)',
                full: 'var(--border-radius-full)',
            },
        },
    },

    plugins: [],
}