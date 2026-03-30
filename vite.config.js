import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/claude-task/',
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          includeFile: (file) => {
            return fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
          }
        }
      }
    })
  ]
});