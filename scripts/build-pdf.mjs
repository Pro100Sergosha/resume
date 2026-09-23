// Renders public/index.html with its print stylesheet into the downloadable CV,
// so the PDF always matches the site. Runs as a Firebase predeploy hook.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const out = root + 'Sergo_Azizbekyan.pdf';

// ponytail: known install paths only; set CHROME to override on other machines.
const chrome = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));
if (!chrome) throw new Error('Chrome not found; set CHROME to its path.');

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  // Keep PDF builds out of the visitor stats.
  '--host-resolver-rules=MAP static.cloudflareinsights.com 0.0.0.0',
  '--virtual-time-budget=10000', // let Google Fonts load before printing
  `--print-to-pdf=${out}`,
  pathToFileURL(root + 'index.html').href,
], { stdio: 'inherit' });

if (!existsSync(out)) throw new Error('PDF was not produced.');
console.log('CV written to', out);
