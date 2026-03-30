import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chinesePdfName = '智能体 Web 全栈(React+Vue+Java)-985统招-北京-孙景峰.pdf';
const englishPdfName = 'AI Agent Full-Stack Web Developer (React+Vue+Java).pdf';
const templates = [
  {
    label: '中文',
    templateName: '简历模板.html',
    pdfName: chinesePdfName,
  },
  {
    label: '英文',
    templateName: '简历模板-英文.html',
    pdfName: englishPdfName,
  },
];

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

const a4UsableHeight = Math.round(297 * 96 / 25.4 - 2 * 12 * 96 / 25.4);

for (const template of templates) {
  const htmlContent = readFileSync(path.join(__dirname, template.templateName), 'utf-8');
  const pdfPath = path.join(__dirname, template.pdfName);
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log(`[${template.label}] Content height: ${height}px`);
  console.log(`[${template.label}] A4 usable height at 96dpi ≈ ${a4UsableHeight}px (with 12mm margins)`);
  console.log(`[${template.label}] Estimated pages: ${Math.ceil(height / a4UsableHeight)}`);

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '14mm',
      right: '12mm',
      bottom: '14mm',
      left: '12mm',
    },
  });

  await page.close();
  console.log(`[${template.label}] PDF generated: ${pdfPath}`);
}

await browser.close();
