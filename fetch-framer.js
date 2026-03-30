import fs from 'fs';
import https from 'https';

https.get('https://fabrica.framer.media/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('framer-page.html', data);
        console.log('Saved framer-page.html. Parsing inline styles...');
        
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        let match;
        let allCSS = '';
        while ((match = styleRegex.exec(data)) !== null) {
            allCSS += match[1] + '\n';
        }

        fs.writeFileSync('framer-styles.css', allCSS);
        console.log('Saved framer-styles.css.');

        // Extract CSS variables (themes, colors) from style blocks
        const cssVarRegex = /(--[a-zA-Z0-9-]+):\s*([^;]+)/g;
        const cssVars = new Set();
        while ((match = cssVarRegex.exec(allCSS)) !== null) {
            cssVars.add(`${match[1]}: ${match[2]}`);
        }
        
        fs.writeFileSync('framer-vars.txt', Array.from(cssVars).join('\n'));
        console.log('Variables extracted to framer-vars.txt');
    });
});
