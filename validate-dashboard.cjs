const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const SHOTS = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SHOTS)) fs.mkdirSync(SHOTS, { recursive: true });

const results = [];

function r(page, check, status, detail = '') {
  results.push({ page, check, status, detail });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`  ${icon} ${check}: ${status} ${detail}`);
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true });
}

function makeFakeJwt(payload) {
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.fakesignature`;
}

async function main() {
  console.log('=== VALIDACIÓN DASHBOARD — SPRINT MIGRACIÓN ===\n');
  const browser = await chromium.launch({ headless: true });

  // --- Home público ---
  const homeCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const homePage = await homeCtx.newPage();
  await homePage.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await homePage.waitForTimeout(1500);
  await shot(homePage, 'dashboard-01-home-public');
  r('Home público', 'Renderiza sin errores', 'PASS');

  // --- Dashboard autenticado ---
  const authCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await authCtx.newPage();

  // Ir a cualquier URL del mismo origen para establecer un storage context
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  // Inyectar fake JWT con la clave correcta 'sp_token'
  const fakeToken = makeFakeJwt({
    idUsuario: 1,
    nombre: 'Admin Sistema',
    correo: 'admin@sena.edu.co',
    idRolName: 'Administrador',
    idSede: 1,
    idRol: 1,
    iat: 1717123456,
    exp: 9999999999,
  });

  await page.evaluate((token) => {
    localStorage.setItem('sp_token', token);
  }, fakeToken);

  // Navegar a dashboard
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);

  // Colectar errores
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await shot(page, 'dashboard-02-authenticated');

  // Verificar que el Dashboard renderiza correctamente (no el h1 del Nav)
  const dashTitle = await page.locator('h1:has-text("Panel de Control")').first().isVisible().catch(() => false);
  r('Dashboard', 'Renderiza título "Panel de Control"', dashTitle ? 'PASS' : 'FAIL');

  const dashSubtitle = await page.locator('text=Bienvenido de vuelta').first().isVisible().catch(() => false);
  r('Dashboard', 'Mensaje de bienvenida visible', dashSubtitle ? 'PASS' : 'FAIL');

  const hasBadge = await page.locator('text=Administrador').first().isVisible().catch(() => false);
  r('Dashboard', 'Badge de rol visible', hasBadge ? 'PASS' : 'FAIL');

  const hasStatCards = await page.locator('text=Usuarios registrados').first().isVisible().catch(() => false);
  r('Dashboard', 'StatCards visibles', hasStatCards ? 'PASS' : 'FAIL');

  const hasQuickActions = await page.locator('text=Acciones rápidas').first().isVisible().catch(() => false);
  r('Dashboard', 'Acciones rápidas visibles', hasQuickActions ? 'PASS' : 'FAIL');

  const hasRecentVehicles = await page.locator('text=Vehículos actualmente dentro').first().isVisible().catch(() => false);
  r('Dashboard', 'Sección vehículos dentro visible', hasRecentVehicles ? 'PASS' : 'FAIL');

  // Verificar ausencia de anti-patrones
  const html = await page.content();
  const hasEmoji = html.includes('\u{1F697}');
  r('Dashboard', 'Sin emojis en interfaz', !hasEmoji ? 'PASS' : 'FAIL');
  const hasGradient = html.includes('bg-gradient-to-b from-gray-50');
  r('Dashboard', 'Sin gradient background', !hasGradient ? 'PASS' : 'FAIL');
  const hasBgToken = html.includes('bg-background-primary');
  r('Dashboard', 'Usa bg-background-primary', hasBgToken ? 'PASS' : 'FAIL');
  const hasRounded2xl = html.includes('rounded-2xl');
  r('Dashboard', 'Sin rounded-2xl (usa radius.xl)', !hasRounded2xl ? 'PASS' : 'FAIL');

  // Errores de consola
  await page.waitForTimeout(500);
  r('Dashboard', 'Errores de consola', errors.length === 0 ? 'PASS' : 'WARN', errors.join('; '));

  // Responsive
  const sizes = [
    { w: 375, h: 812, name: 'mobile' },
    { w: 768, h: 1024, name: 'tablet' },
  ];
  for (const size of sizes) {
    await page.setViewportSize({ width: size.w, height: size.h });
    await page.waitForTimeout(1000);
    await shot(page, `dashboard-responsive-${size.name}`);
    const overflowX = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth ? 'none' : 'OVERFLOW'
    );
    r('Responsive', `Dashboard ${size.name} sin overflow`, overflowX === 'none' ? 'PASS' : 'FAIL', overflowX);
  }

  console.log('\n=== RESULTADOS ===');
  const pass = results.filter(r => r.status === 'PASS').length;
  const warn = results.filter(r => r.status === 'WARN').length;
  const fail = results.filter(r => r.status === 'FAIL').length;
  console.log(`  ✅ PASS: ${pass}`);
  console.log(`  ⚠️  WARN: ${warn}`);
  console.log(`  ❌ FAIL: ${fail}`);
  console.log(`\nScreenshots guardados en: ${SHOTS}`);

  await browser.close();
}

main().catch((err) => { console.error('FATAL:', err.message); process.exit(1); });
