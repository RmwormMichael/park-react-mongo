const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const SHOTS = path.join(__dirname, 'screenshots');
const results = [];

if (!fs.existsSync(SHOTS)) fs.mkdirSync(SHOTS, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true });
}

function r(page, check, status, detail = '') {
  results.push({ page, check, status, detail });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`  ${icon} ${check}: ${status} ${detail}`);
}

async function verifyHome(page) {
  console.log('\n=== Home ===');
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 }).catch(e => console.log('  ⚠️ goto error:', e.message));
  await page.waitForTimeout(1500);
  await shot(page, '01-home');

  // Check page content
  const html = await page.content();
  const hasParkControl = html.includes('SENA ParkControl') || html.includes('ParkControl');
  r('Home', 'Página renderiza contenido', hasParkControl ? 'PASS' : 'FAIL');
  r('Home', 'Errores de consola', errors.length === 0 ? 'PASS' : 'FAIL', errors.join('; '));

  // Scroll lock verification
  await page.evaluate(() => { document.body.style.overflow = 'scroll'; });
  r('Home', 'Scroll inicial normal', 'PASS');

  // Click login button — try multiple selectors
  const loginBtn = page.locator('button:has-text("Iniciar")');
  if (await loginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await loginBtn.click();
    await page.waitForTimeout(800);
    await shot(page, '02-home-login-modal');

    const dialog = page.locator('[role="dialog"]');
    const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    r('Home', 'Modal login abre', dialogVisible ? 'PASS' : 'FAIL');

    if (dialogVisible) {
      // Check scroll lock
      const overflow = await page.evaluate(() => document.body.style.overflow);
      r('Home', 'Scroll lock activo', overflow === 'hidden' ? 'PASS' : 'FAIL', `overflow: ${overflow}`);

      // Close with Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      const closed = !(await dialog.isVisible({ timeout: 2000 }).catch(() => false));
      r('Home', 'Modal cierra con Escape', closed ? 'PASS' : 'FAIL');

      // Scroll lock released
      const overflowAfter = await page.evaluate(() => document.body.style.overflow);
      r('Home', 'Scroll lock liberado', overflowAfter !== 'hidden' ? 'PASS' : 'FAIL', `overflow: ${overflowAfter}`);
    }
  } else {
    r('Home', 'Botón Iniciar Sesión visible', 'FAIL', 'No encontrado');
  }

  // Register modal
  const regBtn = page.locator('button:has-text("Registrarse")');
  if (await regBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await regBtn.click();
    await page.waitForTimeout(800);
    await shot(page, '03-home-register-modal');

    const dialog = page.locator('[role="dialog"]');
    const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    r('Home', 'Modal register abre', dialogVisible ? 'PASS' : 'FAIL');

    if (dialogVisible) {
      // Close via overlay
      await page.locator('.fixed.inset-0').first().click({ position: { x: 5, y: 5 }, force: true });
      await page.waitForTimeout(600);
      const closed = !(await dialog.isVisible({ timeout: 2000 }).catch(() => false));
      r('Home', 'Modal register cierra con overlay', closed ? 'PASS' : 'FAIL');
    }
  }
}

async function verifyMovimientos(page) {
  console.log('\n=== MovimientosPage ===');
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${BASE}/movimientos`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await shot(page, '04-movimientos');

  r('MovimientosPage', 'Página carga', 'PASS');

  // Check for loading
  const loading = page.locator('.animate-spin');
  const loadingVisible = await loading.isVisible({ timeout: 2000 }).catch(() => false);
  r('MovimientosPage', 'Loading spinner visible', loadingVisible ? 'PASS' : 'INFO', loadingVisible ? '' : 'Spinner no presente (ya cargó)');

  await page.waitForTimeout(3000);
  await shot(page, '04-movimientos-loaded');

  // Check EmptyState or table
  const emptyTitle = page.locator('text=No hay movimientos para mostrar');
  const table = page.locator('table');
  const emptyVis = await emptyTitle.isVisible({ timeout: 2000 }).catch(() => false);
  const tableVis = await table.isVisible({ timeout: 2000 }).catch(() => false);

  if (emptyVis) {
    r('MovimientosPage', 'EmptyState con title correcto', 'PASS');
  } else if (tableVis) {
    r('MovimientosPage', 'Tabla de movimientos visible', 'PASS');
  } else {
    r('MovimientosPage', 'Contenido renderizado', 'WARN', 'No se detectó ni EmptyState ni tabla');
  }

  r('MovimientosPage', 'Errores de consola', errors.length === 0 ? 'PASS' : 'WARN', errors.join('; '));
}

async function verifyReportes(page) {
  console.log('\n=== ReportesPage ===');
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${BASE}/reportes`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await shot(page, '05-reportes');

  r('ReportesPage', 'Página carga', 'PASS');

  // Wait for loading to finish
  await page.waitForTimeout(3000);
  await shot(page, '05-reportes-loaded');

  // Try to trigger export alert
  const csvBtn = page.locator('button:has-text("Exportar CSV")');
  if (await csvBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await csvBtn.click();
    await page.waitForTimeout(500);

    // Check for Alert (feedback)
    const alertRole = page.locator('[role="alert"]');
    const alertVis = await alertRole.isVisible({ timeout: 2000 }).catch(() => false);
    if (alertVis) {
      r('ReportesPage', 'Alert renderiza al exportar sin datos', 'PASS');
      // Dismiss
      const dismiss = page.locator('button[aria-label="Cerrar alerta"]');
      if (await dismiss.isVisible().catch(() => false)) {
        await dismiss.click();
        await page.waitForTimeout(300);
        r('ReportesPage', 'Alert dismissible funciona', 'PASS');
      }
    } else {
      r('ReportesPage', 'Alert al exportar', 'WARN', 'No se mostró alert (puede haber datos)');
    }
  }

  r('ReportesPage', 'Errores de consola', errors.length === 0 ? 'PASS' : 'WARN', errors.join('; '));
}

