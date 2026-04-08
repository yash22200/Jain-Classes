import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

const files = [
  path.join(srcDir, 'pages', 'AdminDashboard.tsx'),
  path.join(srcDir, 'pages', 'StudentDashboard.tsx'),
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace fetch("/api/... with fetch(`${API_URL}/api/...
  content = content.replace(/fetch\("\/api\//g, 'fetch(`${API_URL}/api/');
  
  // Replace fetch(`/api/... with fetch(`${API_URL}/api/...  
  content = content.replace(/fetch\(`\/api\//g, 'fetch(`${API_URL}/api/');
  
  // Replace href={`/uploads/... or href={`/... patterns for file links
  content = content.replace(/href=\{`\//g, 'href={`${API_URL}/');
  
  // Fix closing quotes on converted fetch lines:
  // fetch(`${API_URL}/api/admin/students" => fetch(`${API_URL}/api/admin/students`
  content = content.replace(/(fetch\(`\$\{API_URL\}\/api\/[^"]*)"(\s*,)/g, '$1`$2');
  content = content.replace(/(fetch\(`\$\{API_URL\}\/api\/[^"]*)"(\s*\))/g, '$1`$2');
  
  // Add import if not already present
  if (!content.includes('import { API_URL }')) {
    content = content.replace(
      /(import .+ from .+;\r?\n)/,
      '$1import { API_URL } from "@/lib/api";\n'
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${path.basename(filePath)}`);
});

console.log('All done!');
