import { test, expect } from '@playwright/test';

test('Weekly Schedule: Add Rounds and Family Meeting Availability', async ({ page }) => {
  await page.goto('https://hcmd-stage.hcmdcommunication.com/user/login');
  await page.waitForTimeout(300);

  await page.getByRole('textbox', { name: 'Enter your email' }).fill('nimra@octathorn.com');
  await page.waitForTimeout(300);

  await page.getByRole('textbox', { name: 'Enter your password' }).fill('12345678');
  await page.waitForTimeout(300);

  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(5000);

  await expect(page.getByRole('heading', { name: 'Welcome, Nimra!' })).toBeVisible();
  await page.waitForTimeout(10000);

  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.waitForTimeout(300);

  await expect(page.getByRole('tab', { name: 'Weekly Schedule' })).toBeVisible();
  await page.getByRole('tab', { name: 'Weekly Schedule' }).click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: 'Choose Thursday, July 10th,' }).click();
  await page.waitForTimeout(300);

  await page.locator('.css-8mmkcg').first().click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: 'Physicians (HCMD Providers)' }).click();
  await page.waitForTimeout(300);
  
  await page.locator('.min-width-160 > .select__control > .select__value-container > .select__input-container').click();
  await page.locator('#react-select-4-input').fill('kindred hospital pa');
  await page.getByRole('option', { name: 'Kindred Hospital Paramount' }).click();

  await page.getByRole('textbox', { name: 'Search...' }).fill('andrew');
  await page.waitForTimeout(300);

  await page.getByText('Andrew Hoang').click();
  await page.waitForTimeout(300);

  await page.getByRole('listitem').filter({ hasText: 'Andrew Hoang' }).getByRole('checkbox').check();
  await page.waitForTimeout(300);

  
  await page.getByRole('button', { name: 'Add Rounds Availability' }).click();
  await page.waitForTimeout(300);

  await page.locator('div:nth-child(3) > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: 'Kindred Hospital Paramount' }).click();
  await page.waitForTimeout(300);

  await page.getByText('Facility:option Kindred').click();
  await page.waitForTimeout(300);

  await page.getByRole('textbox', { name: 'Select Date' }).click();
  await page.waitForTimeout(300);

  await page.getByRole('dialog').getByRole('option', { name: 'Choose Friday, July 18th,' }).click();
  await page.waitForTimeout(300);

  await page.locator('.MuiBox-root.css-i3pbo > .css-b62m3t-container > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: 'Daily' }).click();
  await page.waitForTimeout(300);

  await page.locator('div').filter({ hasText: /^Start Time$/ }).getByPlaceholder('Select Time').click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: '10:00 AM' }).click();
  await page.waitForTimeout(300);

  await page.locator('div').filter({ hasText: /^End Time$/ }).getByPlaceholder('Select Time').click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: '10:45 AM' }).click();
  await page.waitForTimeout(300);

  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.waitForTimeout(300);

  //await expect(page.getByText('Submit Sucessfully!', { exact: false })).toBeVisible();
 // await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Add Family Meeting Availability' }).click();
  await page.waitForTimeout(300);

  await page.getByText('Np\'s/Physicians:Andrew').click();
  await page.waitForTimeout(300);

  await page.getByRole('textbox', { name: 'Select Date' }).click();
  await page.waitForTimeout(300);

  await page.getByRole('dialog').getByRole('option', { name: 'Choose Friday, July 18th,' }).click();
  await page.waitForTimeout(300);

  await page.locator('.MuiBox-root.css-i3pbo > .css-b62m3t-container > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: 'Daily' }).click();
  await page.waitForTimeout(300);

  await page.locator('div').filter({ hasText: /^Start Time$/ }).getByPlaceholder('Select Time').click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: '10:30 AM' }).click();
  await page.waitForTimeout(300);

  await page.locator('div').filter({ hasText: /^End Time$/ }).getByPlaceholder('Select Time').click();
  await page.waitForTimeout(300);

  await page.getByRole('option', { name: '12:00 PM' }).click();
  await page.waitForTimeout(300);

  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.waitForTimeout(300);

  await expect(page.getByText('Submit Sucessfully!', { exact: false })).toBeVisible();

  // ✅ Final Assertion
  await expect(page.getByRole('tab', { name: 'Weekly Schedule' })).toBeVisible();
});
