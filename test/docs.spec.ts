import { expect, test } from '@playwright/test';

test('homepage and direct docs loads render without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Your browser data. Under lock.' })).toBeVisible();
  await page.getByRole('link', { name: 'Read the docs', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Quick start', exact: true })).toBeVisible();
  await page.goto('/docs/next/api');
  await expect(page.getByRole('heading', { name: '1.0 API preview', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('search works from the exported index and Escape closes it', async ({ page }) => {
  await page.goto('/docs/introduction');
  await page
    .getByRole('button', { name: /search/i })
    .first()
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox', { name: 'Search' }).fill('fingerprint');
  await expect(
    dialog.getByRole('option', { name: 'Documentation Security and limitations', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await page
    .getByRole('button', { name: /search/i })
    .first()
    .click();
  await dialog.getByRole('combobox', { name: 'Search' }).fill('fingerprint');
  await expect(dialog.getByRole('option').first()).toContainText('Security and limitations');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Security and limitations', exact: true }),
  ).toBeVisible();
});

test('legacy URLs redirect and missing pages have a real 404', async ({ request }) => {
  const redirect = await request.get('/docs/guides/framework-integration', { maxRedirects: 0 });
  expect(redirect.status()).toBe(301);
  expect(redirect.headers().location).toContain('/docs/guides/framework-guide');
  expect((await request.get('/missing-documentation-page')).status()).toBe(404);
  expect((await request.get('/docs/not-a-page')).status()).toBe(404);
});

test('installation tabs switch commands and remember the package manager', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/docs/getting-started/installation-guide');
  for (const [manager, command] of [
    ['npm', 'npm install'],
    ['pnpm', 'pnpm add'],
    ['Bun', 'bun add'],
  ]) {
    await page.getByRole('tab', { name: manager, exact: true }).first().click();
    await expect(page.getByRole('tabpanel').nth(0)).toContainText(`${command} bvault-js@0.3.4`);
    await expect(page.getByRole('tabpanel').nth(1)).toContainText(`${command} bvault-js@preview`);
  }
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Bun', selected: true })).toHaveCount(2);
  await page.getByRole('link', { name: 'preview quick start', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Bun', selected: true })).toHaveCount(2);
  await expect(page.getByRole('tabpanel').nth(0)).toContainText('bun add bvault-js@preview');
  await expect(page.getByRole('tabpanel').nth(1)).toContainText(
    'bun add bvault-js@1.0.0-preview.1',
  );
  await page.getByRole('tab', { name: 'npm', exact: true }).first().focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('tab', { name: 'pnpm', selected: true })).toHaveCount(2);
  await expect(page.getByRole('tabpanel').nth(1)).toContainText(
    'pnpm add bvault-js@1.0.0-preview.1',
  );
  expect(errors).toEqual([]);
});
