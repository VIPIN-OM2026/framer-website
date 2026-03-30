import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import fs from 'fs'
import path from 'path'

export default defineConfig({
    root: '.',

    plugins: [
        createHtmlPlugin({
            minify: false, // Minification might break some EJS setups depending on when it runs
            inject: {
                data: {
                    title: 'fabrica® Studio',
                    // The user's HTML calls: includeFile('./src/partials/...')
                    includeFile: (filePath) => {
                        const absPath = path.resolve(process.cwd(), filePath);
                        return fs.readFileSync(absPath, 'utf-8');
                    }
                }
            }
        })
    ],

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'es2020',
        rollupOptions: {
            output: {
                // Separate GSAP into its own chunk — loaded lazily
                manualChunks: {
                    gsap: ['gsap'],
                },
            },
        },
    },

    server: {
        port: 3000,
        open: true,
    },

    css: {
        devSourcemap: true,
    },
})