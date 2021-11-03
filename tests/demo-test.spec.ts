import { expect, test } from '@playwright/test';
import { BASE_URL } from '../playwright.config';


test('basic test 3', async ({ page }) => {
  await page.goto(BASE_URL + '/resources');
  expect(page.url()).toContain('/resources');
  await page.waitForResponse((resp) => {
    // expect(resp.url()).toContain('/resources/tezedge');
    expect(resp.status()).toBe(200);
    return true;
  });
  console.log(BASE_URL);
});
