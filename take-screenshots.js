const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:3000';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log('🚀 Starting screenshot capture...\n');

    // ============================================
    // 1. US Public Companies - Main page (all companies)
    // ============================================
    console.log('📸 1/20 - US Public Companies (main page)...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(2000);
    // Take full page screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-us-public-companies-main.png'),
      fullPage: true
    });
    console.log('   ✅ Saved: 01-us-public-companies-main.png');

    // ============================================
    // 2. US Public Companies - Filtered by sectors
    // ============================================
    // Get all filter buttons
    const filterButtons = await page.$$('.filter-btn');
    const sectors = [];
    for (const btn of filterButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      sectors.push(text);
    }
    console.log(`   Found sectors: ${sectors.join(', ')}`);

    let screenshotIndex = 2;
    for (let i = 1; i < sectors.length; i++) { // Skip "All" since we already captured it
      const sector = sectors[i];
      console.log(`📸 ${screenshotIndex}/20 - Sector filter: ${sector}...`);
      const buttons = await page.$$('.filter-btn');
      await buttons[i].click();
      await delay(1000);
      const safeName = sector.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${String(screenshotIndex).padStart(2, '0')}-sector-${safeName}.png`),
        fullPage: true
      });
      console.log(`   ✅ Saved: ${String(screenshotIndex).padStart(2, '0')}-sector-${safeName}.png`);
      screenshotIndex++;
    }

    // Reset to "All" filter
    const allButtons = await page.$$('.filter-btn');
    await allButtons[0].click();
    await delay(1000);

    // ============================================
    // 3. Company Detail pages (click each company card)
    // ============================================
    const companies = [
      'AAPL', 'MSFT', 'NVDA', 'AMZN', 'META', 'TSLA', 'GOOGL', 'AVGO', 'COST', 'NFLX', 'GS', 'MS'
    ];

    for (let i = 0; i < companies.length; i++) {
      const ticker = companies[i];
      console.log(`📸 ${screenshotIndex}/20 - Company Detail: ${ticker}...`);
      
      // Make sure we're on the main page first
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
      await delay(1500);

      // Find and click the company card
      const cards = await page.$$('.company-card');
      if (cards[i]) {
        await cards[i].click();
        await delay(2000);
        
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${String(screenshotIndex).padStart(2, '0')}-company-detail-${ticker.toLowerCase()}.png`),
          fullPage: true
        });
        console.log(`   ✅ Saved: ${String(screenshotIndex).padStart(2, '0')}-company-detail-${ticker.toLowerCase()}.png`);
      } else {
        console.log(`   ⚠️ Could not find card for ${ticker}`);
      }
      screenshotIndex++;
    }

    // ============================================
    // 4. 10-K Analysis tab
    // ============================================
    console.log(`📸 ${screenshotIndex}/20 - 10-K Analysis tab...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    
    // Click the 10-K Analysis tab
    const navTabs = await page.$$('.app-nav-tab');
    if (navTabs[1]) {
      await navTabs[1].click();
      await delay(2000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${String(screenshotIndex).padStart(2, '0')}-10k-analysis.png`),
        fullPage: true
      });
      console.log(`   ✅ Saved: ${String(screenshotIndex).padStart(2, '0')}-10k-analysis.png`);
    }
    screenshotIndex++;

    // ============================================
    // 5. Stock Screener tab
    // ============================================
    console.log(`📸 ${screenshotIndex}/20 - Stock Screener tab...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    
    const navTabs2 = await page.$$('.app-nav-tab');
    if (navTabs2[2]) {
      await navTabs2[2].click();
      await delay(2000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${String(screenshotIndex).padStart(2, '0')}-stock-screener.png`),
        fullPage: true
      });
      console.log(`   ✅ Saved: ${String(screenshotIndex).padStart(2, '0')}-stock-screener.png`);
    }
    screenshotIndex++;

    // ============================================
    // 6. Forecast & Alerts tab
    // ============================================
    console.log(`📸 ${screenshotIndex}/20 - Forecast & Alerts tab...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    
    const navTabs3 = await page.$$('.app-nav-tab');
    if (navTabs3[3]) {
      await navTabs3[3].click();
      await delay(2000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${String(screenshotIndex).padStart(2, '0')}-forecast-alerts.png`),
        fullPage: true
      });
      console.log(`   ✅ Saved: ${String(screenshotIndex).padStart(2, '0')}-forecast-alerts.png`);
    }
    screenshotIndex++;

    // ============================================
    // 7. Industry Risk tab
    // ============================================
    console.log(`📸 ${screenshotIndex}/20 - Industry Risk tab...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    
    const navTabs4 = await page.$$('.app-nav-tab');
    if (navTabs4[4]) {
      await navTabs4[4].click();
      await delay(2000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${String(screenshotIndex).padStart(2, '0')}-industry-risk.png`),
        fullPage: true
      });
      console.log(`   ✅ Saved: ${String(screenshotIndex).padStart(2, '0')}-industry-risk.png`);
    }
    screenshotIndex++;

    // ============================================
    // 8. Watchlist tab
    // ============================================
    console.log(`📸 ${screenshotIndex}/20 - Watchlist tab...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    
    const navTabs5 = await page.$$('.app-nav-tab');
    if (navTabs5[5]) {
      await navTabs5[5].click();
      await delay(2000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${String(screenshotIndex).padStart(2, '0')}-watchlist.png`),
        fullPage: true
      });
      console.log(`   ✅ Saved: ${String(screenshotIndex).padStart(2, '0')}-watchlist.png`);
    }
    screenshotIndex++;

    console.log(`\n🎉 All screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log(`📁 Total screenshots: ${screenshotIndex - 1}`);

  } catch (error) {
    console.error('❌ Error taking screenshots:', error.message);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
