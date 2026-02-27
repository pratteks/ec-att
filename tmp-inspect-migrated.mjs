import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/home/node/.npm/_npx/2334a3ea0ef73d73/node_modules/playwright');
import fs from 'fs';
import path from 'path';

const PLUGIN_ROOT = '/home/node/.claude/plugins/cache/excat-marketplace/excat/2.1.1';
const SESSION_DIR = '/workspace/migration-work/critique/content-index_1772170100';
const TARGET_URL = 'http://localhost:3000/content/index';
const BLOCK_SELECTOR = 'xpath=/html/body[1]';
const OUTPUT_FOLDER = 'migrated';
const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const BATCH_SIZE = 5;

const outputDir = path.join(SESSION_DIR, OUTPUT_FOLDER);
fs.mkdirSync(outputDir, { recursive: true });

/**
 * Wraps a Playwright page to support multi-argument page.evaluate() calls
 * used by the library scripts (which were written for an older API).
 */
function wrapPage(page) {
  const origEvaluate = page.evaluate.bind(page);
  page.evaluate = function(fn, ...args) {
    if (args.length > 1) {
      // Wrap multiple args into an array and destructure in the function
      const wrappedFn = new Function(
        'args',
        `return (${fn.toString()})(...args)`
      );
      return origEvaluate(wrappedFn, args);
    }
    return origEvaluate(fn, args[0]);
  };
  return page;
}

let browser;
let totalCollected = 0;
let totalErrors = 0;

try {
  // Step 3: Initialize Browser and Navigate
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const rawPage = await context.newPage();
  const page = wrapPage(rawPage);

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector(BLOCK_SELECTOR, { timeout: 10000 });
  console.log('Page loaded successfully');

  // Step 4: Discover XPaths
  const { discoverXPaths } = await import(`${PLUGIN_ROOT}/sub-agents/excat-critique/scripts/discover-xpaths.js`);
  const xpaths = await discoverXPaths(page, BLOCK_SELECTOR);

  fs.writeFileSync(path.join(outputDir, 'xpaths.json'), JSON.stringify(xpaths, null, 2));
  console.log(`Discovered ${xpaths.length} XPaths`);

  // Step 5: Collect Element Data in Batches
  const { inspectXpathsBatch } = await import(`${PLUGIN_ROOT}/sub-agents/excat-critique/scripts/inspect-xpaths-batch.js`);

  const batches = [];
  for (let i = 0; i < xpaths.length; i += BATCH_SIZE) {
    batches.push(xpaths.slice(i, i + BATCH_SIZE));
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const { results, errors } = await inspectXpathsBatch(page, batch, MIN_WIDTH, MIN_HEIGHT);

    for (const item of results) {
      fs.writeFileSync(path.join(outputDir, `${item.filename}.png`), item.screenshot);
      fs.writeFileSync(path.join(outputDir, `${item.filename}.json`), JSON.stringify({ xpath: item.xpath, styles: item.styles }, null, 2));
      fs.writeFileSync(path.join(outputDir, `${item.filename}.html`), item.html);
    }

    totalCollected += results.length;
    totalErrors += errors.length;
    console.log(`Batch ${i + 1}/${batches.length}: collected ${results.length}, errors ${errors.length}`);
  }

  if (totalCollected === 0) {
    throw new Error('No elements were collected');
  }

  // Step 6: Close Browser
  await browser.close();
  browser = null;

  // Step 7: Update Session
  const sessionPath = path.join(SESSION_DIR, 'session.json');
  const session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));

  if (!session.status) session.status = {};
  session.status.migrated_collection_complete = true;

  if (!session.collection_metadata) session.collection_metadata = {};
  session.collection_metadata[OUTPUT_FOLDER] = {
    elements: totalCollected,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));
  console.log(`SUCCESS: Collected ${totalCollected} elements, ${totalErrors} errors`);

} catch (err) {
  console.error('ERROR:', err.message);

  // Error Recovery
  try {
    if (browser) await browser.close();

    const sessionPath = path.join(SESSION_DIR, 'session.json');
    const session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));

    if (!session.status) session.status = {};
    session.status.migrated_collection_complete = false;

    if (!session.collection_metadata) session.collection_metadata = {};
    session.collection_metadata[OUTPUT_FOLDER] = {
      error: err.message,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));
  } catch (recoveryErr) {
    console.error('Recovery failed:', recoveryErr.message);
  }

  process.exit(1);
}
