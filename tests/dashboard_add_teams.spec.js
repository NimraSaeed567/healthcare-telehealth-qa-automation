import { test, expect } from '@playwright/test';

test('Manage Team: add and delete', async ({ page }) => {
  // Login
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

  // Navigate to Dashboard and open “Add Team”
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.waitForTimeout(300);

  await page.getByRole('button', { name: 'Add Team' }).click();
  await page.waitForTimeout(300);

  // Fill in team name
  await page.getByRole('textbox', { name: 'Enter name' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('textbox', { name: 'Enter name' }).fill('Testing Team');
  await page.waitForTimeout(300);

  // Add meeting link
  await page.getByRole('button', { name: 'Add Meeting' }).click();
  await page.waitForTimeout(300);

  await page.getByRole('textbox', { name: 'Meeting Link' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('textbox', { name: 'Meeting Link' }).fill('https://hcmd-stage.hcmdcommunication.com/dashboard/teams');
  await page.waitForTimeout(300);

  // Submit new team
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(300);
  await expect(page.getByText('Successfully done', { exact: false })).toBeVisible();
  await page.waitForTimeout(300);

  // Close add-team confirmation
  await page.locator('div:nth-child(9) > .whitelight > .card > .d-flex.justify-content-center.gap-6 > .MuiButtonBase-root.MuiIconButton-colorPrimary').click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Close' }).click();
  await page.waitForTimeout(300);

  // Delete the newly created team
  await page.locator('div:nth-child(9) > .whitelight > .card > .d-flex.justify-content-center.gap-6 > .MuiButtonBase-root.MuiIconButton-colorSecondary').click();
  await page.waitForTimeout(300);

  await expect(page.getByText('Are you sure about to delete', { exact: false })).toBeVisible();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(3000);

  // Final assertion: “Testing Team” card should no longer be present
  await expect(page.getByText('Testing Team')).toHaveCount(0);

  // Ensure we're back on the Dashboard
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
