const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const PDF_OUTPUT = path.join(__dirname, 'screenshots', 'All-Pages-Screenshots.pdf');
const BASE_URL = 'http://localhost:3000';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to click a nav tab by index within a selector
async function clickTab(page, selector, index) {
  const tabs = await page.$$(selector);
  if (tabs[index]) {
    await tabs[index].click();
    await delay(2000);
    return true;
  }
  return false;
}

async function screenshot(page, filename, label) {
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`   ✅ ${label} → ${filename}`);
  return { filename, label, filepath };
}

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const allScreenshots = [];
  let idx = 1;

  function fname(name) {
    return `${String(idx).padStart(2, '0')}-${name}.png`;
  }

  try {
    console.log('🚀 Starting comprehensive screenshot capture...\n');

    // ============================================================
    // SECTION 1: US Public Companies - Main page
    // ============================================================
    console.log('━━━ SECTION 1: US Public Companies ━━━');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(2000);
    allScreenshots.push(await screenshot(page, fname('us-companies-main'), 'US Public Companies - Main Page'));
    idx++;

    // Sector filters
    const filterButtons = await page.$$('.filter-btn');
    const sectors = [];
    for (const btn of filterButtons) {
      sectors.push(await page.evaluate(el => el.textContent, btn));
    }

    for (let i = 1; i < sectors.length; i++) {
      const sector = sectors[i];
      const buttons = await page.$$('.filter-btn');
      await buttons[i].click();
      await delay(1000);
      const safeName = sector.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      allScreenshots.push(await screenshot(page, fname(`sector-${safeName}`), `Sector Filter: ${sector}`));
      idx++;
    }

    // Reset to All
    const allBtns = await page.$$('.filter-btn');
    await allBtns[0].click();
    await delay(1000);

    // ============================================================
    // SECTION 2: Company Detail Pages
    // ============================================================
    console.log('\n━━━ SECTION 2: Company Detail Pages ━━━');
    const companies = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'META', 'TSLA', 'GOOGL', 'AVGO', 'COST', 'NFLX', 'GS', 'MS'];

    for (let i = 0; i < companies.length; i++) {
      const ticker = companies[i];
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
      await delay(1500);
      const cards = await page.$$('.company-card');
      if (cards[i]) {
        await cards[i].click();
        await delay(2000);
        allScreenshots.push(await screenshot(page, fname(`company-${ticker.toLowerCase()}`), `Company Detail: ${ticker}`));
      }
      idx++;
    }

    // ============================================================
    // SECTION 3: 10-K Analysis - All Sub-tabs
    // ============================================================
    console.log('\n━━━ SECTION 3: 10-K Disclosure Analysis ━━━');
    const tenkSubTabs = [
      { name: 'overview', label: '10-K Analysis - Overview' },
      { name: 'readability', label: '10-K Analysis - Readability' },
      { name: 'specificity', label: '10-K Analysis - Specificity' },
      { name: 'consistency', label: '10-K Analysis - Consistency' },
      { name: 'richness', label: '10-K Analysis - Information Richness' },
      { name: 'comparison', label: '10-K Analysis - Industry Comparison' },
      { name: 'investor-guide', label: '10-K Analysis - Investor Guide' },
    ];

    for (let t = 0; t < tenkSubTabs.length; t++) {
      // Navigate to main page first, then click 10-K tab
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
      await delay(1000);
      
      // Click 10-K Analysis main tab (index 1)
      await clickTab(page, '.app-nav-tab', 1);
      await delay(1500);

      // Click the sub-tab
      const subTabs = await page.$$('.nav-tab');
      if (subTabs[t]) {
        await subTabs[t].click();
        await delay(2500);
      }

      allScreenshots.push(await screenshot(page, fname(`10k-${tenkSubTabs[t].name}`), tenkSubTabs[t].label));
      idx++;
    }

    // ============================================================
    // SECTION 4: Stock Screener
    // ============================================================
    console.log('\n━━━ SECTION 4: Stock Screener ━━━');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    await clickTab(page, '.app-nav-tab', 2);
    await delay(2000);
    allScreenshots.push(await screenshot(page, fname('stock-screener'), 'Stock Screener'));
    idx++;

    // ============================================================
    // SECTION 5: Forecast & Alerts - All Sub-views
    // ============================================================
    console.log('\n━━━ SECTION 5: Forecast & Alerts ━━━');
    const forecastSubViews = [
      { name: 'overview', label: 'Forecast - Risk Overview' },
      { name: 'company-deep-dive', label: 'Forecast - Company Deep Dive' },
      { name: 'active-alerts', label: 'Forecast - Active Alerts' },
      { name: 'methodology', label: 'Forecast - Model & Methodology' },
    ];

    for (let t = 0; t < forecastSubViews.length; t++) {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
      await delay(1000);
      
      // Click Forecast tab (index 3)
      await clickTab(page, '.app-nav-tab', 3);
      await delay(1500);

      // Click the sub-view button
      const forecastBtns = await page.$$('.forecast-nav-btn');
      if (forecastBtns[t]) {
        await forecastBtns[t].click();
        await delay(2500);
      }

      allScreenshots.push(await screenshot(page, fname(`forecast-${forecastSubViews[t].name}`), forecastSubViews[t].label));
      idx++;
    }

    // ============================================================
    // SECTION 6: Industry Risk - All Sub-views
    // ============================================================
    console.log('\n━━━ SECTION 6: Industry Risk ━━━');
    
    // 6a. Overview
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    await clickTab(page, '.app-nav-tab', 4);
    await delay(2000);
    allScreenshots.push(await screenshot(page, fname('industry-risk-overview'), 'Industry Risk - Overview'));
    idx++;

    // 6b. Sector Deep Dive - each sector
    const industrySectors = ['technology', 'retail', 'industrial', 'banking'];
    const industrySectorLabels = ['Technology', 'Retail', 'Industrial', 'Banking'];

    for (let s = 0; s < industrySectors.length; s++) {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
      await delay(1000);
      await clickTab(page, '.app-nav-tab', 4);
      await delay(1500);

      // Click "Sector Deep Dive" sub-nav (index 1)
      const irNavBtns = await page.$$('.ir-nav-btn');
      if (irNavBtns[1]) {
        await irNavBtns[1].click();
        await delay(1500);
      }

      // Click the sector button
      const sectorBtns = await page.$$('.ir-sector-btn');
      if (sectorBtns[s]) {
        await sectorBtns[s].click();
        await delay(2000);
      }

      allScreenshots.push(await screenshot(page, fname(`industry-sector-${industrySectors[s]}`), `Industry Risk - Sector: ${industrySectorLabels[s]}`));
      idx++;
    }

    // 6c. Company Analysis
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    await clickTab(page, '.app-nav-tab', 4);
    await delay(1500);
    const irNavBtns2 = await page.$$('.ir-nav-btn');
    if (irNavBtns2[2]) {
      await irNavBtns2[2].click();
      await delay(2000);
    }
    allScreenshots.push(await screenshot(page, fname('industry-company-analysis'), 'Industry Risk - Company Analysis'));
    idx++;

    // 6d. Systemic Signals
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    await clickTab(page, '.app-nav-tab', 4);
    await delay(1500);
    const irNavBtns3 = await page.$$('.ir-nav-btn');
    if (irNavBtns3[3]) {
      await irNavBtns3[3].click();
      await delay(2000);
    }
    allScreenshots.push(await screenshot(page, fname('industry-systemic-signals'), 'Industry Risk - Systemic Signals'));
    idx++;

    // ============================================================
    // SECTION 7: Watchlist
    // ============================================================
    console.log('\n━━━ SECTION 7: Watchlist ━━━');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000);
    await clickTab(page, '.app-nav-tab', 5);
    await delay(2000);
    allScreenshots.push(await screenshot(page, fname('watchlist'), 'Watchlist Dashboard'));
    idx++;

    console.log(`\n🎉 All ${allScreenshots.length} screenshots captured!`);
    console.log(`📁 Saved to: ${SCREENSHOT_DIR}\n`);

    // ============================================================
    // GENERATE PDF
    // ============================================================
    console.log('📄 Generating PDF...');
    await generatePDF(allScreenshots);
    console.log(`✅ PDF saved to: ${PDF_OUTPUT}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

async function generatePDF(screenshots) {
  return new Promise((resolve, reject) => {
    // Use a large page size to fit full-width screenshots
    const doc = new PDFDocument({
      autoFirstPage: false,
      margin: 30,
    });

    const stream = fs.createWriteStream(PDF_OUTPUT);
    doc.pipe(stream);

    // Title page
    doc.addPage({ size: [1920 * 0.5, 1080 * 0.5], margin: 40 });
    doc.fontSize(36).font('Helvetica-Bold').fillColor('#1e293b')
      .text('US Public Companies Dashboard', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).font('Helvetica').fillColor('#64748b')
      .text('Complete Website Screenshots', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#94a3b8')
      .text('Financial intelligence powered by SEC 10-K filings', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).fillColor('#64748b')
      .text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`Total Pages: ${screenshots.length}`, { align: 'center' });

    // Table of Contents
    doc.moveDown(2);
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#1e293b')
      .text('Table of Contents', { align: 'center' });
    doc.moveDown(1);

    let currentSection = '';
    screenshots.forEach((s, i) => {
      const section = s.label.split(' - ')[0];
      if (section !== currentSection) {
        currentSection = section;
        doc.moveDown(0.3);
        doc.fontSize(13).font('Helvetica-Bold').fillColor('#3b82f6')
          .text(section);
      }
      doc.fontSize(10).font('Helvetica').fillColor('#475569')
        .text(`  ${i + 1}. ${s.label}`, { indent: 20 });
    });

    // Screenshot pages
    for (const s of screenshots) {
      try {
        const imgBuffer = fs.readFileSync(s.filepath);
        const img = doc.openImage(imgBuffer);
        
        // Calculate page dimensions to fit the image
        const maxWidth = 960; // Half of 1920 for reasonable PDF size
        const scale = maxWidth / img.width;
        const pageWidth = maxWidth + 60; // margins
        const pageHeight = (img.height * scale) + 100; // extra for title

        doc.addPage({ size: [pageWidth, pageHeight], margin: 30 });
        
        // Page title
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1e293b')
          .text(s.label, 30, 30, { width: pageWidth - 60 });
        doc.moveDown(0.3);
        doc.fontSize(9).font('Helvetica').fillColor('#94a3b8')
          .text(`File: ${s.filename}`);
        
        // Image
        doc.image(imgBuffer, 30, 75, { width: maxWidth });
      } catch (err) {
        console.error(`   ⚠️ Could not add ${s.filename} to PDF: ${err.message}`);
      }
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

takeScreenshots();
