import fs from 'fs';
import path from 'path';

function removeComments(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/(?<!:)\/\/.*$/gm, '');
    content = content.replace(/^\s*[\r\n]/gm, '');
    fs.writeFileSync(filePath, content, 'utf-8');
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.js')) {
            removeComments(fullPath);
        }
    }
}

traverse(path.join(process.cwd(), 'src'));
console.log('Comments stripped from JS files');
