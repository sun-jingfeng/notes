import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlContent = readFileSync(path.join(__dirname, 'resume.html'), 'utf-8');
const pdfPath = path.join(__dirname, 'React+Java全栈-985统招-北京-孙景峰.pdf');

// 使用本机安装的 Chrome（macOS 默认路径，Windows/Linux 可改为对应可执行路径）
const chromePath = process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: chromePath,
});
const page = await browser.newPage();
await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

const height = await page.evaluate(() => document.body.scrollHeight);
console.log(`Content height: ${height}px`);
console.log(`A4 usable height at 96dpi ≈ ${Math.round(297 * 96 / 25.4 - 2 * 12 * 96 / 25.4)}px (with 12mm margins)`);
console.log(`Estimated pages: ${Math.ceil(height / (297 * 96 / 25.4 - 2 * 12 * 96 / 25.4))}`);

await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: {
    top: '14mm',
    right: '14mm',
    bottom: '14mm',
    left: '14mm',
  },
});
await browser.close();
console.log(`PDF generated: ${pdfPath}`);