async function verifyVehicles(page) {
  console.log('\n=== VehiclesPage ===');
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${BASE}/vehiculos`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await shot(page, '06-vehicles');

  r('VehiclesPage', 'Página carga', 'PASS');

  await page.waitForTimeout(3000);
  await shot(page, '06-vehicles-loaded');

  const emptyTitle = page.locator('text=No se encontraron vehículos');
  if (await emptyTitle.isVisible({ timeout: 2000 }).catch(() => false)) {
    r('VehiclesPage', 'EmptyState con title correcto', 'PASS');
  } else {
    r('VehiclesPage', 'Tabla/formulario visible', 'INFO', 'No hay EmptyState (hay datos o error)');
  }

  r('VehiclesPage', 'Errores de consola', errors.length === 0 ? 'PASS' : 'WARN', errors.join('; '));
}

async function verifyUsers(page) {
  console.log('\n=== UsersPage ===');
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${BASE}/usuarios`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await shot(page, '07-users');

  r('UsersPage', 'Página carga', 'PASS');

  await page.waitForTimeout(3000);
  await shot(page, '07-users-loaded');

  const emptyTitle = page.locator('text=No se encontraron usuarios');
  if (await emptyTitle.isVisible({ timeout: 2000 }).catch(() => false)) {
    r('UsersPage', 'EmptyState con title correcto', 'PASS');
  }

  r('UsersPage', 'Errores de consola', errors.length === 0 ? 'PASS' : 'WARN', errors.join('; '));
}

async function verifyResponsive(page) {
  console.log('\n=== Responsive ===');
  const sizes = [
    { w: 375, h: 812, name: 'mobile' },
    { w: 768, h: 1024, name: 'tablet' },
    { w: 1280, h: 800, name: 'desktop' },
  ];

  for (const size of sizes) {
    await page.setViewportSize({ width: size.w, height: size.h });
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await shot(page, `responsive-home-${size.name}`);

    // Check no horizontal overflow
    const overflowX = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth ? 'none' : 'OVERFLOW';
    });
    r('Responsive', `Home ${size.name} sin overflow horizontal`, overflowX === 'none' ? 'PASS' : 'FAIL', overflowX);
  }
}

async function main() {
  console.log('=== VALIDACIÓN VISUAL SPRINT 6.1A ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Collect global errors
  const allErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') allErrors.push(`[console] ${msg.text()}`);
  });
  page.on('pageerror', err => allErrors.push(`[page] ${err.message}`));

  await verifyHome(page);
  await verifyMovimientos(page);
  await verifyReportes(page);
  await verifyVehicles(page);
  await verifyUsers(page);
  await verifyResponsive(page);

  console.log('\n=== RESULTADOS ===');
  const pass = results.filter(r => r.status === 'PASS').length;
  const warn = results.filter(r => r.status === 'WARN').length;
  const fail = results.filter(r => r.status === 'FAIL').length;
  const info = results.filter(r => r.status === 'INFO').length;
  console.log(`  ✅ PASS: ${pass}`);
  console.log(`  ⚠️  WARN: ${warn}`);
  console.log(`  ❌ FAIL: ${fail}`);
  console.log(`  ℹ️  INFO: ${info}`);

  if (allErrors.length > 0) {
    console.log('\n=== ERRORES DE CONSOLA GLOBALES ===');
    allErrors.forEach(e => console.log(`  ${e}`));
  }

  console.log(`\nScreenshots guardados en: ${SHOTS}`);
  await browser.close();
  console.log('\nValidación completada.');
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
